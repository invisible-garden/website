import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Chip } from "@/components/ui/chip";
import { Section } from "@/components/ui/section";
import { personPhotoUrl } from "@/lib/media";
import { getFellowForPerson, getPeople, getPerson } from "@/lib/queries";

// Rendered per request, so an edit in Supabase shows up at once. The edge
// caches the result for a minute, see the headers in next.config.ts, so the
// database is not queried for every visitor.
export const fetchCache = "default-no-store";

export async function generateStaticParams() {
  const people = await getPeople();
  return people.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/people/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const person = await getPerson(slug);
  if (!person) return { title: "Not found" };
  return {
    title: person.full_name,
    description: person.headline ?? undefined,
    alternates: { canonical: `/people/${person.slug}` },
  };
}

export default async function PersonPage({
  params,
}: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  const person = await getPerson(slug);
  if (!person) notFound();

  // Some people are also fellows of an edition they attended as a builder.
  const fellow = await getFellowForPerson(person.id);

  const links = [
    person.x_handle
      ? {
          label: "X",
          href: `https://x.com/${person.x_handle.replace(/^@/, "")}`,
        }
      : null,
    person.github ? { label: "GitHub", href: person.github } : null,
    person.website ? { label: "Website", href: person.website } : null,
  ].filter((link): link is { label: string; href: string } => Boolean(link));

  return (
    <Section>
      <div className="grid gap-10 md:grid-cols-[240px_1fr]">
        <div className="bg-paper relative aspect-square w-full max-w-[240px] overflow-hidden rounded-[--radius-card]">
          <Image
            src={personPhotoUrl(person.photo_path, 800)}
            alt={person.photo_alt ?? person.full_name}
            fill
            sizes="240px"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <h1 className="text-headline-lg">{person.full_name}</h1>
          {person.headline ? (
            <p className="text-body-lg mt-3" data-verbatim>
              {person.headline}
            </p>
          ) : null}

          {person.editions.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {person.editions.map((edition) => (
                <Link
                  key={edition.slug}
                  href={`/editions/${edition.slug}`}
                  className="no-underline"
                >
                  <Chip tone="sky">{edition.name}</Chip>
                </Link>
              ))}
            </div>
          ) : null}

          {fellow ? (
            <p className="text-body-md mt-6">
              <Chip tone="sage">
                {fellow.category ? `${fellow.category} fellow` : "Fellow"}
                {fellow.edition ? ` · ${fellow.edition.name}` : ""}
              </Chip>
            </p>
          ) : null}

          {fellow?.bio && !person.bio ? (
            <p className="text-body-md mt-6" data-verbatim>
              {fellow.bio}
            </p>
          ) : null}

          {person.bio ? (
            <p className="text-body-md mt-6 whitespace-pre-line" data-verbatim>
              {person.bio}
            </p>
          ) : null}

          {links.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-4">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    className="text-label font-mono uppercase"
                    href={link.href}
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-10">
            <Link href="/people" className="text-label font-mono uppercase">
              All mentors and speakers
            </Link>
          </p>
        </div>
      </div>
    </Section>
  );
}
