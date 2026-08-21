import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { paths, requireEnv } from "./config";
import type { WebflowItem } from "./webflow";

/**
 * Phase 2: rescue every image from the Webflow CDN.
 *
 * Download, strip EXIF, convert to WebP at quality 82, write two widths on the
 * long edge, and upload to Supabase Storage. The Webflow URLs stop resolving
 * once the plan lapses, so this step is mandatory, see tech-design 5.2.
 *
 * Paths: `people/<slug>.webp` is the 800px master and matches `photo_path` in
 * the database. `people/<slug>-400.webp` is the small variant. Fellows use the
 * same shape under `fellows/`.
 *
 * Idempotent: re-running overwrites the same paths and rewrites the manifest.
 */

const SIZES = [
  { suffix: "", edge: 800 },
  { suffix: "-400", edge: 400 },
];

interface Source {
  slug: string;
  name: string;
  url: string;
  prefix: "people" | "fellows";
}

interface Manifest {
  generatedAt: string;
  /** Webflow CDN URL to the storage path of the 800px master. */
  urls: Record<string, string>;
  missing: { collection: string; name: string; reason: string }[];
  failed: { name: string; url: string; error: string }[];
}

function collect(
  items: WebflowItem[],
  field: string,
  prefix: Source["prefix"],
) {
  const sources: Source[] = [];
  const missing: Manifest["missing"] = [];
  for (const item of items) {
    const data = item.fieldData;
    const name = String(data.name ?? "");
    const slug = String(data.slug ?? "");
    const image = data[field] as { url?: string } | null | undefined;
    if (!image?.url) {
      missing.push({ collection: prefix, name, reason: "no image in Webflow" });
      continue;
    }
    sources.push({ slug, name, url: image.url, prefix });
  }
  return { sources, missing };
}

export async function assets() {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media";
  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SECRET_KEY"),
    { auth: { persistSession: false } },
  );

  const people = JSON.parse(
    await readFile(path.join(paths.raw, "people.json"), "utf8"),
  ) as WebflowItem[];
  const fellows = JSON.parse(
    await readFile(path.join(paths.raw, "fellows.json"), "utf8"),
  ) as WebflowItem[];

  const a = collect(people, "pfp", "people");
  const b = collect(fellows, "photo", "fellows");
  const sources = [...a.sources, ...b.sources];
  const manifest: Manifest = {
    generatedAt: new Date().toISOString(),
    urls: {},
    missing: [...a.missing, ...b.missing],
    failed: [],
  };

  console.log(`${sources.length} images to move`);

  let done = 0;
  for (const source of sources) {
    try {
      const response = await fetch(source.url);
      if (!response.ok) throw new Error(`download ${response.status}`);
      const input = Buffer.from(await response.arrayBuffer());

      for (const size of SIZES) {
        const output = await sharp(input)
          // rotate() applies the EXIF orientation, then sharp drops metadata
          .rotate()
          .resize(size.edge, size.edge, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 82 })
          .toBuffer();

        const storagePath = `${source.prefix}/${source.slug}${size.suffix}.webp`;
        const { error } = await supabase.storage
          .from(bucket)
          .upload(storagePath, output, {
            contentType: "image/webp",
            upsert: true,
          });
        if (error) throw new Error(`upload ${storagePath}: ${error.message}`);
        if (size.suffix === "") manifest.urls[source.url] = storagePath;
      }
      done += 1;
      if (done % 10 === 0) console.log(`  ${done}/${sources.length}`);
    } catch (error) {
      manifest.failed.push({
        name: source.name,
        url: source.url,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  await mkdir(path.dirname(paths.manifest), { recursive: true });
  await writeFile(paths.manifest, JSON.stringify(manifest, null, 2));

  console.log(`uploaded ${done} images, ${SIZES.length} widths each`);
  console.log(`no image in Webflow: ${manifest.missing.length}`);
  for (const m of manifest.missing) console.log(`  ${m.collection}: ${m.name}`);
  console.log(`failed: ${manifest.failed.length}`);
  for (const f of manifest.failed) console.log(`  ${f.name}: ${f.error}`);
}
