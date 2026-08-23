import { chromium } from "playwright";

/**
 * Loads routes in a real browser and reports console errors, failed requests,
 * and what actually rendered. curl only proves the HTML is right, which the
 * Netlify image break showed is not the same as the page working.
 *
 *   pnpm tsx scripts/audit/browser-check.ts https://invisiblecommons.org
 */
const ROUTES = ["/"];

async function main() {
  const origin = process.argv[2] ?? "http://localhost:3000";
  let problems = 0;
  const browser = await chromium.launch({
    chromiumSandbox: false,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
  });

  for (const route of ROUTES) {
    const errors: string[] = [];
    const failed: string[] = [];
    page.removeAllListeners();
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("requestfailed", (request) => {
      failed.push(`${request.failure()?.errorText} ${request.url()}`);
    });
    page.on("response", (response) => {
      if (response.status() >= 400) {
        failed.push(`HTTP ${response.status()} ${response.url()}`);
      }
    });

    await page.goto(`${origin}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await page.waitForTimeout(5_000);
    const cards = await page.locator('a[href^="/people/"]').count();
    const images = await page.locator("img").count();
    const brokenImages = await page.evaluate(
      () =>
        [...document.querySelectorAll("img")].filter(
          (img) => img.complete && img.naturalWidth === 0,
        ).length,
    );
    const bodyText = (await page.locator("body").innerText()).length;

    console.log(`\n${route}`);
    console.log(
      `  images ${images}, broken ${brokenImages}, profile links ${cards}, visible text ${bodyText} chars`,
    );
    // The directory is the only interactive surface, so prove it hydrated
    // rather than trusting that the markup arrived.
    if (route === "/people") {
      const before = cards;
      await page.getByRole("button", { name: "Chiang Mai 2024" }).click();
      await page.waitForTimeout(500);
      const after = await page.locator('a[href^="/people/"]').count();
      const working = after > 0 && after < before;
      console.log(
        `  filter: ${before} people, ${after} after filtering by an edition${working ? "" : "  FILTER DEAD"}`,
      );
      if (!working) problems += 1;
    }

    for (const error of errors.slice(0, 5)) console.log(`  console: ${error}`);
    for (const fail of failed.slice(0, 5)) console.log(`  request: ${fail}`);

    if (errors.length > 0) problems += errors.length;
    if (failed.length > 0) problems += failed.length;
    if (brokenImages > 0) problems += brokenImages;
    // A page that renders almost nothing is broken even without an error. A
    // profile with no bio is legitimately short, hence the low bar.
    if (bodyText < 250) {
      console.log(`  too little rendered, ${bodyText} chars`);
      problems += 1;
    }
  }

  await browser.close();
  console.log(
    problems === 0
      ? `\n${ROUTES.length} routes, browser clean`
      : `\n${problems} browser problems`,
  );
  if (problems > 0) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

export {};
