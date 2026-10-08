# Lumé

Coach de peau personnel : analyse cosmétique par selfie, routine personnalisée, suivi des progrès et scan de produits. Application iOS et Android construite avec Expo.

Le produit est décrit dans [`PRD.md`](./PRD.md). Le plan de chaque phase vit dans [`docs/plans/`](./docs/plans/).

> Lumé n'est pas un dispositif médical. L'application produit des estimations cosmétiques de l'apparence de la peau, jamais un diagnostic. Ce principe guide chaque texte de l'interface.

## État du projet

| Phase | Contenu                                                  | Statut  |
| ----- | -------------------------------------------------------- | ------- |
| 0     | Fondations : projet, design system, i18n, thème, EAS, CI | livrée  |
| 1     | Onboarding, auth anonyme Supabase, consentement          | à venir |
| 2     | Capture selfie, analyse IA, résultats                    | à venir |
| 3     | Paywall et abonnements RevenueCat                        | à venir |
| 4     | Routine, accueil, streak, notifications                  | à venir |
| 5     | Progrès, courbes, comparateur, cartes partageables       | à venir |
| 6     | Scanner produit et moteur de compatibilité               | à venir |
| 7     | Finition et mise en store                                | à venir |

## Stack

- Expo SDK 57, React Native 0.86, React 19.2, Expo Router, TypeScript strict.
- Development build via EAS (pas Expo Go), New Architecture, React Compiler activé.
- UI : React Native Reanimated 4, React Native Skia (anneau de score, aura générative), expo-blur, expo-haptics, expo-image, Phosphor (icônes), Fraunces et Instrument Sans (Google Fonts).
- État : Zustand (client) et TanStack Query (serveur). Préférences persistées avec AsyncStorage.
- i18n : i18next, fichiers FR et EN complets, détection de la langue de l'appareil.
- Qualité : ESLint, Prettier, Jest, CI GitHub Actions.
- À venir : Supabase (Phase 1), fournisseur d'IA vision côté serveur (Phase 2), RevenueCat (Phase 3), PostHog (Phase 1).

## Démarrer

Pré-requis : Node 22 (voir `.nvmrc`), npm, un compte Expo pour les builds EAS, Xcode 26.4 ou Android Studio pour les builds locaux.

```bash
cd lume
npm install            # copie aussi canvaskit.wasm dans public/ pour l'aperçu web
cp .env.example .env   # puis renseigner les valeurs disponibles
npm run check          # typecheck + lint + format + tests
```

### Dev build sur appareil (option A)

Le dev build est produit par EAS depuis votre machine. Une seule fois :

```bash
npm install -g eas-cli
eas login
eas init               # crée le projet EAS et affiche son identifiant
```

Avec une configuration dynamique (`app.config.ts`), `eas init` ne peut pas écrire l'identifiant lui-même : copiez-le dans `.env` sous `EAS_PROJECT_ID`, et le nom du propriétaire sous `EXPO_OWNER`. Puis :

```bash
# iPhone physique (enregistrez d'abord l'appareil : eas device:create)
eas build --profile development --platform ios

# Simulateur iOS
eas build --profile development-simulator --platform ios

# Android (APK installable)
eas build --profile development --platform android
```

Installez le build, puis lancez le serveur de développement :

```bash
npm run start:dev-client
```

Les profils EAS sont définis dans `eas.json`. Chaque profil fixe `APP_VARIANT`, qui pilote le nom affiché et l'identifiant de bundle (`com.lume.app.dev`, `com.lume.app.preview`, `com.lume.app`). L'identifiant de base est provisoire : il doit être confirmé avant la première soumission en store, car il ne pourra plus changer ensuite.

### Aperçu web

Le web n'est pas une cible produit. Il sert aux captures d'écran et aux revues rapides du design system.

```bash
npm run web            # serveur de développement
npx expo export --platform web && npx serve dist
```

## Scripts

| Script                     | Rôle                                                       |
| -------------------------- | ---------------------------------------------------------- |
| `npm run start`            | serveur Metro                                              |
| `npm run start:dev-client` | serveur Metro pour un development build                    |
| `npm run typecheck`        | `tsc --noEmit`                                             |
| `npm run lint`             | ESLint (config Expo, Prettier, règle i18n, React Compiler) |
| `npm run format`           | Prettier en écriture                                       |
| `npm run test`             | Jest                                                       |
| `npm run check`            | tout ce qui précède, en lecture seule, comme en CI         |
| `npm run doctor`           | `expo-doctor`                                              |
| `npm run assets:generate`  | régénère les assets de marque provisoires (Playwright)     |

## Arborescence

