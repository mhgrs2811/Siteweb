# PantryAI — Product Requirements Document & Spécification Technique
**Version 1.0 | Juin 2025 | CONFIDENTIEL**

---

# TABLE DES MATIÈRES

1. Résumé Exécutif
2. Personas Utilisateurs
3. Spécifications des Fonctionnalités
4. Histoires Utilisateurs
5. Architecture Technique
6. Modèles de Données — Schéma PostgreSQL
7. Inventaire des Écrans
8. Flux Utilisateurs Détaillés
9. Exigences en Matière de Sécurité
10. Métriques de Performance

---

# 1. RÉSUMÉ EXÉCUTIF

## 1.1 Vision Produit

PantryAI est une application mobile de gestion intelligente du garde-manger qui utilise la vision par ordinateur et l'intelligence artificielle générative pour éliminer le gaspillage alimentaire domestique. L'application scanne automatiquement le contenu du réfrigérateur et des placards via la caméra du smartphone, maintient un inventaire en temps réel des ingrédients disponibles, génère des recettes personnalisées basées sur ces ingrédients, et envoie des alertes intelligentes avant les dates de péremption.

La proposition de valeur centrale : transformer un problème invisible ("qu'est-ce que j'ai dans mon frigo ?") en action immédiate ("voici 3 recettes à faire ce soir avec tes restes").

## 1.2 Problème Adressé

Le gaspillage alimentaire domestique représente un problème massif et largement sous-estimé :

- Les ménages européens gaspillent en moyenne **31% de leur alimentation achetée**, soit environ **600 EUR par foyer et par an**.
- En Belgique spécifiquement, 12 kg d'aliments encore comestibles sont jetés par personne et par an (données FASFC 2024).
- Les trois causes principales : l'oubli (ingrédients cachés au fond du réfrigérateur), le manque d'inspiration, et les péremptions manquées.
- 95% des solutions existantes (recettes en ligne, listes de courses) ne partent pas de l'inventaire réel du foyer.

## 1.3 Solution en 3 Étapes

1. **VOIR** — L'utilisateur photographie son réfrigérateur. L'IA identifie automatiquement les ingrédients, quantités estimées et dates de péremption visibles.
2. **SUGGÉRER** — L'IA génère instantanément 3 à 5 recettes réalisables immédiatement, classées par urgence (ingrédients proches de péremption en priorité).
3. **RAPPELER** — Notifications push intelligentes 48h avant chaque péremption, avec recette suggérée pour utiliser l'ingrédient concerné.

## 1.4 Métriques Clés de Succès

| Métrique | Objectif |
|---|---|
| MAU — Mois 3 | 1 000 utilisateurs actifs |
| MAU — Mois 6 | 5 000 utilisateurs actifs |
| Taux de conversion Free → Premium | >= 8% |
| MRR — Mois 6 | >= 7 000 EUR |
| Churn mensuel premium | <= 8% |
| NPS | >= 45 |
| Taux de rétention J30 | >= 40% |
| Coût par scan IA | <= 0,004 EUR |

## 1.5 Stack Technologique

| Couche | Technologies |
|---|---|
| Frontend Mobile | React Native + Expo SDK 51 |
| Frontend Web (Admin) | React + Vite + Tailwind CSS |
| Backend / BDD | Supabase (PostgreSQL 15, Auth, Storage, Realtime) |
| Fonctions Serverless | Supabase Edge Functions (Deno) |
| IA Vision | Claude claude-sonnet-4-6 (Anthropic) |
| IA Recettes | Claude claude-sonnet-4-6 — génération de recettes |
| Paiements | Stripe + RevenueCat |
| Notifications Push | Expo Push Notifications + Supabase pg_cron |
| Monitoring | Sentry + PostHog |

---

# 2. PERSONAS UTILISATEURS

## 2.1 Persona 1 — Sarah, La Mère Active

**Profil :** Sarah Dupont, 34 ans — Responsable Marketing, 2 enfants (4 et 7 ans), Bruxelles
- Revenus foyer : 75 000 EUR/an
- Appareils : iPhone 14 Pro
- Niveau tech : Intermédiaire (Spotify, Google Maps, Deliveroo)

**Motivations :**
- Réduire le "mental load" alimentaire du soir
- Éviter de jeter de la nourriture (principe écologique ET économique)
- Cuisiner des repas équilibrés en moins de 30 minutes

**Frustrations actuelles :**
- Ouvre le frigo à 18h30 et ne sait pas quoi préparer avec ce qu'elle voit
- Découvre régulièrement des yaourts périmés ou des légumes oubliés
- Les apps de recettes proposent des plats nécessitant des ingrédients qu'elle n'a pas
- Sa liste de courses Bring! est déconnectée de son stock réel

**Scénario d'usage PantryAI :**
Sarah rentre du travail à 18h15. Elle ouvre PantryAI et scanne rapidement le réfrigérateur. En 10 secondes, l'app identifie : poulet cuit (reste d'hier), haricots verts, tomates cerises, feta, et note que la crème fraîche périme demain. PantryAI suggère en premier une salade repas poulet-feta-tomates (15 min, aucun ingrédient manquant). Sarah dîne à 19h. Économie estimée : 4,50 EUR.

**Critères d'adoption :**
- Scan fonctionnel en moins de 5 secondes
- Recettes réalisables avec exactement ce qui est disponible
- Prête à payer 4,99–6,99 EUR/mois si économies prouvées

---

## 2.2 Persona 2 — Lucas, L'Étudiant Éco-Conscient

**Profil :** Lucas Martin, 22 ans — Étudiant en droit, colocation à 3, Liège
- Revenus : 800 EUR/mois (bourse + job étudiant)
- Appareils : Samsung Galaxy S23
- Niveau tech : Expert — early adopter, TikTok 3h/jour

**Motivations :**
- Zéro gaspillage : conviction militante
- Maximiser son budget alimentaire limité (150–180 EUR/mois)
- Partager ses "succès anti-gaspillage" sur les réseaux sociaux

**Frustrations actuelles :**
- Achète des ingrédients pour une recette, utilise 30% du paquet et jette le reste
- Ses colocataires ne font aucun effort sur le gaspillage
- A essayé de tenir un inventaire manuel sur Notes mais abandonne après 3 jours

**Scénario d'usage PantryAI :**
Lucas a un exam demain mais il reste des pâtes, du fromage râpé, un œuf et des lardons dans le frigo commun. Il scanne tout en 30 secondes. PantryAI génère une carbonara "version étudiante" (10 min, ingrédients exacts disponibles). Lucas prend une photo du résultat avec le badge "Zéro gaspillage du jour" généré par l'app et le partage sur son Instagram. 3 amis téléchargent l'app dans la semaine.

