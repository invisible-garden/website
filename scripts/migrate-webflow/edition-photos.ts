import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { requireEnv } from "./config";

/**
 * Publishes the photography the old Chiang Mai recap page used, from the
 * mirrored `webflow-assets/` originals into `editions/<slug>/` as WebP at two
 * widths. The originals are 1 to 2.6 MB PNGs and 3200px JPEGs, far too heavy to
 * put on a page as they are.
 *
 * The selection is inherited, not curated: these are exactly the images that
 * sat on the old recap page, in the same roles. Photo selects from the real
 * archives are still an open item, and Buenos Aires has none at all.
 *
 * Idempotent, uploads use upsert.
 */
const SOURCES: Record<string, { source: string; name: string }[]> = {
  "chiang-mai-2024": [
    { source: "ChiangMaiRecap.png", name: "hero" },
    { source: "Slide-64.jpg", name: "photo-1" },
    { source: "Slide-65.jpg", name: "photo-2" },
    { source: "Slide-67.jpg", name: "photo-3" },
    { source: "Community1.png", name: "community-1" },
    { source: "Community2.png", name: "community-2" },
    { source: "Community3.png", name: "community-3" },
    { source: "Community4.png", name: "community-4" },
    { source: "Learn1.png", name: "learn-1" },
    { source: "Learn2.png", name: "learn-2" },
  ],
};

const WIDTHS = [
  { suffix: "", width: 1600 },
  { suffix: "-800", width: 800 },
];

export async function editionPhotos() {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media";
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabase = createClient(
    supabaseUrl,
    requireEnv("SUPABASE_SECRET_KEY"),
    { auth: { persistSession: false } },
  );

  for (const [edition, files] of Object.entries(SOURCES)) {
    for (const file of files) {
      const from = `${supabaseUrl}/storage/v1/object/public/${bucket}/webflow-assets/${encodeURIComponent(file.source)}`;
      const response = await fetch(from);
      if (!response.ok) {
        console.log(`  missing source: ${file.source} (${response.status})`);
        continue;
      }
      const input = Buffer.from(await response.arrayBuffer());

      for (const size of WIDTHS) {
        const output = await sharp(input)
          .rotate()
          .resize(size.width, null, { withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
        const path = `editions/${edition}/${file.name}${size.suffix}.webp`;
        const { error } = await supabase.storage
          .from(bucket)
          .upload(path, output, { contentType: "image/webp", upsert: true });
        if (error) throw new Error(`${path}: ${error.message}`);
        if (size.suffix === "") {
          console.log(
            `  ${path}  ${Math.round(input.length / 1024)}KB -> ${Math.round(output.length / 1024)}KB`,
          );
        }
      }
    }
  }
}
