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

-- Une ligne par apprenant : dernière leçon ouverte et dernière activité.
CREATE TABLE IF NOT EXISTS learners (
  code TEXT PRIMARY KEY,
  last TEXT,
  last_activity INTEGER
);
