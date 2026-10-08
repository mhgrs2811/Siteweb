-- Lumé · profiles
-- One row per user (anonymous or linked), keyed by the auth user id.
-- Row Level Security: a user reads and writes her own row only. Deletion goes through the
-- delete-account Edge Function (service role) in Phase 7, never from the client.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 40),
  age_band text not null check (
    age_band in ('under_16', '16_19', '20_24', '25_29', '30_34', '35_40', 'over_40')
  ),
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  photo_consent_at timestamptz,
  photo_consent_version text,
  keep_photos boolean not null default true,
  notifications_opt_in boolean not null default false,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Account-level profile. Sensitive: skin data lives in skin_profiles.';
comment on column public.profiles.photo_consent_version is 'Version of the consent wording accepted; a new version asks again.';

alter table public.profiles enable row level security;

create policy "profiles: owner can read"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: owner can insert"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles: owner can update"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Shared trigger function: keeps updated_at honest on every table that uses it.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
