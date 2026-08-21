import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import TurndownService from "turndown";
import { EXCLUDED_EDITION_SLUGS, FELLOW_CATEGORY_IDS, paths } from "./config";
import { splitHeadline } from "./headline";
import type { WebflowItem } from "./webflow";

/**
 * Phase 3: raw JSON plus the asset manifest into typed rows in data/out/.
 * Relations travel by slug, the load phase resolves them to uuids.
 *
 * Decisions baked in here, all confirmed by Leo on 2026-08-21:
 *  - Costa Rica 2025 never happened, edition and memberships dropped
 *  - the 2 draft people are dropped
 *  - Lauren has no edition membership and stays that way, person row, no link
 *  - fellows link to their person row where the same human appears in both:
 *    Tim Pechersky, Daniel Arroyo, and Surfer_05 who is the person Surfer
 *  - all 22 projects are Chiang Mai 2024, Buenos Aires projects come later
 *    from invisible-garden/arg25-Projects once graduation is decided
 */

const CHIANG_MAI = "chiang-mai-2024";

/** Hand-authored, Webflow holds only name and slug. Dates and cities verified
 *  against the live site on 2026-08-21. Summary and accent colour still to
 *  come from the team. */
const EDITION_META: Record<
  string,
  {
    city: string;
    country: string;
    starts_on: string;
    ends_on: string;
    sort_order: number;
  }
> = {
  [CHIANG_MAI]: {
    city: "Chiang Mai",
    country: "Thailand",
    starts_on: "2024-09-30",
    ends_on: "2024-11-10",
    sort_order: 0,
  },
  "buenos-aires-2025": {
    city: "Buenos Aires",
    country: "Argentina",
    starts_on: "2025-10-27",
    ends_on: "2025-11-16",
    sort_order: 1,
  },
};

/** Same human in both collections, fellow slug to person slug. */
const FELLOW_PERSON_LINKS: Record<string, string> = {
  "tim-pechersky": "tim-pechersky",
  "daniel-arroyo": "daniel-arroyo",
  "surfer-05": "surfer",
};

interface Manifest {
  entries: { collection: string; slug: string; path: string }[];
}

const text = (value: unknown): string | null => {
  const trimmed = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
  return trimmed === "" ? null : trimmed;
};

const url = (value: unknown, report: string[], label: string) => {
  const raw = text(value);
  if (!raw) return null;
  try {
    new URL(raw);
    return raw;
  } catch {
    report.push(`invalid URL on ${label}: ${raw}`);
    return null;
  }
};

async function readRaw(name: string): Promise<WebflowItem[]> {
  return JSON.parse(
    await readFile(path.join(paths.raw, `${name}.json`), "utf8"),
  ) as WebflowItem[];
}

