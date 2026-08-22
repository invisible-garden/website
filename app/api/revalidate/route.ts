import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand refresh, for when someone edits the database and wants the site to
 * follow at once rather than within the five minute window.
 *
 *   curl -X POST "https://<site>/api/revalidate?secret=<REVALIDATE_SECRET>"
 *
 * It refreshes every data-backed route. Paths rather than cache tags:
 * `revalidateTag` took all of those routes to a 500 on Netlify's runtime on
 * 2026-08-22, while `revalidatePath` behaves.
 *
 * Point a Supabase database webhook at it to make edits appear automatically:
 * Database, Webhooks, new webhook on the tables that matter, HTTP POST to this
 * URL with the secret in the query string.
 *
 * Without REVALIDATE_SECRET set, the route refuses everything, so a missing
 * variable cannot leave it open.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = new URL(request.url).searchParams.get("secret");

  if (!secret) {
    return NextResponse.json(
      { revalidated: false, reason: "REVALIDATE_SECRET is not set" },
      { status: 503 },
    );
  }
  if (given !== secret) {
    return NextResponse.json(
      { revalidated: false, reason: "bad secret" },
      { status: 401 },
    );
  }

  const paths = ["/", "/people", "/editions", "/partners"];
  for (const path of paths) revalidatePath(path);
  // Recap and profile pages are generated per slug, so refresh those trees too.
  revalidatePath("/editions/[slug]", "page");
  revalidatePath("/people/[slug]", "page");

  return NextResponse.json({
    revalidated: true,
    paths,
    at: new Date().toISOString(),
  });
}
