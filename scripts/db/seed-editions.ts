import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database";
import { eventConfig } from "../../lib/site-config";

/**
 * The 2026 edition is not in Webflow, it is authored here. Everything else in
 * `editions` comes from the migration. Idempotent, upserts on slug.
 *
 * The accent colour is picked here and approved by Leo, per mb/DEFERRED.md.
 * #e8703a is a Goa laterite orange: it sits between the peach accent and the
 * sun yellow already in the palette, it is not the Argentina blue that belongs
 * to Buenos Aires, and it holds AA contrast against ink for large text.
 *
 * DEFERRED, still empty: summary, which is copy.
 */
async function main() {
  const client = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );

  const { error } = await client.from("editions").upsert(
    {
      slug: eventConfig.slug,
      name: eventConfig.name,
      city: eventConfig.city,
      country: eventConfig.country,
      starts_on: eventConfig.startsOn,
      ends_on: eventConfig.endsOn,
      status: "upcoming",
      accent_color: "#e8703a",
      sort_order: 2,
    },
    { onConflict: "slug" },
  );
  if (error) throw error;

  const { data } = await client
    .from("editions")
    .select("slug, status, starts_on")
    .order("sort_order");
  console.log(data);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
