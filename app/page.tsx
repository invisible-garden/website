import type { Metadata } from "next";
import { Community } from "@/components/home/community";
import { Hero } from "@/components/home/hero";
import { TrackRecord } from "@/components/home/track-record";
import { WhatNext } from "@/components/home/what-next";
import { getEditions, getPeople } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

// Statically generated and refreshed every 5 minutes. The data behind it is
// refreshed in step, see the cache window in lib/supabase.ts.
export const revalidate = 300;

export const metadata: Metadata = {
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

/**
 * The homepage is Invisible Garden's front door. Section order follows
 * mb/ig/ig-homepage-brief.md: heading, what next, track record, community.
 *
 * It used to be a page about the 2026 event, content-brief 3.1. That event now
 * has its own site at invisiblecommons.org, so the format, subjects and
 * practical blocks moved there and the homepage links out instead.
 */
export default async function HomePage() {
  const [people, editions] = await Promise.all([getPeople(), getEditions()]);

  // A sample of the community, the full directory lives at /people. getPeople
  // already ranks by Webflow's prominence order, so this takes the top of that
  // list, skipping the one person with no photo.
  const featured = people.filter((person) => person.photo_path).slice(0, 12);

  return (
    <>
      <Hero />
      <WhatNext />
      <TrackRecord editions={editions} />
      <Community people={featured} />
    </>
  );
}
