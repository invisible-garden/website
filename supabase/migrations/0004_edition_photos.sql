-- Photo gallery per edition, fed from the Discord photo-booth archive that
-- `pnpm photos:publish` put in Storage at editions/<slug>/booth/.
--
-- A table rather than a bucket listing, so alt text, sort order and the
-- photographer credit are durable data instead of file-name conventions.
-- Credit is the Discord login of whoever posted the photo, loaded from
-- booth-manifest.json by scripts/photos/load-booth-gallery.ts.

create table edition_photos (
  id         uuid primary key default gen_random_uuid(),
  edition_id uuid not null references editions(id) on delete cascade,
  -- storage path such as `editions/chiang-mai-2024/booth/0001.webp`, not a URL
  photo_path text not null,
  -- generated placeholder at load time, wants a human pass, see mb/DEFERRED.md
  photo_alt  text not null,
  credit     text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (edition_id, photo_path)
);

create index on edition_photos (edition_id, sort_order);

alter table edition_photos enable row level security;

create policy "public read" on edition_photos
  for select to anon, authenticated using (true);

-- Same rebuild mechanism as 0002/0003: a content edit fires the Netlify build
-- hook, statement level, one build per statement.
drop trigger if exists rebuild_site on public.edition_photos;
create trigger rebuild_site after insert or update or delete on public.edition_photos
  for each statement execute function internal.notify_site_rebuild();
