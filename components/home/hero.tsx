import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatDateRange } from "@/lib/dates";
import { eventConfig } from "@/lib/site-config";

/**
 * Hero. Three co-host chips above the title, equal weight, per mockup-notes
 * and the 2026-08-21 decision that added OpenBuild.
 *
 * DEFERRED: the primary CTA. content-brief 3.1 wants "Get updates" until
 * registration opens, then "Join us in Goa". The registration flow is an open
 * question, so the CTA points at the Telegram announcement channel, the one
 * place that exists today.
 */
export function Hero() {
  return (
    <div className="bg-horizon text-white">
      <Container className="py-20 md:py-28">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {eventConfig.organisers.map((organiser) => (
            <li key={organiser.name} className="flex items-center">
              {organiser.logo ? (
                <Image
                  src={organiser.logo}
                  alt={organiser.name}
                  width={169}
                  height={36}
                  className="h-7 w-auto"
                  priority
                />
              ) : (
                <span className="text-label rounded-full border border-white/70 px-4 py-1.5 font-mono">
                  {organiser.name}
                </span>
              )}
            </li>
          ))}
        </ul>

        <h1 className="font-display text-display mt-8 max-w-4xl">
          {eventConfig.name}
        </h1>

        <p className="text-body-lg mt-6 max-w-2xl">
          An unconference in Goa, India. Two weeks of talks, co-working, and
          building across AI, robotics, ZKP, post-quantum cryptography, and
          formal verification, with Ethereum as the common ground.
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
          <ButtonLink href="https://t.me/invgarannounce">
            Get updates
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
