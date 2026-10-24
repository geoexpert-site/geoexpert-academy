# Plan d'amélioration de la plateforme GeoExpert Academy

> **À lire au début de chaque session.** Ce fichier dit exactement où on en est.
> Légende : `[ ]` à faire · `[~]` en cours · `[x]` fait et testé · **(en ligne)** = visible par les apprenants.

## Règles validées (rappel)

- **Règle n° 1 :** on ajoute, on ne change pas l'existant (page de connexion, barre du haut, colonne de gauche, bandeau de bienvenue, cartes de chiffres, « Vos modules » : identiques).
- On travaille sur l'environnement de test, jamais directement sur la version des apprenants.
- Sauvegarde complète (code + données) avant chaque phase.
- Captures avant / après (téléphone + ordinateur) à la fin de chaque phase.
- Les fiches actuelles restent dans KV (`ACCESS`) sans changement. Les nouvelles données vont dans une base D1.

## Décisions prises (24 octobre 2026)

1. **Annonces :** affichées dans la nouvelle bande sous le bandeau de bienvenue (avec le message du jour), pas au-dessus.
2. **Attestation :** la carte actuelle ne change pas ; une nouvelle carte « Mon attestation » apparaît quand l'attestation est disponible, après validation de l'exercice final par le formateur dans l'admin.
3. **Phrase du bas du tableau de bord :** « enregistrées sur cet appareil » devient « sauvegardées sur votre compte » (seul texte existant modifié), au moment où la synchronisation est en ligne.
4. **Nettoyage :** suppression de l'ancien `worker.js` à la racine et de l'ancienne page `acces-vprhjahnzhi4r961t6y0.html`.

## Phase 1 — Fondations et suivi (≈ 20 h)

