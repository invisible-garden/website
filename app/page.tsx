import type { Metadata } from "next";
import { Community } from "@/components/home/community";
import { Hero } from "@/components/home/hero";
import { PastSupport } from "@/components/home/past-support";
import { TrackRecord } from "@/components/home/track-record";
import { WhatNext } from "@/components/home/what-next";
import { getEditions, getPartners, getPeople } from "@/lib/queries";
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
 * mb/ig/ig-homepage-brief.md: heading, what next, track record, community,
 * plus the support band Leo added on 2026-08-23.
 *
 * It used to be a page about the 2026 event, content-brief 3.1. That event now
 * has its own site at invisiblecommons.org, so the format, subjects and
 * practical blocks moved there and the homepage links out instead.
 */
export default async function HomePage() {
  const [people, editions, partners] = await Promise.all([
    getPeople(),
    getEditions(),
    getPartners(),
  ]);

  // A sample of the community, the full directory lives at /people. getPeople
  // already ranks by Webflow's prominence order, so this takes the top of that
  // list, skipping the one person with no photo. 18 fills three rows of the
  // six-wide grid, which is the row Leo asked for on 2026-08-23.
  const featured = people.filter((person) => person.photo_path).slice(0, 18);

  return (
    <>
      <Hero />
      <WhatNext />
      <TrackRecord editions={editions} />
      <Community people={featured} />
      <PastSupport partners={partners} />
    </>
  );
}
