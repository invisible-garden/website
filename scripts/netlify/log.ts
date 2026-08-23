import "dotenv/config";
import { readFile } from "node:fs/promises";

/**
 * Prints the build log of the latest Netlify deploy, or of the deploy id given
 * as an argument. Reads the token from secrets.txt, which is gitignored.
 *
 * This site has its own Netlify site and its own deploy token, kept apart from
 * invisible.garden's. Put the site id in NETLIFY_SITE_ID in the local .env,
 * not here: a hardcoded id is how you end up reading the other site's logs.
 */
const SITE_ID = process.env.NETLIFY_SITE_ID;

async function token(): Promise<string> {
  const raw = await readFile("secrets.txt", "utf8");
  const line = raw.split("\n").find((l) => l.toLowerCase().includes("netlify"));
  const value = line?.split(":").slice(1).join(":").trim();
  if (!value) throw new Error("No netlify token in secrets.txt");
  return value;
}

async function main() {
  const auth = { Authorization: `Bearer ${await token()}` };
  let id = process.argv[2];
  if (!id) {
    if (!SITE_ID) {
      throw new Error("Set NETLIFY_SITE_ID, or pass a deploy id");
    }
    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${SITE_ID}/deploys?per_page=1`,
      { headers: auth },
    );
    const [deploy] = (await response.json()) as { id: string }[];
    id = deploy.id;
  }
  const response = await fetch(
    `https://api.netlify.com/api/v1/deploys/${id}/log`,
    { headers: auth },
  );
  if (!response.ok) {
    console.log(`log HTTP ${response.status}`);
    return;
  }
  const lines = (await response.json()) as { message: string }[];
  for (const line of lines) console.log(line.message);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
