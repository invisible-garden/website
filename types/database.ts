/**
 * PLACEHOLDER. Hand-written to match supabase/migrations/0001_initial.sql so the
 * app typechecks before the schema is applied.
 *
 * Once the migration runs against the project, replace this whole file with:
 *   pnpm db:types
 * (`supabase gen types typescript --linked`). Do not hand-edit it after that,
 * see tech-design section 9.
 */

export type FellowCategory = "academic" | "honorary";
export type PartnerTier = "sponsor" | "community";
export type EditionStatus = "upcoming" | "running" | "past";

export interface EditionRow {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  country: string | null;
  starts_on: string | null;
  ends_on: string | null;
  status: EditionStatus;
  summary: string | null;
  accent_color: string | null;
  sort_order: number;
}

export interface PersonRow {
  id: string;
  slug: string;
  full_name: string;
  /** Webflow `role`, verbatim. Rendered as is unless the split was reviewed. */
  headline: string | null;
  org: string | null;
  job_title: string | null;
  headline_reviewed: boolean;
  /** Storage path such as `people/leo-lara.webp`, never a full URL. */
  photo_path: string | null;
  photo_alt: string | null;
  bio: string | null;
  x_handle: string | null;
  github: string | null;
  telegram: string | null;
  website: string | null;
  created_at: string;
}

export interface EditionPersonRow {
  edition_id: string;
  person_id: string;
  sort_order: number;
  featured: boolean;
}

export interface FellowRow {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  photo_path: string | null;
  github: string | null;
  linkedin: string | null;
  category: FellowCategory | null;
  person_id: string | null;
  edition_id: string | null;
}

export interface ProjectRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  github: string | null;
  authors_raw: string | null;
  edition_id: string | null;
}

export interface PartnerRow {
  id: string;
  slug: string;
  name: string;
  logo_path: string | null;
  url: string | null;
}

export interface EditionPartnerRow {
  edition_id: string;
  partner_id: string;
  tier: PartnerTier;
  sort_order: number;
}

type Table<Row, Required extends keyof Row> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      editions: Table<EditionRow, "slug" | "name">;
      people: Table<PersonRow, "slug" | "full_name">;
      edition_people: Table<EditionPersonRow, "edition_id" | "person_id">;
      fellows: Table<FellowRow, "slug" | "name">;
      projects: Table<ProjectRow, "slug" | "name">;
      partners: Table<PartnerRow, "slug" | "name">;
      edition_partners: Table<
        EditionPartnerRow,
        "edition_id" | "partner_id" | "tier"
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      fellow_category: FellowCategory;
      partner_tier: PartnerTier;
      edition_status: EditionStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
