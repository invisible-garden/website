# CLAUDE.md

Guidance for working in this repository, on the `invisible-commons` branch.

**Update 2026-09-03: Invisible Commons is called off, the event will not
happen.** This branch is now a plain holding page: "Under construction", one
line of copy, noindex in `app/layout.tsx`. The event content, the co-host
material and the social card are deleted, and the domain is to be reused for
something else. Do not restore the event anywhere on this branch. Everything
below about the event page describes history.

## Which site this is

This branch is **invisiblecommons.org**, a one-page site for **Invisible
Commons**, Goa, India, 17 to 31 October 2026, a joint project of Invisible
Garden, Common Compute and OpenBuild.

It is not invisible.garden. That site is `main`, it has a Supabase database, a
people directory and edition recaps, and none of it belongs here. The two sites
share a repository so the design system and the components are shared, nothing
more.

**The branch is a fork that drifts, and it is never merged back.** Shared fixes
land on `main` first and get cherry-picked here when wanted. Never merge this
branch into `main`, and never merge `main` into it wholesale.

Planning documents live in `mb/`, a symlink to the notes vault. They are not
committed and they outrank anything written here:

| File                                             | Covers                              |
| ------------------------------------------------ | ----------------------------------- |
| `mb/invisible-commons/invisiblecommons-brief.md` | This site: scope, content, identity |
| `mb/site-split-instructions.md`                  | Why there are two sites, and how    |
| `mb/visual-language.md`                          | Type, shape, spacing, components    |
| `mb/participation-model-memo.md`                 | The open question behind the CTA    |

`mb/content-brief.md` and `mb/mockup-notes.md` describe the Invisible Garden
site. Its voice rules in section 4 apply here too. Nothing else in them does.

## Stack

Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS 4, MDX
available for page copy, Netlify free tier. Every page is statically generated
at build time.

The Next major version is pinned. Netlify runs Next through an adapter, so a new
Next major waits until the runtime supports it. Keep the repo standard Next.js,
`netlify.toml` is the only host-specific file.

## Rules that are not negotiable

**No database.** No Supabase, no CMS, no data fetching at build or at request
time. Every word on the page is in this repository. The test is that the build
succeeds with no environment variable set but `NEXT_PUBLIC_SITE_URL`, which is
what CI runs. If a task seems to need a database, it belongs on `main`.

**No secrets.** There is nothing to authenticate against, so nothing to leak
and nothing to rotate. `secrets.txt` in the repo root is gitignored and holds
the Netlify deploy token only, never read it into a committed file.

**Three co-hosts, equal weight.** Invisible Garden, Common Compute and
OpenBuild, named together, same billing everywhere. This site must never
present Invisible Garden's history, community or identity as its own, and must
never frame the event as the next Invisible Garden edition. Invisible Garden is
one co-host name here.

**No Invisible Garden imagery, with one exception.** No participant photos, no
photo-booth archive, no Webflow photos, and never the Invisible Garden leaf or
wordmark as this site's own identity: the header, the favicon and the social
card carry no co-host's mark. The exception is the hero's co-host row, where
each of the three is billed with its own mark, which is what a mark is for.
Everything else on the page is design-led, type and colour, until the event
produces its own photos. Venue photos are out while the venue is unnamed.

**Real people only.** Nobody appears on this site unless they are real and
confirmed. Never invent a name, a title, or an organisation, not even as
filler. Today the page names no individuals at all, and that is correct.

**Never imply a lineup.** No speakers are confirmed. Copy must not suggest who
will be there.

**Do not name the venue.** The place is the region, "Goa, India". The venue
agreement is not closed (Leo, 2026-08-23).

**Words that must not appear on the site:** "program" and the old "our program"
framing, "apply" as a flow, Edge City or any other pop-up village, Costa Rica,
Berlin, the Mentors Collective, Singapore NGO registration, "Work over
Holiday", "Professional Punk Excellence", and vacation vocabulary (retreat,
paradise, escape, relax, beach life).

