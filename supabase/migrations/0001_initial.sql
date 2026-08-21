-- Invisible Garden website, initial schema.
-- Source of truth: mb/tech-design.md section 4. Apply with the Supabase CLI,
-- never by hand in the dashboard.

create type fellow_category as enum ('academic', 'honorary');
create type partner_tier    as enum ('sponsor', 'community');
create type edition_status  as enum ('upcoming', 'running', 'past');

create table editions (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  -- everything below is hand-authored, Webflow holds only name and slug
  city         text,
  country      text,
  starts_on    date,
  ends_on      date,
  status       edition_status not null default 'past',
  summary      text,
  accent_color text,
  sort_order   int not null default 0
);

create table people (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  full_name  text not null,
  -- Webflow `role`: a free-text headline, kept verbatim and never parsed away
  headline   text,
  -- advisory best-effort split of headline, only trusted once reviewed
  org        text,
  job_title  text,
  headline_reviewed boolean not null default false,
  -- storage path such as `people/leo-lara.webp`, not a URL
  photo_path text,
  photo_alt  text,
  -- nullable and unpopulated at migration time, growth direction only
  bio        text,
  x_handle   text,
  github     text,
  telegram   text,
  website    text,
  created_at timestamptz not null default now()
);

create table edition_people (
  edition_id uuid not null references editions(id) on delete cascade,
  person_id  uuid not null references people(id) on delete cascade,
  -- no role column: everyone is a "mentor / speaker", see tech-design 4.1
  sort_order int not null default 0,
  featured   boolean not null default false,
  primary key (edition_id, person_id)
);

create table fellows (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  bio        text,
  photo_path text,
  github     text,
  linkedin   text,
  category   fellow_category,
  person_id  uuid references people(id),   -- set for the 2 known overlaps
  edition_id uuid references editions(id)  -- hand-authored, absent in Webflow
);

create table projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,  -- markdown, converted from Webflow RichText
  github      text,
  authors_raw text,  -- free-text name list, kept verbatim
  edition_id  uuid references editions(id)
);

create table partners (
  id        uuid primary key default gen_random_uuid(),
  slug      text not null unique,
  name      text not null,
  logo_path text,
  url       text
);

create table edition_partners (
  edition_id uuid not null references editions(id) on delete cascade,
  partner_id uuid not null references partners(id) on delete cascade,
  tier       partner_tier not null,
  sort_order int not null default 0,
  primary key (edition_id, partner_id, tier)
);

create index on edition_people (edition_id, sort_order);
create index on edition_partners (edition_id, tier, sort_order);
create index on projects (edition_id);
create index on fellows (edition_id);

-- Security: read-only for anon, no write policy anywhere. Writes happen through
-- the migration script and the future table editor, both with the secret key.
alter table editions         enable row level security;
alter table people           enable row level security;
alter table edition_people   enable row level security;
alter table fellows          enable row level security;
alter table projects         enable row level security;
alter table partners         enable row level security;
alter table edition_partners enable row level security;

create policy "public read" on editions
  for select to anon, authenticated using (true);
create policy "public read" on people
  for select to anon, authenticated using (true);
create policy "public read" on edition_people
  for select to anon, authenticated using (true);
create policy "public read" on fellows
  for select to anon, authenticated using (true);
create policy "public read" on projects
  for select to anon, authenticated using (true);
create policy "public read" on partners
  for select to anon, authenticated using (true);
create policy "public read" on edition_partners
  for select to anon, authenticated using (true);
