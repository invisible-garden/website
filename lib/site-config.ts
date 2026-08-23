/**
 * Facts that appear in more than one place on the page. Source:
 * mb/invisible-commons/invisiblecommons-brief.md.
 *
 * This site is Invisible Commons, an event with three co-hosts. It is not
 * Invisible Garden's site and it does not carry Invisible Garden's history:
 * invisible.garden holds that. Invisible Garden appears here only as one
 * co-host name among three.
 */
export const siteConfig = {
  name: "Invisible Commons",
  description:
    "An unconference in Goa, India, 17 to 31 October 2026. Two weeks of talks, co-working, and building.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://invisiblecommons.org",
  /**
   * The Telegram announcements channel, and the only call to action until the
   * participation model is decided. Then it becomes a registration link, see
   * mb/participation-model-memo.md.
   */
  telegram: "https://t.me/invisiblecommons",
} as const;

/**
 * The event itself.
 *
 * The three co-hosts carry equal weight everywhere they appear, in billing and
 * in wording. Order is fixed for consistency across the page, it is not a
 * ranking.
 */
export const eventConfig = {
  name: siteConfig.name,
  organisers: [
    {
      name: "Invisible Garden",
      url: "https://invisible.garden",
      description:
        "Invisible Garden is a traveling academy for Ethereum developers, run as pop-up dev cities since 2024.",
    },
    {
      name: "Common Compute",
      url: "https://commoncompute.org",
      // Written from their own site on 2026-08-22, at Leo's direction. Their
      // sign-off is still outstanding.
      description:
        "Common Compute builds small machines that run AI on their own, in homes, schools and workshops, with nothing leaving the room unless you say so. The hardware and the code are open source.",
    },
    {
      name: "OpenBuild",
      url: "https://openbuild.xyz",
      // Drafted from openbuild.xyz, shipped on Leo's instruction 2026-08-22.
      // Their own sign-off is still outstanding.
      description:
        "OpenBuild is an open community that helps developers get into Web3. It runs more than 90 courses and 150 hands-on challenges, plus bounties that turn learning into paid work.",
    },
  ] as const,
  /** Region only. The venue is not named, the agreement is not closed. */
  city: "Goa",
  country: "India",
  startsOn: "2026-10-17",
  endsOn: "2026-10-31",
  /** Names only, for prose and social cards. */
  get organiserNames(): string[] {
    return this.organisers.map((organiser) => organiser.name);
  },
  /** Devcon anchoring approved 2026-08-21. Devcon 8 runs 3 to 6 November 2026
   *  in Mumbai, three days after this event ends. */
  devcon: {
    name: "Devcon 8",
    city: "Mumbai",
    datesLabel: "3 to 6 November 2026",
  },
} as const;
