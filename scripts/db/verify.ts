import { runSql } from "./management-api";

/**
 * Phase 1 acceptance check: 7 tables, 3 enums, RLS on everywhere, a select
 * policy for anon and no write policy at all.
 */
async function main() {
  const tables = await runSql<{ tablename: string; rowsecurity: boolean }[]>(
    `select tablename, rowsecurity from pg_tables
     where schemaname = 'public' order by tablename;`,
  );
  console.log(`tables: ${tables.length}`);
  for (const t of tables) {
    console.log(`  ${t.tablename.padEnd(18)} rls=${t.rowsecurity}`);
  }

  const enums = await runSql<{ typname: string; labels: string }[]>(
    `select t.typname, string_agg(e.enumlabel, ',' order by e.enumsortorder) as labels
     from pg_type t join pg_enum e on e.enumtypid = t.oid
     join pg_namespace n on n.oid = t.typnamespace
     where n.nspname = 'public' group by t.typname order by t.typname;`,
  );
  console.log(`enums: ${enums.length}`);
  for (const e of enums) console.log(`  ${e.typname} = ${e.labels}`);

  const policies = await runSql<
    { tablename: string; policyname: string; cmd: string; roles: string }[]
  >(
    `select tablename, policyname, cmd, roles::text
     from pg_policies where schemaname = 'public' order by tablename;`,
  );
  console.log(`policies: ${policies.length}`);
  const writes = policies.filter((p) => p.cmd !== "SELECT");
  console.log(`  non-select policies: ${writes.length}`);

  const indexes = await runSql<{ count: number }[]>(
    `select count(*)::int as count from pg_indexes where schemaname = 'public';`,
  );
  console.log(`indexes: ${indexes[0]?.count}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
