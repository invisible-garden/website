import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Read-only client for React Server Components. It carries the publishable key
 * and RLS allows nothing but SELECT, so there is still no reason for it to
 * reach the browser. No client component may import this file.
 *
 * No custom fetch. Passing `next: { revalidate }` here worked at build time and
 * threw during on-demand regeneration on Netlify, taking every data-backed
 * route to a 500 on 2026-08-22. Data freshness is controlled by the page
 * instead: each data page sets `fetchCache = "default-no-store"`, so a
 * regeneration reads the database rather than replaying a cached response.
 */
export function createSupabaseClient() {
  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
