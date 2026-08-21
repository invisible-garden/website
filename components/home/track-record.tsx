import { EditionCard } from "@/components/edition-card";
import { StatBand } from "@/components/stat-band";
import { Section, SectionHeading } from "@/components/ui/section";
import { EDITION_CONTENT } from "@/lib/edition-content";
import type { EditionRow } from "@/types/db";

/**
 * Track record. The homepage's only look backwards, content-brief 3.1 item 7.
 * Totals are summed from the per-edition numbers in lib/edition-content.ts, so
 * a correction there flows through here instead of drifting.
 */
function total(key: number): string {
  const editions = Object.values(EDITION_CONTENT);
  const sum = editions.reduce((acc, edition) => {
    const raw = edition.stats[key]?.value.replace(/[^0-9]/g, "") ?? "0";
    return acc + Number(raw);
  }, 0);
  return sum.toLocaleString("en-GB");
}

export function TrackRecord({ editions }: { editions: EditionRow[] }) {
  const past = editions.filter((edition) => edition.status === "past");
  const stats = [
    { value: String(past.length), label: "editions" },
    { value: `${total(0)}+`, label: "applications" },
    { value: `${total(1)}`, label: "builders on site" },
    { value: `${total(2)}+`, label: "workshops" },
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
