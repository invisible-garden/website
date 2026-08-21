import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { runSql } from "./management-api";

/**
 * Applies every file in supabase/migrations in name order. Migrations are the
 * source of truth, the dashboard is never edited by hand.
 */
async function main() {
  const dir = path.join(process.cwd(), "supabase", "migrations");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    const sql = await readFile(path.join(dir, file), "utf8");
    process.stdout.write(`applying ${file} ... `);
    await runSql(sql);
    console.log("ok");
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
