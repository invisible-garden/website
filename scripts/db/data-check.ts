import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

/**
 * Reads the loaded data back through the anon client, the same path the site
 * uses. Run after every migration load, and again during the pre-cutover
 * proofread, see implementation-plan phase 6.
 */
async function main() {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );

  const { data: editions } = await client
    .from("editions")
    .select("slug, name, city, country, starts_on, ends_on, status")
    .order("sort_order");
  console.log("editions:");
  for (const e of editions ?? []) {
    console.log(
      `  ${e.slug.padEnd(18)} ${e.city}, ${e.country}  ${e.starts_on} to ${e.ends_on}  ${e.status}`,
    );
  }

  const { count: people } = await client
    .from("people")
    .select("*", { count: "exact", head: true });
  const { count: noPhoto } = await client
    .from("people")
    .select("*", { count: "exact", head: true })
    .is("photo_path", null);
  const { count: reviewed } = await client
    .from("people")
    .select("*", { count: "exact", head: true })
    .eq("headline_reviewed", true);
  console.log(
    `people: ${people}, without photo: ${noPhoto}, headline reviewed: ${reviewed}`,
  );

  const { data: linkedFellows } = await client
    .from("fellows")
    .select("slug, category, person_id, edition_id")
    .not("person_id", "is", null);
  console.log(`fellows linked to a person: ${linkedFellows?.length ?? 0}`);
  for (const f of linkedFellows ?? []) console.log(`  ${f.slug}`);

  const { data: orphans } = await client
    .from("people")
    .select("slug, full_name, edition_people(edition_id)");
  const noEdition = (orphans ?? []).filter(
    (p) => p.edition_people.length === 0,
  );
  console.log(`people with no edition: ${noEdition.length}`);
  for (const p of noEdition) console.log(`  ${p.full_name}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