- [x] Environnement de test (Worker + KV + D1 de test) et sauvegarde du code et des données
- [x] Captures « avant » de référence (`C:\Users\HP\Documents\GitHub\geoexpert-captures\avant-phase-1\`)
- [x] Progression et notes enregistrées sur le serveur (fusion automatique de ce qui est sur le téléphone, sans perte) — testé (18/18 + compatibilité), **pas encore en ligne**
  - Worker : `/api/login` renvoie `progress`, nouvelle route `/api/sync` · tables D1 dans `worker/schema.sql`
  - Page : file d'attente hors connexion, fusion à la 1re connexion, textes « sur votre compte » (phrase du bas + aide du champ de notes)
  - Compatible dans les deux sens : nouvelle page + ancien Worker = fonctionnement d'avant ; ancienne page + nouveau Worker = OK
  - Tests : `GeoExpert-Outils\test-synchro.mjs`, `test-compat.mjs` · captures + différences : `geoexpert-captures\apres-sauvegarde-progression\`
- [~] Sécurité admin : Cloudflare Access + vérification dans le Worker + limite de tentatives
  - [x] Worker d'administration séparé (`ROLE = "admin"`, config `worker/wrangler-admin-test.toml`) qui sert la page `worker/admin.html`
  - [x] Vérification du jeton Access dans le Worker (signature, audience, émetteur, expiration, e-mail autorisé) — refus testé
  - [x] Limite : 5 mots de passe faux / 15 min → blocage 15 min (table `admin_fails`) — testé
  - [x] Worker apprenant de test en `ROLE = "apprenant"` : plus aucune route admin — testé
  - [ ] **Attente administrateur :** activer Access sur `geoexpert-admin-test` (GUIDE-ADMIN.md §1) et envoyer POLICY_AUD + team domain, puis test réel e-mail + code
- [x] Journal d'activité (créations, déblocages, désactivations, prolongations, modules, vidéos, fichiers, mots de passe faux) — onglet « Journal », testé (9/9 + 3/3)
- [ ] Tableau de bord admin (actifs, nouveaux, en essai, inactifs > 7 j, progression moyenne, formations les plus suivies)
- [ ] Fiche de chaque apprenant + notes privées de suivi
- [ ] Actions en un clic avec confirmation (module par liste, prolonger, désactiver, remplacer un code perdu en gardant la progression)
- [ ] Relances WhatsApp (J1, J5, inactif 7 j, fin de formation) + liste « À relancer aujourd'hui » + suivi de l'essai (« Suivi fait »)
- [ ] Apprenant : message du jour sous le bandeau + carte « Essai et assistance » sous les cartes de chiffres
- [ ] Export CSV des apprenants
- [ ] Liste admin : plus de limite à 500 apprenants
- [ ] Nettoyage (décision 4)
- [ ] Captures avant / après, guide admin, liste des tests, étapes de mise en ligne et de retour en arrière

## Phase 2 — Régularité (≈ 14 h)

- [ ] Objectif de la semaine + jauge
- [ ] Série de semaines actives
- [ ] Badges liés à de vraies étapes (section « Mes progrès » sous « Vos modules »)
- [ ] Annonces du formateur (écriture dans l'admin, affichage côté apprenant)
- [ ] Entrée « Mes notes » dans la colonne de gauche
- [ ] Case « J'ai fait l'exercice » (visible dans la fiche apprenant)
- [ ] Mini-quiz modifiables depuis l'admin (onglet « Quiz » sur la page de leçon)
- [ ] Mode économie de données (à vérifier avec le lecteur Bunny)

## Phase 3 — Fin de parcours et contenu (≈ 16 h)

- [ ] Attestation PDF avec code unique + page publique « Vérifier un certificat »
- [ ] Avis de fin de formation + choix des avis publiables dans l'admin
- [ ] Gestion du contenu sans coder (ajouter, renommer, réordonner, masquer, fichiers par leçon)

## Environnement de test et sauvegardes (où se trouve quoi)

- **Branche de travail :** `phase-1` (le site en ligne = branche `main`, non touchée).
- **Worker de test :** `espace-apprenant-api-test` → https://espace-apprenant-api-test.geographe07.workers.dev
  - configuration : `worker/wrangler-test.toml` · KV de test `ACCESS_GEOEXPERT_TEST` · base D1 `geoexpert-test`
  - accepte seulement les pages servies en local (http://localhost:5501).
- **Worker des apprenants (production) :** `espace-apprenant-api`, KV `ACCESS_GEOEXPERT` — non touché.
- **Outils (hors du site) :** `C:\Users\HP\Documents\GeoExpert-Outils\`
  - `serveur-test.mjs` : sert le site en local en le branchant sur le Worker de test (aucun fichier modifié)
  - `captures.mjs` : captures connexion + tableau de bord (ordinateur / téléphone, clair / sombre)
  - `codes-apprenants-TEST.txt`, `mot-de-passe-admin-TEST.txt` : valeurs de test uniquement
- **Sauvegarde avant phase 1 :** `C:\Users\HP\Documents\GeoExpert-Sauvegardes\2026-10-24-avant-phase-1\`
  (code en zip + données KV : `cfg`, `f_arc1-e1`, `s_DM6JMZDCVCBU`) · étiquette git `sauvegarde-avant-phase-1`.

## Points à suivre

- **Le dépôt GitHub est public** : l'adresse « cachée » de l'ancienne page admin y est visible par tous, et la version
  actuelle n'a pas de limite de tentatives. → Mettre en ligne la partie sécurité dès qu'Access est validé.
  Tout ce qui est poussé sur `main` est public (aucun secret dans les fichiers : mots de passe et clés restent dans Cloudflare).
- **Liste admin et KV :** un nouveau code met jusqu'à 60 s à apparaître dans « Apprenants » (comportement de KV, déjà présent
  avant). À corriger avec le tableau de bord (index des apprenants dans D1).
- **Déploiement :** le Worker utilise maintenant `admin.html` (importé) → toujours déployer avec wrangler, plus par copier-coller
  dans le tableau de bord Cloudflare.

- **Exercice 2 ArcGIS (arc1-e2)** : marqué « En ligne » dans l'admin, mais le fichier est absent du stockage. À renvoyer depuis l'onglet Fichiers.
- Clé Bunny de test (`BUNNY_TOKEN_KEY`) à installer par l'administrateur pour lire les vidéos en test.

- Durées du chapitre 2 d'ArcGIS identiques au chapitre 1 (à corriger quand la gestion du contenu existe).
- Politique de confidentialité : ajouter la sauvegarde de la progression et des notes sur le serveur (à rédiger en fin de phase 1).

## Journal des sessions

### 24 octobre 2026 — Session 1
- Analyse de l'existant, comparaison avec les grandes plateformes, plan validé.
- Début de la phase 1 : sauvegarde du code et des données, Worker + KV + D1 de test créés, copie des données
  + 3 apprenants de test (essai neuf, accès complet, essai au jour 5), captures « avant » prises.
- Progression et notes sur le serveur : fait et testé sur l'environnement de test.
- **Mise en ligne prévue en fin de phase 1** (ordre : créer la base D1 de production + tables, la relier au Worker
  `espace-apprenant-api` sous le nom `DB`, déployer le Worker, puis publier la page).
- Sécurité admin et journal : faits et testés en test (Worker admin séparé `geoexpert-admin-test`).
  Ancienne page `admin-b7x…html` gardée jusqu'à la mise en ligne, puis remplacée par un renvoi vers la nouvelle adresse.
- **Prochaine étape :** finir Access avec l'administrateur, puis tableau de bord admin et fiche apprenant.
