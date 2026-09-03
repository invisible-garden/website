/**
 * A holding page. Invisible Commons was called off on 2026-09-03 and the
 * domain is to be reused for something else, so the page says only that
 * there is nothing here yet. No event content, no co-host branding, no
 * outward links.
 *
 * The page is noindex, set in app/layout.tsx, so search engines drop what
 * they held of the old event site.
 */
export default function HomePage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-display">Under construction</h1>
      <p className="text-body-lg mt-4 max-w-md">
        Nothing to see here yet. Check back later.
      </p>
    </section>
  );
}
