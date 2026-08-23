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

/**
 * The 2026 event. A joint project of Invisible Garden, Common Compute and
 * OpenBuild, all three named with equal weight wherever the event is the
 * subject. OpenBuild was added as a co-host on 2026-08-21, after the content
 * brief was last written, so the brief still says two organisations.
 */
export const eventConfig = {
  name: "Invisible Commons",
  /**
   * The three co-hosts, equal weight. `logo` is a white-on-transparent mark for
   * the gradient hero; the rest render as text until their artwork is final.
   * Common Compute sent 12 "Commons Ring" variants on 2026-08-21 and nobody has
   * picked one yet, see mb/DEFERRED.md.
   */
  organisers: [
    {
      name: "Invisible Garden",
      url: "/about",
      logo: "/images/logo/wordmark-white.svg",
      description:
        "Invisible Garden is a traveling academy for Ethereum developers, run as pop-up dev cities since 2024.",
    },
    {
      name: "Common Compute",
      url: "https://commoncompute.org",
      logo: null,
      // Written from their own site on 2026-08-22, at Leo's direction. Their
      // sign-off is still outstanding, and they have not sent a line of their
      // own. Their words: a network of small machines "in homes, schools,
      // workshops and fields, each running AI on its own, for the people in
      // the room, with nothing leaving the room unless you say so".
      description:
        "Common Compute builds small machines that run AI on their own, in homes, schools and workshops, with nothing leaving the room unless you say so. The hardware and the code are open source.",
    },
    {
      name: "OpenBuild",
      url: "https://openbuild.xyz",
      logo: "/images/logo/openbuild-white.svg",
      // Drafted from openbuild.xyz, shipped on Leo's instruction 2026-08-22.
      // Their own sign-off is still outstanding.
      description:
        "OpenBuild is an open community that helps developers get into Web3. It runs more than 90 courses and 150 hands-on challenges, plus bounties that turn learning into paid work.",
    },
  ] as const,
  /** Its own site since 2026-08-23, which is where the event is described in
   *  full. This site links out to it rather than repeating it. */
  url: "https://invisiblecommons.org",
  descriptor:
    "An unconference in Goa, India, by Invisible Garden, Common Compute and OpenBuild. Two weeks of talks, co-working, and building across AI, robotics, ZKP, post-quantum cryptography, and formal verification, on Ethereum common ground.",
  slug: "goa-2026",
  city: "Goa",
  country: "India",
  startsOn: "2026-10-17",
  endsOn: "2026-10-31",
  datesLabel: "17 to 31 October 2026",
  /** Names only, for prose and social cards. */
  get organiserNames(): string[] {
    return this.organisers.map((organiser) => organiser.name);
  },
  /** Devcon anchoring approved 2026-08-21. Devcon 8 runs 3 to 6 November 2026
   *  in Mumbai, three days after this edition ends. */
  devcon: {
    name: "Devcon 8",
    city: "Mumbai",
    datesLabel: "3 to 6 November 2026",
  },
} as const;
