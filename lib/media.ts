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

/** Fallback for the one person in the Webflow data with no photo. */
export const PERSON_PHOTO_PLACEHOLDER = "/images/person-placeholder.svg";

export function personPhotoUrl(path: string | null | undefined): string {
  return mediaUrl(path) ?? PERSON_PHOTO_PLACEHOLDER;
}
