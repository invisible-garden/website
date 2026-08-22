import { readFile } from "node:fs/promises";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

/**
 * Reconciles the Webflow scrape described in mb/webflow-asset-scrape.md against
 * what the migration already put in Supabase Storage.
 *
 * The migration pulled the CMS images through the API (people and fellows) and
 * mirrored the site assets. The scrape note counts ~160 originals referenced by
 * the six pages and the stylesheet. This checks that every one of those URLs
 * has a counterpart in the bucket, so nothing dies with the Webflow plan.
 */
const PAGES = [
  "",
  "apply",
  "our-program",
  "chiang-mai-recap",
  "cm24-graduated-projects",
  "fellows",
];

/** Webflow's own template and plugin assets, which are not IG content. */
const PLATFORM = [
  /\/placeholder(\.[\w]+)?\.svg$/i,
  /\/plugins\//i,
  // A Webflow template's UI icons, served from a different site id.
  /\/62434fa732124a0fb112aab4\//,
];

function originals(urls: Set<string>): string[] {
  return [...urls]
    .filter((u) => !/-p-\d+(x\d+)?\./.test(u))
    .filter((u) => !/\.(js|css)([?#]|$)/i.test(u))
    .filter((u) => !PLATFORM.some((pattern) => pattern.test(u)));
}

async function main() {
  const found = new Set<string>();
  for (const page of PAGES) {
    const response = await fetch(`https://invisible.garden/${page}`);
    const html = await response.text();
    for (const match of html.matchAll(
      /https:\/\/cdn\.prod\.website-files\.com\/[^"' ,)]+/g,
    )) {
      found.add(match[0]);
    }
  }
  // The stylesheet references more, per the scrape note.
  for (const css of [...found].filter((u) => u.endsWith(".css"))) {
    const text = await (await fetch(css)).text();
    for (const match of text.matchAll(
      /https:\/\/cdn\.prod\.website-files\.com\/[^"' ,)]+/g,
    )) {
      found.add(match[0]);
    }
  }

  const all = originals(found);
  console.log(`referenced originals: ${all.length}`);

  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media";
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );
  const stored = new Set<string>();
  for (const prefix of ["webflow-assets", "people", "fellows"]) {
    const { data } = await client.storage
      .from(bucket)
      .list(prefix, { limit: 1000 });
    for (const file of data ?? []) stored.add(file.name.toLowerCase());
  }

  const manifest = JSON.parse(await readFile("data/manifest.json", "utf8")) as {
    entries: { sourceUrl: string }[];
  };
  const migrated = new Set(manifest.entries.map((e) => e.sourceUrl));

  const missing: string[] = [];
  for (const url of all) {
    if (migrated.has(url)) continue;
    // A URL truncated at an unencoded "(" is still a prefix of the real one,
    // and CMS images are stored under their slug, not their original filename,
    // so prefix matching against the manifest is the reliable check for them.
    if ([...migrated].some((source) => source.startsWith(url))) continue;
    // Filenames carrying parentheses come back truncated by any regex over
    // unencoded HTML, which the scrape note calls out. Match on the leading
    // ASCII run instead, and fold non-ASCII the way the mirror does.
    const name = decodeURIComponent(url.split("/").pop()!)
      .replace(/^[0-9a-f]{24}_/, "")
      .normalize("NFKD")
      .replace(/[^\x20-\x7e]/g, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .toLowerCase();
    const stem = name.replace(/\.[^.]+$/, "").replace(/-+$/, "");
    const probe = stem.slice(0, 16);
    const hit =
      probe.length > 0 &&
      [...stored].some((s) => s === name || s.startsWith(probe));
    if (!hit) missing.push(url);
  }

  console.log(
    `covered: ${all.length - missing.length}, missing: ${missing.length}`,
  );
  for (const url of missing.slice(0, 20)) console.log(`  ${url}`);
  if (missing.length > 0) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
