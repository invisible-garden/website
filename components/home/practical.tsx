import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Section, SectionHeading } from "@/components/ui/section";
import { eventConfig, siteConfig } from "@/lib/site-config";

/**
 * Practical block.
 *
 * DEFERRED, and visibly so: the participation model, whether there is a
 * ticket, a scholarship or nothing to pay, and how speakers book a talk. The
 * card says that plainly rather than inventing terms. The place is the region
 * only, the venue agreement is not closed.
 */
export function Practical() {
  return (
    <Section tone="paper">
      <SectionHeading label="Practical" title="When, where, and how to join" />

      <dl className="mt-10 grid gap-8 md:grid-cols-3">
        <div>
          <dt className="text-label font-mono uppercase">Dates</dt>
          <dd className="text-headline-sm mt-2">{eventConfig.datesLabel}</dd>
        </div>
        <div>
          <dt className="text-label font-mono uppercase">Place</dt>
          <dd className="text-headline-sm mt-2">
            {eventConfig.city}, {eventConfig.country}
          </dd>
        </div>
        <div>
          <dt className="text-label font-mono uppercase">Format</dt>
          <dd className="text-headline-sm mt-2">Unconference, two weeks</dd>
        </div>
      </dl>

      <p className="text-body-lg mt-10 max-w-2xl">
        {eventConfig.name} ends three days before {eventConfig.devcon.name} in{" "}
        {eventConfig.devcon.city}, {eventConfig.devcon.datesLabel}. Goa first,
        then Mumbai, without crossing an ocean twice.
      </p>

      <div className="border-flat mt-10 rounded-[--radius-card] bg-white p-8">
        <Chip>Coming soon</Chip>
        <h3 className="text-headline-sm mt-4">
          Participation and speaker booking
        </h3>
        <p className="text-body-lg mt-3 max-w-2xl">
          How to take part, what it costs, and how speakers book a slot are
          being worked out now. Follow the Telegram channel and we will announce
          it there first.
        </p>
        <div className="mt-6">
          <ButtonLink href={siteConfig.telegram}>Get updates</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
