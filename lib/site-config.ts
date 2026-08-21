/**
 * Facts that appear across several pages. Copy itself lives in content/*.mdx.
 * Sources: mb/content-brief.md section 1.
 */
export const siteConfig = {
  name: "Invisible Commons",
  organisers: ["Invisible Garden", "Common Compute"],
  description:
    "An unconference in Goa, India, by Invisible Garden and Common Compute. Two weeks of talks, co-working, and building across AI, robotics, ZKP, post-quantum cryptography, and formal verification, on Ethereum common ground.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://invisible.garden",
  edition: {
    slug: "goa-2026",
    city: "Goa",
    country: "India",
    startsOn: "2026-10-17",
    endsOn: "2026-10-31",
  },
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