export async function transform() {
  const [people, fellows, projects, editions] = await Promise.all([
    readRaw("people"),
    readRaw("fellows"),
    readRaw("projects"),
    readRaw("editions"),
  ]);
  const manifest = JSON.parse(
    await readFile(paths.manifest, "utf8"),
  ) as Manifest;
  const photo = new Map(
    manifest.entries.map((e) => [`${e.collection}/${e.slug}`, e.path]),
  );

  const report: string[] = [];
  const turndown = new TurndownService({ headingStyle: "atx" });

  // editions -------------------------------------------------------------
  const editionSlugById = new Map<string, string>();
  const editionRows = [];
  for (const item of editions) {
    const slug = String(item.fieldData.slug);
    editionSlugById.set(item.id, slug);
    if (EXCLUDED_EDITION_SLUGS.includes(slug)) {
      report.push(`edition dropped: ${slug}, it never happened`);
      continue;
    }
    const meta = EDITION_META[slug];
    editionRows.push({
      slug,
      name: text(item.fieldData.name),
      city: meta?.city ?? null,
      country: meta?.country ?? null,
      starts_on: meta?.starts_on ?? null,
      ends_on: meta?.ends_on ?? null,
      status: "past" as const,
      summary: null,
      accent_color: null,
      sort_order: meta?.sort_order ?? 0,
    });
  }

  // people and memberships -----------------------------------------------
  const peopleRows = [];
  const membershipRows = [];
  const headlineCsv = [
    "slug,name,headline,guess_job_title,guess_org,separator,confident,reviewed",
  ];

  for (const item of people) {
    const data = item.fieldData;
    const slug = String(data.slug);
    const name = text(data.name) ?? slug;

    if (item.isDraft) {
      report.push(`person dropped, draft: ${name}`);
      continue;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      report.push(`non-ascii slug, needs transliteration: ${slug}`);
    }

    const headline = text(data.role);
    const split = splitHeadline(headline);
    const photoPath = photo.get(`people/${slug}`) ?? null;
    if (!photoPath) report.push(`person without photo: ${name}`);

    peopleRows.push({
      slug,
      full_name: name,
      headline,
      job_title: split.jobTitle,
      org: split.org,
      headline_reviewed: false,
      photo_path: photoPath,
      photo_alt: headline ? `${name}, ${headline}` : name,
      bio: null,
      x_handle: null,
      github: null,
      telegram: null,
      website: null,
    });

    const csv = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
    headlineCsv.push(
      [
        csv(slug),
        csv(name),
        csv(headline),
        csv(split.jobTitle),
        csv(split.org),
        split.separator,
        split.confident,
        "",
      ].join(","),
    );

    const links = (data.editions as string[] | undefined) ?? [];
    if (links.length === 0) {
      report.push(`person with no edition membership, kept anyway: ${name}`);
    }
    for (const editionId of links) {
      const editionSlug = editionSlugById.get(editionId);
      if (!editionSlug || EXCLUDED_EDITION_SLUGS.includes(editionSlug))
        continue;
      membershipRows.push({
        edition_slug: editionSlug,
        person_slug: slug,
        sort_order: Number(data.order ?? 0),
        featured: false,
      });
    }
  }

  // fellows ---------------------------------------------------------------
  const personSlugs = new Set(peopleRows.map((p) => p.slug));
  const fellowRows = fellows.map((item) => {
    const data = item.fieldData;
    const slug = String(data.slug);
    const linked = FELLOW_PERSON_LINKS[slug] ?? null;
    if (linked && !personSlugs.has(linked)) {
      report.push(`fellow ${slug} links to unknown person ${linked}`);
    }
    return {
      slug,
      name: text(data.name) ?? slug,
      bio: text(data.bio),
      photo_path: photo.get(`fellows/${slug}`) ?? null,
      github: url(data.github, report, `fellow ${slug} github`),
      linkedin: url(data.linkedin, report, `fellow ${slug} linkedin`),
      category: FELLOW_CATEGORY_IDS[String(data.category)] ?? null,
      person_slug: linked,
      // Every fellow in this data is from the Chiang Mai fellowship. Confirm
      // before treating it as final.
      edition_slug: CHIANG_MAI,
    };
  });

  // projects --------------------------------------------------------------
  const projectRows = projects.map((item) => {
    const data = item.fieldData;
    const slug = String(data.slug);
    const html = String(data.description ?? "");
    return {
      slug,
      name: text(data.name) ?? slug,
      description: html ? turndown.turndown(html).trim() : null,
      github: url(data.github, report, `project ${slug} github`),
      authors_raw: text(data.authors),
      edition_slug: CHIANG_MAI,
    };
  });

  // write -----------------------------------------------------------------
  await mkdir(paths.out, { recursive: true });
  await mkdir(paths.review, { recursive: true });
  const write = (name: string, rows: unknown) =>
    writeFile(path.join(paths.out, name), JSON.stringify(rows, null, 2));
  await write("editions.json", editionRows);
  await write("people.json", peopleRows);
  await write("edition_people.json", membershipRows);
  await write("fellows.json", fellowRows);
  await write("projects.json", projectRows);
  await writeFile(
    path.join(paths.review, "headlines.csv"),
    headlineCsv.join("\n") + "\n",
  );
  await writeFile(
    path.join(paths.review, "transform-report.txt"),
    report.join("\n") + "\n",
  );

  console.log(`editions        ${editionRows.length}`);
  console.log(`people          ${peopleRows.length}`);
  console.log(`edition_people  ${membershipRows.length}`);
  console.log(`fellows         ${fellowRows.length}`);
  console.log(`projects        ${projectRows.length}`);
  const confident = headlineCsv.length - 1;
  console.log(`headline rows for review: ${confident}`);
  console.log(`report lines: ${report.length}, see data/review/`);
}
