import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Terms of Use — ReelDrop",
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 md:py-24">
        <h1 className="display text-3xl sm:text-4xl">Terms of Use</h1>
        <p className="mt-2 text-sm text-white/45">Last updated: October 2026</p>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="display text-lg">Accepting these terms</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              By using ReelDrop you agree to these terms. If you don&apos;t
              agree, please don&apos;t use the service.
            </p>
          </section>

          <section>
            <h2 className="display text-lg">Your responsibility</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Download only content you own or have permission to save or
              reuse. You are responsible for how you use downloaded content and
              for respecting creators&apos; rights.
            </p>
          </section>

          <section>
            <h2 className="display text-lg">Private content</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              ReelDrop handles public Reels only. Attempting to access private,
              restricted, or age-gated content is not permitted.
            </p>
          </section>

          <section>
            <h2 className="display text-lg">Instagram&apos;s terms</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              ReelDrop is not affiliated with, endorsed by, or sponsored by
              Instagram or Meta. Your use of Instagram remains subject to
              Instagram&apos;s own terms.
            </p>
          </section>

          <section>
            <h2 className="display text-lg">No warranty</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              ReelDrop is provided &quot;as is&quot; without warranties of any
              kind. The service may change or be unavailable at any time.
            </p>
          </section>
        </div>
      </main>
          <Footer />
    </div>
  );
}
