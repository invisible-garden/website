import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { mediaUrl } from "@/lib/media";
import type { PartnerRow } from "@/types/db";

/**
 * The organisations that backed the previous gatherings, added on Leo's
 * instruction 2026-08-23.
 *
 * The wording does the work here: nobody in this band has committed to
 * anything upcoming, and the section says so plainly rather than leaving a
 * reader to assume. Same rule as the community grid.
 *
 * Ink, because the sponsor marks are the white-on-transparent artwork their
 * owners supplied, see components/partner-band.tsx. Only partners with a logo
 * appear; the rest are named in full on /partners.
 */
export function PastSupport({ partners }: { partners: PartnerRow[] }) {
  const withLogo = partners.filter((partner) => partner.logo_path);
  if (withLogo.length === 0) return null;

  return (
    <Section>
      <SectionHeading
        label="Support"
        title="Who backed the previous gatherings"
        intro="Sponsors and community partners of Chiang Mai 2024 and Buenos Aires 2025. Thank you. Nothing here is a commitment to anything upcoming."
      />

      <ul className="bg-ink mt-10 flex flex-wrap items-center gap-x-10 gap-y-8 rounded-[--radius-card] px-8 py-8">
        {withLogo.map((partner) => {
          const logo = mediaUrl(partner.logo_path);
          return (
            <li key={partner.slug}>
              {logo ? (
                <Image
                  src={logo}
                  alt={partner.name}
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              ) : null}
            </li>
          );
        })}
      </ul>

      <p className="mt-8">
        <Link href="/partners" className="text-label font-mono uppercase">
          All sponsors and partners
        </Link>
      </p>
    </Section>
  );
}
