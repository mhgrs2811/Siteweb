# SafeCheck — consignes pour les agents

Lire `docs/ARCHITECTURE.md` et `docs/EDITORIAL_GUIDELINES.md` avant toute modification.

Règles non négociables :
1. TypeScript strict, aucun `any` non justifié.
2. Aucune logique métier ne dépend directement de Supabase : passer par `src/core/data/repositories`.
3. Tous les textes visibles passent par i18n (`src/core/i18n/locales`). Jamais de chaîne en dur dans les écrans.
4. Vocabulaire éditorial : jamais d'accusation définitive (voir `docs/EDITORIAL_GUIDELINES.md`). Un test automatique (`src/core/i18n/__tests__/editorial.test.ts`) vérifie les termes interdits.
5. Accessibilité : zones tactiles ≥ 48pt, texte ≥ 16pt, `accessibilityLabel` sur tout élément interactif.
6. Expo SDK 57 : consulter https://docs.expo.dev/versions/v57.0.0/ avant d'utiliser une API.

Avant de committer : `npm run check` (typecheck + lint + tests).
