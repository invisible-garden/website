import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoGallery } from "@/components/photo-gallery";
import { Container } from "@/components/ui/container";
import { formatDateRange } from "@/lib/dates";
import {
  GALLERY_PAGE_SIZE,
  getEdition,
  getEditionPhotoCount,
  getEditionPhotos,
  getEditions,
} from "@/lib/queries";

// Statically generated and refreshed every 5 minutes, like the recap. The
// first gallery page ships inside this HTML; further pages come from the API
// route as the reader scrolls.
export const revalidate = 300;

export async function generateStaticParams() {
  const editions = await getEditions();
  return editions
    .filter((edition) => edition.status === "past")
    .map((edition) => ({ slug: edition.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/editions/[slug]/photos">): Promise<Metadata> {
  const { slug } = await params;
  const edition = await getEdition(slug);
  if (!edition) return { title: "Not found" };
  return {
    title: `${edition.name} photo gallery`,
    description: `Photo booth pictures from Invisible Garden ${edition.name}.`,
    alternates: { canonical: `/editions/${edition.slug}/photos` },
  };
}

export default async function EditionPhotosPage({
  params,
}: PageProps<"/editions/[slug]/photos">) {
  const { slug } = await params;
  const edition = await getEdition(slug);
  if (!edition) notFound();

  const [initialPhotos, total] = await Promise.all([
    getEditionPhotos(slug, GALLERY_PAGE_SIZE, 0),
    getEditionPhotoCount(slug),
  ]);
  const dates = formatDateRange(edition.starts_on, edition.ends_on);

  return (
    <section>
      <div className="bg-horizon py-16 text-white md:py-20">
        <Container>
          <p className="text-label font-mono">
            <Link
              href={`/editions/${edition.slug}`}
              className="underline underline-offset-4"
            >
              {edition.name}
            </Link>
            <span aria-hidden="true"> / </span>
            <span>Photos</span>
          </p>
          <h1 className="font-display text-display mt-4">
            Photo booth pictures
          </h1>
          <p className="text-body-lg mt-3 font-mono">
            {dates}
            {dates ? ", " : ""}taken by the people who were there
          </p>
        </Container>
      </div>

      <Container className="mt-10 md:mt-14">
        <PhotoGallery
          slug={edition.slug}
          initialPhotos={initialPhotos}
          total={total}
        />
      </Container>
    </section>
  );
}
