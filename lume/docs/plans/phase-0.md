# Lumé · Phase 0 — Fondations

Statut : **plan en attente de validation**. Aucun code applicatif n'a été écrit.
Rédigé le 2026-10-07 à partir de `lume/PRD.md`.

Ce document contient trois choses :

1. les questions bloquantes, regroupées (à répondre avant le code) ;
2. les hypothèses par défaut que je prends si tu ne dis rien ;
3. le plan détaillé de la Phase 0 : structure, fichiers, choix techniques, démonstration.

---

## 1. Questions bloquantes

Réponds directement sous chaque question, ou dans le chat avec le numéro.

### Q1 · Emplacement du projet et identifiants techniques

Le dépôt `Siteweb` n'est pas vide : il contient déjà `content-rocket-ai/` (Next.js), `PantryAI/` et des documents de stratégie. Je propose un dossier **`lume/` autonome à la racine**, avec son propre `package.json`, sur le modèle de `content-rocket-ai/`. L'alternative propre est un dépôt dédié `lume` (plus simple pour EAS, la CI et les secrets de store à terme).

- a. `lume/` dans ce dépôt, ou dépôt dédié ?
- b. Bundle identifier iOS / package Android. Proposition par défaut : `com.lume.app`, avec le suffixe `.dev` pour les builds de développement. As-tu un nom de domaine à utiliser en notation inversée (ex. `fr.masociete.lume`) ? Cet identifiant est quasi impossible à changer après la première soumission en store.
- c. Nom affiché « Lumé » et scheme de deep link `lume://` : OK pour la v1 technique ?

Réponse :

### Q2 · Comptes Expo / EAS et stores, et production du dev build

- a. As-tu un compte Expo ? Nom exact du propriétaire (compte personnel ou organisation) ?
- b. Apple Developer Program (individuel ou entreprise) et Google Play Console : créés ? En cours ?
- c. **Point important** : depuis cet environnement cloud, le réseau bloque `expo.dev` et `api.expo.dev`. Je ne peux donc ni exécuter `eas init`, ni lancer `eas build`. Deux options :
  - **Option A** : je prépare toute la configuration (`eas.json`, `app.config.ts`), et tu exécutes `eas init` puis `eas build --profile development` depuis ton Mac avec mes instructions pas à pas.
  - **Option B** : tu ajoutes `expo.dev`, `api.expo.dev` et `storage.googleapis.com` aux domaines autorisés de l'environnement (menu de l'environnement cloud dans la barre de titre, puis Edit, Network access) et un secret `EXPO_TOKEN` dans les secrets de l'environnement. Je lance alors les builds moi-même. Ne colle jamais le token dans le chat.
  - Laquelle préfères-tu ?

Réponse :

### Q3 · Fournisseur d'IA vision (non bloquant avant la Phase 2, mais à inscrire au README dès la Phase 0)

Besoins : modèle multimodal, sortie JSON structurée validée par schéma, engagement contractuel de non-entraînement sur les images, appel exclusivement côté serveur.

- Ma recommandation : **API Claude d'Anthropic**, modèle `claude-opus-5-5`, avec sorties structurées. Les données envoyées à l'API ne servent pas à l'entraînement par défaut ; la conservation standard est de 30 jours et une rétention zéro est possible sur demande. L'architecture reste neutre : un adaptateur par fournisseur, sélectionné par la variable `VISION_PROVIDER`.
- Alternatives : OpenAI, Google Gemini, Mistral (acteur européen, résidence des données en UE, argument RGPD).
- As-tu une préférence, ou un compte déjà ouvert chez l'un d'eux ?

Réponse :

### Q4 · Supabase, RevenueCat, PostHog (bloquant à partir de la Phase 1)

