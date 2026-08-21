import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { formatDateRange } from "@/lib/dates";
import { getEdition, getEditions } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
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

  return ogCard({
    eyebrow: siteConfig.name,
    title: edition?.name ?? "Edition",
    subtitle: [where, dates].filter(Boolean).join("  ·  "),
    footer: `${siteConfig.url}/editions/${slug}`,
    tone: "site",
  });
}
