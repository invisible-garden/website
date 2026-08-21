import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import type { PartnerWithTier } from "@/lib/queries";

/**
 * A row of partner logos, grouped by tier. Renders nothing when the list is
 * empty, which is the state until the partner data is re-authored.
 */
function Logos({ partners }: { partners: PartnerWithTier[] }) {
  return (
    <ul className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6">
      {partners.map((partner) => {
        const logo = mediaUrl(partner.logo_path);
        const mark = logo ? (
          <Image
            src={logo}
            alt={partner.name}
            width={160}
            height={48}
            className="h-12 w-auto object-contain"
          />
        ) : (
          <span className="text-body-lg">{partner.name}</span>
        );
        return (
          <li key={`${partner.slug}-${partner.tier}`}>
            {partner.url ? (
              <a href={partner.url} rel="noreferrer" aria-label={partner.name}>
                {mark}
              </a>
            ) : (
              mark
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function PartnerBand({ partners }: { partners: PartnerWithTier[] }) {
  const sponsors = partners.filter((partner) => partner.tier === "sponsor");
  const community = partners.filter((partner) => partner.tier === "community");
  if (partners.length === 0) return null;

  return (
    <div className="space-y-10">
      {sponsors.length > 0 ? (
        <div>
          <h3 className="text-label font-mono uppercase">Sponsors</h3>
          <Logos partners={sponsors} />
        </div>
      ) : null}
      {community.length > 0 ? (
        <div>
          <h3 className="text-label font-mono uppercase">Community partners</h3>
          <Logos partners={community} />
        </div>
      ) : null}
    </div>
  );
}
