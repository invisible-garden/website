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

**Never imply a Goa lineup.** The people grid shows the community from previous
editions. Copy says "mentors and speakers who taught at previous gatherings",
never "our speakers", "meet the mentors", or "who you will meet in Goa".

**Words that must not appear on the site:** "program" and the old "our program"
framing, "apply" as a flow, Edge City or any other pop-up village, Costa Rica,
Berlin, the Mentors Collective, Singapore NGO registration, "Work over Holiday",
"Professional Punk Excellence", and vacation vocabulary (retreat, paradise,
escape, relax, beach life).

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
the Supabase CLI, never edited in the dashboard. `types/database.ts` is
generated with `pnpm db:types`, not hand-written. RLS stays on with a `select`
policy for `anon` and nothing else.

**Storage paths.** `people.photo_path` holds `people/leo-lara.webp`, never a
URL. Build URLs with `mediaUrl()` in `lib/media.ts`.

**`people.headline`** holds the Webflow `role` string verbatim. `org` and
`job_title` are advisory guesses. Render `headline` unless
`headline_reviewed` is true.

## Data facts worth remembering

- 2 editions migrate: Chiang Mai 2024 and Buenos Aires 2025. Costa Rica 2025
  never happened and is excluded.
- Expected load: 2 editions, 87 people, 98 memberships, 22 fellows, 22 projects.
- Everyone in `people` is a "mentor / speaker". The source data has no way to
  tell them apart, so the database does not either.
- Speakers and mentors have no bio and no social links in Webflow. Those columns
  exist but stay null after the migration.
- Partners have no source data at all. The list is re-authored by hand, the
  logos are recovered from Webflow site assets.
- Mentor names include Chinese, Thai, Cyrillic and accented Latin. Keep the font
  fallback chains, and transliterate slugs to ASCII.

## Current state

Phase 0 is done: the app scaffolds, builds and passes CI. Routes are stubs.

- Phase 1, database: `supabase/migrations/0001_initial.sql` is written and not
  yet applied. It needs the database password or a Management API token.
- Phase 2, migration: `extract` is implemented, `assets`, `transform`, `review`
  and `load` are stubs carrying their specification in a comment.
- Phase 3, content: MDX files in `content/` are placeholders, blocked on the
  open questions in `mb/content-brief.md` §6.
- Phase 4, frontend: not started.

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
pnpm migrate:extract                        # see scripts/migrate-webflow/README.md
```
