import { OG_CONTENT_TYPE, OG_SIZE, siteCard } from "@/lib/og";
import { siteConfig } from "@/lib/site-config";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `About ${siteConfig.name}`;

export default function Image() {
  return siteCard("About", "A traveling academy for Ethereum developers");
}
