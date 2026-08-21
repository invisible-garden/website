import type { Metadata } from "next";
import { PeopleDirectory } from "@/components/people-directory";
import { Section, SectionHeading } from "@/components/ui/section";
import { getEditions, getPeople } from "@/lib/queries";

// ISR, see tech-design 6.1. Next requires a literal here.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Mentors and speakers",
  description:
    "The mentors and speakers who have taught at Invisible Garden gatherings since 2024.",
};

/**
 * Framing rule from content-brief 3.5: these people are the community around
 * Invisible Garden, never a lineup for an upcoming edition.
 */
export default async function PeoplePage() {
  const [people, editions] = await Promise.all([getPeople(), getEditions()]);

  return (
    <Section>
      <SectionHeading
        label="Community"
        title="Mentors and speakers"
        level={1}
        intro="Everyone who has taught, spoken, or mentored at an Invisible Garden gathering since 2024. Filter by edition."
      />
      <div className="mt-10">
        <PeopleDirectory
          people={people}
          editions={editions.map((e) => ({ slug: e.slug, name: e.name }))}
        />
      </div>
    </Section>
  );
}
