import type { Metadata } from "next";

export const metadata: Metadata = { title: "Partners" };

/**
 * Phase 4. The partner list has no source data in Webflow and gets re-authored
 * by hand, roughly 35 rows, see tech-design section 5.6.
 */
export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 md:px-12">
      <h1 className="text-headline-lg">Partners</h1>
      <p className="text-body-lg mt-6">Built in phase 4 from the database.</p>
    </div>
  );
}
