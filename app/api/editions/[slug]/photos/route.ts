import { NextResponse } from "next/server";
import { GALLERY_PAGE_SIZE, getEdition, getEditionPhotos } from "@/lib/queries";

/**
 * Pages of the edition photo gallery, fetched by the client component as the
 * reader scrolls. The database is queried here, server side, so no key reaches
 * the browser, see tech-design 4.2.
 *
 * Same staleness window as everything else, five minutes. The gallery page
 * itself is static and ships its first batch; this endpoint serves the rest.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const url = new URL(request.url);

  const requested = Number(url.searchParams.get("limit") ?? GALLERY_PAGE_SIZE);
  const limit = Number.isFinite(requested)
    ? Math.min(Math.max(Math.trunc(requested), 1), 48)
    : GALLERY_PAGE_SIZE;
  const rawOffset = Number(url.searchParams.get("offset") ?? 0);
  const offset = Number.isFinite(rawOffset)
    ? Math.max(Math.trunc(rawOffset), 0)
    : 0;

  // Unknown editions get an empty result rather than an error, the same
  // contract the static pages follow through notFound().
  const edition = await getEdition(slug);
  if (!edition) {
    return NextResponse.json({ photos: [], total: 0 });
  }

  const photos = await getEditionPhotos(slug, limit, offset);
  return NextResponse.json(
    { photos },
    {
      headers: {
        "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
