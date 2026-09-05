# Charte éditoriale SafeCheck

SafeCheck informe, ne juge pas. Un contact signalé n'est pas un contact coupable.
Cette charte protège nos utilisateurs (clarté, sérénité) et SafeCheck (risque
juridique de diffamation).

## Vocabulaire autorisé

- « Signalé comme suspect »
- « Signalements communautaires »
- « Risque potentiel »
- « Nombre élevé de signalements récents »
- « Soyez prudent »
- « Plusieurs indicateurs de risque détectés »
- « Aucun signalement connu » (jamais « sûr » ni « fiable »)

## Interdit

- Toute affirmation catégorique : « c'est une arnaque », « ce numéro est
  frauduleux », « site dangereux ».
- Toute qualification des personnes : « escroc », « arnaqueur », « fraudeur »,
  « criminel », « coupable ».
- Toute affirmation juridique non vérifiée : « condamné », « fraude avérée ».
- Toute garantie de sécurité : « ce contact est sûr », « vous pouvez faire confiance ».

Un test automatique (`src/core/i18n/__tests__/editorial.test.ts`) fait échouer
la CI si un terme interdit apparaît dans les traductions. Il ne remplace pas
la relecture humaine : compléter la liste des motifs quand un cas passe entre
les mailles.

## Ton

- Phrases courtes, mots du quotidien, aucun jargon (« phishing » → « faux message »).
- Rassurant, jamais culpabilisant (« cela arrive à des milliers de personnes »).
- Toujours une action concrète et simple à proposer.
- Tutoiement interdit ; vouvoiement systématique.

## Niveaux de risque (libellés officiels)

| Niveau     | Libellé                          | Accompagnement                                                   |
| ---------- | -------------------------------- | ---------------------------------------------------------------- |
| `unknown`  | Aucun signalement connu          | « Cela ne garantit pas qu'il soit sûr : restez attentif. »       |
| `low`      | Peu de signalements              | « Soyez prudent, surtout si on vous demande de l'argent… »       |
| `moderate` | Risque potentiel                 | « Plusieurs indicateurs de risque ont été détectés. »            |
| `high`     | Nombre élevé de signalements     | « Nous vous recommandons de ne pas donner suite. »               |

## Mention obligatoire sur l'écran de résultat

« Les informations affichées reposent sur des signalements communautaires et ne
constituent pas une accusation. Un contact peut être signalé par erreur. »
