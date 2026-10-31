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

## 2 bis. Paiements reçus (onglet **💳 Paiements reçus**) — au quotidien

Chaque paiement **réussi** sur DigitalPaye arrive tout seul dans cet onglet, en quelques secondes :
nom du client, téléphone (s'il est transmis), formation, montant, date et référence de la transaction.
Les paiements échoués ou annulés n'apparaissent pas. Un même paiement n'apparaît jamais deux fois.

**Le matin (ou dès que vous voyez le bandeau) :**
1. Sur le tableau de bord, le bandeau **« 💳 X code(s) à envoyer »** vous prévient. Cliquez sur **Voir les paiements**
   (ou sur l'onglet, qui affiche le même nombre dans une pastille).
2. Pour chaque ligne **« Code à envoyer »**, cliquez sur **Créer le code et envoyer sur WhatsApp** :
   - le code est créé pour la bonne formation, avec l'essai de 7 jours, puis 12 mois (24 mois pour un pack),
     comptés à partir de la première connexion du client ;
   - WhatsApp s'ouvre sur la conversation du client avec le message déjà écrit (code compris) :
     **il ne reste qu'à appuyer sur Envoyer** ;
   - la ligne passe à **« Code envoyé »**, et son numéro est enregistré pour les relances.
3. Si le numéro n'a pas été transmis, le bouton s'appelle **Créer le code (à copier)** : le message s'affiche
   sous la ligne, avec **Copier le message** et **Ouvrir WhatsApp (choisir le contact)**.

**« Client à compléter » :** parfois, DigitalPaye ne transmet que la référence et le montant (le nom et le numéro manquent).
La ligne affiche alors deux champs : **Prénom et nom du client** (obligatoire : il apparaît en filigrane sur ses vidéos)
et **WhatsApp** (facultatif). Retrouvez-les dans DigitalPaye → **Transactions** → la référence indiquée sur la ligne
(ou dans le message WhatsApp du client), puis cliquez sur le bouton : tout se passe ensuite comme d'habitude.

**« À vérifier » (en orange) :** la formation n'a pas été reconnue avec certitude (lien de paiement inconnu ou non transmis,
ou montant plus faible que le prix). La raison est écrite sous le nom. Vérifiez dans DigitalPaye → Transactions,
choisissez la formation dans la liste (une suggestion est parfois déjà choisie), puis **Créer le code et envoyer sur WhatsApp**.
Si c'est par exemple **votre propre paiement de test**, cliquez sur **Ignorer** (aucun code n'est créé ;
**Remettre à vérifier** permet de revenir en arrière).

**Bon à savoir :**
- Double-cliquer ne crée jamais deux codes : un paiement = un code.
- **Voir le message** (sur une ligne « Code envoyé ») permet de renvoyer le même message au client.
- La date de déblocage du message (« Toutes les autres leçons se débloquent le … ») suppose que le client se connecte
  le jour même. S'il se connecte plus tard, sa vraie date s'affiche dans son espace et dans sa fiche.
- **Si vous créez un nouveau lien de paiement** sur DigitalPaye (nouvelle formation, nouveau prix) : ses paiements
  arriveront en « À vérifier » tant que Claude n'a pas ajouté ce lien à la liste du Worker. Pensez à le signaler.
- Tout est noté dans le **Journal** (« Paiement reçu », « Code créé depuis un paiement », « Paiement ignoré »).
- L'onglet **➕ Nouvel accès** fonctionne toujours comme avant (paiement en espèces, cadeau, etc.).

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
- **leçon par leçon**, ce qu'il a terminé et quand (« date inconnue » = terminé avant la mise à jour) ;
- sous chaque formation, **« Exercices faits : X / Y »** : les exercices que l'apprenant a cochés « J'ai fait l'exercice », avec la date.

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
| **Supprimer définitivement ses données** | L'apprenant le demande, ou son accès est terminé depuis plus de 12 mois (engagement de la politique de confidentialité). | **Supprimer les données** (dernier bouton rouge), puis tapez **SUPPRIMER** en majuscules. Son code, sa progression, ses notes, son numéro, vos notes de suivi et ses anciens codes sont effacés. **Irréversible.** Le journal garde l'historique des actions, sans son nom. |

