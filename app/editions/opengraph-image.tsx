import { OG_CONTENT_TYPE, OG_SIZE, siteCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Invisible Garden editions";

export default function Image() {
  return siteCard("Editions", "Every gathering since 2024");
}