**Critères d'adoption :**
- Gratuité initiale indispensable (conversion premium si <= 2,99 EUR/mois)
- Fonctionnalité de partage social intégrée (badge, story template)
- Mode colocation : inventaire partagé entre plusieurs utilisateurs
- Recettes en moins de 20 minutes avec 5 ingrédients max

---

## 2.3 Persona 3 — Marie-Claire, La Retraitée Organisée

**Profil :** Marie-Claire Lecomte, 68 ans — Retraitée (ex-institutrice), vit seule, Namur
- Revenus : 1 800 EUR/mois (pension + rente)
- Appareils : iPhone SE (acheté par ses enfants)
- Niveau tech : Débutante — WhatsApp et Facebook uniquement

**Motivations :**
- Éviter le gaspillage (cuisinait pour une famille nombreuse, du mal à ajuster les portions)
- Ne plus acheter en double par oubli
- Trouver des idées pour cuisiner de petites portions pour une personne seule

**Frustrations actuelles :**
- Achète souvent des yaourts et légumes qu'elle a déjà, par oubli
- Les recettes en ligne donnent des quantités pour 4–6 personnes
- Jette entre 80–120 EUR de nourriture par mois, ce qui la culpabilise

**Scénario d'usage PantryAI :**
Marie-Claire reçoit une notification : "Votre lait périme dans 2 jours — voici une idée pour l'utiliser." Elle suit le lien qui lui propose une crème caramel (6 ingrédients disponibles, recette simplifiée pour 2 portions). Elle prépare le dessert et appelle sa fille pour lui parler de "cette application formidable."

**Critères d'adoption :**
- Interface épurée, gros boutons, texte lisible (16px minimum)
- Recettes avec adaptation automatique des portions (1–2 personnes)
- Alertes péremption simples et claires sans jargon technique
- Rassurance sur l'utilisation des photos du réfrigérateur (RGPD)

---

# 3. SPÉCIFICATIONS DES FONCTIONNALITÉS

## 3.1 Fonctionnalités MVP (Mois 1–2)

### 3.1.1 Module Scan & Reconnaissance IA — PRIORITÉ P0

| Référence | Fonctionnalité | Description | Critère d'Acceptation |
|---|---|---|---|
| SCAN-01 | Capture photo | Photographier frigo ouvert, placard, ou ingrédients à plat | Photo < 1 sec, résolution >= 1080p |
| SCAN-02 | Détection IA ingrédients | Claude Vision analyse la photo, retourne liste structurée | Précision >= 85%, réponse < 4 sec |
| SCAN-03 | Estimation quantités | Quantité approximative par ingrédient (entier, demi, trace) | Correct à ± 1 unité pour 75% des cas |
| SCAN-04 | Détection dates péremption | Lecture OCR des dates visibles sur emballages | Détection correcte si étiquette nette > 20px |
| SCAN-05 | Correction manuelle | Modifier/ajouter/supprimer des ingrédients après scan | Modification en < 3 taps, sauvegarde instantanée |
| SCAN-06 | Historique scans | 10 derniers scans avec photos et résultats | Photos stockées 30 jours, triées chronologiquement |

### 3.1.2 Module Inventaire

| Référence | Fonctionnalité | Description | Critère d'Acceptation |
|---|---|---|---|
| INV-01 | Inventaire centralisé | Consolidation de tous les ingrédients détectés | Dédoublonnage automatique, mise à jour temps réel |
| INV-02 | Catégorisation | Frais, Surgelés, Épicerie, Boissons, Condiments | Catégorisation automatique >= 90% de précision |
| INV-03 | Statut péremption | Frais (>5j), Bientôt (2–5j), Urgent (<2j), Périmé | Calcul automatique, mise à jour à minuit |
| INV-04 | Ajout manuel | Ajout via recherche ou scan code-barres | Base > 5 000 produits, EAN-13 supporté |
| INV-05 | Suppression/Consommation | Marquer un ingrédient comme utilisé | Action en 1 tap, undo possible 5 secondes |
| INV-06 | Vue par zone | Filtrage : Réfrigérateur, Congélateur, Placards | Zones configurables par l'utilisateur |

### 3.1.3 Module Génération de Recettes

| Référence | Fonctionnalité | Description | Critère d'Acceptation |
|---|---|---|---|
| REC-01 | Génération instantanée | 3–5 recettes basées sur l'inventaire actuel | Génération < 6 sec, utilise >= 60% des ingrédients |
| REC-02 | Priorité péremption | Prioriser les recettes utilisant les ingrédients urgents | Toggle activable, recettes favorisent items Urgent |
| REC-03 | Filtres diététiques | Végétarien, vegan, sans gluten, sans lactose, Halal | Filtres persistants, combinables |
| REC-04 | Ajustement portions | Slider 1–8 portions, adaptation automatique des quantités | Quantités arrondies intelligemment |
| REC-05 | Étapes illustrées | Timer intégré, indication visuelle de progression | Timers audio + visuel, écran allumé permanent |
| REC-06 | Sauvegarde favoris | Sauvegarder des recettes générées | Sauvegarde en 1 tap, accès hors ligne, partage par lien |

### 3.1.4 Module Alertes & Notifications

| Référence | Fonctionnalité | Description | Critère d'Acceptation |
|---|---|---|---|
| ALRT-01 | Alertes péremption | Notification push 2 jours avant péremption | Envoi 9h–10h, personnalisable J-1/J-2/J-3 |
| ALRT-02 | Recette dans la notif | Suggestion de recette dans la notification | Deep link vers recette, rich notification |
| ALRT-03 | Résumé hebdomadaire | Dimanche soir : ingrédients à utiliser cette semaine | Envoi dimanche 18h, désactivable |
| ALRT-04 | Contrôle granulaire | Paramétrage fin des notifications reçues | Paramètres par catégorie, mode silencieux |

### 3.1.5 Module Authentification & Profil

| Référence | Fonctionnalité | Description | Critère d'Acceptation |
|---|---|---|---|
| AUTH-01 | Inscription email | Email + mot de passe + vérification email | Email de vérification < 30 sec, lien valide 24h |
| AUTH-02 | OAuth Google | Connexion rapide via compte Google | Flux OAuth2 standard, token refresh auto |
| AUTH-03 | OAuth Apple | Connexion via Apple ID (obligatoire App Store) | Respecte guidelines Apple Sign-in |
| AUTH-04 | Profil utilisateur | Nom, avatar, préférences, taille du foyer, objectif | Mise à jour sans rechargement |
| AUTH-05 | Préférences diététiques | Configuration régimes et allergies (onboarding) | Applicable globalement aux suggestions |

---

## 3.2 Fonctionnalités V2 (Mois 3–4)

