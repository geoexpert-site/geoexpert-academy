# Rapport de fin de phase 3 — GeoExpert Academy

**Date :** 25 octobre 2026 · **État :** terminé et testé sur l'environnement de test · **Pas encore en ligne**
(voir `MISE-EN-LIGNE-PHASE-3.md`).

## 1. Ce qui a été fait

| Nouveauté | Pour qui | Où |
|---|---|---|
| **Attestation de fin de formation** délivrée par vous (après l'exercice final), numéro unique `ATT-XXXX-XXXX`, révocable | vous | fiche → Actions → « Attestation — [formation] » ; onglet « 🎓 Attestations & avis » |
| **PDF de l'attestation** (A4, logo, nom, formation, durée, date, code QR), 68 Ko | apprenant | carte « 🎓 Mon attestation », après les 2 cartes existantes |
| **Page publique « Vérifier un certificat »** (avec le numéro ou en scannant le QR) | employeurs, public | geoexpertacademy.ci/verifier-certificat.html (reliée depuis la FAQ) |
| **Avis de fin de formation** (étoiles, commentaire, accord de publication) | apprenant | carte « Votre avis » quand une formation est terminée |
| **Gestion des avis** : publiable seulement avec accord, Copier, Masquer | vous | onglet « 🎓 Attestations & avis » |
| **Gestion du contenu sans coder** : renommer, durée, réordonner, masquer, ajouter, supprimer, revenir à l'origine | vous | onglet « 📚 Contenu » |
| **Fichiers joints à une leçon** (données de TP, consignes…) | vous → apprenant | onglet « 📚 Contenu » → visible dans l'onglet « Exercices » de la leçon |
| **Correction d'un bug déjà en ligne** : les fichiers se téléchargeaient tous sous le nom « Exercice_GeoExpert.pdf » | apprenant | téléchargements |

Politique de confidentialité complétée (attestations conservées pour rester vérifiables ; avis publiés seulement avec accord).

## 2. Tests (dernier passage complet : 25/10/2026, 06 h 33)

| Série | Résultat |
|---|---|
| Phases 1 et 2 (tableau de bord, fiche, actions, relances, export, suppression, annonces, progrès, quiz, synchro, compatibilité, Access, côté apprenant, économie de données) | **tous réussis** (13 · 19 · 16 · 25 · 8 · 11 · 10 · 3 · 9 · 18 · OK · 3 · 15 · 6 · 14 · 12 · 7) |
| Attestations & avis — admin (avertissement si leçons incomplètes, numéro, doublon refusé, formation hors accès refusée, publier sans accord refusé, révoquer puis redélivrer, journal, téléphone) | **16 / 16** |
| Attestations — apprenant + page de vérification (carte, ordre des cartes existantes inchangé, PDF réel avec nom/formation/numéro et < 300 Ko, avis, vérification valide / révoquée / inconnue / mal saisie, téléphone) | **16 / 16** |
| Contenu — admin (renommer, réordonner, masquer, supprimer, ajouter, durée invalide, clés jamais réutilisées, fichier joint/retiré, comptes sans leçons masquées, annuler, revenir à l'origine, journal, téléphone) | **18 / 18** |
| Contenu — apprenant (nouvel ordre, leçon masquée absente, essai = 3 premières leçons visibles, fichier de leçon avec vrai nom .zip, leçon masquée refusée par le serveur) | **7 / 7** |
| **Existant inchangé** vs page en ligne (fin de phase 2), nouveautés masquées | **50 / 50 blocs identiques au pixel** |
| **Existant inchangé** vs page d'origine des vidéos publicitaires | **34 / 34 blocs identiques au pixel** |

Note honnête : lors du premier passage complet, les deux preuves pixel ont montré des écarts. Cause : d'autres tests
avaient laissé des données à l'apprenante de test (dernière leçon ouverte), si bien que l'ancienne et la nouvelle page
n'affichaient pas la même chose. L'outil de comparaison remet maintenant ces données à zéro et bloque tout enregistrement
pendant la comparaison ; relancées ainsi, les deux preuves sont entièrement identiques.

## 3. Captures (`C:\Users\HP\Documents\GitHub\geoexpert-captures\`)

| Sujet | Fichiers |
|---|---|
| Avant / après | `apres-phase-2-apprenant\` (avant) · `apres-phase-3-apprenant\` (après) |
| Preuves pixel | `preuve-existant-phase-3\nouveautes-masquees\` · `preuve-existant-phase-3\page-d-origine\` |
| Attestation | `exemple-attestation.pdf`, `exemple-attestation.png`, `apprenant-attestation-avis.png`, `apprenant-attestation-telephone.png` |
| Vérification | `verifier-certificat-valide.png`, `verifier-certificat-telephone.png` |
| Admin | `admin-attestations-avis.png`, `admin-contenu-ordinateur.png`, `admin-contenu-telephone.png` |
| Contenu côté apprenant | `apprenant-contenu-modifie.png` |
