# « Mes ressources » et charte de l'apprenant : mise en ligne et retour en arrière

> **Aucune étape technique pour vous** : Claude fait les étapes ci-dessous **après votre accord explicite**.
> Rien à installer : le secret des liens de téléchargement (`DL_SECRET`) est déjà en production depuis le 30/10/2026.
> Ne collez jamais une clé ou un mot de passe dans la conversation.

## Ce qui change

| Où | Changement |
|---|---|
| Espace apprenant | Entrée **« Mes ressources »** sous « Mes notes » + page des ressources ; **fenêtre de la charte** à la 1re connexion et à chaque nouvelle version. Le reste de l'écran est identique (preuve au pixel : 50/50 et 34/34 blocs). |
| Worker apprenant | Routes `/api/ressource`, `/api/charte-accept`, `/r/…` (téléchargement avec le nom de l'apprenant). Leçons, exercices, quiz et ressources refusés tant que la charte n'est pas acceptée. |
| Administration | Onglet **📂 Ressources** (ressources + liste des acceptations de la charte) ; ligne « Charte acceptée le … » dans la fiche. |
| Base D1 | 2 nouvelles tables : `ressources`, `chartes` (rien d'ancien n'est modifié). |
| Stockage R2 | Fichiers sous `ressources/…` dans le bucket privé `geoexpert-fichiers` (≈ 15 Mo). |
| Site | Nouvelle page `charte-apprenant.html` ; ligne « En vous inscrivant, vous acceptez… » sous les 11 boutons « Je m'inscris » ; politique de confidentialité (§2.3, §3, §4, date) ; `sitemap.xml`. |

**Apprenants actuels** : ils gardent leur accès, leurs dates et leur progression. À leur prochaine connexion, la charte leur
est présentée ; une fois acceptée, tout fonctionne comme avant. (En production, le seul accès actif est votre code de test « test 1 ».)

## Étapes (dans cet ordre)

La page du site est publiée **avant** le Worker : la nouvelle page fonctionne avec l'ancien Worker (elle n'affiche alors ni
« Mes ressources » ni la charte), alors que l'ancienne page ne saurait pas faire accepter la charte au nouveau Worker.

| # | Étape | Commande / contrôle |
|---|---|---|
| 1 | Sauvegarde de la production (KV + D1 + code) | `node sauvegarde-prod.mjs C:\Users\HP\Documents\GeoExpert-Sauvegardes\<date>-avant-mise-en-ligne-ressources` |
| 2 | Tables dans la base de production | `npx wrangler d1 execute geoexpert-prod --remote --file worker/schema.sql -c worker/wrangler-prod.toml` (tout est en `CREATE … IF NOT EXISTS`) |
| 3 | Ressources de départ (livret, kit, guide, 6 cours ; Webmapping, KoboToolbox et Projet final **retenus**) | `node ressources-initiales.mjs prod` |
| 4 | Publication du site | fusion de la branche `ressources-charte` dans `main`, puis `git push` (GitHub Pages, 1 à 10 min) ; contrôle : `charte-apprenant.html` en ligne |
| 5 | Worker d'administration | `npx wrangler deploy -c worker/wrangler-admin-prod.toml` |
| 6 | Worker des apprenants | `npx wrangler deploy -c worker/wrangler-prod.toml` |
| 7 | Vérifications en production | `node verif-prod-ressources.mjs` (2 codes temporaires, supprimés à la fin) + faux webhook refusé, « Vérifier un certificat » OK, admin derrière Access |
| 8 | 👤 Votre essai | Connectez-vous avec votre code « test 1 » : la charte s'affiche, acceptez-la, ouvrez « Mes ressources ». Dans l'admin : onglet 📂 Ressources, puis votre fiche. |

Versions **avant** la mise en ligne (pour le retour en arrière) :
`espace-apprenant-api` = **7047243d** · `geoexpert-admin` = **2b141a29** · `main` = **8f0e5b0** (étiquette git `sauvegarde-avant-ressources-charte`).

## Retour en arrière

| Problème | Que faire |
|---|---|
| Problème côté apprenant (charte bloquante, téléchargement…) | `npx wrangler rollback 7047243d -c worker/wrangler-prod.toml` → l'ancien Worker revient tout de suite ; la nouvelle page continue de fonctionner (sans « Mes ressources » ni charte). |
| Problème dans l'administration | `npx wrangler rollback 2b141a29 -c worker/wrangler-admin-prod.toml` |
| Revenir à l'ancien site | `git revert -m 1 <commit de fusion>` sur `main`, puis `git push` |
| Effacer les données ajoutées (facultatif) | `DROP TABLE ressources; DROP TABLE chartes;` dans `geoexpert-prod` + suppression des objets `ressources/…` du bucket. Inutile en temps normal : l'ancien Worker les ignore. |

Les acceptations de la charte déjà enregistrées ne gênent pas un retour en arrière ; si le nouveau Worker revient plus tard,
les apprenants qui l'avaient acceptée n'auront pas à la refaire.

## Après la mise en ligne

- La tâche « joindre les 6 cours PDF à la leçon Introduction » (onglet 📚 Contenu) **n'est plus à faire** : les cours sont dans « Mes ressources ».
- Quand Webmapping, KoboToolbox ou le Projet final seront prêts : onglet 📂 Ressources → la ressource → **Remplacer le fichier** (nouveau PDF),
  puis cocher **Visible par les apprenants** → **Enregistrer les réglages**.
