# Mise en ligne de la phase 3 — et retour en arrière

> Comme pour la phase 2 : **aucune étape technique pour vous**, seulement votre accord
> (et, si GitHub le demande, une connexion à GitHub ou « Push origin » dans GitHub Desktop). Aucune coupure pour les apprenants.

## Ce qui change

**Pour les apprenants :** carte « 🎓 Mon attestation » (PDF + vérification) dès que vous délivrez une attestation ;
carte « Votre avis » en fin de formation ; fichiers joints aux leçons (onglet « Exercices »).
**Pour le public :** nouvelle page **geoexpertacademy.ci/verifier-certificat.html** (annoncée dans la FAQ, maintenant reliée).
**Pour vous :** onglets « 📚 Contenu » et « 🎓 Attestations & avis » ; ligne « Attestation » dans chaque fiche.
**Correction :** les fichiers d'exercices se téléchargent enfin avec leur vrai nom et leur vraie extension
(aujourd'hui, tout arrive sous le nom « Exercice_GeoExpert.pdf », même un .zip).
**Politique de confidentialité :** attestations (conservées pour rester vérifiables) et avis (publiés seulement avec accord).

Le contenu des formations ne change pas tant que vous ne modifiez rien dans l'onglet « Contenu ».

## Étapes

| # | Qui | Étape | Effet pour les apprenants |
|---|---|---|---|
| 1 | Claude | Sauvegarde complète de la production (KV + base D1) dans `GeoExpert-Sauvegardes\<date>-avant-mise-en-ligne-phase-3\` | aucun |
| 2 | Claude | Ajout des nouvelles tables (`content`, `certificates`, `reviews`) dans `geoexpert-prod` | aucun |
| 3 | Claude | Mise à jour de `geoexpert-admin` puis de `espace-apprenant-api` ; vérification de l'ancienne page avec le nouveau Worker | aucune coupure |
| 4 | Claude (+ 👤 connexion GitHub si demandée) | Publication du site (fusion de `phase-3` dans `main`) | nouvelle page en 1 à 2 minutes |
| 5 | Claude | Vérifications en production avec un code de test : attestation (carte, PDF, page de vérification), avis, contenu inchangé, vidéo ; puis suppression du code de test **et de son attestation** | aucun |
| 6 | 👤 Vous | Ouvrir l'administration : onglets Contenu et Attestations & avis visibles | aucun |

## Revenir en arrière

| Partie | Comment | Qui |
|---|---|---|
| **Site** | Annuler la fusion sur `main` (« revert »). État d'avant : étiquette git `sauvegarde-avant-phase-3`. | Claude (ou GitHub Desktop → History → « Revert ») |
| **Worker des apprenants** | Cloudflare → `espace-apprenant-api` → **Deployments** → **Rollback** vers `7a610aab-98db-41c6-82b0-a615d876cd3f` (fin de phase 2). | Vous ou Claude |
| **Administration** | Même chose sur `geoexpert-admin`, vers `26e1e07e-e9da-4de2-96fd-b009581b15f7`. | Vous ou Claude |
| **Contenu** | Si un changement de contenu pose problème : onglet Contenu → « Revenir au contenu d'origine » (par formation). | Vous |
| **Données** | Nouvelles tables seulement ajoutées ; rien d'ancien n'est transformé. Sauvegardes : `2026-10-25-avant-phase-3` et celle de l'étape 1. | Claude |

⚠️ Après un retour en arrière, les attestations déjà délivrées restent dans la base, mais la page de vérification
(qui fait partie du site) et la carte « Mon attestation » disparaissent jusqu'à la remise en ligne.
