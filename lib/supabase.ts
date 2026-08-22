import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

/** How long a page, and the data behind it, may be stale. */
export const REVALIDATE_SECONDS = 300;

/**
 * Read-only client for React Server Components. It carries the publishable key
 * and RLS allows nothing but SELECT, so there is still no reason for it to
 * reach the browser. No client component may import this file.
 *
 * About `x-cache-window`. Supabase reads are plain GETs, so they land in Next's
 * Data Cache, which keeps its own lifetime: without help, a page regenerates on
 * its ISR schedule and re-renders the same stale rows, which is exactly what
 * happened to an edited sort order on 2026-08-22. The header changes once per
 * revalidate window, which changes the cache key, so each regeneration reads
 * the database again. PostgREST ignores headers it does not know.
 *
 * Two tempting alternatives are ruled out on Netlify's runtime, both verified
 * on 2026-08-22: `next: { revalidate, tags }` on the fetch, and any on-demand
 * `revalidatePath` or `revalidateTag`, all of which 500 every data-backed
 * route. Rendering the pages dynamically instead truncated the streamed HTML in
 * production, which broke hydration.
 */
export function createSupabaseClient() {
  const window = Math.floor(Date.now() / (REVALIDATE_SECONDS * 1000));
  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-cache-window": String(window) } },
  });
}
