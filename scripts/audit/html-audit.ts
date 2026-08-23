/**
 * Cheap accessibility and SEO audit over the rendered HTML of every route.
 * Not a replacement for axe in a browser, but it catches the mistakes that
 * actually happen: missing alt text, empty links, skipped heading levels, and
 * missing metadata. Run against any origin:
 *
 *   pnpm tsx scripts/audit/html-audit.ts https://ig-website.netlify.app
 */
const ROUTES = [
  "/",
  "/about",
  "/editions",
  "/editions/chiang-mai-2024",
  "/editions/buenos-aires-2025",
  "/people",
  "/people/justin-drake",
  "/partners",
  "/does-not-exist",
];

interface Problem {
  route: string;
  message: string;
}

/**
 * Fetches one image per route and checks the response is really an image.
 * On 2026-08-21 a next.config `images.formats` entry stopped Netlify routing
 * /_next/image, and every request returned the app shell HTML with status 200.
 * The markup was perfect and every page was blank.
 */
async function checkImages(
  origin: string,
  route: string,
  html: string,
  problems: Problem[],
) {
  const match = /(?:src|srcSet|srcset)="([^"]*\/_next\/image\?[^"\s]*)"/.exec(
    html,
  );
  const raw = match?.[1]?.split(/\s+/)[0];
  if (!raw) return;
  const url = new URL(raw.replaceAll("&amp;", "&"), origin);
  const response = await fetch(url);
  const type = response.headers.get("content-type") ?? "";
  if (!response.ok || !type.startsWith("image/")) {
    problems.push({
      route,
      message: `image did not load: HTTP ${response.status} ${type} for ${url.pathname}${url.search.slice(0, 60)}`,
    });
  }
}

function check(route: string, html: string, problems: Problem[]) {
  const add = (message: string) => problems.push({ route, message });

  if (!/<html[^>]+lang="en"/.test(html)) add("no lang on <html>");
  if (!/<title>[^<]+<\/title>/.test(html)) add("no <title>");
  if (!/<meta name="description" content="[^"]+"/.test(html)) {
    add("no meta description");
  }
  if (!/property="og:title"/.test(html)) add("no og:title");
  if (!/property="og:image"/.test(html)) add("no og:image");

  const images = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = images.filter((img) => !/\salt="/.test(img));
  if (noAlt.length > 0) add(`${noAlt.length} images without alt`);
  // An empty alt is right for decorative artwork, but only when the image is
  // also hidden from assistive technology. Empty alt on its own still gets
  // flagged, because that is usually a forgotten alt rather than a decision.
  const emptyAlt = images.filter(
    (img) => /\salt=""/.test(img) && !/aria-hidden="true"/.test(img),
  );
  if (emptyAlt.length > 0) {
    add(`${emptyAlt.length} images with empty alt, check they are decorative`);
  }

  const links = [...html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)];
  const empty = links.filter((m) => {
    const text = m[1].replace(/<[^>]+>/g, "").trim();
    const hasImage = /<img|<svg/.test(m[1]);
    const labelled = /aria-label="[^"]+"/.test(m[0]);
    return text === "" && !hasImage && !labelled;
  });
  if (empty.length > 0) add(`${empty.length} links with no accessible name`);

  const headings = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  const h1 = headings.filter((level) => level === 1).length;
  if (h1 === 0) add("no h1");
  if (h1 > 1) add(`${h1} h1 elements`);
  for (let i = 1; i < headings.length; i += 1) {
    if (headings[i] - headings[i - 1] > 1) {
      add(`heading jumps h${headings[i - 1]} to h${headings[i]}`);
      break;
    }
  }

  const bytes = new TextEncoder().encode(html).length;
  if (bytes > 400_000) add(`html is ${Math.round(bytes / 1024)} KB`);
}

async function main() {
  const origin = process.argv[2] ?? "http://localhost:3000";
  const problems: Problem[] = [];

  for (const route of ROUTES) {
    const response = await fetch(`${origin}${route}`);
    const html = await response.text();
    const expected = route === "/does-not-exist" ? 404 : 200;
    if (response.status !== expected) {
      problems.push({
        route,
        message: `HTTP ${response.status}, expected ${expected}`,
      });
      continue;
    }
    check(route, html, problems);
    await checkImages(origin, route, html, problems);
  }

  if (problems.length === 0) {
    console.log(`${ROUTES.length} routes, no problems found`);
    return;
  }
  for (const problem of problems) {
    console.log(`${problem.route.padEnd(32)} ${problem.message}`);
  }
  console.log(`\n${problems.length} problems`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

export {};
