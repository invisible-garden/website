import { ImageResponse } from "next/og";
import { eventConfig, siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${eventConfig.name}, ${eventConfig.city}, ${eventConfig.country}`;

/**
 * Site-wide OpenGraph image, generated from the brand gradient rather than
 * hand-made, tech-design 6.5. Routes that want their own export the same file
 * shape from their folder.
 *
 * DEFERRED: the logo. No SVG mark is embedded yet, the Invisible Garden file
 * downloaded from the old site is a full lockup and the co-host logos have not
 * arrived.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background:
          "linear-gradient(180deg, #0040b1 0%, #74acdf 30%, #ffe174 70%, #ffe174 100%)",
        color: "#14181c",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#ffffff" }}>
        {eventConfig.organisers.join("   +   ")}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          {eventConfig.name}
        </div>
        <div style={{ display: "flex", fontSize: 34 }}>
          {`${eventConfig.city}, ${eventConfig.country} · 17 to 31 October 2026`}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 26 }}>{siteConfig.url}</div>
    </div>,
    size,
  );
}
