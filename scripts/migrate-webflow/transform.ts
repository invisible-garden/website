/**
 * Phase 3: raw JSON plus the asset manifest into typed rows in data/out/.
 *
 * Rules, from implementation-plan 2.3:
 *  - trim whitespace on every text field
 *  - `role` copied to `headline` verbatim
 *  - best-effort split of headline into job_title and org on comma, pipe, slash,
 *    written to data/review/headlines.csv for a human pass
 *  - Fellows.category option IDs mapped through FELLOW_CATEGORY_IDS
 *  - Projects.description HTML converted to Markdown
 *  - photo_alt generated from name and headline
 *  - every Link field validated as a URL, failures reported
 *  - the 2 draft items dropped and listed in the report
 *  - the Costa Rica 2025 edition and its 6 memberships dropped
 *  - slugs transliterated to ASCII
 */
export async function transform() {
  throw new Error("Not implemented yet, see implementation-plan phase 2.3");
}
