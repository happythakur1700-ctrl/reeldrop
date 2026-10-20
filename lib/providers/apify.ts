import type { DownloadResponse, Provider } from "../types";

/**
 * Apify provider using the snapinsta~instagram-downloader-api actor
 * (https://apify.com/snapinsta/instagram-downloader-api).
 *
 *   POST https://api.apify.com/v2/acts/snapinsta~instagram-downloader-api/run-sync-get-dataset-items?token=<APIFY_API_TOKEN>
 *   Body: { "url": "<reel url>" }
 *   Response: [{ status, sourceUrl, media: [{ url, thumbnail, fileType }] }]
 *
 * Requires APIFY_API_TOKEN. run-sync blocks until the run finishes, so the
 * timeout is generous (30s).
 */

const ACTOR_RUN_URL =
  "https://api.apify.com/v2/acts/snapinsta~instagram-downloader-api/run-sync-get-dataset-items";
const PROVIDER_TIMEOUT_MS = 30_000;

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

type ApifyItem = {
  status?: boolean;
  sourceUrl?: string;
  media?: {
    url?: string;
    thumbnail?: string | null;
    fileType?: string | null;
  }[];
};

async function extract(url: string): Promise<DownloadResponse> {
  const token = env("APIFY_API_TOKEN");
  if (!token) {
    return {
      success: false,
      error: {
        code: "NOT_CONFIGURED",
        message:
          "APIFY_API_TOKEN is not set — add it as a Worker secret, then redeploy.",
      },
    };
  }

  const target = `${ACTOR_RUN_URL}?token=${encodeURIComponent(token)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      cache: "no-store",
      signal: controller.signal,
    });
  } catch {
    return {
      success: false,
      error: {
        code: "UNREACHABLE",
        message:
          "The download service is unreachable right now. Please try again shortly.",
      },
    };
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 401 || res.status === 403) {
    return {
      success: false,
      error: {
        code: "AUTH",
        message: "The download service rejected its API token.",
      },
    };
  }
  if (res.status === 429) {
    return {
      success: false,
      error: {
        code: "RATE_LIMITED",
        message:
          "The download service is rate limited right now. Please try again in a moment.",
      },
    };
  }
  if (res.status === 410 || res.status === 404) {
    return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Reel not found — it may have been deleted.",
      },
    };
  }
  if (!res.ok) {
    return {
      success: false,
      error: {
        code: "PROVIDER_ERROR",
        message: "The download service failed to process this Reel.",
      },
    };
  }

  const body = (await res.json().catch(() => null)) as ApifyItem[] | null;
  const item = Array.isArray(body) ? body[0] : null;

  if (!item || item.status === false) {
    return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message:
          "Reel not found — it may be deleted, private, or age-gated.",
      },
    };
  }

  const video = item.media?.find(
    (m) => typeof m.url === "string" && m.url.startsWith("http"),
  );

  if (!video?.url) {
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
      videoUrl: video.url,
      thumbnailUrl:
        typeof video.thumbnail === "string" ? video.thumbnail : null,
      caption: null,
      author: null,
      durationSeconds: null,
      quality: null,
    },
  };
}

export const apifyProvider: Provider = {
  name: "apify",
  isConfigured() {
    return Boolean(env("APIFY_API_TOKEN"));
  },
  extract,
};
