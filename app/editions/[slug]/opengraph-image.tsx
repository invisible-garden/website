import { ImageResponse } from "next/og";
import { formatDateRange } from "@/lib/dates";
import { getEdition, getEditions } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Invisible Garden edition recap";

export async function generateStaticParams() {
  const editions = await getEditions();
  return editions
    .filter((edition) => edition.status === "past")
    .map((edition) => ({ slug: edition.slug }));
}

/** Per-edition card, generated from a template rather than hand-made. */
export default async function EditionOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const edition = await getEdition(slug);
  const where = edition?.city ? `${edition.city}, ${edition.country}` : "";
  const dates = edition
    ? formatDateRange(edition.starts_on, edition.ends_on)
    : "";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#14181c",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#ffbba5" }}>
        {siteConfig.name}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", fontSize: 78, fontWeight: 700 }}>
          {edition?.name ?? "Edition"}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#ffe174" }}>
          {[where, dates].filter(Boolean).join("  ·  ")}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 24 }}>
        {`${siteConfig.url}/editions/${slug}`}
      </div>
    </div>,
    size,
  );
}
