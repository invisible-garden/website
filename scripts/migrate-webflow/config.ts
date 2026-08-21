import path from "node:path";
import "dotenv/config";

export const SITE_ID =
  process.env.WEBFLOW_SITE_ID ?? "6695a56b501ba1fda80ae466";

/** Inventoried 2026-08-20, see tech-design section 3.1. */
export const COLLECTIONS = {
  people: "6696a648ada836155ebd3ba1", // "Speakers & Mentors", 90 items, 2 draft
  fellows: "677ff943ab1654146942e0b4", // 22 items
  projects: "6793e399a77c8048d9c80961", // 22 items
  editions: "67b4e6fe4a1dc37e9b78ca4d", // 3 items, 1 stale
} as const;

export type CollectionKey = keyof typeof COLLECTIONS;

/** Costa Rica 2025 never happened, tech-design section 3.2. */
export const EXCLUDED_EDITION_SLUGS = ["costa-rica-2025"];

/** Webflow Option field IDs on Fellows.category. */
export const FELLOW_CATEGORY_IDS: Record<string, "academic" | "honorary"> = {
  "814f6d86f97f865f77aa89e992e657e0": "academic",
  "24e30b1b098c73b418aa5c4a0fe9ecb7": "honorary",
};

/** Expected load after exclusions, see implementation-plan 2.5. */
export const EXPECTED = {
  editions: 2,
  people: 87,
  memberships: 98,
  fellows: 22,
  projects: 22,
} as const;

const root = process.cwd();
export const paths = {
  raw: path.join(root, "data", "raw"),
  out: path.join(root, "data", "out"),
  review: path.join(root, "data", "review"),
  manifest: path.join(root, "data", "manifest.json"),
};

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Put it in a local .env, never in git.`);
  }
  return value;
}
