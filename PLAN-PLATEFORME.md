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
  - [x] Access activé sur `geoexpert-admin-test` (équipe `gentle-haze-1336.cloudflareaccess.com`) ; sans connexion : renvoi vers la page de connexion Cloudflare (testé 3/3) ; Worker apprenant non touché
  - [x] Test réel par l'administrateur réussi (e-mail + code + mot de passe) ; son e-mail vérifié apparaît dans le Journal
- [x] Journal d'activité (créations, déblocages, désactivations, prolongations, modules, vidéos, fichiers, mots de passe faux) — onglet « Journal », testé (9/9 + 3/3)
- [x] Tableau de bord admin (actifs, nouveaux, en essai, inactifs > 7 j, jamais connectés, progression moyenne, formations les plus suivies) — premier onglet, testé 13/13 en local + non-régression en ligne, **pas encore en ligne**
  - `/admin/state` renvoie `stats` + pour chaque apprenant `done`, `lessons`, `lastActivity` (servira à la fiche apprenant)
  - index des codes dans D1 (table `codes`) : nouveaux codes visibles tout de suite ; liste KV complète (plus de limite à 500)
- [x] Fiche de chaque apprenant + notes privées de suivi — testé 19/19 en local + non-régression, **pas encore en ligne**
  - bouton « Fiche » dans Apprenants (fenêtre) + champ de recherche · routes `/admin/student`, `/admin/note`, `/admin/note-delete` · table `admin_notes`
  - « Exercices faits » viendra avec la case « J'ai fait l'exercice » (phase 2)
- [x] Actions en un clic avec confirmation (module par liste, prolonger 30 j / 3 / 6 / 12 mois, tout débloquer, désactiver / réactiver, remplacer un code perdu en gardant la progression) — testé 16/16 en local + non-régression, **pas encore en ligne**
  - section « Actions » de la fiche · route `/admin/replace` (déplace progression, notes, suivi ; ancien code désactivé et non réactivable)
  - confirmations ajoutées aux boutons existants de la liste ; « + Module » ouvre la fiche sur la liste (fin du `prompt`)
- [x] Relances WhatsApp (bienvenue J1, code pas utilisé, essai J5, inactif 7 j, fin de formation) + liste « À relancer aujourd'hui » + suivi de l'essai (« Suivi fait ») — testé 25/25 en local, **pas encore en ligne**
  - onglet « 📣 Relances » (2e) avec compteur, bandeau sur le tableau de bord, partie « WhatsApp et relances » dans la fiche
  - numéro WhatsApp facultatif (Nouvel accès + fiche), table `contacts` ; relances faites : table `relances` ; règles : `dueRelances()` dans le Worker
  - les numéros et relances suivent l'apprenant en cas de code remplacé
