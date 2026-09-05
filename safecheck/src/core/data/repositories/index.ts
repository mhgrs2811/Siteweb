/**
 * Contrats de la couche données.
 *
 * L'UI et les hooks ne connaissent QUE ces interfaces. Les implémentations
 * (`../supabase`, `../mock`) sont interchangeables via `DataProvider`.
 * Cela permet : tests sans réseau, développement hors-ligne, et migration
 * future vers une API publique SafeCheck sans réécrire les écrans.
 */
import type {
  Alert,
  CheckResult,
  Identifier,
  LearnArticle,
  NewReportInput,
  UserProfile,
  UserReport,
} from '@/domain';
import type { FeatureFlag, FeatureKey } from '@/core/config/feature-flags';

export interface CheckRepository {
  check(identifier: Identifier): Promise<CheckResult>;
}

export interface ReportRepository {
  create(input: NewReportInput): Promise<UserReport>;
  listMine(): Promise<UserReport[]>;
}

export interface AlertRepository {
  list(params?: { region?: string | null; limit?: number }): Promise<Alert[]>;
  getById(id: string): Promise<Alert | null>;
}

export interface LearnRepository {
  list(): Promise<LearnArticle[]>;
  getBySlug(slug: string): Promise<LearnArticle | null>;
}

export type AuthState =
  | { status: 'loading' }
  | { status: 'signed_out' }
  | { status: 'signed_in'; profile: UserProfile };

export interface AuthRepository {
  getState(): Promise<AuthState>;
  onStateChange(listener: (state: AuthState) => void): () => void;
  /** Connexion sans mot de passe : un code à 6 chiffres envoyé par email (simple pour tous les publics). */
  requestEmailOtp(email: string): Promise<void>;
  verifyEmailOtp(email: string, code: string): Promise<void>;
  signOut(): Promise<void>;
  /** Suppression RGPD : anonymise les signalements, supprime le profil. */
  deleteAccount(): Promise<void>;
}

export interface FeatureFlagRepository {
  fetchOverrides(): Promise<Partial<Record<FeatureKey, Partial<FeatureFlag>>>>;
}

export interface Repositories {
  check: CheckRepository;
  report: ReportRepository;
  alert: AlertRepository;
  learn: LearnRepository;
  auth: AuthRepository;
  featureFlags: FeatureFlagRepository;
}

/** Erreur métier typée, traduite côté UI via son code. */
export class DataError extends Error {
  constructor(
    public readonly code:
      | 'network'
      | 'unauthorized'
      | 'rate_limited'
      | 'validation'
      | 'not_found'
      | 'unknown',
    message?: string,
    public override readonly cause?: unknown,
  ) {
    super(message ?? code);
    this.name = 'DataError';
  }
}
