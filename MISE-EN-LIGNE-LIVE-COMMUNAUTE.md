# Rendez-vous live, Communauté et vitesse de lecture : mise en ligne et retour en arrière

> **Aucune étape technique pour vous** : Claude fait les étapes ci-dessous **après votre accord explicite**.
> Rien à installer, aucun service payant, aucun nouveau secret.

## Ce qui change

| Où | Changement |
|---|---|
| Espace apprenant | Entrées **« Rendez-vous live »** et **« Communauté »** (sous « Mes ressources ») ; petite bande « Prochain live » sous le message du jour, la semaine du live ; replays aussi dans « Mes ressources » ; choix **Vitesse de lecture** (0,75x à 2x) sous chaque vidéo. Le reste est identique (preuve au pixel : 54/54 et 34/34 blocs). |
| Worker apprenant | Routes `/api/live-link` (lien Meet, 30 min avant, apprenants concernés seulement), `/api/live-replay`, `/api/communaute`. |
| Administration | Onglet **🎥 Lives & communauté**. |
| Base D1 | 2 nouvelles tables : `lives`, `reglages` (rien d'ancien n'est modifié). |

La nouvelle page fonctionne avec l'ancien Worker (elle n'affiche alors rien de nouveau, sauf la vitesse) ; l'ancienne page fonctionne avec le nouveau Worker.

## Étapes (dans cet ordre)

| # | Étape | Commande / contrôle |
|---|---|---|
| 1 | Sauvegarde de la production (KV + D1 + code) | `node sauvegarde-prod.mjs C:\Users\HP\Documents\GeoExpert-Sauvegardes\<date>-avant-mise-en-ligne-live` |
| 2 | Tables dans la base de production | `npx wrangler d1 execute geoexpert-prod --remote --file worker/schema.sql -c worker/wrangler-prod.toml` (tout est en `CREATE … IF NOT EXISTS`) |
| 3 | Publication du site | fusion de la branche `live-communaute` dans `main`, puis `git push` (GitHub Pages, 1 à 10 min) |
| 4 | Worker d'administration | `npx wrangler deploy -c worker/wrangler-admin-prod.toml` |
| 5 | Worker des apprenants | `npx wrangler deploy -c worker/wrangler-prod.toml` |
| 6 | Vérifications | faux code refusé (401), page apprenant 200, admin renvoyé vers Access, « Vérifier un certificat » OK |
| 7 | 👤 Votre essai | onglet 🎥 : programmez un live de test dans 20 min et collez le lien de la Communauté ; avec votre code « test 1 » : bande du live, « Rejoindre », « Ajouter à mon agenda », Communauté, vitesse sur une vraie vidéo Bunny. Annulez ensuite le live de test. |

Versions **avant** la mise en ligne : `espace-apprenant-api` = **239fbeb4** · `geoexpert-admin` = **ebbdc3a5** · `main` = **1bffa1b**
(étiquette git `sauvegarde-avant-live-communaute`, sauvegarde `GeoExpert-Sauvegardes\2026-10-31-avant-live-communaute\`).

## Retour en arrière

1. `npx wrangler rollback 239fbeb4 -c worker/wrangler-prod.toml` et `npx wrangler rollback ebbdc3a5 -c worker/wrangler-admin-prod.toml`
2. Site : `git revert` de la fusion sur `main`, puis `git push`.
3. Les tables `lives` et `reglages` peuvent rester (elles ne gênent pas l'ancienne version).
