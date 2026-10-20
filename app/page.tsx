import { Header } from "@/components/header";
import { Downloader } from "@/components/downloader";
import { Faq } from "@/components/faq";

function Link2Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-accent" aria-hidden="true">
      <path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
      <path d="M8 12h8" />
    </svg>
  );
}

function PasteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-accent" aria-hidden="true">
      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
      <path d="M16 4h2a2 2 0 0 1 2 2v2" />
      <path d="M11 14h10" />
      <rect width="8" height="8" x="16" y="2" rx="1" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-accent" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-accent" aria-hidden="true">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-accent" aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function SmartphoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-accent" aria-hidden="true">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function FeatherIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-accent" aria-hidden="true">
      <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z" />
      <path d="M16 8 2 22" />
      <path d="M17.5 15H9" />
    </svg>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Copy",
    text: "Copy the link of a public Instagram Reel.",
    icon: <Link2Icon />,
  },
  {
    n: "02",
    title: "Paste",
    text: "Paste the link into ReelDrop.",
    icon: <PasteIcon />,
  },
  {
    n: "03",
    title: "Download",
    text: "Download the eligible content.",
    icon: <DownloadIcon />,
  },
];

const FEATURES = [
  {
    title: "Fast",
    text: "Simple processing experience.",
    icon: <ZapIcon />,
  },
  {
    title: "No login",
    text: "Never ask for Instagram credentials.",
    icon: <LockIcon />,
  },
  {
    title: "Mobile ready",
    text: "Works beautifully on phones.",
    icon: <SmartphoneIcon />,
  },
  {
    title: "Simple",
    text: "No unnecessary steps.",
    icon: <FeatherIcon />,
  },
];

export default function Home() {
  return (
    <div className="min-h-dvh">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-20 sm:px-8 md:pb-28 md:pt-20">
            <p className="eyebrow mb-6 text-white/50">
              ReelDrop — Reel downloader
            </p>
            <h1 className="display text-[clamp(2.6rem,10vw,6.5rem)]">
              Download reels.
              <br />
              <span className="accent-text">Without the friction.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
              Paste a public Instagram Reel URL and download eligible content
              in seconds.
            </p>

            <div
              id="downloader"
              className="relative mt-10 scroll-mt-24 md:mt-14"
            >
              <div className="glow" aria-hidden="true" />
              <div className="relative max-w-xl">
                <Downloader />
              </div>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-white/40">
              <span
                aria-hidden="true"
                className="inline-block size-1.5 rounded-full bg-accent"
              />
              Public Instagram Reels only
            </p>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-16 border-t border-line"
          aria-labelledby="how-it-works-heading"
        >
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
            <h2 id="how-it-works-heading" className="eyebrow text-white/45">
              How it works
            </h2>
            <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              {STEPS.map((step) => (
                <li key={step.n} className="bg-panel p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="display text-2xl text-white/25">
                      {step.n}
                    </span>
                    {step.icon}
                  </div>
                  <h3 className="display mt-6 text-lg">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-line" aria-labelledby="features-heading">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
            <h2 id="features-heading" className="eyebrow text-white/45">
              Why ReelDrop
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <li key={f.title} className="bg-panel p-6 sm:p-8">
                  {f.icon}
                  <h3 className="display mt-5 text-base">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                    {f.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Faq />
      </main>

      <footer className="border-t border-line" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
          <p className="display text-lg">
            REEL<span className="accent-text">DROP</span>
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/45">
            Download only content you own or have permission to save or reuse.
            Respect creators' rights and Instagram's terms.
          </p>
          <p className="mt-4 text-sm text-white/45">
            Curated by{" "}
            <a
              href="https://www.instagram.com/visualsbyhappy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/80 underline decoration-accent/60 underline-offset-4 transition-colors hover:text-white hover:decoration-accent"
            >
              @visualsbyhappy
            </a>{" "}
            on Instagram
          </p>
          <nav aria-label="Footer" className="mt-8">
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <li>
                <a
                  href="/privacy"
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/visualsbyhappy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
