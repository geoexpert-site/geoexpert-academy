# Phase C — « Aide » et « Et après ? » (brouillon à valider, 31/10/2026)

Rien n'est encore codé. Ce document fixe le contenu de départ et les règles, à valider par l'administrateur.

## 1. Aide — contenu de départ de la FAQ (modifiable dans l'admin)

**Comment installer QGIS sur Windows ?**
Allez sur qgis.org → « Télécharger » → choisissez la version « LTR » (la plus stable) pour Windows. Lancez le fichier téléchargé,
cliquez sur « Suivant » jusqu'à la fin. QGIS est gratuit. Prévoyez environ 1,5 Go d'espace libre et une bonne connexion pour le téléchargement.

**Comment obtenir une licence ArcGIS ?**
Vous n'avez rien à acheter : le formateur vous accompagne pour installer ArcMap et vous donne la licence.
Écrivez-lui avec le bouton WhatsApp en bas de cette page pour convenir de l'installation.

**La vidéo ne se lance pas, que faire ?**
1. Vérifiez votre connexion internet. 2. Rechargez la page. 3. Essayez un autre navigateur (Chrome ou Edge à jour).
4. En connexion lente, attendez quelques secondes ou baissez la qualité avec la roue ⚙ du lecteur.
Si cela ne marche toujours pas, écrivez au formateur avec le bouton WhatsApp en bas de cette page.

**J'ai perdu mon code d'accès.**
Écrivez au formateur par WhatsApp en donnant votre nom et la formation achetée. Il vous renverra votre code. Votre progression est gardée.

**Comment fonctionne la période d'essai de 7 jours ?**
Pendant les 7 premiers jours, vous avez accès à l'introduction et aux 2 premières leçons de chaque module. Le reste de la formation
s'ouvre automatiquement le 8e jour à 0 h (heure d'Abidjan).

**Comment obtenir mon attestation ?**
Terminez la formation et envoyez votre exercice final. Une fois l'exercice validé par le formateur, la carte « 🎓 Mon attestation »
apparaît sur votre tableau de bord : vous pouvez la télécharger en PDF et la partager.

**Comment contacter le formateur, et en combien de temps répond-il ?**
Avec le bouton WhatsApp en bas de cette page. Le formateur répond sous 48 h ouvrables (du lundi au vendredi, hors jours fériés).

**Bouton du bas :** « Écrire au formateur sur WhatsApp », message prérempli :
« Bonjour, je suis [Nom], apprenant(e) de la formation [Formation]. J'ai une question (page : [Aide / leçon en cours]) : »

## 2. Et après ? — recommandations par défaut (modifiables dans l'admin)

Affiché quand la formation est terminée (100 % des leçons visibles). Prix réels (constante `PRIX` du Worker = prix du site) et liens d'achat existants.
Aucune réduction, sauf si l'admin en configure une. Une formation déjà possédée n'est jamais proposée (vérification dans le Worker).

| Formation terminée | Proposition |
|---|---|
| QGIS M1 (qgis1) | QGIS M2 — 20 000 FCFA |
| QGIS M2 (qgis2) | Télédétection — 25 000 FCFA, ou Webmapping — 20 000 FCFA |
| ArcGIS M1 (arc1) | ArcGIS M2 — 20 000 FCFA |
| Formation seule sans pack (ex. Télédétection, Google Earth…) | Pack correspondant (QGIS/ArcGIS 25 000 FCFA ; sinon Pack Géomaticien 100 000 FCFA) |

Question pour l'administrateur : Webmapping est « en pause ». Faut-il quand même le proposer après QGIS M2 ?

## 3. Plan technique prévu (suivre REGLES-PLATEFORME.md)

- Sauvegarde + branche `phase-c` + étiquette `sauvegarde-avant-phase-c`.
- D1 : table `faq` (id, question, reponse, ordre, visible) ; `reglages.recommandations` (règles + réduction facultative).
- Worker : `/api/faq` (connecté) ; `/api/apres` calculé côté serveur à partir de `PRODUCTS`, des formations possédées et de la progression ;
  routes admin pour la FAQ et les recommandations.
- Apprenant : nouvelle entrée « Aide » (page accordéon + recherche + bouton WhatsApp) et carte « Et après ? » sous l'existant. Rien d'existant ne change.
- Admin : nouvel onglet « ❔ Aide & recommandations ».
- Tests + preuve pixel `comparer-elements.mjs … cacher`, guide, mise en ligne, mise à jour de PLAN-PLATEFORME.md.
