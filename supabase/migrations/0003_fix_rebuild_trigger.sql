-- pg_net lives in the `net` schema on Supabase, even though the extension is
-- registered under `extensions`. 0002 called it as extensions.net.http_post,
-- which is not a valid reference, so the trigger silently did nothing.
create or replace function internal.notify_site_rebuild()
returns trigger
language plpgsql
security definer
set search_path = internal, net, public
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
