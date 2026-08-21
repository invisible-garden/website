# Invisible Garden website

The new https://invisible.garden, replacing the Webflow site. Built for
**Invisible Commons**, Goa, India, 17 to 31 October 2026, a joint project of
Invisible Garden and Common Compute.

Next.js 15 (App Router, TypeScript), Tailwind CSS 4, Supabase Postgres and
Storage, deployed on Netlify. Page copy is MDX in this repo. Mentors, speakers,
editions, fellows, projects and partners come from Supabase.

## Requirements

- Node 22 or newer
- pnpm 10 (`corepack enable`)

## Getting started

```bash
pnpm install
cp .env.example .env.local     # fill in the Supabase URL and publishable key
pnpm dev                       # http://localhost:3000
```

The app runs without Supabase values until a route reads the database. Phase 4
routes will need them.

## Scripts

| Command                     | What it does                                                                  |
| --------------------------- | ----------------------------------------------------------------------------- |
| `pnpm dev`                  | Development server                                                            |
| `pnpm build` / `pnpm start` | Production build and server                                                   |
| `pnpm typecheck`            | `next typegen` then `tsc --noEmit`                                            |
| `pnpm lint`                 | ESLint                                                                        |
| `pnpm format`               | Prettier over the repo                                                        |
| `pnpm db:types`             | Regenerate `types/database.ts` from the linked project                        |
| `pnpm migrate:*`            | Webflow to Supabase migration phases, see `scripts/migrate-webflow/README.md` |

## Layout

```
app/            routes, App Router
  editions/[slug]/   edition recap pages
  people/[slug]/     mentor and speaker profiles
components/     shared UI
content/        MDX page copy
lib/            supabase client, media URLs, typed queries, site config
scripts/
  migrate-webflow/   extract | assets | transform | review | load
supabase/
  migrations/        versioned schema, applied through the CLI
types/
  database.ts        generated, do not hand-edit after the first generation
mb/                  planning notes, symlinked, never committed
```

## Environment

Every variable is listed in `.env.example`. Two rules, no exceptions:

- `SUPABASE_SECRET_KEY` and `WEBFLOW_API_TOKEN` live only in a local gitignored
  `.env`. They never reach the repo, a `NEXT_PUBLIC_` variable, or the Netlify
  build environment.
- The publishable key is safe to ship. RLS allows `select` and nothing else.

## Where it runs

The site deploys to https://ig-website.netlify.app on every push to `main`,
and the real domain still points at the old Webflow site until cutover.

## Deployment

Netlify free tier, preview deploy per pull request. Build config in
`netlify.toml`. The Next major version is pinned: the Netlify runtime is an
adapter and can lag a new Next major, so upgrade only once it catches up. CI runs typecheck, lint and build on
every pull request. The Webflow site stays paid and published until the new site
is verified in production, that is the rollback path.

## Deferred work

`mb/DEFERRED.md` in the notes vault lists everything the site needs from the
team: decisions, copy, assets, and the partner data. It lives there rather than
in the repo so management can read it. Nothing on it blocks a build, every
deferred surface hides itself or shows an honest placeholder.

## Plans

Requirements, technical design, content brief, visual language and the phased
implementation plan live in `mb/` (a symlink to the notes vault, not part of the
repository).
