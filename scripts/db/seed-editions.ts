import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database";
import { eventConfig } from "../../lib/site-config";

/**
 * The 2026 edition is not in Webflow, it is authored here. Everything else in
 * `editions` comes from the migration. Idempotent, upserts on slug.
 *
 * DEFERRED, still empty on this row: summary and accent_color. The summary is
 * copy and the accent colour is a design decision, see tech-design section 7.
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
