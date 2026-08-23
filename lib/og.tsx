import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

/** The square mark, inlined once per build. Satori has no file access. */
const markDataUri = `data:image/jpeg;base64,${readFileSync(
  path.join(process.cwd(), "public", "images", "logo", "mark-square.jpg"),
).toString("base64")}`;

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Social cards, generated from a template rather than hand-made, tech-design
 * 6.5. Two looks, both Invisible Garden's: `brand` carries the horizon
 * gradient and is used for the homepage, `dark` is the quieter card every
 * inside page uses.
 *
 * The gradient used to mean "this card is about the 2026 event". That event
 * has its own site since 2026-08-23, and the gradient is Invisible Garden's
 * own, so it now marks the front door rather than the event.
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
  tone: "brand" | "dark";
}) {
  const brand = tone === "brand";
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: brand
          ? "linear-gradient(180deg, #0040b1 0%, #74acdf 30%, #ffe174 70%, #ffe174 100%)"
          : "#14181c",
        color: brand ? "#14181c" : "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontSize: 28,
          color: brand ? "#ffffff" : "#ffbba5",
        }}
      >
        {/* Satori renders these cards, not the browser, so next/image has no
            role here and a plain img is the only option. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={markDataUri}
          width={56}
          height={56}
          style={{ borderRadius: 12 }}
          alt=""
        />
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
              color: brand ? "#14181c" : "#ffe174",
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
    tone: "dark",
  });
}
