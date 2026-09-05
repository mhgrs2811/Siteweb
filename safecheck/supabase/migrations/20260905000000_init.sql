-- =============================================================================
-- SafeCheck — schéma initial
--
-- Principes :
--  * Privacy by design : aucune donnée personnelle du signaleur n'est exposée.
--    Les descriptions ne sont visibles publiquement qu'après modération et sous
--    forme d'extrait (280 caractères).
--  * Toute lecture agrégée passe par des fonctions SECURITY DEFINER : les
--    tables brutes ne sont jamais lisibles directement par les clients.
--  * Le vocabulaire (« signalement », « risque potentiel ») reflète la charte
--    éditoriale : la base stocke des signalements, jamais des « fraudeurs ».
-- =============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------
create type public.identifier_kind as enum ('phone', 'email', 'website');

create type public.report_category as enum (
  'phishing', 'fake_bank', 'fake_delivery', 'tech_support', 'romance',
  'investment', 'fake_shop', 'impersonation_admin', 'subscription_trap',
  'harassment', 'other'
);

create type public.report_status as enum ('pending', 'approved', 'rejected');
create type public.contact_channel as enum ('call', 'sms', 'email', 'website', 'messaging', 'other');
create type public.alert_severity as enum ('info', 'warning', 'critical');
create type public.plan as enum ('free', 'premium', 'family', 'business');

-- ---------------------------------------------------------------------------
-- Profils utilisateurs (1:1 avec auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 60),
  plan public.plan not null default 'free',
  locale text not null default 'fr' check (char_length(locale) between 2 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, locale)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'locale', 'fr'))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Entités vérifiables (un numéro, un email, un domaine)
-- ---------------------------------------------------------------------------
create table public.entities (
  id uuid primary key default gen_random_uuid(),
  kind public.identifier_kind not null,
  value text not null check (char_length(value) between 3 and 255),
  created_at timestamptz not null default now(),
  unique (kind, value)
);

-- Normalisation défensive côté serveur (le client fait la normalisation complète).
create or replace function public.normalize_identifier(p_kind public.identifier_kind, p_value text)
returns text language sql immutable as $$
  select case p_kind
    when 'phone'   then regexp_replace(replace(p_value, '(0)', ''), '[^0-9+]', '', 'g')
    when 'email'   then lower(trim(p_value))
    when 'website' then regexp_replace(lower(trim(p_value)), '^(https?://)?(www\.)?', '')
  end;
$$;

-- ---------------------------------------------------------------------------
-- Signalements
-- ---------------------------------------------------------------------------
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities (id) on delete cascade,
  -- set null : la suppression d'un compte anonymise ses signalements sans les perdre
  reporter_id uuid references auth.users (id) on delete set null,
  category public.report_category not null,
  channel public.contact_channel,
  description text check (char_length(description) <= 2000),
  had_financial_loss boolean,
  status public.report_status not null default 'pending',
  moderated_at timestamptz,
  moderated_by uuid references auth.users (id) on delete set null,
  moderation_note text,
  created_at timestamptz not null default now()
);

create index reports_entity_approved_idx on public.reports (entity_id, created_at desc) where status = 'approved';
create index reports_reporter_idx on public.reports (reporter_id, created_at desc);
create index reports_pending_idx on public.reports (created_at) where status = 'pending';
-- Anti-abus : une personne ne signale un même contact qu'une fois.
create unique index reports_one_per_reporter_entity on public.reports (entity_id, reporter_id) where reporter_id is not null;

-- ---------------------------------------------------------------------------
-- Alertes éditoriales & contenus pédagogiques
-- ---------------------------------------------------------------------------
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 120),
  summary text not null check (char_length(summary) <= 300),
  body text not null,
  severity public.alert_severity not null default 'info',
  region text check (char_length(region) = 2),
  published_at timestamptz,
  created_at timestamptz not null default now()
);
create index alerts_published_idx on public.alerts (published_at desc) where published_at is not null;

