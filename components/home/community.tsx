import Link from "next/link";
import { PersonCard } from "@/components/person-card";
import { Section, SectionHeading } from "@/components/ui/section";
import type { PersonWithEditions } from "@/lib/queries";

/**
 * The community grid.
 *
 * Framing rule, content-brief 3.1 item 5: these are the people who taught at
 * previous gatherings. Nothing here may suggest a Goa lineup, so no "our
 * speakers", no "meet the mentors", no "who you will meet".
 */
export function Community({ people }: { people: PersonWithEditions[] }) {
  if (people.length === 0) return null;
  return (
    <Section tone="paper">
      <SectionHeading
        label="Community"
        title="The Invisible Garden community"
        intro="Mentors and speakers who have taught at previous Invisible Garden gatherings. The lineup for Goa is not confirmed yet."
      />

      <ul className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {people.map((person) => (
          <li key={person.slug}>
            <PersonCard person={person} />
          </li>
        ))}
      </ul>

      <p className="mt-10">
        <Link href="/people" className="text-label font-mono uppercase">
          All mentors and speakers
        </Link>
      </p>
    </Section>
  );
}
