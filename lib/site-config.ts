/**
 * Facts that appear across several pages. Copy itself lives in content/*.mdx.
 * Source: mb/content-brief.md, note above section 1 and section 1.
 *
 * The site belongs to Invisible Garden. Nav, footer identity, about, editions,
 * recaps and the people directory are Invisible Garden's alone. The old
 * eventConfig for Invisible Commons is gone: the event was called off on
 * 2026-09-03, and the reunion that replaces it lives in the What next section,
 * components/home/what-next.tsx, its only consumer.
 */
export const siteConfig = {
  name: "Invisible Garden",
  description:
    "A traveling academy for Ethereum developers, run as pop-up dev cities since 2024.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://invisible.garden",
  /** Footer credit, decided 2026-08-21. The old "Invisible Garden Foundation"
   *  and the Singapore NGO claim are stale and must not reappear. */
  legalName: "Invisible Garden Operations LLC",
  // Taken from the live Webflow site, 2026-08-21. Note the X handle has no
  // second "e". The contact email is still missing, the old site only offered
  // Google Forms.
  social: {
    x: "https://x.com/invisiblgarden",
    telegram: "https://t.me/invgarannounce",
    discord: "https://discord.gg/QXBHHmRHFv",
    youtube: "https://www.youtube.com/@Invisible_Garden",
    email: "",
  },
  nav: [
    { href: "/about", label: "About" },
    { href: "/editions", label: "Editions" },
    { href: "/people", label: "Mentors & speakers" },
    { href: "/partners", label: "Partners" },
  ],
} as const;
