# Progression guidée des leçons : tests, mise en ligne et retour en arrière

> **NE PAS PUBLIER avant le 9 novembre 2026** (fin de la campagne Facebook) **et sans l'accord explicite de l'administrateur.**
> Travail fait sur la branche `progression-lecons` (sauvegarde du code : étiquette `sauvegarde-avant-progression`). Rien n'est en ligne.

## Ce qui change

| Où | Changement |
|---|---|
| Espace apprenant | Leçons verrouillées : **cadenas** + texte grisé dans la liste de gauche ; clic → fenêtre « Vous devez terminer la Leçon X avant de passer à la Leçon Y. » avec **Aller à la Leçon X** et **Contacter l'assistance sur WhatsApp** (même lien que le reste du site) ; message « Bravo, la Leçon Y est débloquée. » ; suivi de la vidéo (cases de 5 s vues). Les boutons « Marquer comme terminée » / « Terminer et continuer » restent, mais ne terminent la leçon qu'à 90 % vus (message sinon). |
| Worker apprenant | Verrou vérifié **dans le Worker** sur `/api/play`, `/api/quiz`, `/api/quiz-answer`, `/api/file` (fichiers de leçon) ; nouvelle route `/api/watch` (suivi vidéo) ; `/api/sync` n'accepte plus « terminée » pour une leçon non regardée ; `/api/login` renvoie `prog`. |
| Administration | Fiche apprenant → « Progression guidée : débloquer à la main » (une leçon ou tout un cours) ; 🔒 / 🔓 / « vue à X % » dans la liste des leçons ; route `/admin/deblocage` ; journal. |
| Base D1 | 2 nouvelles tables : `watch` (vidéo regardée) et `deblocages` (déblocages manuels). `schema.sql` est rejouable sans risque. |

## Règles appliquées (voir `worker/worker.js`, « Progression guidée »)

- Leçon 1 / Introduction de chaque formation : toujours ouverte. Une leçon sans vidéo en ligne **ne bloque pas** la suite.
- Terminée = 90 % de la vidéo vue. Le Worker accepte les cases envoyées par la page seulement au rythme du temps écoulé
  (jusqu'à 2,25 × la vitesse normale, 60 s d'avance au maximum par envoi) : annoncer toute la vidéo d'un coup ne marche pas.
- **Ancien fonctionnement** : si une leçon plus avancée est déjà terminée, tout ce qui la précède est ouvert, et la leçon juste après aussi.
- **Chapitre 2** (`qgis2` après `qgis1`, `arc2` après `arc1`) : s'ouvre à la fin du chapitre 1, **si l'apprenant a les deux**. S'il n'a que le chapitre 2, sa 1re leçon est ouverte.
- **Quiz** : ne bloquent jamais. **Essai de 7 jours** : mêmes règles, en plus des 3 leçons gratuites.
- **Apprenants actuels** : un code créé avant la mise en service est marqué à sa 1re connexion et reprend pendant **15 minutes** toute la
  progression gardée sur son téléphone (aucune perte). Les codes créés après (`progV`) sont stricts dès le départ.
- Il n'y a pas d'adresse par leçon dans l'espace apprenant : le « lien direct » est l'appel au Worker (`/api/play`, etc.), qui refuse (403) avec le même message ;
  la page renvoie alors vers la leçon à terminer.

## À savoir avant de publier

1. ⚠️ **Lecteur Bunny réel non testé** : les tests utilisent un lecteur simulé (même protocole « player.js »). Le suivi s'appuie sur les événements
   `timeupdate`, `pause` et `ended` du lecteur Bunny (comme la vitesse de lecture). **À vérifier tout de suite après la mise en ligne**
   avec « test 1 » : regarder une vraie vidéo jusqu'au bout → « Bravo, la Leçon … est débloquée ». Si ça ne marche pas : **interrupteur de secours** (ci-dessous).
2. Un apprenant déterminé pourrait encore tricher en regardant la vidéo à vitesse normale sans la regarder vraiment (c'est inévitable) ;
   en revanche il ne peut plus « terminer » en un clic ni coller l'adresse d'une leçon fermée.
3. Les durées du catalogue servent de référence (90 % de la durée annoncée) : si une vidéo est nettement plus courte que sa durée annoncée,
   la page transmet la vraie durée (acceptée si elle est entre 80 % et 100 % de la durée annoncée) ; sinon, débloquer à la main.

## Étapes de mise en ligne (dans cet ordre, après votre accord)

| # | Étape | Commande / contrôle |
|---|---|---|
| 1 | Sauvegarde de la production (KV + D1 + code) et notes des versions actuelles | `node sauvegarde-prod.mjs C:\Users\HP\Documents\GeoExpert-Sauvegardes\<date>-avant-progression` ; `npx wrangler deployments list` (2 Workers) |
| 2 | Tables en production | `npx wrangler d1 execute geoexpert-prod --remote --file worker/schema.sql -c worker/wrangler-prod.toml -y` |
| 3 | Publier la page (fusion de `progression-lecons` dans `main`, `git push`) | la nouvelle page avec l'ancien Worker fonctionne comme avant (pas de verrou) |
| 4 | Worker des apprenants | `npx wrangler deploy -c worker/wrangler-prod.toml` |
| 5 | Worker d'administration | `npx wrangler deploy -c worker/wrangler-admin-prod.toml` |
| 6 | Contrôles | faux code 401, page apprenant 200, admin renvoyé vers Access ; avec un code temporaire : leçon 3 refusée, déblocage manuel, puis suppression du code |
| 7 | 👤 Votre essai avec « test 1 » | regarder une vraie vidéo Bunny jusqu'à la fin ; vérifier le cadenas sur téléphone ; essayer « Débloquer cette leçon » dans la fiche |

## Retour en arrière

- **Désactiver sans rien défaire** (interrupteur de secours) : ajouter `PROG_GUIDEE = "non"` dans `[vars]` de `worker/wrangler-prod.toml`
  puis `npx wrangler deploy -c worker/wrangler-prod.toml`. Plus aucun verrou, plus de suivi ; la progression enregistrée est gardée.
- **Tout défaire** : `npx wrangler rollback <version avant>` pour les deux Workers (versions notées à l'étape 1), et `git revert` de la fusion dans `main`.
  Les tables `watch` et `deblocages` peuvent rester (sans effet sur l'ancien code).

## Tests (Worker local, données de test) — `GeoExpert-Outils\test-progression.mjs`

- `api` **38/38** : leçon 1 ouverte, leçon 3 fermée (message exact), triche refusée (toute la vidéo d'un coup, `/api/sync`), vrai visionnage → déblocage,
  quiz non bloquant et quiz d'une leçon fermée refusé, déblocage manuel (leçon / cours / rétablir / refus d'une formation non possédée), journal,
  leçon sans vidéo, ancien code (reprise de la progression, leçon avancée), fenêtre de reprise terminée, chapitre 2, essai de 7 jours, suppression des données.
- `page` **30/30** (Edge, ordinateur + téléphone, lecteur simulé) : cadenas, texte grisé, message exact, boutons, « Aller à l'Introduction », message avant 90 %,
  lecture jusqu'à la fin → « Bravo, la Leçon 1 est débloquée. », mise à jour de la liste et du bouton, aucune erreur JavaScript, pas de débordement.
- `admin` **6/6**. Captures : `geoexpert-captures\apres-progression\`.
