import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand refresh, for when someone edits the database and wants the site to
 * follow at once rather than within the five minute window.
 *
 *   curl -X POST "https://<site>/api/revalidate?secret=<REVALIDATE_SECRET>"
 *
 * It clears the `supabase` cache tag, which every server-side read carries, so
 * the next request to any data-backed page fetches fresh rows.
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

  revalidateTag("supabase");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
