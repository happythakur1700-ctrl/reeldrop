import type { DownloadResponse, Provider } from "../types";
import { instagrapiProvider } from "./instagrapi";
import { restProvider } from "./rest";
import { rapidapiProvider } from "./rapidapi";

/** Provider order: instagrapi first, then generic REST, then RapidAPI. */
const providers: Provider[] = [
  instagrapiProvider,
  restProvider,
  rapidapiProvider,
];

export async function extractReel(url: string): Promise<DownloadResponse> {
  const configured = providers.filter((p) => p.isConfigured());

  if (configured.length === 0) {
    return {
      success: false,
      error: {
        code: "NOT_CONFIGURED",
        message: "Download service is not configured yet.",
      },
    };
  }

  let lastError: DownloadResponse | null = null;
  for (const provider of configured) {
    const result = await provider.extract(url);
    if (result.success) return result;
    // Not-configured / auth errors from one provider shouldn't block others.
    lastError = result;
    if (
      result.error.code !== "NOT_CONFIGURED" &&
      result.error.code !== "AUTH"
    ) {
      return result;
    }
  }

  return (
    lastError ?? {
      success: false,
      error: {
        code: "NOT_CONFIGURED",
        message: "Download service is not configured yet.",
      },
    }
  );
}
