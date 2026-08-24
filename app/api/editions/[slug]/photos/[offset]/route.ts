import { NextResponse } from "next/server";
import { GALLERY_PAGE_SIZE, getEdition, getEditionPhotos } from "@/lib/queries";

/**
 * Pages of the edition photo gallery, fetched by the client component as the
 * reader scrolls. The database is queried here, server side, so no key reaches
 * the browser, see tech-design 4.2.
 *
 * The page offset is a path segment, not a query parameter. On Netlify the
 * adapter's cache varies on a fixed list of query names and `offset` is not
 * one of them, so query-based pages all collapsed into one cached first page
 on 2026-08-24. Path segments are separate routes and cannot collapse.
 */
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; offset: string }> },
) {
  const { slug, offset } = await params;
  const parsed = Number(offset);
  if (
    !Number.isInteger(parsed) ||
    parsed < 0 ||
    parsed % GALLERY_PAGE_SIZE !== 0
  ) {
    return NextResponse.json({ error: "bad offset" }, { status: 400 });
  }

  // Unknown editions get an empty result rather than an error, the same
  // contract the static pages follow through notFound().
  const edition = await getEdition(slug);
  if (!edition) {
    return NextResponse.json({ photos: [] });
  }

  const photos = await getEditionPhotos(slug, GALLERY_PAGE_SIZE, parsed);
  return NextResponse.json({ photos });
}
