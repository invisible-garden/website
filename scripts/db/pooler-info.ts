import "dotenv/config";

/**
 * Reports whether the Management API can hand us a usable database connection
 * string, which is what `supabase link` and `supabase db push` need. The
 * password itself is write-only in the API: it can be reset, never read.
 *
 * Prints the connection string with any password masked.
 */
async function main() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref = process.env.SUPABASE_PROJECT_REF;
  if (!token || !ref) throw new Error("Missing SUPABASE_ACCESS_TOKEN or _REF");

  for (const path of [
    "config/database/pooler",
    "config/database/pgbouncer",
  ] as const) {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${ref}/${path}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!response.ok) {
      console.log(`${path}: HTTP ${response.status}`);
      continue;
    }
    const raw: unknown = await response.json();
    const entries = Array.isArray(raw) ? raw : [raw];
    for (const entry of entries as Record<string, unknown>[]) {
      const conn = String(
        entry.connection_string ?? entry.connectionString ?? "",
      );
      const masked = conn.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:****@");
      const hasSecret = /:\/\/[^:]+:(?!\[)(?!YOUR)[^@]{6,}@/.test(conn);
      console.log(
        `${path}: ${masked || "no connection string"} | real password embedded: ${hasSecret}`,
      );
    }
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
