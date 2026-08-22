import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
const SITE = "https://ig-website.netlify.app";
async function first() {
  const html = await (await fetch(`${SITE}/people`)).text();
  return (
    /font-semibold[^>]*>\s*([^<]+)/.exec(html)?.[1]?.trim() ??
    `? (${html.length}B)`
  );
}
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function main() {
  const c = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );
  const { data: p } = await c
    .from("people")
    .select("id")
    .eq("slug", "justin-zhang")
    .single();
  const { data: row } = await c
    .from("edition_people")
    .select("edition_id, sort_order")
    .eq("person_id", p!.id)
    .single();
  const original = row!.sort_order;
  console.log(`start: "${await first()}" (db ${original})`);
  await c
    .from("edition_people")
    .update({ sort_order: 2000 })
    .eq("person_id", p!.id)
    .eq("edition_id", row!.edition_id);
  console.log("db edited to 2000, waiting for the 5 minute window...");
  for (let i = 1; i <= 8; i += 1) {
    await wait(45000);
    const n = await first();
    console.log(`  +${i * 45}s: "${n}"`);
    if (n === "Justin Zhang") break;
  }
  await c
    .from("edition_people")
    .update({ sort_order: original })
    .eq("person_id", p!.id)
    .eq("edition_id", row!.edition_id);
  console.log(`restored to ${original}`);
}
main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
