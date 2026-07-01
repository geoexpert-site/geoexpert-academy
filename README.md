# GeoExpert Academy & Consulting — Site web

## Ce qui est prêt

- **Page unique** (`index.html`) avec : Accueil, Pour qui (positionnement multi-métiers),
  Formations disponibles, Vidéos, Réalisations (cartes), Inscription, Contact.
- **Formulaire d'inscription** : ne stocke rien pour l'instant — il ouvre WhatsApp avec un
  message pré-rempli (nom, téléphone, formation choisie). Zéro friction, zéro serveur.
- Bouton **WhatsApp** flottant dans l'en-tête et section contact.
- Design sombre, accents teal/violet/or, cohérent avec votre identité GeoExpert.

## À compléter avant publication

1. **Formations placeholder** (`index.html`, section `#formations`) : remplacez les deux
   cartes "À compléter" par vos vraies formations (titre, durée, prix, programme).
2. **Vidéos** (`index.html`, section `#videos`) : remplacez `VOTRE_ID_VIDEO_1/2/3` par
   l'identifiant de vos vidéos YouTube.
   - Mettez la vidéo en **"Non répertoriée"** sur YouTube (pas "Privée" — sinon elle ne
     s'affiche pas sur le site).
   - L'identifiant est la partie après `v=` dans l'URL YouTube, ex :
     `https://youtube.com/watch?v=ABC123` → ID = `ABC123`
   - Remplacez dans le code : `src="https://www.youtube.com/embed/ABC123"`
3. **Cartes réalisées** (section `#realisations`) : remplacez les 4 blocs `.map-placeholder`
   par de vraies images : `<img src="images/carte1.jpg" alt="...">` à la place du `<div>`.
4. Vérifiez le numéro WhatsApp (`2250787015030`) et l'email à 3 endroits :
   `index.html` (liens `wa.me`) et `script.js` (`WHATSAPP_NUMBER`).

## Déployer sur GitHub Pages (gratuit)

1. Créez un dépôt GitHub, ex. `geoexpert-site`.
2. Ajoutez les 3 fichiers (`index.html`, `style.css`, `script.js`) à la racine.
3. Dans le dépôt : **Settings → Pages → Branch: main → Save**.
4. Votre site sera en ligne à `https://votre-pseudo.github.io/geoexpert-site/`
   (quelques minutes après activation).
5. Ensuite, possibilité d'ajouter un nom de domaine personnalisé dans les mêmes réglages.

## Phase 2 — Comptes apprenants avec Supabase (quand vous serez prêt)

Supabase est recommandé car il fournit une base de données PostgreSQL + un système
d'authentification prêts à l'emploi, sans serveur à gérer — adapté à un premier projet
avec base de données.

Grandes étapes (à faire quand vous aurez avancé dans votre apprentissage JS) :

1. Créer un compte gratuit sur supabase.com et un nouveau projet.
2. Créer une table `apprenants` (nom, téléphone, email, formation, date_inscription).
3. Activer l'authentification par email ou téléphone dans Supabase Auth.
4. Dans `script.js`, remplacer l'envoi WhatsApp par un appel à l'API Supabase
   (`supabase.from('apprenants').insert(...)`) — on peut garder le message WhatsApp
   en plus, comme confirmation.
5. Ajouter une page "Espace apprenant" avec connexion, qui affiche les formations
   auxquelles l'apprenant est inscrit et les vidéos correspondantes.

Je peux vous accompagner étape par étape sur cette phase 2 le moment venu — ce sera
une bonne continuation naturelle de votre feuille de route Leaflet/Chart.js.
