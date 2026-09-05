/**
 * Analytique respectueuse de la vie privée.
 *
 * Règles :
 *  - Jamais l'identifiant vérifié ni le contenu d'un signalement.
 *  - Jamais d'identifiant publicitaire.
 *  - Événements agrégés uniquement (usage produit).
 * Implémentation : console en développement ; brancher un fournisseur
 * conforme RGPD (ex. PostHog EU, self-hosted) via `setAnalyticsSink`.
 */
import { isProduction } from '@/core/config/env';

export type AnalyticsEvent =
  | { name: 'check_performed'; props: { kind: 'phone' | 'email' | 'website'; level: string } }
  | { name: 'report_started' }
  | { name: 'report_submitted'; props: { category: string } }
  | { name: 'alert_opened' }
  | { name: 'article_opened' }
  | { name: 'sign_in_completed' }
  | { name: 'premium_wall_shown'; props: { feature: string } };

export interface AnalyticsSink {
  track(event: AnalyticsEvent): void;
}

let sink: AnalyticsSink = {
  track(event) {
    if (!isProduction) console.debug('[analytics]', event.name, 'props' in event ? event.props : '');
  },
};

export function setAnalyticsSink(next: AnalyticsSink) {
  sink = next;
}

export function track(event: AnalyticsEvent) {
  try {
    sink.track(event);
  } catch {
    // L'analytique ne doit jamais casser l'application.
  }
}
