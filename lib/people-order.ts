/**
 * Webflow's `order` field on Speakers & Mentors is a prominence ranking, higher
 * first. Values run from 1 to 1001 and 24 of the 88 people have none, which
 * migrated as 0 and sorts them last. Name breaks ties, so the order is stable
 * between builds.
 *
 * The value lives on `edition_people.sort_order`, once per membership. It is a
 * person-level number in the source, so the highest membership value is the
 * person's rank.
 */
export interface Rankable {
  full_name: string;
  order: number;
}

export function byProminence(a: Rankable, b: Rankable): number {
  if (a.order !== b.order) return b.order - a.order;
  return a.full_name.localeCompare(b.full_name, "en");
}

export function personOrder(sortOrders: number[]): number {
  return sortOrders.length === 0 ? 0 : Math.max(...sortOrders);
}