**Rappel automatique :** quand l'accès d'un apprenant est terminé depuis plus de 12 mois, un encadré apparaît en haut
de l'onglet **Apprenants** avec son nom (bouton pour ouvrir sa fiche), et le tableau de bord le signale.

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

## 6. Annonces (onglet **📢 Annonces**)

Pour prévenir vos apprenants : nouvelle leçon en ligne, conseil, live à venir…
1. Écrivez le texte (400 caractères au maximum). L'**aperçu** montre ce que verra l'apprenant.
2. **Pour qui ?** Tous les apprenants, ou seulement ceux d'une formation.
3. **Afficher pendant** 7, 14 ou 30 jours, ou jusqu'à ce que vous la retiriez.
4. **Publier l'annonce**, puis confirmez.

L'annonce apparaît en haut du tableau de bord des apprenants concernés, juste sous « Bonjour… » (3 au maximum, la plus
récente en premier). Chaque apprenant peut la masquer sur son appareil avec la petite croix **×**.
Pour l'arrêter plus tôt : **Retirer**, dans la liste « Annonces publiées ».

---

## 7. Mini-quiz (onglet **❓ Quiz**)

2 ou 3 questions à la fin des leçons importantes, pour que l'apprenant vérifie qu'il a compris.
1. Choisissez la **formation** : toutes ses leçons s'affichent, avec « Pas de quiz » ou « ✓ Quiz de N question(s) ».
2. **Créer un quiz** (ou **Modifier**) sur la leçon voulue.
3. Pour chaque question : écrivez la question, 2 à 4 réponses, **cochez la bonne réponse** (rond à gauche), et si vous
   voulez une **explication** affichée après la réponse.
4. **+ Ajouter une question** (5 au maximum), puis **Enregistrer le quiz**.

