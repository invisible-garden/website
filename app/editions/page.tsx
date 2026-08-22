import type { Metadata } from "next";
import { EditionCard } from "@/components/edition-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { getEditions } from "@/lib/queries";

// ISR, see tech-design 6.1. Next requires a literal here.
export const revalidate = 300;
// Read the database on every regeneration. Without this the page rebuilds on
// schedule and replays cached rows, so an edit never lands, see lib/supabase.ts.
export const fetchCache = "default-no-store";

export const metadata: Metadata = {
  title: "Editions",
  description:
    "Every Invisible Garden gathering, from Chiang Mai in 2024 onwards.",
  alternates: { canonical: "/editions" },
};

export default async function EditionsPage() {
  const editions = await getEditions();
  const upcoming = editions.filter((e) => e.status !== "past");
  const past = editions.filter((e) => e.status === "past");

  return (
    <Section>
      <SectionHeading
        label="Editions"
        title="Where Invisible Garden has happened"
        level={1}
        intro="Each gathering runs in a different city, with its own cohort, mentors, and outcomes."
      />

      {upcoming.length > 0 ? (
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {upcoming.map((edition) => (
            <li key={edition.slug}>
              <EditionCard edition={edition} headingLevel={2} />
            </li>
          ))}
        </ul>
      ) : null}

      <ul className="mt-6 grid gap-6 md:grid-cols-2">
        {past.map((edition) => (
          <li key={edition.slug}>
            <EditionCard edition={edition} headingLevel={2} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
