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
    // DEFERRED: no recap video found on the site or the YouTube channel.
    videoId: null,
    // Numbers from content-brief section 3.2, which traces them to the sponsor
    // deck. Not verifiable from the live site, which has no Buenos Aires recap.
    stats: [
      { value: "1,038", label: "applications" },
      { value: "45", label: "builders on site" },
      { value: "69", label: "workshops" },
      { value: "27", label: "projects and research outputs" },
    ],
    featuredProjects: [],
  },
};

export function editionContent(slug: string): EditionContent {
  return (
    EDITION_CONTENT[slug] ?? { videoId: null, stats: [], featuredProjects: [] }
  );
}
