# Supabase · Lumé

Projet hébergé dans une région de l'Union européenne. Les migrations de ce dossier sont la
source de vérité du schéma ; le dashboard ne sert qu'à vérifier.

## Pré-requis dans le dashboard

1. Authentication → Providers → **Anonymous sign-ins** activé (session anonyme au premier lancement).
2. Project Settings → API : copier l'URL du projet et la clé `anon` / publishable dans `lume/.env`
   sous `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

## Appliquer les migrations

Depuis `lume/`, avec le CLI Supabase installé :

```bash
npx supabase login
npx supabase link --project-ref <ref-du-projet>
npx supabase db push
```

Sans CLI : ouvrir SQL Editor dans le dashboard et exécuter les fichiers de `migrations/` dans
l'ordre de leur nom.

## Régénérer les types TypeScript

```bash
npx supabase gen types typescript --linked > src/lib/database.types.ts
```

Le fichier versionné a été écrit à la main dans le même format en attendant le projet.

## Règles tenues par le schéma

- RLS activée sur chaque table : une utilisatrice ne lit et n'écrit que ses lignes.
- Aucune suppression côté client : la suppression complète passera par l'Edge Function
  `delete-account` (Phase 7) avec le rôle de service.
- Les valeurs d'énumération sont des identifiants stables, contrôlés par des contraintes `check`.
