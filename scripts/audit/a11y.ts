import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

/**
 * Runs axe over every route, which is the accessibility bar the implementation
 * plan sets for phase 4: "axe reports no violations".
 *
 *   pnpm audit:a11y https://ig-website.netlify.app
 *
 * Needs the same browser setup as audit:browser, see the README in this folder.
 * WCAG AA is the target, so the tags are limited to the AA rule sets rather
 * than every best-practice rule.
 */
const ROUTES = ["/"];

async function main() {
  const origin = process.argv[2] ?? "http://localhost:3000";
  const browser = await chromium.launch({
    chromiumSandbox: false,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  // axe needs a real context, not the shorthand newPage.
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  let total = 0;

  for (const route of ROUTES) {
    await page.goto(`${origin}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await page.waitForTimeout(2_000);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // The YouTube embed is third-party markup we cannot fix, and it reports
      // its own ARIA violations. Everything around it is still checked.
      .exclude("iframe")
      .analyze();

    console.log(`\n${route}  ${results.violations.length} violations`);
    for (const violation of results.violations) {
      console.log(`  ${violation.impact}: ${violation.id}, ${violation.help}`);
      for (const node of violation.nodes.slice(0, 3)) {
        console.log(`    ${node.target.join(" ")}`);
        if (node.failureSummary) {
          console.log(`      ${node.failureSummary.split("\n")[1]?.trim()}`);
        }
      }
      total += 1;
    }
  }

  await browser.close();
  console.log(
    total === 0
      ? `\n${ROUTES.length} routes, no axe violations`
      : `\n${total} violation types`,
  );
  if (total > 0) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

export {};
