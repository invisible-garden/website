import { Section, SectionHeading } from "@/components/ui/section";
import { eventConfig } from "@/lib/site-config";

const CHECKLIST = [
  "Speakers propose and book their own sessions",
  "Residents choose what to attend, nothing is mandatory",
  "No required project, no graduation, no stand-ups",
  "The schedule emerges from the people who show up",
];

/**
 * What Invisible Commons is. Text left, checklist card right, the layout the
 * mock-up got right.
 *
 * DEFERRED: one or two lines about each co-host. Common Compute and OpenBuild
 * each need to supply and approve their own description, content-brief 6.3.
 */
export function FormatExplainer() {
  const organisers = eventConfig.organiserNames;
  return (
    <Section>
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <SectionHeading
            label="The format"
            title="An unconference, not a residency"
          />
          <div className="text-body-lg mt-6 space-y-4">
            <p>
              Previous Invisible Garden editions were residencies. Builders
              applied, a cohort was selected, and the schedule was set in
              advance. {eventConfig.name} works differently.
            </p>
            <p>
              Speakers book their own talks. Builder residents come to work and
              attend what is useful to them. Two weeks of talks, co-working, and
              shipping, with the people who care about the same problems.
            </p>
            <p>
              It is a joint project of {organisers.slice(0, -1).join(", ")} and{" "}
              {organisers.at(-1)}.
            </p>
          </div>
        </div>

        <ul className="h-fit rounded-[--radius-card] border border-[color:var(--color-border-subtle)] p-8 shadow-[var(--shadow-soft)]">
          {CHECKLIST.map((item) => (
            <li
              key={item}
              className="text-body-md flex gap-3 border-b border-[color:var(--color-border-subtle)] py-4 first:pt-0 last:border-0 last:pb-0"
            >
              <span aria-hidden className="text-blue-deep">
                &#10003;
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