- [x] Apprenant : message du jour sous le bandeau + carte « Essai et assistance » sous les cartes de chiffres — testé 15/15 (6 situations, téléphone, sombre, ancien Worker), **pas encore en ligne**
  - message unique selon la situation : terminé / essai fini / absent ≥ 5 j / nouveau / jour X d'essai / presque fini / sinon prochaine leçon + astuce du jour
  - `/api/login` renvoie en plus `trialStart`, `assistanceEnd` (3 mois après le début), `prevVisit`
  - **preuve « existant inchangé »** : `GeoExpert-Outils\comparer-elements.mjs` compare la page originale (étiquette git) et la nouvelle,
    bloc par bloc ; nouveautés masquées → 34/34 blocs identiques au pixel (ordinateur + téléphone, clair + sombre).
    Résultats : `geoexpert-captures\preuve-existant-phase-1\`
- [x] Export CSV des apprenants (bouton dans Apprenants ; « ; » + UTF-8 pour Excel ; protection contre les formules ; noté au Journal) — testé 8/8
- [x] Liste admin : plus de limite à 500 apprenants (et plus d'attente de 60 s pour un nouveau code)
- [x] Nettoyage (décision 4) : `worker.js` (racine) et `acces-vprhjahnzhi4r961t6y0.html` supprimés ; `admin-b7x…html` remplacée
  par un renvoi vers https://geoexpert-admin.geographe07.workers.dev ; `.gitignore` pour `.wrangler/`
- [x] Politique de confidentialité mise à jour (§2.3 espace apprenant, §3 relances, §4 conservation, §5 sécurité ; date 25/10/2026)
- [x] Configuration de production prête (`worker/wrangler-prod.toml`, `worker/wrangler-admin-prod.toml`, vérifiées à blanc)
- [x] Livrables : `RAPPORT-PHASE-1.md` (tests, captures), `MISE-EN-LIGNE-PHASE-1.md` (étapes + retour en arrière), `GUIDE-ADMIN.md`
- [~] **Mise en ligne** — suivre `MISE-EN-LIGNE-PHASE-1.md` (accord donné le 25/10/2026)
  - [x] 1. Sauvegarde production : `GeoExpert-Sauvegardes\2026-10-25-avant-mise-en-ligne-phase-1\` (3 clés KV + code de `main` 9bbc348)
  - [x] 2. Base `geoexpert-prod` créée (id 50f98a67-8c17-4936-a4f7-20363bdf981a), 9 tables
  - [x] 3. Worker `geoexpert-admin` en ligne, verrouillé (403 partout tant qu'Access n'est pas configuré)
  - [x] 4. 👤 Access activé sur `geoexpert-admin` (POLICY_AUD dans `worker/wrangler-admin-prod.toml`)
  - [x] 5. 👤 Mot de passe admin installé (présence vérifiée, valeur jamais vue)
  - [x] 6. `geoexpert-admin` configuré avec Access ; sans e-mail → renvoi vers la connexion Cloudflare ; faux jeton refusé
  - [x] 7. 👤 Test de connexion par l'administrateur réussi
  - [x] 8. Worker `espace-apprenant-api` mis à jour (version 6ff55243 ; avant : 17015681) — l'ancienne page fonctionnait avec (5/5)
  - [x] 9. Site publié : commit cab2244 sur `main` (GitHub Pages). `_config.yml` : documents internes et `worker/` plus publiés
  - [x] 10. Vérifications en production avec un code de test : 7/7 (connexion, vidéo signée, verrou d'essai, sauvegarde,
        progression retrouvée sur un 2e appareil) ; code de test ensuite supprimé (données de production revenues à 3 clés)
  - **Phase 1 EN LIGNE le 25/10/2026 — VALIDÉE par l'administrateur le 25/10/2026**

## Phase 2 — Régularité (≈ 14 h)

- [x] Objectif de la semaine + jauge — section « Mes progrès » sous « Vos modules » ; 1, 2, 3, 5 ou 7 leçons ; semaine du lundi au dimanche (UTC) ; table `prefs`
- [x] Série de semaines actives — semaines d'affilée avec au moins une leçon datée ; la semaine en cours compte dès sa 1re leçon
- [x] Badges liés à de vraies étapes : 1re leçon, 1er chapitre, 1er exercice fait, 4 semaines d'affilée, formation terminée (date seulement si elle est sûre)
  - testés ensemble avec « Mes notes » et les exercices : 14/14 apprenant + 3/3 admin, **pas encore en ligne**
- [x] Annonces du formateur (écriture dans l'admin, affichage côté apprenant) — testé 10/10 admin + 6/6 apprenant, **pas encore en ligne**
  - onglet admin « 📢 Annonces » (3e) : texte + cible (toutes / une formation) + durée (7, 14, 30 j, sans fin) + aperçu ; retirer avec confirmation
  - apprenant : 3 annonces max., au-dessus du message du jour (décision 1), « × » pour masquer sur l'appareil · table `annonces`, `/api/login` → `annonces`
- [x] Entrée « Mes notes » dans la colonne de gauche (sous « Tableau de bord », avec le nombre de notes) → page listant toutes les notes
- [x] Case « J'ai fait l'exercice » (visible dans la fiche apprenant) — sous chaque exercice disponible ; table `exercises` ; fiche admin « Exercices faits X / Y » ; colonne dans l'export
- [x] **Preuve pixel phase 2** (`comparer-elements.mjs … cacher phase-2`) : 42/42 blocs identiques à la page en ligne (fin de phase 1) ;
  et 34/34 identiques à la page d'origine des vidéos publicitaires (tous les ajouts masqués) → `geoexpert-captures\preuve-existant-phase-2\`
- [x] Mini-quiz modifiables depuis l'admin (onglet « Quiz » sur la page de leçon) — 9/9 admin + 12/12 apprenant, **pas encore en ligne**
  - onglet admin « ❓ Quiz » (éditeur 1 à 5 questions, statistiques) ; tables `quizzes`, `quiz_results` ; routes `/api/quiz`, `/api/quiz-answer` (correction côté serveur)
- [x] Mode économie de données (à vérifier avec le lecteur Bunny) — case sous la vidéo, `levelCap=true` (Bunny n'a pas de réglage de qualité imposée) ; auto si connexion lente — 7/7
- [x] Fin de phase 2 : tous les tests relancés (voir `RAPPORT-PHASE-2.md`), captures `apres-phase-2-apprenant`, guide (§6 à §8),
  politique de confidentialité, `MISE-EN-LIGNE-PHASE-2.md` (sans étape technique pour l'administrateur)
- [x] **Mise en ligne de la phase 2 — EN LIGNE le 25/10/2026** (accord de l'administrateur donné)
  - sauvegarde : `GeoExpert-Sauvegardes\2026-10-25-avant-mise-en-ligne-phase-2\` ; tables ajoutées dans `geoexpert-prod` (14 tables)
  - `geoexpert-admin` → version 26e1e07e (avant : 02697476) ; `espace-apprenant-api` → version 7a610aab (avant : 6ff55243)
  - site publié : `main` = 62f6315 ; ancienne page + nouveau Worker vérifiée avant publication (connexion, vidéo, verrou d'essai)
  - production vérifiée avec un code de test : 8/8 (Mes progrès, objectif, vidéo signée + économie de données, exercice,
    Mes notes, enregistrement serveur, 2e appareil) ; code de test ensuite supprimé (production revenue à 3 clés)
  - **Phase 2 VALIDÉE par l'administrateur le 25/10/2026**
- [x] Suppression des données d'un apprenant (bouton dans la fiche + liste des accès terminés depuis 12 mois), pour respecter la politique de confidentialité — testé 11/11, **pas encore en ligne**
  - fiche → « Supprimer définitivement ses données » (taper SUPPRIMER) ; efface aussi les anciens codes remplacés ; journal gardé sans le nom · route `/admin/purge`
  - rappel en haut de « Apprenants » + note du tableau de bord quand un accès est fini depuis plus de 12 mois

## Phase 3 — Fin de parcours et contenu (≈ 16 h)

- [x] Attestation PDF avec code unique + page publique « Vérifier un certificat » — 16/16 admin + 16/16 apprenant/vérification, **pas encore en ligne**
  - délivrée par l'admin dans la fiche (décision 2 : après validation de l'exercice final ; nom complet modifiable) ; numéro `ATT-XXXX-XXXX` ; révocable
  - apprenant : carte « 🎓 Mon attestation » APRÈS les 2 cartes existantes ; PDF A4 paysage fait sur l'appareil (jsPDF + QR, chargés à la demande avec SRI), 68 Ko
  - `verifier-certificat.html` (en-tête et pied du site) + route publique `GET /api/certificat?id=` ; lien ajouté dans la FAQ ; tables `certificates`
- [x] Avis de fin de formation + choix des avis publiables dans l'admin — carte « Votre avis » (étoiles, commentaire, accord de publication) ;
  onglet admin « 🎓 Attestations & avis » : publiable seulement avec accord, Copier, Masquer ; table `reviews`
- [x] Gestion du contenu sans coder (ajouter, renommer, réordonner, masquer, fichiers par leçon) — 18/18 admin + 7/7 apprenant, **pas encore en ligne**
  - onglet « 📚 Contenu » ; table `content` (liste de leçons par formation, le code reste la référence ; « Revenir au contenu d'origine »)
  - clés de leçon jamais réutilisées (`maxNum`) ; leçons masquées : progression gardée, exclues des comptes ; essai = 3 premières leçons visibles
  - fichiers par leçon (`<leçon>-fN`), vrai nom/extension gardés ; catalogue mis en cache 30 s dans le Worker
  - **corrigé au passage (bug déjà en ligne)** : les téléchargements arrivaient tous en « Exercice_GeoExpert.pdf » (en-tête non exposé) → vrai nom + extension
- [x] Fin de phase 3 : guide (§7 bis, §7 ter, §8), politique de confidentialité, `MISE-EN-LIGNE-PHASE-3.md`, `RAPPORT-PHASE-3.md`
- [x] **Mise en ligne de la phase 3 — EN LIGNE le 25/10/2026** (accord de l'administrateur donné)
  - sauvegarde : `GeoExpert-Sauvegardes\2026-10-25-avant-mise-en-ligne-phase-3\` ; tables `content`, `certificates`, `reviews` ajoutées en production
  - `geoexpert-admin` → e6713b5d (avant : 26e1e07e) ; `espace-apprenant-api` → 76f93681 (avant : 7a610aab) ; `main` = fd06f46
  - ancienne page + nouveau Worker vérifiée avant publication : 8/8
  - production vérifiée : 6/6 (carte attestation + PDF réel, avis, page « Vérifier un certificat » en ligne) + téléchargement réel
    « Exercice_pratique_1.pdf » avec son vrai nom ; code de test, attestation et avis de test supprimés (production propre)
  - **Phase 3 VALIDÉE par l'administrateur le 25/10/2026 — le plan des 3 phases est terminé.**

## Paiements automatiques DigitalPaye (demande du 25/10/2026)

Objectif : chaque paiement réussi arrive seul dans l'admin ; un bouton crée le code et ouvre WhatsApp avec le message prêt.
Le parcours du client ne change pas. Détails, test Sandbox, mise en ligne et retour en arrière : `MISE-EN-LIGNE-PAIEMENTS.md`.

- [x] Étape 1 : documentation DigitalPaye lue (https://digitalpaye.gitbook.io/docs ; docs.digitalpaye.com répond 403)
  - webhooks signés HMAC-SHA256 (`X-DigitalPaye-Signature: sha256=…`), événements `transaction.successful` / `failed`…, 5 renvois max.
  - API : `POST /v1/auth/token` (Basic clé:secret, jeton 10 min) puis `GET /v1/collect/:reference`
  - **Le lien payé est connu** : métadonnée `payment_link_token` (vu dans le détail d'une vraie transaction, ex. `rxlgDDoMiBCu` = Google Earth)
  - Sandbox : sélecteur SANDBOX/PRODUCTION du tableau de bord ; numéros 0700000000 (réussi), 0700000001 (échoué)
- [x] Sauvegarde `GeoExpert-Sauvegardes\2026-10-25-avant-paiements\` (4 clés KV + D1 prod + D1 test + code) ; étiquette `sauvegarde-avant-paiements` ; branche `paiements`
  - nouvel outil : `GeoExpert-Outils\sauvegarde-prod.mjs <dossier>`
- [x] Worker : route `/webhook/digitalpaye` (Worker apprenant seulement ; en local aussi pour les tests) — `webhookDigitalPaye()`
  - signature vérifiée → confirmation par l'API (seule sa réponse fait foi) → `INSERT OR IGNORE` par référence
  - liens du site → produit : constante `LIENS` ; prix : `PRIX` ; montant plus faible / lien inconnu / devise → « À vérifier » (sans code)
  - Sandbox refusée sauf si `DP_SANDBOX = "oui"` (Worker de test) ; liens Sandbox : `DP_LIENS_TEST` (test seulement)
  - secrets : `DP_WEBHOOK_SECRET`, `DP_API_KEY`, `DP_API_SECRET` (installés par l'administrateur, jamais vus) ; `DP_API_URL` (tests locaux)
  - table `paiements` ; routes `/admin/paiements`, `/admin/paiement-code` (un code par paiement, même en double clic), `/admin/paiement-statut` (Ignorer)
  - création de code partagée avec « Nouvel accès » (`createAccess`, comportement identique) ; suppression des données et remplacement de code suivent le paiement
- [x] Admin : onglet « 💳 Paiements reçus » (2e) + bandeau « X code(s) à envoyer » sur le tableau de bord ; écrans existants inchangés
- [x] Tests locaux `test-paiements.mjs` : 49/49 (faux serveur DigitalPaye sur 127.0.0.1:8798) ; captures `avant-paiements` / `apres-paiements`
- [x] Worker de test déployé (`espace-apprenant-api-test` 49c8a92e, `geoexpert-admin-test` f60b065d) + table dans `geoexpert-test`
- [x] Guide (§2 bis), politique de confidentialité (§2.3, §3, §4 — sur la branche, pas encore publiée), `MISE-EN-LIGNE-PAIEMENTS.md`
- [x] Test Sandbox de bout en bout **réussi** (25/10/2026) : DP4B1DEA47 reçu (prénom, numéro, lien) → code Google Earth + message conforme ; échoué ignoré
  - l'API DigitalPaye a d'abord refusé les appels de Cloudflare (HTTP 520, même avec identifiants factices), puis a répondu ;
    le webhook ne contient que `data: { reference, status, amount, currency… }` → **mode de secours** : signature seule,
    formation par le montant si un seul prix, « Client à compléter » (nom + WhatsApp saisis dans l'admin). Tests : 66/66
  - secrets installés par l'administrateur via le panneau Terminal (Claude lance la commande, l'administrateur colle) : méthode à reprendre en production
  - Worker de test : `DP_LIENS_TEST` = `Ez59IkOJHAO1` → google ; versions `espace-apprenant-api-test` ada0776e, `geoexpert-admin-test` c559f972
  - ⚠️ l'admin de test a son propre mot de passe (`GeoExpert-Outils\mot-de-passe-admin-TEST.txt`) : bien le préciser
- [x] **Mise en ligne — EN SERVICE le 25/10/2026** (accord de l'administrateur donné)
  - sauvegarde : `GeoExpert-Sauvegardes\2026-10-25-avant-mise-en-ligne-paiements\` ; table `paiements` ajoutée dans `geoexpert-prod`
  - `geoexpert-admin` → d9240891 (avant : e6713b5d) ; `espace-apprenant-api` → 0c9d319f (avant : 76f93681)
  - clé DigitalPaye Production « Site GeoExpert » (sans « Retrait »), 3 secrets installés par l'administrateur via le Terminal (vérifiés par nom)
  - vérifié : connexion apprenant et certificats inchangés, admin protégé par Access, faux webhook refusé (401), « Envoyer un test » de DigitalPaye livré (200)
  - site publié (politique de confidentialité) : fusion de `paiements` dans `main`
  - à suivre : premier vrai paiement dans « Paiements reçus » ; réponse du support DigitalPaye (API parfois en 520 depuis Cloudflare)
- Points à suivre : date de déblocage du message = si le client se connecte le jour même ; un nouveau lien de paiement
  doit être ajouté à `LIENS` (sinon « À vérifier ») ; paiements ignorés sans code : pas encore de suppression automatique.

## Titres des leçons corrigés + quiz QGIS chapitre 1 (demande du 25/10/2026)

- [x] Fautes d'orthographe corrigées dans 86 titres de leçons (constante `CATALOG` de `worker/worker.js` ; la table `content`
  était vide en test et dans la dernière sauvegarde de production). Avant / après : `Downloads\titres-lecons-avant-apres.md`. Branche `corrections-titres-quiz`.
- [x] Quiz QGIS chapitre 1 relu et corrigé (ordre des réponses mélangé : 17 / 16 / 17 ; nuances sur les surfaces en degrés) :
  `Downloads\quiz-qgis-chapitre1-corrige.md` et `.json` (hors du dépôt public : les réponses ne doivent pas être publiées)
- [x] Workers de test déployés ; 50 questions chargées dans `geoexpert-test` (18 leçons, `qgis1-v02` à `qgis1-v19`) ; vérifié sur la page apprenant (3 / 3)
  - tests : tout réussi sauf `test-relances` « Code reçu aujourd'hui » (échoue aussi sans ces changements : test lancé en fin de soirée)
- [x] **Mise en ligne — EN LIGNE le 25/10/2026** (accord de l'administrateur donné)
  - sauvegarde : `GeoExpert-Sauvegardes\2026-10-25-avant-titres-quiz\` (KV + D1 + code de `main`) ; étiquette `sauvegarde-avant-titres-quiz`
  - production avant : `content` vide, aucun quiz → rien écrasé
  - `espace-apprenant-api` → a48b0dc5 (avant : fe27980e) ; `geoexpert-admin` → 55fe9c06 (avant : a1f554e9)
  - `geoexpert-prod` : 18 quiz, 50 questions (auteur « import quiz chapitre 1 »)
  - vérifié : faux code refusé (401), « Vérifier un certificat » OK, faux webhook refusé (401), admin renvoyé vers Access, page apprenant 200
  - retour en arrière : `wrangler rollback` vers les versions « avant » ci-dessus ; quiz : `DELETE FROM quizzes WHERE who = 'import quiz chapitre 1'`

## Cours PDF par formation vidéo (demande du 26/10/2026)

- [x] 9 documents rédigés (HTML) et générés en PDF A4 dans `ressources/cours/<clé>/` (qgis1, qgis2, arc1, arc2, tele, web, kobo, google, pack)
  - style commun : `ressources/cours/commun/` (cours.css, logo du site, fond de couverture en image) ; source : `ressources/Formation_Geomaticien_Operationnel_ (1).pdf`
  - générer un PDF : `node GeoExpert-Outils\cours-pdf.mjs <cours.html>` (2 passes, numéros du sommaire) ; aperçu : `apercu-pdf.mjs` ; liste des points : `python -I points-a-verifier.py ressources\cours`
- [x] Corrections du formateur : QGIS 1 et 2, ArcGIS 1 et 2, Télédétection et Google Earth terminés (0 point)
- [ ] En pause (décision du 30/10/2026, campagne centrée sur les modules 1, 2 et Télédétection) : Webmapping (5 points), KoboToolbox (2 points), Projet final du Pack (3 points) — voir `ressources/cours/POINTS-A-VERIFIER.md`
- ⚠️ `ressources/` n'est pas suivi par git et ne doit pas aller sur `main` (dépôt public) ; diffusion prévue par l'onglet Fichiers de l'admin
- « Document réservé à [Prénom Nom] » : texte neutre pour l'instant ; l'ajout du nom au téléchargement est une fonction à développer

## Gros fichiers privés sur Cloudflare R2 (demande du 26/10/2026)

Objectif : les apprenants téléchargent depuis leur espace des fichiers privés et volumineux (ex. vieux plan raster de 200 Mo,
plus tard données d'exercices et de projets finaux). Google Drive écarté (lien public oublié = fuite).
Décision de l'administrateur : R2 seulement pour ses propres données ; pas d'images satellites (gratuites à la source) ; rester sous 10 Go.

- [x] R2 activé par l'administrateur (carte demandée = vérification) + **alerte de budget 1 $** par e-mail (26/10/2026)
- [x] Buckets **privés** `geoexpert-fichiers-test` et `geoexpert-fichiers` (r2.dev désactivé, aucun domaine public — vérifié) ;
  binding `FICHIERS` dans les 4 configurations + `wrangler-local.toml` (R2 simulé)
- [x] Choix technique (limites du plan gratuit vérifiées : 10 ms de calcul, durée et taille de réponse non limitées,
  requêtes entrantes limitées à 100 Mo) : `/api/file` fait les mêmes vérifications qu'avant (code, formation, leçon visible,
  verrou d'essai) puis renvoie `{ url }` = lien signé HMAC (`DL_SECRET`) valable 30 min vers **le Worker** (`GET /dl/<fichier>/<exp>/<signature>`),
  qui lit R2 en streaming (reprise `Range` possible). Ni code d'accès dans l'adresse, ni clé S3. La page apprenant n'a pas changé :
  elle suivait déjà un `{ url }` → téléchargement natif du navigateur (pas de 200 Mo en mémoire sur le téléphone).
  - fichier R2 = entrée de leçon `{ k: <leçon>-fN, title, r2: <nom dans R2>, size }` dans la table `content` ; titre affiché avec la taille
  - secret `DL_SECRET` : valeur aléatoire installée par Claude (personne n'a besoin de la connaître) — **test seulement pour l'instant**
- [x] Admin, onglet 📚 Contenu : « 📦 Rattacher un gros fichier » sous chaque leçon + carte « Gros fichiers » (espace utilisé sur 10 Go,
  orange dès 8 Go, leçon de chaque fichier, « Aucune leçon » si inutilisé). Routes `/admin/r2`, `/admin/r2-attach` ; « Retirer » détache seulement
- [x] Dépôt par le tableau de bord Cloudflare ou wrangler (≤ 315 Mo) — guide §7 quater
- [x] Tests `GeoExpert-Outils\test-gros-fichiers.mjs` : admin local 17/17 ; apprenant en ligne 18/18 (refus sans code / faux code /
  autre formation, verrou d'essai, signature et date falsifiées refusées, **120 Mo téléchargés et identiques (SHA-256)**, reprise Range,
  bucket non public : r2.dev désactivé, aucun domaine, accès S3 sans clé refusé, téléchargement réel dans Edge). Ajoutés à `tous-les-tests.mjs`.
  Non-régression : `test-contenu.mjs admin` 18/18. (Réseau très instable le 26/10 : `local.mjs` réessaie maintenant sans `ping`.)
  Le fichier de test de 120 Mo reste dans `geoexpert-fichiers-test` (compte dans les 10 Go).
- [x] **Preuve pixel** (page apprenant non modifiée ; Worker de test avec R2) : 50/50 blocs identiques à la fin de phase 3
  (`cacher phase-3`) et 34/34 identiques à la page d'origine des vidéos publicitaires (`cacher`) → `geoexpert-captures\preuve-existant-gros-fichiers\` ;
  capture du fichier sous la leçon : `geoexpert-captures\apprenant-gros-fichier.png`, admin : `admin-gros-fichiers-*.png`
- [x] Workers de test déployés : `espace-apprenant-api-test` 7a759cc3, `geoexpert-admin-test` 8d4283b4
- [x] **Mise en ligne — EN LIGNE le 30/10/2026** (accord de l'administrateur donné)
  - sauvegarde : `GeoExpert-Sauvegardes\2026-10-30-avant-gros-fichiers\` (3 clés KV + D1 prod + code de `main` fbdc9b8)
  - `DL_SECRET` installé sur `espace-apprenant-api` (valeur aléatoire, autres secrets inchangés)
  - `geoexpert-admin` → 5730f4aa (avant : 55fe9c06) ; `espace-apprenant-api` → 86229fd8 (avant : a48b0dc5) ; site non republié (page inchangée)
  - production vérifiée : `GeoExpert-Outils\verif-prod-gros-fichiers.mjs` 14/14 (refus sans code / faux code, verrou d'essai, lien signé,
    lien falsifié refusé, fichier identique, bucket privé, téléchargement réel depuis geoexpertacademy.ci, admin derrière Access) ;
    + faux webhook 401, « Vérifier un certificat » OK. Code de test, fichier de test et ligne `content` supprimés (production revenue à 3 clés KV, `content` vide)
  - retour en arrière : `wrangler rollback` vers les versions « avant » ci-dessus (les gros fichiers rattachés disparaîtraient alors de la page)
  - code enregistré dans git sur `main` (commit « Gros fichiers privés sur Cloudflare R2 », 30/10/2026)

## Titres et durées des leçons Google Earth (demande du 30/10/2026)

- [x] Formation Google Earth : les 8 titres « VIDÉO 8. ... partie N » remplacés par les titres des leçons Google Earth des chapitres 1 (contenu identique)
- [x] Vraies durées des leçons Google Earth dans ArcGIS 1 (arc1-v09 à v15) et QGIS 1 (qgis1-v11 à v17)
- [x] Sauvegarde `GeoExpert-Sauvegardes\2026-10-30-avant-titres-google\` ; branche `titres-google`
- [x] Test : titres et durées vérifiés par l'API apprenant (`GeoExpert-Outils\verif-titres.mjs`) ; `test-contenu.mjs` interrompu par des coupures réseau (données de test remises en état à la main)
- [x] **En ligne le 30/10/2026** : `espace-apprenant-api` → a5038974 (avant : 86229fd8) ; `geoexpert-admin` → e724425c (avant : 5730f4aa) ; contrôles : faux code 401, page apprenant 200, admin renvoyé vers Access
- [x] arc2-v04 renommé « Leçon 3 : Comment définir les classes d'altitude du relief et la pente » et qgis1-v10 (leçon 9 en trop) masqué : voir « Finalisation pour la campagne »

## Titres et durées des leçons Télédétection (demande du 30/10/2026)

- [x] Nouveau montage : 23 leçons (introduction + leçons 1 à 22, ArcMap, Landsat 2013 et 2025) à la place des 6 longues vidéos ; meta « 23 leçons, 4 h 37 »
- [x] Clés tele-v01 à tele-v23 : aucune donnée de production n'utilisait les anciennes clés (pas d'identifiant vidéo, pas de progression)
- [x] Sauvegarde `GeoExpert-Sauvegardes\2026-10-30-avant-titres-tele\` ; branche `titres-tele`
- [x] Test : 23 titres et durées vérifiés par l'API apprenant avec un apprenant Télédétection temporaire (supprimé ensuite)
- [x] **En ligne le 30/10/2026** : `espace-apprenant-api` → 7099147e (avant : a5038974) ; `geoexpert-admin` → fb841e4c (avant : e724425c) ; contrôles : faux code 401, page apprenant 200, admin renvoyé vers Access
- [ ] Reste à faire : mettre les 23 vidéos sur Bunny et rattacher leurs identifiants dans l'onglet « Contenu » de l'admin

## Finalisation pour la campagne (30/10/2026)

Priorité du formateur : modules 1 et 2 (QGIS, ArcGIS) et Télédétection. Webmapping, KoboToolbox et Projet final du Pack sont en pause.

- [x] Plateforme : arc2-v04 renommé ; qgis1-v10 masqué (`"hidden": true` dans le CATALOG ; son quiz reste en base mais n'est plus proposé, aucun résultat enregistré) ; QGIS 1 = « 15 leçons »
- [x] Sauvegarde `GeoExpert-Sauvegardes\2026-10-30-avant-finalisation\` ; test vérifié avec un apprenant temporaire (supprimé)
- [x] **En ligne le 30/10/2026** : `espace-apprenant-api` → 7047243d (avant : 7099147e) ; `geoexpert-admin` → 0e7276df (avant : fb841e4c) ; contrôles : faux code 401, page apprenant 200, admin renvoyé vers Access
- [ ] **À faire par l'administrateur** : joindre les 6 cours PDF terminés (dossier `ressources/cours/A-DEPOSER-espace-apprenant/`) à la leçon « Introduction » de chaque formation, onglet 📚 Contenu > « 📎 Joindre un fichier » (Google Earth : leçon 1 de la formation Google Earth)
- ⚠️ Joindre un fichier enregistre la liste des leçons de la formation dans la table `content`, qui remplace ensuite le CATALOG du code pour cette formation : après cela, les titres de ces formations se changent dans l'onglet Contenu, plus dans `worker.js`
- [ ] Mettre les 23 vidéos Télédétection sur Bunny et coller leurs identifiants dans l'onglet Contenu

## Environnement de test et sauvegardes (où se trouve quoi)

- **Branche de travail :** `phase-1` (le site en ligne = branche `main`, non touchée).
- **Worker de test :** `espace-apprenant-api-test` → https://espace-apprenant-api-test.geographe07.workers.dev
  - configuration : `worker/wrangler-test.toml` · KV de test `ACCESS_GEOEXPERT_TEST` · base D1 `geoexpert-test`
  - accepte seulement les pages servies en local (http://localhost:5501).
- **Worker des apprenants (production) :** `espace-apprenant-api`, KV `ACCESS_GEOEXPERT` — non touché.
- **Outils (hors du site) :** `C:\Users\HP\Documents\GeoExpert-Outils\`
  - `serveur-test.mjs` : sert le site en local en le branchant sur le Worker de test (aucun fichier modifié)
  - `captures.mjs` : captures connexion + tableau de bord (ordinateur / téléphone, clair / sombre)
  - **Worker local** (le Worker admin de test exige maintenant Access, donc les tests automatiques admin tournent en local) :
    `node tests-locaux.mjs test-dashboard.mjs` → copie les données de test, démarre `wrangler dev` (config `worker/wrangler-local.toml`,
    mode admin sans Access, uniquement sur 127.0.0.1), lance le test, arrête tout. Outils : `local.mjs`.
  - Autres tests en ligne : `test-synchro.mjs`, `test-compat.mjs`, `test-admin.mjs acces`
  - `codes-apprenants-TEST.txt`, `mot-de-passe-admin-TEST.txt` : valeurs de test uniquement
- **Sauvegarde avant phase 1 :** `C:\Users\HP\Documents\GeoExpert-Sauvegardes\2026-10-24-avant-phase-1\`
  (code en zip + données KV : `cfg`, `f_arc1-e1`, `s_DM6JMZDCVCBU`) · étiquette git `sauvegarde-avant-phase-1`.

## Points à suivre

- **Le dépôt GitHub est public** : l'adresse « cachée » de l'ancienne page admin y est visible par tous, et la version
  actuelle n'a pas de limite de tentatives. → Mettre en ligne la partie sécurité dès qu'Access est validé.
  Tout ce qui est poussé sur `main` est public (aucun secret dans les fichiers : mots de passe et clés restent dans Cloudflare).
- **Déploiement :** le Worker utilise maintenant `admin.html` (importé) → toujours déployer avec wrangler, plus par copier-coller
  dans le tableau de bord Cloudflare.

- **Exercice 2 ArcGIS (arc1-e2)** : marqué « En ligne » dans l'admin, mais le fichier est absent du stockage. À renvoyer depuis l'onglet Fichiers.
- Clé Bunny de test (`BUNNY_TOKEN_KEY`) à installer par l'administrateur pour lire les vidéos en test.
- **Conservation des données** : la politique annonce une suppression 12 mois après la fin de l'accès. Il n'y a pas encore
  de suppression automatique → ajouter en phase 2 un bouton « Supprimer les données de cet apprenant » (+ liste des accès finis depuis 12 mois).
- La branche `phase-1` est aussi sur GitHub (dépôt public) : aucun secret dedans, seulement du code et des identifiants non secrets.

- Durées du chapitre 2 d'ArcGIS identiques au chapitre 1 (à corriger quand la gestion du contenu existe).
- Politique de confidentialité (à rédiger en fin de phase 1) : sauvegarde de la progression et des notes sur le serveur,
  notes de suivi de l'administrateur, numéro WhatsApp (relances), journal (dont adresse IP en cas de mot de passe faux),
  durées de conservation.

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
- Access validé par l'administrateur (connexion réelle). Tableau de bord admin fait et testé.
- Fiche apprenant + notes privées : faites et testées.
- Actions en un clic : faites et testées.
- Relances WhatsApp + suivi de l'essai : faits et testés.
- Côté apprenant (message du jour + carte « Essai et assistance ») : fait, testé, preuve pixel faite.
- Export CSV, nettoyage, politique de confidentialité, config de production, livrables : faits.
- Mise en ligne lancée : étapes 1 à 3 faites ; Worker apprenant de production et site non touchés (vérifié).
  Petite amélioration : l'admin vérifie la connexion e-mail AVANT tout le reste (ne révèle rien sans connexion).
- Mise en ligne terminée (étapes 1 à 10). Production vérifiée : 7/7.
- Phase 1 validée par l'administrateur. Retour en arrière toujours possible : voir `MISE-EN-LIGNE-PHASE-1.md`.

### 25 octobre 2026 — Session 2 (phase 2)
- Sauvegarde avant phase 2 : `GeoExpert-Sauvegardes\2026-10-25-avant-phase-2\` (KV + export D1 + code) ; étiquette
  `sauvegarde-avant-phase-2` ; branche `phase-2`.
- L'administrateur ajoutera les vidéos manquantes, le fichier d'exercice et le numéro WhatsApp **à la fin du codage**.
- Faits et testés : suppression des données d'un apprenant ; annonces ; objectif, série, badges ; « Mes notes » ; « J'ai fait l'exercice » ; mini-quiz ; économie de données.
- **Phase 2 en ligne le 25/10/2026** (production vérifiée 8/8), validée par l'administrateur.

### 25 octobre 2026 — Session 2 (suite) : phase 3
- Sauvegarde avant phase 3 : `GeoExpert-Sauvegardes\2026-10-25-avant-phase-3\` ; étiquette `sauvegarde-avant-phase-3` ; branche `phase-3`.
- Faits et testés : attestations + page « Vérifier un certificat », avis, gestion du contenu, fichiers par leçon.
- Preuve pixel phase 3 : `comparer-elements.mjs … cacher phase-3` (référence = fin de phase 2).
- **Phase 3 en ligne et validée le 25/10/2026. Les 3 phases du plan sont terminées.**
- Reste côté administrateur (après le codage) : vidéos Bunny manquantes, fichier de l'exercice 2 ArcGIS 1, numéros WhatsApp.
- Pour toute nouvelle demande : relire ce fichier, garder la règle n° 1 et la preuve pixel, sauvegarder avant de toucher à la production.
- Après le codage : l'administrateur ajoutera les vidéos manquantes, le fichier de l'exercice 2 ArcGIS 1 et les numéros WhatsApp.
- Preuve pixel de la phase 2 : comparer avec la page de `sauvegarde-avant-phase-2` (phase 1 comprise) en masquant les nouveautés de la phase 2.

### (Rappel) Démarrer une phase
1. Relire ce fichier en entier.
2. Avant de coder : nouvelle sauvegarde (code + données de production), nouvelle étiquette git, nouvelle branche `phase-2`.
3. Travailler sur l'environnement de test, avec la règle n° 1 (on ajoute, on ne change pas l'existant) et la preuve pixel
   (`comparer-elements.mjs … cacher`), puis captures avant / après.
4. Ordre conseillé : suppression des données d'un apprenant (engagement de la politique de confidentialité), annonces,
   objectif de la semaine + série + badges, « Mes notes », case « J'ai fait l'exercice », mini-quiz, économie de données.
5. En attente côté administrateur (non bloquant) : vidéos Bunny de Télédétection / Webmapping / KoboToolbox / Google Earth,
   fichier de l'exercice 2 d'ArcGIS chapitre 1, numéro WhatsApp de l'apprenant actuel.
  Ensuite : validation de la phase 1 par l'administrateur, puis phase 2.

### 25 octobre 2026 — Session 3 : paiements automatiques DigitalPaye
- Étape 1 (documentation) validée par l'administrateur ; le lien payé est transmis (`payment_link_token`).
- Sauvegarde, branche `paiements`, Worker + admin + tests (49/49), Worker de test déployé, documents.
- Test Sandbox réussi de bout en bout ; mode de secours ajouté (API parfois bloquée, webhook minimal).
- **Mise en ligne faite le 25/10/2026** : réception des paiements en service en production (test DigitalPaye livré, HTTP 200).
- Les 2 apprenants de production (« Abenan Joelle Yao » et « AKA JEAN EUDES TEST ») étaient des **tests de l'administrateur** :
  supprimés par lui le 25/10/2026 (bouton « Supprimer définitivement ses données »). Production vide d'apprenants (KV : `cfg`, `f:arc1-e1`).
  Il n'y a donc **pas d'apprenant actuel** dont il faudrait ajouter le numéro WhatsApp.
- **Corrigé et en ligne (25/10/2026)** : juste après une suppression, la liste KV pouvait encore montrer le code ~60 s et
  `listCodes()` le remettait dans l'index `codes`. Désormais la suppression note le code (seul, sans donnée) dans la table
  `codes_supprimes`, que `listCodes()` écarte. Test `test-purge.mjs` 15/15 (liste KV en retard simulée) ; non-régression 203/203.
  Sauvegarde `GeoExpert-Sauvegardes\2026-10-25-avant-correctif-index\` ; `geoexpert-admin` → a1f554e9 (avant : d9240891),
  `espace-apprenant-api` → fe27980e (avant : 0c9d319f).
