import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { formatDateRange } from "@/lib/dates";
import { eventConfig, siteConfig } from "@/lib/site-config";

/**
 * Hero. The three co-hosts sit above the title, set in the same type at the
 * same size. Their own marks are deliberately not used here: two of the three
 * have supplied artwork and one has not, so logos would bill the co-hosts
 * unequally. Names in type keep them equal.
 *
 * DEFERRED: the call to action. Registration does not exist yet, so it points
 * at the Telegram announcements channel, the one place that does.
 */
export function Hero() {
  return (
    <div className="bg-deep-sea text-white">
      <Container className="py-20 md:py-28">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {eventConfig.organiserNames.map((name) => (
            <li key={name}>
              <Chip tone="onDark">{name}</Chip>
            </li>
          ))}
        </ul>

        <h1 className="font-display text-display mt-8 max-w-4xl">
          {eventConfig.name}
        </h1>

        <p className="text-body-lg mt-6 max-w-2xl">
          An unconference in {eventConfig.city}, {eventConfig.country}. Two
          weeks of talks, co-working, and building across AI, robotics, ZKP,
          post-quantum cryptography, and formal verification, with Ethereum as
          the common ground.
        </p>

        <p className="text-body-lg mt-8 font-mono">
          {eventConfig.city}, {eventConfig.country} &middot;{" "}
          {formatDateRange(eventConfig.startsOn, eventConfig.endsOn)}
        </p>

        <p className="text-body-md mt-3">
          Three days before {eventConfig.devcon.name} in{" "}
          {eventConfig.devcon.city}.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href={siteConfig.telegram} variant="invert">
            Get updates
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
