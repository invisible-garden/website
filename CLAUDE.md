# CLAUDE.md

Guidance for working in this repository.

## What this is

The website for **Invisible Commons**, Goa, India, 17 to 31 October 2026, a
joint project of Invisible Garden and Common Compute. It replaces the current
Webflow site at https://invisible.garden and takes the Webflow CMS data with it
into Supabase.

Planning documents live in `mb/`, a symlink to the notes vault. They are not
committed and they outrank anything written here:

| File                        | Covers                                                |
| --------------------------- | ----------------------------------------------------- |
| `mb/tech-requirements.md`   | Scope and the stack decision                          |
| `mb/tech-design.md`         | Architecture, schema, migration design, routes        |
| `mb/implementation-plan.md` | Phases 0 to 7, what "done" means for each             |
| `mb/content-brief.md`       | What every page says, voice rules, open questions     |
| `mb/visual-language.md`     | Type, colour, shape, spacing, components              |
| `mb/mockup-notes.md`        | How to read `mb/stich-mockup.png`, and what to ignore |

Read the relevant one before changing anything in its area.

## Stack

Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS 4,
Supabase (Postgres and Storage, Singapore region), MDX for page copy, Netlify
free tier.

The Next major version is pinned. Netlify runs Next through an adapter, so a new
Next major waits until the runtime supports it. Keep the repo standard Next.js,
`netlify.toml` is the only host-specific file, and redirects stay in
`next.config.ts` rather than a `_redirects` file.

Pages are statically generated and revalidated on a timer, `revalidate = 300`.
Server components query Supabase directly. There are no client-side database
calls, so no database key reaches the browser.

## Rules that are not negotiable

**Secrets.** `SUPABASE_SECRET_KEY` and `WEBFLOW_API_TOKEN` never enter the repo,
never a `NEXT_PUBLIC_` variable, never a commit, never `mb/`. They belong in a
local gitignored `.env`. `secrets.txt` in the repo root holds the credentials
Leo pasted and is gitignored, never read it into a committed file. The publishable key is safe to ship, RLS grants `select`
only.

**Real people only.** Nobody appears on the site unless they are in the Supabase
data. Never invent a name, a title, or an organisation, not even as filler. The
mock-up contains AI-generated people, they are not real.

**Whose site this is.** invisible.garden belongs to Invisible Garden. Nav,
footer identity, about, editions, recaps and the people directory are Invisible
Garden's alone, `siteConfig`. The joint branding is scoped to the 2026 event, so
it applies to the homepage and to any other surface about Invisible Commons,
`eventConfig`. Never frame the event as "the next Invisible Garden edition" with
the others supporting it.

**Invisible Commons has three co-hosts**: Invisible Garden, Common Compute and
OpenBuild, equal weight, named together. OpenBuild joined on 2026-08-21, after
the content brief was written, so `mb/content-brief.md` and `mb/mockup-notes.md`
still describe two organisations and two hero chips. The code is right, the
documents lag. OpenBuild also appears in the old site's community partner list.
Decided 2026-08-21: they stay in both places, a past community partner and a
2026 co-host, because both are facts.

**Never imply a Goa lineup.** The people grid shows the community from previous
editions. Copy says "mentors and speakers who taught at previous gatherings",
never "our speakers", "meet the mentors", or "who you will meet in Goa".

**Words that must not appear on the site:** "program" and the old "our program"
framing, "apply" as a flow, Edge City or any other pop-up village, Costa Rica,
Berlin, the Mentors Collective, Singapore NGO registration, "Work over Holiday",
"Professional Punk Excellence", and vacation vocabulary (retreat, paradise,
escape, relax, beach life).

**Two audits guard the rules.** `pnpm audit:html` checks alt text, link names,
heading order and metadata. `pnpm audit:copy` checks the banned vocabulary, the
banned subjects, and the lineup framing. Text that came from the database is
marked `data-verbatim` in the components and is out of scope: bios and project
descriptions are their authors' words, not ours, and must not be edited to fit
our voice.

**Copy voice.** English at B2 level, plain and direct. Short sentences.
Understatement, real numbers instead of adjectives. No em-dashes for subphrases,
use commas. Banned: leverage, seamless, robust, cutting-edge, innovative,
journey, unlock, ecosystem as filler. Full rules in `mb/content-brief.md` §4.

**Design tokens.** Colours, type sizes, radii and shadows live in
`app/globals.css` under `@theme`. Never hard-code a hex in a component. The
brand gradient is vertical, `linear-gradient(#0040b1, #74acdf 30%, #ffe174 70%,
#ffe174)`, available as the `bg-horizon` utility. Peach `#ffbba5` is the
canonical accent, the exact hex is the brand.

**Accessibility.** WCAG AA. Peach and yellow fail AA on white for body text,
they are for large text and non-text elements only. Alt text on every photo,
visible focus states, keyboard navigable.

