/**
 * Phase 2: download every image, strip EXIF, convert to WebP quality 82, resize
 * to 400px and 800px on the long edge, upload to the `media` bucket, and write
 * data/manifest.json mapping each Webflow CDN URL to its storage path.
 *
 * Partner logos keep SVG where the source is SVG.
 * Done when 111 images are in the bucket and no URL is unresolved.
 * See tech-design section 5.2 and implementation-plan 2.2.
 */
export async function assets() {
  throw new Error("Not implemented yet, see implementation-plan phase 2.2");
}
