import type { PostgrestError } from '@supabase/supabase-js';

import type { FeatureFlag, FeatureKey } from '@/core/config/feature-flags';
import { FEATURE_KEYS } from '@/core/config/feature-flags';
import type { SafeCheckSupabaseClient } from '@/core/supabase/client';
import type { Database, Json } from '@/core/supabase/database.types';
import {
  assessRisk,
  formatPhoneForDisplay,
  type Alert,
  type CheckResult,
  type EntityStats,
  type Identifier,
  type LearnArticle,
  type NewReportInput,
  type PublicReport,
  type ReportCategory,
  type UserProfile,
  type UserReport,
} from '@/domain';

import type {
  AlertRepository,
  AuthRepository,
  AuthState,
  CheckRepository,
  FeatureFlagRepository,
  LearnRepository,
  Repositories,
  ReportRepository,
} from '../repositories';
import { DataError } from '../repositories';

type Tables = Database['public']['Tables'];

// ---------------------------------------------------------------------------
// Erreurs
// ---------------------------------------------------------------------------
function toDataError(error: PostgrestError | { message: string; code?: string | undefined } | null): DataError {
  if (!error) return new DataError('unknown');
  const msg = error.message ?? '';
  if (msg.includes('rate_limited')) return new DataError('rate_limited', msg, error);
  if (msg.includes('unauthorized') || error.code === '42501') return new DataError('unauthorized', msg, error);
  if (msg.includes('validation') || msg.includes('already_reported') || error.code === '22023') {
    return new DataError('validation', msg, error);
  }
  if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) {
    return new DataError('network', msg, error);
  }
  return new DataError('unknown', msg, error);
}

// ---------------------------------------------------------------------------
// Vérification
// ---------------------------------------------------------------------------
interface CheckRpcPayload {
  stats: {
    totalReports: number;
    recentReports: number;
    distinctReporters: number;
    lastReportedAt: string | null;
    categories: { category: ReportCategory; count: number }[];
  };
  publicReports: { id: string; category: ReportCategory; excerpt: string | null; createdAt: string }[];
}

function parseCheckPayload(json: Json): CheckRpcPayload | null {
  if (typeof json !== 'object' || json === null || Array.isArray(json)) return null;
  if (!('stats' in json) || !('publicReports' in json)) return null;
  return json as unknown as CheckRpcPayload;
}

class SupabaseCheckRepository implements CheckRepository {
  constructor(private readonly client: SafeCheckSupabaseClient) {}

  async check(identifier: Identifier): Promise<CheckResult> {
    const { data: raw, error } = await this.client.rpc('check_identifier', {
      p_kind: identifier.kind,
      p_value: identifier.value,
    });
    if (error) throw toDataError(error);
    const data = parseCheckPayload(raw);
    if (!data) throw new DataError('unknown', 'Réponse inattendue du serveur');

    const stats: EntityStats = {
      totalReports: data.stats.totalReports,
      recentReports: data.stats.recentReports,
      distinctReporters: data.stats.distinctReporters,
      lastReportedAt: data.stats.lastReportedAt,
      categories: data.stats.categories,
    };
    const publicReports: PublicReport[] = data.publicReports;
    return { identifier, stats, risk: assessRisk(stats), publicReports, checkedAt: new Date().toISOString() };
  }
}

// ---------------------------------------------------------------------------
// Signalements
// ---------------------------------------------------------------------------
class SupabaseReportRepository implements ReportRepository {
  constructor(private readonly client: SafeCheckSupabaseClient) {}

  async create(input: NewReportInput): Promise<UserReport> {
    const { data, error } = await this.client.rpc('submit_report', {
      p_kind: input.identifier.kind,
      p_value: input.identifier.value,
      p_category: input.category,
      p_channel: input.channel ?? null,
      p_description: input.description ?? null,
      p_had_financial_loss: input.hadFinancialLoss ?? null,
    });
    if (error) throw toDataError(error);
    return {
      id: data.id,
      identifier: input.identifier,
      category: data.category,
      status: data.status,
      createdAt: data.created_at,
    };
  }

  async listMine(): Promise<UserReport[]> {
    const { data, error } = await this.client.rpc('list_my_reports', {});
    if (error) throw toDataError(error);
    return data.map((row) => ({
      id: row.id,
      identifier: {
        kind: row.kind,
        value: row.value,
        display: row.kind === 'phone' ? formatPhoneForDisplay(row.value) : row.value,
      },
      category: row.category,
      status: row.status,
      createdAt: row.created_at,
    }));
  }
}

// ---------------------------------------------------------------------------
// Alertes
// ---------------------------------------------------------------------------
function mapAlert(row: Tables['alerts']['Row']): Alert {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    body: row.body,
    severity: row.severity,
    publishedAt: row.published_at ?? row.created_at,
    region: row.region,
  };
}

