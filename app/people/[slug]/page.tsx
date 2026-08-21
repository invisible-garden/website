import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Chip } from "@/components/ui/chip";
import { Section } from "@/components/ui/section";
import { personPhotoUrl } from "@/lib/media";
import { getPeople, getPerson } from "@/lib/queries";

// ISR, see tech-design 6.1. Next requires a literal here.
export const revalidate = 300;

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
  };
}

export default async function PersonPage({
  params,
}: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  const person = await getPerson(slug);
  if (!person) notFound();

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
            <p className="text-body-lg mt-3">{person.headline}</p>
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

          {person.bio ? (
            <p className="text-body-md mt-6 whitespace-pre-line">
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
