import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { paths, requireEnv } from "./config";

/**
 * Mirrors every Webflow site asset into Supabase Storage under
 * `webflow-assets/`, keeping the original file name and type.
 *
 * These are the sponsor and partner logos plus the page imagery, and they die
 * with the Webflow plan, tech-design 5.6 and risk 1. Nothing about the partner
 * list is decided yet, so this rescues the files first and leaves the naming,
 * tiers and links for later. Slugged copies under `partners/` come when the
 * list is authored.
 *
 * Idempotent: uploads use upsert and the index is rewritten each run.
 */
interface WebflowAsset {
  id: string;
  originalFileName: string;
  contentType: string;
  hostedUrl: string;
}

/**
 * Storage keys must be ASCII, and these file names carry Chinese and Vietnamese
 * characters. Strip the Webflow id prefix, fold accents, and fall back to the
 * asset id when nothing printable survives.
 */
function cleanName(name: string, id: string): string {
  const withoutId = name.replace(/^[0-9a-f]{24}_/, "");
  const extension = withoutId.includes(".")
    ? withoutId.slice(withoutId.lastIndexOf(".")).toLowerCase()
    : "";
  const stem = withoutId.slice(0, withoutId.length - extension.length);
  const ascii = stem
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${ascii || id}${extension}`;
}

export async function siteAssets() {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media";
  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SECRET_KEY"),
    { auth: { persistSession: false } },
  );

  const assets = JSON.parse(
    await readFile(path.join(paths.raw, "assets.json"), "utf8"),
  ) as WebflowAsset[];

  const index: { name: string; path: string; contentType: string }[] = [];
  // Different Webflow files can clean down to the same name, so a collision
  // would silently overwrite. Keep them apart with a short id suffix.
  const taken = new Set<string>();
  const failed: { name: string; error: string }[] = [];

  const skipped: string[] = [];

  for (const asset of assets) {
    // The media bucket takes images only. Fonts are not needed, the site
    // self-hosts its own through next/font.
    if (!asset.contentType.startsWith("image/")) {
      skipped.push(asset.originalFileName);
      continue;
    }
    let name = cleanName(asset.originalFileName, asset.id);
    if (taken.has(name)) {
      const dot = name.lastIndexOf(".");
      const stem = dot === -1 ? name : name.slice(0, dot);
      const extension = dot === -1 ? "" : name.slice(dot);
      name = `${stem}-${asset.id.slice(-6)}${extension}`;
    }
    taken.add(name);
    const storagePath = `webflow-assets/${name}`;
    try {
      const response = await fetch(asset.hostedUrl);
      if (!response.ok) throw new Error(`download ${response.status}`);
      const body = Buffer.from(await response.arrayBuffer());
      const { error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, body, {
          contentType: asset.contentType,
          upsert: true,
        });
      if (error) throw new Error(error.message);
      index.push({
        name: asset.originalFileName,
        path: storagePath,
        contentType: asset.contentType,
      });
    } catch (error) {
      failed.push({
        name: asset.originalFileName,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  await mkdir(paths.out, { recursive: true });
  await writeFile(
    path.join(paths.out, "site-assets.json"),
    JSON.stringify(index, null, 2),
  );

  console.log(`mirrored ${index.length} of ${assets.length} site assets`);
  for (const name of skipped) console.log(`  skipped, not an image: ${name}`);
  for (const f of failed) console.log(`  failed: ${f.name}: ${f.error}`);
}