### 3.2.1 Liste de Courses Intelligente
- **COURSES-01** : Génération auto basée sur recettes sélectionnées moins stock disponible
- **COURSES-02** : Partage de liste entre membres du foyer (mode famille)
- **COURSES-03** : Intégration Colruyt Click & Collect — ajout direct au panier en ligne
- **COURSES-04** : Historique d'achats pour détecter les patterns de consommation

### 3.2.2 Mode Foyer & Colocation
- **FOYER-01** : Invitation de membres du foyer (jusqu'à 5 utilisateurs sur inventaire partagé)
- **FOYER-02** : Attribution d'un ingrédient à une personne ("le yaourt de Lucas")
- **FOYER-03** : Log d'activité : qui a ajouté/consommé quoi et quand
- **FOYER-04** : Notifications de groupe : "X ingrédients vont bientôt périmés"

### 3.2.3 Planificateur de Repas
- **PLAN-01** : Calendrier hebdomadaire de repas avec drag & drop
- **PLAN-02** : Génération automatique d'un plan 5 jours basé sur l'inventaire
- **PLAN-03** : Export du plan vers l'application Calendrier native (iOS/Android)
- **PLAN-04** : Analyse nutritionnelle du plan de la semaine

### 3.2.4 Tableau de Bord Économies
- **ECON-01** : Compteur d'économies cumulées (ingrédients utilisés × prix estimé)
- **ECON-02** : CO2 évité estimé (basé sur tables ADEME)
- **ECON-03** : Graphique d'évolution mensuelle du gaspillage
- **ECON-04** : Badge partageable "J'ai économisé X EUR ce mois" pour réseaux sociaux

---

## 3.3 Feuille de Route Future (Mois 5–12)

| Fonctionnalité | Horizon |
|---|---|
| Scan code-barres avec base OpenFoodFacts | M5 |
| Mode offline partiel (recettes sauvegardées) | M5 |
| Intégration Delhaize et Lidl Click & Collect | M6 |
| Affiliation supermarché : cashback sur courses | M6–M7 |
| API publique pour intégrations tierces | M7–M8 |
| Widget iOS / Android sur écran d'accueil | M7 |
| PantryAI for Business : restauration / traiteurs | M9–M12 |
| Partenariats mutuelles / assurances | M10–M12 |

---

# 4. HISTOIRES UTILISATEURS

## 4.1 Scan & Reconnaissance

| ID | Histoire Utilisateur |
|---|---|
| US-001 | En tant qu'utilisateur, je veux photographier mon réfrigérateur pour que l'application identifie automatiquement tous les ingrédients sans saisie manuelle. |
| US-002 | En tant que Sarah, je veux que le scan prenne moins de 5 secondes pour pouvoir l'utiliser même quand je suis pressée. |
| US-003 | En tant qu'utilisateur, je veux corriger les erreurs de reconnaissance pour que mon inventaire soit toujours précis. |
| US-004 | En tant que Marie-Claire, je veux un guide visuel pas à pas pour prendre la photo pour que le scan fonctionne du premier coup. |
| US-005 | En tant qu'utilisateur, je veux que les dates de péremption visibles soient automatiquement lues pour ne pas avoir à les retaper. |
| US-006 | En tant que Lucas, je veux scanner des ingrédients posés à plat sur une table pour que l'app fonctionne avec mon mode de stockage en colocation. |

## 4.2 Gestion d'Inventaire

| ID | Histoire Utilisateur |
|---|---|
| US-007 | En tant qu'utilisateur, je veux voir d'un coup d'œil quels ingrédients sont proches de péremption (code couleur) pour savoir ce que je dois cuisiner en priorité. |
| US-008 | En tant que Sarah, je veux organiser mon inventaire par zone pour trouver rapidement ce dont j'ai besoin. |
| US-009 | En tant qu'utilisateur, je veux marquer un ingrédient comme "consommé" en un tap pour que mon inventaire reste à jour. |
| US-010 | En tant que Lucas, je veux un inventaire partagé avec mes colocataires pour que tout le monde voit ce qui est disponible. |
| US-011 | En tant qu'utilisateur, je veux ajouter manuellement un ingrédient par recherche vocale ou texte pour mettre à jour l'inventaire sans scanner. |
| US-012 | En tant que Marie-Claire, je veux recevoir une notification quand un aliment n'a pas été utilisé depuis 5 jours pour me souvenir de l'utiliser. |

## 4.3 Génération de Recettes

| ID | Histoire Utilisateur |
|---|---|
| US-013 | En tant que Sarah, je veux des suggestions de recettes en moins de 30 minutes pour pouvoir cuisiner un repas complet après le travail. |
| US-014 | En tant qu'utilisateur, je veux que les recettes suggérées utilisent prioritairement les ingrédients qui vont bientôt périmés pour ne pas gaspiller. |
| US-015 | En tant que Marie-Claire, je veux que les recettes s'adaptent automatiquement à 1–2 portions pour ne pas cuisiner en trop grande quantité. |
| US-016 | En tant que Lucas, je veux filtrer les recettes par régime végétarien pour que les suggestions correspondent à mes valeurs. |
| US-017 | En tant qu'utilisateur, je veux suivre les étapes d'une recette avec timer automatique pour ne pas perdre le compte pendant que je cuisine. |
| US-018 | En tant que Lucas, je veux partager une recette et son résultat sur Instagram directement depuis l'app pour documenter mon parcours zéro gaspillage. |
| US-019 | En tant qu'utilisateur, je veux sauvegarder une recette dans mes favoris pour la refaire sans devoir re-générer. |
| US-020 | En tant que Sarah, je veux voir les ingrédients manquants et les ajouter à ma liste de courses pour que mes prochains achats soient déjà planifiés. |

## 4.4 Notifications & Alertes

| ID | Histoire Utilisateur |
|---|---|
| US-021 | En tant qu'utilisateur, je veux recevoir une notification 48h avant péremption pour avoir le temps de planifier comment utiliser l'ingrédient. |
| US-022 | En tant que Marie-Claire, je veux que la notification me montre directement une recette simple pour l'ingrédient qui va périmé. |
| US-023 | En tant que Lucas, je veux désactiver les notifications entre 23h et 8h pour que l'app ne me réveille pas la nuit. |
| US-024 | En tant que Sarah, je veux un résumé dominical des repas à planifier pour préparer mes courses du samedi efficacement. |

## 4.5 Compte & Abonnement

| ID | Histoire Utilisateur |
|---|---|
| US-025 | En tant que nouvel utilisateur, je veux m'inscrire avec mon compte Google en un tap pour que l'inscription ne soit pas une barrière. |
| US-026 | En tant qu'utilisateur free, je veux comprendre clairement les limitations du tier gratuit (3 scans/mois) et les avantages premium. |
| US-027 | En tant qu'utilisateur premium, je veux annuler mon abonnement directement depuis l'app sans contacter le support. |
| US-028 | En tant que Sarah, je veux voir les économies réalisées ce mois pour avoir une preuve concrète de la valeur de l'abonnement. |

---

# 5. ARCHITECTURE TECHNIQUE

## 5.1 Principe Architectural : Serverless-First

Toute la logique métier s'exécute dans les Supabase Edge Functions (Deno). Cela maximise la scalabilité, minimise les coûts à faible charge, et évite la complexité d'un serveur backend dédié. Exception : les crons de notification tournent via pg_cron directement dans PostgreSQL.

## 5.2 Frontend — React + Vite + Tailwind (Dashboard Admin)

### Structure du projet

```
src/
├── components/        # Composants React réutilisables (shadcn/ui)
├── pages/             # Pages routées via React Router v6
├── hooks/             # Custom hooks (useInventory, useRecipes, useAuth)
├── lib/
│   ├── supabase.ts    # Client Supabase singleton
│   └── claude.ts      # Wrapper appels API Anthropic
├── stores/            # State management Zustand
└── types/             # Types TypeScript partagés
```

### Dépendances principales

| Package | Usage |
|---|---|
| @supabase/supabase-js ^2.39 | Client BDD, Auth, Storage, Realtime |
| @tanstack/react-query ^5 | Fetching, caching, synchronisation serveur |
| zustand ^4 | State management léger côté client |
| react-router-dom ^6 | Routing SPA |
| tailwindcss ^3.4 | Styling utility-first |
| shadcn/ui | Composants UI accessibles |
| recharts ^2.10 | Graphiques (dashboard métriques) |
| react-hook-form + zod | Formulaires + validation schéma |
| date-fns ^3 | Manipulation dates (péremptions) |
| @sentry/react | Error tracking |

## 5.3 Backend — Supabase

### Configuration des services

| Service | Configuration et Usage |
|---|---|
| PostgreSQL 15 | Base principale. Extensions : pg_cron, pg_vector, uuid-ossp, pg_trgm |
| Supabase Auth | JWT tokens, refresh auto, OAuth Google + Apple, email OTP |
| Supabase Storage | Buckets : scan-images (privé, max 10MB), avatars (public) |
| Edge Functions (Deno) | Logique métier : scan IA, génération recettes, webhooks Stripe |
| Realtime | Canaux : inventaire-{user_id}, household-{id} |
| pg_cron | Jobs : calcul péremptions (00:01 UTC), notifications (07:00 UTC), nettoyage (03:00 UTC dim.) |

### Edge Functions — Liste exhaustive

| Fonction | Description |
|---|---|
| scan-image | POST — Reçoit image base64, appelle Claude Vision, retourne ingrédients JSON |
| generate-recipes | POST — Reçoit inventaire + préférences, retourne 3–5 recettes JSON |
| process-expiry-alerts | Cron pg_cron — Calcule nightly les ingrédients arrivant à péremption dans 48h |
| send-push-notifications | Cron pg_cron — Lit notification_queue, envoie via Expo Push API |
| stripe-webhook | POST — Reçoit events Stripe, met à jour user_subscriptions |
| revenuecat-webhook | POST — Sync achats in-app iOS/Android |
| delete-user-data | POST — RGPD : suppression complète des données dans 30 jours |
| weekly-summary | Cron (dimanche 17h00 UTC) — Génère et envoie le résumé hebdomadaire |

## 5.4 Flux d'Authentification

### Inscription Email/Mot de Passe

1. L'utilisateur saisit email + mot de passe dans l'app mobile.
2. `supabase.auth.signUp()` — Supabase crée l'entrée dans `auth.users` avec statut `email_unconfirmed`.
3. Email de confirmation envoyé automatiquement (template personnalisé PantryAI).
4. Clic sur le lien → redirect via deep link `pantryai://auth/confirm?token=XXX`.
5. Supabase valide le token, met à jour `email_confirmed_at`, retourne session JWT.
6. Trigger PostgreSQL crée automatiquement la row dans `public.profiles`.
7. Redirection vers l'onboarding (préférences alimentaires, taille du foyer).

### Connexion OAuth (Google / Apple)

1. Tap "Continuer avec Google" ou "Continuer avec Apple".
2. `supabase.auth.signInWithOAuth({ provider: 'google' | 'apple' })`.
3. Redirection vers page OAuth du provider dans WebBrowser Expo.
4. Callback vers Supabase qui valide le token provider.
5. Supabase crée/récupère la session JWT, upsert dans `auth.users`.
6. Première connexion → trigger crée profil + redirection onboarding. Retour → dashboard.

### Refresh Token
- Access tokens JWT : durée de vie **3 600 secondes** (1 heure)
- Refresh tokens : durée **30 jours**
- Le client Supabase gère le refresh automatiquement via intercepteurs HTTP
- Si refresh token expiré → redirection écran de connexion

## 5.5 Points de Terminaison API

### POST /functions/v1/scan-image

| Paramètre | Valeur |
|---|---|
| Authentification | Bearer JWT (Supabase Auth) — requis |
| Content-Type | application/json |
| Rate Limit | 10 req/min (free), 100 req/min (premium) |
| Timeout | 30 secondes |

**Corps de la requête :**
```json
{
  "image_base64": "string (max 5MB après compression)",
  "image_mime_type": "image/jpeg | image/png",
  "scan_zone": "fridge | pantry | freezer | flat_lay"
}
```

**Corps de la réponse :**
```json
{
  "scan_id": "uuid",
  "ingredients": [
    {
      "name": "string",
      "quantity": "string",
      "unit": "string",
      "confidence": 85,
      "expiry_date": "2025-06-20 | null",
      "category": "fresh | frozen | pantry | beverage | condiment"
    }
  ],
  "processing_time_ms": 2300,
  "tokens_used": 1450
}
```

### POST /functions/v1/generate-recipes

**Corps de la requête :**
```json
{
  "inventory_ids": ["uuid", "uuid"],
  "preferences": {
    "dietary_filters": ["vegetarian"],
    "max_prep_time": 30,
    "servings": 2,
    "prioritize_expiring": true
  },
  "count": 3
}
```

**Corps de la réponse :**
```json
{
  "recipes": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "prep_time_minutes": 15,
      "cook_time_minutes": 10,
      "difficulty": "easy | medium | hard",
      "dietary_tags": ["vegetarian"],
      "calories_per_serving": 420,
      "ingredients": [
        { "inventory_id": "uuid", "name": "string", "quantity": "string", "unit": "string" }
      ],
      "steps": [
        { "step_number": 1, "instruction": "string", "timer_seconds": 300 }
      ]
    }
  ]
}
```

### DELETE /functions/v1/delete-user-data

Conformité RGPD. Supprime toutes les données de l'utilisateur authentifié dans un délai de 30 jours. Retourne un identifiant de demande de suppression. Auth Bearer JWT requis.

---

# 6. MODÈLES DE DONNÉES — SCHÉMA POSTGRESQL

## 6.1 Vue d'Ensemble des Tables

| Table | Domaine | Description |
|---|---|---|
| profiles | Utilisateurs | Extension de auth.users avec données métier |
| households | Utilisateurs | Foyers / colocations partageant un inventaire |
| household_members | Utilisateurs | Table de jonction user ↔ household |
| inventory_items | Inventaire | Ingrédients dans l'inventaire d'un foyer |
| scan_sessions | Inventaire | Historique des sessions de scan IA |
| scan_results | Inventaire | Ingrédients détectés lors d'un scan |
| recipes | Recettes | Recettes générées par l'IA (cache) |
| recipe_ingredients | Recettes | Ingrédients requis par une recette |
| recipe_steps | Recettes | Étapes d'une recette |
| saved_recipes | Recettes | Favoris utilisateur |
| user_subscriptions | Système | Abonnements Stripe/RevenueCat |
| notification_queue | Système | File d'attente notifications push |

---

## 6.2 Table : profiles

Extension de `auth.users`. Créée automatiquement par trigger PostgreSQL à l'inscription.

```sql
CREATE TABLE public.profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name          TEXT NOT NULL CHECK (LENGTH(display_name) <= 100),
  avatar_url            TEXT,
  household_id          UUID REFERENCES households(id),
  dietary_preferences   JSONB DEFAULT '[]',
  default_servings      SMALLINT DEFAULT 2 CHECK (default_servings BETWEEN 1 AND 10),
  notification_prefs    JSONB DEFAULT '{"expiry_days_before": 2, "weekly_summary": true}',
  timezone              TEXT DEFAULT 'Europe/Brussels',
  onboarding_completed  BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger : auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 6.3 Table : households

```sql
CREATE TABLE public.households (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL CHECK (LENGTH(name) <= 100),
  owner_id     UUID NOT NULL REFERENCES auth.users(id),
  invite_code  TEXT UNIQUE NOT NULL,
  max_members  SMALLINT DEFAULT 5 CHECK (max_members BETWEEN 1 AND 10),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Générer un code d'invitation unique à la création
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;
```

---

## 6.4 Table : household_members

```sql
CREATE TABLE public.household_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (household_id, user_id)
);
```

---

## 6.5 Table : inventory_items (table centrale)

```sql
CREATE TABLE public.inventory_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id     UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name             TEXT NOT NULL CHECK (LENGTH(name) <= 200),
  quantity         NUMERIC(10,2) DEFAULT 1,
  unit             TEXT DEFAULT 'unité',
  category         TEXT NOT NULL CHECK (category IN ('fresh', 'frozen', 'pantry', 'beverage', 'condiment')),
  storage_zone     TEXT DEFAULT 'fridge' CHECK (storage_zone IN ('fridge', 'freezer', 'pantry')),
  expiry_date      DATE,
  -- Colonne calculée automatiquement
  expiry_status    TEXT GENERATED ALWAYS AS (
    CASE
      WHEN expiry_date IS NULL THEN 'unknown'
      WHEN expiry_date < CURRENT_DATE THEN 'expired'
      WHEN expiry_date <= CURRENT_DATE + INTERVAL '2 days' THEN 'urgent'
      WHEN expiry_date <= CURRENT_DATE + INTERVAL '5 days' THEN 'soon'
      ELSE 'fresh'
    END
  ) STORED,
  added_by         UUID REFERENCES auth.users(id),
  scan_session_id  UUID REFERENCES scan_sessions(id),
  barcode          TEXT,
  notes            TEXT CHECK (LENGTH(notes) <= 500),
  is_consumed      BOOLEAN DEFAULT FALSE,
  consumed_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_inventory_household ON inventory_items(household_id);
CREATE INDEX idx_inventory_expiry ON inventory_items(expiry_date) WHERE is_consumed = FALSE;
CREATE INDEX idx_inventory_category ON inventory_items(household_id, category);
```

---

## 6.6 Table : scan_sessions

```sql
CREATE TABLE public.scan_sessions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL REFERENCES auth.users(id),
  household_id             UUID NOT NULL REFERENCES households(id),
  image_storage_path       TEXT NOT NULL,
  scan_zone                TEXT NOT NULL CHECK (scan_zone IN ('fridge', 'pantry', 'freezer', 'flat_lay')),
  status                   TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  ai_model                 TEXT NOT NULL DEFAULT 'claude-sonnet-4-6',
  tokens_input             INTEGER,
  tokens_output            INTEGER,
  processing_time_ms       INTEGER,
  ingredients_detected_count INTEGER DEFAULT 0,
  error_message            TEXT,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  completed_at             TIMESTAMPTZ
);
```

---

## 6.7 Table : recipes

```sql
CREATE TABLE public.recipes (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_for_user_id   UUID REFERENCES auth.users(id),
  title                   TEXT NOT NULL CHECK (LENGTH(title) <= 200),
  description             TEXT NOT NULL,
  servings                SMALLINT NOT NULL CHECK (servings BETWEEN 1 AND 20),
  prep_time_minutes       SMALLINT NOT NULL,
  cook_time_minutes       SMALLINT DEFAULT 0,
  difficulty              TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  dietary_tags            TEXT[] DEFAULT '{}',
  calories_per_serving    INTEGER,
  inventory_ids_used      UUID[] NOT NULL,
  is_public               BOOLEAN DEFAULT FALSE,
  share_token             TEXT UNIQUE,
  ai_model                TEXT NOT NULL DEFAULT 'claude-sonnet-4-6',
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.recipe_steps (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id     UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number   SMALLINT NOT NULL,
  instruction   TEXT NOT NULL,
  timer_seconds INTEGER,
  UNIQUE (recipe_id, step_number)
);

CREATE TABLE public.saved_recipes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id  UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  saved_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, recipe_id)
);
```

---

## 6.8 Table : user_subscriptions

```sql
CREATE TABLE public.user_subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                    TEXT NOT NULL CHECK (plan IN ('free', 'premium_monthly', 'premium_annual')),
  status                  TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  revenuecat_id           TEXT UNIQUE,
  current_period_start    TIMESTAMPTZ NOT NULL,
  current_period_end      TIMESTAMPTZ NOT NULL,
  cancel_at_period_end    BOOLEAN DEFAULT FALSE,
  scans_used_this_month   INTEGER DEFAULT 0,
  trial_end               TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Reset mensuel du compteur de scans (pg_cron, 1er de chaque mois à 00:05)
