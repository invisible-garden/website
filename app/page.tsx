import type { Metadata } from "next";
import { Community } from "@/components/home/community";
import { FormatExplainer } from "@/components/home/format-explainer";
import { Hero } from "@/components/home/hero";
import { PastPartners } from "@/components/home/past-partners";
import { Practical } from "@/components/home/practical";
import { Subjects } from "@/components/home/subjects";
import { TrackRecord } from "@/components/home/track-record";
import { getEditions, getPartners, getPeople } from "@/lib/queries";
import { eventConfig } from "@/lib/site-config";

// Rendered per request, so an edit in Supabase shows up at once. The edge
// caches the result for a minute, see the headers in next.config.ts, so the
// database is not queried for every visitor.
export const fetchCache = "default-no-store";

export const metadata: Metadata = {
  title: eventConfig.name,
  description: eventConfig.descriptor,
  alternates: { canonical: "/" },
};

/**
 * The homepage is the one page about the 2026 event. Section order follows
 * content-brief 3.1: hero, format, subjects, practical, community, past
 * partners, track record.
 */
export default async function HomePage() {
  const [people, editions, partners] = await Promise.all([
    getPeople(),
    getEditions(),
    getPartners(),
  ]);

  // A sample of the community, the full directory lives at /people. getPeople
  // already ranks by Webflow's prominence order, so this takes the top of that
  // list, skipping the one person with no photo.
  const featured = people.filter((person) => person.photo_path).slice(0, 12);

  return (
    <>
      <Hero />
      <FormatExplainer />
      <Subjects />
      <Practical />
      <Community people={featured} />
      <PastPartners partners={partners} />
      <TrackRecord editions={editions} />
    </>
  );
}
