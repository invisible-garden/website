import type { Metadata } from "next";
import { DM_Mono, Open_Sans, Sora } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora-src",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans-src",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono-src",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Under construction",
  description: "Nothing to see here yet. Check back later.",
  // The event site is gone and the domain is to be reused. Ask search
  // engines to drop it rather than hold stale event pages.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${openSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      {/* Netlify injects its HUD script after </body>, which browsers reparent
          into the body. Without this React treats it as a hydration mismatch,
          and in production that took the homepage to the error boundary. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <main id="main" className="flex-1">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