SELECT cron.schedule('reset-scan-counters', '5 0 1 * *',
  $$UPDATE user_subscriptions SET scans_used_this_month = 0 WHERE plan = 'free'$$
);
```

---

## 6.9 Table : notification_queue

```sql
CREATE TABLE public.notification_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN ('expiry_alert', 'weekly_summary', 'recipe_suggestion')),
  title           TEXT NOT NULL CHECK (LENGTH(title) <= 100),
  body            TEXT NOT NULL CHECK (LENGTH(body) <= 200),
  data            JSONB DEFAULT '{}',
  expo_push_token TEXT,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  scheduled_for   TIMESTAMPTZ NOT NULL,
  sent_at         TIMESTAMPTZ,
  error_message   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notif_queue_pending ON notification_queue(scheduled_for)
  WHERE status = 'pending';
```

---

## 6.10 Row Level Security (RLS) — Politiques Essentielles

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

-- profiles : accès uniquement à son propre profil
CREATE POLICY "profiles_own_access" ON profiles
  FOR ALL USING (auth.uid() = id);

-- inventory_items : accès aux membres du foyer
CREATE POLICY "inventory_household_read" ON inventory_items
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM household_members WHERE household_id = inventory_items.household_id
    )
  );

CREATE POLICY "inventory_household_write" ON inventory_items
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM household_members WHERE household_id = NEW.household_id
    )
  );

-- scan_sessions : uniquement le propriétaire
CREATE POLICY "scan_sessions_own" ON scan_sessions
  FOR ALL USING (auth.uid() = user_id);

-- recipes : son propre ou public
CREATE POLICY "recipes_own_or_public" ON recipes
  FOR SELECT USING (auth.uid() = generated_for_user_id OR is_public = TRUE);

-- user_subscriptions : uniquement service_role peut écrire (webhooks)
CREATE POLICY "subscriptions_own_read" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_service_write" ON user_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- notification_queue : uniquement service_role (crons)
CREATE POLICY "notif_queue_service_only" ON notification_queue
  FOR ALL USING (auth.role() = 'service_role');
```

