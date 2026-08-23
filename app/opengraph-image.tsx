import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { eventConfig, siteConfig } from "@/lib/site-config";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${eventConfig.name}, ${eventConfig.city}, ${eventConfig.country}`;

export default function OpengraphImage() {
  return ogCard({
    eyebrow: eventConfig.organiserNames.join("   +   "),
    title: eventConfig.name,
    subtitle: `${eventConfig.city}, ${eventConfig.country} · ${eventConfig.datesLabel}`,
    footer: siteConfig.url.replace(/^https?:\/\//, ""),
  });
}
