# Lumé · Phase 1 — Onboarding

Statut : **livrée** le 2026-10-08 (plan validé par « GO code Phase 1 », hypothèses par défaut appliquées). Le rapport de livraison est en section 5.
Rédigé le 2026-10-08 à partir de `PRD.md`, sections 5.1, 6 et 8, et de la signature visuelle validée en Phase 0.

---

## 1. Points à trancher

### Q1 · Supabase (bloquant pour la partie serveur, pas pour les écrans)

- a. Projet créé ? Région UE retenue : Paris `eu-west-3`, Francfort `eu-central-1` ou Irlande `eu-west-1` ?
- b. Mets `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY` dans `lume/.env` sur ton poste. Ce sont des clés publiques par construction, la sécurité vient des règles RLS, mais elles n'ont rien à faire dans le chat.
- c. Dans le dashboard, Authentication → Providers → **Anonymous sign-ins : activé**.
- d. Les migrations SQL seront versionnées dans `lume/supabase/migrations/`. Depuis cette session je ne peux pas joindre supabase.com, donc tu les appliques depuis ton poste avec `supabase link` puis `supabase db push`, ou en collant le fichier dans l'éditeur SQL du dashboard. Je fournis les deux chemins dans le README.

Sans réponse, je construis l'onboarding complet en local d'abord (c'est le design du PRD : stockage local, puis Supabase), la couche Supabase est écrite et testée à blanc, et le branchement réel se vérifie dès que les clés sont là.

### Q2 · PostHog

Projet PostHog sur l'instance UE créé ? Clé dans `EXPO_PUBLIC_POSTHOG_KEY`. Sans clé, l'analytics est un no-op silencieux et les événements du funnel partent dès que la clé existe.

### Q3 · Contenu des questions (je pars sur ces valeurs, dis-moi si tu veux autre chose)

- Tranches d'âge : moins de 16, 16 à 19, 20 à 24, 25 à 29, 30 à 34, 35 à 40, plus de 40. « Moins de 16 » mène à un écran de fin bienveillant, sans compte créé.
- Type de peau : sèche, grasse, mixte, normale, je ne sais pas.
- Objectifs : éclat, imperfections, texture, taches, rides, pores, rougeurs, hydratation. **Trois au maximum**, pour que la routine reste lisible.
- Sensibilités : parfum, alcool, huiles essentielles, acides exfoliants, rétinoïdes, aucune. « Aucune » est exclusif.
- Routine actuelle : aucune, basique, complète. Budget mensuel : moins de 20 €, 20 à 50 €, 50 à 100 €, plus de 100 €, je préfère ne pas dire.
- Mode de vie, quatre questions sur un même écran en deux temps : sommeil (moins de 6 h, 6 à 7 h, 7 à 8 h, plus de 8 h), eau (moins de 1 L, 1 à 2 L, plus de 2 L), exposition au soleil (rarement, parfois, souvent), maquillage quotidien (oui, non).

### Q4 · Fin de parcours en Phase 1

La caméra arrive en Phase 2. En Phase 1, le guide de prise de vue se termine sur un écran « Profil enregistré » qui récapitule les réponses et annonce le premier scan. Cet écran devient le pont vers la caméra en Phase 2. OK ?

---

## 2. Hypothèses par défaut

- Session anonyme Supabase créée au premier lancement, sans friction. La liaison Apple / Google reste pour après le premier résultat (PRD 5.9).
- Les réponses sont écrites en local à chaque écran (reprise possible après fermeture de l'app) puis synchronisées vers Supabase en arrière-plan, avec nouvel essai automatique.
- Les jetons de session sont chiffrés : clé AES dans le trousseau via `expo-secure-store`, session chiffrée dans AsyncStorage (pattern recommandé par Supabase pour Expo, les jetons dépassant la limite du trousseau).
- Les textes sont écrits par moi dans le ton « esthéticienne diplômée » en FR et EN ; tu les relis sur l'appareil.
- Le consentement photo est un écran dédié avec une case explicite, horodaté et versionné (`photo_consent_version`), modifiable depuis les réglages. Il n'est pas requis pour finir l'onboarding, il est requis pour lancer le premier scan (Phase 2).
- La demande de notifications passe par un écran de valeur avant la popup système ; le refus n'est jamais bloquant.
- L'analytics ne contient aucune donnée de peau : seulement les événements du funnel et l'index d'étape.

---

## 3. Plan détaillé

### 3.1 Objectif et état démontrable

- Le premier lancement ouvre l'écran d'accueil éditorial (Phase 0) dont « Commencer » démarre l'onboarding.
- Douze écrans enchaînés avec barre de progression fine, haptique à chaque choix, retour possible, reprise là où on s'était arrêté.
- Fin de parcours sur « Profil enregistré » ; les lancements suivants ouvrent directement cet écran, qui donne accès aux réglages et à la modification du profil.
- Avec un projet Supabase branché : la ligne `profiles` et la ligne `skin_profiles` de l'utilisatrice anonyme apparaissent dans la base, protégées par RLS.

### 3.2 Parcours et routes

Groupe `src/app/(onboarding)/` avec un layout commun (barre de progression animée, bouton retour, bouton « Passer » là où le PRD l'autorise). Une route par écran :

| Étape | Route | Contenu |
|---|---|---|
| 1 | `welcome` | accueil éditorial existant, bouton Commencer |
| 2 | `name` | prénom, champ unique, clavier ouvert |
| 3 | `age` | tranche d'âge ; moins de 16 → `too-young` |
| 4 | `skin-type` | cinq cartes, choix unique |
| 5 | `goals` | huit cartes, trois au maximum, compteur discret |
| 6 | `sensitivities` | multi-choix, « aucune » exclusif |
| 7 | `routine` | niveau de routine puis budget, deux groupes sur l'écran |
| 8 | `lifestyle` | sommeil, eau, soleil, maquillage |
| 9 | `proof` | courbe illustrative dessinée en Skia, formulation sans promesse chiffrée |
| 10 | `consent` | consentement photo dédié, case explicite, lien vers la politique de confidentialité |
| 11 | `notifications` | écran de valeur puis demande système |
| 12 | `capture-guide` | lumière naturelle, sans maquillage, visage centré, illustration abstraite |
| fin | `done` | récapitulatif du profil, annonce du premier scan |

`src/app/index.tsx` devient un aiguillage : onboarding non terminé → `welcome` (ou la dernière étape atteinte), terminé → `(app)/home`.

`src/app/(app)/home.tsx` : écran post-onboarding de Phase 1, récapitulatif du profil en chips, carte « prochain scan », préférences. Il deviendra l'onglet « Aujourd'hui » en Phase 4.

### 3.3 Composants nouveaux

- `OnboardingStep` : squelette d'écran avec overline d'étape, `Headline` à accent italique, texte d'aide, contenu, et bouton principal épinglé en bas.
- `ChoiceGrid` : grille de `Chip` en mode choix unique ou multiple, limite optionnelle, animation d'apparition décalée.
- `ConsentCard` : texte de consentement, case à cocher accessible, horodatage et version.
- `PermissionPrimer` : écran de valeur réutilisable (notifications maintenant, caméra en Phase 2).
- `ProofChart` : courbe Skia douce avec dégradé terre cuite, axes discrets, légende « illustration ».
- `CaptureGuide` : illustration abstraite du cadrage (ovale, repères de lumière) en Skia, trois conseils.
- `ProfileSummary` : chips du profil avec bouton « Modifier ».

### 3.4 Données et état

- `src/features/onboarding/` : store Zustand persisté `onboarding` (réponses, index de l'étape atteinte, statut), schéma zod des réponses, règles pures testées (limite d'objectifs, exclusivité de « aucune », porte d'âge).
- `src/features/profile/` : mapping réponses → lignes `profiles` et `skin_profiles`, hooks TanStack Query de lecture et d'upsert, file de synchronisation avec nouvel essai.
- `src/lib/supabase.ts` : client, stockage de session chiffré, `ensureSession()` qui crée la session anonyme au lancement.
- `src/lib/analytics.ts` : PostHog UE, no-op sans clé, événements typés : `onboarding_started`, `onboarding_step_completed` (index, étape), `photo_consent_given`, `notifications_opt_in`, `onboarding_completed`.

### 3.5 Base de données

`lume/supabase/migrations/` :

- `0001_profiles.sql` : table `profiles` (id = `auth.users.id`, `first_name`, `age_band`, `locale`, `photo_consent_at`, `photo_consent_version`, `keep_photos`, `notifications_opt_in`, `created_at`, `updated_at`), RLS « une utilisatrice ne lit et n'écrit que sa ligne », trigger `updated_at`.
- `0002_skin_profiles.sql` : table `skin_profiles` (`user_id`, `skin_type`, `goals`, `sensitivities`, `routine_level`, `monthly_budget`, `lifestyle` en jsonb, `updated_at`), mêmes règles.
- Types TypeScript de la base générés dans `src/lib/database.types.ts` (générés par le CLI quand le projet existe, écrits à la main d'ici là et vérifiés par les tests de mapping).

### 3.6 Bibliothèques ajoutées

| Paquet | Rôle |
|---|---|
| `@supabase/supabase-js` | client Supabase |
| `expo-secure-store`, `aes-js`, `react-native-get-random-values` | session chiffrée |
| `expo-notifications` | demande de permission (les rappels viennent en Phase 4) |
| `posthog-react-native` | analytics UE |
| `expo-application`, `expo-device` | contexte minimal pour PostHog, sans identifiant publicitaire |

### 3.7 Tests

- Règles d'onboarding : porte d'âge, limite de trois objectifs, exclusivité de « aucune », validation du prénom.
- Mapping réponses → lignes de base, dans les deux sens.
- Reprise : l'index d'étape persisté renvoie au bon écran.
- Parité des locales (existant) étendue aux nouveaux textes.

### 3.8 Vérification et démonstration

Depuis cette session : `npm run check` vert, export web, captures de chaque écran en clair et en sombre, FR et EN. Sur ton appareil : parcours complet au doigt, haptiques, reprise après fermeture, clavier sur l'écran prénom, popup de notifications, puis vérification des lignes dans le dashboard Supabase.

### 3.9 Définition de « terminé »

- [x] Douze écrans plus `too-young` et `done`, sans texte en dur, FR et EN.
- [x] Reprise de parcours et retour arrière sans perte de réponse.
- [x] Session anonyme créée, lignes `profiles` et `skin_profiles` écrites et protégées par RLS (code et migrations livrés ; exécution réelle à vérifier sur ton projet, voir 5.4).
- [x] Consentement photo horodaté et versionné, modifiable.
- [x] Événements du funnel émis (vérifiables dans PostHog dès que la clé existe).
- [x] Tests verts, CI verte, captures livrées.

### 3.10 Hors périmètre

Caméra et analyse (Phase 2), paywall (Phase 3), routine et notifications programmées (Phase 4), liaison Apple / Google (après le premier résultat).

---

## 4. Ordre d'exécution une fois validé

1. Dépendances, client Supabase, session chiffrée, `ensureSession()`.
2. Migrations SQL, types, mapping et tests.
3. Store d'onboarding, règles et tests.
4. Composants `OnboardingStep`, `ChoiceGrid`, `ConsentCard`, `PermissionPrimer`.
5. Les douze écrans, l'aiguillage racine, l'écran `done` et l'accueil post-onboarding.
6. `ProofChart` et `CaptureGuide` en Skia.
7. Analytics.
8. Vérification, captures, commits atomiques.

---

## 5. Rapport de livraison

### 5.1 Ce qui est livré

| Route | Écran | Détails |
|---|---|---|
| `/` | aiguillage | `completed` → accueil, `blocked_age` → `too-young`, sinon `welcome`. Attend l'hydratation du store avant le premier rendu. |
| `(onboarding)/welcome` | accueil éditorial | « Commencer », ou « Reprendre » à la dernière étape atteinte et « Recommencer » ; bouton de langue en haut à droite. |
| `(onboarding)/name` | prénom | clavier ouvert, normalisation des espaces, 40 caractères maximum. |
| `(onboarding)/age` | tranche d'âge | cartes compactes ; « Moins de 16 ans » mène à `too-young`. |
| `(onboarding)/too-young` | fin bienveillante | aucun compte créé, rien synchronisé ; « Corriger ma réponse » efface la tranche et revient à la question. |
| `(onboarding)/skin-type` | type de peau | cinq cartes en ligne avec icône et description. |
| `(onboarding)/goals` | objectifs | huit cartes, trois au maximum, compteur « Encore n choix possible ». |
| `(onboarding)/sensitivities` | sensibilités | multi-choix, « aucune » exclusif dans les deux sens. |
| `(onboarding)/routine` | routine et budget | niveau en cartes avec description, budget en pilules. |
| `(onboarding)/lifestyle` | mode de vie | sommeil, eau, soleil, maquillage, en pilules. |
| `(onboarding)/proof` | preuve | `ProofChart` en Skia (courbe qui se dessine, aire teintée, badge « Courbe illustrative »), trois piliers. |
| `(onboarding)/consent` | consentement photo | quatre faits, choix de conservation, case jamais pré-cochée, lien vers le résumé de confidentialité ; « Décider plus tard » autorisé. |
| `(onboarding)/notifications` | rappels | `PermissionPrimer` avec médaillon aura, puis demande système ; « Plus tard » enregistre un refus. |
| `(onboarding)/capture-guide` | guide de prise de vue | `CaptureGuide` en Skia (lumière, ovale, repères), trois conseils, « Enregistrer mon profil ». |
| `(onboarding)/done` | profil enregistré | récapitulatif complet, « Accéder à mon espace ». |
| `(app)/home` | accueil post-onboarding | salutation selon l'heure, carte « Votre premier scan », profil avec « Modifier », préférences (consentement photo, apparence, langue). |
| `settings/photos` | feuille | statut du consentement (date, version), conservation des photos, retrait ; ou nouveau consentement. |
| `legal/privacy` | feuille | résumé de confidentialité en huit points. |

Couche de données : `src/features/onboarding/` (modèle, règles pures, store persisté `lume.onboarding.v1`, navigation, options), `src/features/profile/` (mapping bidirectionnel réponses ↔ lignes, synchronisation idempotente avec nouvel essai toutes les 60 s et au retour au premier plan), `src/features/auth/session.ts` (session anonyme partagée), `src/lib/supabase.ts`, `src/lib/secure-storage.ts` (clé AES dans le trousseau, session chiffrée dans AsyncStorage), `src/lib/analytics.ts` (PostHog UE, no-op sans clé), `src/lib/notifications.ts`. Migrations `supabase/migrations/20261008000100_profiles.sql` et `20261008000200_skin_profiles.sql`, guide `supabase/README.md`.

### 5.2 Décisions prises pendant la réalisation

- **Session anonyme à la première synchronisation, pas au lancement.** Elle est créée après la porte d'âge, quand le prénom et la tranche existent. Ainsi une personne de moins de 16 ans n'a réellement aucun compte, comme l'écran le promet. La synchronisation ignore explicitement `under_16`.
- **Retour à l'accueil après édition du profil.** « Modifier » rejoue le parcours depuis le prénom ; l'écran `done` revient à l'accueil par `router.dismissTo`, qui dépile l'onboarding si l'accueil est déjà dans la pile et le remplace sinon. Pas de doublon d'écran.
- **Retrait implicite.** Décocher un consentement déjà donné puis « Décider plus tard » retire le consentement ; le retrait explicite vit dans Préférences → Consentement photo.
- **Prénom et aiguillage.** Le titre de `done` interpole le prénom dans un `Headline` à accent italique ; les astérisques éventuels du prénom sont retirés pour ne pas casser le balisage.
- **Cartes compactes.** `Chip` en taille `lg` gagne une disposition `row` (icône à gauche, texte, badge inline) pour les listes à une colonne, et un mode compact (60 pt) pour les réponses courtes comme les tranches d'âge.
- **Typage Supabase.** Les lignes de `database.types.ts` sont des alias de type, pas des interfaces : le schéma générique du client exige une signature d'index implicite.

### 5.3 Vérification

- `npm run check` vert : typecheck, ESLint (règle i18n incluse), Prettier, Jest (1 106 tests, dont règles d'onboarding, mapping, parité des locales).
- Export web avec React Compiler, aucune erreur console sur les 42 captures (`npm run preview:web`, clair et sombre, FR et EN, états injectés : vierge, en cours, terminé, bloqué par l'âge).
- Parcours complet piloté par Playwright sur l'export web : premier lancement, porte d'âge et correction, plafond de trois objectifs, exclusivité de « aucune », budget requis, consentement horodaté et versionné, refus des rappels, profil enregistré, relance qui ouvre l'accueil, édition complète depuis l'accueil, reprise à l'étape 8, recommencer.
- Non vérifiable depuis cette session : supabase.com et PostHog sont inaccessibles ici. La couche serveur est écrite pour tes clés et se dégrade proprement sans elles.

### 5.4 À faire de ton côté

1. Créer le projet Supabase (région UE), activer **Anonymous sign-ins**, appliquer les deux migrations (`npx supabase db push` ou SQL Editor), renseigner `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY` dans `lume/.env`.
2. Créer le projet PostHog UE et renseigner `EXPO_PUBLIC_POSTHOG_KEY`.
3. Sur l'appareil (dev build EAS) : parcours au doigt, haptiques, clavier sur l'écran prénom, popup de notifications, feuilles natives, puis vérifier les lignes `profiles` et `skin_profiles` dans le dashboard.
4. Relire les textes FR et EN dans `src/i18n/locales/` : ils sont écrits dans le ton « esthéticienne diplômée », à ajuster à ta voix.

### 5.5 Limites connues

- Sur le web (aperçu uniquement), les feuilles s'affichent en pages et la permission de notifications est « indisponible » : le parcours continue normalement.
- La suppression complète du compte depuis l'application arrive avec l'Edge Function de la Phase 7 ; le texte du résumé de confidentialité l'annonce déjà, comme le PRD l'exige.
