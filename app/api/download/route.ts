import { NextRequest, NextResponse } from "next/server";
import { isValidInstagramUrl } from "@/lib/types";
import { extractReel } from "@/lib/providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_BY_CODE: Record<string, number> = {
  INVALID_URL: 400,
  NOT_FOUND: 404,
  PRIVATE: 403,
  AUTH: 502,
  RATE_LIMITED: 429,
  PROVIDER_ERROR: 502,
  NOT_CONFIGURED: 503,
  UNREACHABLE: 504,
};

export async function POST(request: NextRequest) {
  let url: string | undefined;
  try {
    const body = (await request.json()) as { url?: string };
    url = body.url;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_URL",
          message: "That doesn't look like an Instagram link.",
        },
      },
      { status: 400 },
    );
  }

  if (!url || !isValidInstagramUrl(url)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_URL",
          message: "That doesn't look like an Instagram link.",
        },
      },
      { status: 400 },
    );
  }

  const result = await extractReel(url);
  const status = result.success ? 200 : (STATUS_BY_CODE[result.error.code] ?? 502);
  return NextResponse.json(result, { status });
}
