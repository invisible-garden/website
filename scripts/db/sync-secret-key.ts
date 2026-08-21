import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import "dotenv/config";

/**
 * Fetches the project's secret key through the Management API and writes it
 * into the local gitignored .env as SUPABASE_SECRET_KEY. The key bypasses RLS
 * and is needed for Storage uploads and the load phase.
 *
 * It is never printed, never committed, and never set on Netlify. Rotate it
 * before launch, see implementation-plan phase 6.
 */
async function main() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref = process.env.SUPABASE_PROJECT_REF;
  if (!token || !ref) throw new Error("Missing SUPABASE_ACCESS_TOKEN or _REF");

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${ref}/api-keys?reveal=true`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok) {
    throw new Error(`Management API ${response.status}`);
  }
  const keys = (await response.json()) as {
    name: string;
    type: string;
    api_key: string;
  }[];
  const secret = keys.find((k) => k.type === "secret" && k.name === "default");
  if (!secret?.api_key) throw new Error("No default secret key on the project");

  const envPath = path.join(process.cwd(), ".env");
  const current = await readFile(envPath, "utf8");
  const line = `SUPABASE_SECRET_KEY="${secret.api_key}"`;
  const next = current.includes("SUPABASE_SECRET_KEY=")
    ? current.replace(/SUPABASE_SECRET_KEY=.*/g, line)
    : `${current.trimEnd()}\n${line}\n`;
  await writeFile(envPath, next, { mode: 0o600 });
  console.log("SUPABASE_SECRET_KEY written to .env");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
