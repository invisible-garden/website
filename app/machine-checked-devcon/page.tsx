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
  },
] as const;

export default function MachineCheckedDevconPage() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      {/* Same treatment as the homepage hero: the pixel garden behind, copy on
          an ink panel, because white text over artwork is a contrast gamble
          (see components/home/hero.tsx). Road to Devcon's white mark sits on
          the panel, where it reads at full size with no patch behind it. */}
      <div className="relative isolate overflow-hidden bg-white">
        <Image
          src="/images/hero/garden.webp"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-bottom"
        />
        <Container className="py-16 md:py-24">
          <div className="bg-ink/85 max-w-3xl rounded-[--radius-card] p-8 text-white md:p-12">
            {/* Logo left, title and the rest to its right where the panel has
                room, stacked on small screens. */}
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
              <a
                href="https://devcon.org/en/road-to-devcon/"
                rel="noreferrer"
                className="inline-block shrink-0 self-start"
              >
                {/* The asset is trimmed to the mark itself, so h-* is the real
                    visible size. 144/176px matches the approved render from
                    the padded original at h-64/md:h-80. */}
                <Image
                  src="/images/hackathon/road-to-devcon.webp"
                  alt="Road to Devcon"
                  width={548}
                  height={548}
                  className="h-36 w-auto md:h-44"
                />
              </a>
              <div>
                <div className="flex flex-wrap gap-2">
                  <Chip tone="outline" className="border-white/60 text-white">
                    Online
                  </Chip>
                  <Chip tone="outline" className="border-white/60 text-white">
                    {hackathon.datesLabel}
                  </Chip>
                  <Chip tone="outline" className="border-white/60 text-white">
                    {hackathon.deadlineLabel}
                  </Chip>
                  <Chip tone="outline" className="border-white/60 text-white">
                    $1,000 prize pool
                  </Chip>
                </div>
                <h1 className="font-display text-display mt-6">
                  {hackathon.name}
                </h1>
                <p className="text-body-lg mt-6">{hackathon.descriptor}</p>
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
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Community partners, attached to the hero's foot as a full-width band
          rather than a floating card. IG's wordmark and EthPadThai's mark are
          white-on-transparent so the band is ink. Eth CDM, EthTAO and 4Seas
          only have dark or coloured artwork, so they ride on rounded white
          tiles. */}
      <div className="bg-ink py-10 text-white">
        <Container className="flex flex-col items-center text-center">
          <p className="text-label font-mono text-white/70 uppercase">
            Community partners
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            <li>
              <Image
                src="/images/logo/wordmark-white.svg"
                alt={siteConfig.name}
                width={160}
                height={58}
                unoptimized
                className="h-20 w-auto object-contain"
              />
            </li>
            <li>
              <Image
                src={mediaUrl("partners/ethpadthai.webp")!}
                alt="EthPadThai"
                width={160}
                height={48}
                className="h-24 w-auto object-contain"
              />
            </li>
            <li>
              {/* OpenBuild's white wordmark, the one this repo already ships
                  for the Chiang Mai partner band. logo.openbuild.xyz is a
                  Google Drive folder, not a fetchable asset. */}
              <Image
                src="/images/logo/openbuild-white.svg"
                alt="OpenBuild"
                width={169}
                height={36}
                unoptimized
                className="h-16 w-auto object-contain"
              />
            </li>
            <li>
              {/* GCC's white full trademark from their official logo pack,
                  trimmed from the 8000px canvas and resized. */}
              <Image
                src="/images/hackathon/gcc.webp"
                alt="GCC"
                width={800}
                height={184}
                className="h-16 w-auto object-contain"
              />
            </li>
            <li>
              <Image
                src="/images/hackathon/eth-cdm.webp"
                alt="Eth Cinco de Mayo"
                width={291}
                height={100}
                className="h-20 w-auto rounded-[--radius-sm] bg-white object-contain px-3 py-1"
              />
            </li>
            <li>
              <Image
                src="/images/hackathon/ethtao.webp"
                alt="EthTAO"
                width={399}
                height={404}
                className="h-24 w-auto rounded-[--radius-sm] bg-white object-contain p-1"
              />
            </li>
            <li>
              <Image
                src="/images/hackathon/4seas.webp"
                alt="4Seas"
                width={500}
                height={113}
                className="h-16 w-auto rounded-[--radius-sm] bg-white object-contain px-3"
              />
            </li>
          </ul>
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

      <Section tone="paper" id="rules">
        <SectionHeading
          label="The rules"
          title="How the week works"
          intro="All work lives in the issues of the leanp2p repo. Issues depend on each other, and closed means merged: a dependency still in review keeps the next issue closed to claims."
        />
        <ol className="text-body-lg mt-10 max-w-3xl list-decimal space-y-4 pl-8">
          {loop.map((step) => (
            <li key={step.title}>
              <strong className="font-mono">{step.title}</strong> {step.body}
            </li>
          ))}
        </ol>
        <div className="text-body-lg mt-8 max-w-3xl space-y-4">
          <p>
            These are the rules in full. Until the leanp2p repo carries its own
            RULES.md, this page is canonical.
          </p>
          <p>
            Everything runs on the clock in UTC. Organisers and mentors answer
            questions in the{" "}
            <a href={hackathon.discord} rel="noreferrer">
              event channel
            </a>{" "}
            all week, and acceptances are announced there.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeading label="Dates" title="Deadlines and judging" />
        <ul className="text-body-lg mt-8 max-w-3xl space-y-4">
          {deadlines.map((item) => (
            <li key={item.title}>
              <strong className="font-mono">{item.title}</strong>{" "}
              {"body" in item ? item.body : ""}
            </li>
          ))}
        </ul>
        <div className="mt-10 max-w-3xl space-y-6">
          <div>
            <h3 className="text-headline-sm">How entries are scored</h3>
            <p className="text-body-lg mt-3">
              Submissions are scored on two axes, code quality and how much of
              the work carries machine-checked proofs, and the final score
              multiplies the two. Well engineered code earns its value together
              with proofs.
            </p>
          </div>
          <div>
            <h3 className="text-headline-sm">Prize eligibility*</h3>
            <p className="text-body-lg mt-3">
              Prizes recognise meaningful contributions. The judges assess your
              whole body of merged work from the week, and they have the final
              say on what counts. The baseline:
            </p>
            <ul className="text-body-lg mt-4 list-disc space-y-3 pl-8">
              <li>
                Your work closes at least one claimed issue, with the PR opened
                before code close and merged.
              </li>
              <li>
                The contribution is real implementation work or real proof work.
                Mechanical changes, typo fixes, formatting, dependency bumps,
                and trivial refactors do not count by themselves.
              </li>
              <li>
                You can explain and defend your work in the video, including
                your reasoning and your proofs. A contribution you cannot defend
                in the video does not count for prizes.
              </li>
              <li>
                All counted work falls inside the event window, 2 to 7 November.
              </li>
            </ul>
            <p className="text-body-lg mt-4">
              If a participant&apos;s overall contributions stay at a basic
              level, the judges may rule them out of prize consideration. The
              week is still worth it: the work is public, the learning is yours,
              and every merged PR is yours to show.
            </p>
            <p className="text-body-md mt-4">
              * With fewer than 7 active participants, the prize pool can be
              reduced.
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
            The pool is a thank you, not the reason to join. The{" "}
            <a href="#rules">full rules, including eligibility</a>, are on this
            page.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeading label="Who runs it" title="Organisers and partners" />
        {/* The marks live in the hero now, Road to Devcon above the heading
            and the community partner band under the text, so this section
            carries the prose only. */}
        <div className="text-body-lg mt-8 max-w-3xl space-y-4">
          <p>
            Invisible Garden organises the week. Invisible Garden is a traveling
            academy for Ethereum developers, with editions in Chiang Mai in 2024
            and Buenos Aires in 2025.
          </p>
          <p>
            EthPadThai, 4Seas, EthTAO, OpenBuild, GCC and Eth Cinco de Mayo are
            the community partners of the week.
          </p>
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
