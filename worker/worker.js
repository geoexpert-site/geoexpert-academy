// =====================================================================
// GeoExpert Academy : espace apprenant (Cloudflare Worker)
// Le même code sert deux Workers, selon la variable ROLE :
//   ROLE = "apprenant" : uniquement l'API de l'espace apprenant (/api/...)
//   ROLE = "admin"     : la page d'administration (/) et son API (/admin/...), derrière Cloudflare Access
//   ROLE absent        : les deux, comme avant (le temps de la transition)
// =====================================================================
import ADMIN_HTML from './admin.html';

const CATALOG = [
  {
    "key": "arc1",
    "title": "ArcGIS - Chapitre 1 : Structuration des données géospatiales",
    "meta": "14 leçons, 10 astuces, 5 exercices",
    "videos": [
      {"k": "arc1-v01", "title": "Introduction", "dur": "5:08"},
      {"k": "arc1-v02", "title": "Leçon 1 : Démonstration pas-à-pas : création d’une Geodatabase - ArcMap / ArcCatalog", "dur": "10:03"},
      {"k": "arc1-v03", "title": "Leçon 2 : Importer des points GPS et lever depuis un CSV et convertir en SHP", "dur": "14:48"},
      {"k": "arc1-v04", "title": "Leçon 3 : Importer un fichier DXF format de donnée Autocad et convertir en SHP", "dur": "8:13"},
      {"k": "arc1-v05", "title": "Leçon 4 : Importer un fichier GPX Format de données GPS Garmin arcmap", "dur": "13:15"},
      {"k": "arc1-v06", "title": "Vidéo 5 : Comment convertir en SHP et sauvegarder un fichier GPX dans votre base de donnée", "dur": "8:01"},
      {"k": "arc1-v07", "title": "Leçon 6 : COMMENT IMPORTER raster dans votre Geodatabase", "dur": "16:24"},
      {"k": "arc1-v08", "title": "Leçon 7 : COMMENT créer un mini projet SIG (vectorisation gestion table attribut)", "dur": "14:04"},
      {"k": "arc1-v09", "title": "Leçon 8 : Google earth pro Recherche une zone, introduction, création d'un projet et un polygone, numérisation des zones d'intérêt Partie 1", "dur": "24:00"},
      {"k": "arc1-v10", "title": "Leçon 9 : Google earth pro numérisation des zones d'intérêt avec la couche polygone partie 2", "dur": "14:31"},
      {"k": "arc1-v11", "title": "Leçon 10 : Google earth pro création d'une couche line, trajet ou route et numérisation des zone d'intérêt avec la couche ligne", "dur": "56:54"},
      {"k": "arc1-v12", "title": "Leçon 11 : Google earth pro création d'une couche point , lieu, ou coordonnée, ajouter des lieux sur des zone d'intérêt avec l'outils point", "dur": "34:48"},
      {"k": "arc1-v13", "title": "Leçon 12 : Google earth pro consulter les archives d'image voir comment un territoire a évolué ou changer, cartographie ces changements a deux dates différentes", "dur": "5:52"},
      {"k": "arc1-v14", "title": "Leçon 13 : Google earth pro enregistrer votre projet en kml ou kmz et importer dans votre logiciel SIG Arcmap", "dur": "6:59"},
      {"k": "arc1-v15", "title": "Leçon 14 : Google earth pro comment importer un fichier KML dans notre GDB (base de donnée) Arcgis", "dur": "6:59"},
      {"k": "arc1-v16", "title": "Astuce : Afficher le Cartalogue et la barre de recherche dans arcmap", "dur": "0:37"},
      {"k": "arc1-v17", "title": "Astuce : Afficher le fond google sur un fichier DXF", "dur": "3:44"},
      {"k": "arc1-v18", "title": "Astuce : Bien choisir les coordonnées X et Y d'un fichier CSV depuis arcmap", "dur": "0:27"},
      {"k": "arc1-v19", "title": "Astuce : Bien positionner le raster pour voir la numérisation", "dur": "0:23"},
      {"k": "arc1-v20", "title": "Astuce : Activer l'image satellite sur ArcGIS", "dur": "0:50"},
      {"k": "arc1-v21", "title": "Astuce : Déconnecter des dossiers dans le Cartalogue de Arcgis", "dur": "0:54"},
      {"k": "arc1-v22", "title": "Astuce : Supprimez une vectorisation faites par erreur", "dur": "0:59"},
      {"k": "arc1-v23", "title": "Astuce : Déplacer une feature class dans une featuredataset", "dur": "0:33"},
      {"k": "arc1-v24", "title": "Astuce : Enregistrer un fichier DXf complexe dans votre base de donnée", "dur": "1:22"},
      {"k": "arc1-v25", "title": "Astuce : Activer la barre d'editor dans Arcmap", "dur": "1:40"}
    ],
    "exercises": [
      {"k": "arc1-e1", "title": "Exercice pratique 1"},
      {"k": "arc1-e2", "title": "Exercice pratique 2 (disponible après Exercice 1)"},
      {"k": "arc1-e3", "title": "Exercice pratique 3 (disponible après Exercices 1 & 2)"},
      {"k": "arc1-e4", "title": "Exercice pratique 4 (disponible après Exercices 1, 2 & 3)"},
      {"k": "arc1-e5", "title": "Exercice pratique 5 (disponible après Exercices 1, 2, 3 & 4)"}
    ]
  },
  {
    "key": "arc2",
    "title": "ArcGIS - Chapitre 2 : Analyse spatiale avancée et cartographie",
    "meta": "12 leçons, 2 astuces, 4 exercices",
    "videos": [
      {"k": "arc2-v01", "title": "INTRODUCTION Analyse spatiale avance explication", "dur": "10:14"},
      {"k": "arc2-v02", "title": "Leçon 1 : Introduction et creation new feature dataset", "dur": "10:03"},
      {"k": "arc2-v03", "title": "Leçon 2 : Comment extraire les courbe de niveau a partir d'un MNT", "dur": "14:48"},
      {"k": "arc2-v04", "title": "Leçon 3 : Comment définir les classe d'altitudes du relief sans les courbes de niveau et la pente", "dur": "8:13"},
      {"k": "arc2-v05", "title": "Leçon 4 : Comment Extraire un territoire situé dans une zone de référence", "dur": "13:15"},
      {"k": "arc2-v06", "title": "Leçon 5 : Comment Extraire une Couche raster a partir d'une donnée vectorielle", "dur": "8:01"},
      {"k": "arc2-v07", "title": "Leçon 6 : Comment extraire des polygones des lignes et point a travers l'outil clip", "dur": "16:24"},
      {"k": "arc2-v08", "title": "Leçon 7 : Utiliser efficacement l'Outil Intersect", "dur": "14:04"},
      {"k": "arc2-v09", "title": "Leçon 8 : Comment utiliser efficacement l'outil Buffer et multiple buffer", "dur": "24:00"},
      {"k": "arc2-v10", "title": "Leçon 9 : Comment utiliser efficacement l'outils Near", "dur": "14:31"},
      {"k": "arc2-v11", "title": "Leçon 10 : Comment télécharger des données vectorielle et Raster Partie 1", "dur": "56:54"},
      {"k": "arc2-v12", "title": "Leçon 11 : Comment télécharger des données vectorielle et Raster Partie 2", "dur": "34:48"},
      {"k": "arc2-v13", "title": "Leçon 12 : Mise en page pro cartographique", "dur": "5:52"},
      {"k": "arc2-v14", "title": "Astuce : Comment exporter des courbe de niveau vers Autocad", "dur": "6:59"},
      {"k": "arc2-v15", "title": "Astuce : Comment exporter des courbes de niveau en KMZ depuis Arcmap", "dur": "6:59"}
    ],
    "exercises": [
      {"k": "arc2-e1", "title": "Exercice pratique 1"},
      {"k": "arc2-e2", "title": "Exercice pratique 2 (disponible après Exercice 1)"},
      {"k": "arc2-e3", "title": "Exercice pratique 3 (disponible après Exercices 1 & 2)"},
      {"k": "arc2-e4", "title": "Exercice pratique 4 (disponible après Exercices 1, 2 & 3)"}
    ]
  },
  {
    "key": "qgis1",
    "title": "QGIS - Chapitre 1 : Structuration des données géospatiales",
    "meta": "16 leçons, 2 astuces, 5 exercices",
    "videos": [
      {"k": "qgis1-v01", "title": "Introduction", "dur": "4:36"},
      {"k": "qgis1-v02", "title": "Leçon 1 : COMMENT CREER UNE BASE DE DONNE SUR QGIS", "dur": "8:12"},
      {"k": "qgis1-v03", "title": "Leçon 2 : CREER TROIS COUCHES POLYGONE LIGNE ET POINT et importer dans la base de donnee", "dur": "9:46"},
      {"k": "qgis1-v04", "title": "Leçon 3 : Comment importer un fichier CSV dans QGis et sauvegarder dans le geopackage", "dur": "7:13"},
      {"k": "qgis1-v05", "title": "Leçon 4 : Comment importer un fichier DXF format de donnée Autocad dans Qgis", "dur": "3:40"},
      {"k": "qgis1-v06", "title": "Leçon 5 : Enregistrer un fichier DXF format de donnée Autocad dans notre base de donnee QGIS geopackage", "dur": "1:54"},
      {"k": "qgis1-v07", "title": "Leçon 6 : comment importer un fichier GPX Format de données GPS dans Qgis et sauvegarder dans base de donnee", "dur": "3:50"},
      {"k": "qgis1-v08", "title": "Leçon 7 : Comment importer un fichier Raster sur QGIS", "dur": "6:05"},
      {"k": "qgis1-v09", "title": "Leçon 8 : COMMENT créer un mini projet SIG (vectorisation gestion table attribut) Partie 1", "dur": "8:52"},
      {"k": "qgis1-v10", "title": "Leçon 9 : COMMENT créer un mini projet SIG (vectorisation gestion table attribut) Partie 2", "dur": "0:27"},
      {"k": "qgis1-v11", "title": "Leçon 10 : Google earth pro Recherche une zone, introduction, création d'un projet et un polygone, numérisation des zones d'intérêt Partie 1", "dur": "2:52"},
      {"k": "qgis1-v12", "title": "Leçon 11 : Google earth pro numérisation des zones d'intérêt avec la couche polygone partie 2", "dur": "3:55"},
      {"k": "qgis1-v13", "title": "Leçon 12 : Google earth pro création d'une couche line, trajet ou route et numérisation des zone d'intérêt avec la couche ligne", "dur": "1:22"},
      {"k": "qgis1-v14", "title": "Leçon 13 : Google earth pro création d'une couche point , lieu, ou coordonnée, ajouter des lieux sur des zone d'intérêt avec l'outils point", "dur": "2:52"},
      {"k": "qgis1-v15", "title": "Leçon 14 : Google earth pro consulter les archives d'image voir comment un territoire a évolué ou changer, cartographie ces changements a deux dates différentes", "dur": "3:55"},
      {"k": "qgis1-v16", "title": "Leçon 15 : Google earth pro enregistrer votre projet en kml ou kmz et importer dans votre logiciel SIG QGIS", "dur": "1:22"},
      {"k": "qgis1-v17", "title": "Leçon 16 : Comment importer un fichier KML dans votre GPKG QGIS", "dur": "2:52"},
      {"k": "qgis1-v18", "title": "Astuce : comment activer google satellite dans QGIS", "dur": "3:55"},
      {"k": "qgis1-v19", "title": "Astuce : Zoomer sur une couche manuellement", "dur": "1:22"}
    ],
    "exercises": [
      {"k": "qgis1-e1", "title": "Exercice pratique 1"},
      {"k": "qgis1-e2", "title": "Exercice pratique 2 (disponible après Exercice 1)"},
      {"k": "qgis1-e3", "title": "Exercice pratique 3 (disponible après Exercices 1 & 2)"},
      {"k": "qgis1-e4", "title": "Exercice pratique 4 (disponible après Exercices 1, 2 & 3)"},
      {"k": "qgis1-e5", "title": "Exercice pratique 5 (disponible après Exercices 1, 2, 3 & 4)"}
    ]
  },
  {
    "key": "qgis2",
    "title": "QGIS - Chapitre 2 : Analyse spatiale avancée et cartographie",
    "meta": "13 leçons, 2 exercices",
    "videos": [
      {"k": "qgis2-v01", "title": "Leçon 1 : introduction", "dur": "2:32"},
      {"k": "qgis2-v02", "title": "Leçon 2 : Comment extraire les courbes de niveau a partir d'un MNT", "dur": "14:34"},
      {"k": "qgis2-v03", "title": "Leçon 3 : Comment definir la pente (slope) a partir d'un MNT", "dur": "6:58"},
      {"k": "qgis2-v04", "title": "Leçon 4 : Comment définir les classe d'altitudes du relief sans les courbes de niveau et la pente", "dur": "7:30"},
      {"k": "qgis2-v05", "title": "Leçon 5 : Comment utiliser efficacement l'outil Clip et l'extraction by masque sur Qgis", "dur": "17:20"},
      {"k": "qgis2-v06", "title": "Leçon 6 : importer toutes les couches vectorielles dans le projet", "dur": "9:31"},
      {"k": "qgis2-v07", "title": "Leçon 7 : Découper toutes les données vectorielle dans la zone d'étude", "dur": "13:41"},
      {"k": "qgis2-v08", "title": "Leçon 8 : Utiliser efficacement l'outils intersect dans QGIS", "dur": "23:31"},
      {"k": "qgis2-v09", "title": "Leçon 9 : comment utiliser efficacement l'outil Buffer (tampon) dans Qgis", "dur": "25:39"},
      {"k": "qgis2-v10", "title": "Leçon 10 : comment utiliser efficacement l'outils proximity", "dur": "14:12"},
      {"k": "qgis2-v11", "title": "Leçon 11 : Comment télécharger des données vectorielle et Raster Partie 1", "dur": "14:12"},
      {"k": "qgis2-v12", "title": "Leçon 12 : Comment télécharger des données vectorielle et Raster Partie 2", "dur": "14:12"},
      {"k": "qgis2-v13", "title": "Leçon 13 : Mise en page pro cartographique.", "dur": "14:12"}
    ],
    "exercises": [
      {"k": "qgis2-e1", "title": "Exercice pratique 1"},
      {"k": "qgis2-e2", "title": "Exercice pratique 2 (disponible après Exercice 1)"},
      {"k": "qgis2-e3", "title": "Exercice pratique 3 (disponible après Exercices 1 & 2)"},
      {"k": "qgis2-e4", "title": "Exercice pratique 4 (disponible après Exercices 1, 2 & 3)"}
    ]
  },
  {
    "key": "tele",
    "title": "Télédétection : analyse d'images satellitaires",
    "meta": "6 vidéos, 6 h",
    "videos": [
      {"k": "tele-v01", "title": "VIDEO 1. Introduction, compositions colorées et NDVI", "dur": "1:38:21"},
      {"k": "tele-v02", "title": "VIDEO 2. Suite : suivi de site avec le NDVI", "dur": "8:52"},
      {"k": "tele-v03", "title": "VIDEO 3. NDWI, MNDWI et NDBI", "dur": "1:24:03"},
      {"k": "tele-v04", "title": "VIDEO 4. Suite NDBI, NBR et classification non supervisée", "dur": "1:05:33"},
      {"k": "tele-v05", "title": "VIDEO 5. Suite de la classification non supervisée et mise en page professionnelle", "dur": "1:09:44"},
      {"k": "tele-v06", "title": "VIDEO 6. Mise en page professionnelle avec ArcGIS Pro", "dur": "41:59"}
    ],
    "exercises": []
  },
  {
    "key": "web",
    "title": "Webmapping : créer et déployer une application",
    "meta": "2 vidéos, 4 h 30",
    "videos": [
      {"k": "web-v01", "title": "VIDEO 1. Création d'une application Webmapping avec ArcGIS Online", "dur": "2:19:13"},
      {"k": "web-v02", "title": "VIDEO 2. Création d'une application Webmapping avec ArcGIS Online (suite)", "dur": "2:12:05"}
    ],
    "exercises": []
  },
  {
    "key": "kobo",
    "title": "KoboToolbox : collecte mobile et intégration SIG",
    "meta": "3 vidéos, 55 min",
    "videos": [
      {"k": "kobo-v01", "title": "VIDEO 1. Introduction à la collecte de données", "dur": "3:00"},
      {"k": "kobo-v02", "title": "VIDEO 2. Création de votre compte KoboToolbox", "dur": "39:10"},
      {"k": "kobo-v03", "title": "VIDEO 3. Paramètres de l'application et collecte de données", "dur": "12:23"}
    ],
    "exercises": []
  },
  {
    "key": "google",
    "title": "Google Earth et outils complémentaires aux SIG",
    "meta": "8 vidéos, 1 h 30",
    "videos": [
      {"k": "google-v01", "title": "VIDEO 8. Google comme outil complémentaire au SIG, partie 1", "dur": "17:36"},
      {"k": "google-v02", "title": "VIDEO 8. Google comme outil complémentaire au SIG, partie 2", "dur": "11:43"},
      {"k": "google-v03", "title": "VIDEO 8. Google comme outil complémentaire au SIG, partie 3", "dur": "10:10"},
      {"k": "google-v04", "title": "VIDEO 8. Google comme outil complémentaire au SIG, partie 4", "dur": "6:59"},
      {"k": "google-v05", "title": "VIDEO 8. Google comme outil complémentaire au SIG, partie 5", "dur": "24:23"},
      {"k": "google-v06", "title": "VIDEO 8. Google comme outil complémentaire au SIG, partie 6", "dur": "11:59"},
      {"k": "google-v07", "title": "VIDEO 8. Google comme outil complémentaire au SIG, partie 7 (QGIS)", "dur": "3:14"},
      {"k": "google-v08", "title": "VIDEO 9. Importer un fichier KML dans la géodatabase ArcGIS", "dur": "6:08"}
    ],
    "exercises": []
  }
];

