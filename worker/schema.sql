-- Base D1 de l'espace apprenant (nouvelles données uniquement ; les codes d'accès restent dans KV).
-- "code" = code d'accès sans tirets ni préfixe GEO (12 caractères).
-- Peut être rejoué sans risque : rien n'est supprimé.

-- Leçons terminées. done_at = date de fin (ms) ; 1 = date inconnue (progression reprise d'un ancien téléphone).
CREATE TABLE IF NOT EXISTS progress (
  code TEXT NOT NULL,
  k TEXT NOT NULL,
  done_at INTEGER NOT NULL,
  PRIMARY KEY (code, k)
);

-- Notes personnelles par leçon.
CREATE TABLE IF NOT EXISTS notes (
  code TEXT NOT NULL,
  k TEXT NOT NULL,
  text TEXT NOT NULL,
  updated INTEGER NOT NULL,
  PRIMARY KEY (code, k)
);

-- Index des codes d'accès (le contenu reste dans KV) : affichage immédiat des nouveaux codes dans l'admin.
CREATE TABLE IF NOT EXISTS codes (
  code TEXT PRIMARY KEY,
  created INTEGER
);

-- Notes privées de suivi écrites par l'administrateur (jamais visibles par l'apprenant).
CREATE TABLE IF NOT EXISTS admin_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  t INTEGER NOT NULL,
  who TEXT,
  text TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_notes_code ON admin_notes (code, t);

-- Numéro WhatsApp de l'apprenant (facultatif), pour les relances. Jamais envoyé à l'espace apprenant.
CREATE TABLE IF NOT EXISTS contacts (
  code TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  updated INTEGER
);

-- Relances faites par l'administrateur (bienvenue, pas commencé, essai, inactif, félicitations).
CREATE TABLE IF NOT EXISTS relances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  kind TEXT NOT NULL,
  t INTEGER NOT NULL,
  who TEXT
);
CREATE INDEX IF NOT EXISTS relances_code ON relances (code, kind, t);

-- Annonces du formateur, affichées sur le tableau de bord des apprenants.
-- module vide = toutes les formations ; until = date de fin d'affichage (0 = sans fin).
CREATE TABLE IF NOT EXISTS annonces (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  t INTEGER NOT NULL,
  who TEXT,
  text TEXT NOT NULL,
  module TEXT NOT NULL DEFAULT '',
  until INTEGER NOT NULL DEFAULT 0
);

-- Journal d'activité de l'administration (qui a fait quoi et quand).
CREATE TABLE IF NOT EXISTS journal (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  t INTEGER NOT NULL,
  who TEXT,
  action TEXT NOT NULL,
  code TEXT,
  label TEXT,
  detail TEXT
);

-- Mots de passe administrateur faux (limite de tentatives). Effacé après 24 h.
CREATE TABLE IF NOT EXISTS admin_fails (
  ip TEXT NOT NULL,
  t INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_fails_ip ON admin_fails (ip, t);

-- Exercices que l'apprenant a cochés « J'ai fait l'exercice » (done_at = date).
CREATE TABLE IF NOT EXISTS exercises (
  code TEXT NOT NULL,
  k TEXT NOT NULL,
  done_at INTEGER NOT NULL,
  PRIMARY KEY (code, k)
);

-- Mini-quiz d'une leçon (contenu écrit dans l'administration). data = JSON
-- [{ "q": question, "choices": [2 à 4 réponses], "answer": index de la bonne, "explain": explication facultative }]
CREATE TABLE IF NOT EXISTS quizzes (
  k TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated INTEGER,
  who TEXT
);

-- Dernier résultat de chaque apprenant à chaque quiz.
CREATE TABLE IF NOT EXISTS quiz_results (
  code TEXT NOT NULL,
  k TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  t INTEGER NOT NULL,
  PRIMARY KEY (code, k)
);

