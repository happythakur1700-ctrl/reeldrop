"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

function CloseIcon() {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function RetryIcon() {
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
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function ExternalIcon() {
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
      className="size-3.5"
      aria-hidden="true"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function SpinnerIcon() {
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
      className="spinner size-4"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const REEL_URL_RE =
  /^https?:\/\/(?:www\.|m\.)?instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(?:reel|reels|p)\/[A-Za-z0-9_-]+/i;

type Status = "idle" | "loading" | "done" | "error";

export function Downloader() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<DownloadResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const valid = REEL_URL_RE.test(url.trim());

  const submit = useCallback(
    async (rawUrl: string) => {
      const trimmed = rawUrl.trim();
      if (!REEL_URL_RE.test(trimmed) || status === "loading") return;

      setStatus("loading");
      setResult(null);
      try {
        const res = await fetch("/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: trimmed }),
        });
        const body = (await res.json()) as DownloadResponse;
        setResult(body);
        setStatus(body.success ? "done" : "error");
      } catch {
        setResult({
          success: false,
          error: {
            code: "UNREACHABLE",
            message:
              "Network error — check your connection and try again.",
          },
        });
        setStatus("error");
      }
    },
    [status],
  );

  // Global Ctrl+V pastes straight into the box — no click needed.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "v" &&
        document.activeElement !== inputRef.current
      ) {
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Pasting a valid link into the input fetches immediately.
  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").trim();
    if (REEL_URL_RE.test(text)) {
      e.preventDefault();
      setUrl(text);
      void submit(text);
    }
  }

  async function pasteFromClipboard() {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (text) {
        setUrl(text);
        if (REEL_URL_RE.test(text)) void submit(text);
      }
    } catch {
      inputRef.current?.focus();
    }
  }

  function reset() {
    setUrl("");
    setResult(null);
    setStatus("idle");
    inputRef.current?.focus();
  }

  const busy = status === "loading";

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit(url);
        }}
        noValidate
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="Paste Instagram Reel URL"
            aria-label="Instagram Reel URL"
            aria-invalid={status === "error" && !valid}
            className="min-h-[52px] w-full rounded-lg border border-line bg-ink pl-4 pr-24 text-[15px] text-white transition-colors placeholder:text-white/30 focus:border-accent focus:outline-none disabled:opacity-50"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onPaste={onPaste}
            disabled={busy}
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {url && !busy && (
              <button
                type="button"
                aria-label="Clear"
                title="Clear"
                onClick={reset}
                className="inline-flex size-9 items-center justify-center rounded-md text-white/45 transition-colors hover:bg-white/10 hover:text-white"
              >
                <CloseIcon />
              </button>
            )}
            <button
              type="button"
              aria-label="Paste from clipboard"
              title="Paste from clipboard"
              onClick={pasteFromClipboard}
              className="inline-flex size-9 items-center justify-center rounded-md text-white/45 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
              disabled={busy}
            >
              <ClipboardPasteIcon />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!valid || busy}
          className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-3 via-accent to-accent-2 px-7 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100 disabled:active:scale-100"
        >
          {busy ? <SpinnerIcon /> : <DownloadIcon />}
          {busy ? "Fetching…" : "Download"}
        </button>
      </form>

      {busy && (
        <div
          className="mt-6 overflow-hidden rounded-xl border border-line bg-panel"
          aria-live="polite"
        >
          <div className="progress-slice h-1 w-full" />
          <div className="flex items-center gap-4 p-5">
            <div className="h-20 w-14 shrink-0 animate-pulse rounded-md bg-white/10" />
            <div className="flex-1 space-y-2.5">
              <div className="h-3.5 w-1/3 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        </div>
      )}

      {status === "error" && result && !result.success && (
        <div
          role="alert"
          className="fade-up mt-4 flex items-start justify-between gap-3 rounded-lg border border-danger-border bg-danger-bg px-4 py-3"
        >
          <p className="text-sm leading-relaxed text-danger-fg">
            {result.error.message}
          </p>
          <button
            type="button"
            onClick={() => void submit(url)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-danger-border px-2.5 py-1.5 text-xs font-medium text-danger-fg transition-colors hover:bg-danger-border"
          >
            <RetryIcon />
            Retry
          </button>
        </div>
      )}

      {status === "done" && result?.success && (
        <article
          className="fade-up mt-6 overflow-hidden rounded-xl border border-line bg-panel"
          aria-live="polite"
        >
          {result.data.videoUrl && (
            <video
              src={result.data.videoUrl}
              poster={result.data.thumbnailUrl ?? undefined}
              controls
              preload="metadata"
              playsInline
              className="aspect-[9/16] max-h-[520px] w-full bg-black object-contain md:aspect-video md:max-h-none"
            />
          )}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              {result.data.author && (
                <p className="text-sm font-medium text-white/85">
                  @{result.data.author}
                </p>
              )}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-xs text-white/45 transition-colors hover:text-white"
              >
                Open on Instagram
                <ExternalIcon />
              </a>
            </div>
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
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href={result.data.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-3 via-accent to-accent-2 px-7 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <DownloadIcon />
                Download MP4
              </a>
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-line px-6 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                Try another
              </button>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
