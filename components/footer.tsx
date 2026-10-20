export function Footer() {
  return (
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
            className="focus-ring font-medium text-white/80 underline decoration-accent/60 underline-offset-4 transition-colors hover:text-white hover:decoration-accent"
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
                className="focus-ring text-sm text-white/55 transition-colors hover:text-white"
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="focus-ring text-sm text-white/55 transition-colors hover:text-white"
              >
                Terms
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/visualsbyhappy"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring text-sm text-white/55 transition-colors hover:text-white"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
