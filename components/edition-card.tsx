import Link from "next/link";
import { Chip } from "@/components/ui/chip";
import { formatDateRange } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { EditionRow } from "@/types/db";

/** `className` carries the surface colour, because the card also sits on the
 *  dark track-record band. */
export function EditionCard({
  edition,
  className,
}: {
  edition: EditionRow;
  className?: string;
}) {
  const upcoming = edition.status === "upcoming";
  const href = upcoming ? "/" : `/editions/${edition.slug}`;
  return (
    <Link
      href={href}
      className={cn(
        "text-ink block rounded-[--radius-card] border border-[color:var(--color-border-subtle)] bg-white p-8 no-underline transition hover:shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Chip tone={upcoming ? "peach" : "sky"}>
          {upcoming ? "Upcoming" : "Past edition"}
        </Chip>
        {edition.city ? (
          <Chip tone="outline">
            {edition.city}, {edition.country}
          </Chip>
        ) : null}
      </div>
      <h3 className="text-headline-sm mt-4">{edition.name}</h3>
      <p className="text-body-sm mt-2 font-mono">
        {formatDateRange(edition.starts_on, edition.ends_on)}
      </p>
      {edition.summary ? (
        <p className="text-body-md mt-4">{edition.summary}</p>
      ) : null}
      <p className="text-label mt-6 font-mono uppercase">
        {upcoming ? "See what is planned" : "Read the recap"}
      </p>
    </Link>
  );
}
