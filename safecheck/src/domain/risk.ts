/**
 * Niveau de risque communautaire.
 *
 * IMPORTANT (principe éditorial) : un niveau de risque n'est JAMAIS une
 * accusation. C'est une agrégation de signalements communautaires, pondérée
 * par leur récence et leur diversité. Les libellés utilisateurs vivent dans
 * i18n et doivent respecter `docs/EDITORIAL_GUIDELINES.md`.
 */

export type RiskLevel = 'unknown' | 'low' | 'moderate' | 'high';

export interface EntityStats {
  /** Signalements approuvés par la modération, toutes périodes. */
  totalReports: number;
  /** Signalements approuvés sur les 30 derniers jours. */
  recentReports: number;
  /** Nombre de personnes distinctes ayant signalé. */
  distinctReporters: number;
  /** Date du dernier signalement approuvé (ISO 8601) ou null. */
  lastReportedAt: string | null;
  /** Répartition par catégorie, triée par fréquence décroissante. */
  categories: readonly { category: ReportCategory; count: number }[];
}

export type ReportCategory =
  | 'phishing'
  | 'fake_bank'
  | 'fake_delivery'
  | 'tech_support'
  | 'romance'
  | 'investment'
  | 'fake_shop'
  | 'impersonation_admin'
  | 'subscription_trap'
  | 'harassment'
  | 'other';

export const REPORT_CATEGORIES: readonly ReportCategory[] = [
  'phishing',
  'fake_bank',
  'fake_delivery',
  'tech_support',
  'romance',
  'investment',
  'fake_shop',
  'impersonation_admin',
  'subscription_trap',
  'harassment',
  'other',
];

export type RiskReasonCode =
  | 'no_reports'
  | 'few_reports'
  | 'many_reports'
  | 'recent_activity'
  | 'multiple_reporters'
  | 'dominant_category'
  | 'old_reports_only';

export interface RiskAssessment {
  level: RiskLevel;
  /** Score interne 0-100, non affiché brut à l'utilisateur. */
  score: number;
  /** Codes de raisons, traduits côté UI en phrases prudentes. */
  reasons: RiskReasonCode[];
}

/**
 * Seuils volontairement conservateurs : mieux vaut sous-estimer que stigmatiser
 * un contact sur la base de 1 ou 2 signalements non corroborés.
 */
export const RISK_THRESHOLDS = {
  moderate: 25,
  high: 60,
  /** Un signalement isolé ne suffit jamais à dépasser « faible ». */
  minReportersForModerate: 2,
} as const;

export function assessRisk(stats: EntityStats): RiskAssessment {
  const reasons: RiskReasonCode[] = [];

  if (stats.totalReports === 0) {
    return { level: 'unknown', score: 0, reasons: ['no_reports'] };
  }

  // Volume total (log pour éviter l'emballement) : max ~35 pts
  const volume = Math.min(35, Math.round(Math.log2(stats.totalReports + 1) * 9));
  // Récence : max 35 pts
  const recency = Math.min(35, stats.recentReports * 7);
  // Diversité des signaleurs : max 30 pts
  const diversity = Math.min(30, (stats.distinctReporters - 1) * 8);

  let score = Math.max(0, Math.min(100, volume + recency + diversity));

  if (stats.distinctReporters < RISK_THRESHOLDS.minReportersForModerate) {
    score = Math.min(score, RISK_THRESHOLDS.moderate - 1);
  }

  if (stats.totalReports >= 10) reasons.push('many_reports');
  else reasons.push('few_reports');
  if (stats.recentReports > 0) reasons.push('recent_activity');
  else reasons.push('old_reports_only');
  if (stats.distinctReporters >= 3) reasons.push('multiple_reporters');
  const top = stats.categories[0];
  if (top && stats.totalReports >= 3 && top.count / stats.totalReports >= 0.6) {
    reasons.push('dominant_category');
  }

  const level: RiskLevel =
    score >= RISK_THRESHOLDS.high ? 'high' : score >= RISK_THRESHOLDS.moderate ? 'moderate' : 'low';

  return { level, score, reasons };
}
