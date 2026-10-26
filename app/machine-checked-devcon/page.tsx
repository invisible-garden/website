import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { mediaUrl } from "@/lib/media";
import { siteConfig } from "@/lib/site-config";

/**
 * Call for participants for Machine-Checked Devcon Week, the Etheorem
 * hackathon, 2 to 7 November 2026. Source of truth for every fact and every
 * line of copy: the participant page brief, 30-pr/launches/
 * etheorem-hackathon/participant-page-brief.md, which itself defers to the
 * event note. If a fact changes there, it changes here.
 *
 * Draft stage, decided with Leo 2026-10-26: the page ships unlinked. No nav
 * entry, no homepage section, no sitemap row until the announcement.
 *
 * Decided with Leo 2026-10-26, after the first draft: the "Devcon" name
 * carry is authorised, the Road to Devcon support is confirmed and goes in
 * the hero and the organisers section, participation is free, the IG
 * community rules apply, and the "apply" vocabulary is right for this page
 * even though the main site bans it as a flow. Still open: judges and
 * mentors stay unnamed until confirmed, the fee question is settled (free)
 * but the time-commitment expectation is not, and the page enters the
 * sitemap only when Leo says the link is public.
 */

/** Facts from the brief's table, section 3. Nothing else is a fact. */
const hackathon = {
  name: "Machine-Checked Devcon Week",
  descriptor:
    "An online hackathon during Devcon week: learn Lean 4, formal verification, and Ethereum networking by building.",
  datesLabel: "2 to 7 November 2026",
  deadlineLabel: "Apply by 1 November",
  repo: "https://github.com/etheorem/leanp2p",
  applyForm:
    "https://docs.google.com/forms/d/e/1FAIpQLSf0ydWzOCIRA3jxds9Xms454q47NfoVmlXOQP3tJQkm1ekJ3g/viewform",
  discord: "https://discord.gg/SxvYP4vvg",
} as const;

export const metadata: Metadata = {
  title: "Machine-Checked Devcon Week, online hackathon, 2-7 November",
  description:
    "Online hackathon, 2 to 7 November 2026. Build Lean 4 proofs and Ethereum networking components on real protocol tasks. Apply by 1 November.",
  alternates: { canonical: "/machine-checked-devcon" },
  // Page-level override: this page travels as a link, X posts, Discord
  // channels, Telegram groups, and the generic site card says nothing about
  // the event. Inside pages normally inherit the layout's openGraph.
  openGraph: {
    title: "Machine-Checked Devcon Week, online hackathon, 2-7 November",
    description:
      "Online hackathon, 2 to 7 November 2026. Build Lean 4 proofs and Ethereum networking components on real protocol tasks. Apply by 1 November.",
    url: `${siteConfig.url}/machine-checked-devcon`,
  },
};

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: hackathon.name,
  description: hackathon.descriptor,
  startDate: "2026-11-02",
  endDate: "2026-11-07",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  location: { "@type": "VirtualLocation", url: siteConfig.url },
  organizer: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
  url: `${siteConfig.url}/machine-checked-devcon`,
};

const loop = [
  {
    title: "Pick an issue.",
    body: "You can claim an issue once every issue it depends on is closed, and closed means merged.",
  },
  {
    title: "Claim it.",
    body: 'Comment "claim" and an organiser assigns it to you. One issue at a time.',
  },
  {
    title: "Open a PR within 8 hours.",
    body: "The clock starts at assignment, drafts count. Link the issue in the PR.",
  },
  {
    title: "Miss the window, lose the claim.",
    body: "No PR after 8 hours and the issue is unassigned. Anyone can claim it again.",
  },
  {
    title: "Review and merge.",
    body: "Organisers review within 12 hours. When your PR merges, the issue closes and the issues depending on it open for claims.",
  },
  {
    title: "Repeat.",
    body: "Claim, build, prove, submit, all week.",
  },
] as const;

