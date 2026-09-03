import { Chip } from "@/components/ui/chip";
import { Section, SectionHeading } from "@/components/ui/section";

/**
 * What Invisible Garden is doing next, per mb/ig/ig-homepage-brief.md
 * section 2.
 *
 * Invisible Commons was called off after the 2026-08-23 site split, decided
 * 2026-09-03. The next event is Invisible Garden's own again: a reunion in
 * India, 27 October to 7 November 2026. Only the dates and the country are
 * set, so this section says exactly that and stops. The details button is a
 * placeholder, not a link; it becomes a ButtonLink when there is a page to
 * send people to.
 */

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
      <SectionHeading
        label="What next"
        title={`${reunion.name}, ${reunion.country}`}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <Chip>{reunion.datesLabel}</Chip>
        <Chip tone="sage">{reunion.country}</Chip>
      </div>

      <div className="text-body-lg mt-6 max-w-2xl space-y-4">
        <p>
          Twelve days in {reunion.country}, with the community from previous
          editions.
        </p>
        <p>
          It overlaps {reunion.devcon.name} in {reunion.devcon.city},{" "}
          {reunion.devcon.datesLabel}.
        </p>
      </div>

      <div className="mt-8">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="text-body-md bg-blue-deep inline-flex cursor-not-allowed items-center rounded-full px-6 py-3 font-medium text-white opacity-70"
        >
          Details to be announced
        </button>
      </div>
    </Section>
  );
}
