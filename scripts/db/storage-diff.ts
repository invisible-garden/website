import "dotenv/config";
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

/** Compares what is in webflow-assets/ against data/out/site-assets.json, so a
 *  renamed or stray object from an earlier run shows up. */
async function main() {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );
  const { data, error } = await client.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET ?? "media")
    .list("webflow-assets", { limit: 500 });
  if (error) throw error;
  const inBucket = new Set((data ?? []).map((f) => f.name));

  const index = JSON.parse(
    await readFile("data/out/site-assets.json", "utf8"),
  ) as { path: string }[];
  const expected = new Set(index.map((e) => e.path.split("/").pop()!));

  const stray = [...inBucket].filter((name) => !expected.has(name));
  const missing = [...expected].filter((name) => !inBucket.has(name));
  console.log(`in bucket: ${inBucket.size}, expected: ${expected.size}`);
  console.log(`stray: ${stray.length}`, stray);
  console.log(`missing: ${missing.length}`, missing);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