**Copy voice.** English at B2 level, plain and direct. Short sentences.
Understatement, real numbers instead of adjectives. No em-dashes for
subphrases, use commas. Banned: leverage, seamless, robust, cutting-edge,
innovative, journey, unlock, ecosystem as filler. Full rules in
`mb/content-brief.md` section 4.

**Design tokens.** Colours, type sizes, radii and shadows live in
`app/globals.css` under `@theme`. Never hard-code a hex in a component. The
accent is **sea teal**, decided 2026-08-23 and approved by Leo the same day
against the deploy. These are the values, do not drift from them:

- `--color-teal` `#0e9594`, the accent. 3.66:1 on white, so large text and
  non-text elements only, never body text.
- `--color-teal-deep` `#0b7c7b`, 5.02:1 on white. Links, labels, button fills.
- `--color-teal-dark` `#0a4f57` and `--color-sea-night` `#04222e`, the top of
  the hero gradient.
- `--color-teal-soft` `#bfe9e6`, chip backgrounds against ink.

The hero gradient is vertical, `bg-deep-sea`, and every stop stays at 5:1 or
better against white so hero body text is readable at the foot of the block.
Invisible Garden's blue-to-sun `bg-horizon` is theirs, do not bring it back.

**The site's mark.** `app/icon.svg` and `app/apple-icon.png` are a wave on the
site gradient, generic by instruction (Leo, 2026-08-23). They are the event's
mark, not a placeholder for a co-host's. Never put a co-host's logo in the
favicon, the header or the social card: those are the site's own identity, and
the hero row is where co-hosts are billed.

**Accessibility.** WCAG AA. Alt text on every image, visible focus states,
keyboard navigable.

**Audits.** `pnpm audit:html <origin>` checks alt text, link names, heading
order and metadata. `pnpm audit:copy <origin>` checks the banned vocabulary and
the framing rules above, including the rules that keep Invisible Garden's
history off this site. `pnpm audit:browser` and `pnpm audit:a11y` need
Playwright's Chromium, see `scripts/audit/README.md`.

**Netlify runs Next through an adapter, so config it does not understand fails
silently.** `images.formats` broke `/_next/image` entirely on 2026-08-21: every
image request returned the app shell with status 200 and the site rendered
blank grids, while the local build was perfect. After any change to
`next.config.ts`, deploy and then run `pnpm audit:html <origin>`.

## The page

One route, `app/page.tsx`. Five sections, order decided by Leo 2026-08-23:

1. `components/home/hero.tsx`, co-host names, title, dates, place, CTA.
2. `components/home/format-explainer.tsx`, what an unconference is here.
3. `components/home/co-hosts.tsx`, the three, equal billing.
4. `components/home/subjects.tsx`, the five tracks.
5. `components/home/practical.tsx`, dates, place, format, and the deferred card.

Dropped from the Invisible Garden homepage on purpose: the heading block with
links, the community section, and the track record section. They belong to
invisible.garden. Do not reintroduce them.

**Tracks**, from Leo 2026-08-23, overriding the deck: AI, Robotics,
Post-Quantum Cryptography, Formal Verification, ZKP.

**CTA**: `https://t.me/invisiblecommons`, the announcements channel. It becomes
a registration link when the participation model is decided.

## Open decisions, do not guess these

- Participation model and registration flow. The practical card says so
  visibly, which is the agreed placeholder.
- Common Compute's own mark, one of the 12 Commons Ring variants. Until it
  lands, its name is set in type in the hero row while the other two show
  logos, which bills the three unevenly. Fix that the day the pick arrives.
- The exact accent hexes above are the implementer's tuning of Leo's "sea
  teal", and still want his approval.
- Common Compute and OpenBuild have not signed off their own blurbs. Both were
  drafted from their public sites at Leo's direction.
- The deck's tagline stays out, Leo has not decided on it.

## Commands

```bash
pnpm dev
pnpm verify                                 # typecheck, lint, test, build
pnpm audit:html <origin>                    # alt text, headings, metadata
pnpm audit:copy <origin>                    # voice and framing rules
```

Build the site once with a cleared `.next` before pushing anything that touches
MDX. A warm cache hides MDX parse errors that fail in CI.
