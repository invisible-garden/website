import { assets } from "./assets";
import { extract } from "./extract";
import { load } from "./load";
import { review } from "./review";
import { siteAssets } from "./site-assets";
import { transform } from "./transform";

const phases = {
  extract,
  assets,
  "site-assets": siteAssets,
  transform,
  review,
  load,
};
type Phase = keyof typeof phases;

async function main() {
  const phase = process.argv[2] as Phase | undefined;
  if (!phase || !(phase in phases)) {
    console.error(
      `Usage: tsx scripts/migrate-webflow/index.ts <${Object.keys(phases).join("|")}>`,
    );
    process.exit(1);
  }
  await phases[phase]();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
