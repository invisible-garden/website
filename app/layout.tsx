import type { Metadata } from "next";
import { DM_Mono, Open_Sans, Sora } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
  },
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
        <a
          href="#main"
          className="bg-ink sr-only rounded-full px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
