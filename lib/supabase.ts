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
 * The custom fetch matters. Supabase reads are plain GET requests, which land
 * in Next's Data Cache, and that cache has its own lifetime independent of the
 * page's `revalidate`. Without this, a page regenerates on schedule and
 * re-renders the same stale rows: on 2026-08-22 an edited sort order did not
 * reach the site even though the page had been rebuilt. Tying the fetch
 * lifetime to the page's keeps the two in step.
 */
export function createSupabaseClient() {
  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          next: { revalidate: REVALIDATE_SECONDS, tags: ["supabase"] },
        }),
    },
  });
}
