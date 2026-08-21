import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Read-only client for React Server Components. It carries the publishable key
 * and RLS allows nothing but SELECT, so there is still no reason for it to
 * reach the browser. No client component may import this file.
 */
export function createSupabaseClient() {
  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
