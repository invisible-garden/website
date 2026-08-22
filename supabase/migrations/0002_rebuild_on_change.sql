-- Rebuild the site when content changes.
--
-- Why a rebuild rather than a cache refresh: on Netlify's Next runtime the
-- pages regenerate on schedule but keep replaying cached database responses,
-- and every documented way to invalidate that cache either does nothing or
-- 500s the site. Verified 2026-08-22. A deploy always produces fresh data, and
-- content changes here are occasional, so this is the honest mechanism.
--
-- Triggers are statement level, so editing twenty rows in one statement is one
-- build, not twenty.

create extension if not exists pg_net with schema extensions;

-- Private settings, holding the build hook URL. No RLS policy exists, so anon
-- and authenticated cannot read it; the trigger runs as definer.
create schema if not exists internal;

create table if not exists internal.settings (
  key   text primary key,
  value text not null
);

alter table internal.settings enable row level security;

create or replace function internal.notify_site_rebuild()
returns trigger
language plpgsql
security definer
set search_path = internal, extensions, public
as $$
declare
  hook text;
begin
  select value into hook from internal.settings where key = 'netlify_build_hook';
  if hook is null then
    return null;  -- not configured yet, stay quiet
  end if;
  perform net.http_post(
    url := hook,
    body := jsonb_build_object('table', tg_table_name, 'at', now())
  );
  return null;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'editions', 'people', 'edition_people', 'fellows',
    'projects', 'partners', 'edition_partners'
  ]
  loop
    execute format(
      'drop trigger if exists rebuild_site on public.%I', t);
    execute format(
      'create trigger rebuild_site after insert or update or delete on public.%I
         for each statement execute function internal.notify_site_rebuild()', t);
  end loop;
end
$$;