const PRODUCTS = {
  'arc1': { now: ['arc1'], later: [] },
  'arc2': { now: ['arc2'], later: [] },
  'qgis1': { now: ['qgis1'], later: [] },
  'qgis2': { now: ['qgis2'], later: [] },
  'tele': { now: ['tele'], later: [] },
  'web': { now: ['web'], later: [] },
  'kobo': { now: ['kobo'], later: [] },
  'google': { now: ['google'], later: [] },
  'pack-qgis': { now: ['qgis1'], later: ['qgis2'] },
  'pack-arcgis': { now: ['arc1'], later: ['arc2'] },
  'pack-complet': { now: ['qgis1', 'arc1'], later: ['qgis2', 'arc2', 'tele', 'web', 'kobo', 'google'] },
};

const DAY = 86400000;
// Période d'essai (codes créés après la mise à jour, marqués "essai": true)
const TRIAL_DAYS = 7;   // déblocage complet à 0 h (UTC, heure d'Abidjan) le 8e jour
const TRIAL_FREE = 3;   // introduction + 2 premières leçons de chaque module
const MONTHS_SINGLE = 12;
const MONTHS_PACK = 24;
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const enc = new TextEncoder();

async function sha256hex(s) {
  const b = await crypto.subtle.digest('SHA-256', enc.encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
function randomCode(n) {
  const a = new Uint32Array(n); crypto.getRandomValues(a);
  let o = ''; for (const v of a) o += ALPHABET[v % ALPHABET.length];
  return o;
}
function normCode(c) {
  const s = String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const t = s.startsWith('GEO') && s.length === 15 ? s.slice(3) : s;
  return /^[2-9A-HJ-NP-Z]{12}$/.test(t) ? t : null;
}
function prettyCode(c) { return 'GEO-' + c.slice(0, 4) + '-' + c.slice(4, 8) + '-' + c.slice(8, 12); }
async function safeEqual(a, b) {
  const [x, y] = await Promise.all([sha256hex(String(a)), sha256hex(String(b))]);
  let d = 0; for (let i = 0; i < x.length; i++) d |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return d === 0;
}
function moduleOf(k) { return String(k).split('-')[0]; }
function findModule(m) { return CATALOG.find(x => x.key === m); }

function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
}
function corsHeaders(req, env) {
  const h = { 'Vary': 'Origin' };
  const o = req.headers.get('Origin');
  if (o && allowedOrigins(env).includes(o)) {
    h['Access-Control-Allow-Origin'] = o;
    h['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS';
    h['Access-Control-Allow-Headers'] = 'Content-Type, X-Admin-Password';
    h['Access-Control-Max-Age'] = '600';
  }
  return h;
}
function reply(data, status, req, env, extra) {
  return new Response(JSON.stringify(data), {
    status,
    headers: Object.assign({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    }, corsHeaders(req, env), extra || {}),
  });
}
async function readJson(req) {
  try { return await req.json(); } catch (e) { return {}; }
}
async function getCfg(env) {
  const raw = await env.ACCESS.get('cfg');
  const c = raw ? JSON.parse(raw) : {};
  return { ids: c.ids || {}, files: c.files || {} };
}
async function findStudent(env, code) {
  const c = normCode(code);
  if (!c) return null;
  const raw = await env.ACCESS.get('s:' + c);
  if (!raw) return null;
  return { c, rec: JSON.parse(raw) };
}
function studentStatus(rec, now) {
  if (!rec.active) return 'revoked';
  if (rec.expires && now > rec.expires) return 'expired';
  return 'ok';
}
function addMonths(ms, n) {
  const d = new Date(ms); d.setUTCMonth(d.getUTCMonth() + n); return d.getTime();
}
function fmtDate(ms) {
  return new Date(ms).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
// Fin de l'essai : 0 h UTC du 8e jour après la première utilisation. 0 = pas d'essai (ancien code ou accès complet).
function trialEnd(rec) {
  if (!rec.essai || rec.accesComplet || !rec.premiereUtilisation) return 0;
  const d = new Date(rec.premiereUtilisation);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + TRIAL_DAYS);
}
// Première utilisation d'un nouveau code : démarre l'essai et fixe la date de fin d'accès.
function startAccess(rec, now) {
  if (!rec.essai || rec.premiereUtilisation) return false;
  rec.premiereUtilisation = now;
  rec.expires = addMonths(now, rec.mois || MONTHS_SINGLE) + (rec.joursBonus || 0) * DAY;
  delete rec.joursBonus;
  return true;
}
// Leçon (vidéo) ou exercice verrouillé par l'essai : renvoie la date de déblocage, sinon 0.
function trialLock(rec, k, now) {
  const end = trialEnd(rec);
  if (!end || now >= end) return 0;
  const m = findModule(moduleOf(k));
  const i = m ? m.videos.findIndex(v => v.k === k) : -1;
  return i >= 0 && i < TRIAL_FREE ? 0 : end;
}
// Annonces en cours pour un apprenant (toutes formations, ou une de ses formations). [] si la base est absente.
async function loadAnnonces(env, rec, now) {
  if (!env.DB) return [];
  try {
    const r = await env.DB.prepare('SELECT id, t, text, module FROM annonces WHERE (until = 0 OR until > ?) ORDER BY t DESC LIMIT 20').bind(now).all();
    const mine = new Set(rec.modules.map(g => g.m));
    return r.results.filter(a => !a.module || mine.has(a.module)).slice(0, 3).map(a => ({ id: a.id, t: a.t, text: a.text }));
  } catch (e) { return []; }
}
// Leçon (vidéo) d'un module de l'apprenant.
function ownsLesson(rec, k) {
  const m = findModule(moduleOf(k));
  return !!m && rec.modules.some(g => g.m === m.key) && m.videos.some(v => v.k === k);
}
// Exercice d'un module de l'apprenant.
function ownsExercise(rec, k) {
  const m = findModule(moduleOf(k));
  return !!m && rec.modules.some(g => g.m === m.key) && m.exercises.some(e => e.k === k);
}
// Progression enregistrée sur le serveur (base D1). null si la base n'est pas disponible :
// la page garde alors la progression du téléphone, comme avant.
async function loadProgress(env, c) {
  if (!env.DB) return null;
  try {
    const [d, n, l, x, g] = await env.DB.batch([
      env.DB.prepare('SELECT k, done_at FROM progress WHERE code = ?').bind(c),
      env.DB.prepare('SELECT k, text FROM notes WHERE code = ?').bind(c),
      env.DB.prepare('SELECT last, last_activity FROM learners WHERE code = ?').bind(c),
      env.DB.prepare('SELECT k, done_at FROM exercises WHERE code = ?').bind(c),
      env.DB.prepare('SELECT goal FROM prefs WHERE code = ?').bind(c),
    ]);
    const done = {}, notes = {}, ex = {};
    for (const r of d.results) done[r.k] = r.done_at;
    for (const r of n.results) notes[r.k] = r.text;
    for (const r of x.results) ex[r.k] = r.done_at;
    return { done, notes, ex, goal: (g.results[0] && g.results[0].goal) || 0, last: (l.results[0] && l.results[0].last) || '', act: (l.results[0] && l.results[0].last_activity) || 0 };
  } catch (e) { return null; }
}
function entitled(rec, k, now) {
  const g = rec.modules.find(x => x.m === moduleOf(k));
  if (!g) return { ok: false, from: 0, none: true };
  if (now < g.from) return { ok: false, from: g.from };
  const t = trialLock(rec, k, now);
  return t ? { ok: false, from: t, trial: true } : { ok: true, from: g.from };
}

// ---------------------------------------------------------------- Cloudflare Access (administration)
// Vérifie le jeton que Cloudflare Access ajoute après la connexion par e-mail. Renvoie l'e-mail, ou null.
let jwks = null, jwksAt = 0;
function b64u(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); return Uint8Array.from(atob(s + '='.repeat((4 - s.length % 4) % 4)), c => c.charCodeAt(0)); }
async function accessEmail(req, env) {
  const team = String(env.ACCESS_TEAM_DOMAIN || '').replace(/\/+$/, '');
  const token = req.headers.get('Cf-Access-Jwt-Assertion') || '';
  const parts = token.split('.');
  if (!team || !env.ACCESS_AUD || parts.length !== 3) return null;
  try {
    const head = JSON.parse(new TextDecoder().decode(b64u(parts[0])));
    const pay = JSON.parse(new TextDecoder().decode(b64u(parts[1])));
    if (head.alg !== 'RS256') return null;
    if (!jwks || Date.now() - jwksAt > 3600000 || !jwks.find(k => k.kid === head.kid)) {
      jwks = (await (await fetch(team + '/cdn-cgi/access/certs')).json()).keys || []; jwksAt = Date.now();
    }
    const jwk = jwks.find(k => k.kid === head.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64u(parts[2]), enc.encode(parts[0] + '.' + parts[1]));
    const aud = Array.isArray(pay.aud) ? pay.aud : [pay.aud];
    if (!ok || pay.iss !== team || !aud.includes(env.ACCESS_AUD) || !(pay.exp * 1000 > Date.now())) return null;
    const email = String(pay.email || '').toLowerCase();
    const allowed = String(env.ADMIN_EMAILS || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    return email && (!allowed.length || allowed.includes(email)) ? email : null;
  } catch (e) { return null; }
}

// ---------------------------------------------------------------- Journal d'activité (base D1)
async function journal(env, who, action, code, label, detail) {
  if (!env.DB) return;
  try {
    await env.DB.prepare('INSERT INTO journal (t, who, action, code, label, detail) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(Date.now(), who || '', action, code || '', label || '', detail || '').run();
  } catch (e) { /* le journal ne doit jamais bloquer une action */ }
}

const ADMIN_PAGE_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://geoexpertacademy.ci; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const role = env.ROLE || 'tout';
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(req, env) });
    try {
      if (!env.ACCESS) return reply({ error: 'Configuration incomplète : KV ACCESS manquant.' }, 500, req, env);
      const origin = req.headers.get('Origin');
      const sameOrigin = role === 'admin' && origin === url.origin;
      if (origin && !sameOrigin && !allowedOrigins(env).includes(origin)) return reply({ error: 'Origine non autorisée.' }, 403, req, env);
      if (role !== 'admin' && url.pathname.startsWith('/api/')) return await api(req, env, url);
      if (role !== 'apprenant' && url.pathname.startsWith('/admin/')) return await admin(req, env, url);
      if (role === 'admin' && url.pathname === '/' && req.method === 'GET') {
        if (!(await adminAccessOk(req, env))) return new Response('Accès refusé.', { status: 403, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        return new Response(ADMIN_HTML, { status: 200, headers: ADMIN_PAGE_HEADERS });
      }
      return reply({ error: 'Introuvable.' }, 404, req, env);
    } catch (e) {
      return reply({ error: 'Erreur serveur.' }, 500, req, env);
    }
  },
};

// ---------------------------------------------------------------- API apprenant
async function api(req, env, url) {
  if (req.method !== 'POST') return reply({ error: 'Méthode non autorisée.' }, 405, req, env);
  const body = await readJson(req);
  const now = Date.now();
  const found = await findStudent(env, body.code);
  const generic = { error: 'Code invalide ou accès désactivé. Vérifiez votre code ou écrivez-nous sur WhatsApp.' };
  if (!found) return reply(generic, 401, req, env);
  const { c, rec } = found;
  const st = studentStatus(rec, now);
  if (st === 'revoked') return reply(generic, 401, req, env);
  if (st === 'expired') return reply({ error: 'Votre accès a expiré. Écrivez-nous sur WhatsApp pour le renouveler.' }, 403, req, env);
  if (startAccess(rec, now)) await env.ACCESS.put('s:' + c, JSON.stringify(rec));

  if (url.pathname === '/api/login') {
    const cfg = await getCfg(env);
    // Pendant l'essai, une leçon bloquée ne renvoie que son titre, sa durée et sa date de déblocage.
    const mods = rec.modules.map(g => {
      const m = findModule(g.m); if (!m) return null;
      return {
        key: m.key, title: m.title, meta: m.meta, locked: now < g.from, unlockAt: g.from,
        videos: m.videos.map(v => {
          const t = trialLock(rec, v.k, now);
          return t ? { k: v.k, title: v.title, dur: v.dur, locked: true, unlockAt: t } : { k: v.k, title: v.title, dur: v.dur, ready: !!cfg.ids[v.k] };
        }),
        exercises: m.exercises.map(e => {
          const t = trialLock(rec, e.k, now);
          return t ? { k: e.k, title: e.title, locked: true, unlockAt: t } : { k: e.k, title: e.title, ready: !!cfg.files[e.k] };
        }),
      };
    }).filter(Boolean);
    const te = trialEnd(rec);
    const prevLogin = rec.lastLogin || 0; // avant la mise à jour ci-dessous : sert au « message du jour »
    
    const ip = req.headers.get('CF-Connecting-IP') || '';
    const h = (await sha256hex((env.ADMIN_PASSWORD || '') + ip)).slice(0, 10);
    const country = (req.cf && req.cf.country) || '';
    rec.seen = rec.seen || [];
    const known = rec.seen.find(x => x.h === h);
    if (!known || now - (rec.lastLogin || 0) > 3600000) {
      if (known) known.t = now; else rec.seen.push({ h, c: country, t: now });
      rec.seen = rec.seen.slice(-10);
      rec.logins = (rec.logins || 0) + 1;
      rec.lastLogin = now;
      await env.ACCESS.put('s:' + c, JSON.stringify(rec));
    }
    const progress = await loadProgress(env, c);
    // Dates pour le « message du jour » et la carte « Essai et assistance » (vraies dates uniquement).
    const startAt = rec.premiereUtilisation || (rec.essai ? 0 : rec.created);
    return reply({
      label: rec.label, expires: rec.expires, trialEnd: te > now ? te : 0, modules: mods, progress,
      trialStart: te > now ? rec.premiereUtilisation : 0,
      assistanceEnd: startAt ? addMonths(startAt, 3) : 0,
      prevVisit: Math.max(prevLogin, (progress && progress.act) || 0),
      annonces: await loadAnnonces(env, rec, now),
    }, 200, req, env);
  }

  // Sauvegarde de la progression : la page n'envoie que ce qui a changé.
  // done : { leçon: date (ms) | 1 (date inconnue) | 0 (plus terminée) } · notes : { leçon: texte } · last : dernière leçon ouverte
  if (url.pathname === '/api/sync') {
    if (!env.DB) return reply({ error: 'Sauvegarde indisponible pour le moment.' }, 503, req, env);
    const st = [];
    const done = Object.entries(body.done && typeof body.done === 'object' ? body.done : {}).slice(0, 400);
    for (const [k, v] of done) {
      if (!ownsLesson(rec, k)) continue;
      const t = Number(v);
      if (t === 0) st.push(env.DB.prepare('DELETE FROM progress WHERE code = ? AND k = ?').bind(c, k));
      else st.push(env.DB.prepare('INSERT INTO progress (code, k, done_at) VALUES (?, ?, ?) ON CONFLICT (code, k) DO NOTHING')
        .bind(c, k, t === 1 ? 1 : (t > 1.6e12 && t <= now + 60000 ? Math.floor(t) : now)));
    }
    const notes = Object.entries(body.notes && typeof body.notes === 'object' ? body.notes : {}).slice(0, 400);
    for (const [k, v] of notes) {
      if (!ownsLesson(rec, k)) continue;
      const text = String(v == null ? '' : v).slice(0, 20000);
      if (!text.trim()) st.push(env.DB.prepare('DELETE FROM notes WHERE code = ? AND k = ?').bind(c, k));
      else st.push(env.DB.prepare('INSERT INTO notes (code, k, text, updated) VALUES (?, ?, ?, ?) ON CONFLICT (code, k) DO UPDATE SET text = excluded.text, updated = excluded.updated')
        .bind(c, k, text, now));
    }
    // Exercices faits : { exercice: date (ms) | 0 (décoché) }
    const exs = Object.entries(body.ex && typeof body.ex === 'object' ? body.ex : {}).slice(0, 100);
    for (const [k, v] of exs) {
      if (!ownsExercise(rec, k)) continue;
      const t = Number(v);
      if (!t) st.push(env.DB.prepare('DELETE FROM exercises WHERE code = ? AND k = ?').bind(c, k));
      else st.push(env.DB.prepare('INSERT INTO exercises (code, k, done_at) VALUES (?, ?, ?) ON CONFLICT (code, k) DO NOTHING')
        .bind(c, k, t > 1.6e12 && t <= now + 60000 ? Math.floor(t) : now));
    }
    // Objectif de la semaine : 0 (aucun) à 7 leçons
    if (body.goal !== undefined && body.goal !== null) {
      const goal = Math.min(Math.max(parseInt(body.goal, 10) || 0, 0), 7);
      st.push(env.DB.prepare('INSERT INTO prefs (code, goal, updated) VALUES (?, ?, ?) ON CONFLICT (code) DO UPDATE SET goal = excluded.goal, updated = excluded.updated').bind(c, goal, now));
    }
    const last = ownsLesson(rec, String(body.last || '')) ? String(body.last) : null;
    st.push(env.DB.prepare('INSERT INTO learners (code, last, last_activity) VALUES (?, ?, ?) ON CONFLICT (code) DO UPDATE SET last = COALESCE(excluded.last, learners.last), last_activity = excluded.last_activity')
      .bind(c, last, now));
    await env.DB.batch(st);
    return reply({ ok: true }, 200, req, env);
  }

  if (url.pathname === '/api/play') {
    const k = String(body.k || '');
    const e = entitled(rec, k, now);
    if (e.none) return reply({ error: 'Cette vidéo ne fait pas partie de votre formation.' }, 403, req, env);
    if (e.trial) return reply({ error: 'Cette leçon sera disponible à partir du ' + fmtDate(e.from) + '.' }, 403, req, env);
    if (!e.ok) return reply({ error: 'Ce module sera débloqué le ' + fmtDate(e.from) + '.' }, 403, req, env);
    const cfg = await getCfg(env);
    const id = cfg.ids[k];
    if (!id) return reply({ error: 'Cette vidéo sera disponible prochainement.' }, 404, req, env);
    if (!env.BUNNY_TOKEN_KEY || !env.LIBRARY_ID) return reply({ error: 'Configuration vidéo incomplète.' }, 500, req, env);
    const expires = Math.floor(now / 1000) + 4 * 3600;
    const token = await sha256hex(env.BUNNY_TOKEN_KEY + id + expires);
    const host = env.PLAYER_HOST || 'iframe.mediadelivery.net';
    return reply({ url: 'https://' + host + '/embed/' + env.LIBRARY_ID + '/' + id + '?token=' + token + '&expires=' + expires + '&autoplay=false&preload=false', label: rec.label }, 200, req, env);
  }

  if (url.pathname === '/api/file') {
    const k = String(body.k || '');
    const e = entitled(rec, k, now);
    if (e.trial) return reply({ error: 'Cet exercice sera disponible à partir du ' + fmtDate(e.from) + '.' }, 403, req, env);
    if (!e.ok) return reply({ error: 'Fichier non disponible pour votre formation.' }, 403, req, env);

    // On cherche le nom du fichier pour le navigateur
    const m = findModule(moduleOf(k));
    let filename = k + '.pdf';
    if (m) {
      const ex = m.exercises.find(x => x.k === k);
      if (ex) filename = ex.title.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';
    }

    const buf = await env.ACCESS.get('f:' + k, 'arrayBuffer');
    if (!buf) return reply({ error: 'Ce fichier sera disponible prochainement.' }, 404, req, env);
    
    return new Response(buf, { 
      status: 200, 
      headers: Object.assign({ 
        'Content-Type': 'application/octet-stream', 
        'Content-Disposition': 'attachment; filename="' + filename + '"', // C'est cette ligne qui donne le bon nom !
        'Cache-Control': 'no-store', 
        'X-Content-Type-Options': 'nosniff' 
      }, corsHeaders(req, env)) 
    });
  }
  return reply({ error: 'Introuvable.' }, 404, req, env);
}

// ---------------------------------------------------------------- Administration
// Worker d'administration : Cloudflare Access est obligatoire (sauf ACCESS_OPTIONAL = "oui", réservé au test).
// Ancien Worker unique (ROLE absent) : mot de passe seul, comme avant.
async function adminAccessOk(req, env) {
  if (env.ROLE !== 'admin') return true;
  if (env.ACCESS_OPTIONAL === 'oui' && !env.ACCESS_AUD) return true;
  return !!(await accessEmail(req, env));
}
const MAX_FAILS = 5, FAIL_WINDOW = 15 * 60000;

// Tous les codes : liste KV complète (sans limite de 500) + index D1. La liste KV peut mettre jusqu'à 60 s
// à montrer un nouveau code ; l'index D1, rempli à la création, le montre tout de suite.
async function listCodes(env) {
  const set = new Set();
  let cursor = null;
  do {
    const l = await env.ACCESS.list(cursor ? { prefix: 's:', cursor } : { prefix: 's:' });
    l.keys.forEach(k => set.add(k.name.slice(2)));
    cursor = l.list_complete ? null : l.cursor;
  } while (cursor);
  if (env.DB) {
    try {
      const known = new Set((await env.DB.prepare('SELECT code FROM codes').all()).results.map(r => r.code));
      const missing = [...set].filter(c => !known.has(c));
      if (missing.length) await env.DB.batch(missing.map(c => env.DB.prepare('INSERT OR IGNORE INTO codes (code, created) VALUES (?, 0)').bind(c)));
      known.forEach(c => set.add(c));
    } catch (e) { /* sans index, la liste KV suffit */ }
  }
  return [...set];
}

// Progression enregistrée (D1), résumée par apprenant et par formation.
async function progressSummary(env) {
  const out = { byCode: {}, recentByModule: {} };
  if (!env.DB) return out;
  try {
    const since = Date.now() - 30 * DAY;
    const [p, l, r, ct, rl, xs] = await env.DB.batch([
      env.DB.prepare('SELECT code, COUNT(*) AS n, MAX(done_at) AS lastDone FROM progress GROUP BY code'),
      env.DB.prepare('SELECT code, last, last_activity FROM learners'),
      env.DB.prepare("SELECT substr(k, 1, instr(k, '-') - 1) AS m, COUNT(*) AS n FROM progress WHERE done_at > ? GROUP BY m").bind(since),
      env.DB.prepare('SELECT code, phone FROM contacts'),
      env.DB.prepare('SELECT code, kind, MAX(t) AS t FROM relances GROUP BY code, kind'),
      env.DB.prepare('SELECT code, COUNT(*) AS n FROM exercises GROUP BY code'),
    ]);
    const at = c => out.byCode[c] = out.byCode[c] || {};
    for (const x of p.results) Object.assign(at(x.code), { n: x.n, lastDone: x.lastDone > 1 ? x.lastDone : 0, seen: true });
    for (const x of l.results) Object.assign(at(x.code), { act: x.last_activity || 0, last: x.last || '', seen: true });
    for (const x of r.results) out.recentByModule[x.m] = x.n;
    for (const x of ct.results) at(x.code).phone = x.phone;
    for (const x of xs.results) at(x.code).ex = x.n;
    for (const x of rl.results) (at(x.code).marks = at(x.code).marks || {})[x.kind] = x.t;
  } catch (e) { /* tableau de bord sans progression plutôt qu'en erreur */ }
  return out;
}

// Relances à faire aujourd'hui pour un apprenant (règles simples, toutes basées sur de vraies dates).
//   bienvenue   : 1re connexion il y a moins de 2 jours
//   pascommence : code reçu depuis au moins 1 jour, jamais utilisé
//   essai       : 5e jour d'essai ou plus, essai pas encore fini
//   inactif     : a commencé sans finir, aucune visite depuis 7 jours (à refaire au plus une fois par semaine)
//   bravo       : toutes les leçons terminées
// Une relance marquée « faite » ne revient pas (sauf « inactif », qui revient 7 jours après si toujours inactif).
const RELANCES = ['bienvenue', 'pascommence', 'essai', 'inactif', 'bravo'];
function dueRelances(s, now) {
  if (!s.active || (s.expires && s.expires < now)) return [];
  const m = s.marks || {}, used = s.premiereUtilisation || s.logins || s.lastActivity, out = [];
  const startUse = s.premiereUtilisation || 0;
  if (startUse && now - startUse < 2 * DAY && !m.bienvenue) out.push('bienvenue');
  if (!used && now - s.created >= DAY && !m.pascommence) out.push('pascommence');
  if (s.finEssai > now && startUse && now - startUse >= 4 * DAY && !m.essai) out.push('essai');
  const fini = s.lessons && s.done >= s.lessons;
  if (used && !fini && s.lastActivity && now - s.lastActivity >= 7 * DAY && !(m.inactif && m.inactif > Math.max(s.lastActivity, now - 7 * DAY))) out.push('inactif');
  if (fini && !m.bravo) out.push('bravo');
  return out;
}

// Numéro WhatsApp : chiffres seulement ; 10 chiffres ivoiriens → préfixe 225. '' = pas de numéro, null = invalide.
function normPhone(p) {
  let d = String(p || '').replace(/[^0-9]/g, '');
  if (!d) return '';
  if (d.startsWith('00')) d = d.slice(2);
  if (d.length === 10 && /^0[157]/.test(d)) d = '225' + d;
  return d.length >= 8 && d.length <= 15 ? d : null;
}

// Chiffres du tableau de bord : uniquement de vraies données (aucune estimation).
function dashboardStats(students, prog, now) {
  const WEEK = 7 * DAY;
  const valid = students.filter(s => s.active && !(s.expires && s.expires < now));
  const used = valid.filter(s => s.premiereUtilisation || s.logins || s.lastActivity);
  const withProg = used.filter(s => s.synced && s.lessons);
  const modules = CATALOG.map(m => ({
    key: m.key, title: m.title,
    inscrits: valid.filter(s => s.modules.some(g => g.m === m.key)).length,
    lecons30j: prog.recentByModule[m.key] || 0,
  })).filter(m => m.inscrits || m.lecons30j).sort((a, b) => b.inscrits - a.inscrits || b.lecons30j - a.lecons30j);
  return {
    total: valid.length,
    actifs: used.filter(s => now - s.lastActivity < WEEK).length,
    nouveaux: students.filter(s => now - s.created < WEEK).length,
    essai: valid.filter(s => s.finEssai > now).length,
    inactifs: used.filter(s => now - s.lastActivity >= WEEK).length,
    jamais: valid.filter(s => !(s.premiereUtilisation || s.logins || s.lastActivity)).length,
    progression: withProg.length ? Math.round(withProg.reduce((a, s) => a + Math.min(100, s.done * 100 / s.lessons), 0) / withProg.length) : null,
    progressionSur: withProg.length,
    arelancer: students.filter(s => s.due && s.due.length).length,
    apurger: students.filter(s => s.purgeable).length,
    desactives: students.filter(s => !s.active).length,
    expires: students.filter(s => s.active && s.expires && s.expires < now).length,
    modules,
  };
}
async function admin(req, env, url) {
  const now = Date.now();
  // D'abord la connexion par e-mail (Access) : sans elle, on ne révèle rien, même pas l'état de la configuration.
  if (!(await adminAccessOk(req, env))) return reply({ error: 'Accès refusé : connectez-vous avec votre adresse e-mail autorisée.' }, 403, req, env);
  if (!env.ADMIN_PASSWORD || String(env.ADMIN_PASSWORD).length < 12) return reply({ error: 'Mot de passe administrateur non configuré (12 caractères minimum).' }, 500, req, env);
  const who = (await accessEmail(req, env)) || 'administrateur';
  // Limite de tentatives : 5 mots de passe faux en 15 minutes depuis la même connexion = blocage 15 minutes.
  const ip = req.headers.get('CF-Connecting-IP') || '';
  if (env.DB) {
    const r = await env.DB.prepare('SELECT COUNT(*) AS n FROM admin_fails WHERE ip = ? AND t > ?').bind(ip, now - FAIL_WINDOW).first();
    if (r && r.n >= MAX_FAILS) return reply({ error: 'Trop de tentatives. Réessayez dans 15 minutes.' }, 429, req, env);
  }
  const pw = req.headers.get('X-Admin-Password') || '';
  if (!(await safeEqual(pw, env.ADMIN_PASSWORD))) {
    if (env.DB) {
      await env.DB.batch([
        env.DB.prepare('INSERT INTO admin_fails (ip, t) VALUES (?, ?)').bind(ip, now),
        env.DB.prepare('DELETE FROM admin_fails WHERE t < ?').bind(now - 24 * 3600000),
      ]);
      await journal(env, who, 'Mot de passe incorrect', '', '', 'Connexion ' + ((req.cf && req.cf.country) || '') + ' ' + ip);
    }
    return reply({ error: 'Mot de passe incorrect.' }, 401, req, env);
  }
  if (env.DB) await env.DB.prepare('DELETE FROM admin_fails WHERE ip = ?').bind(ip).run();

  if (url.pathname === '/admin/journal' && req.method === 'GET') {
    if (!env.DB) return reply({ entries: [] }, 200, req, env);
    const r = await env.DB.prepare('SELECT t, who, action, code, label, detail FROM journal ORDER BY id DESC LIMIT 300').all();
    return reply({ entries: r.results }, 200, req, env);
  }

  if (url.pathname === '/admin/state' && req.method === 'GET') {
    const cfg = await getCfg(env);
    const codes = await listCodes(env);
    const prog = await progressSummary(env);
    const students = (await Promise.all(codes.map(async c => {
      const raw = await env.ACCESS.get('s:' + c);
      if (!raw) return null;
      const rec = JSON.parse(raw), p = prog.byCode[c] || {};
      return {
        code: prettyCode(c), label: rec.label, created: rec.created, expires: rec.expires, active: rec.active,
        logins: rec.logins || 0, lastLogin: rec.lastLogin || 0, networks: (rec.seen || []).length, countries: [...new Set((rec.seen || []).map(x => x.c).filter(Boolean))],
        modules: rec.modules.map(g => ({ m: g.m, from: g.from })),
        essai: !!rec.essai, premiereUtilisation: rec.premiereUtilisation || 0, finEssai: trialEnd(rec), accesComplet: !!rec.accesComplet, mois: rec.mois || 0,
        done: p.n || 0, lessons: rec.modules.reduce((s, g) => s + ((findModule(g.m) || { videos: [] }).videos.length), 0),
        lastActivity: Math.max(rec.lastLogin || 0, p.act || 0, p.lastDone || 0), synced: !!p.seen, remplace: !!rec.remplacePar,
        lastLesson: p.last ? ((findModule(moduleOf(p.last)) || { videos: [] }).videos.find(v => v.k === p.last) || {}).title || '' : '',
        phone: p.phone || '', marks: p.marks || {}, exDone: p.ex || 0,
        exTotal: rec.modules.reduce((s, g) => s + ((findModule(g.m) || { exercises: [] }).exercises.length), 0),
      };
    }))).filter(Boolean);
    // À supprimer : accès terminé depuis plus de 12 mois (durée annoncée dans la politique de confidentialité).
    students.forEach(s => { s.due = dueRelances(s, now); s.purgeable = !!(s.expires && s.expires < addMonths(now, -12)); });
    students.sort((a, b) => b.created - a.created);
    return reply({
      catalog: CATALOG.map(m => ({ key: m.key, title: m.title, videos: m.videos.map(v => ({ k: v.k, title: v.title, id: cfg.ids[v.k] || '' })), exercises: m.exercises.map(e => ({ k: e.k, title: e.title, has: !!cfg.files[e.k] })) })),
      products: Object.keys(PRODUCTS), students, stats: dashboardStats(students, prog, now),
    }, 200, req, env);
  }

  // Fiche d'un apprenant : tout ce qu'on sait de lui, leçon par leçon, et les notes privées de suivi.
  if (url.pathname === '/admin/student' && req.method === 'GET') {
    const c = normCode(url.searchParams.get('code'));
    const raw = c && await env.ACCESS.get('s:' + c);
    if (!raw) return reply({ error: 'Code introuvable.' }, 404, req, env);
    const rec = JSON.parse(raw);
    const progress = (await loadProgress(env, c)) || { done: {}, notes: {}, last: '' };
    let act = 0, notes = [], phone = '', relances = [];
    if (env.DB) {
      const [l, n, ct, rl] = await env.DB.batch([
        env.DB.prepare('SELECT last_activity FROM learners WHERE code = ?').bind(c),
        env.DB.prepare('SELECT id, t, who, text FROM admin_notes WHERE code = ? ORDER BY t DESC').bind(c),
        env.DB.prepare('SELECT phone FROM contacts WHERE code = ?').bind(c),
        env.DB.prepare('SELECT kind, t, who FROM relances WHERE code = ? ORDER BY t DESC').bind(c),
      ]);
      act = (l.results[0] && l.results[0].last_activity) || 0;
      notes = n.results;
      phone = (ct.results[0] && ct.results[0].phone) || '';
      relances = rl.results;
    }
    // Début de l'accès : première connexion (nouveaux codes) ou création (anciens codes).
    const start = rec.premiereUtilisation || (rec.essai ? 0 : rec.created);
    const lastLesson = progress.last && findModule(moduleOf(progress.last));
    return reply({
      code: prettyCode(c), label: rec.label, product: rec.product || '', active: rec.active, created: rec.created,
      premiereUtilisation: rec.premiereUtilisation || 0, essai: !!rec.essai, accesComplet: !!rec.accesComplet,
      finEssai: trialEnd(rec), expires: rec.expires || 0, mois: rec.mois || 0,
      finAssistance: start ? addMonths(start, 3) : 0,
      logins: rec.logins || 0, lastLogin: rec.lastLogin || 0, lastActivity: Math.max(rec.lastLogin || 0, act),
      networks: (rec.seen || []).length, countries: [...new Set((rec.seen || []).map(x => x.c).filter(Boolean))],
      lastLesson: lastLesson ? (lastLesson.videos.find(v => v.k === progress.last) || {}).title || '' : '',
      modules: rec.modules.map(g => {
        const m = findModule(g.m); if (!m) return null;
        return { key: m.key, title: m.title, from: g.from, lessons: m.videos.map(v => ({ k: v.k, title: v.title, done: progress.done[v.k] || 0 })),
          exercises: m.exercises.map(e => ({ k: e.k, title: e.title, done: (progress.ex && progress.ex[e.k]) || 0 })) };
      }).filter(Boolean),
      synced: !!(act || Object.keys(progress.done).length),
      remplace: rec.remplace ? prettyCode(rec.remplace) : '', remplacePar: rec.remplacePar ? prettyCode(rec.remplacePar) : '',
      adminNotes: notes, phone, relances,
    }, 200, req, env);
  }

  if (url.pathname === '/admin/note' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const c = normCode(b.code);
    const raw = c && await env.ACCESS.get('s:' + c);
    if (!raw) return reply({ error: 'Code introuvable.' }, 404, req, env);
    const text = String(b.text || '').trim().slice(0, 2000);
    if (!text) return reply({ error: 'La note est vide.' }, 400, req, env);
    await env.DB.prepare('INSERT INTO admin_notes (code, t, who, text) VALUES (?, ?, ?, ?)').bind(c, now, who, text).run();
    await journal(env, who, 'Note de suivi ajoutée', prettyCode(c), JSON.parse(raw).label);
    return reply({ ok: true }, 200, req, env);
  }

  // Annonces du formateur : liste, publication, retrait.
  if (url.pathname === '/admin/annonces' && req.method === 'GET') {
    if (!env.DB) return reply({ annonces: [] }, 200, req, env);
    const r = await env.DB.prepare('SELECT id, t, who, text, module, until FROM annonces ORDER BY t DESC LIMIT 100').all();
    return reply({ annonces: r.results }, 200, req, env);
  }
  if (url.pathname === '/admin/annonce' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const text = String(b.text || '').trim().slice(0, 400);
    const module = String(b.module || '');
    const days = parseInt(b.days, 10) || 0;
    if (!text) return reply({ error: 'Écrivez le texte de l\'annonce.' }, 400, req, env);
    if (module && !findModule(module)) return reply({ error: 'Formation inconnue.' }, 400, req, env);
    if (days < 0 || days > 365) return reply({ error: 'Durée invalide.' }, 400, req, env);
    await env.DB.prepare('INSERT INTO annonces (t, who, text, module, until) VALUES (?, ?, ?, ?, ?)').bind(now, who, text, module, days ? now + days * DAY : 0).run();
    await journal(env, who, 'Annonce publiée', '', '', (module ? findModule(module).title.split(' : ')[0] : 'toutes les formations') + ' : ' + text.slice(0, 60));
    return reply({ ok: true }, 200, req, env);
  }
  if (url.pathname === '/admin/annonce-delete' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const row = await env.DB.prepare('SELECT text FROM annonces WHERE id = ?').bind(parseInt(b.id, 10) || 0).first();
    if (!row) return reply({ error: 'Annonce introuvable.' }, 404, req, env);
    await env.DB.prepare('DELETE FROM annonces WHERE id = ?').bind(parseInt(b.id, 10)).run();
    await journal(env, who, 'Annonce retirée', '', '', row.text.slice(0, 60));
    return reply({ ok: true }, 200, req, env);
  }

  // Suppression définitive des données d'un apprenant (droit à l'effacement, fin de la durée de conservation).
  // Efface : la fiche d'accès (le code ne marche plus), les anciens codes remplacés, la progression, les notes,
  // le numéro, les relances et les notes de suivi. Le journal garde l'historique des actions, sans le nom.
  if (url.pathname === '/admin/purge' && req.method === 'POST') {
    const b = await readJson(req);
    const c = normCode(b.code);
    const raw = c && await env.ACCESS.get('s:' + c);
    if (!raw) return reply({ error: 'Code introuvable.' }, 404, req, env);
    if (b.confirm !== 'SUPPRIMER') return reply({ error: 'Confirmation manquante.' }, 400, req, env);
    const all = [c];
    let rec = JSON.parse(raw);
    while (rec && rec.remplace && !all.includes(rec.remplace) && all.length < 20) {
      all.push(rec.remplace);
      const r = await env.ACCESS.get('s:' + rec.remplace);
      rec = r ? JSON.parse(r) : null;
    }
    if (env.DB) {
      const st = [];
      for (const x of all) {
        for (const t of ['progress', 'notes', 'learners', 'contacts', 'relances', 'admin_notes', 'exercises', 'prefs', 'codes']) st.push(env.DB.prepare('DELETE FROM ' + t + ' WHERE code = ?').bind(x));
        st.push(env.DB.prepare("UPDATE journal SET label = '(données supprimées)' WHERE code = ?").bind(prettyCode(x)));
      }
      await env.DB.batch(st);
    }
    for (const x of all) await env.ACCESS.delete('s:' + x);
    await journal(env, who, 'Données de l\'apprenant supprimées', prettyCode(c), '(données supprimées)', all.length > 1 ? all.length + ' codes (avec les anciens codes remplacés)' : '');
    return reply({ ok: true, codes: all.length }, 200, req, env);
  }

  // Trace dans le journal d'une action faite dans la page (ex. export de la liste).
  if (url.pathname === '/admin/log' && req.method === 'POST') {
    const b = await readJson(req);
    const allowed = ['Liste des apprenants exportée'];
    if (!allowed.includes(b.action)) return reply({ error: 'Action inconnue.' }, 400, req, env);
    await journal(env, who, b.action, '', '', String(b.detail || '').slice(0, 100));
    return reply({ ok: true }, 200, req, env);
  }

  // Numéro WhatsApp d'un apprenant (vide = supprimer).
  if (url.pathname === '/admin/contact' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const c = normCode(b.code);
    const raw = c && await env.ACCESS.get('s:' + c);
    if (!raw) return reply({ error: 'Code introuvable.' }, 404, req, env);
    const phone = normPhone(b.phone);
    if (phone === null) return reply({ error: 'Numéro WhatsApp invalide. Exemple : 07 87 01 50 30 ou +225 07 87 01 50 30.' }, 400, req, env);
    if (phone) await env.DB.prepare('INSERT OR REPLACE INTO contacts (code, phone, updated) VALUES (?, ?, ?)').bind(c, phone, now).run();
    else await env.DB.prepare('DELETE FROM contacts WHERE code = ?').bind(c).run();
    await journal(env, who, phone ? 'Numéro WhatsApp enregistré' : 'Numéro WhatsApp supprimé', prettyCode(c), JSON.parse(raw).label);
    return reply({ ok: true, phone }, 200, req, env);
  }

  // Relance faite (ou suivi de l'essai fait).
  if (url.pathname === '/admin/relance' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const c = normCode(b.code);
    const raw = c && await env.ACCESS.get('s:' + c);
    if (!raw) return reply({ error: 'Code introuvable.' }, 404, req, env);
    if (!RELANCES.includes(b.kind)) return reply({ error: 'Type de relance inconnu.' }, 400, req, env);
    await env.DB.prepare('INSERT INTO relances (code, kind, t, who) VALUES (?, ?, ?, ?)').bind(c, b.kind, now, who).run();
    await journal(env, who, 'Relance faite', prettyCode(c), JSON.parse(raw).label, b.kind);
    return reply({ ok: true }, 200, req, env);
  }

  if (url.pathname === '/admin/note-delete' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const row = await env.DB.prepare('SELECT code FROM admin_notes WHERE id = ?').bind(parseInt(b.id, 10) || 0).first();
    if (!row) return reply({ error: 'Note introuvable.' }, 404, req, env);
    await env.DB.prepare('DELETE FROM admin_notes WHERE id = ?').bind(parseInt(b.id, 10)).run();
    const raw = await env.ACCESS.get('s:' + row.code);
    await journal(env, who, 'Note de suivi supprimée', prettyCode(row.code), raw ? JSON.parse(raw).label : '');
    return reply({ ok: true }, 200, req, env);
  }

  // Code perdu : nouveau code avec exactement les mêmes droits et la même progression ; l'ancien code est désactivé.
  if (url.pathname === '/admin/replace' && req.method === 'POST') {
    const b = await readJson(req);
    const old = normCode(b.code);
    const raw = old && await env.ACCESS.get('s:' + old);
    if (!raw) return reply({ error: 'Code introuvable.' }, 404, req, env);
    const rec = JSON.parse(raw);
    if (rec.remplacePar) return reply({ error: 'Ce code a déjà été remplacé par ' + prettyCode(rec.remplacePar) + '.' }, 400, req, env);
    let code, tries = 0;
    do { code = randomCode(12); tries++; } while ((await env.ACCESS.get('s:' + code)) && tries < 5);
    const fresh = Object.assign({}, rec, { active: true, remplace: old });
    await env.ACCESS.put('s:' + code, JSON.stringify(fresh));
    if (env.DB) {
      await env.DB.batch([
        env.DB.prepare('INSERT OR IGNORE INTO codes (code, created) VALUES (?, ?)').bind(code, now),
        env.DB.prepare('UPDATE progress SET code = ? WHERE code = ?').bind(code, old),
        env.DB.prepare('UPDATE notes SET code = ? WHERE code = ?').bind(code, old),
        env.DB.prepare('UPDATE learners SET code = ? WHERE code = ?').bind(code, old),
        env.DB.prepare('UPDATE admin_notes SET code = ? WHERE code = ?').bind(code, old),
        env.DB.prepare('UPDATE contacts SET code = ? WHERE code = ?').bind(code, old),
        env.DB.prepare('UPDATE relances SET code = ? WHERE code = ?').bind(code, old),
        env.DB.prepare('UPDATE exercises SET code = ? WHERE code = ?').bind(code, old),
        env.DB.prepare('UPDATE prefs SET code = ? WHERE code = ?').bind(code, old),
      ]);
    }
    rec.active = false; rec.remplacePar = code;
    await env.ACCESS.put('s:' + old, JSON.stringify(rec));
    await journal(env, who, 'Code remplacé (perdu)', prettyCode(code), rec.label, 'ancien code ' + prettyCode(old) + ' désactivé');
    return reply({ code: prettyCode(code), label: rec.label }, 200, req, env);
  }

  if (url.pathname === '/admin/create' && req.method === 'POST') {
    const b = await readJson(req);
    const label = String(b.label || '').trim().slice(0, 40);
    const prod = PRODUCTS[b.product];
    if (!label) return reply({ error: 'Indiquez un nom ou des initiales.' }, 400, req, env);
    if (!prod) return reply({ error: 'Produit inconnu.' }, 400, req, env);
    const phone = normPhone(b.phone);
    if (phone === null) return reply({ error: 'Numéro WhatsApp invalide. Exemple : 07 87 01 50 30 ou +225 07 87 01 50 30.' }, 400, req, env);
    // Nouveaux codes : tous les modules du produit dès le départ, limités par l'essai de 7 jours.
    // La date de fin (12 ou 24 mois) est fixée à la première utilisation du code.
    const modules = prod.now.concat(prod.later).map(m => ({ m, from: now }));
    let code, tries = 0;
    do { code = randomCode(12); tries++; } while ((await env.ACCESS.get('s:' + code)) && tries < 5);
    const rec = {
      label, product: b.product, modules, created: now, expires: null, active: true, logins: 0, seen: [],
      essai: true, mois: b.product.startsWith('pack-') ? MONTHS_PACK : MONTHS_SINGLE, premiereUtilisation: null, accesComplet: !!b.immediate,
    };
    await env.ACCESS.put('s:' + code, JSON.stringify(rec));
    if (env.DB) await env.DB.prepare('INSERT OR IGNORE INTO codes (code, created) VALUES (?, ?)').bind(code, now).run();
    if (env.DB && phone) await env.DB.prepare('INSERT OR REPLACE INTO contacts (code, phone, updated) VALUES (?, ?, ?)').bind(code, phone, now).run();
    await journal(env, who, 'Code créé', prettyCode(code), label, b.product + (b.immediate ? ', sans période d\'essai' : ', avec période d\'essai'));
    return reply({ code: prettyCode(code), label, expires: rec.expires }, 200, req, env);
  }

  if (url.pathname === '/admin/update' && req.method === 'POST') {
    const b = await readJson(req);
    const c = normCode(b.code);
    const raw = c && await env.ACCESS.get('s:' + c);
    if (!raw) return reply({ error: 'Code introuvable.' }, 404, req, env);
    const rec = JSON.parse(raw);
    if (b.active === true && rec.remplacePar) return reply({ error: 'Ce code a été remplacé par ' + prettyCode(rec.remplacePar) + ' : il ne peut pas être réactivé.' }, 400, req, env);
    if (typeof b.active === 'boolean') rec.active = b.active;
    if (b.addDays) {
      const add = Math.min(Math.max(parseInt(b.addDays, 10) || 0, 0), 1500);
      // Code pas encore utilisé : les jours s'ajouteront à la date de fin calculée à la première utilisation.
      if (rec.essai && !rec.premiereUtilisation) rec.joursBonus = (rec.joursBonus || 0) + add;
      else rec.expires = Math.max(rec.expires, now) + add * DAY;
    }
    if (b.unlockNow) { rec.modules.forEach(g => { g.from = Math.min(g.from, now); }); rec.accesComplet = true; }
    await env.ACCESS.put('s:' + c, JSON.stringify(rec));
    if (typeof b.active === 'boolean') await journal(env, who, b.active ? 'Code réactivé' : 'Code désactivé', prettyCode(c), rec.label);
    if (b.addDays) await journal(env, who, 'Accès prolongé', prettyCode(c), rec.label, '+' + Math.min(Math.max(parseInt(b.addDays, 10) || 0, 0), 1500) + ' jours');
    if (b.unlockNow) await journal(env, who, 'Tout débloqué', prettyCode(c), rec.label);
    return reply({ ok: true }, 200, req, env);
  }

  // NOUVEAU : Route pour ajouter un module à un étudiant existant
  if (url.pathname === '/admin/add-module' && req.method === 'POST') {
    const b = await readJson(req);
    const c = normCode(b.code);
    const raw = c && await env.ACCESS.get('s:' + c);
    if (!raw) return reply({ error: 'Code introuvable.' }, 404, req, env);
    
    const mod = String(b.module || '').trim();
    if (!findModule(mod)) return reply({ error: 'Module inconnu.' }, 400, req, env);

    const rec = JSON.parse(raw);
    if (!rec.modules.find(g => g.m === mod)) {
      rec.modules.push({ m: mod, from: now });
      await env.ACCESS.put('s:' + c, JSON.stringify(rec));
      await journal(env, who, 'Module ajouté', prettyCode(c), rec.label, mod);
      return reply({ ok: true, message: 'Module ajouté.' }, 200, req, env);
    } else {
      return reply({ ok: true, message: 'Déjà présent.' }, 200, req, env);
    }
  }

  if (url.pathname === '/admin/ids' && req.method === 'PUT') {
    const b = await readJson(req);
    const cfg = await getCfg(env);
    const valid = /^[0-9a-fA-F-]{36}$/;
    let n = 0;
    for (const [k, v] of Object.entries(b.ids || {})) {
      if (!/^[a-z0-9]+-v\d{2}$/.test(k)) continue;
      const id = String(v || '').trim();
      if (!id) { delete cfg.ids[k]; n++; }
      else if (valid.test(id)) { cfg.ids[k] = id; n++; }
    }
    await env.ACCESS.put('cfg', JSON.stringify(cfg));
    await journal(env, who, 'Vidéos Bunny modifiées', '', '', n + ' identifiant(s)');
    return reply({ ok: true, saved: n }, 200, req, env);
  }

  if (url.pathname === '/admin/file' && req.method === 'PUT') {
    const k = url.searchParams.get('k') || '';
    if (!/^[a-z0-9]+-e\d+$/.test(k)) return reply({ error: 'Exercice inconnu.' }, 400, req, env);
    const buf = await req.arrayBuffer();
    if (buf.byteLength < 100 || buf.byteLength > 10 * 1024 * 1024) return reply({ error: 'Fichier vide ou supérieur à 10 Mo.' }, 400, req, env);
    await env.ACCESS.put('f:' + k, buf);
    const cfg = await getCfg(env); cfg.files[k] = true;
    await env.ACCESS.put('cfg', JSON.stringify(cfg));
    await journal(env, who, 'Fichier d\'exercice envoyé', '', '', k + ' (' + Math.round(buf.byteLength / 1024) + ' Ko)');
    return reply({ ok: true }, 200, req, env);
  }
  return reply({ error: 'Introuvable.' }, 404, req, env);
}