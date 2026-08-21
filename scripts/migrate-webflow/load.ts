import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { EXPECTED, paths, requireEnv } from "./config";
import type { Database } from "../../types/database";

/**
 * Phase 5: upsert data/out/ into Supabase on `slug`, in dependency order.
 * Relations arrive as slugs and get resolved to uuids here.
 *
 * Idempotent: a second run changes nothing. Re-run it after the headline
 * review pass, see implementation-plan 2.4.
 */

type Client = SupabaseClient<Database>;

async function readOut<T>(name: string): Promise<T[]> {
  return JSON.parse(
    await readFile(path.join(paths.out, `${name}.json`), "utf8"),
  ) as T[];
}

async function idsBySlug(client: Client, table: "editions" | "people") {
  const { data, error } = await client.from(table).select("id, slug");
  if (error) throw error;
  return new Map((data ?? []).map((row) => [row.slug, row.id]));
}

export async function load() {
  const client = createClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SECRET_KEY"),
    { auth: { persistSession: false } },
  );

  const editions = await readOut<Record<string, unknown>>("editions");
  const { error: edErr } = await client
    .from("editions")
    .upsert(editions as never, { onConflict: "slug" });
  if (edErr) throw edErr;

  const people = await readOut<Record<string, unknown>>("people");
  const { error: peopleErr } = await client
    .from("people")
    .upsert(people as never, { onConflict: "slug" });
  if (peopleErr) throw peopleErr;

  const editionId = await idsBySlug(client, "editions");
  const personId = await idsBySlug(client, "people");

  const memberships = await readOut<{
    edition_slug: string;
    person_slug: string;
    sort_order: number;
    featured: boolean;
  }>("edition_people");
  const membershipRows = memberships.map((m) => ({
    edition_id: editionId.get(m.edition_slug)!,
    person_id: personId.get(m.person_slug)!,
    sort_order: m.sort_order,
    featured: m.featured,
  }));
  const { error: memErr } = await client
    .from("edition_people")
    .upsert(membershipRows, { onConflict: "edition_id,person_id" });
  if (memErr) throw memErr;

  const fellows = await readOut<
    Record<string, unknown> & {
      edition_slug: string;
      person_slug: string | null;
    }
  >("fellows");
  const fellowRows = fellows.map(({ edition_slug, person_slug, ...rest }) => ({
    ...rest,
    edition_id: editionId.get(edition_slug) ?? null,
    person_id: person_slug ? (personId.get(person_slug) ?? null) : null,
  }));
  const { error: felErr } = await client
    .from("fellows")
    .upsert(fellowRows as never, { onConflict: "slug" });
  if (felErr) throw felErr;

  const projects = await readOut<
    Record<string, unknown> & { edition_slug: string }
  >("projects");
  const projectRows = projects.map(({ edition_slug, ...rest }) => ({
    ...rest,
    edition_id: editionId.get(edition_slug) ?? null,
  }));
  const { error: projErr } = await client
    .from("projects")
    .upsert(projectRows as never, { onConflict: "slug" });
  if (projErr) throw projErr;

  const counts: Record<string, number> = {};
  for (const table of [
    "editions",
    "people",
    "edition_people",
    "fellows",
    "projects",
  ] as const) {
    const { count, error } = await client
      .from(table)
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    counts[table] = count ?? 0;
  }

  console.log("loaded:");
  for (const [table, count] of Object.entries(counts)) {
    console.log(`  ${table.padEnd(16)} ${count}`);
  }
  // EXPECTED.people is 87 in the plan, which assumed the person with no edition
  // membership would be dropped. Leo decided on 2026-08-21 to keep her, so 88.
  console.log(
    `expected: editions ${EXPECTED.editions}, people 88, memberships ${EXPECTED.memberships}, fellows ${EXPECTED.fellows}, projects ${EXPECTED.projects}`,
  );
}
