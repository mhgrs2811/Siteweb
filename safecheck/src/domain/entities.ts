import type { Identifier } from './identifier';
import type { EntityStats, ReportCategory, RiskAssessment } from './risk';

/** Résultat complet d'une vérification, tel que consommé par l'UI. */
export interface CheckResult {
  identifier: Identifier;
  stats: EntityStats;
  risk: RiskAssessment;
  /** Extraits de signalements publics (anonymisés, modérés). */
  publicReports: PublicReport[];
  checkedAt: string;
}

export interface PublicReport {
  id: string;
  category: ReportCategory;
  /** Description modérée, jamais de données personnelles. */
  excerpt: string | null;
  createdAt: string;
}

export type ReportStatus = 'pending' | 'approved' | 'rejected';

export interface NewReportInput {
  identifier: Identifier;
  category: ReportCategory;
  description?: string;
  /** L'utilisateur a-t-il subi une perte financière ? (facultatif, jamais de montant précis exigé) */
  hadFinancialLoss?: boolean;
  /** Canal de contact : appel, sms, email, site, courrier, autre. */
  channel?: ContactChannel;
}

export type ContactChannel = 'call' | 'sms' | 'email' | 'website' | 'messaging' | 'other';

export interface UserReport {
  id: string;
  identifier: Identifier;
  category: ReportCategory;
  status: ReportStatus;
  createdAt: string;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  title: string;
  summary: string;
  body: string;
  severity: AlertSeverity;
  publishedAt: string;
  /** Code région ISO, null = national/global. */
  region: string | null;
}

export interface LearnArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** Markdown simplifié (paragraphes + listes). */
  body: string;
  category: ReportCategory | 'general';
  readingMinutes: number;
  publishedAt: string;
}

export type Plan = 'free' | 'premium' | 'family' | 'business';

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  plan: Plan;
  locale: string;
  createdAt: string;
}
