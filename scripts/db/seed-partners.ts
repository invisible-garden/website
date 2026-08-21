import "dotenv/config";
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database";

/**
 * Loads a confirmed partner list into `partners` and `edition_partners`.
 *
 * Deliberately not run yet. content/partners.draft.json is a checklist
 * recovered from the old site, and tech-design 5.6 asks for a human to
 * re-author the real list, with tiers and link URLs. Point this script at the
 * file once it is confirmed:
 *
 *   pnpm tsx scripts/db/seed-partners.ts content/partners.confirmed.json
 *
 * Idempotent, upserts on slug.
 */
interface DraftPartner {
  slug: string;
  name: string;
  url: string | null;
  logo_candidate: string | null;
  editions: { edition: string; tier: "sponsor" | "community" }[];
}

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: seed-partners.ts <partners.json>");
  const parsed = JSON.parse(await readFile(file, "utf8")) as {
    partners: DraftPartner[];
  };

  const client = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );

  const { error: partnerError } = await client.from("partners").upsert(
    parsed.partners.map((partner) => ({
      slug: partner.slug,
      name: partner.name,
      url: partner.url,
      logo_path: partner.logo_candidate,
    })),
    { onConflict: "slug" },
  );
  if (partnerError) throw partnerError;

  const { data: partnerRows, error: readPartners } = await client
    .from("partners")
    .select("id, slug");
  if (readPartners) throw readPartners;
  const { data: editionRows, error: readEditions } = await client
    .from("editions")
    .select("id, slug");
  if (readEditions) throw readEditions;

  const partnerId = new Map((partnerRows ?? []).map((r) => [r.slug, r.id]));
  const editionId = new Map((editionRows ?? []).map((r) => [r.slug, r.id]));

  const links = parsed.partners.flatMap((partner, index) =>
    partner.editions.map((link) => ({
      partner_id: partnerId.get(partner.slug)!,
      edition_id: editionId.get(link.edition)!,
      tier: link.tier,
      sort_order: index,
    })),
  );
  const { error: linkError } = await client
    .from("edition_partners")
    .upsert(links, { onConflict: "edition_id,partner_id,tier" });
  if (linkError) throw linkError;

  console.log(
    `loaded ${parsed.partners.length} partners, ${links.length} links`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
