import type { Metadata } from "next";
import { EditionCard } from "@/components/edition-card";
import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Section, SectionHeading } from "@/components/ui/section";
import { getEditions } from "@/lib/queries";

// Statically generated and refreshed every 5 minutes. The data behind it is
// refreshed in step, see the cache window in lib/supabase.ts.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Editions",
  description:
    "Invisible Garden editions and other events, from Chiang Mai in 2024 onwards.",
  alternates: { canonical: "/editions" },
};

export default async function EditionsPage() {
  const editions = await getEditions();

  return (
    <>
      <Section>
        <SectionHeading
          label="Editions"
          title="Where Invisible Garden has happened"
          level={1}
          intro="Each Invisible Garden gathering runs in a different city, with its own cohort, mentors, and outcomes."
        />

        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {editions.map((edition) => (
            <li key={edition.slug}>
              <EditionCard edition={edition} headingLevel={2} />
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="paper">
        <SectionHeading
          label="Beyond the editions"
          title="Other events"
          intro="Other ways the Invisible Garden community has come together."
        />
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <article>
            <h3 className="text-headline-sm">Machine-Checked Devcon Week</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <Chip>Online hackathon</Chip>
              <Chip tone="outline">2 to 7 November 2026</Chip>
            </div>
            <p className="text-body-lg mt-4 max-w-2xl">
              An online hackathon during Devcon week to implement and prove
              Ethereum&apos;s networking layer in Lean 4.
            </p>
            <div className="mt-6">
              <ButtonLink href="/machine-checked-devcon">
                See the hackathon
              </ButtonLink>
            </div>
          </article>
          <article>
            <h3 className="text-headline-sm">
              Invisible Garden Reunion, India
            </h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <Chip tone="sage">27 October to 7 November 2026</Chip>
              <Chip tone="outline">India</Chip>
            </div>
            <p className="text-body-lg mt-4 max-w-2xl">
              A community reunion scheduled to overlap Devcon 8 in Mumbai, 3 to
              6 November 2026.
            </p>
          </article>
        </div>
      </Section>
    </>
  );
}
