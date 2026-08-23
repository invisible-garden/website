/**
 * Per-edition facts that are not in the database and not prose either: the
 * recap video and the headline numbers. Sources are named per line so anyone
 * can check them. Narrative copy lives in content/editions/<slug>.mdx.
 *
 * Rule from content-brief section 4: every claim traces to a real number.
 */
export interface EditionStat {
  value: string;
  label: string;
}

export interface EditionPhoto {
  /** Storage path of the 1600px version. `-800` is the smaller one. */
  path: string;
  alt: string;
}

export interface EditionContent {
  /** YouTube id, embedded near the top of the recap. */
  videoId: string | null;
  stats: EditionStat[];
  /** Projects worth naming on the recap page, by slug. */
  featuredProjects: string[];
  /**
   * Photography, published by `pnpm migrate:edition-photos`. The selection is
   * inherited from the old recap page rather than curated, and the alt text is
   * therefore generic. Both want a human pass once someone has looked at the
   * archives, see mb/DEFERRED.md.
   */
  hero: EditionPhoto | null;
  photos: EditionPhoto[];
}

/**
 * Sums one headline number across every edition, matched by label.
 *
 * By label, never by position. Buenos Aires carries an "accepted" line that
 * Chiang Mai does not, so summing the nth stat of each edition adds unrelated
 * things: on 2026-08-23 the homepage published 459 "builders on site", which
 * was Chiang Mai's 80 builders plus Buenos Aires' 379 accepted, and 128
 * "workshops", which was Chiang Mai's 83 workshops plus Buenos Aires' 45
 * builders. The real figures, 125 and 152, are the ones the about page has
 * always carried.
 *
 * Values are strings because they are rendered as written, "1,038" and such,
 * so the digits are pulled out before adding.
 */
export function sumStat(label: string): number {
  return Object.values(EDITION_CONTENT).reduce((total, edition) => {
    const stat = edition.stats.find((entry) => entry.label === label);
    if (!stat) return total;
    return total + Number(stat.value.replace(/[^0-9]/g, ""));
  }, 0);
}

export const EDITION_CONTENT: Record<string, EditionContent> = {
  "chiang-mai-2024": {
    // "recap 8 min" on the Invisible Garden YouTube channel, embedded on the
    // old Webflow recap page.
    videoId: "iAG5L-0RTwg",
    // Numbers from the old recap page, verified 2026-08-21.
    stats: [
      { value: "830", label: "applications" },
      { value: "80", label: "builders on site" },
      { value: "83", label: "workshops" },
      { value: "22", label: "projects graduated" },
    ],
    featuredProjects: ["kalki", "proof-of-invisible", "apstark", "zkcx"],
    hero: {
      path: "editions/chiang-mai-2024/hero.webp",
      alt: "Invisible Garden Chiang Mai 2024",
    },
    photos: [
      {
        path: "editions/chiang-mai-2024/photo-1.webp",
        alt: "Invisible Garden Chiang Mai 2024",
      },
      {
        path: "editions/chiang-mai-2024/photo-2.webp",
        alt: "Invisible Garden Chiang Mai 2024",
      },
      {
        path: "editions/chiang-mai-2024/photo-3.webp",
        alt: "Invisible Garden Chiang Mai 2024",
      },
      {
        path: "editions/chiang-mai-2024/learn-1.webp",
        alt: "A workshop at Invisible Garden Chiang Mai 2024",
      },
      {
        path: "editions/chiang-mai-2024/learn-2.webp",
        alt: "A workshop at Invisible Garden Chiang Mai 2024",
      },
      {
        path: "editions/chiang-mai-2024/community-1.webp",
        alt: "The Invisible Garden community in Chiang Mai, 2024",
      },
      {
        path: "editions/chiang-mai-2024/community-2.webp",
        alt: "The Invisible Garden community in Chiang Mai, 2024",
      },
      {
        path: "editions/chiang-mai-2024/community-3.webp",
        alt: "The Invisible Garden community in Chiang Mai, 2024",
      },
      {
        path: "editions/chiang-mai-2024/community-4.webp",
        alt: "The Invisible Garden community in Chiang Mai, 2024",
      },
    ],
  },
  "buenos-aires-2025": {
    // Uploaded to the Invisible Garden channel 2026-08-21, from the recap post
    // on X. Title: "Invisible Garden Buenos Aires, Recap Video".
    videoId: "Op3Syvqt_f8",
    // Confirmed 2026-08-21 against the official recap post on X.
    stats: [
      { value: "1,038", label: "applications" },
      { value: "379", label: "accepted" },
      { value: "45", label: "builders on site" },
      { value: "69", label: "workshops" },
    ],
    featuredProjects: [],
    // DEFERRED: Buenos Aires has no photography at all, in Webflow or here.
    hero: null,
    photos: [],
  },
};

export function editionContent(slug: string): EditionContent {
  return (
    EDITION_CONTENT[slug] ?? {
      videoId: null,
      stats: [],
      featuredProjects: [],
      hero: null,
      photos: [],
    }
  );
}
