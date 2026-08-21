import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Social cards, generated from a template rather than hand-made, tech-design
 * 6.5. Two looks, matching the identity split: the event card carries the brand
 * gradient and the co-hosts, the site card is Invisible Garden's own.
 *
 * DEFERRED: a logo mark. None of the three organisations has supplied one that
 * reads at this size, so the cards are type-only.
 */
export function ogCard({
  eyebrow,
  title,
  subtitle,
  footer,
  tone,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer: string;
  tone: "event" | "site";
}) {
  const event = tone === "event";
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: event
          ? "linear-gradient(180deg, #0040b1 0%, #74acdf 30%, #ffe174 70%, #ffe174 100%)"
          : "#14181c",
        color: event ? "#14181c" : "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: event ? "#ffffff" : "#ffbba5",
        }}
      >
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "flex",
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: event ? "#14181c" : "#ffe174",
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", fontSize: 24 }}>{footer}</div>
    </div>,
    OG_SIZE,
  );
}

export function siteCard(title: string, subtitle?: string) {
  return ogCard({
    eyebrow: siteConfig.name,
    title,
    subtitle,
    footer: siteConfig.url,
    tone: "site",
  });
}
