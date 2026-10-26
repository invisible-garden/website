import { OG_CONTENT_TYPE, OG_SIZE, siteCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "Machine-Checked Devcon Week, an online hackathon by Invisible Garden";

/** Plain typographic card per the participant page brief, section 5. The
 *  event lockup replaces this once one exists. */
export default function Image() {
  return siteCard(
    "Machine-Checked Devcon Week",
    "Online · 2 to 7 November 2026",
  );
}
