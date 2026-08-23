# Invisible Commons website

https://invisiblecommons.org, a one-page site for **Invisible Commons**, Goa,
India, 17 to 31 October 2026, a joint project of Invisible Garden, Common
Compute and OpenBuild.

Next.js 15 (App Router, TypeScript), Tailwind CSS 4, deployed on Netlify.
There is no database and no CMS. Every word on the page is in this repository.

## This is a branch, and it stays a branch

`main` is the Invisible Garden site, https://invisible.garden, and it has a
database, a people directory and edition recaps. This branch,
`invisible-commons`, is a different site built from the same repository so the
design system and components are shared.

It is a fork that drifts. It is never merged back. Shared fixes land on `main`
first and get cherry-picked here when wanted. See
`mb/site-split-instructions.md`.

## Requirements

- Node 22 or newer
- pnpm 10 (`corepack enable`)

## Getting started

```bash
pnpm install
pnpm dev                       # http://localhost:3000
```

Nothing needs configuring. `.env.example` holds the site URL and the two
optional analytics values, and that is the whole list.

## Scripts

| Command                     | What it does                  |
| --------------------------- | ----------------------------- |
| `pnpm dev`                  | Development server            |
| `pnpm build` / `pnpm start` | Production build and server   |
| `pnpm verify`               | typecheck, lint, test, build  |
| `pnpm audit:*`              | See `scripts/audit/README.md` |

## Layout

```
app/            the single route, plus robots, sitemap, icon and OG image
components/
  home/         the five sections of the page
  ui/           button, chip, container, section
lib/            dates, site config, OG card
scripts/audit/  html, copy, browser and axe checks
mb/             planning notes, symlinked, never committed
```

## Environment

`NEXT_PUBLIC_SITE_URL` and, optionally, the two Umami values. There are no
secrets, because there is nothing to authenticate against. If you are adding a
Supabase or Webflow variable, you are on the wrong branch.

## Where it runs

Its own Netlify site, `ic-website`, built from this branch, with its own deploy
token and its own Umami site id. https://invisiblecommons.org points at it, DNS
set up on 2026-08-23, independently of the invisible.garden cutover. The branch
deploy also answers at
https://invisible-commons--ic-website.netlify.app.

## Deployment

Netlify free tier, preview deploy per pull request. Build config in
`netlify.toml`. The Next major version is pinned: the Netlify runtime is an
adapter and can lag a new Next major, so upgrade only once it catches up. CI
runs typecheck, lint, test and build with no database variables set, which is
the test that this site stays static.

## Plans

The site brief is `mb/invisible-commons/invisiblecommons-brief.md`, the split
instructions are `mb/site-split-instructions.md`. `mb/` is a symlink to the
notes vault and is not part of the repository.
