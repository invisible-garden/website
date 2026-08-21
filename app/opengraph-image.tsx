import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { eventConfig, siteConfig } from "@/lib/site-config";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${eventConfig.name}, ${eventConfig.city}, ${eventConfig.country}`;

/** The homepage is the event, so this card is the event's. */
export default function OpengraphImage() {
  return ogCard({
    eyebrow: eventConfig.organisers.join("   +   "),
    title: eventConfig.name,
    subtitle: `${eventConfig.city}, ${eventConfig.country} · 17 to 31 October 2026`,
    footer: siteConfig.url,
    tone: "event",
  });
}