---

# 7. INVENTAIRE DES ÉCRANS

## 7.1 Application Mobile — 29 Écrans

| Écran | Route / Deep Link | Composants Clés |
|---|---|---|
| Splash Screen | — (auto au lancement) | Logo animé, vérification session |
| Onboarding 1 — Bienvenue | pantryai://onboarding/1 | Illustration, CTA inscription/connexion |
| Onboarding 2 — Taille foyer | pantryai://onboarding/2 | Sélecteur 1–5+ personnes |
| Onboarding 3 — Préférences alimentaires | pantryai://onboarding/3 | Multi-select : végé, vegan, sans gluten… |
| Onboarding 4 — Notifications | pantryai://onboarding/4 | Demande permission notifications |
| Connexion | pantryai://auth/login | OAuth Google, OAuth Apple, email/MDP |
| Inscription | pantryai://auth/signup | Form email + MDP, CGU, politique confidentialité |
| Réinitialisation MDP | pantryai://auth/reset-password | Saisie email, confirmation envoi lien |
| Dashboard Principal | pantryai://home | Résumé inventaire, alertes péremption, CTA scan |
| Inventaire — Vue liste | pantryai://inventory | Liste ingrédients filtrée, barre recherche |
| Inventaire — Vue catégories | pantryai://inventory/categories | Grid par catégorie avec compteurs |
| Détail Ingrédient | pantryai://inventory/:id | Infos complètes, édition, suppression |
| Ajout Manuel Ingrédient | pantryai://inventory/add | Recherche nom, quantité, unité, date péremption |
| Scan — Caméra | pantryai://scan/camera | Viewfinder, guide cadrage, bouton capture |
| Scan — Traitement IA | pantryai://scan/processing | Animation chargement, progression, annulation |
| Scan — Résultats | pantryai://scan/results/:sessionId | Liste ingrédients détectés, correction inline |
| Scan — Confirmation | pantryai://scan/confirm | Récapitulatif, CTA recettes |
| Recettes — Liste générée | pantryai://recipes | 3–5 cards recettes, filtres diétiques |
| Détail Recette | pantryai://recipes/:id | Ingrédients, étapes, timer, partage |
| Mode Cuisine (step-by-step) | pantryai://recipes/:id/cook | Étapes plein écran, timer audio, progression |
| Favoris Recettes | pantryai://recipes/saved | Liste recettes sauvegardées, recherche |
| Notifications | pantryai://notifications | Centre de notifications, marquer comme lu |
| Économies — Dashboard | pantryai://savings | Compteur EUR/CO2, graphiques, badge partageable |
| Profil | pantryai://profile | Infos compte, préférences, abo, déconnexion |
| Paramètres Notifications | pantryai://settings/notifications | Contrôle granulaire par type d'alerte |
| Paramètres Préférences | pantryai://settings/preferences | Régimes, portions, fuseau horaire |
| Gestion Foyer | pantryai://household | Membres, invitation, code d'accès |
| Abonnement Premium | pantryai://subscription | Comparaison free/premium, CTA achat in-app |
| Paramètres Compte | pantryai://settings/account | Changement email/MDP, suppression compte |

