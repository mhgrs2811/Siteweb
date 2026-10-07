# PROMPT CLAUDE CODE — Application « Lumé » (nom provisoire)

À coller dans Claude Code au démarrage d'un repo vide, ou à enregistrer à la racine sous `PRD.md` puis dire : « Lis PRD.md et commence par la Phase 0 en mode plan. »

## 0. Ton rôle

Tu es un lead mobile engineer senior + product designer, l'équivalent d'une agence facturant plus de 20 000 € pour ce projet. Tu construis une application iOS/Android grand public, monétisée par abonnement, dont le niveau de finition visuelle doit être comparable aux meilleures apps beauté/bien-être de l'App Store. Rien ne doit paraître « template », « généré » ou « cheap ».

Règles de travail :

* Commence toujours en mode plan. Avant chaque phase, présente le plan, les fichiers que tu vas créer et les choix techniques, puis attends ma validation.
* Pose-moi tes questions bloquantes avant de coder, pas au milieu.
* N'invente jamais de clé API, d'identifiant de produit ou d'URL : utilise des variables d'environnement documentées dans `.env.example`.
* Chaque phase se termine par un état démontrable sur simulateur/appareil, sans écran cassé ni TODO visible par l'utilisateur.
* Code en TypeScript strict, commenté là où la logique n'est pas évidente, commits atomiques avec messages clairs.

## 1. Le produit

Lumé est un coach de peau personnel. L'utilisatrice prend un selfie, obtient une analyse esthétique de sa peau (score global + indicateurs détaillés), reçoit une routine matin/soir personnalisée, suit ses progrès semaine après semaine, et peut scanner n'importe quel produit cosmétique pour savoir s'il est compatible avec SA peau.

### Positionnement / différenciation

Le marché des apps « scan de peau » est rempli de clones génériques. Lumé se différencie sur trois axes :

1. Personnalisation produit : le scan d'un produit ne donne pas une note générique (comme les apps de notation d'ingrédients), il répond à la question « est-ce que ce produit est bon pour MA peau, vu mon profil et mon dernier scan ? ».
2. Expertise esthétique : le ton, les routines et les explications sont rédigés comme par une esthéticienne diplômée — précis, bienveillants, jamais alarmistes.
3. Premium francophone + international : FR et EN natifs dès la v1 (pas une traduction automatique bâclée).

### Cible

Femmes et hommes de 18 à 40 ans intéressés par le skincare, actifs sur TikTok/Instagram, qui achètent des produits sans savoir s'ils leur conviennent.

### Boucle principale (core loop)

Scan visage → Résultats + score → Routine personnalisée → Check-in quotidien (streak) → Re-scan hebdomadaire → Comparaison avant/après → Scan produits en magasin.

## 2. Cadre légal et éthique (non négociable)

* Ce n'est pas un dispositif médical. Aucun diagnostic de maladie (acné sévère, eczéma, rosacée, lésions, grains de beauté suspects…). Vocabulaire : « estimation cosmétique », « apparence », jamais « diagnostic ». Si l'analyse détecte un élément qui sort du cosmétique, afficher un message neutre invitant à consulter un dermatologue, sans nommer de pathologie.
* RGPD : les photos de visage et les informations de peau sont des données sensibles.
   * Consentement explicite et séparé avant le premier scan (écran dédié, pas une case noyée dans les CGU).
   * Hébergement UE (projet Supabase en région UE).
   * Bucket de stockage privé, URLs signées à durée courte, jamais d'image publique.
   * Option « ne pas conserver mes photos » (analyse puis suppression immédiate, seuls les scores sont gardés).
   * Suppression complète du compte et des données depuis l'app, en un écran.
   * Le fournisseur d'IA vision ne doit pas réutiliser les images pour l'entraînement (à documenter dans le README).
* Âge minimum 16 ans, demandé dans l'onboarding.
* Pas de comparaison d'attractivité, pas de « note de beauté » du visage : on parle de la peau, pas du physique.
* Conformité App Store / Play Store : conditions d'essai et de renouvellement claires sur le paywall, lien CGU + politique de confidentialité, bouton « Restaurer les achats ».

## 3. Stack technique

