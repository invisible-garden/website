/**
 * The only fact the holding page needs: its own URL, for metadataBase.
 *
 * This branch carried invisiblecommons.org, a one-page site for the 2026
 * event. The event was called off on 2026-09-03, the event content is gone,
 * and the domain is to be reused for something else. The old eventConfig and
 * the co-host material stay out.
 */
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://invisiblecommons.org",
} as const;
