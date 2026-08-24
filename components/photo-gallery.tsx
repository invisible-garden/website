"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { mediaUrl } from "@/lib/media";
import type { EditionPhoto } from "@/lib/queries";

/**
 * The edition photo gallery. The server ships the first page inside the static
 * HTML and this component appends further pages while the reader scrolls,
 * fetching them from /api/editions/[slug]/photos so no database key reaches
 * the browser.
 */
export function PhotoGallery({
  slug,
  initialPhotos,
  total,
}: {
  slug: string;
  initialPhotos: EditionPhoto[];
  total: number;
}) {
  const [photos, setPhotos] = useState<EditionPhoto[]>(initialPhotos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inFlight = useRef(false);
  const offset = useRef(initialPhotos.length);
  const sentinel = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (inFlight.current || offset.current >= total) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        // Offset in the path: the Netlify adapter's cache ignores unknown
        // query parameters, which collapsed every page into the first one.
        `/api/editions/${slug}/photos/${offset.current}`,
      );
      if (!response.ok) throw new Error(String(response.status));
      const data = (await response.json()) as { photos: EditionPhoto[] };
      setPhotos((current) => [...current, ...data.photos]);
      offset.current += data.photos.length;
    } catch {
      setError("Could not load more photos.");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [slug, total]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    // Start fetching before the reader reaches the end, so photos are there
    // when they arrive.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { rootMargin: "800px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => {
          const src = mediaUrl(photo.photo_path);
          if (!src) return null;
          return (
            <li key={photo.photo_path}>
              <figure className="bg-paper relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
                <Image
                  src={src}
                  alt={photo.photo_alt}
                  fill
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 22vw"
                  className="object-cover"
                />
                {photo.credit ? (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pt-6 pb-1.5 text-right">
                    <span className="font-mono text-xs text-white">
                      {photo.credit}
                    </span>
                  </figcaption>
                ) : null}
              </figure>
            </li>
          );
        })}
      </ul>

      <p className="text-body-sm mt-6 text-center" aria-live="polite">
        {total > 0
          ? `Showing ${photos.length} of ${total} photos`
          : "No photos published from this edition yet."}
      </p>

      <div ref={sentinel} aria-hidden="true" />

      {loading ? (
        <p className="text-body-sm mt-2 text-center">Loading more…</p>
      ) : null}

      {error ? (
        <div className="mt-4 text-center">
          <p className="text-body-md">{error}</p>
          <button
            type="button"
            onClick={() => void loadMore()}
            className="text-body-md focus:border-ink mt-3 rounded-full border px-6 py-2"
          >
            Try again
          </button>
        </div>
      ) : null}
    </div>
  );
}
