import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy — ReelDrop",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 md:py-24">
        <h1 className="display text-3xl sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-white/45">Last updated: October 2026</p>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="display text-lg">What we collect</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              When you paste a Reel URL, we process that URL to fetch the
              content you asked for. We do not store the Reels you look up, and
              we do not build advertising profiles or sell data.
            </p>
          </section>

          <section>
            <h2 className="display text-lg">Cookies &amp; storage</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              ReelDrop stores only your theme preference (light or dark) in
              your browser&apos;s local storage. No tracking cookies are used.
            </p>
          </section>

          <section>
            <h2 className="display text-lg">Third parties</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Reel requests are processed by a download provider so the video
              can be fetched for you. Only the Reel URL is sent — never any
              information about you.
            </p>
          </section>

          <section>
            <h2 className="display text-lg">Your choices</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              You can clear your theme preference at any time by clearing your
              browser storage for this site.
            </p>
          </section>

          <section>
            <h2 className="display text-lg">Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Questions about this policy? Reach out on Instagram:{" "}
              <a
                href="https://www.instagram.com/visualsbyhappy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white/80 underline decoration-accent/60 underline-offset-4 hover:text-white hover:decoration-accent"
              >
                @visualsbyhappy
              </a>
            </p>
          </section>
        </div>
      </main>
          <Footer />
    </div>
  );
}