```
lume/
├── app.config.ts          # configuration Expo dynamique (variantes dev / preview / prod)
├── eas.json               # profils de build EAS
├── assets/images/         # icône, icône adaptative, splash (clair et sombre), favicon
├── scripts/               # outillage local (génération des assets)
└── src/
    ├── app/               # routes Expo Router
    │   ├── _layout.tsx    # providers, polices, splash, i18n
    │   ├── index.tsx      # accueil provisoire de la Phase 0
    │   └── dev/           # écrans de développement (design-system, feuille native)
    ├── components/
    │   ├── ui/            # composants de base (Text, Button, Chip, Toggle, Skeleton, …)
    │   ├── signature/     # composants signature (ScoreRing en Skia)
    │   ├── brand/         # wordmark
    │   └── dev/           # aides pour l'écran design-system
    ├── theme/             # tokens (couleurs, typographie, espacements, rayons, ombres, mouvement),
    │                      # ThemeProvider, createStyles, calcul de contraste et tests
    ├── i18n/              # i18next, locales fr/en, types, tests de parité
    ├── store/             # préférences Zustand persistées
    ├── lib/               # env validé par zod, haptique, logger, QueryClient, chargement Skia web
    └── hooks/
```

## Design system

Tout passe par `src/theme`. Les écrans n'écrivent jamais une couleur, une taille de police ou un espacement en dur : ils consomment `useTheme()` ou `createStyles()`.

- **Couleurs** : chaque rôle existe en variante `base` (fonds, anneaux, grands chiffres) et `text` (texte courant). Les paires texte / fond passent le seuil AA de 4,5:1 dans les deux modes ; `src/theme/__tests__/palette.test.ts` le garantit. Ajouter un nouvel usage de couleur en texte commence par ajouter la paire au test.
- **Typographie** : Fraunces Light pour le display, Regular pour les titres, Medium pour les chiffres de score (chiffres tabulaires) ; Instrument Sans pour le texte. Chaque titre éditorial porte un accent italique, posé par le composant `Headline` à partir d'astérisques dans la chaîne traduite. Les polices sont chargées au démarrage par `useFonts`, le splash reste affiché jusqu'au chargement. Chaque variante a un plafond de taille dynamique.
- **Visuel de marque** : `Aura`, trois disques de lumière chaude floutés sous un grain papier, dessinés en Skia et déclinés dans les deux modes. Aucun asset image.
- **Surfaces** : cartes sans bordure en clair, posées par une ombre chaude très diffuse ; hairline en sombre. Le bouton primaire est éclairé par un halo terre cuite.
- **Espacements** : base 4 pt, marges latérales 20 pt (24 pt sur grand écran). Rayons 4, 12, 24 et pilule.
- **Mouvement** : trois ressorts nommés (`gentle`, `snappy`, `bouncy`), apparitions décalées via `Stagger`, respect du réglage de réduction des animations.
- **Haptique** : quatre intentions (`selection`, `confirm`, `success`, `warning`) via `haptic()`, désactivables dans les préférences, sans effet sur le web.
- **Icônes** : Phosphor en graisse light, importées une par une, deux tailles (20 et 24).

L'écran `/dev/design-system` présente tous les tokens et composants avec les ratios de contraste calculés en direct. Il n'existe que dans les builds de développement, ou si `EXPO_PUBLIC_ENABLE_DEV_SCREENS=true`.

Les réglages (apparence, langue) et les détails s'ouvrent dans des feuilles natives `formSheet` ajustées à leur contenu (`src/app/settings/*`, composant `Sheet`). Sur le web, qui n'est pas une cible produit, elles s'affichent comme des pages.

## Internationalisation

- Aucun texte en dur : la règle ESLint `i18next/no-literal-string` refuse toute chaîne littérale dans le JSX de `src/`.
- Les clés vivent dans `src/i18n/locales/fr.json` et `en.json`. Un test vérifie que les deux fichiers ont exactement les mêmes clés, les mêmes variables et des formes plurielles appariées.
- La langue suit l'appareil (anglais par défaut si l'appareil n'est ni en français ni en anglais) et peut être forcée dans les préférences.

## Conventions

- Code, commentaires et messages de commit en anglais. Documentation produit en français.
- Commits atomiques au format `type(scope): description` (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`).
- TypeScript strict avec `noUncheckedIndexedAccess`. Pas de `any`.
- Les valeurs partagées Reanimated se modifient avec `.set()`, jamais par affectation de `.value`, pour rester compatibles avec le React Compiler.
- Aucun secret dans le bundle. Seules les variables `EXPO_PUBLIC_*` sont lues côté app, et elles sont publiques par construction.

## Données personnelles et IA

Engagements tenus par l'architecture, à vérifier à chaque phase :

- Photos de visage et informations de peau sont des données sensibles au sens du RGPD. Consentement explicite et séparé avant le premier scan, hébergement UE, stockage privé avec URLs signées courtes, option « ne pas conserver mes photos », suppression complète du compte depuis l'application.
- L'appel au modèle de vision se fait uniquement côté serveur (Edge Function Supabase, Phase 2). Aucune clé d'IA dans l'app.
- Le fournisseur de vision est sélectionné par la variable serveur `VISION_PROVIDER`. Le fournisseur retenu doit garantir contractuellement que les images ne servent pas à entraîner ses modèles ; cette garantie et sa référence documentaire seront ajoutées ici en Phase 2, au moment du choix définitif.
- Chaque scan enregistre la version du prompt et du modèle utilisés, pour expliquer toute variation de score.

## CI

Le workflow `.github/workflows/lume-ci.yml` exécute `npm ci` puis typecheck, lint, format et tests sur chaque push ou pull request touchant `lume/`.
