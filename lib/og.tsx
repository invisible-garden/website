import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * The social card, generated from a template rather than hand-made.
 *
 * Type only. Invisible Commons has no mark of its own yet, and neither
 * co-host's mark can stand in for it: the Invisible Garden leaf would brand
 * the event as Invisible Garden's, and the same holds for the other two.
 * Colours are the tokens from app/globals.css, restated here because Satori
 * does not read the stylesheet.
 */
export function ogCard({
  eyebrow,
  title,
  subtitle,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer: string;
}) {
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
          "linear-gradient(180deg, #04222e 0%, #0a4f57 45%, #0b7c7b 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#bfe9e6" }}>
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
          <div style={{ display: "flex", fontSize: 32, color: "#e8f4f3" }}>
            {subtitle}
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#bfe9e6" }}>
        {footer}
      </div>
    </div>,
    OG_SIZE,
  );
}
