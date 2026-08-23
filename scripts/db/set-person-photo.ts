import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

/**
 * Puts one photo on one person, for people the Webflow migration had no
 * picture for.
 *
 *   pnpm tsx scripts/db/set-person-photo.ts <slug> <image-url>
 *
 * Same treatment as the migration in scripts/migrate-webflow/assets.ts, so a
 * hand-added photo is indistinguishable from a migrated one: EXIF orientation
 * applied then stripped, WebP at quality 82, two widths on the long edge, and
 * `photo_path` pointing at the 800px master.
 *
 * Check you have the right to publish the image before running this. The
 * script cannot.
 */
const SIZES = [
  { suffix: "", edge: 800 },
  { suffix: "-400", edge: 400 },
];

async function main() {
  const [slug, url] = process.argv.slice(2);
  if (!slug || !url) throw new Error("usage: set-person-photo <slug> <url>");

  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media";
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );

  const { data: person, error: lookup } = await supabase
    .from("people")
    .select("slug,full_name,photo_alt,photo_path")
    .eq("slug", slug)
    .single();
  if (lookup || !person)
    throw new Error(`no person ${slug}: ${lookup?.message}`);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`download ${response.status}`);
  const input = Buffer.from(await response.arrayBuffer());
  const meta = await sharp(input).metadata();
  console.log(`source: ${meta.width}x${meta.height} ${meta.format}`);

  for (const size of SIZES) {
    const output = await sharp(input)
      .rotate()
      .resize(size.edge, size.edge, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    const path = `people/${slug}${size.suffix}.webp`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, output, { contentType: "image/webp", upsert: true });
    if (error) throw error;
    console.log(`uploaded ${path}, ${(output.length / 1024).toFixed(0)}KB`);
  }

  const photoPath = `people/${slug}.webp`;
  const { error: update } = await supabase
    .from("people")
    .update({ photo_path: photoPath })
    .eq("slug", slug);
  if (update) throw update;
  console.log(`${person.full_name}: photo_path = ${photoPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
