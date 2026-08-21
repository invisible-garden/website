# Webflow to Supabase migration

Five idempotent phases, each writing to `data/` so the next one can re-run
without touching the Webflow API again. Full design in `mb/tech-design.md`
section 5, sequencing in `mb/implementation-plan.md` phase 2.

```bash
pnpm migrate:extract     # collections + asset list  -> data/raw/
pnpm migrate:assets      # images -> Supabase Storage, data/manifest.json
pnpm migrate:transform   # typed rows -> data/out/, data/review/headlines.csv
pnpm migrate:review      # apply the hand-edited CSV over data/out/
pnpm migrate:load        # upsert into Supabase on slug
```

Needs a local `.env` (gitignored) with `WEBFLOW_API_TOKEN` and
`SUPABASE_SECRET_KEY`. Neither key belongs in the repo, in Vercel, or in a
`NEXT_PUBLIC_` variable.

Status: `extract` is implemented. The other four phases are stubs carrying their
specification in a comment.

The Webflow site stays paid and published until the new site is verified in
production. That is the rollback path.
