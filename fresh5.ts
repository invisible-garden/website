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
  console.log(`start: site "${await first()}", db ${original}`);
  await c
    .from("edition_people")
    .update({ sort_order: 2000 })
    .eq("person_id", p!.id)
    .eq("edition_id", row!.edition_id);
  console.log("edited to 2000 (nothing else, no deploy by me)");
  for (let i = 1; i <= 10; i += 1) {
    await wait(30000);
    const n = await first();
    console.log(`  +${i * 30}s: "${n}"`);
    if (n === "Justin Zhang") {
      console.log("  reached the site");
      break;
    }
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
