# Rapport de fin de phase 2 — GeoExpert Academy

**Date :** 25 octobre 2026 · **État :** terminé et testé sur l'environnement de test · **Pas encore en ligne**
(voir `MISE-EN-LIGNE-PHASE-2.md`).

## 1. Ce qui a été fait

### Pour les apprenants
| Nouveauté | Où |
|---|---|
| **Annonces du formateur** (masquables avec ×) | au-dessus du message du jour, sous le bandeau de bienvenue |
| **Mes progrès** : objectif de la semaine (jauge), semaines actives d'affilée, 5 badges liés à de vraies étapes | nouvelle section sous « Vos modules » |
| **Mes notes** : toutes les notes, leçon par leçon | nouvelle entrée de la colonne de gauche, sous « Tableau de bord » |
| **J'ai fait l'exercice** | case sous chaque exercice disponible (onglet « Exercices » de la leçon) |
| **Mini-quiz** corrigé par le serveur, avec explications | nouvel onglet « Quiz » sous les leçons qui en ont un |
| **Économie de données** (qualité limitée à la taille de l'écran ; activée seule si connexion lente) | petite case sous la vidéo |

### Pour vous (administration)
| Nouveauté | Où |
|---|---|
| Écrire, cibler (toutes / une formation), programmer la durée et retirer des **annonces** | onglet « 📢 Annonces » |
| Créer / modifier / supprimer des **quiz** (1 à 5 questions, 2 à 4 réponses, explication) + moyenne des apprenants | onglet « ❓ Quiz » |
| **Exercices faits** par apprenant | fiche (sous chaque formation) + colonne de l'export |
| **Supprimer définitivement les données** d'un apprenant (taper SUPPRIMER) + rappel des accès terminés depuis 12 mois | fiche → Actions ; haut de « Apprenants » |

Politique de confidentialité complétée (exercices, objectif, résultats des quiz).

## 2. Tests (dernier passage complet : 25/10/2026, 04 h 55)

| Série | Résultat |
|---|---|
| Phase 1 (tableau de bord, fiche, actions, relances, export, synchro, compatibilité, Access, côté apprenant) | **13 + 19 + 16 + 25 + 8 + 18 + OK + 3 + 15** — tout réussi (le tableau de bord, interrompu une fois par une coupure réseau pendant la copie des données de test, a été relancé seul : 13/13) |
| Suppression des données (mauvaise saisie sans effet, anciens codes effacés aussi, journal sans nom, autres apprenants intacts) | **11 / 11** |
| Annonces — admin (vide refusé, aperçu, confirmation, durée, cible, retirer, journal) | **10 / 10** |
| Annonces — apprenant (bonne cible, pas les terminées, texte non exécuté, ordre, ×, téléphone sombre) | **6 / 6** |
| Mes progrès, Mes notes, exercices — apprenant (série, badges, objectif, exercice, notes, 2e appareil, essai) | **14 / 14** |
| Exercices dans la fiche admin | **3 / 3** |
| Quiz — admin (bonne réponse obligatoire, réponses vides retirées, statistiques, suppression, journal) | **9 / 9** |
| Quiz — apprenant (réponses jamais envoyées avant correction, verrou d'essai, correction, explications, refaire) | **12 / 12** |
| Économie de données (case, levelCap, mémorisé, connexion lente détectée, téléphone) | **7 / 7** |
| **Existant inchangé** vs page en ligne (fin de phase 1), nouveautés masquées | **42 / 42 blocs identiques au pixel** |
| **Existant inchangé** vs page d'origine des vidéos publicitaires, tous les ajouts masqués | **34 / 34 blocs identiques au pixel** |

Relancer tous les tests : `node tous-les-tests.mjs` dans `C:\Users\HP\Documents\GeoExpert-Outils`.

## 3. Captures (`C:\Users\HP\Documents\GitHub\geoexpert-captures\`)

| Sujet | Fichiers |
|---|---|
| Avant / après (tableau de bord, connexion ; ordinateur, téléphone ; clair, sombre) | `apres-phase-1-apprenant\` (avant) · `apres-phase-2-apprenant\` (après) |
| Preuves pixel | `preuve-existant-phase-2\nouveautes-masquees\` (42/42) · `preuve-existant-phase-2\page-d-origine\` (34/34) |
| Apprenant | `apprenant-annonces-*`, `apprenant-mes-progres-*`, `apprenant-mes-notes-ordinateur.png`, `apprenant-exercice-fait.png`, `apprenant-quiz-*`, `apprenant-economie-donnees.png` |
| Admin | `admin-annonces-*`, `admin-quiz-editeur.png`, `admin-fiche-exercices.png`, `admin-donnees-a-supprimer.png`, `admin-supprimer-donnees.png` |

## 4. Bon à savoir

- **Économie de données :** Bunny ne permet pas d'imposer une qualité basse. L'option utilise `levelCap` (qualité limitée
  à la taille du lecteur à l'écran) : l'économie est réelle sur téléphone, faible sur un grand écran d'ordinateur.
  Source : [documentation Bunny Stream — paramètres d'intégration](https://bunny.net/docs/stream/embedding).
- **Badges et série :** seules les leçons avec une vraie date comptent pour la série ; une leçon terminée avant la phase 1
  (date inconnue) compte pour le badge « Première leçon », sans date affichée.
- **Mise en ligne et retour en arrière :** voir `MISE-EN-LIGNE-PHASE-2.md`.
