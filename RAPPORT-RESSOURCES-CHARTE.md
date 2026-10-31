# Rapport : « Mes ressources », livret et guide adaptés, charte de l'apprenant (31/10/2026)

Tout a été fait sur l'environnement de test (Workers `espace-apprenant-api-test` / `geoexpert-admin-test`, base `geoexpert-test`,
bucket privé `geoexpert-fichiers-test`) et sur un Worker local. **Rien n'est en ligne pour les apprenants.**
Sauvegarde avant les travaux : `GeoExpert-Sauvegardes\2026-10-31-avant-ressources-charte\` (3 clés KV, base de production, code de `main`,
dossier `ressources`) ; étiquette git `sauvegarde-avant-ressources-charte` ; branche `ressources-charte`.

## Les tests demandés

| Test demandé | Résultat | Où |
|---|---|---|
| Ressource bloquée inaccessible par adresse directe | ✅ refusée par le serveur avant le 8e jour ; un lien valable pour le livret, détourné vers le guide bloqué ou un autre cours → refusé ; lien sans signature, signature inventée, date prolongée → refusé ; lien déjà donné puis accès désactivé → refusé ; adresse du fichier dans le stockage → introuvable ; bucket sans adresse publique (r2.dev désactivé, aucun domaine) | `test-ressources.mjs api` + `enligne` |
| Ressource d'une autre formation inaccessible | ✅ cours ArcGIS 1 refusé à un apprenant QGIS 1 ; Projet final refusé sans le Pack complet ; ressources retenues refusées | idem |
| Nom de l'apprenant sur chaque document | ✅ kit (18 pages), cours ArcGIS 1 (29 pages, en local et en ligne), livret (10 pages) et guide (9 pages) en PDF : « Document réservé à [Nom] – [code] – GeoExpert Academy » sur **chaque** page ; à l'écran pour le livret et le guide ; fichiers d'origine inchangés | `test-ressources.mjs api`, `enligne`, `documents` |
| Charte obligatoire | ✅ fenêtre à la 1re connexion (ordinateur et téléphone), bouton inactif tant que la case n'est pas cochée, tableau de bord non cliquable derrière ; leçon, exercice, quiz et ressources refusés par le serveur tant qu'elle n'est pas acceptée ; acceptation enregistrée (code, date et heure, version) ; ancienne version refusée ; plus de fenêtre à la reconnexion | `test-ressources.mjs api` |
| Ancien apprenant inchangé | ✅ un ancien code garde son accès, sa date de fin et sa progression ; la charte lui est demandée une fois ; guide et cours disponibles tout de suite (pas de période d'essai) ; un code remplacé garde sa charte acceptée ; la suppression des données efface aussi l'acceptation | `test-ressources.mjs api` |
| Tableau de bord inchangé | ✅ preuve au pixel : **50/50** blocs identiques à la page en ligne aujourd'hui (nouveautés masquées) et **34/34** à la page des vidéos publicitaires | `comparer-elements.mjs … cacher ressources` / `cacher` |

## Tous les résultats (31/10/2026)

- Nouveaux tests : `test-ressources.mjs api` **61/61** · `admin` **12/12** · `enligne` **8/8** · `documents` **20/20** · pages du site (charte, ligne d'inscription, confidentialité) **14/14**
- Non-régression (`tous-les-tests.mjs`) : tableau de bord 13/13, fiche 19/19, actions 16/16, export 8/8, purge 15/15, annonces 10/10 + 6/6,
  progrès 3/3 + 14/14, quiz 9/9 + 12/12, attestations 16/16 + 16/16, contenu 18/18 + 7/7, paiements 66/66, gros fichiers 17/17 + 18/18,
  synchro 18/18, admin Access 3/3, apprenant 15/15, économie de données 7/7, compatibilité ancienne page OK
- Toujours en échec, **sans lien avec ces travaux** (déjà noté dans PLAN-PLATEFORME.md) : `test-relances` « Code reçu aujourd'hui » (24/25).
- Tests mis à jour : `test-paiements` (13 onglets d'administration au lieu de 12) ; `test-contenu` (18 leçons dans QGIS 1 depuis le masquage de la leçon 9 du 30/10) ; la suite fait accepter la charte aux apprenants de test avant les tests en ligne.

### Note sur la preuve au pixel
Deux passages de l'après-midi ont montré de petits écarts (1 à 284 pixels par bloc, sur le lissage de quelques lettres en gras, en thème
sombre, sur des blocs différents d'un passage à l'autre). Ce n'est pas un changement de l'écran : le même écart est apparu sur la **page de
connexion**, dont le code est strictement identique dans les deux versions et qui s'affiche avant tout ajout ; un essai témoin (page d'origine
contre elle-même) donne 50/50 deux fois. L'outil attend maintenant le chargement complet des polices avant les captures ; les passages
suivants donnent 50/50. Le passage avec écarts est gardé dans `preuve-existant-ressources-charte\passage-avec-bruit-de-rendu\`.

## Captures (`C:\Users\HP\Documents\GitHub\geoexpert-captures\`)

- `avant-ressources-charte\` : tableau de bord ordinateur et téléphone, colonne de gauche (téléphone)
- `apres-ressources-charte\` : `1-fenetre-charte-*`, `2-tableau-de-bord-*`, `3-colonne-gauche-telephone`, `4-mes-ressources-*`,
  `avant-apres-colonne-gauche-telephone.png`, `admin-ressources-*`, `admin-fiche-charte.png`, `nom-en-bas-des-pages-pdf.png`
- `apres-ressources-charte\documents\` : livret et guide (ordinateur, téléphone) + `Livret_d_accueil_Koffi.pdf`, `Guide_pratique_cartographie_Koffi.pdf`
- `apres-ressources-charte\site\` : page de la charte, cartes de formation avec la ligne d'acceptation
- `preuve-existant-ressources-charte\` : comparaisons bloc par bloc

## Points signalés pendant les travaux

- `ressources/logo.png` est le logo d'une autre société (« Les Cartes Géographiques ») : le livret et le guide utilisent le logo du site.
- Comparaison charte / CGV (avant correction) : durées comptées « à la réception du code » au lieu de « à la première connexion »,
  données « jamais partagées » au lieu de « transmises aux prestataires nécessaires », sanction sans « sans remboursement ».
  Corrigé dans la charte (validé le 31/10/2026) ; les CGV n'ont pas été modifiées.
- Le kit de démarrage SIG n'est pas publié sur le site : il est seulement annoncé « offert ». Il est maintenant dans « Mes ressources ».