-- Contenu modifié dans l'administration (une seule ligne, id = 1). data = JSON
-- { "modules": { "qgis1": [ { "k", "title", "dur", "hidden"?, "files"?: [{ "k", "title" }] }, ... ] }, "maxNum": { "qgis1": 21 } }
-- Une formation absente de « modules » garde la liste de leçons écrite dans le code.
CREATE TABLE IF NOT EXISTS content (
  id INTEGER PRIMARY KEY,
  data TEXT NOT NULL,
  updated INTEGER,
  who TEXT
);

-- Attestations de fin de formation (une par formation terminée), vérifiables publiquement par leur numéro.
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  module TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  hours TEXT,
  t INTEGER NOT NULL,
  who TEXT,
  revoked INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS certificates_code ON certificates (code);

-- Avis de fin de formation. consent = 1 si l'apprenant accepte la publication ; status : nouveau / publiable / masque.
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  module TEXT NOT NULL,
  name TEXT,
  stars INTEGER NOT NULL,
  text TEXT,
  consent INTEGER NOT NULL DEFAULT 0,
  t INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'nouveau'
);

-- Préférences de l'apprenant : objectif de la semaine (nombre de leçons, 0 = pas d'objectif).
CREATE TABLE IF NOT EXISTS prefs (
  code TEXT PRIMARY KEY,
  goal INTEGER NOT NULL DEFAULT 0,
  updated INTEGER
);

-- Une ligne par apprenant : dernière leçon ouverte et dernière activité.
CREATE TABLE IF NOT EXISTS learners (
  code TEXT PRIMARY KEY,
  last TEXT,
  last_activity INTEGER
);

-- Paiements reçus de DigitalPaye (webhook vérifié + confirmé par l'API). Une ligne par transaction (ref = référence DigitalPaye).
-- statut : a_envoyer (code à créer et envoyer) / envoye (code créé) / a_verifier (formation non reconnue, aucun code créé) / ignore.
-- Seulement le nécessaire : prénom, nom, téléphone, montant, lien payé, formation. Supprimé avec les données de l'apprenant (code).
CREATE TABLE IF NOT EXISTS paiements (
  ref TEXT PRIMARY KEY,
  t INTEGER NOT NULL,
  recu INTEGER NOT NULL,
  prenom TEXT,
  nom TEXT,
  phone TEXT,
  montant INTEGER,
  lien TEXT,
  product TEXT,
  statut TEXT NOT NULL,
  raison TEXT,
  code TEXT,
  envoye_t INTEGER,
  who TEXT
);
CREATE INDEX IF NOT EXISTS paiements_statut ON paiements (statut);
CREATE INDEX IF NOT EXISTS paiements_code ON paiements (code);

-- Codes dont les données ont été supprimées (bouton « Supprimer définitivement ses données ») : le code seul, sans
-- aucune donnée personnelle. Sert à ne pas remettre un code supprimé dans l'index « codes » pendant les ~60 s où la
-- liste KV le montre encore.
CREATE TABLE IF NOT EXISTS codes_supprimes (
  code TEXT PRIMARY KEY,
  t INTEGER NOT NULL
);

-- Mes ressources (livret d'accueil, kit, guide, cours PDF…) : réglées dans l'onglet « 📂 Ressources » de l'administration.
-- kind : pdf | html · r2 : fichier dans R2 (« ressources/<id>/… », bucket privé) · stamp : zones de marquage du nom (PDF)
-- regle : immediat (dès la 1re connexion) | j8 (comme les leçons : 8e jour d'essai, tout de suite pour les anciens codes)
-- pour : '' (tous) | formation (qgis1…) | produit (pack-complet) · visible : 0 = retenue (invisible pour les apprenants)
CREATE TABLE IF NOT EXISTS ressources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  descr TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL,
  r2 TEXT NOT NULL DEFAULT '',
  size INTEGER NOT NULL DEFAULT 0,
  stamp TEXT NOT NULL DEFAULT '',
  regle TEXT NOT NULL,
  pour TEXT NOT NULL DEFAULT '',
  ordre INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1,
  updated INTEGER NOT NULL DEFAULT 0,
  who TEXT NOT NULL DEFAULT ''
);

-- Acceptation de la charte de l'apprenant : code, version, date et heure. Une ligne par version acceptée.
-- Suit l'apprenant si son code est remplacé ; supprimée avec ses données.
CREATE TABLE IF NOT EXISTS chartes (
  code TEXT NOT NULL,
  version TEXT NOT NULL,
  t INTEGER NOT NULL,
  PRIMARY KEY (code, version)
);

-- Rendez-vous live (onglet « 🎥 Lives » de l'administration). t : début (ms, heure d'Abidjan = UTC) · dur : minutes
-- modules : '' (toutes les formations) ou clés séparées par des virgules (qgis1,arc1…) · statut : prevu | annule
-- meet : lien Google Meet (jamais envoyé à la connexion : seulement par /api/live-link, 30 min avant, aux apprenants concernés)
-- replay : identifiant de vidéo Bunny ou lien https, ajouté après le live
CREATE TABLE IF NOT EXISTS lives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  t INTEGER NOT NULL,
  dur INTEGER NOT NULL DEFAULT 60,
  sujet TEXT NOT NULL,
  meet TEXT NOT NULL DEFAULT '',
  modules TEXT NOT NULL DEFAULT '',
  statut TEXT NOT NULL DEFAULT 'prevu',
  replay TEXT NOT NULL DEFAULT '',
  updated INTEGER NOT NULL DEFAULT 0,
  who TEXT NOT NULL DEFAULT ''
);

-- Réglages simples de l'administration (ex. « communaute » = lien d'invitation à la Communauté WhatsApp).
CREATE TABLE IF NOT EXISTS reglages (
  k TEXT PRIMARY KEY,
  v TEXT NOT NULL DEFAULT '',
  t INTEGER NOT NULL DEFAULT 0,
  who TEXT NOT NULL DEFAULT ''
);

