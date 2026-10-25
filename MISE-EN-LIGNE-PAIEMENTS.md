# Paiements automatiques DigitalPaye : test, mise en ligne et retour en arrière

> 👤 = étape à faire par vous. **Ne collez jamais une clé, un secret ou un mot de passe dans la conversation** :
> les commandes ci-dessous vous les demandent directement, et ils restent chez Cloudflare.

## Ce qui change

- Le Worker des apprenants reçoit les webhooks de DigitalPaye sur une nouvelle adresse : `/webhook/digitalpaye`.
  Chaque webhook est **vérifié** (signature HMAC-SHA256 avec votre secret), puis le paiement est **confirmé auprès de
  l'API DigitalPaye** (statut, montant, client, lien payé) avant d'être enregistré. Un faux webhook ne crée jamais de paiement.
- Nouvelle table `paiements` dans la base (rien d'ancien n'est modifié).
- Administration : nouvel onglet **💳 Paiements reçus** + bandeau « X code(s) à envoyer » sur le tableau de bord.
  Les autres écrans ne changent pas.
- Site : seule la politique de confidentialité change (informations de paiement reçues de DigitalPaye).
- **Rien ne change pour vos clients** : même lien de paiement, même redirection vers l'espace apprenant, code toujours envoyé par WhatsApp.

## Partie A — Test complet dans la Sandbox (sans argent réel)

Le Worker de test est déjà en ligne avec la nouveauté : `https://espace-apprenant-api-test.geographe07.workers.dev`
(administration de test : `https://geoexpert-admin-test.geographe07.workers.dev`).

