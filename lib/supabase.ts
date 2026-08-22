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
 * The custom fetch bounds Next's Data Cache. Supabase reads are plain GETs, so
 * they land in that cache, which has a lifetime independent of the page's
 * `revalidate`: without this a page regenerates on schedule and re-renders the
 * same stale rows, which is what happened to an edited sort order on
 * 2026-08-22. Cache tags are deliberately absent, they take Netlify's runtime
 * down, see app/api/revalidate/route.ts.
 */
export function createSupabaseClient() {
  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, next: { revalidate: REVALIDATE_SECONDS } }),
    },
  });
}