* Expo (dernière version stable du SDK) + Expo Router + TypeScript strict.
* Development build via EAS (pas Expo Go, car RevenueCat et la caméra avancée nécessitent du natif).
* UI / animation : React Native Reanimated, React Native Skia (anneau de score, graphiques, effets), expo-blur, expo-haptics, expo-image, react-native-gesture-handler.
* Caméra & scan : expo-camera (selfie + lecture de codes-barres).
* Backend : Supabase (Auth, Postgres avec RLS sur toutes les tables, Storage privé, Edge Functions).
* IA vision : appel uniquement côté serveur via une Edge Function, fournisseur configurable par variable d'environnement (modèle multimodal capable de sortie JSON structurée). Aucune clé d'IA dans l'app.
* Base produits : Open Beauty Facts (API ouverte) pour les codes-barres ; si produit introuvable → photo de la liste INCI, lecture par le modèle vision.
* Abonnements : RevenueCat (paywall custom, pas le paywall par défaut), webhook RevenueCat → Supabase pour vérifier les droits côté serveur.
* Analytics produit : PostHog (instance UE), événements du funnel listés en section 8.
* État : Zustand pour l'état client, TanStack Query pour les données serveur.
* i18n : i18next avec fichiers FR et EN complets, détection de la langue de l'appareil.
* Notifications locales : expo-notifications (rappels de routine).
* Qualité : ESLint + Prettier, tests unitaires (Jest) sur la logique de scoring et de compatibilité produit.

## 4. Direction artistique (le point le plus important)

Objectif : une app qui ressemble à une marque de cosmétique haut de gamme, éditoriale, calme et précise. Référence d'ambiance : magazine beauté imprimé + interface d'horlogerie. Interdit : dégradés violet/bleu génériques, emojis en guise d'icônes, ombres lourdes, cartes arrondies partout avec la même taille, illustrations 3D stock, police système par défaut.

### Design system (à créer en Phase 0, dans `/theme`, avant tout écran)

* Couleurs (mode clair) : fond ivoire chaud `#F7F3EE`, surface `#FFFFFF`, encre `#1C1A17`, texte secondaire `#6E675F`, accent principal terre cuite douce `#B5684A`, accent secondaire champagne `#CDB38B`, succès sauge `#7E9A7A`, alerte ambre `#C98A3D`. Lignes de séparation `#E7E0D7`.
* Mode sombre complet : fond `#121110`, surface `#1C1A18`, encre `#F2EDE6`, accents légèrement éclaircis. Tous les composants testés dans les deux modes.
* Typographie : une serif d'affichage élégante (ex. Fraunces ou Cormorant Garamond, Google Fonts) pour les titres et les chiffres de score ; une sans-serif nette (ex. Inter) pour le texte. Échelle typographique définie en tokens (display, h1, h2, body, caption, overline en capitales espacées).
* Grille & espacements : base 4 pt, marges latérales 20–24 pt, beaucoup d'air. Rayons : 4 / 12 / 24 / pill, utilisés avec intention.
* Icônes : une seule famille, trait fin (ex. Phosphor « light » ou Lucide), taille et épaisseur constantes.
* Mouvement : animations à ressort (spring) subtiles, transitions partagées entre écrans quand c'est pertinent, apparitions décalées (stagger) sur les listes, feedback haptique léger sur chaque action importante (capture, résultat, validation d'étape, achat).
* Composants signature :
   * Anneau de score dessiné en Skia, rempli en animation avec compteur numérique synchronisé.
   * Écran « analyse en cours » : la photo de l'utilisatrice avec une ligne de scan lumineuse et des points de mesure qui apparaissent sur les zones du visage, textes d'étape qui défilent (« Texture… », « Éclat… », « Hydratation apparente… »). Durée minimale de 6–8 s même si l'IA répond plus vite : c'est un moment de valeur perçue.
   * Carte de résultat partageable (format 9:16) : score, 3 points forts, design de marque, logo discret, prête pour les stories TikTok/Instagram. C'est notre principal levier viral.
   * Skeletons élégants (shimmer doux) au lieu de spinners.
   * Bottom sheets natives pour les détails.
* Accessibilité : contrastes AA, tailles de police dynamiques respectées, labels pour lecteurs d'écran.

Avant de coder les écrans, crée un écran caché `/dev/design-system` qui présente tous les tokens et composants, pour que je valide le rendu.

## 5. Écrans et parcours (MVP v1)

### 5.1 Onboarding (objectif : engagement + conversion)

Inspiré des apps d'abonnement qui convertissent le mieux : onboarding long, interactif, qui construit l'investissement de l'utilisatrice avant le paywall. Une question par écran, barre de progression fine en haut, réponses en grandes cartes tactiles, haptique à chaque choix.

1. Écran d'accueil éditorial (visuel fort, promesse en une phrase, CTA « Commencer »).
2. Prénom.
3. Tranche d'âge (+ vérification 16 ans minimum).
4. Type de peau ressenti (sèche, grasse, mixte, normale, je ne sais pas).
5. Objectifs principaux (multi-choix : éclat, imperfections, texture, taches, rides, pores, rougeurs, hydratation).
6. Sensibilités connues (multi-choix, inclut « parfum », « alcool »… + « aucune »).
7. Routine actuelle (aucune / basique / complète) et budget mensuel skincare.
8. Mode de vie (sommeil, eau, soleil, maquillage quotidien).
9. Écran « preuve » : graphique montrant la progression attendue avec une routine adaptée (formulé comme illustration, sans fausse promesse chiffrée).
10. Consentement données photo (écran dédié, voir section 2).
11. Autorisation notifications (avec explication de la valeur avant la popup système).
12. Guide de prise de vue (lumière naturelle, sans maquillage, visage centré) puis caméra.

