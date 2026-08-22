import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { mediaUrl } from "@/lib/media";
import { getPartners } from "@/lib/queries";

// Rendered per request, so an edit in Supabase shows up at once. The edge
// caches the result for a minute, see the headers in next.config.ts, so the
// database is not queried for every visitor.
export const fetchCache = "default-no-store";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Sponsors and community partners who have supported Invisible Garden gatherings.",
  alternates: { canonical: "/partners" },
};

/**
 * DEFERRED: the partner list. Webflow kept the logos as loose site assets with
 * no name, tier, link or edition attached, tech-design 5.6, so the table is
 * empty until the list is re-authored by hand, roughly 35 rows.
 */
export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <Section>
      <SectionHeading
        label="Support"
        title="Partners and sponsors"
        level={1}
        intro="Organisations that have backed Invisible Garden gatherings."
      />

      {partners.length === 0 ? (
        <p className="text-body-lg mt-10 max-w-2xl">
          The partner list is being rebuilt. Until it is ready, the recap page
          for each edition names the organisations that supported it.
        </p>
      ) : (
        <ul className="mt-10 flex flex-wrap items-center gap-10">
          {partners.map((partner) => {
            const logo = mediaUrl(partner.logo_path);
            const content = logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={partner.name}
                className="h-12 w-auto object-contain"
                loading="lazy"
              />
            ) : (
              <span className="text-body-lg">{partner.name}</span>
            );
            return (
              <li key={partner.slug}>
                {partner.url ? (
                  <a href={partner.url} rel="noreferrer">
                    {content}
                  </a>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
