/**
 * Facts that appear across several pages. Copy itself lives in content/*.mdx.
 * Source: mb/content-brief.md, note above section 1 and section 1.
 *
 * The site belongs to Invisible Garden. Nav, footer identity, about, editions,
 * recaps and the people directory are Invisible Garden's alone. The joint
 * branding with Common Compute is scoped to the 2026 event, so it applies to
 * the homepage and to any other surface speaking about Invisible Commons.
 */
export const siteConfig = {
  name: "Invisible Garden",
  description:
    "A traveling academy for Ethereum developers, run as pop-up dev cities since 2024.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://invisible.garden",
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

/**
 * The 2026 event. A joint project of Invisible Garden, Common Compute and
 * OpenBuild, all three named with equal weight wherever the event is the
 * subject. OpenBuild was added as a co-host on 2026-08-21, after the content
 * brief was last written, so the brief still says two organisations.
 */
export const eventConfig = {
  name: "Invisible Commons",
  organisers: ["Invisible Garden", "Common Compute", "OpenBuild"],
  descriptor:
    "An unconference in Goa, India, by Invisible Garden, Common Compute and OpenBuild. Two weeks of talks, co-working, and building across AI, robotics, ZKP, post-quantum cryptography, and formal verification, on Ethereum common ground.",
  slug: "goa-2026",
  city: "Goa",
  country: "India",
  startsOn: "2026-10-17",
  endsOn: "2026-10-31",
  datesLabel: "17 to 31 October 2026",
} as const;
