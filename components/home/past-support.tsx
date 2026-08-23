import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/section";
import { mediaUrl } from "@/lib/media";
import type { PartnerRow } from "@/types/db";

/**
 * The organisations that backed the previous gatherings, added on Leo's
 * instruction 2026-08-23.
 *
 * The heading and the two edition names do the work: this is who backed what
 * already happened, not who is behind anything upcoming.
 *
 * Ink, because the sponsor marks are the white-on-transparent artwork their
 * owners supplied, see components/partner-band.tsx. Every partner appears, a
 * mark where there is one and the name where there is not, which is how the
 * old site listed its community partners anyway.
 */
export function PastSupport({ partners }: { partners: PartnerRow[] }) {
  if (partners.length === 0) return null;

  return (
    <Section>
      <SectionHeading
        label="Support"
        title="Who backed the previous gatherings"
        intro="Sponsors and community partners of Chiang Mai 2024 and Buenos Aires 2025. Thank you."
      />

      <ul className="bg-ink mt-10 flex flex-wrap items-center gap-x-10 gap-y-8 rounded-[--radius-card] px-8 py-8">
        {partners.map((partner) => {
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
              ) : (
                <span className="text-body-md text-white">{partner.name}</span>
              )}
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
