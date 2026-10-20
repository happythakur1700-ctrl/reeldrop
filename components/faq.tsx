"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Is ReelDrop free?",
    a: "Yes — the interface is free to use. Fair-use limits may apply.",
  },
  {
    q: "Do I need an Instagram account?",
    a: "No. ReelDrop works with public Reel links and never asks for your Instagram credentials.",
  },
  {
    q: "Can I download private Reels?",
    a: "No. Private content is off limits — ReelDrop only handles public Reels, and always respects access controls.",
  },
  {
    q: "Why isn't my Reel working?",
    a: "Make sure the Reel is public and the link points to a Reel (instagram.com/reel/…). Deleted, restricted, or age-gated Reels can't be processed.",
  },
  {
    q: "Where does my downloaded file go?",
    a: "To your browser's usual download folder — the same place files go when you download anything else.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-16 border-t border-line"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 md:py-24">
        <h2 id="faq-heading" className="eyebrow text-white/45">
          FAQ
        </h2>
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {FAQ_ITEMS.map((item, i) => {
            const expanded = open === i;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(expanded ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-[15px] font-medium text-white/85 transition-colors hover:text-white"
                >
                  {item.q}
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
                    className={`size-4 shrink-0 text-white/40 transition-transform duration-200 ${
                      expanded ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  hidden={!expanded}
                  className="pb-5 text-sm leading-relaxed text-white/55"
                >
                  {item.a}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
