import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

/**
 * Phase 1 done-when: an anonymous request reads an empty table and a write is
 * refused. Run after every schema change that touches RLS.
 */
async function main() {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );

  const read = await client.from("people").select("*").limit(1);
  console.log(
    read.error
      ? `select FAILED: ${read.error.message}`
      : `select ok, ${read.data.length} rows`,
  );

  const write = await client
    .from("people")
    .insert({ slug: "rls-probe", full_name: "RLS probe" });
  console.log(
    write.error
      ? `insert refused: ${write.error.message}`
      : "insert SUCCEEDED, which is a security bug",
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
