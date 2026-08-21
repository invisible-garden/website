import { OG_CONTENT_TYPE, OG_SIZE, siteCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Invisible Garden mentors and speakers";

export default function Image() {
  return siteCard(
    "Mentors and speakers",
    "The people who have taught at Invisible Garden",
  );
}
