import type { Metadata, Viewport } from "next";
import "./globals.css";

const FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#f58529"/><stop offset="0.5" stop-color="#dd2a7b"/><stop offset="1" stop-color="#8134af"/></linearGradient></defs><rect width="32" height="32" rx="7" fill="url(#g)"/><path d="M13 9l10 7-10 7z" fill="white"/></svg>`,
  );

export const metadata: Metadata = {
  title: "Instagram Reel Downloader — ReelDrop",
  description:
    "Download eligible public Instagram Reels with ReelDrop. A simple, fast and mobile-friendly Reel downloader.",
  icons: { icon: FAVICON },
  openGraph: {
    title: "Instagram Reel Downloader — ReelDrop",
    description:
      "Download eligible public Instagram Reels with ReelDrop. A simple, fast and mobile-friendly Reel downloader.",
    siteName: "ReelDrop",
  },
  twitter: {
    card: "summary",
    title: "Instagram Reel Downloader — ReelDrop",
    description:
      "Download eligible public Instagram Reels with ReelDrop. A simple, fast and mobile-friendly Reel downloader.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
};

const THEME_INIT = `try{if(localStorage.getItem('reeldrop-theme')==='light')document.documentElement.classList.add('light')}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
