import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { siteConfig } from "@/lib/site-config";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${siteConfig.name}, a traveling academy for Ethereum developers`;

/** The homepage is Invisible Garden's front door, so this card is the site's,
 *  on the brand gradient. The 2026 event has its own card on its own site. */
export default function OpengraphImage() {
  return ogCard({
    eyebrow: siteConfig.name,
    title: "A traveling academy for Ethereum developers",
    subtitle: "Chiang Mai 2024  ·  Buenos Aires 2025",
    footer: siteConfig.url,
    tone: "brand",
  });
}