- a. Projet Supabase existant ? Sinon, quelle région UE : Francfort `eu-central-1`, Irlande `eu-west-1` ou Paris `eu-west-3` ? Plan payant prévu ? (Le plan gratuit met les projets en pause après une semaine d'inactivité et limite fortement le stockage, ce qui est gênant pour des photos.)
- b. Comptes RevenueCat et PostHog (instance UE) : existants ? Je documente la création dans le README et tu les crées avant les Phases 1 et 3.

Réponse :

### Q5 · Direction artistique : quatre arbitrages

- a. **Serif d'affichage** : je recommande **Fraunces** (chaleureuse, chiffres élégants, personnalité éditoriale, moins vue que Cormorant dans la beauté). Alternative : Cormorant Garamond, plus classique et plus fine. Les deux sont sous licence OFL et embarquées nativement dans le build.
- b. **Icônes** : je recommande **Phosphor en graisse « light »** (trait fin natif, famille très complète). Alternative : Lucide avec épaisseur de trait réduite.
- c. **Logo** : as-tu déjà un logo, un wordmark ou une icône d'app ? Sinon je conçois un wordmark typographique provisoire pour l'icône et l'écran de lancement de la Phase 0, à remplacer en Phase 7.
- d. **Barre d'onglets** : Expo propose des onglets natifs (look Apple, effet verre sur iOS 26) ou des onglets dessinés en JavaScript. Je recommande une **barre d'onglets custom au design de la marque**, identique sur iOS et Android, cohérente avec la direction « magazine + horlogerie ». Les onglets natifs sont plus « Apple » mais imposent leur esthétique.

Réponse :

### Q6 · Appareils de test et validation

- a. Sur quoi testes-tu ? iPhone (modèle et version iOS) ? Android ? As-tu un Mac avec Xcode installé ? Cela détermine le profil de build (simulateur iOS, appareil iOS enregistré par UDID, APK Android).
- b. Je peux produire des captures web de l'écran design-system depuis cette session pour une première validation rapide. La validation finale se fait sur ton appareil avec le dev build (Skia, flou, haptique). OK ?

Réponse :

---

## 2. Hypothèses par défaut (je les applique sauf avis contraire)

- **Gestionnaire de paquets** : npm, comme `content-rocket-ai/`. Node 22. Lockfile versionné.
- **Langue** : code, commentaires et commits en anglais ; textes d'interface uniquement via i18n en FR et EN ; nos échanges en français.
- **Plateformes** : iPhone et Android en portrait uniquement. Pas d'optimisation tablette (l'iPad lance l'app en mode compatibilité). Le web ne sert qu'à mes aperçus de développement, ce n'est pas une cible produit.
- **Architecture native** : New Architecture (seule option depuis le SDK 55), moteur Hermes, React Compiler activé dès le départ pour la mémoïsation automatique, après contrôle avec `react-compiler-healthcheck`.
- **Continuous Native Generation** : pas de dossiers `ios/` ni `android/` dans git ; EAS les génère à chaque build à partir de `app.config.ts`.
- **Thème** : tokens maison typés + `ThemeProvider`, sans kit UI tiers (ni NativeWind, ni Tamagui, ni Unistyles). Contrôle total du rendu, aucune couche native supplémentaire à déboguer, et les tokens sont des valeurs simples consommables par Skia et Reanimated.
- **Bottom sheets** : présentation native `formSheet` d'Expo Router (UISheetPresentationController sur iOS, BottomSheetDialog sur Android). `@gorhom/bottom-sheet` seulement si un design l'exige plus tard.
- **Stockage local** : `expo-sqlite/kv-store` pour les préférences (module Expo, aucune dépendance native supplémentaire) ; `expo-secure-store` pour les secrets de session en Phase 1.
- **CI** : workflow GitHub Actions limité au chemin `lume/**` qui exécute typecheck, lint et tests sur chaque push.
- **Analytics** : le SDK PostHog sera branché en **Phase 1** et non en Phase 7, pour que les événements du funnel d'onboarding existent dès le premier build testé.
- **Écran caché** : `/dev/design-system` n'est inclus qu'en mode développement (`__DEV__`), jamais dans un build de production.

---

## 3. Plan détaillé de la Phase 0

### 3.1 Objectif et état démontrable

À la fin de la Phase 0 :

- l'app se lance via un dev build EAS sur iOS et Android ;
- l'écran d'accueil provisoire affiche le wordmark et une phrase de marque, en clair et en sombre, en FR et en EN ;
- l'écran `/dev/design-system` présente tous les tokens et composants, avec les ratios de contraste calculés en direct ;
- `npm run check` (typecheck + lint + tests + parité des traductions) passe, localement et en CI.

### 3.2 Stack et versions (vérifiées sur npm le 2026-10-07)

| Brique | Version | Note |
|---|---|---|
| Expo SDK | 57 (`expo@57.0.27`) | dernière stable, publiée fin juin 2026 ; SDK 58 encore en bêta |
| React Native | 0.86.3 | New Architecture uniquement |
| React | 19.2.3 | |
| Expo Router | ~57.0.25 | typed routes activées |
| TypeScript | ~6.0.3 | version alignée sur le template Expo, mode strict |
| Reanimated / Worklets | 4.5.1 / 0.10.1 | versions imposées par le SDK |
| Gesture Handler | ~2.32.0 | |
| React Native Skia | 2.6.2 | version imposée par le SDK |
| expo-blur, expo-haptics, expo-image, expo-font, expo-splash-screen, expo-localization, expo-dev-client, expo-sqlite, expo-build-properties | 57.x | installés via `npx expo install` |
| i18next / react-i18next | 26.x / 17.x | |
| Zustand | 5.x | |
| TanStack Query | 5.x | client créé en Phase 0, utilisé à partir de la Phase 1 |
| zod | 4.x | validation des variables d'environnement, puis des schémas IA |
| phosphor-react-native + react-native-svg | 3.x / 15.15.4 | |
| @expo-google-fonts/fraunces, @expo-google-fonts/inter | 0.4.x | fichiers `.ttf` copiés dans `assets/fonts` et embarqués nativement |
| jest-expo, eslint-config-expo, prettier, eslint-plugin-i18next | 57.x / 57.x / 3.x / 6.x | |
| EAS CLI | 24.x | exécuté depuis ton poste (voir Q2) |

Pré-requis côté SDK 57 : iOS 16.4 minimum, Android 7 minimum (API 24), Xcode 26.4 pour les builds locaux. Je fixerai la politique de support à ces minimums.

### 3.3 Arborescence créée

```
lume/
├── PRD.md                      # déjà en place
├── README.md                   # installation, scripts, architecture, conventions, RGPD / IA
├── docs/plans/phase-0.md       # ce document
├── app.config.ts               # config Expo dynamique (variantes dev / preview / prod)
├── eas.json                    # profils development (simulateur + appareil), preview, production
├── package.json
├── tsconfig.json               # strict, noUncheckedIndexedAccess, alias @/*
├── eslint.config.js            # expo + prettier + i18next (interdit les chaînes en dur) + règles React Compiler
├── .prettierrc  .editorconfig  .gitignore  .env.example
├── jest.config.js
├── assets/
│   ├── fonts/                  # Fraunces 400/500/600 + italique, Inter 400/500/600, licences OFL
│   └── images/                 # icon, adaptive-icon, splash-icon, favicon (wordmark provisoire)
└── src/
    ├── app/
    │   ├── _layout.tsx         # providers : thème, i18n, Query, gestures, safe-area ; polices ; splash
    │   ├── index.tsx           # accueil provisoire de Phase 0 (wordmark, phrase, accès dev)
    │   ├── +not-found.tsx
    │   └── dev/
    │       └── design-system.tsx   # écran caché, __DEV__ uniquement
    ├── theme/
    │   ├── colors.ts           # palettes clair / sombre, rôles sémantiques
    │   ├── typography.ts       # échelle : display, h1, h2, h3, body, bodySmall, caption, overline
    │   ├── spacing.ts  radii.ts  shadows.ts  motion.ts  haptics.ts
    │   ├── contrast.ts         # calcul WCAG, utilisé par l'écran DS et par les tests
    │   ├── ThemeProvider.tsx  useTheme.ts  createStyles.ts
    │   └── index.ts
    ├── components/
    │   ├── ui/                 # Text, Button, IconButton, Surface, Divider, ProgressBar, Skeleton,
    │   │                       # Chip, Toggle, SegmentedControl, TextField, ListRow, Screen, Stagger, Icon
    │   └── signature/
    │       └── ScoreRing.tsx   # anneau Skia + compteur synchronisé
    ├── i18n/
    │   ├── index.ts            # init i18next, détection de langue, persistance du choix
    │   ├── types.d.ts          # clés typées à partir de fr.json
    │   └── locales/fr.json  en.json
    ├── store/
    │   └── preferences.ts      # Zustand persistant : thème (système/clair/sombre), langue, haptique
    ├── lib/
    │   ├── env.ts              # lecture et validation zod des variables EXPO_PUBLIC_*
    │   ├── query-client.ts
    │   └── logger.ts
    └── hooks/                  # useHaptics, useReducedMotion, useAppColorScheme

.github/workflows/lume-ci.yml   # à la racine du dépôt, filtré sur lume/**
```

Fichiers de test colocalisés : `src/theme/contrast.test.ts`, `src/theme/palette.test.ts` (toutes les paires texte/fond respectent AA dans les deux modes), `src/i18n/locales.test.ts` (mêmes clés en FR et EN, aucune valeur vide).

### 3.4 Design system : spécification des tokens

**Couleurs.** Chaque rôle a une variante `base` (fonds, anneaux, grands chiffres) et une variante `text` (texte courant), parce que la terre cuite `#B5684A` du PRD ne passe pas le seuil AA de 4,5:1 pour du texte normal : un libellé blanc dessus donne 4,16:1 et un libellé encre 4,17:1. Valeurs proposées, à valider sur l'écran design-system qui affichera les ratios en direct :

| Rôle | Clair | Sombre | Remarque |
|---|---|---|---|
| background | `#F7F3EE` | `#121110` | PRD |
| surface | `#FFFFFF` | `#1C1A18` | PRD |
| ink | `#1C1A17` | `#F2EDE6` | PRD |
| textSecondary | `#6E675F` | `#A89F94` | clair 5,04:1 sur fond, sombre 7,2:1 |
| line | `#E7E0D7` | `#2B2825` | séparateurs |
| accent.base | `#B5684A` | `#C97E60` | anneau, grands chiffres, décor |
| accent.strong | `#9E5538` | `#C97E60` | fond des boutons primaires : libellé blanc 5,5:1 en clair, libellé encre sombre 5,96:1 en sombre |
| accent.text | `#9E5538` | `#E0987A` | texte accentué, liens |
| accent.soft | teinte ivoire rosée | teinte brune | fonds de puces et de cartes mises en avant |
| champagne | `#CDB38B` | `#D9C39F` | décoratif uniquement, jamais en texte courant |
| success.base / text | `#7E9A7A` / `#4F6B4C` | `#93AD8E` / `#A9C2A4` | |
| warning.base / text | `#C98A3D` / `#8C5A1C` | `#D89C52` / `#E3AE6A` | |

Pas de rouge d'erreur agressif : les erreurs utilisent l'ambre et un ton rassurant, conformément au cadre « jamais alarmiste ».

**Typographie.** Fraunces pour display, h1, h2 et les chiffres de score, avec chiffres tabulaires pour que le compteur animé ne tremble pas. Inter pour h3, body, bodySmall, caption, overline. Overline en capitales avec interlettrage large. Les tailles respectent le réglage de police dynamique du système, avec un multiplicateur plafonné sur les éléments de mise en page critiques.

**Espacement et rayons.** Base 4 pt, échelle 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64, marges latérales 20 pt (24 pt sur grands écrans). Rayons 4 (puces, champs), 12 (cartes), 24 (feuilles, visuels), pill (boutons). Ombres : deux niveaux seulement, très diffuses et teintées d'encre chaude, pas de gris.

**Mouvement.** Trois ressorts nommés dans `motion.ts` : `gentle` (apparitions), `snappy` (pressions, toggles), `bouncy` (célébrations). Stagger de liste à 40 ms. Respect du réglage « réduire les animations » du système.

**Haptique.** Quatre intentions dans `haptics.ts` : `selection`, `confirm`, `success`, `warning`, désactivables dans les préférences, sans effet sur le web.

**Icônes.** Composant `Icon` qui impose la famille, la graisse « light » et deux tailles (20 et 24), pour que personne ne puisse mélanger les styles.

### 3.5 Composants livrés en Phase 0

Chaque composant est rendu en clair et en sombre, avec ses états pressé, désactivé et chargement quand ils existent, et porte un label d'accessibilité.

- `Text` : variantes typographiques, couleurs sémantiques.
- `Button` : primaire (terre cuite forte), secondaire (contour encre), fantôme, tailles M et L, état chargement sans spinner générique, haptique `confirm`.
- `IconButton`, `Chip` (sélection simple et multiple, base des réponses d'onboarding), `Toggle`, `SegmentedControl`.
- `Surface` : carte à rayon intentionnel, variante « mise en avant » sur fond accent.soft.
- `ProgressBar` : barre fine d'onboarding, animée au ressort.
- `Skeleton` : shimmer doux teinté ivoire, en formes texte, carte et anneau.
- `TextField` : champ avec libellé flottant, état erreur en ambre.
- `ListRow`, `Divider`, `Screen` (safe area, défilement, en-tête éditorial), `Stagger` (apparition décalée des enfants).
- `ScoreRing` (signature) : anneau Skia à bouts ronds sur piste discrète, remplissage animé piloté par une valeur partagée Reanimated, chiffre Fraunces dessiné dans la même scène Skia pour une synchronisation parfaite, haptique `success` en fin de course.

### 3.6 Écrans

- **`/`** : accueil provisoire. Wordmark, phrase de marque en FR ou EN selon l'appareil, sélecteur thème et langue, bouton vers le design-system en développement. Il sera remplacé par l'écran d'accueil éditorial de la Phase 1.
- **`/dev/design-system`** : sections Couleurs (nuanciers avec ratios de contraste et verdict AA), Typographie, Espacements et rayons, Icônes, Boutons et contrôles, Surfaces et listes, Skeletons, ScoreRing avec bouton « rejouer », Feuille native de démonstration, Mouvement (démo des trois ressorts), Haptique (boutons de test). Bascule thème et langue en haut de l'écran.

### 3.7 Internationalisation

- i18next initialisé avant le premier rendu, langue détectée via `expo-localization`, repli sur l'anglais si l'appareil n'est ni en français ni en anglais, choix manuel persisté.
- Fichiers `fr.json` et `en.json` à plat par domaine (`common`, `home`, `designSystem`), clés typées pour l'autocomplétion.
- Règle ESLint `i18next/no-literal-string` qui refuse toute chaîne en dur dans le JSX, pour tenir l'exigence « aucun texte en dur » dès le premier jour.
- Test de parité des clés FR/EN.

### 3.8 Configuration Expo et EAS

- `app.config.ts` : nom et identifiant variant selon `APP_VARIANT` (dev, preview, production) pour installer un build de développement à côté d'un build de store ; `scheme: lume` ; portrait ; `userInterfaceStyle: automatic` ; typed routes ; plugins expo-router, expo-font (polices embarquées), expo-splash-screen (fond ivoire, wordmark), expo-localization, expo-dev-client, expo-build-properties.
- `eas.json` : profils `development` (dev client, distribution interne), `development-simulator` (iOS simulateur), `preview` (distribution interne), `production`.
- `extra.eas.projectId` et `owner` : remplis par `eas init` depuis ton poste, ou par moi si l'Option B de Q2 est retenue. Aucune valeur inventée.
- `.env.example` documente : `APP_VARIANT`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_POSTHOG_KEY`, `EXPO_PUBLIC_POSTHOG_HOST`, `EXPO_PUBLIC_REVENUECAT_IOS_KEY`, `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`. Les secrets serveur (clé du fournisseur IA, secret du webhook RevenueCat) iront dans `supabase/functions/.env.example` en Phase 2 et ne transitent jamais par l'app.

### 3.9 Qualité et outillage

- TypeScript strict avec `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`.
- ESLint 9 en configuration plate : `eslint-config-expo`, `eslint-config-prettier`, `eslint-plugin-i18next`, règles React Compiler.
- Prettier, `.editorconfig`.
- Jest via `jest-expo` ; tests de contraste, de palette et de parité i18n.
- Scripts npm : `start`, `ios`, `android`, `typecheck`, `lint`, `format`, `test`, `check` (enchaîne tout), `doctor` (`expo-doctor`).
- CI GitHub Actions : `npm ci` puis `npm run check` sur chaque push et pull request touchant `lume/**`.
- README : installation, scripts, arborescence, conventions de code et de commit, règle i18n, engagements RGPD et IA à tenir (section à compléter en Phase 2 avec le fournisseur retenu).

### 3.10 Démonstration et vérification

Depuis cette session :

- `npm run check` vert ; `npx expo-doctor` sans erreur bloquante ;
- export web de l'écran design-system et captures Playwright en clair et en sombre, envoyées dans le chat pour un premier regard. Skia sur le web passe par CanvasKit ; si le chargement s'avère trop lourd pour l'aperçu, l'anneau affiche un substitut et la validation de l'anneau se fera sur appareil.

Sur ton appareil :

- dev build EAS installé ; lancement sans écran blanc ; splash cohérent avec le thème ;
- écran design-system parcouru en clair, en sombre, en FR, en EN, avec une taille de police système agrandie et VoiceOver ou TalkBack activé ;
- ScoreRing fluide (60 fps), haptiques perçues, feuille native ouverte et fermée.

### 3.11 Définition de « terminé » pour la Phase 0

- [ ] Projet `lume/` initialisé en SDK 57, TypeScript strict, Expo Router, CNG.
- [ ] Tokens complets en clair et en sombre, tests de contraste AA verts.
- [ ] Tous les composants de la section 3.5 rendus dans les deux modes, avec états et labels d'accessibilité.
- [ ] `ScoreRing` animé avec compteur synchronisé.
- [ ] i18n FR/EN opérationnel, lint des chaînes en dur actif, parité testée.
- [ ] `app.config.ts`, `eas.json`, `.env.example`, README livrés ; aucun identifiant ni clé inventés.
- [ ] CI verte.
- [ ] Dev build installé sur au moins un appareil et écran design-system validé par toi.

### 3.12 Hors périmètre de la Phase 0

Supabase (schéma, auth, RLS), caméra, analyse IA, paywall, onglets produit, notifications, analytics, textes légaux, icône définitive. Tout cela arrive dans les Phases 1 à 7 selon le PRD.

---

## 4. Ordre d'exécution une fois validé

1. Scaffold `lume/` depuis le template TypeScript vierge, ajout d'Expo Router et des dépendances via `npx expo install`, configuration TypeScript, ESLint, Prettier, Jest.
2. Tokens et `ThemeProvider`, tests de contraste.
3. i18n et préférences persistées.
4. Composants UI, puis `ScoreRing`.
5. Écrans `/` et `/dev/design-system`.
6. `app.config.ts`, `eas.json`, assets provisoires, README, CI.
7. Vérification complète, captures, puis dev build selon l'option retenue en Q2.

Commits atomiques par étape, messages en anglais au format `type(scope): description`.