const deadlines = [
  {
    title: "Code closes 7 November 2026, 23:59 UTC.",
    body: "Every PR you want judged must be open by then, with CI green. Merges can land later.",
  },
  {
    title: "Video by 15 November 2026, 23:59 UTC.",
    body: "Up to 10 minutes, you explaining your contributions, link in the event channel. Unlisted is fine. Without a video, the work is not judged.",
  },
  {
    title: "Judging by 20 November, results by 30 November.",
    body: "The judges assess the whole body of merged work.",
  },
] as const;

export default function MachineCheckedDevconPage() {
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
              Part of Road to Devcon
            </Chip>
            <Chip tone="outline" className="border-white/60 text-white">
              Online
            </Chip>
            <Chip tone="outline" className="border-white/60 text-white">
              {hackathon.datesLabel}
            </Chip>
            <Chip tone="outline" className="border-white/60 text-white">
              {hackathon.deadlineLabel}
            </Chip>
          </div>
          <h1 className="font-display text-display mt-6">{hackathon.name}</h1>
          <p className="text-body-lg mt-6 max-w-2xl">{hackathon.descriptor}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href={hackathon.applyForm} variant="invert">
              Apply now
            </ButtonLink>
            <ButtonLink
              href={hackathon.discord}
              variant="secondary"
              className="text-white hover:bg-white/10"
            >
              Join the Discord
            </ButtonLink>
          </div>
        </Container>
      </div>

      <Section>
        <SectionHeading
          label="What it is"
          title="Learn by shipping real protocol work"
        />
        <div className="text-body-lg mt-8 max-w-3xl space-y-4">
          <p>
            Machine-Checked Devcon Week is an online hackathon, run during
            Devcon week, {hackathon.datesLabel}. You pick real protocol tasks
            from a public repo and learn by shipping code and proofs.
          </p>
          <p>
            Participation is curated. You apply, the organisers review, and
            acceptances are announced in the event channel on the{" "}
            <a href={hackathon.discord} rel="noreferrer">
              Invisible Garden Discord
            </a>
            .
          </p>
          <p>
            The cohort stays under ten contributors, small on purpose, so your
            work gets real attention.
          </p>
          <p>
            Participation is free, and the Invisible Garden community rules
            apply all week.
          </p>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeading
          label="The work"
          title="Implementation and proofs together"
        />
        <div className="text-body-lg mt-8 max-w-3xl space-y-4">
          <p>
            You implement pieces of Ethereum&apos;s networking layer in Lean 4
            and prove properties of what you build. Every proof is checked by
            Lean&apos;s kernel, and implementation and proofs live together in
            one codebase.
          </p>
          <p>
            The tasks live in the{" "}
            <a href={hackathon.repo} rel="noreferrer">
              leanp2p repo on GitHub
            </a>
            .
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeading label="Who should apply" title="Any level counts" />
        <div className="text-body-lg mt-8 max-w-3xl space-y-4">
          <p>
            The week is for people at or around Devcon: the Lean curious,
            Ethereum protocol developers, and the Invisible Garden and
            EthPadThai communities.
          </p>
          <p>
            You should apply if you are curious about Lean or formal methods and
            comfortable writing code. Any level counts. What matters is
            motivation and drive.
          </p>
          <p>
            The{" "}
            <a href={hackathon.applyForm} rel="noreferrer">
              form
            </a>{" "}
            asks about your experience and why you want in. It is short.
          </p>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeading
          label="The loop"
          title="How the week works"
          intro="All work lives in the issues of the leanp2p repo. Issues depend on each other, so finishing one opens the next."
        />
        <ol className="text-body-lg mt-10 max-w-3xl list-decimal space-y-4 pl-8">
          {loop.map((step) => (
            <li key={step.title}>
              <strong className="font-mono">{step.title}</strong> {step.body}
            </li>
          ))}
        </ol>
        <p className="text-body-lg mt-8 max-w-3xl">
          The rules stay canonical in the{" "}
          <a href={hackathon.repo} rel="noreferrer">
            repo
          </a>
          . If this page and the repo ever disagree, the repo wins.
        </p>
      </Section>

      <Section>
        <SectionHeading label="Dates" title="Deadlines and judging" />
        <ul className="text-body-lg mt-8 max-w-3xl space-y-4">
          {deadlines.map((item) => (
            <li key={item.title}>
              <strong className="font-mono">{item.title}</strong> {item.body}
            </li>
          ))}
        </ul>
        <div className="mt-10 max-w-3xl space-y-6">
          <div>
            <h3 className="text-headline-sm">How entries are scored</h3>
            <p className="text-body-lg mt-3">
              Code quality multiplied by how much of the work carries
              machine-checked proofs.
            </p>
          </div>
          <div>
            <h3 className="text-headline-sm">Prize eligibility</h3>
            <p className="text-body-lg mt-3">
              Meaningful contributions only: at least one claimed issue closed,
              real implementation or proof work, defensible in the video, inside
              the event window. Typo fixes, formatting, dependency bumps, and
              trivial refactors do not count by themselves. Judges assess the
              whole body of merged work and have the final say.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeading label="Prizes" title="$1,000 and growing" />
        <div className="text-body-lg mt-8 max-w-3xl space-y-4">
          <p>
            Invisible Garden and EthPadThai have each confirmed $500. More
            contributors are being confirmed.
          </p>
          <p>
            The pool is a thank you, not the reason to join. The full rules,
            including eligibility, live in the{" "}
            <a href={hackathon.repo} rel="noreferrer">
              repo
            </a>
            .
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeading label="Who runs it" title="Organisers and partners" />
        {/* Ink band, because every mark here is white-on-transparent artwork:
            IG's own white wordmark, EthPadThai's logo cut from the Webflow
            mosaic (same one the Chiang Mai recap band uses, from the media
            bucket), and Road to Devcon's official white logo, vendored from
            devcon.org/road-to-devcon/logo.webp. */}
        <ul className="bg-ink mt-10 flex flex-wrap items-center gap-x-10 gap-y-6 rounded-[--radius-card] px-8 py-7 text-white">
          <li>
            <Image
              src="/images/logo/wordmark-white.svg"
              alt={siteConfig.name}
              width={160}
              height={58}
              unoptimized
              className="h-12 w-auto object-contain"
            />
          </li>
          <li>
            <Image
              src={mediaUrl("partners/ethpadthai.webp")!}
              alt="EthPadThai"
              width={160}
              height={48}
              className="h-12 w-auto object-contain"
            />
          </li>
          {/* No logo exists for 4Seas anywhere in our assets, and the partner
              brief gives none, so the band carries the name, the same
              treatment the edition partner bands use without artwork. */}
          <li>
            <span className="text-body-lg">4Seas</span>
          </li>
          <li>
            <a
              href="https://devcon.org/en/road-to-devcon/"
              rel="noreferrer"
              aria-label="Road to Devcon"
            >
              <Image
                src="/images/hackathon/road-to-devcon.webp"
                alt="Road to Devcon"
                width={48}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </a>
          </li>
        </ul>
        <div className="text-body-lg mt-8 max-w-3xl space-y-4">
          <p>
            Invisible Garden organises the week. Invisible Garden is a traveling
            academy for Ethereum developers, with editions in Chiang Mai in 2024
            and Buenos Aires in 2025.
          </p>
          <p>EthPadThai and 4Seas are the community partners of the week.</p>
          <p>
            The week is part of Road to Devcon, supported by the Devcon
            organisation.
          </p>
          <p>The tasks live in the Etheorem project&apos;s leanp2p repo.</p>
        </div>
      </Section>

      <Section tone="ink">
        <div className="max-w-3xl">
          <h2 className="text-headline-lg">{hackathon.deadlineLabel}</h2>
          <p className="text-body-lg mt-4">
            Applications close 1 November 2026. The week runs 2 to 7 November,
            online, with a cohort under ten.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href={hackathon.applyForm} variant="invert">
              Apply now
            </ButtonLink>
            <ButtonLink
              href={hackathon.discord}
              variant="secondary"
              className="text-white hover:bg-white/10"
            >
              Join the Discord
            </ButtonLink>
          </div>
        </div>
      </Section>
    </article>
  );
}
