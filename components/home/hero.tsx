import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

/**
 * The hero is about Invisible Garden itself, not about any one event, per
 * mb/ig/ig-homepage-brief.md section 1.
 *
 * The pixel garden behind it is the old Webflow site's own hero artwork,
 * brought across at Leo's request on 2026-08-23. It fades to transparent at
 * its foot, which is why the block sits on white: the garden grows out of the
 * page rather than ending on a hard edge. It is anchored to the bottom so the
 * flowers survive the crop on a short viewport, since the top of the source is
 * plain sky.
 *
 * The copy sits on an ink panel. White text over artwork is a contrast
 * gamble, and over the brand gradient it was a measured failure: 2.4:1 by the
 * sky stop, 1.3:1 over the sun. On the panel every line clears 11:1 whatever
 * is behind it. Decided with Leo, 2026-08-23.
 */
export function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <Image
        src="/images/hero/garden.webp"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-bottom"
      />
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
