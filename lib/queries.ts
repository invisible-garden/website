import "server-only";
import { createSupabaseClient } from "@/lib/supabase";
import type { EditionRow, PersonRow } from "@/types/database";

/** ISR window for every data-backed route, see tech-design section 6.1. */
export const REVALIDATE_SECONDS = 300;

export type PersonWithEditions = PersonRow & {
  editions: Pick<EditionRow, "slug" | "name">[];
};

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
    .select("*, edition_people(editions(slug, name))")
    .order("full_name", { ascending: true });
  if (error) throw error;

  type Joined = PersonRow & {
    edition_people: { editions: Pick<EditionRow, "slug" | "name"> | null }[];
  };

  return ((data ?? []) as Joined[]).map((person) => {
    const { edition_people, ...rest } = person;
    return {
      ...rest,
      editions: edition_people
        .map((link) => link.editions)
        .filter((edition): edition is Pick<EditionRow, "slug" | "name"> =>
          Boolean(edition),
        ),
    };
  });
}

export async function getPerson(
  slug: string,
): Promise<PersonWithEditions | null> {
  const people = await getPeople();
  return people.find((person) => person.slug === slug) ?? null;
}
