import { readFile } from "node:fs/promises";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database";

/**
 * Upserts the hand-authored people in content/people.authored.json, the ones
 * the Webflow CMS never had. Idempotent, keyed on slug, so re-running is safe
 * and the migration can still be re-run without clobbering these.
 *
 * Editing any of these tables fires the rebuild trigger, so the site follows
 * within a couple of minutes without a deploy.
 */
interface Authored {
  slug: string;
  full_name: string;
  headline: string | null;
  photo_path?: string | null;
  source: string;
  editions: { edition: string; sort_order: number; featured?: boolean }[];
}

async function main() {
  const file = JSON.parse(
    await readFile("content/people.authored.json", "utf8"),
  ) as { people: Authored[] };

  const client = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );

  for (const person of file.people) {
    const { error } = await client.from("people").upsert(
      {
        slug: person.slug,
        full_name: person.full_name,
        headline: person.headline,
        photo_path: person.photo_path ?? null,
        photo_alt: person.headline
          ? `${person.full_name}, ${person.headline}`
          : person.full_name,
      },
      { onConflict: "slug" },
    );
    if (error) throw error;

    const { data: row } = await client
      .from("people")
      .select("id")
      .eq("slug", person.slug)
      .single();

    for (const link of person.editions) {
      const { data: edition } = await client
        .from("editions")
        .select("id")
        .eq("slug", link.edition)
        .single();
      if (!edition) throw new Error(`unknown edition ${link.edition}`);

      const { error: linkError } = await client.from("edition_people").upsert(
        {
          person_id: row!.id,
          edition_id: edition.id,
          sort_order: link.sort_order,
          featured: link.featured ?? false,
        },
        { onConflict: "edition_id,person_id" },
      );
      if (linkError) throw linkError;
      console.log(
        `${person.full_name} -> ${link.edition}, order ${link.sort_order}`,
      );
    }
    console.log(`  source: ${person.source}`);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
