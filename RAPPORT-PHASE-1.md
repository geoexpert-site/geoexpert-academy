# Rapport de fin de phase 1 — GeoExpert Academy

**Date :** 25 octobre 2026 · **État :** **en ligne depuis le 25 octobre 2026** (vérifications en production : 7/7)
· Procédure et retour en arrière : `MISE-EN-LIGNE-PHASE-1.md`.

**Adresses :** espace apprenant https://geoexpertacademy.ci/espace-apprenant.html ·
administration https://geoexpert-admin.geographe07.workers.dev

## 1. Ce qui a été fait

### Pour les apprenants
| Nouveauté | Où |
|---|---|
| Progression, notes et dernière leçon **sauvegardées sur leur compte** (retrouvées sur tous les appareils, sans perte à la mise à jour, même hors connexion) | invisible, automatique |
| **Message du jour** selon la situation (nouveau, essai, absent, presque fini, terminé, astuce du jour) | nouvelle bande sous le bandeau de bienvenue |
| Carte **« Essai et assistance »** (jour X sur 7, déblocage, fin de l'assistance) | sous les cartes de chiffres |

Seuls textes existants modifiés (décision 3) : « …sauvegardées **sur votre compte** » (bas du tableau de bord) et l'aide grise du champ de notes.

### Pour vous (administration)
| Nouveauté | Où |
|---|---|
| Protection **Cloudflare Access** (e-mail + code) + mot de passe, vérifiée par le Worker ; blocage après 5 mots de passe faux | nouvelle adresse de l'admin |
| **Tableau de bord** : apprenants, actifs, nouveaux, en essai, inactifs, jamais connectés, progression moyenne, formations les plus suivies | 1er onglet |
| **Relances WhatsApp** : liste « À relancer aujourd'hui » (5 règles), messages préparés, bouton « Fait » ; **suivi de l'essai** | onglet « 📣 Relances » |
| **Fiche apprenant** : dates, assistance, visites, leçons une par une, **notes privées de suivi**, numéro WhatsApp | bouton « Fiche » |
| **Actions en un clic avec confirmation** : ajouter une formation (liste), prolonger, tout débloquer, désactiver / réactiver, **remplacer un code perdu** en gardant la progression | fiche → « Actions » |
| Recherche d'un apprenant, **export Excel/CSV** | onglet « Apprenants » |
| **Journal d'activité** (qui a fait quoi et quand) | onglet « 📜 Journal » |
| Plus de limite à 500 apprenants ; un nouveau code apparaît tout de suite | — |

### Autres
- Politique de confidentialité complétée (espace apprenant, relances, durée de conservation, sécurité).
- Nettoyage : ancien `worker.js` et ancienne page d'accès publique supprimés ; l'ancienne adresse de l'admin renvoie vers la nouvelle.

## 2. Tests faits et résultats (dernier passage complet : 25/10/2026 à 01:13)

| Série | Ce qui est vérifié | Résultat |
|---|---|---|
| Sauvegarde de la progression | ancien téléphone → serveur sans perte, 2e appareil, décocher, hors connexion, notes différentes sur 2 appareils, sécurité (faux code, leçon hors formation), copie de l'apprenant réel | **18 / 18** |
| Compatibilité | nouvelle page + ancien Worker : fonctionnement d'avant, aucune erreur ; ancienne page + nouveau Worker : connexion OK | **OK** |
| Sécurité de l'admin | sans connexion e-mail : refusé ; bon mot de passe seul : refusé ; faux jeton : refusé ; Worker apprenant sans routes admin ; autre site refusé ; en-têtes de sécurité ; 5 mots de passe faux → blocage | **3 / 3** en ligne + **9 / 9** + test réel par vous |
| Tableau de bord | chaque chiffre change exactement comme prévu (inactif, désactivé, expiré, nouveau code, progression moyenne) | **13 / 13** |
| Fiche + notes de suivi | dates, leçons, notes ajoutées / supprimées, texte piégé affiché sans être exécuté, recherche | **19 / 19** |
| Actions en un clic | « Annuler » ne change rien, ajout de formation, prolongation exacte, déblocage, remplacement de code (progression, notes, suivi déplacés ; ancien code bloqué), désactivation | **16 / 16** |
| Relances | 5 règles, « Fait », retour de la relance « inactif » après 7 jours, numéros (format, refus), messages complets, suivi de l'essai, téléphone | **25 / 25** |
| Export | fichier daté, accents Excel, colonnes, protection contre les formules, journal | **8 / 8** |
| Côté apprenant | 6 situations du message du jour, carte essai/assistance, ordre des blocs, téléphone clair/sombre, ancien Worker | **15 / 15** |
| **Production (vrai site)** | ancienne page + nouveau Worker : 5/5 ; nouvelle page : connexion, vidéo signée, verrou d'essai, sauvegarde d'une leçon, progression retrouvée sur un téléphone, aucune erreur | **7 / 7** |
| **Existant inchangé** | page d'origine vs nouvelle page, bloc par bloc, au pixel (connexion, barre du haut, colonne de gauche, bandeau d'essai, bandeau de bienvenue, chiffres, Vos modules, Attestation) — ordinateur + téléphone, clair + sombre | **34 / 34 identiques** (nouveautés masquées) |

