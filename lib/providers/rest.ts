import type { DownloadResponse, Provider } from "../types";

/**
 * Generic key-less REST provider, shaped for insta-reel-api style services:
 *   GET <INSTAGRAM_API_URL> with {url} replaced by the Reel URL
 *   Response: { download_link, title, thumbnail }
 *
 * A key is optional (INSTAGRAM_API_KEY); when set it is sent as
 * X-API-Key. Error mapping: 401 -> auth, 404 -> not found,
 * 429 -> rate limited, 5xx -> provider error.
 */

const PROVIDER_TIMEOUT_MS = 15_000;

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

async function extract(url: string): Promise<DownloadResponse> {
  const template = env("INSTAGRAM_API_URL");
  if (!template) {
    return {
      success: false,
      error: {
        code: "NOT_CONFIGURED",
        message: "Download service is not configured yet.",
      },
    };
  }

  const target = template.includes("{url}")
    ? template.replace("{url}", encodeURIComponent(url))
    : `${template}${encodeURIComponent(url)}`;

  const headers: Record<string, string> = { Accept: "application/json" };
  const key = env("INSTAGRAM_API_KEY");
  if (key) headers["X-API-Key"] = key;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(target, { headers, cache: "no-store", signal: controller.signal });
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

  const body = (await res.json().catch(() => null)) as {
    download_link?: string;
    title?: string;
    thumbnail?: string;
    error?: string;
  } | null;

  if (res.status === 401) {
    return {
      success: false,
      error: {
        code: "AUTH",
        message: "The download service rejected its API key.",
      },
    };
  }
  if (res.status === 404) {
    return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Reel not found — it may have been deleted.",
      },
    };
  }
  if (res.status === 429) {
    return {
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: "The download service is rate limited. Try again in a moment.",
      },
    };
  }
  if (!res.ok) {
    return {
      success: false,
      error: {
        code: "PROVIDER_ERROR",
        message:
          body?.error ??
          "The download service failed to process this Reel.",
      },
    };
  }

  if (!body?.download_link) {
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
      videoUrl: body.download_link,
      thumbnailUrl: body.thumbnail ?? null,
      caption: body.title ?? null,
      author: null,
      durationSeconds: null,
      quality: null,
    },
  };
}

export const restProvider: Provider = {
  name: "rest",
  isConfigured() {
    return Boolean(env("INSTAGRAM_API_URL"));
  },
  extract,
};
