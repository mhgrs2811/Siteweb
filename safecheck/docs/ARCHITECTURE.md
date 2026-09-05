# Architecture SafeCheck

> « Vérifiez avant de faire confiance. »

Ce document décrit les choix structurants de l'application mobile SafeCheck.
Il est la référence pour toute contribution.

## 1. Vue d'ensemble

```
┌──────────────────────────────────────────────────────────────┐
│  src/app            Expo Router (écrans, navigation)          │
├──────────────────────────────────────────────────────────────┤
│  src/features       Hooks & composants par domaine fonctionnel│
│                     (check, report, alerts, learn, auth,       │
│                      subscription)                            │
├──────────────────────────────────────────────────────────────┤
│  src/core           Socle transverse                          │
│    ui/              Primitives accessibles (Button, Text…)    │
│    theme/           Design tokens + ThemeProvider             │
│    i18n/            Traductions (fr par défaut, en)           │
│    data/            Contrats de dépôts + implémentations      │
│      repositories/  Interfaces (aucune dépendance technique)  │
│      supabase/      Implémentation Supabase                   │
│      mock/          Implémentation hors-ligne (dev, tests)    │
│    supabase/        Client, stockage sécurisé, types DB       │
│    config/          Env validé (zod), feature flags           │
│    analytics/       Analytique privacy-first (stub)           │
├──────────────────────────────────────────────────────────────┤
│  src/domain         Logique pure : identifiants, scoring,     │
│                     entités. Zéro dépendance React/Supabase.  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  supabase/          PostgreSQL (migrations, RLS, RPC),        │
│                     Edge Functions, seed                      │
└──────────────────────────────────────────────────────────────┘
```

**Règle de dépendance** : une couche ne dépend que des couches en dessous.
`app → features → core → domain`. `domain` ne dépend de rien.

## 2. Couche domaine (`src/domain`)

Logique métier pure et testée unitairement :

| Module           | Rôle                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `identifier.ts`  | Détection et normalisation d'un numéro (E.164), email (minuscules) ou site (hostname).         |
| `risk.ts`        | Calcul du niveau de risque à partir des statistiques de signalements (volume, récence, diversité). |
| `entities.ts`    | Types métier partagés (CheckResult, Alert, LearnArticle, UserProfile…).                        |

La normalisation est **dupliquée côté SQL** (`normalize_identifier`) de façon
défensive : le client fait le travail complet, le serveur garantit l'unicité.

### Scoring du risque

Le score (0-100, jamais affiché brut) additionne :
- volume total (log2, max 35 pts),
- récence sur 30 jours (max 35 pts),
- diversité des signaleurs (max 30 pts).

Garde-fous : un signalement isolé ne dépasse jamais « faible ». Les seuils
sont volontairement conservateurs (voir `RISK_THRESHOLDS`). Ce calcul est
côté client aujourd'hui ; il pourra migrer côté serveur (vue matérialisée)
sans toucher l'UI puisque `CheckResult.risk` fait partie du contrat de dépôt.

## 3. Couche données (`src/core/data`)

### Pourquoi une abstraction ?

- Développer et tester **sans réseau** (`EXPO_PUBLIC_DATA_SOURCE=mock`).
- Préparer l'**API publique SafeCheck** : le jour où le mobile consomme
  notre propre API plutôt que Supabase directement, seule l'implémentation change.
- Isoler les **erreurs techniques** : tout remonte en `DataError` avec un code
  (`network`, `unauthorized`, `rate_limited`, `validation`, `not_found`, `unknown`)
  traduit par l'UI.

### Contrats

`CheckRepository`, `ReportRepository`, `AlertRepository`, `LearnRepository`,
`AuthRepository`, `FeatureFlagRepository` — voir `repositories/index.ts`.

### État serveur

TanStack Query gère cache, rechargement et états (`isPending`, `isError`).
Les clés de requête sont centralisées dans les hooks de `features/*`.

## 4. Backend Supabase (`supabase/`)

### Modèle

