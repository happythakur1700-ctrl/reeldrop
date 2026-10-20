export type DownloadResult = {
  success: true;
  data: {
    videoUrl: string;
    thumbnailUrl: string | null;
    caption: string | null;
    author: string | null;
    durationSeconds: number | null;
    quality: string | null;
  };
};

export type ErrorCode =
  | "INVALID_URL"
  | "NOT_FOUND"
  | "PRIVATE"
  | "AUTH"
  | "RATE_LIMITED"
  | "PROVIDER_ERROR"
  | "NOT_CONFIGURED"
  | "UNREACHABLE";

export type DownloadError = {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
};

export type DownloadResponse = DownloadResult | DownloadError;

export type Provider = {
  name: string;
  isConfigured(): boolean;
  extract(url: string): Promise<DownloadResponse>;
};

/** Instagram Reel URL: instagram.com/reel/<id>, /reels/<id>, /p/<id> */
const REEL_URL =
  /^https?:\/\/(?:www\.|m\.)?instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(?:reel|reels|p)\/[A-Za-z0-9_-]+\/?/i;

export function isValidInstagramUrl(raw: string): boolean {
  return REEL_URL.test(raw.trim());
}
