# Phase B (partage d'attestation, portfolio, parrainage, avis publiés) : mise en ligne et retour en arrière

> **Aucune étape technique pour vous** : Claude fait les étapes ci-dessous **après votre accord explicite**.
> Rien à installer, aucun service payant, aucun nouveau secret (les cartes vont dans le stockage R2 privé déjà en place, sous 10 Go).

## Ce qui change

| Où | Changement |
|---|---|
| Espace apprenant | Entrées **« Mon portfolio »** et **« Mes parrainages »** (sous « Communauté ») ; carte « Vous avez été parrainé ? » en bas du tableau de bord pendant les 7 premiers jours ; boutons **Partager : LinkedIn, Facebook, WhatsApp, Copier le lien** sous chaque attestation ; champ « profession » et nouvelle case d'accord dans « Votre avis ». Le reste est identique (preuve au pixel). |
| Site | Nouvelle page **realisations-apprenants.html** ; sur la page des formations vidéo : avis publiés sous les témoignages + lien « Voir les cartes réalisées par nos apprenants » + bandeau quand on arrive par un lien de parrainage ; aperçu (Open Graph) sur « Vérifier un certificat » ; politique de confidentialité (§2.3, §3, §4) ; `sitemap.xml`. |
| Worker apprenant | Routes publiques `/a/<numéro>` (aperçu de partage), `/api/avis-publics`, `/api/realisations`, `/pub/…` (cartes validées ET autorisées) ; routes apprenant `/api/portfolio*`, `/api/avis-accord`, `/api/parrainage`, `/api/parrain-saisir` ; envoi `/pfu/…` et lecture `/pfv/…` par liens signés. |
| Administration | Onglets **🗺️ Portfolio** et **🤝 Parrainage** ; « Publier sur le site » / « Retirer du site » pour les avis. |
| Base D1 | 4 nouvelles tables : `avis_info`, `portfolio`, `parrains`, `filleuls` (rien d'ancien n'est modifié). |

La nouvelle page fonctionne avec l'ancien Worker (elle n'affiche alors rien de nouveau) ; l'ancienne page fonctionne avec le nouveau Worker.

## Étapes (dans cet ordre : le site AVANT le Worker)

| # | Étape | Commande / contrôle |
|---|---|---|
| 1 | Sauvegarde de la production (KV + D1 + code) | `node sauvegarde-prod.mjs C:\Users\HP\Documents\GeoExpert-Sauvegardes\<date>-avant-mise-en-ligne-phase-b` |
| 2 | Tables dans la base de production | `npx wrangler d1 execute geoexpert-prod --remote --file worker/schema.sql -c worker/wrangler-prod.toml` (tout est en `CREATE … IF NOT EXISTS`) |
| 3 | Publication du site | fusion de la branche `phase-b` dans `main`, puis `git push` (GitHub Pages, 1 à 10 min) |
| 4 | Worker d'administration | `npx wrangler deploy -c worker/wrangler-admin-prod.toml` |
| 5 | Worker des apprenants | `npx wrangler deploy -c worker/wrangler-prod.toml` |
| 6 | Vérifications | faux code 401, page apprenant 200, admin renvoyé vers Access, « Vérifier un certificat » OK, `/api/realisations` et `/api/avis-publics` vides, `/a/ATT-XXXX-XXXX` renvoie l'aperçu général |
| 7 | 👤 Votre essai | avec « test 1 » : déposez une carte dans « Mon portfolio » (case d'accord cochée), validez-la dans l'onglet 🗺️, regardez la page « Réalisations des apprenants », puis décochez l'accord : elle disparaît (quelques minutes). Ouvrez « Mes parrainages ». Supprimez ensuite la carte de test. |

Versions **avant** la mise en ligne : `espace-apprenant-api` = **1315f264** · `geoexpert-admin` = **b669dc8d** · `main` = **b3b6e1a**
(étiquette git `sauvegarde-avant-phase-b`, sauvegarde `GeoExpert-Sauvegardes\2026-10-31-avant-phase-b\`).

## Retour en arrière

1. `npx wrangler rollback 1315f264 -c worker/wrangler-prod.toml` et `npx wrangler rollback b669dc8d -c worker/wrangler-admin-prod.toml`
2. Site : `git revert` de la fusion sur `main`, puis `git push`.
3. Les 4 nouvelles tables peuvent rester (elles ne gênent pas l'ancienne version). Une récompense de parrainage déjà accordée
   (formation ajoutée, mois d'assistance) reste acquise au parrain.

## Points à savoir

- **DigitalPaye ne transmet pas le code de parrainage** (le webhook ne contient que la référence, le statut et le montant) :
  le filleul saisit donc le code à sa première connexion. S'il est arrivé par le lien de parrainage sur le même téléphone,
  le code est déjà rempli.
- L'aperçu LinkedIn / Facebook / WhatsApp d'une attestation est servi par le Worker (adresse `espace-apprenant-api.geographe07.workers.dev/a/…`),
  car le site (GitHub Pages) ne peut pas fabriquer une page par attestation. La personne qui clique arrive sur « Vérifier un certificat ».
- Les retraits (accord décoché, carte supprimée, avis retiré) sont immédiats côté serveur ; le site peut garder l'ancienne liste en mémoire 5 minutes au plus.
