import type { DownloadResponse, Provider } from "../types";

/**
 * RapidAPI Instagram downloader provider:
 *   GET <RAPIDAPI_URL> with the Reel URL as ?url=
 *   Headers: X-RapidAPI-Key, X-RapidAPI-Host
 */

const PROVIDER_TIMEOUT_MS = 15_000;

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

async function extract(url: string): Promise<DownloadResponse> {
  const apiUrl = env("RAPIDAPI_URL");
  const apiKey = env("RAPIDAPI_KEY");
  const apiHost = env("RAPIDAPI_HOST");

  if (!apiUrl || !apiKey || !apiHost) {
    return {
      success: false,
      error: {
        code: "NOT_CONFIGURED",
        message: "Download service is not configured yet.",
      },
    };
  }

  const target = apiUrl.includes("{url}")
    ? apiUrl.replace("{url}", encodeURIComponent(url))
    : apiUrl;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(target, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": apiHost,
      },
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

  const body = (await res.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;

  if (res.status === 401 || res.status === 403) {
    return {
      success: false,
      error: {
        code: "AUTH",
        message: "The download service rejected its API key.",
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
        message: "The download service failed to process this Reel.",
      },
    };
  }

  // RapidAPI responses vary; look for common download-link keys.
  const candidates = ["link", "download_link", "url", "video_url"];
  let videoUrl: string | null = null;
  for (const key of candidates) {
    const v = body?.[key];
    if (typeof v === "string" && v.startsWith("http")) {
      videoUrl = v;
      break;
    }
  }

  if (!videoUrl) {
    return {
      success: false,
      error: {
        code: "PROVIDER_ERROR",
        message: "The provider returned no video for this Reel.",
      },
    };
  }

  const thumb = body?.["thumbnail"] ?? body?.["thumb"];
  const title = body?.["title"] ?? body?.["caption"];

  return {
    success: true,
    data: {
      videoUrl,
      thumbnailUrl: typeof thumb === "string" ? thumb : null,
      caption: typeof title === "string" ? title : null,
      author: null,
      durationSeconds: null,
      quality: null,
    },
  };
}

export const rapidapiProvider: Provider = {
  name: "rapidapi",
  isConfigured() {
    return Boolean(
      env("RAPIDAPI_URL") && env("RAPIDAPI_KEY") && env("RAPIDAPI_HOST"),
    );
  },
  extract,
};