| # | Qui | Étape |
|---|---|---|
| A1 | 👤 | DigitalPaye → en haut du menu, choisissez **SANDBOX**. Allez dans **Clés API** : créez (ou affichez) une clé de test `pk_test_…` et son **secret**. Repérez aussi l'endroit où se règle l'**URL de webhook** et son **secret de signature** (voir la note ci-dessous). |
| A2 | 👤 | Dans un terminal, installez les 3 secrets sur le Worker **de test** (chaque commande vous demande la valeur ; collez-la puis Entrée) : voir les commandes ci-dessous. |
| A3 | 👤 | Toujours en SANDBOX → **Clés API** → URL de webhook : `https://espace-apprenant-api-test.geographe07.workers.dev/webhook/digitalpaye`. Si on vous demande les événements : cochez au moins `transaction.successful` (et `payment_link.paid` s'il existe). |
| A4 | 👤 | En SANDBOX → **Liens de paiement** : créez un lien « Test Google Earth » à **10 000 F**. Donnez-moi la fin de son adresse (ce qui suit `/pay/`) : ce n'est pas un secret. Je l'ajoute au Worker de test pour qu'il soit reconnu comme Google Earth. |
| A5 | 👤 | Ouvrez ce lien et payez avec le numéro de test **0700000000** (réussi), puis une 2e fois avec **0700000001** (échoué). |
| A6 | 👤 + Claude | Administration de test → **💳 Paiements reçus** : le paiement réussi apparaît en « Code à envoyer », l'échoué n'apparaît pas. Cliquez sur **Créer le code et envoyer sur WhatsApp**. Dans DigitalPaye → **Webhooks** → **Voir** : on lit ensemble le contenu exact reçu, et la réponse 200 de notre serveur. |

**Commandes de l'étape A2** (dans le dossier `C:\Users\HP\Documents\GeoExpert-Outils`) :

```
npx wrangler secret put DP_API_KEY -c ..\GitHub\geoexpert-academy\worker\wrangler-test.toml
npx wrangler secret put DP_API_SECRET -c ..\GitHub\geoexpert-academy\worker\wrangler-test.toml
npx wrangler secret put DP_WEBHOOK_SECRET -c ..\GitHub\geoexpert-academy\worker\wrangler-test.toml
```

- `DP_API_KEY` : la clé publique (`pk_test_…` en Sandbox, `pk_live_…` en Production), dans **Clés API**.
- `DP_API_SECRET` : le secret de cette même clé, dans **Clés API** (souvent affiché une seule fois à la création).
- `DP_WEBHOOK_SECRET` : le secret qui signe les webhooks. **Note :** la page Webhooks indique « POST JSON signé en
  HMAC-SHA256 (en-tête X-DigitalPaye-Signature) » et renvoie vers **Clés API** pour l'URL. Le secret de signature
  devrait s'y trouver, à côté de l'URL de webhook. S'il n'apparaît nulle part, demandez au support DigitalPaye :
  *« Quel secret est utilisé pour la signature HMAC-SHA256 de l'en-tête X-DigitalPaye-Signature : un secret de webhook
  dédié, ou le secret de la clé API ? »*

Tant que ces 3 secrets ne sont pas installés, l'adresse répond « non configurée » (503) et n'enregistre rien.

## Partie B — Mise en ligne (après votre accord, une fois la partie A réussie)

| # | Qui | Étape | Effet pour les apprenants |
|---|---|---|---|
| B1 | Claude | Nouvelle sauvegarde complète de la production (KV + base D1) | aucun |
| B2 | Claude | Ajout de la table `paiements` dans `geoexpert-prod` | aucun |
| B3 | Claude | Mise à jour de `geoexpert-admin` puis de `espace-apprenant-api` ; vérification de la connexion apprenant et d'une vidéo | aucune coupure |
| B4 | 👤 | En **PRODUCTION** dans DigitalPaye → **Clés API** : clé `pk_live_…`, son secret et le secret de webhook. Installez-les sur le Worker **de production** (mêmes commandes qu'en A2, avec `wrangler-prod.toml` à la place de `wrangler-test.toml`). | aucun |
| B5 | 👤 | En **PRODUCTION** → **Clés API** → URL de webhook : `https://espace-apprenant-api.geographe07.workers.dev/webhook/digitalpaye` | aucun |
| B6 | 👤 + Claude | DigitalPaye → **Webhooks** → **Envoyer un test** : la livraison doit apparaître avec la réponse 200. | aucun |
| B7 | Claude (+ 👤 connexion GitHub si demandée) | Publication du site (politique de confidentialité) : fusion de la branche `paiements` dans `main` | nouvelle politique en 1 à 2 minutes |
| B8 | 👤 | Au premier vrai paiement : il apparaît dans **💳 Paiements reçus** ; créez le code avec le bouton. | le client reçoit son code comme avant |

Les paiements de la Sandbox sont **refusés** par la production (ils ne peuvent pas y créer de code).

## Revenir en arrière

| Partie | Comment | Qui |
|---|---|---|
| **Arrêter la réception tout de suite** | DigitalPaye → **Clés API** → effacer l'URL de webhook. Vous reprenez la méthode d'avant (onglet « Nouvel accès »). | Vous |
| **Worker des apprenants** | Cloudflare → `espace-apprenant-api` → **Deployments** → **Rollback** vers `76f93681-bae3-40d1-ab96-3655a9e50aa2` (fin de phase 3). | Vous ou Claude |
| **Administration** | Même chose sur `geoexpert-admin`, vers `e6713b5d-4009-404f-b0a6-f62917971b69`. | Vous ou Claude |
| **Site** | Annuler la fusion sur `main` (« revert »). État d'avant : étiquette git `sauvegarde-avant-paiements`. | Claude (ou GitHub Desktop → History → « Revert ») |
| **Données** | Une table ajoutée (`paiements`) ; rien d'ancien n'est transformé. Sauvegarde : `GeoExpert-Sauvegardes\2026-10-25-avant-paiements\`. Les codes déjà créés restent valables. | Claude |
| **Secrets** | `npx wrangler secret delete DP_WEBHOOK_SECRET -c ..\GitHub\geoexpert-academy\worker\wrangler-prod.toml` (idem pour `DP_API_KEY` et `DP_API_SECRET`) | Vous ou Claude |

## Tests réalisés (Worker local + faux serveur DigitalPaye) : 49 / 49

`GeoExpert-Outils\test-paiements.mjs` (`node tests-locaux.mjs test-paiements.mjs`) : webhook authentique enregistré ;
faux webhooks refusés (signature fausse, absente, autre secret, contenu modifié) ; webhook signé mais inconnu ou échoué
selon l'API : rien d'enregistré ; même webhook 2 fois et 3 envois simultanés : un seul paiement ; échoué, annulé, Sandbox en
production : ignorés ; « pas encore confirmé » : DigitalPaye réessaie ; les 11 liens du site → la bonne formation au bon prix ;
lien inconnu / non transmis / montant trop faible : « À vérifier » ; double clic : un seul code ; pack = 8 formations, essai,
24 mois ; formation seule = 12 mois ; WhatsApp ouvert vers le bon numéro avec **exactement** le message demandé ;
sans numéro : message à copier ; Ignorer ; compteurs ; téléphone sans débordement ; journal sans nom de client ;
suppression des données de l'apprenant = paiement supprimé aussi.
Captures : `geoexpert-captures\avant-paiements\` et `geoexpert-captures\apres-paiements\`.
