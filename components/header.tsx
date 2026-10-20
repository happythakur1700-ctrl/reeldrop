"use client";

import { useEffect, useState } from "react";

function SunIcon() {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
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
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  return (
    <button
      type="button"
      aria-label="Toggle light and dark mode"
      title="Toggle light/dark mode"
      onClick={() => {
        const next = !light;
        setLight(next);
        document.documentElement.classList.toggle("light", next);
        try {
          localStorage.setItem("reeldrop-theme", next ? "light" : "dark");
        } catch {
          /* storage unavailable */
        }
      }}
      className="focus-ring inline-flex size-10 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-panel hover:text-white"
    >
      {light ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="/"
          aria-label="ReelDrop home"
          className="focus-ring display text-lg tracking-tight"
        >
          REEL<span className="accent-text">DROP</span>
        </a>
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-8">
            <li>
              <a
                href="#how-it-works"
                className="focus-ring text-sm text-white/60 transition-colors hover:text-white"
              >
                How it works
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="focus-ring text-sm text-white/60 transition-colors hover:text-white"
              >
                FAQ
              </a>
            </li>
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
