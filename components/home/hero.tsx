import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { eventConfig, siteConfig } from "@/lib/site-config";

/**
 * Hero. The three co-hosts sit above the title, all at the same height, on one
 * row, in the order fixed in the config.
 *
 * Common Compute has not picked its mark yet, so its name is set in type at
 * the height of the other two rather than left out. Swap in its logo the day
 * the pick lands, see mb/DEFERRED.md.
 *
 * DEFERRED: the call to action. Registration does not exist yet, so it points
 * at the Telegram announcements channel, the one place that does.
 */
export function Hero() {
  return (
    <div className="bg-deep-sea text-white">
      <Container className="py-20 md:py-28">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {eventConfig.organisers.map((organiser) => (
            <li key={organiser.name} className="flex h-7 items-center">
              {organiser.logo ? (
                <Image
                  src={organiser.logo.src}
                  alt={organiser.name}
                  width={organiser.logo.width}
                  height={organiser.logo.height}
                  className="h-7 w-auto"
                  priority
                  // SVG through the image optimizer 400s, and these are already
                  // small static files, so serve them as they are.
                  unoptimized
                />
              ) : (
                <Chip tone="onDark" className="h-7">
                  {organiser.name}
                </Chip>
              )}
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
          {eventConfig.datesLabel}
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
