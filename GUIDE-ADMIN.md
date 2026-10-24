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
- Version réelle : sera créée au moment de la mise en ligne (même principe).

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

## 2. Limite de tentatives

Si un mauvais mot de passe administrateur est entré **5 fois en 15 minutes** depuis la même connexion internet,
l'administration est bloquée **15 minutes** pour cette connexion (même avec le bon mot de passe).
Chaque mot de passe faux apparaît en rouge dans le **Journal**.

**Si vous vous êtes bloqué vous-même :** attendez 15 minutes, ou changez de connexion (Wi-Fi ↔ données mobiles).

---

## 3. Journal d'activité

Onglet **📜 Journal** de l'administration : tout ce qui a été fait, du plus récent au plus ancien
(300 dernières actions) avec la date, l'action, l'apprenant concerné, le détail et l'adresse e-mail de la personne connectée.

Actions enregistrées : code créé, code désactivé / réactivé, accès prolongé, tout débloqué, module ajouté,
vidéos Bunny modifiées, fichier d'exercice envoyé, mot de passe incorrect.
