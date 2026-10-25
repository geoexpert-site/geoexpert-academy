# Guide de l'administrateur — GeoExpert Academy

Ce guide explique, étape par étape, comment utiliser les nouveautés de l'espace administrateur.
Il est complété à la fin de chaque phase.

---

## 1. Protéger l'administration avec Cloudflare Access (à faire une seule fois)

**Ce que ça change :** pour ouvrir l'administration, il faudra d'abord entrer votre adresse e-mail,
puis un code reçu par e-mail (valable quelques minutes), **et ensuite** votre mot de passe habituel.
Quelqu'un qui connaîtrait votre mot de passe ne pourrait donc rien faire sans votre boîte e-mail.

**Coût :** gratuit (offre gratuite de Cloudflare Zero Trust, jusqu'à 50 utilisateurs).
Cloudflare peut demander une carte bancaire pour activer l'offre gratuite : **aucun montant n'est prélevé** sur l'offre Free.

**Nouvelle adresse de l'administration :**
- Test : https://geoexpert-admin-test.geographe07.workers.dev
- Version réelle (après la mise en ligne) : https://geoexpert-admin.geographe07.workers.dev — l'ancienne adresse y renvoie automatiquement.

### Étapes (sur l'environnement de test d'abord)

1. Allez sur https://dash.cloudflare.com et connectez-vous.
2. Dans le menu de gauche : **Workers & Pages** (ou **Compute → Workers & Pages**).
3. Cliquez sur **geoexpert-admin-test**.
4. Ouvrez l'onglet **Settings** (Paramètres), puis la partie **Domains & Routes**.
5. Sur la ligne **workers.dev**, cliquez sur les **trois points** ou sur le bouton, puis **Enable Cloudflare Access**
   (Activer Cloudflare Access).
6. **Si c'est la première fois que vous utilisez Zero Trust**, Cloudflare vous demande :
   - un **nom d'équipe** (« team name ») : écrivez par exemple `geoexpert` ;
   - une **offre** : choisissez **Free** (0 $).
7. Une fenêtre s'affiche avec deux informations :
   - **POLICY_AUD** (ou « Audience Tag ») : une longue suite de lettres et de chiffres ;
   - **JWKS URL** ou **Team domain** : une adresse en `https://....cloudflareaccess.com`.

   👉 Copiez ces deux valeurs et envoyez-les-moi dans la conversation.
   **Ce ne sont pas des secrets** (elles servent seulement à vérifier les connexions) : vous pouvez les coller sans risque.
8. Cliquez sur **Manage Cloudflare Access** (Gérer) pour vérifier **qui a le droit d'entrer** :
   - dans la règle (« Policy »), la partie **Include** doit contenir **Emails** = votre adresse e-mail, et seulement elle ;
   - la méthode de connexion **One-time PIN** (code par e-mail) doit être cochée (elle l'est par défaut).
9. C'est tout. Je termine ensuite la configuration et je vous demande de tester :
   ouvrez l'adresse de test → entrez votre e-mail → recopiez le code reçu → entrez le mot de passe.

> Ne m'envoyez **jamais** votre mot de passe Cloudflare, ni le code reçu par e-mail, ni le mot de passe administrateur.

---

## 2. Tableau de bord

C'est le premier onglet (**📊 Tableau de bord**), ouvert automatiquement à la connexion.
Les autres onglets (Nouvel accès, Apprenants, Vidéos, Fichiers) n'ont pas changé.

| Carte | Ce qu'elle compte |
|---|---|
| **Apprenants** | Codes valides : ni désactivés, ni expirés. |
| **Actifs cette semaine** | Apprenants venus sur la plateforme ces 7 derniers jours. |
| **Nouveaux cette semaine** | Codes créés ces 7 derniers jours. |
| **En période d'essai** | Apprenants dont l'essai de 7 jours est en cours. |
| **Inactifs depuis plus de 7 jours** (en magenta) | Ont déjà commencé, mais ne sont pas revenus depuis 7 jours → à relancer. |
| **Jamais connectés** (en magenta) | Ont reçu un code mais ne l'ont jamais utilisé → vérifier qu'ils l'ont bien reçu. |
| **Progression moyenne** | Moyenne des leçons terminées, calculée seulement sur les apprenants dont la progression est sauvegardée (le nombre est indiqué sous le chiffre). |

**Formations les plus suivies :** pour chaque formation, le nombre d'apprenants inscrits et le nombre de leçons
terminées ces 30 derniers jours. Les leçons terminées avant la mise à jour (date inconnue) ne sont pas comptées dans les 30 jours.

Tous les chiffres sont recalculés à chaque ouverture de l'administration ; rien n'est estimé.
Un nouveau code apparaît désormais **tout de suite** dans la liste « Apprenants » (avant : jusqu'à 1 minute).

---

## 3. Fiche de chaque apprenant et notes de suivi

**Ouvrir une fiche :**
1. Onglet **👥 Apprenants**.
2. Pour trouver quelqu'un vite, tapez une partie de son nom ou de son code dans **« Rechercher un apprenant »**.
3. Cliquez sur le bouton violet **Fiche** de sa ligne. Une fenêtre s'ouvre.
4. Pour la fermer : la croix **×** en haut à droite, la touche **Échap**, ou un clic à côté de la fenêtre.

**Ce que montre la fiche :**
- son état (Accès complet, En essai, Pas encore utilisé, Expiré, Désactivé), son code et sa formation ;
- les dates : code créé, première connexion, fin de l'essai, fin de l'accès, **fin de l'assistance** (3 mois) ;
- sa dernière visite, ses connexions (et un avertissement si le code est utilisé depuis 4 réseaux ou plus) ;
- la dernière leçon ouverte ;
- **leçon par leçon**, ce qu'il a terminé et quand (« date inconnue » = terminé avant la mise à jour).

**Notes de suivi privées** (en bas de la fiche) :
1. Écrivez votre note (ex. : « relancé sur WhatsApp », « bloqué sur la leçon 4 »).
2. Cliquez sur **Ajouter la note**. Elle s'affiche avec la date et votre e-mail.
3. Pour en supprimer une : **Supprimer**, puis confirmez (la suppression est définitive).

Ces notes ne sont **jamais** visibles par l'apprenant. N'y mettez que le nécessaire pour le suivi
(pas de données sensibles : santé, paiement, pièces d'identité…).

---

## 4. Actions en un clic

Toutes les actions se trouvent dans la **fiche** de l'apprenant (bouton **Fiche**), partie **Actions**.
Avant chaque action, une fenêtre explique ce qui va se passer : cliquez **OK** pour confirmer, **Annuler** pour ne rien faire.

| Action | Quand l'utiliser | Comment |
|---|---|---|
| **Ajouter une formation** | L'apprenant achète une formation en plus. | Choisissez la formation dans la liste → **Ajouter**. Seules les formations qu'il n'a pas encore sont proposées. |
| **Prolonger l'accès** | Geste commercial, retard, maladie… | Choisissez 30 jours, 3 mois, 6 mois ou 1 an → **Prolonger**. La confirmation annonce la nouvelle date de fin. |
| **Tout débloquer** | Débloquer toutes les leçons avant le 8e jour. | **Tout débloquer** (visible seulement pendant l'essai). Ne peut pas être annulé. |
| **Remplacer le code** | Code perdu, ou code partagé par erreur. | **Remplacer le code**. Un nouveau code est créé avec la même formation, les mêmes dates et **toute la progression et les notes**. L'ancien code ne marche plus. Le message WhatsApp avec le nouveau code s'affiche : **Copier le message** ou **Ouvrir WhatsApp**. |
| **Désactiver le code** | Remboursement, abus. | **Désactiver** (bouton rouge). Réversible : **Réactiver**. Un code remplacé, lui, ne peut pas être réactivé. |

Les boutons de la liste **Apprenants** demandent eux aussi une confirmation (Couper, +30j, Débloquer).
Le bouton **+ Module** ouvre la fiche directement sur la liste des formations (plus besoin de taper un identifiant).
Chaque action est inscrite dans le **Journal**.

---

## 5. Relances WhatsApp

### Le numéro WhatsApp de l'apprenant
- À la création d'un code (**Nouvel accès**) : champ **Numéro WhatsApp** (facultatif). Ex. `07 87 01 50 30` ;
  le préfixe +225 est ajouté tout seul.
- Après coup : dans la **fiche**, partie **WhatsApp et relances** → tapez le numéro → **Enregistrer**.
- Le numéro sert uniquement aux relances : il n'est **jamais** affiché à l'apprenant ni dans le filigrane des vidéos.
- Sans numéro, les relances marchent quand même : WhatsApp vous demande de choisir le contact.

### La liste « À relancer aujourd'hui » (onglet **📣 Relances**)
Le chiffre rose sur l'onglet = nombre de relances à faire. Le tableau de bord l'annonce aussi en haut.

| Relance | Apparaît quand… |
|---|---|
| **Bienvenue (1er jour)** | l'apprenant s'est connecté pour la 1re fois il y a moins de 2 jours. |
| **Code pas encore utilisé** | le code a été envoyé il y a au moins 1 jour, mais jamais utilisé. |
| **Suivi de l'essai (5e jour)** | l'apprenant est au 5e jour d'essai ou plus. |
| **Inactif depuis plus de 7 jours** | il a commencé sans finir, et n'est pas revenu depuis 7 jours (revient chaque semaine tant qu'il reste inactif). |
| **Formation terminée : félicitations** | il a terminé toutes ses leçons (demande d'exercice final et d'avis). |

Pour chaque ligne :
1. **Ouvrir WhatsApp** : WhatsApp s'ouvre avec le message déjà écrit (prénom, formation, dates, nombre de leçons).
   Relisez-le, modifiez-le si besoin, puis envoyez-le.
2. Revenez dans l'administration et cliquez **Fait ✓** : la relance quitte la liste et la date est notée dans la fiche.

Cliquer sur le **nom** ouvre la fiche de l'apprenant.

### Suivi de la période d'essai (même onglet, en bas)
Tous les apprenants en essai, avec **le jour où ils en sont** (Jour X sur 7), la date de déblocage, leurs leçons
terminées et leur dernière visite. Après votre message de suivi : **Suivi fait ✓** (la date s'affiche).

### Depuis la fiche
La partie **WhatsApp et relances** propose les 5 messages à tout moment, avec la date du dernier envoi marqué « Fait ».

---

## 6. Exporter la liste des apprenants (Excel)

1. Onglet **👥 Apprenants** → bouton **📥 Exporter la liste (Excel / CSV)**.
2. Un fichier `apprenants-geoexpert-AAAA-MM-JJ.csv` est téléchargé. Ouvrez-le avec Excel (double-clic) : les colonnes et
   les accents s'affichent correctement.
3. Colonnes : nom, code, numéro WhatsApp, formations, statut, dates (création, 1re connexion, fin d'essai, fin d'accès,
   fin d'assistance), leçons terminées, total, progression, dernière visite, connexions, relances à faire.

Ce fichier contient des données personnelles : gardez-le pour vous, ne l'envoyez pas, supprimez-le quand vous n'en avez plus besoin.
Chaque export est inscrit dans le Journal.

---

## 7. Limite de tentatives

Si un mauvais mot de passe administrateur est entré **5 fois en 15 minutes** depuis la même connexion internet,
l'administration est bloquée **15 minutes** pour cette connexion (même avec le bon mot de passe).
Chaque mot de passe faux apparaît en rouge dans le **Journal**.

**Si vous vous êtes bloqué vous-même :** attendez 15 minutes, ou changez de connexion (Wi-Fi ↔ données mobiles).

---

## 8. Journal d'activité

Onglet **📜 Journal** de l'administration : tout ce qui a été fait, du plus récent au plus ancien
(300 dernières actions) avec la date, l'action, l'apprenant concerné, le détail et l'adresse e-mail de la personne connectée.

Actions enregistrées : code créé, code désactivé / réactivé, accès prolongé, tout débloqué, module ajouté,
code remplacé (perdu), vidéos Bunny modifiées, fichier d'exercice envoyé, note de suivi ajoutée / supprimée (sans son texte), numéro WhatsApp enregistré / supprimé, relance faite, liste exportée, mot de passe incorrect.