class SupabaseAlertRepository implements AlertRepository {
  constructor(private readonly client: SafeCheckSupabaseClient) {}

  async list(params?: { region?: string | null; limit?: number }): Promise<Alert[]> {
    let query = this.client
      .from('alerts')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(params?.limit ?? 50);
    if (params?.region) query = query.or(`region.is.null,region.eq.${params.region}`);
    const { data, error } = await query;
    if (error) throw toDataError(error);
    return data.map(mapAlert);
  }

  async getById(id: string): Promise<Alert | null> {
    const { data, error } = await this.client.from('alerts').select('*').eq('id', id).maybeSingle();
    if (error) throw toDataError(error);
    return data ? mapAlert(data) : null;
  }
}

// ---------------------------------------------------------------------------
// Apprendre
// ---------------------------------------------------------------------------
function mapArticle(row: Tables['learn_articles']['Row']): LearnArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    body: row.body,
    category: row.category as LearnArticle['category'],
    readingMinutes: row.reading_minutes,
    publishedAt: row.published_at ?? row.created_at,
  };
}

class SupabaseLearnRepository implements LearnRepository {
  constructor(private readonly client: SafeCheckSupabaseClient) {}

  async list(): Promise<LearnArticle[]> {
    const { data, error } = await this.client
      .from('learn_articles')
      .select('*')
      .order('published_at', { ascending: false });
    if (error) throw toDataError(error);
    return data.map(mapArticle);
  }

  async getBySlug(slug: string): Promise<LearnArticle | null> {
    const { data, error } = await this.client.from('learn_articles').select('*').eq('slug', slug).maybeSingle();
    if (error) throw toDataError(error);
    return data ? mapArticle(data) : null;
  }
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
class SupabaseAuthRepository implements AuthRepository {
  constructor(private readonly client: SafeCheckSupabaseClient) {}

  private async loadProfile(userId: string, email: string | null): Promise<UserProfile> {
    const { data, error } = await this.client.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) throw toDataError(error);
    return {
      id: userId,
      email,
      displayName: data?.display_name ?? null,
      plan: data?.plan ?? 'free',
      locale: data?.locale ?? 'fr',
      createdAt: data?.created_at ?? new Date().toISOString(),
    };
  }

  async getState(): Promise<AuthState> {
    const { data, error } = await this.client.auth.getSession();
    if (error) throw toDataError(error);
    const user = data.session?.user;
    if (!user) return { status: 'signed_out' };
    return { status: 'signed_in', profile: await this.loadProfile(user.id, user.email ?? null) };
  }

  onStateChange(listener: (state: AuthState) => void): () => void {
    const { data } = this.client.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (!user) {
        listener({ status: 'signed_out' });
        return;
      }
      // Ne jamais faire d'appel Supabase synchrone dans ce callback (deadlock documenté) :
      void Promise.resolve().then(async () => {
        listener({ status: 'signed_in', profile: await this.loadProfile(user.id, user.email ?? null) });
      });
    });
    return () => data.subscription.unsubscribe();
  }

  async requestEmailOtp(email: string): Promise<void> {
    const { error } = await this.client.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    });
    if (error) throw toDataError(error);
  }

  async verifyEmailOtp(email: string, code: string): Promise<void> {
    const { error } = await this.client.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: 'email',
    });
    if (error) throw new DataError('validation', error.message, error);
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) throw toDataError(error);
  }

  async deleteAccount(): Promise<void> {
    const { error } = await this.client.rpc('delete_my_account', {});
    if (error) throw toDataError(error);
    await this.client.auth.signOut({ scope: 'local' });
  }
}

// ---------------------------------------------------------------------------
// Feature flags distants
// ---------------------------------------------------------------------------
class SupabaseFeatureFlagRepository implements FeatureFlagRepository {
  constructor(private readonly client: SafeCheckSupabaseClient) {}

  async fetchOverrides(): Promise<Partial<Record<FeatureKey, Partial<FeatureFlag>>>> {
    const { data, error } = await this.client.from('feature_flags').select('key, enabled, min_plan');
    if (error) throw toDataError(error);
    const known = new Set<string>(FEATURE_KEYS);
    const overrides: Partial<Record<FeatureKey, Partial<FeatureFlag>>> = {};
    for (const row of data) {
      if (known.has(row.key)) overrides[row.key as FeatureKey] = { enabled: row.enabled, minPlan: row.min_plan };
    }
    return overrides;
  }
}

export function createSupabaseRepositories(client: SafeCheckSupabaseClient): Repositories {
  return {
    check: new SupabaseCheckRepository(client),
    report: new SupabaseReportRepository(client),
    alert: new SupabaseAlertRepository(client),
    learn: new SupabaseLearnRepository(client),
    auth: new SupabaseAuthRepository(client),
    featureFlags: new SupabaseFeatureFlagRepository(client),
  };
}
