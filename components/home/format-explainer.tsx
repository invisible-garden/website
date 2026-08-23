import { Section, SectionHeading } from "@/components/ui/section";
import { eventConfig } from "@/lib/site-config";

const CHECKLIST = [
  "Speakers propose and book their own sessions",
  "Residents choose what to attend, nothing is mandatory",
  "No required project, no graduation, no stand-ups",
  "The schedule emerges from the people who show up",
];

/** What Invisible Commons is. Text left, checklist card right. */
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
              There is no cohort and no selection. Speakers book their own
              talks. Builders come to work, and go to the sessions that are
              useful to them.
            </p>
            <p>
              Two weeks of talks, co-working, and shipping, with the people who
              care about the same problems. What you leave with is what you
              made.
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
              <span aria-hidden className="text-teal-deep">
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