## 7.2 Dashboard Admin Web — 6 Pages

| Page | URL | Données Affichées |
|---|---|---|
| Vue d'ensemble | /admin | KPIs temps réel : MAU, MRR, scans/jour, conversion |
| Utilisateurs | /admin/users | Table paginée, filtres, détail par user |
| Métriques IA | /admin/ai-metrics | Coût/scan, tokens utilisés, taux d'erreur |
| Abonnements | /admin/subscriptions | MRR, churn, LTV, cohort analysis |
| Notifications | /admin/notifications | Taux d'ouverture, échecs, opt-out |
| Logs & Erreurs | /admin/logs | Erreurs Sentry, Edge Functions, pg_cron |

---

# 8. FLUX UTILISATEURS DÉTAILLÉS

## 8.1 Flux d'Inscription et Onboarding

**Déclencheur :** L'utilisateur télécharge l'app pour la première fois

1. **APP LAUNCH** — Vérification session Supabase. Si token valide → Home. Sinon → Splash Screen.
2. **SPLASH SCREEN** (1,5 sec) — Animation logo. Préchargement des assets critiques.
3. **ÉCRAN BIENVENUE** — Illustration animée. CTA : "Commencer gratuitement" et "Déjà un compte ?". Tap "Commencer gratuitement" → Onboarding 1.
4. **ONBOARDING 1 — TAILLE DU FOYER** — Sélection illustrée (1 personne / 2 personnes / famille 3–4 / famille 5+). Stocké localement jusqu'à la création de compte.
5. **ONBOARDING 2 — PRÉFÉRENCES ALIMENTAIRES** — Multi-select avec icônes (végétarien, vegan, sans gluten, sans lactose, Halal, Kasher, Aucune préférence). Bouton "Suivant" (ou "Passer").
6. **ONBOARDING 3 — OBJECTIF PRINCIPAL** — Sélection unique : Réduire mon gaspillage / Économiser sur mes courses / Mieux manger / Les trois. Influence les messages de l'app.
7. **CRÉATION DE COMPTE** — 3 options : "Continuer avec Google" / "Continuer avec Apple" / "Créer avec email". Si email : form (email + MDP 8+ chars).
8. **CONFIRMATION EMAIL** (si email) — Écran de confirmation. Bouton "Renvoyer l'email". Polling Supabase toutes les 3 sec pour détecter la validation.
9. **POST-INSCRIPTION** — Trigger PostgreSQL crée profil + household par défaut. Navigation vers Permission Notifications.
10. **PERMISSION NOTIFICATIONS** — Explication valeur ("On te prévient avant que tes aliments périmés !"). Si refus : "Peut-être plus tard" sans pénalité.
11. **PREMIER SCAN GUIDÉ** — Tutoriel contextuel (3 bulles d'aide). Invitation à ouvrir le réfrigérateur et scanner.

---

## 8.2 Flux de Scan IA

**Déclencheur :** L'utilisateur tape le bouton Scan (FAB ou barre de navigation)

1. **VÉRIFICATION QUOTA** — Si utilisateur free ET `scans_used_this_month >= 3` : modal "Tu as utilisé tes 3 scans gratuits ce mois" avec CTA "Voir Premium" et "Annuler".
2. **OUVERTURE CAMÉRA** — Permission vérifiée. Guide de cadrage superposé : rectangle pointillé + texte "Ouvre ton réfrigérateur et place l'appareil face à lui".
3. **CAPTURE PHOTO** — Tap bouton ou volume. Auto-focus et exposition ajustés. Flash auto si luminosité insuffisante.
4. **PRÉ-TRAITEMENT LOCAL** — Compression JPEG qualité 85%, redimensionnement max 1920px, rotation EXIF normalisée. Taille cible < 800KB. Durée < 500ms.
5. **UPLOAD & ANALYSE** — Upload vers Supabase Storage. Appel Edge Function `scan-image`. Affichage "Analyse en cours..." avec animation.
6. **RÉPONSE IA** — Claude Vision retourne JSON structuré. Sauvegarde `scan_sessions` + `scan_results`. Incrément `scans_used_this_month` si free tier.
7. **AFFICHAGE RÉSULTATS** — Liste des ingrédients avec confiance visuelle (vert >80%, orange 50–80%, gris <50%). Chaque item éditable inline.
8. **CORRECTION OPTIONNELLE** — Swipe left → supprimer. Tap → éditer inline. Bouton "+" → ajouter un ingrédient manqué.
9. **CONFIRMATION** — Tap "Ajouter à mon inventaire". Upsert intelligente : si ingrédient existant → proposition mise à jour quantité ou doublon.
10. **SUGGESTIONS IMMÉDIATES** — "Avec ces ingrédients, tu peux faire..." : 2–3 recettes suggérées. CTA "Voir toutes les recettes".

---

## 8.3 Flux de Génération et Utilisation de Recettes

**Déclencheur :** Onglet Recettes ou suggestion post-scan

1. **CONTEXTE D'INVENTAIRE** — Récupération des items non-consommés. Tri par statut péremption (urgent d'abord).
2. **PARAMÈTRES RECETTES** — Si premier accès : modal de configuration (portions, filtres). Si retour : paramètres précédents.
3. **GÉNÉRATION IA** — Appel Edge Function `generate-recipes`. Skeleton loading (cards vides animées). Durée typique : 3–6 secondes.
4. **AFFICHAGE LISTE** — 3 à 5 recettes en cards scrollables. Chaque card : titre, temps total, difficulté, tags diétiques, indicateur ingrédients ("4/5 disponibles").
5. **SÉLECTION RECETTE** — Tap sur card → Détail Recette. Transition native (iOS : push, Android : slide).
6. **DÉTAIL RECETTE** — Sections : en-tête, liste ingrédients (disponibles en vert, manquants en gris), étapes numérotées, nutrition.
7. **MODE CUISINE** — Tap "Commencer la recette". Plein écran, mode veille désactivé. Timers lancés automatiquement si mentionnés.
8. **FIN DE RECETTE** — Écran célébration. Économies calculées. Proposition de marquer les ingrédients utilisés.
9. **SAUVEGARDE RECETTE** — Tap étoile → sauvegardé dans favoris. Toast de confirmation.

