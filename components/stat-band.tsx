import type { EditionStat } from "@/lib/edition-content";

/** Compact numbers band. Understatement: the numbers do the selling. */
export function StatBand({ stats }: { stats: EditionStat[] }) {
  if (stats.length === 0) return null;
  return (
    <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            <span className="font-display text-headline-lg block">
              {stat.value}
            </span>
            <span className="text-body-sm mt-1 block font-mono uppercase">
              {stat.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
