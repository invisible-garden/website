import "dotenv/config";

/**
 * Thin wrapper over the Supabase Management API. Applying DDL needs either the
 * database password or a Management API token, and the secret key cannot do it,
 * see tech-design "Open items". We hold the token, so migrations go through
 * here until the Supabase CLI has a database password to link with.
 */
const API = "https://api.supabase.com/v1";

function config() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref = process.env.SUPABASE_PROJECT_REF;
  if (!token || !ref) {
    throw new Error(
      "Missing SUPABASE_ACCESS_TOKEN or SUPABASE_PROJECT_REF in the local .env",
    );
  }
  return { token, ref };
}

export async function runSql<T = unknown>(sql: string): Promise<T> {
  const { token, ref } = config();
  const response = await fetch(`${API}/projects/${ref}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Management API ${response.status}: ${body.slice(0, 800)}`);
  }
  return body ? (JSON.parse(body) as T) : ([] as unknown as T);
}
