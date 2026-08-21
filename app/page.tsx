import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  description: siteConfig.description,
};

/**
 * Homepage skeleton. Section order follows content-brief section 3.1:
 * hero, what it is, subjects, practical block, community grid, past partners,
 * track record, footer. Real copy lands in content/home.mdx once the blocking
 * decisions in content-brief section 6 are answered. The community and partner
 * sections read from Supabase in phase 4.
 */
export default function HomePage() {
  const { edition } = siteConfig;
  return (
    <div>
      <section className="bg-horizon px-4 py-24 text-white md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-label font-mono uppercase">
            {siteConfig.organisers.join("  +  ")}
          </p>
          <h1 className="font-display text-display mt-6 max-w-3xl">
            {siteConfig.name}
          </h1>
          <p className="text-body-lg mt-6 max-w-2xl">
            {siteConfig.description}
          </p>
          <p className="text-label mt-8 font-mono uppercase">
            {edition.city}, {edition.country} &middot; 17 to 31 October 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-12">
        <h2 className="text-headline-lg">Copy pending</h2>
        <p className="text-body-lg mt-4 max-w-2xl">
          The remaining sections are built in phase 4: what Invisible Commons
          is, the subjects, the practical block, the community grid, partners of
          previous editions, and the track record strip.
        </p>
      </section>
    </div>
  );
}
