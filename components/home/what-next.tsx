import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Section, SectionHeading } from "@/components/ui/section";
import { eventConfig } from "@/lib/site-config";

/**
 * What Invisible Garden is doing next, per mb/ig/ig-homepage-brief.md
 * section 2.
 *
 * Framing rule: Invisible Commons is an event Invisible Garden co-hosts, one
 * of three organisations, never "the next Invisible Garden edition". The event
 * is described in full on its own site, so this section says what it is, when,
 * and where to read the rest.
 */
export function WhatNext() {
  const others = eventConfig.organiserNames.filter(
    (name) => name !== "Invisible Garden",
  );

  return (
    <Section>
      <SectionHeading
        label="What next"
        title={`${eventConfig.name}, ${eventConfig.city}, October 2026`}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <Chip>{eventConfig.datesLabel}</Chip>
        <Chip tone="sage">
          {eventConfig.city}, {eventConfig.country}
        </Chip>
      </div>

      <div className="text-body-lg mt-6 max-w-2xl space-y-4">
        <p>
          Invisible Garden co-hosts {eventConfig.name} with{" "}
          {others.join(" and ")}, three organisations with equal weight. Two
          weeks of talks, co-working, and building, in {eventConfig.city},{" "}
          {eventConfig.country}.
        </p>
        <p>
          It ends three days before {eventConfig.devcon.name} in{" "}
          {eventConfig.devcon.city}, {eventConfig.devcon.datesLabel}.
        </p>
      </div>

      <div className="mt-8">
        <ButtonLink href={eventConfig.url}>
          Read about {eventConfig.name}
        </ButtonLink>
      </div>
    </Section>
  );
}