### 5.2 Capture selfie

* Caméra frontale avec ovale-guide, détection basique de conditions (luminosité trop faible → message), compte à rebours 3 s, haptique à la capture.
* Possibilité de reprendre la photo.

### 5.3 Analyse & résultats

* Écran « analyse en cours » (voir composant signature).
* Résultats partiellement visibles avant paywall : le score global s'affiche, les indicateurs détaillés et la routine sont floutés (expo-blur) avec un CTA « Débloquer mon analyse complète » → paywall.
* Après abonnement : score global /100, 8 indicateurs (texture, éclat, hydratation apparente, pores, rougeurs, taches, cernes, ridules) avec mini-jauge, explication courte et conseil pour chacun, zones du visage annotées sur la photo.

### 5.4 Paywall

* Paywall custom au design de la marque, pas générique.
* Deux offres : annuel avec essai gratuit 3 jours (mis en avant, prix ramené à la semaine affiché en secondaire) et hebdomadaire sans essai. Prix configurables depuis RevenueCat (hypothèse de départ : ~39,99 €/an et ~6,99 €/semaine, à tester).
* Timeline visuelle de l'essai (« Aujourd'hui : accès complet · Jour 2 : rappel · Jour 3 : début de l'abonnement »).
* Bénéfices concrets, pas de liste de fonctionnalités techniques.
* Liens CGU / confidentialité, « Restaurer les achats », bouton de fermeture visible.
* Architecture prête pour l'A/B test de paywalls (RevenueCat Offerings/Experiments).

### 5.5 Accueil (après abonnement) — onglet « Aujourd'hui »

