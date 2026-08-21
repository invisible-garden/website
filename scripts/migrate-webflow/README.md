# Webflow to Supabase migration

Five idempotent phases, each writing to `data/` so the next one can re-run
without touching the Webflow API again. Full design in `mb/tech-design.md`
section 5, sequencing in `mb/implementation-plan.md` phase 2.

```bash
pnpm migrate:extract       # collections + asset list  -> data/raw/
pnpm migrate:assets        # mentor and fellow photos -> Storage, manifest
pnpm migrate:site-assets   # every Webflow site asset -> webflow-assets/
pnpm migrate:transform     # typed rows -> data/out/, review/headlines.csv
pnpm migrate:review        # apply the hand-edited CSV over data/out/
pnpm migrate:load          # upsert into Supabase on slug
```

Needs a local `.env` (gitignored) with `WEBFLOW_API_TOKEN` and
`SUPABASE_SECRET_KEY`. Neither key belongs in the repo, in Vercel, or in a
`NEXT_PUBLIC_` variable.

Status, 2026-08-21: `extract`, `assets`, `site-assets`, `transform` and `load`
have all run against the live data. The database holds 2 editions, 88 people, 98
memberships, 22 fellows and 22 projects. Storage holds 111 profile photos at two
widths plus 119 mirrored site assets.

`review` is still a stub. Leo decided to keep the Webflow headlines as they are,
so the CSV pass is deferred, possibly permanently. `transform` still writes
`data/review/headlines.csv` in case that changes.

Partners have no source data. `content/partners.draft.json` is a checklist
recovered from the live site, and `scripts/db/seed-partners.ts` loads it once a
human confirms tiers and adds link URLs.

The Webflow site stays paid and published until the new site is verified in
production. That is the rollback path.
