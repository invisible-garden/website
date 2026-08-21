# Database

Schema lives in `migrations/`, applied with the Supabase CLI. Never edit tables
in the dashboard, the migration files are the source of truth.

```bash
pnpm supabase login                  # or export SUPABASE_ACCESS_TOKEN
pnpm supabase link --project-ref <ref>
pnpm supabase db push                # applies migrations/0001_initial.sql
pnpm db:types                        # regenerates types/database.ts
```

Applying DDL needs the database password or a Management API token. The secret
key (`sb_secret_...`) reaches PostgREST and Storage only, it cannot run DDL.

After applying, verify from an anonymous client that `select` works and any
`insert` is rejected.
