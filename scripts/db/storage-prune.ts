import "dotenv/config";
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

/**
 * Deletes objects under webflow-assets/ that the current site-assets index does
 * not name. Only ever removes strays left by an earlier naming scheme, and
 * prints what it removes.
 */
async function main() {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media";
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );
  const { data, error } = await client.storage
    .from(bucket)
    .list("webflow-assets", { limit: 500 });
  if (error) throw error;

  const index = JSON.parse(
    await readFile("data/out/site-assets.json", "utf8"),
  ) as { path: string }[];
  const expected = new Set(index.map((e) => e.path.split("/").pop()!));
  const stray = (data ?? [])
    .map((f) => f.name)
    .filter((name) => !expected.has(name));

  if (stray.length === 0) {
    console.log("no stray objects");
    return;
  }
  console.log(`removing ${stray.length} stray objects:`);
  for (const name of stray) console.log(`  ${name}`);
  const { error: removeError } = await client.storage
    .from(bucket)
    .remove(stray.map((name) => `webflow-assets/${name}`));
  if (removeError) throw removeError;
  console.log("done");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