---

## 8.4 Flux de Gestion des Alertes Péremption

**Déclencheur :** Job pg_cron exécuté chaque nuit à 00:01 UTC

1. **CALCUL NOCTURNE** — `process-expiry-alerts` sélectionne les items où `expiry_date <= CURRENT_DATE + INTERVAL '2 days'` et `is_consumed = false`.
2. **GÉNÉRATION FILE D'ATTENTE** — Insertion dans `notification_queue` avec `scheduled_for = 07:00` au timezone de l'utilisateur. Vérification anti-doublon.
3. **ENVOI NOTIFICATIONS** — À 07:00 (timezone utilisateur), `send-push-notifications` envoie via Expo Push API. Rich notification avec deep-link.
4. **RÉCEPTION UTILISATEUR** — Notification sur écran verrouillé ou barre. iOS : en-tête + son. Android : notification étendue avec actions rapides.
5. **TAP NOTIFICATION** — Deep-link vers `pantryai://inventory/:item_id`. Section "Que faire avec ce(tte) [ingrédient] ?" avec 2 recettes générées.
6. **ACTION UTILISATEUR** — Consulter les recettes / Marquer comme consommé (1 tap) / Reporter l'alerte 24h / Ignorer.

---

# 9. EXIGENCES EN MATIÈRE DE SÉCURITÉ

## 9.1 Authentification et Gestion des Sessions

| Exigence | Implémentation |
|---|---|
| JWT avec durée courte | Access tokens : 3 600 sec. Refresh tokens : 2 592 000 sec (30 jours). |
| Rotation des refresh tokens | Activée dans Supabase. Chaque refresh invalide l'ancien token. |
| Protection brute force | Rate limiting : 5 tentatives de connexion / 5 min / IP. |
| Longueur MDP minimale | 8 caractères minimum, validation côté client (Zod) ET serveur. |
| Email verification obligatoire | Fonctionnalités scan/inventaire bloquées tant que l'email n'est pas vérifié. |
| Déconnexion globale | Option "Déconnecter tous les appareils" dans les paramètres. |

## 9.2 Sécurité des Données

