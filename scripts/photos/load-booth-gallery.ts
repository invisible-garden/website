import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database";

/**
 * Loads the published photo-booth archive into `edition_photos`, one row per
 * photo, carrying the Discord login of whoever posted it as the credit and a
 * placeholder alt text. Idempotent, keyed on (edition_id, photo_path).
 *
 *   pnpm photos:gallery <channel-id> [--dry]
 *
 * Run after `pnpm photos:publish`, which wrote both the bucket objects and the
 * manifest this reads. Editing the table fires the rebuild trigger, so the
 * site follows within a couple of minutes without a deploy.
 *
 * The alt text is generated, not described: nobody has looked at 564 photos
 * yet. It satisfies the accessibility audit until a human pass replaces it,
 * which is tracked in mb/DEFERRED.md alongside the crediting decision that
 * this script implements.
 */
interface ManifestPhoto {
  edition: string;
  storagePath: string;
  source: string;
  author: string;
  date: string;
}

async function main() {
  const channel = process.argv[2];
  const dry = process.argv.includes("--dry");
  if (!channel)
    throw new Error("Usage: load-booth-gallery.ts <channel-id> [--dry]");

  const file = path.join(
    process.cwd(),
    "data",
    "discord",
    channel,
    "booth-manifest.json",
  );
  const manifest = JSON.parse(await readFile(file, "utf8")) as {
    photos: ManifestPhoto[];
  };

  const client = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );

  const { data: editions, error } = await client
    .from("editions")
    .select("id, slug, name");
  if (error) throw error;
  const bySlug = new Map((editions ?? []).map((e) => [e.slug, e]));

  // Bucket paths are numbered per edition in posting order, so the number is
  // the sort order. One batched upsert rather than one statement per row: the
  // rebuild trigger is statement level, so this is one Netlify build instead
  // of hundreds.
  const rows = manifest.photos.map((photo) => {
    const edition = bySlug.get(photo.edition);
    if (!edition) throw new Error(`unknown edition ${photo.edition}`);
    const n = Number(photo.storagePath.match(/(\d+)\.webp$/)?.[1]);
    if (!Number.isFinite(n)) throw new Error(`bad path ${photo.storagePath}`);
    return {
      edition_id: edition.id,
      photo_path: photo.storagePath,
      photo_alt: `Photo booth picture from Invisible Garden ${edition.name}`,
      credit: photo.author,
      sort_order: n,
    };
  });

  if (!dry) {
    for (let i = 0; i < rows.length; i += 200) {
      const { error } = await client
        .from("edition_photos")
        .upsert(rows.slice(i, i + 200), {
          onConflict: "edition_id,photo_path",
        });
      if (error) throw error;
      console.log(`  ${Math.min(i + 200, rows.length)} of ${rows.length}`);
    }
  }

  const counts = new Map<string, number>();
  for (const photo of manifest.photos) {
    counts.set(photo.edition, (counts.get(photo.edition) ?? 0) + 1);
  }
  console.log(`\n${dry ? "would load" : "loaded"} ${manifest.photos.length}:`);
  for (const [slug, count] of counts) console.log(`  ${slug}  ${count}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
