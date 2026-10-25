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