| Exigence | Implémentation |
|---|---|
| RLS activé sur toutes les tables | Toutes les tables publiques ont RLS. Aucun accès sans auth valide. |
| Chiffrement au repos | AES-256 par Supabase sur l'ensemble des données PostgreSQL. |
| Chiffrement en transit | TLS 1.3 obligatoire (API, Storage, Realtime). |
| Isolation des photos de scan | Bucket scan-images privé. Accès via Signed URLs (durée 5 min). |
| Pas de données sensibles en logs | Les Edge Functions n'enregistrent jamais le contenu des images. |
| Suppression RGPD | Endpoint `delete-user-data` supprime tout dans 30 jours. Log conservé 90 jours. |

## 9.3 Sécurité des APIs

| Exigence | Implémentation |
|---|---|
| Rate limiting Edge Functions | Middleware rate-limiter : clé user_id + endpoint, compteur en base Supabase. |
| Validation des entrées | Zod schema validation sur tous les payloads JSON. Rejet HTTP 400 si invalide. |
| Taille max uploads | Limite 5MB (vérification taille + type MIME côté serveur). |
| Clés API secrètes | Clé Anthropic dans Supabase Secrets. Jamais exposée au client mobile. |
| Webhooks signature | Vérification signature HMAC-SHA256 des webhooks Stripe avant traitement. |
| CORS | Origines autorisées listées explicitement. Rejet des origines inconnues. |

## 9.4 Conformité RGPD

- **Base légale :** Contrat pour les données de compte. Intérêt légitime pour les analytics agrégées anonymisées.
- **Consentement :** OPT-IN obligatoire pour les notifications push. Pas de notification sans accord.
- **Politique de confidentialité :** Accessible depuis l'écran d'inscription et les paramètres. Rédigée en français, belge, néerlandais.
- **Portabilité des données :** Export JSON de l'ensemble des données dans les paramètres (généré en < 24h).
- **Droit à l'oubli :** Suppression complète initiable depuis l'app. Confirmation par email. Exécution dans 30 jours.
- **Conservation des données :** Photos de scan supprimées après 30 jours. Inventaire conservé tant que le compte est actif. Logs anonymisés conservés 12 mois.
- **Contact RGPD :** privacy@pantryai.app disponible.
- **Registre de traitement :** Maintenu à jour conformément à l'Article 30 RGPD.

---

# 10. MÉTRIQUES DE PERFORMANCE

## 10.1 SLOs (Service Level Objectives) Techniques

| Métrique | Objectif |
|---|---|
| Disponibilité API (uptime) | >= 99,5% par mois |
| Latence scan-image P50 | <= 2 500ms |
| Latence scan-image P95 | <= 6 000ms |
| Latence generate-recipes P50 | <= 3 000ms |
| Latence generate-recipes P95 | <= 8 000ms |
| Latence requêtes BDD (CRUD simples) | <= 100ms P95 |
| Upload image (4G standard, 800KB) | <= 2 000ms |
| Time to Interactive — premier lancement | <= 3 000ms (iPhone 11 / Android midrange) |
| Taux d'erreur Edge Functions | <= 0,5% sur 7 jours glissants |
| Précision reconnaissance ingrédients IA | >= 85% sur dataset de validation (200 photos) |

## 10.2 Métriques Produit (PostHog)

| Métrique | Définition et Objectif |
|---|---|
| DAU / MAU Ratio | Engagement quotidien. Objectif : >= 20% |
| Activation Rate | % users ayant fait 1 scan dans les 3 premiers jours. Objectif : >= 60% |
| D1 / D7 / D30 Retention | Objectifs : 50% / 30% / 20% |
| Scans / utilisateur actif (hebdo) | Objectif : >= 1,5 scans/semaine |
| Recettes générées / utilisateur actif (hebdo) | Objectif : >= 3 générations/semaine |
| Conversion Free → Premium (M1–M3) | Objectif : >= 8% dans les 90 premiers jours |
| LTV estimé | ARPU / Churn. Objectif : >= 45 EUR à M6 |
| NPS mensuel (in-app survey) | Objectif : >= 45 |
| Coût API IA / MAU | Objectif : <= 0,15 EUR/MAU/mois |
| Churn mensuel premium | Objectif : <= 8% |

## 10.3 Objectifs MRR Mensuels

| Période | Objectif MRR |
|---|---|
| Fin Mois 1 | 500 EUR (tests bêta, 100 users invités) |
| Fin Mois 2 | 1 500 EUR (lancement App Store public) |
| Fin Mois 3 | 3 000 EUR (campagne TikTok / bouche à oreille) |
| Fin Mois 4 | 4 500 EUR |
| Fin Mois 5 | 6 000 EUR |
| Fin Mois 6 | 7 000 EUR |
| Fin Mois 9 | 12 000 EUR (V2 + affiliation) |
| Fin Mois 12 | 20 000 EUR (B2B + expansion géographique) |

## 10.4 Alertes et Monitoring

- **Sentry** — Alerte immédiate si > 5 erreurs non gérées en 5 minutes → alert Slack #tech-alerts
- **PostHog** — Alerte si DAU baisse de > 20% en 24h vs moyenne mobile 7 jours
- **Supabase Dashboard** — Alerte si latence p95 BDD > 500ms sur 15 minutes
- **Anthropic API** — Alerte quotidienne si coût journalier > 50 EUR (prévention coût runaway)
- **Expo Push** — Alerte si taux de livraison < 90% de succès sur 1 heure
- **Stripe** — Alerte si > 3 webhooks échouent en 10 minutes

## 10.5 Stratégie de Tests

| Type de Test | Outil et Couverture Cible |
|---|---|
| Tests unitaires (Edge Functions) | Deno Test — Couverture > 80% sur logique métier |
| Tests unitaires (React/RN hooks) | Vitest + React Testing Library — > 70% |
| Tests d'intégration API | Postman Collections — 100% des endpoints |
| Tests E2E Mobile | Maestro (iOS + Android) — Flux : inscription, scan, recette |
| Tests de performance IA | Dataset 200 photos annotées — >= 85% précision avant déploiement |
| Tests de sécurité | OWASP Mobile Top 10 checklist avant chaque release majeure |
| Tests d'accessibilité | Axe-core + VoiceOver / TalkBack — WCAG 2.1 AA |

---

## PROCHAINES ÉTAPES IMMÉDIATES

| Semaine | Livrable |
|---|---|
| S1–S2 | Setup projet (Supabase, Expo, Stripe sandbox), schéma BDD, authentification |
| S3–S4 | Module scan IA (Edge Function + intégration Claude Vision), interface caméra |
| S5–S6 | Module inventaire complet (CRUD, RLS, catégorisation) |
| S7–S8 | Module recettes (génération IA, affichage, mode cuisine) |
| S9–S10 | Notifications (pg_cron, Expo Push), onboarding, polissage UX |
| S11–S12 | Abonnement Stripe/RevenueCat, tests, soumission App Store et Play Store |
| M3 | Lancement public + campagne TikTok organique |

---

*PantryAI — PRD v1.0 — Juin 2025 — CONFIDENTIEL*
