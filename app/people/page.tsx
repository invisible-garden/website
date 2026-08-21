import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mentors and speakers" };

/**
 * Phase 4: the one genuinely dynamic surface. Server fetches the whole payload
 * once, filtering by edition happens client side. First row gets `priority`,
 * the rest lazy load. See tech-design section 6.2.
 *
 * Framing rule from content-brief 3.5: these people are the community around
 * the project, never the Goa lineup.
 */
export default function PeoplePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 md:px-12">
      <h1 className="text-headline-lg">Mentors and speakers</h1>
      <p className="text-body-lg mt-6">Built in phase 4 from the database.</p>
    </div>
  );
}
