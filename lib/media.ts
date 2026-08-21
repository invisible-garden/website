import { env } from "@/lib/env";

/**
 * Storage path to public URL. The database stores `people/leo-lara.webp`, never
 * a full URL, so moving the bucket or putting a CDN in front touches this file
 * only. See tech-design section 4.2.
 */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const clean = path.replace(/^\/+/, "");
  return `${env.supabaseUrl}/storage/v1/object/public/${env.storageBucket}/${clean}`;
}

/**
 * The migration writes two widths per photo: `<slug>.webp` at 800px on the long
 * edge, and `<slug>-400.webp` at 400px. Grid thumbnails take 400, detail pages
 * take 800.
 */
export type PhotoWidth = 400 | 800;

export function photoUrl(
  path: string | null | undefined,
  width: PhotoWidth = 800,
): string | null {
  if (!path) return null;
  const sized = width === 400 ? path.replace(/\.webp$/, "-400.webp") : path;
  return mediaUrl(sized);
}

/** Fallback for the one person in the Webflow data with no photo. */
export const PERSON_PHOTO_PLACEHOLDER = "/images/person-placeholder.svg";

export function personPhotoUrl(
  path: string | null | undefined,
  width: PhotoWidth = 800,
): string {
  return photoUrl(path, width) ?? PERSON_PHOTO_PLACEHOLDER;
}
