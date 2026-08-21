import "server-only";
import { createSupabaseClient } from "@/lib/supabase";
import type {
  EditionRow,
  FellowRow,
  PartnerRow,
  PartnerTier,
  PersonRow,
  ProjectRow,
} from "@/types/db";

/**
 * ISR window for every data-backed route is 300 seconds, see tech-design 6.1.
 * Next needs `export const revalidate = 300` as a literal in each page file, so
 * it cannot be imported from here.
 */

export type EditionRef = Pick<EditionRow, "slug" | "name">;

export type PersonWithEditions = PersonRow & {
  editions: EditionRef[];
};

type PersonJoined = PersonRow & {
  edition_people: {
    sort_order: number;
    editions: EditionRef | null;
  }[];
};

function flattenPerson(person: PersonJoined): PersonWithEditions {
  const { edition_people, ...rest } = person;
  return {
    ...rest,
    editions: edition_people
      .map((link) => link.editions)
      .filter((edition): edition is EditionRef => Boolean(edition)),
  };
}

export async function getEditions(): Promise<EditionRow[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("editions")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getEdition(slug: string): Promise<EditionRow | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("editions")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Everyone, with the editions they appeared in. The directory ships this whole
 * payload once and filters client side, see tech-design section 6.2.
 */
export async function getPeople(): Promise<PersonWithEditions[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("people")
    .select("*, edition_people(sort_order, editions(slug, name))")
    .order("full_name", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as PersonJoined[]).map(flattenPerson);
}

export async function getPerson(
  slug: string,
): Promise<PersonWithEditions | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("people")
    .select("*, edition_people(sort_order, editions(slug, name))")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? flattenPerson(data as PersonJoined) : null;
}

/** People of one edition, in the order the old site used. */
export async function getEditionPeople(
  editionSlug: string,
): Promise<PersonRow[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("edition_people")
    .select("sort_order, people(*), editions!inner(slug)")
    .eq("editions.slug", editionSlug)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  type Row = { sort_order: number; people: PersonRow | null };
  return ((data ?? []) as unknown as Row[])
    .map((row) => row.people)
    .filter((person): person is PersonRow => Boolean(person));
}

/** The fellowship record for a person, when the same human is in both tables.
 *  Three exist: Tim Pechersky, Daniel Arroyo, and Surfer_05 who is Surfer. */
export async function getFellowForPerson(
  personId: string,
): Promise<(FellowRow & { edition: EditionRef | null }) | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("fellows")
    .select("*, editions(slug, name)")
    .eq("person_id", personId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { editions, ...fellow } = data as FellowRow & {
    editions: EditionRef | null;
  };
  return { ...fellow, edition: editions };
}

export async function getFellows(editionSlug?: string): Promise<FellowRow[]> {
  const supabase = createSupabaseClient();
  let query = supabase.from("fellows").select("*, editions(slug)");
  if (editionSlug) query = query.eq("editions.slug", editionSlug);
  const { data, error } = await query.order("name", { ascending: true });
  if (error) throw error;
  type Row = FellowRow & { editions: { slug: string } | null };
  return ((data ?? []) as Row[])
    .filter((row) => !editionSlug || row.editions?.slug === editionSlug)
    .map((row): FellowRow => {
      const { editions, ...fellow } = row;
      void editions;
      return fellow;
    });
}

export async function getProjects(editionSlug?: string): Promise<ProjectRow[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, editions(slug)")
    .order("name", { ascending: true });
  if (error) throw error;
  type Row = ProjectRow & { editions: { slug: string } | null };
  return ((data ?? []) as Row[])
    .filter((row) => !editionSlug || row.editions?.slug === editionSlug)
    .map((row): ProjectRow => {
      const { editions, ...project } = row;
      void editions;
      return project;
    });
}

export type PartnerWithTier = PartnerRow & { tier: PartnerTier };

/**
 * Partners of one edition, split by tier. Empty until the list is re-authored,
 * tech-design 5.6, so every partner surface must handle that.
 */
export async function getEditionPartners(
  editionSlug: string,
): Promise<PartnerWithTier[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("edition_partners")
    .select("tier, sort_order, partners(*), editions!inner(slug)")
    .eq("editions.slug", editionSlug)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  type Row = { tier: PartnerTier; partners: PartnerRow | null };
  return ((data ?? []) as unknown as Row[])
    .filter((row): row is Row & { partners: PartnerRow } =>
      Boolean(row.partners),
    )
    .map((row) => ({ ...row.partners, tier: row.tier }));
}

/**
 * Partners have no source data in Webflow, so this returns nothing until the
 * list is re-authored by hand, see tech-design 5.6. Every partner surface must
 * handle the empty case.
 */
export async function getPartners(): Promise<PartnerRow[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
