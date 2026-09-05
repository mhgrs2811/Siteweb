# Feuille de route

## V1 — Fondations (ce dépôt)

- [x] Architecture modulaire (domain / core / features / app)
- [x] Vérification d'un numéro, email, site avec niveau de risque expliqué
- [x] Signalement en 4 étapes, connexion par code email
- [x] Alertes et contenus pédagogiques
- [x] Schéma PostgreSQL, RLS, RPC, anti-abus
- [x] Design tokens accessibles, i18n fr/en, feature flags
- [ ] Icônes et splash définitifs
- [ ] Tests de composants (Testing Library) sur les écrans clés
- [x] Pipeline CI GitHub Actions (typecheck, lint, tests)
- [ ] EAS Build

## V1.1 — Lancement

- [ ] Console de modération (web, Supabase + Next.js ou Retool)
- [ ] Notifications push pour les alertes (`alerts.push`)
- [ ] Procédure de contestation d'un signalement
- [ ] Politique de confidentialité, CGU, écran d'onboarding (3 écrans max)
- [ ] Analytique RGPD (PostHog EU)

## V2 — Premium

- [ ] Facturation (RevenueCat) → `profiles.plan`
- [ ] Rapports détaillés, historique illimité synchronisé
- [ ] Partage famille (`family.sharing`) : alerter un proche vulnérable
- [ ] Scoring serveur (vue matérialisée rafraîchie) + sources externes

## V3 — Protection proactive & B2B

- [ ] Extension d'identification d'appels (CallKit / CallScreeningService)
- [ ] Filtrage SMS (iOS Message Filter Extension)
- [ ] API publique (Edge Functions, clés d'API, quotas) — `business.api`
- [ ] Intégrations cybersécurité (listes anti-phishing, partenaires bancaires)
