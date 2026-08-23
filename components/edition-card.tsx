import Link from "next/link";
import { Chip } from "@/components/ui/chip";
import { formatDateRange } from "@/lib/dates";
import { eventConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import type { EditionRow } from "@/types/db";

/**
 * `className` carries the surface colour, because the card also sits on the
 * dark track-record band.
 *
 * The upcoming row is Invisible Commons, which is not an Invisible Garden
 * edition: three organisations co-host it and it has its own site. The card
 * says so and links out. Decided 2026-08-23 with the site split. Past
 * editions are Invisible Garden's own and link to their recap here.
 */
export function EditionCard({
  edition,
  className,
  headingLevel = 3,
}: {
  edition: EditionRow;
  className?: string;
  /** 2 when the cards are the page's top-level list, 3 inside a section. */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const upcoming = edition.status === "upcoming";
  const href = upcoming ? eventConfig.url : `/editions/${edition.slug}`;
  const coHosts = eventConfig.organiserNames.filter(
    (name) => name !== "Invisible Garden",
  );
  return (
    <Link
      href={href}
      {...(upcoming ? { rel: "noreferrer" } : {})}
      className={cn(
        "text-ink block rounded-[--radius-card] border border-[color:var(--color-border-subtle)] bg-white p-8 no-underline transition hover:shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* Per-edition accent, `editions.accent_color`. Ink on the accent, which
            is the pairing that holds AA, see tech-design section 7. */}
        <Chip
          tone={upcoming ? "peach" : "sky"}
          style={
            edition.accent_color
              ? { backgroundColor: edition.accent_color, color: "#1a1b1f" }
              : undefined
          }
        >
          {upcoming ? "Co-hosted, upcoming" : "Past edition"}
        </Chip>
        {edition.city ? (
          <Chip tone="outline">
            {edition.city}, {edition.country}
          </Chip>
        ) : null}
      </div>
      <Heading className="text-headline-sm mt-4">{edition.name}</Heading>
      <p className="text-body-sm mt-2 font-mono">
        {formatDateRange(edition.starts_on, edition.ends_on)}
      </p>
      {upcoming ? (
        <p className="text-body-md mt-4">
          Invisible Garden co-hosts this with {coHosts.join(" and ")}. It has
          its own site.
        </p>
      ) : null}
      {edition.summary ? (
        <p className="text-body-md mt-4">{edition.summary}</p>
      ) : null}
      <p className="text-label mt-6 font-mono uppercase">
        {upcoming ? "Go to invisiblecommons.org" : "Read the recap"}
      </p>
    </Link>
  );
}
