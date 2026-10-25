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
