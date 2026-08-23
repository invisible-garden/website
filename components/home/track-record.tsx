import { EditionCard } from "@/components/edition-card";
import { StatBand } from "@/components/stat-band";
import { Section, SectionHeading } from "@/components/ui/section";
import { sumStat } from "@/lib/edition-content";
import type { EditionRow } from "@/types/db";

/**
 * Track record, the homepage's only look backwards. Totals are summed from the
 * per-edition numbers in lib/edition-content.ts, so a correction there flows
 * through here instead of drifting.
 *
 * They are exact figures from the recap sources, so they are published exact,
 * with no "+" softening them.
 */
const format = (value: number) => value.toLocaleString("en-GB");

export function TrackRecord({ editions }: { editions: EditionRow[] }) {
  const past = editions.filter((edition) => edition.status === "past");
  const stats = [
    { value: String(past.length), label: "editions" },
    { value: format(sumStat("applications")), label: "applications" },
    { value: format(sumStat("builders on site")), label: "builders on site" },
    { value: format(sumStat("workshops")), label: "workshops" },
  ];

  return (
    <Section tone="ink">
      <SectionHeading
        label="Track record"
        title="What came before"
        className="[&_h2]:text-white [&_p]:text-white"
      />
      <div className="mt-10">
        <StatBand stats={stats} />
      </div>
      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {past.map((edition) => (
          <li key={edition.slug}>
            <EditionCard edition={edition} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