**Database.** Schema changes go in `supabase/migrations/` and get applied with
`pnpm db:migrate` (`supabase db push`), never edited in the dashboard. The CLI
is linked and the database password lives in the local `.env`. `types/database.ts` is
generated with `pnpm db:types`, not hand-written. RLS stays on with a `select`
policy for `anon` and nothing else.

**Storage paths.** `people.photo_path` holds `people/leo-lara.webp`, never a
URL. Build URLs with `mediaUrl()` in `lib/media.ts`.

**`people.headline`** holds the Webflow `role` string verbatim, and that is what
every page renders. `org` and `job_title` hold advisory guesses that nothing
reads. Leo decided on 2026-08-21 to keep the headlines as Webflow had them, so
the review pass over `data/review/headlines.csv` is deferred, possibly forever.
Do not build UI that depends on `org` or `job_title` until a reviewed row
exists, and never render them while `headline_reviewed` is false.

## Data facts worth remembering

- 2 editions migrate: Chiang Mai 2024 and Buenos Aires 2025. Costa Rica 2025
  never happened and is excluded.
- Loaded: 2 editions, 88 people, 98 memberships, 22 fellows, 22 projects. The
  plan says 87 people because it assumed the person with no edition membership
  would be dropped. Leo decided on 2026-08-21 to keep her: Lauren has a person
  row and no membership.
- Three fellows are the same human as a person row and are linked through
  `fellows.person_id`: Tim Pechersky, Daniel Arroyo, and Surfer_05, who is the
  person Surfer, also known as Alok, a Chiang Mai fellow and a Buenos Aires
  mentor.
- All 22 projects are Chiang Mai 2024. Buenos Aires projects come later from
  `invisible-garden/arg25-Projects`, once the team decides which graduated.
- Enrico Bottazzi is the one person with no photo and gets the placeholder.
- Everyone in `people` is a "mentor / speaker". The source data has no way to
  tell them apart, so the database does not either.
- Speakers and mentors have no bio and no social links in Webflow. Those columns
  exist but stay null after the migration.
- Partners have no source data at all. The list is re-authored by hand, the
  logos are recovered from Webflow site assets.
- Mentor names include Chinese, Thai, Cyrillic and accented Latin. Keep the font
  fallback chains, and transliterate slugs to ASCII.

## Current state

Phases 0 to 4 are done. The site builds, deploys to
https://ig-website.netlify.app on every push to main, and every route renders
from real data. `mb/DEFERRED.md` lists what is still blocked on the team. It lives in the notes
vault, not in the repo, so management can read it. Keep it current.

- Phase 1, database: done. `0001_initial.sql` is applied, RLS verified, types
  generated from the live schema.
- Phase 2, migration: done except the human review. The database holds 2
  editions, 88 people, 98 memberships, 22 fellows and 22 projects, and 111
  photos are in the `media` bucket at two widths. `review` is still a stub, it
  waits on the headline pass over `data/review/headlines.csv`.
- Phase 3, content: about and Chiang Mai recap copy are written. Buenos Aires
  recap is a thin draft, blocked on the deck and the archives. Homepage copy
  lives in the section components, with the practical block visibly deferred.
- Phase 4, frontend: done. Homepage, editions index, edition recaps, people
  directory and profiles, about, partners, sitemap, OpenGraph images.
- Phase 5, deployment: Netlify is connected with env vars set. Analytics is
  deferred by Leo until Plausible or Umami is chosen.
- Phases 6 and 7, cutover: redirects are written and verified, the rest waits
  on DNS.

## Open decisions, do not guess these

Participation model, registration flow and the hero CTA, Devcon anchoring,
edition numbering, legal entity wording for the footer, and whether Invisible
Commons reuses the IG visual identity or gets a joint one with Common Compute.
Ask, do not invent an answer in copy.

Two documented deviations from the plan: `people` carries an extra
`headline_reviewed` column that the review phase needs, and routes use
`/people`, with `/mentors` redirecting to it.

## Commands

```bash
pnpm dev
pnpm typecheck && pnpm lint && pnpm build   # what CI runs
pnpm audit:html <origin>                    # alt text, headings, metadata
pnpm audit:copy <origin>                    # the content-brief voice rules
pnpm db:migrate && pnpm db:types            # schema changes
pnpm migrate:extract                        # see scripts/migrate-webflow/README.md
```

Build the site once with a cleared `.next` before pushing anything that touches
MDX. A warm cache hides MDX parse errors that fail in CI.

**Netlify runs Next through an adapter, so config it does not understand fails
silently.** `images.formats` broke `/_next/image` entirely on 2026-08-21: every
image request returned the app shell with status 200 and the site rendered
blank grids, while the local build was perfect. After any change to
`next.config.ts`, deploy and then run `pnpm audit:html <origin>`, which now
fetches one image per route and checks the response is really an image.
