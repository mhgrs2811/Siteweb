-- Lumé · skin_profiles
-- Onboarding answers about the skin. One row per profile.
-- Values are stable identifiers; labels live in the app's locale files.

create table public.skin_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  skin_type text not null check (skin_type in ('dry', 'oily', 'combination', 'normal', 'unknown')),
  goals text[] not null default '{}' check (
    cardinality(goals) <= 3
    and goals <@ array['glow', 'blemishes', 'texture', 'spots', 'wrinkles', 'pores', 'redness', 'hydration']::text[]
  ),
  sensitivities text[] not null default '{}' check (
    sensitivities <@ array['fragrance', 'alcohol', 'essential_oils', 'exfoliating_acids', 'retinoids', 'none']::text[]
  ),
  routine_level text not null check (routine_level in ('none', 'basic', 'complete')),
  monthly_budget text check (
    monthly_budget in ('under_20', '20_50', '50_100', 'over_100', 'undisclosed')
  ),
  lifestyle jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.skin_profiles is 'Skin profile from onboarding: type, goals, sensitivities, routine, budget, lifestyle.';

alter table public.skin_profiles enable row level security;

create policy "skin_profiles: owner can read"
  on public.skin_profiles for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "skin_profiles: owner can insert"
  on public.skin_profiles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "skin_profiles: owner can update"
  on public.skin_profiles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create trigger skin_profiles_set_updated_at
  before update on public.skin_profiles
  for each row execute function public.set_updated_at();
