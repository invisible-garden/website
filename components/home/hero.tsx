import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

/**
 * The hero is about Invisible Garden itself, not about any one event, per
 * mb/ig/ig-homepage-brief.md section 1. The 2026 event has its own site and
 * its own hero; here it appears one section down, in "What next".
 */
export function Hero() {
  return (
    <div className="bg-horizon text-white">
      <Container className="py-20 md:py-28">
        <h1 className="font-display text-display max-w-4xl">
          {siteConfig.name}
        </h1>

        <p className="text-body-lg mt-6 max-w-2xl">
          A traveling academy for Ethereum developers. Since 2024 it has run as
          pop-up dev cities: a few weeks in one place, a cohort of builders, and
          mentors who teach in the room rather than over video.
        </p>

        <p className="text-body-lg mt-8 font-mono">
          Chiang Mai 2024 &middot; Buenos Aires 2025
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/editions">Past editions</ButtonLink>
          <ButtonLink href={siteConfig.social.telegram} variant="secondary">
            Get updates
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
