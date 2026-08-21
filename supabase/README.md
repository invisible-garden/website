# Database

Schema lives in `migrations/`, applied with the Supabase CLI. Never edit tables
in the dashboard, the migration files are the source of truth.

Put `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF` and `SUPABASE_DB_PASSWORD`
in a local gitignored `.env`, then:

```bash
set -a; . ./.env; set +a
pnpm supabase link --project-ref "$SUPABASE_PROJECT_REF"
pnpm db:migrate      # supabase db push
pnpm db:types        # regenerates types/database.ts from the live schema
pnpm db:verify       # tables, enums, RLS, and the anon read/write check
```

`0001_initial.sql` was applied through the Management API before the password
existed, so its history row was added with
`supabase migration repair --status applied 0001`. Nothing else needs repairing.

Without a password there is still a fallback: `pnpm db:migrate:api` applies the
same files through the Management API. The secret key (`sb_secret_...`) cannot
run DDL, it only reaches PostgREST and Storage.

After applying, verify from an anonymous client that `select` works and any
`insert` is rejected. `pnpm db:verify` does both.