Les tests peuvent être relancés à tout moment : `node tous-les-tests.mjs` dans `C:\Users\HP\Documents\GeoExpert-Outils`.

## 3. Captures (dossier `C:\Users\HP\Documents\GitHub\geoexpert-captures\`)

| Sujet | Fichiers |
|---|---|
| Avant (référence) | `avant-phase-1\` — connexion + tableau de bord, ordinateur / téléphone, clair / sombre |
| Après | `apres-phase-1-apprenant\` — mêmes vues |
| Preuve « existant inchangé » | `preuve-existant-phase-1\comparaison-blocs.txt` (avec nouveautés) et `preuve-existant-phase-1\nouveautes-masquees\comparaison-blocs.txt` (34/34) |
| Nouveautés apprenant | `apprenant-nouveautes-essai-ordinateur.png`, `apprenant-nouveautes-telephone.png`, `apprenant-nouveautes-telephone-sombre.png` |
| Admin | `admin-tableau-de-bord-*`, `admin-relances-*`, `admin-fiche-apprenant-*`, `admin-fiche-whatsapp-ordinateur.png`, `admin-actions-*`, `admin-code-remplace-ordinateur.png`, `admin-journal-*` |
| Export | `exemple-export-apprenants.csv` (données de test ; contient des noms : ne pas diffuser) |

## 4. Mise en ligne et retour en arrière

Voir **`MISE-EN-LIGNE-PHASE-1.md`** : 10 étapes (dont 3 pour vous), et pour chaque partie la façon d'annuler en quelques minutes, sans perte de données.

## 5. Points d'attention

- **Le dépôt GitHub est public** : l'ancienne adresse de l'admin y est visible, mais elle ne fait plus que renvoyer vers la nouvelle,
  protégée par Access. Le Worker des apprenants n'accepte plus aucune action d'administration.
- **Vidéos non configurées en production** : Télédétection, Webmapping, KoboToolbox et Google Earth n'ont pas encore
  d'identifiant Bunny (« disponible prochainement » pour les apprenants concernés) → onglet « Vidéos Bunny ».
- **Durée de conservation** annoncée (12 mois après la fin de l'accès) : la suppression se fera à la main jusqu'au bouton prévu en phase 2.
- **Exercice 2 d'ArcGIS chapitre 1** : marqué « en ligne » mais fichier absent → à renvoyer depuis l'onglet Fichiers.
- **Vidéos en test** : elles ne se lisent pas tant que la clé Bunny de test n'est pas installée (sans effet sur la production).
