import {
  assessRisk,
  type Alert,
  type CheckResult,
  type Identifier,
  type LearnArticle,
  type NewReportInput,
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
import { MOCK_ALERTS, MOCK_ARTICLES, MOCK_ENTITIES } from './seed';

const latency = (ms = 250) => new Promise<void>((r) => setTimeout(r, ms));

const EMPTY_STATS = {
  totalReports: 0,
  recentReports: 0,
  distinctReporters: 0,
  lastReportedAt: null,
  categories: [],
} as const;

class MockCheckRepository implements CheckRepository {
  async check(identifier: Identifier): Promise<CheckResult> {
    await latency();
    const entry = MOCK_ENTITIES[identifier.value];
    const stats = entry?.stats ?? EMPTY_STATS;
    return {
      identifier,
      stats,
      risk: assessRisk(stats),
      publicReports: entry?.reports ?? [],
      checkedAt: new Date().toISOString(),
    };
  }
}

class MockReportRepository implements ReportRepository {
  private readonly reports: UserReport[] = [];
  constructor(private readonly auth: MockAuthRepository) {}

  async create(input: NewReportInput): Promise<UserReport> {
    await latency();
    const state = await this.auth.getState();
    if (state.status !== 'signed_in') throw new DataError('unauthorized');
    const report: UserReport = {
      id: `mock-${Date.now()}`,
      identifier: input.identifier,
      category: input.category,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.reports.unshift(report);
    return report;
  }

  async listMine(): Promise<UserReport[]> {
    await latency(100);
    return [...this.reports];
  }
}

class MockAlertRepository implements AlertRepository {
  async list(params?: { region?: string | null; limit?: number }): Promise<Alert[]> {
    await latency();
    const region = params?.region;
    const list = MOCK_ALERTS.filter((a) => !region || !a.region || a.region === region);
    return list.slice(0, params?.limit ?? 50);
  }
  async getById(id: string): Promise<Alert | null> {
    await latency(100);
    return MOCK_ALERTS.find((a) => a.id === id) ?? null;
  }
}

class MockLearnRepository implements LearnRepository {
  async list(): Promise<LearnArticle[]> {
    await latency();
    return MOCK_ARTICLES;
  }
  async getBySlug(slug: string): Promise<LearnArticle | null> {
    await latency(100);
    return MOCK_ARTICLES.find((a) => a.slug === slug) ?? null;
  }
}

class MockAuthRepository implements AuthRepository {
  private state: AuthState = { status: 'signed_out' };
  private listeners = new Set<(s: AuthState) => void>();
  private pendingEmail: string | null = null;

  async getState(): Promise<AuthState> {
    return this.state;
  }
  onStateChange(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  async requestEmailOtp(email: string): Promise<void> {
    await latency();
    this.pendingEmail = email.trim().toLowerCase();
  }
  async verifyEmailOtp(email: string, code: string): Promise<void> {
    await latency();
    if (this.pendingEmail !== email.trim().toLowerCase() || code !== '123456') {
      throw new DataError('validation', 'Code invalide (mock : utiliser 123456)');
    }
    const profile: UserProfile = {
      id: 'mock-user',
      email: this.pendingEmail,
      displayName: null,
      plan: 'free',
      locale: 'fr',
      createdAt: new Date().toISOString(),
    };
    this.set({ status: 'signed_in', profile });
  }
  async signOut(): Promise<void> {
    this.set({ status: 'signed_out' });
  }
  async deleteAccount(): Promise<void> {
    this.set({ status: 'signed_out' });
  }
  private set(state: AuthState) {
    this.state = state;
    this.listeners.forEach((l) => l(state));
  }
}

class MockFeatureFlagRepository implements FeatureFlagRepository {
  async fetchOverrides() {
    return {};
  }
}

export function createMockRepositories(): Repositories {
  const auth = new MockAuthRepository();
  return {
    check: new MockCheckRepository(),
    report: new MockReportRepository(auth),
    alert: new MockAlertRepository(),
    learn: new MockLearnRepository(),
    auth,
    featureFlags: new MockFeatureFlagRepository(),
  };
}
