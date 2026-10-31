# Phase C (Aide et « Et après ? ») + lives sur Teams et charte 1.1 : mise en ligne et retour en arrière

> **Aucune étape technique pour vous** : Claude fait les étapes ci-dessous **après votre accord explicite**.
> Rien à installer, aucun service payant, aucun nouveau secret, **aucune nouvelle table** (réglages dans la table `reglages` déjà en ligne).

## Ce qui change

| Où | Changement |
|---|---|
| Espace apprenant | Entrée **« Aide »** en bas de la colonne de gauche (questions en accordéon, recherche, bouton WhatsApp prérempli) ; carte **« ➡️ Et après ? »** sur le tableau de bord quand une formation est terminée. Le reste est identique (preuve au pixel). |
| Worker apprenant | `/api/login` renvoie aussi `apres` (propositions calculées par le serveur) ; nouvelle route `/api/aide`. |
| Administration | Onglet **❔ Aide & « Et après ? »** ; routes `/admin/aide`, `/admin/faq`, `/admin/apres`. |
| Lives sur Teams + charte 1.1 (préparés par la session « Phase A », publication avec la phase C décidée par l'administrateur) | Lien des lives : Microsoft Teams accepté (`teams.microsoft.com`, `teams.live.com`), Google Meet toujours accepté ; textes « Teams » dans l'onglet 🎥 ; charte **version 1.1** (1 phrase en plus dans la section 7, `charte-apprenant.html` refaite) → **chaque apprenant la réaccepte une fois** à sa prochaine connexion ; politique de confidentialité : 1 paragraphe en fin de §2.3 (WhatsApp et Teams, services tiers). |
| Base D1 | Rien de nouveau : 2 réglages `faq` et `apres` créés seulement quand vous enregistrez (sinon contenu de départ). |

La nouvelle page fonctionne avec l'ancien Worker (elle affiche « Aide » mais la liste ne charge pas : d'où l'ordre ci-dessous, Worker puis site) ;
l'ancienne page fonctionne avec le nouveau Worker.

## Étapes (dans cet ordre)

| # | Étape | Commande / contrôle |
|---|---|---|
| 1 | Sauvegarde de la production (KV + D1 + code) | `node sauvegarde-prod.mjs C:\Users\HP\Documents\GeoExpert-Sauvegardes\<date>-avant-mise-en-ligne-phase-c` |
| 2 | Worker des apprenants | `npx wrangler deploy -c worker/wrangler-prod.toml` |
| 3 | Worker d'administration | `npx wrangler deploy -c worker/wrangler-admin-prod.toml` |
| 4 | Publication du site | fusion de la branche `phase-c` dans `main`, puis `git push` (GitHub Pages, 1 à 10 min) |
| 5 | Vérifications | faux code 401, page apprenant 200, admin renvoyé vers Access, « Vérifier un certificat » OK, `/api/aide` avec un faux code → 401 |
| 6 | 👤 Votre essai | avec « test 1 » : acceptez la charte 1.1 (la fenêtre s'affiche une fois), ouvrez « Aide », cherchez « code », touchez le bouton WhatsApp (message prérempli). Dans l'admin, onglet ❔ : relisez les 7 questions. |

Versions **avant** la mise en ligne : `espace-apprenant-api` = **33abc68e** · `geoexpert-admin` = **228e930d** · `main` = **48e5aa7**
(étiquettes git `sauvegarde-avant-phase-c` et `sauvegarde-avant-live-teams`, sauvegardes `GeoExpert-Sauvegardes\2026-10-31-avant-phase-c\` et `GeoExpert-Sauvegardes\2026-10-31-avant-live-teams\`).

## Retour en arrière

1. `npx wrangler rollback 33abc68e -c worker/wrangler-prod.toml` et `npx wrangler rollback 228e930d -c worker/wrangler-admin-prod.toml`
2. Site : `git revert` de la fusion sur `main`, puis `git push`.
3. Les réglages `faq` et `apres` peuvent rester (l'ancienne version ne les lit pas). Les acceptations de la charte 1.1 restent enregistrées ; avec l'ancienne version (1.0), les apprenants qui n'avaient accepté que la 1.1 la verront une fois de plus.

## Points à savoir

- Une offre spéciale utilise un **nouveau** lien DigitalPaye : ces paiements arrivent en « À vérifier » (le Worker ne connaît que les liens au prix normal).
- « Formation terminée » = toutes les leçons visibles cochées. Pendant l'essai, les leçons bloquées comptent : la carte n'apparaît qu'après.
