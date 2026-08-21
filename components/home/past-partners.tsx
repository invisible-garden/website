import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/section";
import { mediaUrl } from "@/lib/media";
import type { PartnerRow } from "@/types/db";

/**
 * Partners of previous editions, labelled so nobody reads it as a Goa
 * commitment, content-brief 3.1 item 6.
 *
 * DEFERRED: the partner list itself. Webflow held the logos as loose site
 * assets with no name, tier, link, or edition, tech-design 5.6, so the table is
 * empty until the list is re-authored. This section renders nothing while that
 * is true, rather than showing an empty band.
 */
export function PastPartners({ partners }: { partners: PartnerRow[] }) {
  if (partners.length === 0) return null;
  return (
    <Section>
      <SectionHeading
        label="Support"
        title="Partners of previous editions"
        intro="Organisations that backed Invisible Garden in Chiang Mai and Buenos Aires."
      />
      <ul className="mt-10 flex flex-wrap items-center gap-10">
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
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <span className="text-body-lg">{partner.name}</span>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
