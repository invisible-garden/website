import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { COLLECTIONS, SITE_ID, paths } from "./config";
import { collectionSchema, listAssets, listItems } from "./webflow";

/**
 * Phase 1: pull every collection and the asset list to data/raw/, untouched.
 * Nothing is filtered here, drafts included. Filtering happens in transform, so
 * the rest of the pipeline can be re-run without hitting the Webflow API again.
 */
export async function extract() {
  await mkdir(paths.raw, { recursive: true });

  for (const [key, id] of Object.entries(COLLECTIONS)) {
    const [schema, items] = await Promise.all([
      collectionSchema(id),
      listItems(id),
    ]);
    await writeFile(
      path.join(paths.raw, `${key}.json`),
      JSON.stringify(items, null, 2),
    );
    await writeFile(
      path.join(paths.raw, `${key}.schema.json`),
      JSON.stringify(schema, null, 2),
    );
    const drafts = items.filter((item) => item.isDraft).length;
    console.log(`${key}: ${items.length} items (${drafts} draft)`);
  }

  const assets = await listAssets(SITE_ID);
  await writeFile(
    path.join(paths.raw, "assets.json"),
    JSON.stringify(assets, null, 2),
  );
  console.log(`assets: ${assets.length}`);
}
