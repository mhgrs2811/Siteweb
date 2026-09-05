# SafeCheck

Application mobile de prévention contre les fraudes et arnaques.
**« Vérifiez avant de faire confiance. »**

React Native · Expo SDK 57 · Expo Router · TypeScript strict · Supabase.

## Démarrer

```bash
cp .env.example .env.local     # mode mock par défaut : aucun backend requis
npm install
npm run start                  # puis i (iOS), a (Android) ou w (web)
```

En mode mock, connectez-vous avec n'importe quel email et le code `123456`.
Essayez de vérifier `06 12 34 56 78`, `colis-suivi-express.com` ou une valeur inconnue.

## Avec Supabase

```bash
supabase start                 # instance locale (Docker)
supabase db reset              # applique migrations + seed
# renseigner EXPO_PUBLIC_SUPABASE_URL / ANON_KEY et EXPO_PUBLIC_DATA_SOURCE=supabase
npm run supabase:types         # régénère src/core/supabase/database.types.ts
```

## Qualité

```bash
npm run check                  # typecheck + lint + tests
```

## Builds natifs (EAS)

```bash
npm i -g eas-cli && eas login
eas init                       # crée le projet et renseigne EAS_PROJECT_ID
eas build --profile preview --platform all
```

Profils (`eas.json`) : `development` (dev client, mock), `preview` (APK / ad hoc, staging),
`production` (stores, incrément automatique de version).

En CI, le job « EAS Build » du workflow `safecheck-ci.yml` se lance après les
contrôles, sur `main` (profil preview) ou manuellement (Actions → Run workflow,
choix du profil et de la plateforme). Il requiert dans les réglages du dépôt :

| Type     | Nom                              | Rôle                                  |
| -------- | -------------------------------- | ------------------------------------- |
| Secret   | `EXPO_TOKEN`                     | Jeton d'accès Expo (expo.dev → Access tokens) |
| Variable | `EAS_PROJECT_ID`                 | Identifiant du projet EAS             |
| Variable | `EXPO_PUBLIC_SUPABASE_URL`       | URL du projet Supabase (preview/prod) |
| Variable | `EXPO_PUBLIC_SUPABASE_ANON_KEY`  | Clé anonyme Supabase (publique)       |

Sans `EXPO_TOKEN` et `EAS_PROJECT_ID`, le job affiche un avertissement et se termine sans échec.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Charte éditoriale](docs/EDITORIAL_GUIDELINES.md)
- [Sécurité & confidentialité](docs/SECURITY_PRIVACY.md)
- [Feuille de route](docs/ROADMAP.md)
