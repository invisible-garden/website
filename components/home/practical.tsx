import { Chip } from "@/components/ui/chip";
import { Section, SectionHeading } from "@/components/ui/section";
import { formatDateRange } from "@/lib/dates";
import { eventConfig } from "@/lib/site-config";

/**
 * Practical block.
 *
 * DEFERRED, and visibly so: the participation model, whether there are
 * scholarships, a ticket, or nothing to pay, and how speakers book a talk.
 * content-brief 3.1 says this section ships with placeholders until the team
 * decides, and 6.1 and 6.6 are the open questions. The placeholder says so
 * plainly rather than inventing terms.
 */
export function Practical() {
  return (
    <Section>
      <SectionHeading label="Practical" title="When, where, and how to join" />

      <dl className="mt-10 grid gap-8 md:grid-cols-3">
        <div>
          <dt className="text-label font-mono uppercase">Dates</dt>
          <dd className="text-headline-sm mt-2">
            {formatDateRange(eventConfig.startsOn, eventConfig.endsOn)}
          </dd>
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
        The edition ends three days before {eventConfig.devcon.name} in{" "}
        {eventConfig.devcon.city}, {eventConfig.devcon.datesLabel}. Goa first,
        then Mumbai, without crossing an ocean twice.
      </p>

      <div className="border-flat mt-10 rounded-[--radius-card] p-8">
        <Chip tone="peach">Coming soon</Chip>
        <h3 className="text-headline-sm mt-4">
          Participation and speaker booking
        </h3>
        <p className="text-body-lg mt-3 max-w-2xl">
          How to take part, what it costs, and how speakers book a slot are
          being worked out now. Follow the Telegram channel and we will announce
          it there first.
        </p>
      </div>
    </Section>
  );
}
