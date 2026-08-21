import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { FellowList } from "@/components/fellow-list";
import { PartnerBand } from "@/components/partner-band";
import { PersonCard } from "@/components/person-card";
import { ProjectList } from "@/components/project-list";
import { StatBand } from "@/components/stat-band";
import { VideoEmbed } from "@/components/video-embed";
import { Chip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import ChiangMai2024 from "@/content/editions/chiang-mai-2024.mdx";
import BuenosAires2025 from "@/content/editions/buenos-aires-2025.mdx";
import { formatDateRange } from "@/lib/dates";
import { editionContent } from "@/lib/edition-content";
import {
  getEdition,
  getEditionPartners,
  getEditionPeople,
  getEditions,
  getFellows,
  getProjects,
} from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

// ISR, see tech-design 6.1. Next requires a literal here.
export const revalidate = 300;

/** Recap prose per edition. A registry rather than a dynamic import, so a
 *  missing file is a build error rather than a runtime one. */
const RECAP_COPY: Record<string, React.ComponentType> = {
  "chiang-mai-2024": ChiangMai2024,
  "buenos-aires-2025": BuenosAires2025,
};

export async function generateStaticParams() {
  const editions = await getEditions();
  // Only past editions have a recap. The upcoming one is the homepage.
  return editions
    .filter((edition) => edition.status === "past")
    .map((edition) => ({ slug: edition.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/editions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const edition = await getEdition(slug);
  if (!edition) return { title: "Not found" };
  const where = edition.city ? `${edition.city}, ${edition.country}` : "";
  return {
    title: edition.name,
    description:
      edition.summary ??
      `Invisible Garden in ${where}, ${formatDateRange(edition.starts_on, edition.ends_on)}.`,
    alternates: { canonical: `/editions/${edition.slug}` },
  };
}

export default async function EditionPage({
  params,
}: PageProps<"/editions/[slug]">) {
  const { slug } = await params;
  const edition = await getEdition(slug);
  if (!edition) notFound();
  // The upcoming edition has no recap to show, the homepage is about it.
  if (edition.status !== "past") redirect("/");

  const [people, fellows, projects, partners] = await Promise.all([
    getEditionPeople(slug),
    getFellows(slug),
    getProjects(slug),
    getEditionPartners(slug),
  ]);
  const content = editionContent(slug);
  const Recap = RECAP_COPY[slug];
  const dates = formatDateRange(edition.starts_on, edition.ends_on);

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Invisible Garden ${edition.name}`,
    startDate: edition.starts_on,
    endDate: edition.ends_on,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: edition.city
      ? {
          "@type": "Place",
          name: `${edition.city}, ${edition.country}`,
          address: {
            "@type": "PostalAddress",
            addressCountry: edition.country,
          },
        }
      : undefined,
    organizer: { "@type": "Organization", name: siteConfig.name },
    url: `${siteConfig.url}/editions/${edition.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <div className="bg-horizon py-16 text-white md:py-24">
        <Container>
          <div className="flex flex-wrap gap-2">
            <Chip tone="outline" className="border-white/60 text-white">
              {edition.status === "past" ? "Past edition" : "Upcoming"}
            </Chip>
            {edition.city ? (
              <Chip tone="outline" className="border-white/60 text-white">
                {edition.city}, {edition.country}
              </Chip>
            ) : null}
          </div>
          <h1 className="font-display text-display mt-6">{edition.name}</h1>
          <p className="text-body-lg mt-4 font-mono">{dates}</p>
        </Container>
      </div>

      {content.videoId ? (
        <Section>
          <VideoEmbed id={content.videoId} title={`${edition.name} recap`} />
        </Section>
      ) : null}

      {content.stats.length > 0 ? (
        <Section tone="paper" className="py-10 md:py-12">
          <StatBand stats={content.stats} />
        </Section>
      ) : null}

      {Recap ? (
        <Section>
          <div className="text-body-lg max-w-3xl space-y-6">
            <Recap />
          </div>
        </Section>
      ) : null}

      {people.length > 0 ? (
        <Section tone="paper">
          <SectionHeading
            label="Who taught"
            title="Mentors and speakers of this edition"
          />
          <ul className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {people.map((person) => (
              <li key={person.slug}>
                <PersonCard person={person} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {projects.length > 0 ? (
        <Section>
          <SectionHeading
            label="Outcomes"
            title="Projects"
            intro="Open-source work built during the edition."
          />
          <div className="mt-10">
            <ProjectList projects={projects} />
          </div>
        </Section>
      ) : null}

      {partners.length > 0 ? (
        <Section>
          <SectionHeading
            label="Support"
            title="Who backed this edition"
            intro="Sponsors and community partners who made it possible."
          />
          <div className="mt-10">
            <PartnerBand partners={partners} />
          </div>
        </Section>
      ) : null}

      {fellows.length > 0 ? (
        <Section tone="paper">
          <SectionHeading
            label="Fellowship"
            title="Fellows"
            intro="Builders recognised for what they gave to the cohort."
          />
          <div className="mt-10">
            <FellowList fellows={fellows} />
          </div>
        </Section>
      ) : null}
    </article>
  );
}
