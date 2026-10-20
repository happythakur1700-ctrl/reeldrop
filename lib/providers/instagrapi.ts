import type { DownloadResponse, Provider } from "../types";

/**
 * Provider for aiograpi-rest — the official REST wrapper around instagrapi
 * (github.com/subzeroid/instagrapi). Docker image: subzeroid/aiograpi-rest
 *
 * Endpoints (from the wrapper's source):
 *   GET  /media?url=<reel_url>   with X-Session-ID header
 *   POST /auth/login             { username, password } -> { session_id }
 *
 * Auth: INSTAGRAPI_SESSION_ID directly, or INSTAGRAPI_USERNAME +
 * INSTAGRAPI_PASSWORD (session fetched via login, cached in memory,
 * re-fetched once on 401).
 */

const PROVIDER_TIMEOUT_MS = 15_000;

type AioGrapiMedia = {
  pk?: string;
  video_url?: string;
  thumbnail_url?: string;
  image_versions2?: { candidates?: { width: number; height: number }[] };
  original_height?: number;
  original_width?: number;
  video_duration?: number;
  caption?: { text?: string } | null;
  user?: { username?: string; full_name?: string };
};

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

function baseUrl(): string | undefined {
  return env("INSTAGRAPI_URL")?.replace(/\/+$/, "");
}

// Session cache for username/password login
let cachedSessionId: string | null = null;

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function getSessionId(): Promise<string | null> {
  const direct = env("INSTAGRAPI_SESSION_ID");
  if (direct) return direct;

  const username = env("INSTAGRAPI_USERNAME");
  const password = env("INSTAGRAPI_PASSWORD");
  const base = baseUrl();
  if (!username || !password || !base) return null;

  if (cachedSessionId) return cachedSessionId;

  const res = await fetchWithTimeout(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const body = (await res.json().catch(() => null)) as {
    session_id?: string;
  } | null;
  if (body?.session_id) {
    cachedSessionId = body.session_id;
    return body.session_id;
  }
  return null;
}

/** Map pixel height to a standard quality label. */
function qualityLabel(media: AioGrapiMedia): string | null {
  const h =
    media.original_height ??
    media.image_versions2?.candidates?.[0]?.height ??
    null;
  if (!h) return null;
  if (h >= 1900) return "4K";
  if (h >= 1200) return "1080p";
  if (h >= 700) return "720p";
  if (h >= 400) return "480p";
  return null;
}

function mapMedia(media: AioGrapiMedia): DownloadResponse {
  if (!media.video_url) {
    return {
      success: false,
      error: {
        code: "PROVIDER_ERROR",
        message: "The provider returned no video for this Reel.",
      },
    };
  }
  return {
    success: true,
    data: {
      videoUrl: media.video_url,
      thumbnailUrl: media.thumbnail_url ?? null,
      caption: media.caption?.text ?? null,
      author: media.user?.username ?? media.user?.full_name ?? null,
      durationSeconds:
        typeof media.video_duration === "number" && media.video_duration > 0
          ? media.video_duration
          : null,
      quality: qualityLabel(media),
    },
  };
}

function mapError(status: number, detail: string | undefined): DownloadResponse {
  if (status === 401) {
    return {
      success: false,
      error: {
        code: "AUTH",
        message:
          "The download service rejected its credentials. Check the provider session and retry.",
      },
    };
  }
  if (status === 403) {
    return {
      success: false,
      error: {
        code: "PRIVATE",
        message: "This Reel is private or restricted — it can't be processed.",
      },
    };
  }
  if (status === 404) {
    return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Reel not found — it may have been deleted or the link is wrong.",
      },
    };
  }
  if (status === 429) {
    return {
      success: false,
      error: {
        code: "RATE_LIMITED",
        message:
          "The download service is rate limited right now. Please try again in a moment.",
      },
    };
  }
  return {
    success: false,
    error: {
      code: "PROVIDER_ERROR",
      message: detail
        ? `The download service failed: ${detail}`
        : "The download service failed to process this Reel.",
    },
  };
}

async function extract(url: string): Promise<DownloadResponse> {
  const base = baseUrl();
  if (!base) {
    return {
      success: false,
      error: {
        code: "NOT_CONFIGURED",
        message:
          "INSTAGRAPI_URL is not set — add it in Vercel → Settings → Environment Variables, then redeploy.",
      },
    };
  }

  const sessionId = await getSessionId();
  if (!sessionId) {
    return {
      success: false,
      error: {
        code: "NOT_CONFIGURED",
        message:
          "INSTAGRAPI_SESSION_ID is not set — add it in Vercel → Settings → Environment Variables, then redeploy.",
      },
    };
  }

  let res = await fetchWithTimeout(
    `${base}/media?url=${encodeURIComponent(url)}`,
    {
      headers: { "X-Session-ID": sessionId },
      cache: "no-store",
    },
  );

  // Auto re-login once on 401 when using username/password auth
  if (res.status === 401 && !env("INSTAGRAPI_SESSION_ID")) {
    cachedSessionId = null;
    const fresh = await getSessionId();
    if (fresh) {
      res = await fetchWithTimeout(
        `${base}/media?url=${encodeURIComponent(url)}`,
        {
          headers: { "X-Session-ID": fresh },
          cache: "no-store",
        },
      );
    }
  }

  const body = (await res.json().catch(() => null)) as {
    detail?: string;
    media?: AioGrapiMedia;
  } | null;

  if (!res.ok) {
    return mapError(res.status, body?.detail);
  }

  const media = body?.media ?? (body as AioGrapiMedia | null);
  if (!media || typeof media !== "object") {
    return mapError(res.status, body?.detail);
  }
  return mapMedia(media);
}

export const instagrapiProvider: Provider = {
  name: "instagrapi",
  isConfigured() {
    return Boolean(
      baseUrl() &&
        (env("INSTAGRAPI_SESSION_ID") ||
          (env("INSTAGRAPI_USERNAME") && env("INSTAGRAPI_PASSWORD"))),
    );
  },
  extract,
};
