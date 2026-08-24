import type { Database } from "@/types/database";

/**
 * `types/database.ts` is generated from the live schema by `pnpm db:types`
 * (`supabase gen types typescript --linked`). Never hand-edit it. Everything
 * the app imports comes from here instead.
 */

/** Row aliases, so components never spell out the generated type path. */
type Tables = Database["public"]["Tables"];
type Enums = Database["public"]["Enums"];

export type EditionRow = Tables["editions"]["Row"];
export type PersonRow = Tables["people"]["Row"];
export type EditionPersonRow = Tables["edition_people"]["Row"];
export type FellowRow = Tables["fellows"]["Row"];
export type ProjectRow = Tables["projects"]["Row"];
export type PartnerRow = Tables["partners"]["Row"];
export type EditionPartnerRow = Tables["edition_partners"]["Row"];
export type EditionPhotoRow = Tables["edition_photos"]["Row"];

export type EditionInsert = Tables["editions"]["Insert"];
export type PersonInsert = Tables["people"]["Insert"];
export type EditionPersonInsert = Tables["edition_people"]["Insert"];
export type FellowInsert = Tables["fellows"]["Insert"];
export type ProjectInsert = Tables["projects"]["Insert"];

export type FellowCategory = Enums["fellow_category"];
export type PartnerTier = Enums["partner_tier"];
export type EditionStatus = Enums["edition_status"];