create table public.learn_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'),
  title text not null check (char_length(title) <= 120),
  summary text not null check (char_length(summary) <= 300),
  body text not null,
  category text not null default 'general',
  reading_minutes int not null default 3 check (reading_minutes between 1 and 60),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Feature flags distants
-- ---------------------------------------------------------------------------
create table public.feature_flags (
  key text primary key,
  enabled boolean not null default true,
  min_plan public.plan not null default 'free',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Journal anti-abus des vérifications (hashé, purgé, jamais relié à un profil)
-- ---------------------------------------------------------------------------
create table public.check_logs (
  id bigint generated always as identity primary key,
  requester_hash text not null,
  created_at timestamptz not null default now()
);
create index check_logs_requester_idx on public.check_logs (requester_hash, created_at desc);

create or replace function public.purge_check_logs()
returns void language sql security definer set search_path = public as $$
  delete from public.check_logs where created_at < now() - interval '24 hours';
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.entities enable row level security;
alter table public.reports enable row level security;
alter table public.alerts enable row level security;
alter table public.learn_articles enable row level security;
alter table public.feature_flags enable row level security;
alter table public.check_logs enable row level security;

create policy "profiles: lecture de son propre profil"
  on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles: mise à jour de son propre profil (hors plan)"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and plan = (select p.plan from public.profiles p where p.id = auth.uid()));

-- entities : aucune politique → lecture uniquement via les fonctions SECURITY DEFINER.

create policy "reports: lecture de ses propres signalements"
  on public.reports for select to authenticated using (reporter_id = auth.uid());
-- insertion uniquement via submit_report()

create policy "alerts: lecture publique des alertes publiées"
  on public.alerts for select to anon, authenticated
  using (published_at is not null and published_at <= now());

create policy "learn_articles: lecture publique des articles publiés"
  on public.learn_articles for select to anon, authenticated
  using (published_at is not null and published_at <= now());

create policy "feature_flags: lecture publique"
  on public.feature_flags for select to anon, authenticated using (true);

-- check_logs : aucune politique client.

-- ---------------------------------------------------------------------------
-- RPC : vérification d'un identifiant
-- ---------------------------------------------------------------------------
create or replace function public.check_identifier(p_kind public.identifier_kind, p_value text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_value text := public.normalize_identifier(p_kind, p_value);
  v_entity_id uuid;
  v_requester text;
  v_recent_calls int;
  v_stats jsonb;
  v_reports jsonb;
begin
  if v_value is null or char_length(v_value) < 3 then
    raise exception 'validation' using errcode = '22023';
  end if;

  -- Limitation de débit : 60 vérifications / minute par requérant (utilisateur ou IP hashée).
  v_requester := encode(digest(
    coalesce(auth.uid()::text, current_setting('request.headers', true)::jsonb ->> 'x-forwarded-for', 'anon')
    || to_char(now(), 'YYYY-MM-DD'), 'sha256'), 'hex');
  select count(*) into v_recent_calls
    from public.check_logs
    where requester_hash = v_requester and created_at > now() - interval '1 minute';
  if v_recent_calls >= 60 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  insert into public.check_logs (requester_hash) values (v_requester);

  select id into v_entity_id from public.entities where kind = p_kind and value = v_value;

  if v_entity_id is null then
    return jsonb_build_object(
      'stats', jsonb_build_object(
        'totalReports', 0, 'recentReports', 0, 'distinctReporters', 0,
        'lastReportedAt', null, 'categories', '[]'::jsonb),
      'publicReports', '[]'::jsonb);
  end if;

  with approved as (
    select * from public.reports where entity_id = v_entity_id and status = 'approved'
  ),
  cats as (
    select category, count(*) as count from approved group by category order by count desc
  )
  select jsonb_build_object(
    'totalReports', (select count(*) from approved),
    'recentReports', (select count(*) from approved where created_at > now() - interval '30 days'),
    'distinctReporters', (select count(distinct coalesce(reporter_id::text, id::text)) from approved),
    'lastReportedAt', (select max(created_at) from approved),
    'categories', coalesce((select jsonb_agg(jsonb_build_object('category', category, 'count', count)) from cats), '[]'::jsonb)
  ) into v_stats;

  select coalesce(jsonb_agg(jsonb_build_object(
      'id', id,
      'category', category,
      'excerpt', case when description is null or description = '' then null else left(description, 280) end,
      'createdAt', created_at
    ) order by created_at desc), '[]'::jsonb)
  into v_reports
  from (
    select id, category, description, created_at
    from public.reports
    where entity_id = v_entity_id and status = 'approved'
    order by created_at desc
    limit 10
  ) r;

  return jsonb_build_object('stats', v_stats, 'publicReports', v_reports);
end;
$$;

grant execute on function public.check_identifier(public.identifier_kind, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- RPC : dépôt d'un signalement
-- ---------------------------------------------------------------------------
create or replace function public.submit_report(
  p_kind public.identifier_kind,
  p_value text,
  p_category public.report_category,
  p_channel public.contact_channel default null,
  p_description text default null,
  p_had_financial_loss boolean default null
)
returns public.reports
language plpgsql
security definer
set search_path = public
as $$
declare
  v_value text := public.normalize_identifier(p_kind, p_value);
  v_entity_id uuid;
  v_report public.reports;
  v_daily int;
begin
  if auth.uid() is null then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  if v_value is null or char_length(v_value) < 3 then
    raise exception 'validation' using errcode = '22023';
  end if;

  -- Anti-abus : 20 signalements par jour et par compte.
  select count(*) into v_daily from public.reports
    where reporter_id = auth.uid() and created_at > now() - interval '24 hours';
  if v_daily >= 20 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.entities (kind, value) values (p_kind, v_value)
    on conflict (kind, value) do update set value = excluded.value
    returning id into v_entity_id;

  insert into public.reports (entity_id, reporter_id, category, channel, description, had_financial_loss)
  values (v_entity_id, auth.uid(), p_category, p_channel, nullif(trim(p_description), ''), p_had_financial_loss)
  returning * into v_report;

  return v_report;
exception
  when unique_violation then
    raise exception 'validation' using errcode = '22023', message = 'already_reported';
end;
$$;

grant execute on function public.submit_report(public.identifier_kind, text, public.report_category, public.contact_channel, text, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- RPC : liste de ses signalements avec l'identifiant associé
-- ---------------------------------------------------------------------------
create or replace function public.list_my_reports()
returns table (
  id uuid, kind public.identifier_kind, value text,
  category public.report_category, status public.report_status, created_at timestamptz
)
language sql security definer set search_path = public stable as $$
  select r.id, e.kind, e.value, r.category, r.status, r.created_at
  from public.reports r join public.entities e on e.id = r.entity_id
  where r.reporter_id = auth.uid()
  order by r.created_at desc
  limit 200;
$$;
grant execute on function public.list_my_reports() to authenticated;

-- ---------------------------------------------------------------------------
-- RPC : suppression de compte (RGPD, droit à l'effacement)
-- ---------------------------------------------------------------------------
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  -- Les signalements sont conservés anonymisés (reporter_id → null via FK) : ils
  -- protègent la communauté sans plus être reliés à une personne.
  delete from auth.users where id = auth.uid();
end;
$$;
grant execute on function public.delete_my_account() to authenticated;

-- ---------------------------------------------------------------------------
-- Valeurs initiales des feature flags (miroir de src/core/config/feature-flags.ts)
-- ---------------------------------------------------------------------------
insert into public.feature_flags (key, enabled, min_plan) values
  ('check.basic', true, 'free'),
  ('check.history', true, 'free'),
  ('check.detailed_reports', true, 'premium'),
  ('report.create', true, 'free'),
  ('alerts.feed', true, 'free'),
  ('alerts.push', false, 'premium'),
  ('learn.articles', true, 'free'),
  ('protection.proactive', false, 'premium'),
  ('family.sharing', false, 'family'),
  ('business.api', false, 'business');
