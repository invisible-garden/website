import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

/**
 * The hero is about Invisible Garden itself, not about any one event, per
 * mb/ig/ig-homepage-brief.md section 1. The 2026 event has its own site and
 * its own hero; here it appears one section down, in "What next".
 *
 * The copy sits on an ink panel rather than straight on the gradient. White
 * text only clears WCAG AA in the top 14% of `bg-horizon`: measured down the
 * stops it is 8.9:1 at the deep blue, 2.4:1 by the sky stop and 1.3:1 over the
 * sun. The panel keeps the white-on-brand look and clears AA everywhere, and
 * the gradient still frames it. Decided with Leo, 2026-08-23.
 */
export function Hero() {
  return (
    <div className="bg-horizon">
      <Container className="py-16 md:py-24">
        <div className="bg-ink/85 max-w-3xl rounded-[--radius-card] p-8 text-white md:p-12">
          <h1 className="font-display text-display">{siteConfig.name}</h1>

          <p className="text-body-lg mt-6">
            A traveling academy for Ethereum developers. Since 2024 it has run
            as pop-up dev cities: a few weeks in one place, a cohort of
            builders, and mentors who teach in the room rather than over video.
          </p>

          <p className="text-body-lg mt-8 font-mono">
            Chiang Mai 2024 &middot; Buenos Aires 2025
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/editions" variant="invert">
              Past editions
            </ButtonLink>
            <ButtonLink
              href={siteConfig.social.telegram}
              variant="secondary"
              className="text-white hover:bg-white/10"
            >
              Get updates
            </ButtonLink>
          </div>
        </div>
      </Container>
    </div>
  );
}
