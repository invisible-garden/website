import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { PartnerWithTier } from "@/lib/queries";

/**
 * A row of partner logos, grouped by tier. Renders nothing when the list is
 * empty.
 *
 * The logos sit on ink. Sponsors supplied white-on-transparent artwork, which
 * is what the old site published and what we mirrored, so on a white surface
 * they disappear completely. Recolouring someone's mark is not ours to do, so
 * the surface moves instead.
 */
function Logos({ partners }: { partners: PartnerWithTier[] }) {
  const hasLogos = partners.some((partner) => partner.logo_path);
  return (
    <ul
      className={cn(
        "mt-6 flex flex-wrap items-center gap-x-10 gap-y-6",
        hasLogos && "bg-ink rounded-[--radius-card] px-8 py-7 text-white",
      )}
    >
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
