"use client";

import { useRef, useState } from "react";
import type { DownloadResponse } from "@/lib/types";

function ClipboardPasteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[18px]"
      aria-hidden="true"
    >
      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
      <path d="M16 4h2a2 2 0 0 1 2 2v2" />
      <path d="M11 14h10" />
      <rect width="8" height="8" x="16" y="2" rx="1" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Status = "idle" | "loading" | "done" | "error";

export function Downloader() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<DownloadResponse | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const valid = /^https?:\/\/(?:www\.|m\.)?instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(?:reel|reels|p)\/[A-Za-z0-9_-]+/i.test(
    url.trim(),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || status === "loading") return;

    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const body = (await res.json()) as DownloadResponse;
      setResult(body);
      setStatus(body.success ? "done" : "error");
    } catch {
      setResult({
        success: false,
        error: {
          code: "UNREACHABLE",
          message: "Network error — check your connection and try again.",
        },
      });
      setStatus("error");
    }
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      /* clipboard permission denied */
    }
  }

  return (
    <div>
      <form ref={formRef} onSubmit={onSubmit} noValidate>
        <div className="relative">
          <input
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="Paste Instagram Reel URL"
            aria-label="Instagram Reel URL"
            aria-invalid={status === "error" && !valid}
            className="h-13 w-full rounded-lg border border-line bg-ink pl-4 pr-12 text-[15px] text-white placeholder:text-white/30 transition-colors focus:border-accent focus:outline-none disabled:opacity-50 min-h-[52px]"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={status === "loading"}
          />
          <button
            type="button"
            aria-label="Paste from clipboard"
            title="Paste from clipboard"
            onClick={pasteFromClipboard}
            className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-white/45 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
            disabled={status === "loading"}
          >
            <ClipboardPasteIcon />
          </button>
        </div>

        <button
          type="submit"
          disabled={!valid || status === "loading"}
          className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-3 via-accent to-accent-2 px-7 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100 disabled:active:scale-100"
        >
          <DownloadIcon />
          {status === "loading" ? "Fetching…" : "Download"}
        </button>
      </form>

      {status === "loading" && (
        <div className="mt-4 overflow-hidden rounded-full border border-line" aria-live="polite">
          <div className="progress-slice h-1 w-full" />
        </div>
      )}

      {status === "error" && result && !result.success && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-4 py-3"
        >
          <p className="text-sm leading-relaxed text-danger-fg">
            {result.error.message}
          </p>
        </div>
      )}

      {status === "done" && result?.success && (
        <article
          className="mt-6 overflow-hidden rounded-xl border border-line bg-panel"
          aria-live="polite"
        >
          {result.data.thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.data.thumbnailUrl}
              alt={result.data.caption ?? "Reel thumbnail"}
              className="aspect-[9/16] w-full object-cover md:aspect-auto md:h-44"
            />
          )}
          <div className="p-5">
            {result.data.author && (
              <p className="text-sm font-medium text-white/85">
                @{result.data.author}
              </p>
            )}
            {result.data.caption && (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/55">
                {result.data.caption}
              </p>
            )}
            {(result.data.durationSeconds || result.data.quality) && (
              <p className="mt-3 flex items-center gap-3 text-xs text-white/45">
                {result.data.durationSeconds && (
                  <span>{formatDuration(result.data.durationSeconds)}</span>
                )}
                {result.data.quality && (
                  <span className="rounded border border-line px-1.5 py-0.5">
                    {result.data.quality}
                  </span>
                )}
              </p>
            )}
            <a
              href={result.data.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="mt-4 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-3 via-accent to-accent-2 px-7 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <DownloadIcon />
              Download MP4
            </a>
          </div>
        </article>
      )}
    </div>
  );
}