Côté apprenant : un onglet **Quiz** apparaît sous la leçon (pas pendant l'essai si la leçon est encore bloquée).
Il répond, puis voit son score, la bonne réponse en vert et votre explication. Il peut le refaire autant qu'il veut.
Dans la liste, vous voyez combien d'apprenants ont répondu et leur **moyenne**.
**Supprimer le quiz** efface aussi les résultats (après confirmation).

---

## 7 bis. Attestations et avis (onglet **🎓 Attestations & avis**)

### Délivrer une attestation (après avoir validé l'exercice final reçu sur WhatsApp)
1. Ouvrez la **fiche** de l'apprenant → partie **Actions** → ligne **« Attestation — [formation] »**
   (une ligne par formation ; elle indique combien de leçons sont terminées).
2. Vérifiez le **nom complet** qui sera écrit sur l'attestation (pré-rempli avec le nom du code ; corrigez-le si besoin).
3. **Délivrer**, puis confirmez (un avertissement s'affiche si toutes les leçons ne sont pas terminées).

L'attestation reçoit un **numéro unique** (ex. `ATT-7K2M-Q9XP`). L'apprenant voit aussitôt une carte **« 🎓 Mon attestation »**
dans son espace et télécharge son **PDF** (avec un code QR). N'importe qui (un employeur, par exemple) peut la vérifier
sur **geoexpertacademy.ci/verifier-certificat.html** avec ce numéro, ou en scannant le code QR.

Pour un pack, délivrez une attestation par formation terminée.
**Révoquer** (dans l'onglet) : la page de vérification indiquera qu'elle n'est plus valable ; vous pourrez en délivrer une nouvelle.

### Avis
Quand un apprenant a terminé toutes les leçons d'une formation, une carte **« Votre avis »** lui propose une note
(1 à 5 étoiles), un commentaire, et une case pour **accepter la publication**.
Dans l'onglet (chiffre rose = nouveaux avis) :
- **Marquer publiable** : seulement si l'apprenant l'a accepté. Puis **Copier** donne le texte prêt à mettre sur le site ou les réseaux.
- **Masquer** : l'avis est mis de côté (vous pouvez le **Réafficher**).

---

## 7 ter. Contenu des formations (onglet **📚 Contenu**)

Choisissez une **formation** : toutes ses leçons s'affichent dans l'ordre.
- **Renommer** : modifiez le titre ; **durée** au format `12:34` (ou `1:02:03`).
- **↑ / ↓** : changer l'ordre.
- **Masquer** : la leçon disparaît pour les apprenants (leur progression est gardée) ; **Afficher** pour la remettre.
- **Supprimer** : à éviter (préférez Masquer) ; la progression des apprenants sur cette leçon ne comptera plus.
- **+ Ajouter une leçon** : titre + durée. Après l'enregistrement, ajoutez sa vidéo dans l'onglet **🎬 Vidéos Bunny**.
- **📎 Joindre un fichier** (10 Mo max., par exemple les données du TP en .zip) : choisissez le fichier, donnez-lui un nom ;
  il apparaît tout de suite dans l'onglet « Exercices » de la leçon chez l'apprenant. **Retirer** pour l'enlever.

Rien ne change chez les apprenants avant **Enregistrer** (une fenêtre résume les changements). Ils voient la nouvelle version
en moins d'une minute. **Annuler les changements** efface ce que vous n'avez pas enregistré.
**Revenir au contenu d'origine** remet la liste de leçons d'origine de cette formation.

⚠️ Pendant l'essai, ce sont **les 3 premières leçons visibles** qui sont ouvertes : si vous changez l'ordre du début d'une
formation, les leçons offertes pendant l'essai changent aussi.

## 7 quater. Gros fichiers : cartes, données d'exercices, projets finaux (stockage R2)

Le bouton « 📎 Joindre un fichier » s'arrête à 10 Mo. Pour un fichier plus gros (par exemple un vieux plan raster de 200 Mo),
on utilise **Cloudflare R2**, un espace de stockage **privé** : personne ne peut y entrer sans passer par l'espace apprenant.
Le Worker vérifie le code d'accès, la formation et le verrou d'essai (les mêmes règles que les autres fichiers), puis
donne au navigateur un lien qui ne marche que **30 minutes**. Ce lien ne contient pas le code de l'apprenant.

**Ce qu'on met dans R2 :** seulement vos propres données. Les images satellites gratuites (Landsat, Sentinel) ne sont
pas stockées : les apprenants les téléchargent à la source.

### Coût : rester gratuit

- Offre gratuite R2 : **10 Go stockés**, 1 million d'envois et 10 millions de lectures par mois. Les téléchargements
  des apprenants (la bande passante) sont **toujours gratuits**.
- L'espace utilisé s'affiche dans **📚 Contenu → 📦 Gros fichiers** (« Espace utilisé : … sur 10 Go gratuits »). La barre
  devient orange après 8 Go : supprimez alors les fichiers inutiles avant d'en déposer d'autres.
- Une **alerte de budget** vous prévient par e-mail si une dépense apparaît (voir plus bas, à faire une seule fois).
- Pour information, au-delà de 10 Go : 0,015 $ par Go et par mois (1 Go de trop = moins de 10 FCFA par mois).

### Activer R2 et régler l'alerte (une seule fois)

1. Tableau de bord Cloudflare → menu de gauche **R2 Object Storage** → **Purchase R2 Plan** / **Activer R2**.
   Cloudflare demande une **carte bancaire ou un compte PayPal** : c'est une vérification. Rien n'est prélevé tant que
   vous restez dans l'offre gratuite.
2. **Alerte de budget :** **Manage Account → Billing → Billable Usage** (ou **Notifications → Add → Budget Alert**) →
   montant **1 $** → votre e-mail. Cloudflare compte la consommation une fois par jour : l'e-mail arrive le lendemain d'un dépassement.
3. Les deux espaces (« buckets ») ont été créés le 26/10/2026 : `geoexpert-fichiers-test` (test) et `geoexpert-fichiers` (vos apprenants).
   ✅ R2 et l'alerte à 1 $ sont activés (26/10/2026) : rien à refaire.
   Ne cliquez **jamais** sur « Public access », « r2.dev » ou « Custom domain » dans les réglages d'un bucket : ils doivent rester privés.

### Déposer un gros fichier

**Par le tableau de bord (le plus simple, jusqu'à environ 300 Mo) :**
1. **R2 Object Storage** → bucket **`geoexpert-fichiers`** (ou `geoexpert-fichiers-test` pour essayer).
2. **Upload** → choisissez le fichier. Donnez-lui un nom clair, **sans espaces ni accents**, avec un dossier par formation,
   par exemple `qgis1/plan-ancien-1950.tif` ou `projets/projet-final-donnees.zip`.

**Par le Terminal (Claude lance la commande pour vous, jusqu'à 315 Mo) :**
```
npx wrangler r2 object put "geoexpert-fichiers/qgis1/plan-ancien-1950.tif" --file "C:\chemin\du\fichier.tif" --remote
```
Au-delà de 300 Mo, demandez à Claude : il utilise un outil d'envoi en plusieurs morceaux.

### Rattacher le fichier à une leçon

1. Admin → **📚 Contenu** → choisissez la formation.
2. Sous la leçon : **📦 Rattacher un gros fichier** → choisissez le fichier dans la liste → donnez le **nom que verront les apprenants**
   (ex. « Plan ancien de 1950 »).
3. C'est tout : il apparaît dans l'onglet « Exercices » de la leçon chez l'apprenant, avec sa taille
   (« Plan ancien de 1950 (200 Mo) »), et se télécharge avec le bouton **Télécharger** comme les autres fichiers.

- **Retirer** (à côté du fichier) : les apprenants ne le voient plus, mais il **reste dans R2** (et compte dans les 10 Go).
  Pour le supprimer vraiment : tableau de bord → R2 → bucket → fichier → **Delete**.
- Le tableau « Gros fichiers » indique pour chaque fichier la leçon où il est rattaché ; « Aucune leçon » en orange = fichier inutilisé.
- Un même fichier peut être rattaché à plusieurs leçons sans prendre plus de place.

---

## 7 quinquies. Mes ressources (onglet **📂 Ressources**)

Les documents de la rubrique **« Mes ressources »** de l'espace apprenant : livret d'accueil, kit de démarrage SIG,
guide pratique, cours PDF de chaque formation. Chaque document téléchargé porte en bas de page
« Document réservé à [Prénom Nom] – [code] – GeoExpert Academy » : vous n'avez rien à faire, c'est automatique.

### Ajouter une ressource

1. Admin → **📂 Ressources** → carte **➕ Ajouter une ressource**.
2. **Titre** (ce que verra l'apprenant), **type** (PDF, ou page HTML pour un document à imprimer), **position** dans la liste
   (plus le nombre est petit, plus elle est haut), **description** en une phrase.
3. **Déblocage** :
   - *Dès la première connexion* : disponible tout de suite ;
   - *À partir du 8e jour* : comme les leçons (et tout de suite pour les anciens codes, qui n'ont pas de période d'essai).
4. **Pour qui ?** : *Tous les apprenants*, une formation (seuls ceux qui l'ont achetée la voient), ou *Pack complet uniquement*.
5. **Fichier** : choisissez le PDF sur votre ordinateur. Laissez **Visible par les apprenants** coché (décochez pour la préparer sans la montrer).
6. **Ajouter la ressource**. Le PDF est préparé dans votre navigateur (quelques secondes) puis envoyé.
   Votre fichier d'origine n'est pas modifié.

- Un PDF protégé par un mot de passe est refusé : enregistrez-en une copie sans protection.
- Une page HTML doit contenir `%%RESERVE%%` à l'endroit du nom (c'est déjà le cas du livret et du guide, dans
  `ressources/livret-accueil-video.html` et `ressources/guide-cartographie-video.html` ; après une modification, préparez-les avec
  `node ressources-html.mjs <fichier> <sortie>` dans GeoExpert-Outils pour intégrer les images, puis envoyez la sortie).

### Remplacer, modifier ou retirer

Cliquez sur la ressource dans la liste :
- **⬆️ Remplacer le fichier** : nouvelle version (l'ancienne est supprimée du stockage) ;
- changez le titre, la description, le déblocage, « pour qui » ou **Visible par les apprenants**, puis **Enregistrer les réglages** ;
- **Retirer** : elle disparaît pour tous les apprenants et son fichier est supprimé (confirmation demandée).

Badges : **Retenue** = invisible pour les apprenants ; **Pas de fichier** = l'apprenant voit « Bientôt ».
Actuellement retenues : Webmapping, KoboToolbox et Projet final (formations en pause). Pour les publier : remplacez le fichier
par la version finale, cochez **Visible par les apprenants**, puis **Enregistrer les réglages**.

Ce que voit l'apprenant : une carte par ressource, avec **Télécharger le PDF** (ou **Ouvrir le document** pour le livret et le guide,
qui s'ouvrent dans un nouvel onglet avec un bouton « Imprimer / Enregistrer en PDF »). Une ressource pas encore débloquée affiche
un cadenas et « Disponible à partir du [date] ». Le blocage est fait par le serveur : même avec l'adresse d'un fichier, un apprenant
ne peut pas télécharger une ressource bloquée ou d'une formation qu'il n'a pas achetée.

## 7 sexies. Charte de l'apprenant : qui l'a acceptée ?

À sa première connexion (et à chaque nouvelle version), l'apprenant lit la charte dans une fenêtre, coche
« J'ai lu la charte de l'apprenant et je l'accepte » puis clique sur **Accéder à ma formation**. Tant qu'il ne l'a pas fait,
ses leçons et ses ressources ne s'ouvrent pas (il garde son accès et sa progression).

- **Tous les apprenants d'un coup** : Admin → **📂 Ressources** → carte **📜 Charte de l'apprenant** : combien l'ont acceptée,
  combien pas encore, et la liste (nom, code, « Acceptée le … à …, version 1.0 » ou « Pas encore acceptée ») avec un bouton **Fiche**.
- **Un apprenant** : sa fiche (bouton **Fiche**) affiche juste sous les dates « 📜 Charte acceptée le [date et heure], version [x] »,
  ou « Charte pas encore acceptée ».
- Texte public : geoexpertacademy.ci/charte-apprenant.html ; l'apprenant la relit aussi dans « Mes ressources ».
- Changer le texte de la charte = demander à Claude : nouveau texte dans `worker/charte.js` + **nouveau numéro de version**
  (tout le monde devra l'accepter à nouveau) + `node charte-page.mjs` pour la page du site.

## 7 septies. Rendez-vous live et Communauté (onglet **🎥 Lives & communauté**)

**Programmer un live** : sujet, date, heure **d'Abidjan**, durée, lien de la réunion Microsoft Teams (vous pouvez l'ajouter plus tard),
formations concernées (aucune case = tout le monde) → **Programmer le live** → confirmez.
- Les apprenants concernés (essai compris) le voient dans « Rendez-vous live » et, la semaine du live, dans une petite bande
  du tableau de bord. Ils peuvent l'**ajouter à leur agenda** (fichier .ics, rappel 30 min avant).
- Le **lien Teams** n'est donné qu'aux apprenants concernés et connectés, à partir de **30 minutes avant** le début, jusqu'à la fin.
- **Modifier** : change l'heure, le sujet, le lien… · **Annuler le live** : les apprenants voient « Annulé » (prévenez-les
  aussi par une annonce) ; **Rétablir** le remet.
- **Replay** : après le live, **Ajouter le replay** → collez l'identifiant de la vidéo **Bunny** (conseillé : protégée comme les
  leçons, avec le filigrane) ou un lien https. Il apparaît dans « Rendez-vous live » et dans « Mes ressources ».

**Communauté WhatsApp** : collez le lien d'invitation (`https://chat.whatsapp.com/…`) → **Enregistrer le lien**. L'entrée
« Communauté » (présentation, règles, avertissement sur le numéro visible) apparaît alors chez les apprenants connectés.
Champ vide + Enregistrer = l'entrée disparaît.

**Vitesse de lecture** (rien à régler) : sous chaque vidéo, l'apprenant choisit 0,75x à 2x ; son choix est gardé sur son appareil.
Si le lecteur ne répond pas, un message l'invite à utiliser la roue dentée ⚙ du lecteur Bunny.

---

## 7 octies. Portfolio, parrainage, avis publiés, partage des attestations

**🗺️ Portfolio** (le chiffre rose = cartes à voir) : les apprenants déposent leurs cartes (JPG, PNG ou PDF, 5 Mo maximum)
dans « Mon portfolio ». Pour chaque carte : **Voir en grand**, **Commenter** (l'apprenant lit votre commentaire),
**Valider**, **À revoir**, **Supprimer** (définitif). Une carte **validée ET autorisée** par l'apprenant apparaît sur la page
publique **Réalisations des apprenants** (geoexpertacademy.ci/realisations-apprenants.html) avec son prénom et l'initiale
de son nom. S'il décoche l'accord ou supprime la carte, elle disparaît du site en quelques minutes.

**🤝 Parrainage** (le chiffre rose = récompenses prêtes) : chaque apprenant a un code et un lien dans « Mes parrainages ».
Le filleul indique le code pendant ses **7 premiers jours** (le serveur refuse son propre code, le même nom, le même numéro
WhatsApp, un parrain inscrit après lui, le parrainage croisé).
- **Accorder la récompense** ne s'active qu'**après les 7 jours d'essai** du filleul et si son accès est actif.
  Avant de cliquer, vérifiez qu'il n'a pas été **remboursé** (si vous avez désactivé son accès, c'est refusé automatiquement).
- Récompense (réglable en bas de l'onglet) : au départ, **Google Earth Pro offerte** ; si le parrain l'a déjà,
  **1 mois d'assistance** en plus (sa date de fin d'assistance recule d'un mois). Prévenez-le ensuite sur WhatsApp.
- **Refuser** : en cas d'abus (même personne, remboursement…).

**Avis** (onglet 🎓 Attestations & avis) : **Publier sur le site** affiche l'avis sous les témoignages de la page des formations
vidéo, avec le prénom, l'initiale du nom et la profession, **sans changer un mot**. Possible seulement si l'apprenant a coché
l'accord ; il peut le retirer dans « Mon portfolio » → l'avis disparaît du site. **Retirer du site** le retire aussi.

**Attestations** : sous chaque attestation, l'apprenant a maintenant **Partager : LinkedIn, Facebook, WhatsApp, Copier le lien**.
L'aperçu montre son nom, la formation et la date ; le lien mène à « Vérifier un certificat ». Il n'existe aucune liste des diplômés.

## 7 nonies. Aide et « Et après ? » (onglet **❔ Aide & « Et après ? »**)

**Aide** : les apprenants ont une entrée **« Aide »** en bas de la colonne de gauche. Ils y trouvent les questions fréquentes
(une recherche en haut, un clic ouvre la réponse) et, en bas, le bouton **« Écrire au formateur sur WhatsApp »**. Le message est déjà
rempli avec leur nom, leur formation et la page où ils étaient (ex. le titre de la leçon).
- Modifier une question ou une réponse : changez le texte, puis **Enregistrer l'aide**. Entrée = nouvelle ligne dans la réponse.
- **➕ Ajouter une question**, **↑ ↓** pour changer l'ordre, **Supprimer**. Rien ne change pour les apprenants avant « Enregistrer ».
- **Revenir au contenu de départ** remet les 7 questions d'origine (on vous demande de confirmer).

**« Et après ? »** : quand un apprenant a terminé toutes les leçons d'une formation, une carte apparaît sur son tableau de bord.
Elle propose la suite avec le **prix du site** et le **lien de paiement habituel** (bouton « Je m'inscris »).
- Tableau : pour chaque formation terminée, choisissez la 1re et la 2e proposition (2 au maximum), puis **Enregistrer les recommandations**.
- Une formation qu'il possède déjà (ou un pack qui en contient une) n'est **jamais** proposée : la carte passe à la proposition suivante,
  ou n'apparaît pas.
- **Offre spéciale** : aucune au départ. Pour faire une réduction, créez d'abord **dans DigitalPaye un lien au prix réduit**, puis tapez
  le prix et collez ce lien. L'apprenant voit l'ancien prix barré. ⚠️ Ces paiements arrivent dans « 💳 Paiements reçus » en
  **« À vérifier »** : créez le code avec le bouton habituel. Pour arrêter l'offre, videz les deux cases et enregistrez.

---

## 8. Ce que l'apprenant voit de nouveau (phases 2 et 3, ressources et charte)

- **Mes progrès** (sous « Vos modules ») : objectif de la semaine qu'il choisit (1 à 7 leçons) avec une jauge,
  nombre de **semaines actives d'affilée**, et 5 **badges** liés à de vraies étapes (1re leçon, 1er chapitre terminé,
  1er exercice fait, 4 semaines d'affilée, formation terminée).
- **Mes notes** (colonne de gauche, sous « Tableau de bord ») : toutes ses notes, leçon par leçon.
- **J'ai fait l'exercice** : une case sous chaque exercice ; vous le voyez dans sa fiche.
- **Économie de données** : une case sous la vidéo ; la qualité est limitée à la taille de l'écran (beaucoup moins de
  données sur téléphone). Elle se coche toute seule si le téléphone signale une connexion lente.
- **Mon attestation** (phase 3) : carte dans « Attestation et assistance », après les deux cartes habituelles ; PDF + lien de vérification.
- **Votre avis** (phase 3) : carte au même endroit, quand une formation est terminée.
- **Fichiers de la leçon** (phase 3) : dans l'onglet « Exercices » de la leçon, avant les exercices du module.
- **Mes ressources** (colonne de gauche, sous « Mes notes ») : livret, kit, guide, cours PDF à son nom, et la charte.
- **Charte de l'apprenant** : fenêtre à la 1re connexion et à chaque nouvelle version (voir 7 sexies).
- **Rendez-vous live**, **Communauté** et **vitesse de lecture** : voir 7 septies.

---

## 9. Exporter la liste des apprenants (Excel)

1. Onglet **👥 Apprenants** → bouton **📥 Exporter la liste (Excel / CSV)**.
2. Un fichier `apprenants-geoexpert-AAAA-MM-JJ.csv` est téléchargé. Ouvrez-le avec Excel (double-clic) : les colonnes et
   les accents s'affichent correctement.
3. Colonnes : nom, code, numéro WhatsApp, formations, statut, dates (création, 1re connexion, fin d'essai, fin d'accès,
   fin d'assistance), leçons terminées, total, progression, exercices faits, dernière visite, connexions, relances à faire.

Ce fichier contient des données personnelles : gardez-le pour vous, ne l'envoyez pas, supprimez-le quand vous n'en avez plus besoin.
Chaque export est inscrit dans le Journal.

---

## 10. Limite de tentatives

Si un mauvais mot de passe administrateur est entré **5 fois en 15 minutes** depuis la même connexion internet,
l'administration est bloquée **15 minutes** pour cette connexion (même avec le bon mot de passe).
Chaque mot de passe faux apparaît en rouge dans le **Journal**.

**Si vous vous êtes bloqué vous-même :** attendez 15 minutes, ou changez de connexion (Wi-Fi ↔ données mobiles).

---

## 11. Journal d'activité

Onglet **📜 Journal** de l'administration : tout ce qui a été fait, du plus récent au plus ancien
(300 dernières actions) avec la date, l'action, l'apprenant concerné, le détail et l'adresse e-mail de la personne connectée.

Actions enregistrées : code créé, code désactivé / réactivé, accès prolongé, tout débloqué, module ajouté,
code remplacé (perdu), vidéos Bunny modifiées, fichier d'exercice envoyé, note de suivi ajoutée / supprimée (sans son texte), numéro WhatsApp enregistré / supprimé, relance faite, liste exportée, annonce publiée / retirée, quiz enregistré / supprimé, attestation délivrée / révoquée, avis publiable / masqué, contenu modifié, fichier de leçon envoyé / retiré, données d'un apprenant supprimées, mot de passe incorrect.
