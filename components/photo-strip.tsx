import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import type { EditionPhoto } from "@/lib/edition-content";

/** The photo strip that closes a recap page, content-brief 3.2. */
export function PhotoStrip({ photos }: { photos: EditionPhoto[] }) {
  if (photos.length === 0) return null;
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {photos.map((photo) => {
        const src = mediaUrl(photo.path.replace(/\.webp$/, "-800.webp"));
        if (!src) return null;
        return (
          <li
            key={photo.path}
            className="bg-paper relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]"
          >
            <Image
              src={src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 45vw, 30vw"
              className="object-cover"
            />
          </li>
        );
      })}
    </ul>
  );
}