* Salutation personnalisée, score actuel, streak.
* Routine du moment (matin ou soir selon l'heure) en checklist : chaque étape cochée = animation + haptique.
* Carte « prochain scan dans X jours ».

### 5.6 Onglet « Routine »

* Routine matin / soir générée selon le profil + le dernier scan : étapes ordonnées (nettoyant, sérum, hydratant, SPF…), type de produit et ingrédients actifs recommandés, fréquence (ex. exfoliant 2×/semaine), explication courte de chaque étape.
* Ingrédients à éviter selon les sensibilités.
* Rappels configurables.

### 5.7 Onglet « Progrès »

* Timeline des scans avec photos (si conservées), courbe du score global (Skia), évolution par indicateur.
* Comparateur avant/après avec curseur glissant entre deux photos.
* Bouton « Partager ma progression » → carte 9:16.

### 5.8 Onglet « Scanner produit »

* Scan code-barres → fiche produit (Open Beauty Facts) → verdict de compatibilité personnalisé : Compatible / À utiliser avec précaution / Peu adapté, avec les ingrédients qui expliquent le verdict par rapport au profil et aux objectifs de l'utilisatrice.
* Si produit inconnu : photo de la liste d'ingrédients → lecture par IA → même verdict.
* Historique des produits scannés, possibilité d'ajouter un produit « à ma routine ».

### 5.9 Profil & réglages

* Modifier le profil de peau, langue, notifications, gestion de l'abonnement, option « ne pas conserver mes photos », export et suppression des données, CGU, confidentialité, contact.
* Connexion Apple / Google pour sauvegarder et retrouver ses données (proposée après le premier résultat, jamais imposée avant).

## 6. Architecture & données

### Authentification

* Session anonyme Supabase au lancement (zéro friction), liaison ultérieure à Apple/Google sans perte de données.

### Tables (toutes avec RLS « l'utilisateur ne voit que ses lignes »)

* `profiles` : id, prénom, tranche d'âge, langue, préférences, consentement photo (date + version), option conservation photos.
* `skin_profiles` : réponses de l'onboarding (type, objectifs, sensibilités, routine actuelle, budget, mode de vie).
* `scans` : id, user_id, date, chemin photo (nullable), score global, indicateurs (jsonb), zones annotées (jsonb), version du modèle/prompt, statut.
* `routines` + `routine_steps` : routine courante versionnée, générée à partir du profil + dernier scan.
* `checkins` : complétion quotidienne des étapes (pour le streak).
* `product_scans` : code-barres, nom, INCI, verdict, raisons (jsonb), date.
* `entitlements` : état de l'abonnement alimenté par le webhook RevenueCat.

### Edge Functions

* `analyze-skin` : vérifie le droit d'accès et la limite d'usage (ex. 1 scan complet/jour), récupère l'image via URL signée, appelle le modèle vision avec un prompt système versionné et une sortie JSON validée par schéma (zod), normalise les scores, enregistre, supprime la photo si l'option l'exige.
* `generate-routine` : construit la routine à partir du profil + scan (logique de règles déterministes en priorité, IA pour la rédaction des explications).
* `check-product` : récupère le produit (Open Beauty Facts ou lecture INCI), calcule le verdict de compatibilité. La logique de compatibilité doit être principalement déterministe (table d'ingrédients × sensibilités × objectifs), testée unitairement ; l'IA ne sert qu'à formuler l'explication.
* `revenuecat-webhook` : met à jour `entitlements`.
* `delete-account` : suppression complète (données + fichiers).

### Stabilité des scores (point critique)

Les modèles vision donnent des résultats variables d'une photo à l'autre. Mets en place :

* un guide de capture strict (lumière, distance, sans maquillage) ;
* température basse et prompt très structuré avec grille de notation explicite par indicateur ;
* un lissage des variations entre scans (ex. limiter l'écart affiché si les conditions de prise de vue diffèrent fortement, signaler une photo de mauvaise qualité plutôt que d'afficher un score aberrant) ;
* le stockage de la version du prompt/modèle pour chaque scan. Une utilisatrice qui voit son score sauter de 15 points sans raison désinstalle l'app.

## 7. Rétention & croissance

* Streak quotidien de routine avec animation de célébration sobre.
* Rappels locaux matin/soir aux heures choisies.
* Re-scan hebdomadaire mis en avant + notification.
* Cartes partageables (résultat, progression) avec lien vers l'app.
* Demande de note App Store (StoreKit review) déclenchée après un moment positif (amélioration du score, 7 jours de streak), jamais au premier lancement.
* Liens profonds (deep links) prêts pour les campagnes TikTok/Instagram.

## 8. Analytics (PostHog UE)

Événements minimum : `onboarding_started`, `onboarding_step_completed` (avec index), `photo_consent_given`, `scan_captured`, `scan_result_viewed`, `paywall_viewed`, `trial_started`, `purchase_completed`, `paywall_dismissed`, `routine_step_checked`, `rescan_completed`, `product_scanned`, `share_card_created`, `account_deleted`. Objectif : pouvoir lire le funnel onboarding → paywall → essai → conversion et repérer les écrans où l'on perd les utilisatrices.

## 9. Phasage

Chaque phase = plan → validation → code → démo.

* Phase 0 — Fondations : init Expo + Router + TS strict, EAS dev build, structure de dossiers, design system complet + écran `/dev/design-system`, i18n FR/EN, thème clair/sombre, `.env.example`, README.
* Phase 1 — Onboarding : tous les écrans 5.1, stockage local puis Supabase (auth anonyme), consentement.
* Phase 2 — Capture & analyse : caméra, upload sécurisé, Edge Function `analyze-skin` avec schéma JSON validé, écran d'analyse animé, écran de résultats (version floutée + version complète).
* Phase 3 — Paywall & abonnements : RevenueCat, paywall custom, webhook, vérification serveur des droits, restauration.
* Phase 4 — Routine & accueil : génération de routine, onglet Aujourd'hui, checklist, streak, notifications.
* Phase 5 — Progrès : historique, courbes Skia, comparateur avant/après, cartes partageables.
* Phase 6 — Scanner produit : codes-barres, Open Beauty Facts, lecture INCI, moteur de compatibilité + tests.
* Phase 7 — Finition & mise en store : passe complète de polish (animations, états vides, états d'erreur, mode sombre, petits écrans, accessibilité), analytics, suppression de compte, politique de confidentialité et CGU (brouillons à faire relire), icône + écran de lancement, textes de fiche App Store/Play Store FR/EN avec mots-clés, liste des captures d'écran à produire.

## 10. Définition de « terminé » (quality bar)

* Aucun écran sans état de chargement, état vide et état d'erreur soignés.
* Aucun texte en dur : tout passe par i18n, FR et EN relus.
* Rendu impeccable en clair et en sombre, sur petit iPhone (SE) comme sur grand écran, et sur Android.
* 60 fps sur les animations principales, pas de saut de layout.
* Aucune clé secrète dans le bundle, RLS active et testée sur toutes les tables.
* Les flux d'achat, d'essai, de restauration et de suppression de compte fonctionnent de bout en bout en sandbox.
* Les textes ne contiennent aucune allégation médicale.

## 11. Ce que j'attends de toi maintenant

1. Lis l'ensemble de ce document.
2. Pose-moi tes questions bloquantes (maximum 10, regroupées).
3. Propose le plan détaillé de la Phase 0 uniquement, puis attends ma validation avant d'écrire du code.
