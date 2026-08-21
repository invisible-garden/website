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

export interface EditionContent {
  /** YouTube id, embedded near the top of the recap. */
  videoId: string | null;
  stats: EditionStat[];
  /** Projects worth naming on the recap page, by slug. */
  featuredProjects: string[];
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
  },
  "buenos-aires-2025": {
    // DEFERRED: the 13 minute recap video is native to the recap post on X.
    // Leo uploads it to the Invisible Garden YouTube channel, then its id goes
    // here and the page embeds it like Chiang Mai's.
    videoId: null,
    // Confirmed 2026-08-21 against the official recap post on X.
    stats: [
      { value: "1,038", label: "applications" },
      { value: "379", label: "accepted" },
      { value: "45", label: "builders on site" },
      { value: "69", label: "workshops" },
    ],
    featuredProjects: [],
  },
};

export function editionContent(slug: string): EditionContent {
  return (
    EDITION_CONTENT[slug] ?? { videoId: null, stats: [], featuredProjects: [] }
  );
}
