import { eventConfig, siteConfig } from "@/lib/site-config";

/**
 * schema.org Event data, so search engines can read the dates, the place and
 * the three co-hosts rather than guess them from the copy.
 *
 * Everything here is already visible on the page. Nothing is asserted that the
 * page does not say: no venue, because the agreement is not closed, and no
 * offers, because the participation model is undecided. The location is the
 * region, which is what `Place` with an `addressRegion` and no `name` means.
 */
export function EventSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/opengraph-image`,
    startDate: eventConfig.startsOn,
    endDate: eventConfig.endsOn,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressRegion: eventConfig.city,
        addressCountry: "IN",
      },
    },
    organizer: eventConfig.organisers.map((organiser) => ({
      "@type": "Organization",
      name: organiser.name,
      url: organiser.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // The object is ours and holds no user input, so there is nothing to
      // escape. JSON.stringify output is inserted as it is.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