-- Phase B (31/10/2026) -------------------------------------------------------------------------
-- Avis : informations ajoutées avec la nouvelle case d'accord (prénom, initiale du nom, profession).
-- Une ligne ici = l'apprenant a accepté la nouvelle formulation ; sans ligne, seul le prénom peut être affiché.
CREATE TABLE IF NOT EXISTS avis_info (
  id INTEGER PRIMARY KEY,
  profession TEXT NOT NULL DEFAULT ''
);

-- Mon portfolio : cartes déposées par les apprenants (fichier dans R2 : portfolio/<id>/carte.<ext> et mini.jpg).
-- statut : envoi (fichier pas encore reçu) / a_voir / valide / a_revoir. Publiée sur le site si valide ET consent = 1.
CREATE TABLE IF NOT EXISTS portfolio (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  module TEXT NOT NULL DEFAULT '',
  titre TEXT NOT NULL,
  descr TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  mini INTEGER NOT NULL DEFAULT 0,
  consent INTEGER NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'envoi',
  commentaire TEXT NOT NULL DEFAULT '',
  t INTEGER NOT NULL,
  tv INTEGER NOT NULL DEFAULT 0,
  who TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS portfolio_code ON portfolio (code);

-- Parrainage : code personnel de chaque parrain, et filleul → parrain (un seul parrain par filleul).
-- statut du filleul : attente / accorde / refuse.
CREATE TABLE IF NOT EXISTS parrains (
  code TEXT PRIMARY KEY,
  pcode TEXT NOT NULL UNIQUE,
  t INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS filleuls (
  code TEXT PRIMARY KEY,
  parrain TEXT NOT NULL,
  t INTEGER NOT NULL,
  statut TEXT NOT NULL DEFAULT 'attente',
  recompense TEXT NOT NULL DEFAULT '',
  ta INTEGER NOT NULL DEFAULT 0,
  who TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS filleuls_parrain ON filleuls (parrain);
