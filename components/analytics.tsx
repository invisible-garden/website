import Script from "next/script";

/**
 * Umami, decided 2026-08-21. Cookie-free and privacy friendly, so the site
 * needs no consent banner.
 *
 * It only renders once both variables are set, which keeps previews and local
 * development out of the stats. Set them on Netlify:
 *   NEXT_PUBLIC_UMAMI_SRC        script URL, cloud or self-hosted
 *   NEXT_PUBLIC_UMAMI_WEBSITE_ID the website id from the Umami dashboard
 */
export function Analytics() {
  const src = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!src || !websiteId) return null;
  return (
    <Script src={src} data-website-id={websiteId} strategy="afterInteractive" />
  );
}
