# Mise en ligne de la phase 2 — et retour en arrière

> Plus simple que la phase 1 : **aucune étape technique pour vous**. Il vous suffit de donner votre accord,
> puis (si GitHub le demande) de vous connecter à GitHub ou de cliquer « Push origin » dans GitHub Desktop.
> Durée : environ 15 minutes. Aucune coupure pour les apprenants.

## Ce qui change

**Pour les apprenants :** annonces du formateur, « Mes progrès » (objectif de la semaine, série, badges), « Mes notes »,
case « J'ai fait l'exercice », onglet « Quiz » (sur les leçons qui en ont un), case « Économie de données » sous la vidéo.
L'existant ne bouge pas (preuve pixel : `geoexpert-captures/preuve-existant-phase-2/`).

**Pour vous :** onglets « 📢 Annonces » et « ❓ Quiz », exercices faits dans la fiche et l'export, suppression des données
d'un apprenant (+ rappel des accès terminés depuis 12 mois).

Rien n'apparaît chez les apprenants tant que vous n'avez pas publié d'annonce ou créé de quiz.

## Étapes (dans cet ordre)

| # | Qui | Étape | Effet pour les apprenants |
|---|---|---|---|
| 1 | Claude | Sauvegarde complète de la production (KV + export de la base D1) dans `GeoExpert-Sauvegardes\<date>-avant-mise-en-ligne-phase-2\` | aucun |
| 2 | Claude | Ajout des nouvelles tables dans la base `geoexpert-prod` (rien n'est modifié ni supprimé) | aucun |
| 3 | Claude | Mise à jour de l'administration `geoexpert-admin` | aucun |
| 4 | Claude | Mise à jour du Worker des apprenants `espace-apprenant-api` | aucune coupure ; l'ancienne page fonctionne avec |
| 5 | Claude (+ 👤 connexion GitHub si demandée) | Publication du site : fusion de `phase-2` dans `main` et envoi sur GitHub | nouvelle page en 1 à 2 minutes |
| 6 | Claude | Vérifications en production avec un code de test (connexion, Mes progrès, objectif, exercice, Mes notes, vidéo, économie de données), puis suppression du code de test | aucun |
| 7 | 👤 Vous | Ouvrir l'administration : onglets Annonces et Quiz visibles | aucun |

## Revenir en arrière

| Partie | Comment | Qui |
|---|---|---|
| **Site** | Annuler la fusion sur `main` (« revert ») et renvoyer sur GitHub. État d'avant : étiquette git `sauvegarde-avant-phase-2`. | Claude (ou GitHub Desktop → History → clic droit → « Revert ») |
| **Worker des apprenants** | Cloudflare → Workers & Pages → `espace-apprenant-api` → **Deployments** → **Rollback** vers la version `6ff55243-c255-4c88-8b63-bd16fef1e380` (fin de phase 1). | Vous (2 clics) ou Claude |
| **Administration** | Même chose sur `geoexpert-admin`, vers la version `02697476-cfa9-48e2-bd89-7b02b7a857a3`. | Vous ou Claude |
| **Données** | Les nouvelles tables sont seulement ajoutées ; les anciennes données ne sont pas transformées. Sauvegardes : `2026-10-25-avant-phase-2` et celle de l'étape 1. | Claude |

Après un retour en arrière, les données de la phase 2 (objectifs, exercices, quiz, annonces) restent dans la base, sans gêner :
on peut remettre la phase 2 en ligne plus tard sans rien perdre.
