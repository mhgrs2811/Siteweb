# Sécurité & confidentialité

## Principes

1. **Minimisation** : nous ne stockons que ce qui sert la protection de la communauté.
2. **Aucun historique de recherche côté serveur** : les vérifications ne sont
   pas journalisées par utilisateur. Seul un hash (requérant + sel quotidien)
   sert à limiter le débit, purgé sous 24 h. L'historique « dernières
   vérifications » est local à l'appareil et effaçable.
3. **Anonymat communautaire** : un signalement publié n'expose jamais son auteur.
4. **Modération avant publication** : aucune description n'est visible avant
   validation ; les extraits sont tronqués à 280 caractères.
5. **Droit à l'effacement** : `delete_my_account()` supprime le compte ; les
   signalements sont conservés anonymisés (intérêt légitime : protection
   d'autrui), conformément à la politique de confidentialité à rédiger.

## Données personnelles traitées

| Donnée                       | Finalité                       | Base légale         | Durée                         |
| ---------------------------- | ------------------------------ | ------------------- | ----------------------------- |
| Email (auth)                 | Connexion, anti-abus           | Exécution du contrat| Vie du compte                 |
| Signalements (texte libre)   | Protection communautaire       | Intérêt légitime    | Illimitée, anonymisés         |
| Hash requérant (check_logs)  | Limitation de débit            | Intérêt légitime    | 24 h                          |
| Historique local             | Confort utilisateur            | —                   | Appareil, effaçable           |

Les identifiants vérifiés ou signalés (numéros, emails, domaines) peuvent
concerner des tiers : ils sont traités comme des données de signalement,
soumises à modération et à un droit de rectification (procédure de contestation
à mettre en place avant lancement public).

## Mesures techniques

- Sessions stockées via Keychain/Keystore (`expo-secure-store`, fragmenté).
- RLS PostgreSQL sur toutes les tables ; accès agrégé via fonctions `SECURITY DEFINER`.
- Clé anonyme Supabase publique par conception : la sécurité repose sur RLS,
  jamais sur le secret de la clé.
- Limitation de débit serveur (60 vérifications/min, 20 signalements/jour).
- Détection côté client de données personnelles dans les descriptions
  (numéros de carte, téléphones) avec blocage de l'envoi.
- Aucun SDK publicitaire, aucun identifiant publicitaire, analytique agrégée.

## À faire avant production

- [ ] Politique de confidentialité et CGU (juriste).
- [ ] Procédure de contestation d'un signalement (« ce contact est le mien »).
- [ ] Console de modération (rôle `moderator`, politiques RLS dédiées).
- [ ] Journal d'audit des actions de modération.
- [ ] Sauvegardes chiffrées et test de restauration.
- [ ] Pentest de la surface RPC.
- [ ] Hébergement UE du projet Supabase.
