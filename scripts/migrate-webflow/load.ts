/**
 * Phase 5: upsert data/out/ into Supabase on `slug` with the secret key, in
 * dependency order: editions, people, edition_people, fellows, projects.
 *
 * Done when the database holds 2 editions, 87 people, 98 memberships,
 * 22 fellows and 22 projects, and a second run changes nothing.
 * See implementation-plan 2.5 and the EXPECTED counts in config.ts.
 */
export async function load() {
  throw new Error("Not implemented yet, see implementation-plan phase 2.5");
}