| Table            | Rôle                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| `profiles`       | 1:1 avec `auth.users` ; plan, locale. Créé par trigger.               |
| `entities`       | Un contact vérifiable (kind + valeur normalisée, unique).             |
| `reports`        | Signalements ; statut de modération ; `reporter_id` nullable (RGPD).  |
| `alerts`         | Alertes éditoriales, publiées par date, région optionnelle.           |
| `learn_articles` | Contenus pédagogiques (Markdown minimal).                             |
| `feature_flags`  | Surcharge distante des flags (kill-switch, plan minimum).             |
| `check_logs`     | Anti-abus : hash requérant + horodatage, purgé sous 24 h.             |

### Sécurité (principe : *les tables brutes ne sont jamais lisibles*)

- RLS activée partout.
- `entities`, `reports` (hors les siens), `check_logs` : **aucune** politique
  de lecture client. Tout passe par des fonctions `SECURITY DEFINER` :
  - `check_identifier(kind, value)` → statistiques agrégées + extraits modérés
    (280 caractères), limitée à 60 appels/min/requérant.
  - `submit_report(...)` → nécessite un utilisateur, 20/jour, un seul
    signalement par personne et par contact.
  - `list_my_reports()`, `delete_my_account()`.
- Les descriptions ne sont publiées qu'après modération (`status = approved`).
- Le hash du requérant est salé par jour : impossible de reconstituer un
  historique de recherche par personne.

### Edge Function `check-identifier`

Façade HTTP pour l'API publique/B2B (quotas par clé, agrégation de sources
externes). Non utilisée par le mobile en v1.

## 5. Feature flags & freemium (`src/core/config/feature-flags.ts`)

Deux dimensions : `enabled` (déploiement) et `minPlan` (`free < premium <
family < business`). `useFeatureAccess(key)` renvoie `available`,
`upgrade_required` ou `disabled`. Le composant `<PremiumGate>` matérialise
le paywall (la facturation — RevenueCat ou Stripe — viendra brancher `profiles.plan`).

## 6. UI, accessibilité, design tokens

- `src/core/theme/tokens.ts` : palette calme, contrastes WCAG AA, typographie
  ≥ 16 pt (corps 18 pt), zone tactile ≥ 48 pt (boutons principaux 56 pt).
- Toute couleur de risque est **toujours** accompagnée d'une icône et d'un texte.
- Chaque écran a **une** action principale, en pied de page (`<Screen footer>`).
- `accessibilityLabel`, `accessibilityRole`, `accessibilityLiveRegion` sur les
  éléments interactifs et les messages d'état.
- 4 onglets seulement : Vérifier, Signaler, Alertes, Apprendre. Le compte
  est accessible depuis l'en-tête.

## 7. Internationalisation

i18next + react-i18next, français par défaut, détection via `expo-localization`.
Les clés sont typées : une clé absente est une erreur de compilation. Un test
garantit la parité des clés fr/en et l'absence de vocabulaire accusatoire
(`src/core/i18n/__tests__/editorial.test.ts`).

## 8. Navigation (Expo Router)

```
(tabs)/index          Vérifier — barre de recherche unique
(tabs)/report         Signaler — intro + mes signalements
(tabs)/alerts         Alertes
(tabs)/learn          Apprendre
check/[kind]/[value]  Résultat d'une vérification
report/new            Formulaire en 4 étapes (modal)
alert/[id]            Détail d'une alerte
learn/[slug]          Article
auth/sign-in          Connexion par code email (modal)
account               Compte, plan, suppression RGPD
```

## 9. Qualité

- `npm run typecheck` — TypeScript strict (+ `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`).
- `npm run lint` — eslint-config-expo.
- `npm run test` — Jest (domaine, config, éditorial, brouillon de signalement).
- `npm run check` — les trois.

## 10. Évolutions prévues

Voir `ROADMAP.md`. Les points d'extension déjà en place : nouveau type
d'identifiant (`IdentifierKind`), nouvelle source de données (implémenter
`Repositories`), nouveau flag (`FEATURE_KEYS` + ligne SQL), nouvelle langue
(fichier dans `locales/` typé par `Translations`).
