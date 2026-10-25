# Mise en ligne de la phase 1 — et retour en arrière

> Toutes les étapes sont faites par Claude, **sauf celles marquées 👤 (à faire par vous)**.
> Rien ne se fait sans votre accord explicite. Durée totale : environ 30 minutes, dont 10 pour vous.
> Meilleur moment : un soir ou un week-end, quand peu d'apprenants sont connectés.

## Ce qui change pour les apprenants

- Leur progression et leurs notes sont sauvegardées sur leur compte (elles passent automatiquement du téléphone au serveur, sans perte).
- Un message du jour sous le bandeau de bienvenue et une carte « Essai et assistance » sous les chiffres.
- La phrase du bas du tableau de bord et l'aide du champ de notes disent « sur votre compte » au lieu de « sur cet appareil ».
- Rien d'autre ne bouge (preuve pixel : `geoexpert-captures/preuve-existant-phase-1/`).

## Ce qui change pour vous

- **Nouvelle adresse de l'administration : https://geoexpert-admin.geographe07.workers.dev**
  (connexion par e-mail + code, puis votre mot de passe habituel). L'ancienne adresse renvoie vers la nouvelle.

---

## Étapes de mise en ligne (dans cet ordre)

| # | Qui | Étape | Effet pour les apprenants |
|---|---|---|---|
| 1 | Claude | Nouvelle sauvegarde complète des données de production (KV) dans `GeoExpert-Sauvegardes\<date>-avant-mise-en-ligne-phase-1\` | aucun |
| 2 | Claude | Création de la base `geoexpert-prod` (D1) et de ses tables ; son identifiant est reporté dans `worker/wrangler-prod.toml` et `worker/wrangler-admin-prod.toml` | aucun |
| 3 | Claude | Création du Worker d'administration `geoexpert-admin`. Tant qu'Access n'est pas activé, il **refuse tout le monde** | aucun |
| 4 | 👤 Vous | Dans Cloudflare : activer Access sur **geoexpert-admin** (même procédure que pour le test, GUIDE-ADMIN.md §1), vérifier que seule votre adresse e-mail est autorisée, et m'envoyer le nouveau **POLICY_AUD** | aucun |
| 5 | 👤 Vous | Installer votre mot de passe administrateur habituel sur le nouveau Worker, avec la commande ci-dessous (elle vous le demande ; ne me le donnez pas) | aucun |
| 6 | Claude | Mise à jour de `geoexpert-admin` avec le POLICY_AUD ; vérification que l'accès sans e-mail est refusé | aucun |
| 7 | 👤 Vous | Test : ouvrir https://geoexpert-admin.geographe07.workers.dev, e-mail + code + mot de passe ; vérifier que vos apprenants apparaissent | aucun |
| 8 | Claude | Mise à jour du Worker des apprenants `espace-apprenant-api` (nouveau code, base D1, `ROLE = apprenant`) | Aucune coupure. L'ancienne page fonctionne avec le nouveau Worker (testé) |
| 9 | Claude, avec votre accord | Publication du site : fusion de la branche `phase-1` dans `main` et envoi sur GitHub (GitHub Pages met en ligne en 1 à 2 minutes) | Nouvelle page apprenant, nouvelle politique de confidentialité |
| 10 | Claude + 👤 | Vérifications en production : un code de test créé dans la nouvelle admin, connexion, leçon terminée, retour dans la fiche ; puis ce code est désactivé | aucun |

Commande de l'étape 5 (à coller dans un terminal PowerShell ; elle vous demandera le mot de passe) :

```
& 'C:\Users\HP\Documents\GeoExpert-Outils\node_modules\.bin\wrangler.cmd' secret put ADMIN_PASSWORD -c 'C:\Users\HP\Documents\GitHub\geoexpert-academy\worker\wrangler-admin-prod.toml'
```

---

## Revenir en arrière (si un problème apparaît)

Chaque partie peut être annulée séparément, en quelques minutes, **sans perte de données** :

| Partie | Comment revenir en arrière | Qui |
|---|---|---|
| **Site (pages)** | Annuler la fusion sur `main` (« revert ») et renvoyer sur GitHub : l'ancienne page apprenant et l'ancienne admin reviennent en 1 à 2 minutes. L'état d'origine est aussi gardé sous l'étiquette git `sauvegarde-avant-phase-1`. | Claude (ou vous : GitHub Desktop → History → clic droit sur le commit → « Revert ») |
| **Worker des apprenants** | Cloudflare → Workers & Pages → `espace-apprenant-api` → **Deployments** → sur la version précédente : **Rollback**. Version d'avant la phase 1 : `17015681-3113-4931-aa79-f09ce69c50b5`. | Vous (2 clics) ou Claude |
| **Administration** | Le revert du site + le rollback du Worker des apprenants rendent l'ancienne admin utilisable. Le Worker `geoexpert-admin` peut rester (il est protégé) ou être supprimé. | Claude |
| **Données** | Les données existantes (codes, accès) ne sont pas transformées : la phase 1 ajoute seulement des champs facultatifs et une nouvelle base (D1). Sauvegardes : `GeoExpert-Sauvegardes\2026-10-24-avant-phase-1\` et celle de l'étape 1. | Claude |

**Après un retour en arrière**, la progression déjà envoyée au serveur reste dans la base D1 ; les apprenants retrouvent
la copie de leur téléphone comme avant. Rien n'est perdu, et on peut remettre la phase 1 en ligne plus tard.
