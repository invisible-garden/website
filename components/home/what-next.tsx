import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Section, SectionHeading } from "@/components/ui/section";

/**
 * What Invisible Garden is doing next, per mb/ig/ig-homepage-brief.md
 * section 2 and its updates.
 *
 * Decided by Leo on 2026-10-26: the featured upcoming event is the
 * Machine-Checked Devcon Week hackathon, linked to its page. It is never
 * framed as an Invisible Garden edition: it is an online hackathon, a
 * different kind of thing from the pop-up editions. The facts live in the
 * participant page brief and app/machine-checked-devcon/page.tsx, this
 * section only points at them.
 *
 * The India reunion stays as a secondary block: it was decided 2026-09-03,
 * overlaps the hackathon, and still has no details to link to.
 */

/** Facts as decided in the participant page brief. Kept local, the hackathon
 *  page is the source of truth for every number. */
const hackathon = {
  name: "Machine-Checked Devcon Week",
  datesLabel: "2 to 7 November 2026",
  deadlineLabel: "Apply by 1 November",
  path: "/machine-checked-devcon",
} as const;

/** Reunion facts as decided by Leo on 2026-09-03. No city yet, India only. */
const reunion = {
  name: "Invisible Garden Reunion",
  country: "India",
  datesLabel: "27 October to 7 November 2026",
  /** Devcon 8 runs 3 to 6 November 2026 in Mumbai, so the reunion overlaps
   *  it. Stated as fact, no anchoring claim, that decision is still open. */
  devcon: {
    name: "Devcon 8",
    city: "Mumbai",
    datesLabel: "3 to 6 November 2026",
  },
} as const;

export function WhatNext() {
  return (
    <Section>
      <SectionHeading label="What next" title={hackathon.name} />

      <div className="mt-6 flex flex-wrap gap-3">
        <Chip>Online hackathon</Chip>
        <Chip tone="outline">{hackathon.datesLabel}</Chip>
        <Chip tone="peach">{hackathon.deadlineLabel}</Chip>
      </div>

      <div className="text-body-lg mt-6 max-w-2xl space-y-4">
        <p>
          An online hackathon during Devcon week. A different thing from our
          editions: no pop-up city, one repo, one week of building.
        </p>
        <p>
          Implement and prove Ethereum&apos;s networking layer in Lean 4, with
          every proof checked by the kernel. A curated cohort under ten, prizes,
          free to join.
        </p>
      </div>

      <div className="mt-8">
        <ButtonLink href={hackathon.path}>See the hackathon</ButtonLink>
      </div>

      <div className="mt-12 border-t border-[color:var(--color-border-subtle)] pt-8">
        <h3 className="text-headline-sm">
          {reunion.name}, {reunion.country}
        </h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Chip tone="sage">{reunion.datesLabel}</Chip>
          <Chip tone="outline">{reunion.country}</Chip>
        </div>
        <p className="text-body-lg mt-4 max-w-2xl">
          Twelve days in {reunion.country}, with the community from previous
          editions, overlapping {reunion.devcon.name} in {reunion.devcon.city},{" "}
          {reunion.devcon.datesLabel}. Details to be announced.
        </p>
      </div>
    </Section>
  );
}
