// =====================================================================
// GeoExpert Academy : espace apprenant (Cloudflare Worker)
// Le même code sert deux Workers, selon la variable ROLE :
//   ROLE = "apprenant" : uniquement l'API de l'espace apprenant (/api/...)
//   ROLE = "admin"     : la page d'administration (/) et son API (/admin/...), derrière Cloudflare Access
//   ROLE absent        : les deux, comme avant (le temps de la transition)
// =====================================================================
import ADMIN_HTML from './admin.html';
import { CHARTE } from './charte.js';

const CATALOG = [
  {
    "key": "arc1",
    "title": "ArcGIS - Chapitre 1 : Structuration des données géospatiales",
    "meta": "14 leçons, 10 astuces, 5 exercices",
    "videos": [
      {"k": "arc1-v01", "title": "Introduction", "dur": "5:08"},
      {"k": "arc1-v02", "title": "Leçon 1 : Démonstration pas à pas : création d’une géodatabase - ArcMap / ArcCatalog", "dur": "10:03"},
      {"k": "arc1-v03", "title": "Leçon 2 : Importer des points GPS et de levé depuis un CSV et les convertir en SHP", "dur": "14:48"},
      {"k": "arc1-v04", "title": "Leçon 3 : Importer un fichier DXF (format de données AutoCAD) et le convertir en SHP", "dur": "8:13"},
      {"k": "arc1-v05", "title": "Leçon 4 : Importer un fichier GPX (format de données GPS Garmin) dans ArcMap", "dur": "13:15"},
      {"k": "arc1-v06", "title": "Leçon 5 : Comment convertir en SHP et sauvegarder un fichier GPX dans votre base de données", "dur": "8:01"},
      {"k": "arc1-v07", "title": "Leçon 6 : Comment importer un raster dans votre géodatabase", "dur": "16:24"},
      {"k": "arc1-v08", "title": "Leçon 7 : Comment créer un mini-projet SIG : vectorisation et gestion de la table attributaire", "dur": "14:04"},
      {"k": "arc1-v09", "title": "Leçon 8 : Google Earth Pro : rechercher une zone, introduction, création d'un projet et d'un polygone, numérisation des zones d'intérêt (partie 1)", "dur": "17:36"},
      {"k": "arc1-v10", "title": "Leçon 9 : Google Earth Pro : numérisation des zones d'intérêt avec la couche polygone (partie 2)", "dur": "11:43"},
      {"k": "arc1-v11", "title": "Leçon 10 : Google Earth Pro : création d'une couche ligne (trajet ou route) et numérisation des zones d'intérêt avec la couche ligne", "dur": "10:10"},
      {"k": "arc1-v12", "title": "Leçon 11 : Google Earth Pro : création d'une couche point (lieu ou coordonnées) et ajout de lieux sur les zones d'intérêt avec l'outil point", "dur": "6:59"},
      {"k": "arc1-v13", "title": "Leçon 12 : Google Earth Pro : consulter les archives d'images, voir comment un territoire a évolué et cartographier ces changements à deux dates différentes", "dur": "24:23"},
      {"k": "arc1-v14", "title": "Leçon 13 : Google Earth Pro : enregistrer votre projet en KML ou KMZ et l'importer dans votre logiciel SIG ArcMap", "dur": "11:59"},
      {"k": "arc1-v15", "title": "Leçon 14 : Google Earth Pro : comment importer un fichier KML dans notre GDB (base de données) ArcGIS", "dur": "6:08"},
      {"k": "arc1-v16", "title": "Astuce : Afficher le Catalogue et la barre de recherche dans ArcMap", "dur": "0:37"},
      {"k": "arc1-v17", "title": "Astuce : Afficher le fond Google sur un fichier DXF", "dur": "3:44"},
      {"k": "arc1-v18", "title": "Astuce : Bien choisir les coordonnées X et Y d'un fichier CSV dans ArcMap", "dur": "0:27"},
      {"k": "arc1-v19", "title": "Astuce : Bien positionner le raster pour voir la numérisation", "dur": "0:23"},
      {"k": "arc1-v20", "title": "Astuce : Activer l'image satellite sur ArcGIS", "dur": "0:50"},
      {"k": "arc1-v21", "title": "Astuce : Déconnecter des dossiers dans le Catalogue d'ArcGIS", "dur": "0:54"},
      {"k": "arc1-v22", "title": "Astuce : Supprimer une vectorisation faite par erreur", "dur": "0:59"},
      {"k": "arc1-v23", "title": "Astuce : Déplacer une feature class dans un feature dataset", "dur": "0:33"},
      {"k": "arc1-v24", "title": "Astuce : Enregistrer un fichier DXF complexe dans votre base de données", "dur": "1:22"},
      {"k": "arc1-v25", "title": "Astuce : Activer la barre Editor dans ArcMap", "dur": "1:40"}
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
      {"k": "arc2-v01", "title": "Introduction : l'analyse spatiale avancée expliquée", "dur": "10:14"},
      {"k": "arc2-v02", "title": "Leçon 1 : Introduction et création d'un nouveau feature dataset", "dur": "10:03"},
      {"k": "arc2-v03", "title": "Leçon 2 : Comment extraire les courbes de niveau à partir d'un MNT", "dur": "14:48"},
      {"k": "arc2-v04", "title": "Leçon 3 : Comment définir les classes d'altitude du relief et la pente", "dur": "8:13"},
      {"k": "arc2-v05", "title": "Leçon 4 : Comment extraire un territoire situé dans une zone de référence", "dur": "13:15"},
      {"k": "arc2-v06", "title": "Leçon 5 : Comment extraire une couche raster à partir d'une donnée vectorielle", "dur": "8:01"},
      {"k": "arc2-v07", "title": "Leçon 6 : Comment extraire des polygones, des lignes et des points avec l'outil Clip", "dur": "16:24"},
      {"k": "arc2-v08", "title": "Leçon 7 : Utiliser efficacement l'outil Intersect", "dur": "14:04"},
      {"k": "arc2-v09", "title": "Leçon 8 : Comment utiliser efficacement l'outil Buffer et le buffer multiple", "dur": "24:00"},
      {"k": "arc2-v10", "title": "Leçon 9 : Comment utiliser efficacement l'outil Near", "dur": "14:31"},
      {"k": "arc2-v11", "title": "Leçon 10 : Comment télécharger des données vectorielles et raster (partie 1)", "dur": "56:54"},
      {"k": "arc2-v12", "title": "Leçon 11 : Comment télécharger des données vectorielles et raster (partie 2)", "dur": "34:48"},
      {"k": "arc2-v13", "title": "Leçon 12 : Mise en page cartographique professionnelle", "dur": "5:52"},
      {"k": "arc2-v14", "title": "Astuce : Comment exporter des courbes de niveau vers AutoCAD", "dur": "6:59"},
      {"k": "arc2-v15", "title": "Astuce : Comment exporter des courbes de niveau en KMZ depuis ArcMap", "dur": "6:59"}
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
    "meta": "15 leçons, 2 astuces, 5 exercices",
    "videos": [
      {"k": "qgis1-v01", "title": "Introduction", "dur": "4:36"},
      {"k": "qgis1-v02", "title": "Leçon 1 : Comment créer une base de données sur QGIS", "dur": "8:12"},
      {"k": "qgis1-v03", "title": "Leçon 2 : Créer trois couches (polygone, ligne et point) et les importer dans la base de données", "dur": "9:46"},
      {"k": "qgis1-v04", "title": "Leçon 3 : Comment importer un fichier CSV dans QGIS et le sauvegarder dans le GeoPackage", "dur": "7:13"},
      {"k": "qgis1-v05", "title": "Leçon 4 : Comment importer un fichier DXF (format de données AutoCAD) dans QGIS", "dur": "3:40"},
      {"k": "qgis1-v06", "title": "Leçon 5 : Enregistrer un fichier DXF (format de données AutoCAD) dans notre base de données QGIS (GeoPackage)", "dur": "1:54"},
      {"k": "qgis1-v07", "title": "Leçon 6 : Comment importer un fichier GPX (format de données GPS) dans QGIS et le sauvegarder dans la base de données", "dur": "3:50"},
      {"k": "qgis1-v08", "title": "Leçon 7 : Comment importer un fichier raster dans QGIS", "dur": "6:05"},
      {"k": "qgis1-v09", "title": "Leçon 8 : Comment créer un mini-projet SIG : vectorisation et gestion de la table attributaire (partie 1)", "dur": "8:52"},
      {"k": "qgis1-v10", "title": "Leçon 9 : Comment créer un mini-projet SIG : vectorisation et gestion de la table attributaire (partie 2)", "dur": "0:27", "hidden": true},
      {"k": "qgis1-v11", "title": "Leçon 10 : Google Earth Pro : rechercher une zone, introduction, création d'un projet et d'un polygone, numérisation des zones d'intérêt (partie 1)", "dur": "17:36"},
      {"k": "qgis1-v12", "title": "Leçon 11 : Google Earth Pro : numérisation des zones d'intérêt avec la couche polygone (partie 2)", "dur": "11:43"},
      {"k": "qgis1-v13", "title": "Leçon 12 : Google Earth Pro : création d'une couche ligne (trajet ou route) et numérisation des zones d'intérêt avec la couche ligne", "dur": "10:10"},
      {"k": "qgis1-v14", "title": "Leçon 13 : Google Earth Pro : création d'une couche point (lieu ou coordonnées) et ajout de lieux sur les zones d'intérêt avec l'outil point", "dur": "6:59"},
      {"k": "qgis1-v15", "title": "Leçon 14 : Google Earth Pro : consulter les archives d'images, voir comment un territoire a évolué et cartographier ces changements à deux dates différentes", "dur": "24:23"},
      {"k": "qgis1-v16", "title": "Leçon 15 : Google Earth Pro : enregistrer votre projet en KML ou KMZ et l'importer dans votre logiciel SIG QGIS", "dur": "3:14"},
      {"k": "qgis1-v17", "title": "Leçon 16 : Comment importer un fichier KML dans votre GeoPackage (GPKG) QGIS", "dur": "2:52"},
      {"k": "qgis1-v18", "title": "Astuce : Comment activer Google Satellite dans QGIS", "dur": "3:55"},
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
      {"k": "qgis2-v01", "title": "Leçon 1 : Introduction", "dur": "2:32"},
      {"k": "qgis2-v02", "title": "Leçon 2 : Comment extraire les courbes de niveau à partir d'un MNT", "dur": "14:34"},
      {"k": "qgis2-v03", "title": "Leçon 3 : Comment définir la pente (slope) à partir d'un MNT", "dur": "6:58"},
      {"k": "qgis2-v04", "title": "Leçon 4 : Comment définir les classes d'altitude du relief sans les courbes de niveau et la pente", "dur": "7:30"},
      {"k": "qgis2-v05", "title": "Leçon 5 : Comment utiliser efficacement l'outil Clip et l'extraction par masque dans QGIS", "dur": "17:20"},
      {"k": "qgis2-v06", "title": "Leçon 6 : Importer toutes les couches vectorielles dans le projet", "dur": "9:31"},
      {"k": "qgis2-v07", "title": "Leçon 7 : Découper toutes les données vectorielles dans la zone d'étude", "dur": "13:41"},
      {"k": "qgis2-v08", "title": "Leçon 8 : Utiliser efficacement l'outil Intersect dans QGIS", "dur": "23:31"},
      {"k": "qgis2-v09", "title": "Leçon 9 : Comment utiliser efficacement l'outil Buffer (tampon) dans QGIS", "dur": "25:39"},
      {"k": "qgis2-v10", "title": "Leçon 10 : Comment utiliser efficacement l'outil Proximity", "dur": "14:12"},
      {"k": "qgis2-v11", "title": "Leçon 11 : Comment télécharger des données vectorielles et raster (partie 1)", "dur": "14:12"},
      {"k": "qgis2-v12", "title": "Leçon 12 : Comment télécharger des données vectorielles et raster (partie 2)", "dur": "14:12"},
      {"k": "qgis2-v13", "title": "Leçon 13 : Mise en page cartographique professionnelle", "dur": "14:12"}
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
    "meta": "23 leçons, 4 h 37",
    "videos": [
      {"k": "tele-v01", "title": "Introduction", "dur": "19:48"},
      {"k": "tele-v02", "title": "Leçon 1 : Composite des bandes des images Landsat sur ArcMap", "dur": "21:04"},
      {"k": "tele-v03", "title": "Leçon 2 : Composition colorée (manipuler les différentes bandes Landsat)", "dur": "12:05"},
      {"k": "tele-v04", "title": "Leçon 3 : Préparation des bandes pour le NDVI 2013", "dur": "12:11"},
      {"k": "tele-v05", "title": "Leçon 4 : Calcul du NDVI 2013", "dur": "16:08"},
      {"k": "tele-v06", "title": "Leçon 5 : Calcul du NDVI 2025", "dur": "11:48"},
      {"k": "tele-v07", "title": "Leçon 6 : Introduction au NDWI et au MNDWI", "dur": "4:10"},
      {"k": "tele-v08", "title": "Leçon 7 : Application du NDWI", "dur": "18:16"},
      {"k": "tele-v09", "title": "Leçon 8 : Application du MNDWI et différence avec le NDWI", "dur": "18:33"},
      {"k": "tele-v10", "title": "Leçon 9 : Application du MNDWI en 2025", "dur": "11:15"},
      {"k": "tele-v11", "title": "Leçon 10 : Introduction au NDBI", "dur": "1:57"},
      {"k": "tele-v12", "title": "Leçon 11 : Application du NDBI 2013", "dur": "10:58"},
      {"k": "tele-v13", "title": "Leçon 12 : Application du NDBI en 2025", "dur": "5:50"},
      {"k": "tele-v14", "title": "Leçon 13 : Introduction au NBR", "dur": "2:49"},
      {"k": "tele-v15", "title": "Leçon 14 : Application du NBR", "dur": "20:06"},
      {"k": "tele-v16", "title": "Leçon 15 : Introduction à la classification non supervisée", "dur": "6:24"},
      {"k": "tele-v17", "title": "Leçon 16 : Application de la classification non supervisée avec 9 classes", "dur": "7:07"},
      {"k": "tele-v18", "title": "Leçon 17 : Classification non supervisée avec 5 classes", "dur": "22:43"},
      {"k": "tele-v19", "title": "Leçon 18 : Mise en page, choix du format A3 paysage", "dur": "8:12"},
      {"k": "tele-v20", "title": "Leçon 19 : Mise en page, insertion du nord géographique", "dur": "4:35"},
      {"k": "tele-v21", "title": "Leçon 20 : Mise en page, insertion de la légende", "dur": "19:25"},
      {"k": "tele-v22", "title": "Leçon 21 : Mise en page, insertion de l'échelle et du titre", "dur": "7:26"},
      {"k": "tele-v23", "title": "Leçon 22 : Mise en page, insertion de la source des données et de la grille", "dur": "14:20"}
    ],
    "exercises": []
  },
  {
    "key": "web",
    "title": "Webmapping : créer et déployer une application",
    "meta": "2 vidéos, 4 h 30",
    "videos": [
      {"k": "web-v01", "title": "VIDÉO 1. Création d'une application de webmapping avec ArcGIS Online", "dur": "2:19:13"},
      {"k": "web-v02", "title": "VIDÉO 2. Création d'une application de webmapping avec ArcGIS Online (suite)", "dur": "2:12:05"}
    ],
    "exercises": []
  },
  {
    "key": "kobo",
    "title": "KoboToolbox : collecte mobile et intégration SIG",
    "meta": "3 vidéos, 55 min",
    "videos": [
      {"k": "kobo-v01", "title": "VIDÉO 1. Introduction à la collecte de données", "dur": "3:00"},
      {"k": "kobo-v02", "title": "VIDÉO 2. Création de votre compte KoboToolbox", "dur": "39:10"},
      {"k": "kobo-v03", "title": "VIDÉO 3. Paramètres de l'application et collecte de données", "dur": "12:23"}
    ],
    "exercises": []
  },
  {
    "key": "google",
    "title": "Google Earth et outils complémentaires aux SIG",
    "meta": "8 vidéos, 1 h 30",
    "videos": [
      {"k": "google-v01", "title": "Google Earth Pro : rechercher une zone, introduction, création d'un projet et d'un polygone, numérisation des zones d'intérêt (partie 1)", "dur": "17:36"},
      {"k": "google-v02", "title": "Google Earth Pro : numérisation des zones d'intérêt avec la couche polygone (partie 2)", "dur": "11:43"},
      {"k": "google-v03", "title": "Google Earth Pro : création d'une couche ligne (trajet ou route) et numérisation des zones d'intérêt avec la couche ligne", "dur": "10:10"},
      {"k": "google-v04", "title": "Google Earth Pro : création d'une couche point (lieu ou coordonnées) et ajout de lieux sur les zones d'intérêt avec l'outil point", "dur": "6:59"},
      {"k": "google-v05", "title": "Google Earth Pro : consulter les archives d'images, voir comment un territoire a évolué et cartographier ces changements à deux dates différentes", "dur": "24:23"},
      {"k": "google-v06", "title": "Google Earth Pro : enregistrer votre projet en KML ou KMZ et l'importer dans votre logiciel SIG ArcMap", "dur": "11:59"},
      {"k": "google-v07", "title": "Google Earth Pro : enregistrer votre projet en KML ou KMZ et l'importer dans votre logiciel SIG QGIS", "dur": "3:14"},
      {"k": "google-v08", "title": "Google Earth Pro : comment importer un fichier KML dans notre GDB (base de données) ArcGIS", "dur": "6:08"}
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
// Catalogue courant : celui du code (CATALOG), ou la version modifiée dans l'administration (table D1 « content »).
// Pour chaque formation, la liste des leçons (ordre, titre, durée, masquée, fichiers) peut être remplacée ;
// les formations, leurs titres et leurs exercices restent ceux du code.
let CAT = CATALOG, catAt = 0, catRaw = null;
async function loadCatalog(env, force) {
  if (!env.DB) { CAT = CATALOG; return CAT; }
  if (!force && Date.now() - catAt < 30000) return CAT;
  try {
    const row = await env.DB.prepare('SELECT data FROM content WHERE id = 1').first();
    catRaw = row ? JSON.parse(row.data) : null;
    CAT = CATALOG.map(m => catRaw && catRaw.modules && catRaw.modules[m.key] ? Object.assign({}, m, { videos: catRaw.modules[m.key] }) : m);
    catAt = Date.now();
  } catch (e) { CAT = CATALOG; }
  return CAT;
}
function findModule(m) { return CAT.find(x => x.key === m); }
// Leçons visibles par les apprenants (les leçons masquées gardent la progression, mais disparaissent de leur page).
function vis(m) { return m.videos.filter(v => !v.hidden); }
// Leçon d'un fichier de leçon (ex. « qgis1-v05-f2 » → « qgis1-v05 »).
function lessonOfFile(k) { return String(k).replace(/-f\d+$/, ''); }
// Fichier de leçon (entrée du catalogue), ex. { k, title } (stocké dans KV) ou { k, title, r2, size } (gros fichier R2).
function lessonFile(k) {
  const m = findModule(moduleOf(k)), v = m && m.videos.find(x => x.k === lessonOfFile(k));
  return v ? (v.files || []).find(f => f.k === k) || null : null;
}
// Nom de fichier propre pour le navigateur (sans accents ni espaces), ex. « Plan_ancien_1950.tif ».
function cleanFilename(title, ext) {
  return (String(title).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') || 'Fichier') + ext;
}
function fmtSize(n) {
  return n >= 1e9 ? (n / 1e9).toFixed(1).replace('.', ',') + ' Go' : n >= 1e6 ? Math.round(n / 1e6) + ' Mo' : Math.max(1, Math.round(n / 1e3)) + ' Ko';
}

// ---------------------------------------------------------------- Gros fichiers (Cloudflare R2, binding FICHIERS)
// Le bucket n'est jamais public. Après les vérifications de /api/file, l'apprenant reçoit un lien signé de courte durée
// vers CE Worker (/dl/…), qui lit le fichier dans R2 et l'envoie en continu (streaming) : presque aucun temps de calcul,
// et pas de limite de taille de réponse sur le plan Workers gratuit.
const DL_MINUTES = 30;   // durée de validité du lien (le téléchargement commencé continue après)
async function dlSig(env, k, key, exp) { return (await hmacHex(env.DL_SECRET, enc.encode(k + '|' + key + '|' + exp))).slice(0, 40); }
async function download(req, env, url) {
  const html = (status, msg) => new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Téléchargement</title>'
    + '<p style="font:16px sans-serif;margin:40px auto;max-width:480px;padding:0 16px">' + msg + '</p>', { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  const [, , k, exp, sig] = url.pathname.split('/');
  const f = /^[a-z0-9]+-v\d{2,3}-f\d+$/.test(k || '') ? lessonFile(k) : null;
  if (!env.FICHIERS || !env.DL_SECRET || !f || !f.r2 || !/^\d{10}$/.test(exp || '') || !(await safeEqual(sig || '', await dlSig(env, k, f.r2, exp))))
    return html(403, 'Lien de téléchargement non valable. Retournez dans votre espace apprenant et cliquez à nouveau sur « Télécharger ».');
  if (Date.now() / 1000 > +exp) return html(403, 'Ce lien de téléchargement a expiré. Retournez dans votre espace apprenant et cliquez à nouveau sur « Télécharger ».');
  const ext = ((f.r2.match(/\.[a-z0-9]{1,5}$/i) || [''])[0]).toLowerCase();
  const name = cleanFilename(f.title, ext);
  const head = req.method === 'HEAD';
  const range = req.headers.get('Range');
  const obj = head ? await env.FICHIERS.head(f.r2) : await env.FICHIERS.get(f.r2, range ? { range: req.headers } : {});
  if (!obj) return html(404, 'Ce fichier sera disponible prochainement.');
  const h = {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename="' + name + '"; filename*=UTF-8\'\'' + encodeURIComponent(name),
    'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes', 'ETag': obj.httpEtag,
  };
  // Reprise d'un téléchargement interrompu (en-tête Range) : réponse partielle 206.
  if (!head && range && obj.range) {
    const r = obj.range, size = obj.size;
    const start = r.suffix !== undefined ? Math.max(size - r.suffix, 0) : r.offset || 0;
    const len = r.suffix !== undefined ? size - start : (r.length !== undefined ? r.length : size - start);
    h['Content-Range'] = 'bytes ' + start + '-' + (start + len - 1) + '/' + size; h['Content-Length'] = String(len);
    return new Response(obj.body, { status: 206, headers: h });
  }
  h['Content-Length'] = String(obj.size);
  return new Response(head ? null : obj.body, { status: 200, headers: h });
}
// Liste du bucket (administration) : objets + taille totale (offre gratuite R2 : 10 Go).
async function r2List(env) {
  const objects = []; let cursor;
  do {
    const l = await env.FICHIERS.list({ cursor, limit: 1000 });
    l.objects.forEach(o => objects.push({ key: o.key, size: o.size, uploaded: o.uploaded ? o.uploaded.getTime() : 0 }));
    cursor = l.truncated ? l.cursor : null;
  } while (cursor);
  return { objects, total: objects.reduce((s, o) => s + o.size, 0) };
}

// ---------------------------------------------------------------- Mes ressources (livret, kit, guide, cours PDF)
// Liste dans la table D1 « ressources » ; fichiers dans R2 (bucket privé), sous « ressources/<id>/ ».
// Règle : « immediat » (dès la 1re connexion) ou « j8 » (comme les leçons : fin de l'essai ; tout de suite pour les anciens codes).
// « pour » : '' = tous les apprenants ; une formation (qgis1…) ; ou un produit (pack-complet).
// Chaque document téléchargé porte « Document réservé à [nom] – [code] – GeoExpert Academy » :
//   HTML : le texte remplace %%RESERVE%% ; PDF : le fichier a été préparé dans l'administration (pdf-lib, dans le navigateur)
//   avec une zone vide réservée sur chaque page ; ici on écrit seulement le texte dans cette zone (même taille d'octets,
//   la structure du PDF ne change pas), ce qui reste très rapide (limite de 10 ms de calcul du plan gratuit).
const RESS_REGLES = ['immediat', 'j8'];
const RESS_MAX = 30 * 1024 * 1024;
const RESS_ZONE = 900;   // octets réservés par zone de marquage (doit être identique dans admin.html)
// Largeurs Helvetica (1/1000 de point) des octets WinAnsi 32 à 255.
const HELV = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584,0,556,0,222,556,333,1000,556,556,333,1000,667,333,1000,0,611,0,0,222,222,333,333,350,556,1000,333,1000,500,333,944,0,500,500,278,333,556,556,556,556,260,556,333,737,370,556,584,333,737,333,400,584,333,333,333,556,537,278,333,333,365,556,834,834,834,611,667,667,667,667,667,667,1000,722,667,667,667,667,278,278,278,278,722,722,778,778,778,778,778,584,778,722,722,722,722,667,667,611,556,556,556,556,556,556,889,500,556,556,556,556,278,278,278,278,556,556,556,556,556,556,556,584,611,556,556,556,556,500,556,500];
const WINANSI_80 = '€\u0081‚ƒ„…†‡ˆ‰Š‹Œ\u008dŽ\u008f\u0090‘’“”•–—˜™š›œ\u009džŸ';
function winAnsi(s) {
  const out = [];
  for (const ch of String(s)) {
    const u = ch.codePointAt(0), i = WINANSI_80.indexOf(ch);
    if (u >= 32 && u < 127 || u >= 160 && u <= 255) out.push(u);
    else if (i >= 0 && HELV[i + 96]) out.push(0x80 + i);
    else { const a = ch.normalize('NFD').replace(/[̀-ͯ]/g, ''); out.push(a.length === 1 && a.charCodeAt(0) >= 32 && a.charCodeAt(0) < 127 ? a.charCodeAt(0) : 63); }
  }
  return out;
}
function reserveText(rec, c) { return 'Document réservé à ' + String(rec.label || '').trim().slice(0, 60) + ' – ' + prettyCode(c) + ' – GeoExpert Academy'; }
// Contenu d'une zone de marquage : texte gris centré tout en bas de la page (sous les pieds de page existants), complété par des espaces jusqu'à RESS_ZONE octets.
function stampBytes(z, text) {
  const b = winAnsi(text), w = b.reduce((a, x) => a + (HELV[x - 32] || 556), 0) / 1000;
  const size = Math.min(7.5, (z.w - 40) / w), x = z.x + (z.w - w * size) / 2, y = z.y + 9;
  const hex = b.map(x => x.toString(16).padStart(2, '0')).join('');
  const s = 'q BT /GXR ' + size.toFixed(2) + ' Tf 0.541 0.608 0.710 rg 1 0 0 1 ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' Tm <' + hex + '> Tj ET Q';
  return s.length <= RESS_ZONE ? enc.encode(s.padEnd(RESS_ZONE, ' ')) : null;
}
// Possède la ressource ? Renvoie la date de déblocage (0 = tout de suite), ou null si elle n'est pas pour cet apprenant.
function ressUnlock(rec, r, now) {
  let from = 0;
  if (r.pour) {
    const g = rec.modules.find(x => x.m === r.pour);
    if (!g && rec.product !== r.pour) return null;
    if (g && g.from > now) from = g.from;
  }
  if (r.regle === 'j8') { const te = trialEnd(rec); if (te > now) from = Math.max(from, te); }
  return from;
}
async function loadRessources(env, all) {
  if (!env.DB) return [];
  try { return (await env.DB.prepare('SELECT * FROM ressources' + (all ? '' : ' WHERE visible = 1') + ' ORDER BY ordre, title').all()).results; }
  catch (e) { return []; }
}
function ressFilename(r) { return cleanFilename(r.title, r.kind === 'html' ? '.html' : '.pdf'); }
// Charte acceptée (version en cours) : date d'acceptation, ou 0. Sans base de données : on ne bloque rien (comme avant).
async function charteAcceptee(env, c) {
  if (!env.DB) return Date.now();
  try { const r = await env.DB.prepare('SELECT t FROM chartes WHERE code = ? AND version = ?').bind(c, CHARTE.version).first(); return r ? r.t : 0; }
  catch (e) { return Date.now(); }
}
// Lien de téléchargement d'une ressource : /r/<id>/<expiration>/<code chiffré>/<signature>, valable DL_MINUTES.
// Le code d'accès n'apparaît jamais en clair dans l'adresse (chiffré en AES-GCM avec une clé tirée de DL_SECRET).
async function ressKey(env) {
  return crypto.subtle.importKey('raw', await crypto.subtle.digest('SHA-256', enc.encode('ressources|' + env.DL_SECRET)), 'AES-GCM', false, ['encrypt', 'decrypt']);
}
function b64uEnc(u8) { return btoa(String.fromCharCode(...u8)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
async function ressLink(env, origin, id, c, now) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await ressKey(env), enc.encode(c)));
  const tok = b64uEnc(new Uint8Array([...iv, ...ct])), exp = String(Math.floor(now / 1000) + DL_MINUTES * 60);
  const sig = (await hmacHex(env.DL_SECRET, enc.encode('r|' + id + '|' + exp + '|' + tok))).slice(0, 40);
  return origin + '/r/' + id + '/' + exp + '/' + tok + '/' + sig;
}
// Vérifications communes (POST /api/ressource et GET /r/…) : renvoie { r } ou { error, status }.
async function ressCheck(env, rec, c, id, now) {
  const r = env.DB && /^[a-z0-9-]{1,40}$/.test(id) ? await env.DB.prepare('SELECT * FROM ressources WHERE id = ? AND visible = 1').bind(id).first() : null;
  const from = r ? ressUnlock(rec, r, now) : null;
  if (!r || from === null) return { status: 403, error: 'Cette ressource ne fait pas partie de votre formation.' };
  if (from > now) return { status: 403, error: 'Cette ressource sera disponible à partir du ' + fmtDate(from) + '.' };
  if (!(await charteAcceptee(env, c))) return { status: 403, error: 'Acceptez d\'abord la charte de l\'apprenant (rechargez la page).' };
  if (!r.r2 || !env.FICHIERS) return { status: 404, error: 'Cette ressource sera disponible prochainement.' };
  return { r };
}
async function ressDownload(req, env, url) {
  const html = (status, msg) => new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Ressource</title>'
    + '<p style="font:16px sans-serif;margin:40px auto;max-width:480px;padding:0 16px">' + msg + '</p>', { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  const [, , id, exp, tok, sig] = url.pathname.split('/');
  const bad = 'Lien non valable. Retournez dans votre espace apprenant, rubrique « Mes ressources ».';
  if (!env.DL_SECRET || !/^[a-z0-9-]{1,40}$/.test(id || '') || !/^\d{10}$/.test(exp || '') || !/^[A-Za-z0-9_-]{20,120}$/.test(tok || '')
    || !(await safeEqual(sig || '', (await hmacHex(env.DL_SECRET, enc.encode('r|' + id + '|' + exp + '|' + tok))).slice(0, 40)))) return html(403, bad);
  if (Date.now() / 1000 > +exp) return html(403, 'Ce lien a expiré. Retournez dans votre espace apprenant, rubrique « Mes ressources ».');
  let c;
  try {
    const raw = Uint8Array.from(atob(tok.replace(/-/g, '+').replace(/_/g, '/')), x => x.charCodeAt(0));
    c = new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: raw.slice(0, 12) }, await ressKey(env), raw.slice(12)));
  } catch (e) { return html(403, bad); }
  // L'accès est revérifié au moment du téléchargement (code désactivé, expiré, ressource retirée…).
  const found = await findStudent(env, c), now = Date.now();
  if (!found || studentStatus(found.rec, now) !== 'ok') return html(403, 'Accès désactivé ou expiré. Écrivez-nous sur WhatsApp.');
  const chk = await ressCheck(env, found.rec, found.c, id, now);
  if (chk.error) return html(chk.status, chk.error);
  const r = chk.r, obj = await env.FICHIERS.get(r.r2);
  if (!obj) return html(404, 'Cette ressource sera disponible prochainement.');
  const text = reserveText(found.rec, found.c), name = ressFilename(r);
  const h = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
  if (r.kind === 'html') {
    const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // %%RESERVE_CSS%% : même texte dans une feuille de style (pied de chaque page imprimée, @page { @bottom-center }).
    const css = text.replace(/[\\"]/g, '\\$&').replace(/[\r\n<>]/g, ' ');
    return new Response((await obj.text()).split('%%RESERVE_CSS%%').join(css).split('%%RESERVE%%').join(esc), { status: 200, headers: Object.assign(h, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'inline; filename="' + name + '"',
      'Content-Security-Policy': "default-src 'none'; img-src data:; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    }) });
  }
  const buf = new Uint8Array(await obj.arrayBuffer());
  let zones = [];
  try { zones = JSON.parse(r.stamp || '[]'); } catch (e) { zones = []; }
  const marker = enc.encode('%GXRZONE');
  for (const z of zones) {
    const b = stampBytes(z, text);
    // Sécurité : on n'écrit que si la zone réservée est bien à cet endroit (sinon le PDF serait abîmé).
    if (!b || !(z.off >= 0 && z.off + RESS_ZONE <= buf.length) || !marker.every((x, i) => buf[z.off + i] === x)) return html(500, 'Document momentanément indisponible. Prévenez le formateur sur WhatsApp.');
    buf.set(b, z.off);
  }
  return new Response(buf, { status: 200, headers: Object.assign(h, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="' + name + '"; filename*=UTF-8\'\'' + encodeURIComponent(name),
    'Content-Length': String(buf.length),
  }) });
}

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
    h['Access-Control-Expose-Headers'] = 'Content-Disposition'; // la page peut lire le vrai nom du fichier téléchargé
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
  return { ids: c.ids || {}, files: c.files || {}, names: c.names || {} };
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
// Numéro d'attestation : ATT-XXXX-XXXX (différent des codes d'accès GEO-…).
function certId() { const s = randomCode(8); return 'ATT-' + s.slice(0, 4) + '-' + s.slice(4); }
// Durée totale des vidéos d'une formation, ex. « 3 h 12 ».
function moduleHours(m) {
  const s = vis(m).reduce((a, v) => a + String(v.dur).split(':').reduce((x, y) => x * 60 + (+y || 0), 0), 0);
  const h = Math.floor(s / 3600), mn = Math.round(s % 3600 / 60);
  return h ? h + ' h ' + String(mn).padStart(2, '0') : mn + ' min';
}
// Attestations valides et avis déjà donnés d'un apprenant (pour sa page).
async function loadCertsAndReviews(env, c) {
  if (!env.DB) return { certs: [], reviewed: [] };
  try {
    const [a, r] = await env.DB.batch([
      env.DB.prepare('SELECT id, module, name, title, hours, t FROM certificates WHERE code = ? AND revoked = 0 ORDER BY t').bind(c),
      env.DB.prepare('SELECT module FROM reviews WHERE code = ?').bind(c),
    ]);
    return { certs: a.results, reviewed: r.results.map(x => x.module) };
  } catch (e) { return { certs: [], reviewed: [] }; }
}
// Vérification publique d'une attestation (page « Vérifier un certificat ») : aucun code d'accès nécessaire.
async function publicCert(req, env, url) {
  const id = String(url.searchParams.get('id') || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20);
  if (!env.DB || !/^ATT-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/.test(id)) return reply({ valid: false }, 200, req, env);
  const row = await env.DB.prepare('SELECT id, name, title, hours, t, revoked FROM certificates WHERE id = ?').bind(id).first();
  if (!row) return reply({ valid: false }, 200, req, env);
  if (row.revoked) return reply({ valid: false, revoked: true, id: row.id }, 200, req, env);
  return reply({ valid: true, id: row.id, name: row.name, title: row.title, hours: row.hours, t: row.t }, 200, req, env, { 'Cache-Control': 'public, max-age=300' });
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
  const m = findModule(moduleOf(k)), lk = lessonOfFile(k);
  const i = m ? vis(m).findIndex(v => v.k === lk) : -1;
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
// Leçons de l'apprenant qui ont un mini-quiz (seulement les clés : les questions sont envoyées à l'ouverture du quiz).
async function loadQuizKeys(env, rec) {
  if (!env.DB) return [];
  try { return (await env.DB.prepare('SELECT k FROM quizzes').all()).results.map(r => r.k).filter(k => ownsLesson(rec, k)); }
  catch (e) { return []; }
}
// Vérifie et nettoie un quiz écrit dans l'administration. Renvoie { questions } ou { error }.
function cleanQuiz(qs) {
  if (!Array.isArray(qs) || qs.length < 1 || qs.length > 5) return { error: 'Un quiz contient de 1 à 5 questions.' };
  const out = [];
  for (let i = 0; i < qs.length; i++) {
    const x = qs[i] || {}, n = i + 1;
    const q = String(x.q || '').trim().slice(0, 300);
    const choices = (Array.isArray(x.choices) ? x.choices : []).map(c => String(c || '').trim().slice(0, 150)).filter(Boolean);
    const answer = parseInt(x.answer, 10);
    if (!q) return { error: 'Question ' + n + ' : écrivez la question.' };
    if (choices.length < 2 || choices.length > 4) return { error: 'Question ' + n + ' : il faut de 2 à 4 réponses.' };
    if (!(answer >= 0 && answer < choices.length)) return { error: 'Question ' + n + ' : choisissez la bonne réponse.' };
    out.push({ q, choices, answer, explain: String(x.explain || '').trim().slice(0, 300) });
  }
  return { questions: out };
}
// Leçon (vidéo) d'un module de l'apprenant.
function ownsLesson(rec, k) {
  const m = findModule(moduleOf(k));
  return !!m && rec.modules.some(g => g.m === m.key) && vis(m).some(v => v.k === k);
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

// ---------------------------------------------------------------- Paiements DigitalPaye (webhooks)
// Liens de paiement du site (formations-video-geoexpert.html, attribut data-link) → produit. Prix attendus en FCFA.
const LIENS = {
  'l0sNNklrbHcH': 'arc1', 'qKk96zGepbQ0': 'arc2', 'EVli5Yhhk9QD': 'qgis1', 'cK0Q6QrMdEBB': 'qgis2',
  'amqThnoWczd8': 'tele', 'DBeEmN5qdD0F': 'web', 't1orZESwHB7C': 'kobo', 'rxlgDDoMiBCu': 'google',
  'iuiqjHbR5b7a': 'pack-qgis', 'y1udN30HlczI': 'pack-arcgis', 'Al3BVi8KpMq9': 'pack-complet',
};
const PRIX = { arc1: 15000, arc2: 20000, qgis1: 15000, qgis2: 20000, tele: 25000, web: 20000, kobo: 15000, google: 10000, 'pack-qgis': 25000, 'pack-arcgis': 25000, 'pack-complet': 100000 };
const PAY_OK = ['transaction.successful', 'payment_link.paid', 'order.paid'];

// Liens de la Sandbox (environnement de test uniquement, variable DP_LIENS_TEST) : ils ne remplacent jamais les vrais.
function liensConnus(env) {
  let extra = {};
  try { extra = env.DP_LIENS_TEST ? JSON.parse(env.DP_LIENS_TEST) : {}; } catch (e) { extra = {}; }
  return Object.assign({}, extra, LIENS);
}
async function hmacHex(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return [...new Uint8Array(await crypto.subtle.sign('HMAC', key, data))].map(x => x.toString(16).padStart(2, '0')).join('');
}
// API DigitalPaye : jeton valable 10 minutes (on le renouvelle au bout de 8).
let dpToken = null, dpTokenAt = 0;
async function dpApi(env, path) {
  const base = String(env.DP_API_URL || 'https://api.digitalpaye.com').replace(/\/+$/, '');
  if (!dpToken || Date.now() - dpTokenAt > 8 * 60000) {
    const r = await fetch(base + '/v1/auth/token', { method: 'POST', headers: { 'Authorization': 'Basic ' + btoa(env.DP_API_KEY + ':' + env.DP_API_SECRET) } });
    const j = await r.json().catch(() => ({}));
    const t = j.access_token || (j.data && j.data.access_token);
    if (!r.ok || !t) throw new Error('jeton ' + r.status + ' ' + JSON.stringify(j.error || j.message || j.code || '').slice(0, 150));
    dpToken = t; dpTokenAt = Date.now();
  }
  const r = await fetch(base + path, { headers: { 'Authorization': 'Bearer ' + dpToken } });
  if (r.status === 401) dpToken = null;
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('transaction ' + r.status + ' ' + (await r.text().catch(() => '')).slice(0, 150));
  const j = await r.json();
  return j.data && typeof j.data === 'object' && (j.data.reference || j.data.status) ? j.data : j;
}
function cleanText(s, n) { return String(s || '').replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n); }
function capitalize(s) { return String(s || '').toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()); }
// Date de déblocage si l'apprenant se connecte aujourd'hui (0 h UTC du 8e jour, comme trialEnd).
function unlockFrom(now) { const d = new Date(now); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + TRIAL_DAYS); }

// Réception d'un webhook : signature vérifiée (obligatoire), puis confirmation auprès de l'API DigitalPaye quand elle répond.
// Le 25/10/2026, l'API refuse les appels venant de Cloudflare (HTTP 520) et le webhook ne contient que la référence,
// le statut et le montant : le paiement est alors enregistré sur la foi de la signature, et l'administrateur complète
// le nom, le téléphone (et la formation si plusieurs ont le même prix). Si l'API répond un jour, tout se remplit seul.
async function webhookDigitalPaye(req, env) {
  const R = (d, s) => reply(d, s, req, env);
  if (req.method !== 'POST') return R({ error: 'Méthode non autorisée.' }, 405);
  if (!env.DB || !env.DP_WEBHOOK_SECRET) return R({ error: 'Réception des paiements non configurée.' }, 503);
  const body = new Uint8Array(await req.arrayBuffer());
  if (body.byteLength > 65536) return R({ error: 'Contenu trop volumineux.' }, 413);
  const sig = String(req.headers.get('X-DigitalPaye-Signature') || '').trim().toLowerCase();
  if (!sig || !(await safeEqual(sig, 'sha256=' + await hmacHex(env.DP_WEBHOOK_SECRET, body)))) return R({ error: 'Signature invalide.' }, 401);
  let ev;
  try { ev = JSON.parse(new TextDecoder().decode(body)); } catch (e) { return R({ error: 'Contenu invalide.' }, 400); }
  const type = String(ev.event || req.headers.get('X-DigitalPaye-Event') || '');
  if (!PAY_OK.includes(type)) return R({ ok: true, ignore: type }, 200); // échoué, annulé, initié… : rien à faire
  const d = ev.data || {}, tx = ev.transaction || d.transaction || d;
  const ref = String(tx.reference || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40);
  if (!ref) return R({ ok: true, ignore: 'sans référence' }, 200);
  if (await env.DB.prepare('SELECT 1 FROM paiements WHERE ref = ?').bind(ref).first()) return R({ ok: true, deja: true }, 200);

  // Quand l'API répond, c'est elle qui fait foi (statut, montant, client, lien payé) ; sinon, le contenu signé du webhook.
  let t = null;
  if (env.DP_API_KEY && env.DP_API_SECRET) {
    try {
      t = await dpApi(env, '/v1/collect/' + encodeURIComponent(ref));
      if (!t) return R({ ok: true, ignore: 'transaction inconnue de DigitalPaye' }, 200);
    } catch (e) { console.log('API DigitalPaye indisponible, webhook signé utilisé :', e.message); t = null; }
  }
  if (!t) t = tx;
  const status = String((t.status && t.status.value) || t.status || '').toLowerCase();
  if (status === 'pending' || status === 'initiated') return R({ error: 'Paiement pas encore confirmé.' }, 503); // DigitalPaye renverra le webhook
  if (status !== 'successful') return R({ ok: true, ignore: status }, 200);
  let meta = t.metadata || t.meta || {};
  if (typeof meta === 'string') { try { meta = JSON.parse(meta); } catch (e) { meta = {}; } }
  let txMeta = tx.metadata || {};
  if (typeof txMeta === 'string') { try { txMeta = JSON.parse(txMeta); } catch (e) { txMeta = {}; } }
  const sandbox = t.environment === 'sandbox' || meta.sandbox === true || meta.sandbox === 'true';
  if (sandbox && env.DP_SANDBOX !== 'oui') return R({ ok: true, ignore: 'paiement de test (Sandbox)' }, 200);
  const devise = String((t.amounts && t.amounts.currency) || t.currency || 'XOF').toUpperCase();
  const montant = Math.round(Number((t.amounts && t.amounts.charged) || t.amount) || 0);
  const c = t.customer || {}, payer = t.payer || {};
  const prenom = capitalize(cleanText(c.first_name || payer.first_name, 40));
  const nom = capitalize(cleanText(c.last_name || payer.last_name, 40));
  const phone = normPhone(t.payer_phone || c.phone || payer.phone) || '';
  const lien = cleanText(meta.payment_link_token || t.payment_link_token || (t.payment_link && (t.payment_link.token || t.payment_link.id)) ||
    txMeta.payment_link_token || tx.payment_link_token || d.payment_link_token || (d.payment_link && d.payment_link.token), 40);
  const quand = Date.parse(t.processed_at || t.created_at || ev.sent_at || '') || Date.now();

  // Formation payée : par le lien s'il est connu, sinon par le montant quand une seule formation a ce prix.
  // Lien inconnu, plusieurs formations au même prix, montant trop faible : « À vérifier » (aucun code sans votre choix).
  let product = liensConnus(env)[lien] || '', statut = 'a_envoyer', raison = '';
  const memePrix = Object.keys(PRIX).filter(p => PRIX[p] === montant);
  const fcfa = n => n.toLocaleString('fr-FR') + ' FCFA';
  if (devise !== 'XOF') { statut = 'a_verifier'; raison = 'Devise inattendue : ' + devise; }
  else if (!product && lien) {
    statut = 'a_verifier'; raison = 'Lien de paiement inconnu (' + lien + ')';
    product = memePrix.length === 1 ? memePrix[0] : ''; // simple suggestion, à confirmer
  } else if (!product) {
    if (memePrix.length === 1) product = memePrix[0];
    else { statut = 'a_verifier'; raison = memePrix.length ? memePrix.length + ' formations coûtent ' + fcfa(montant) + ' : choisissez la bonne' : 'Aucune formation ne coûte ' + fcfa(montant); }
  } else if (montant < PRIX[product]) { statut = 'a_verifier'; raison = 'Montant reçu ' + fcfa(montant) + ' au lieu de ' + fcfa(PRIX[product]); }

  const r = await env.DB.prepare('INSERT OR IGNORE INTO paiements (ref, t, recu, prenom, nom, phone, montant, lien, product, statut, raison) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(ref, quand, Date.now(), prenom, nom, phone, montant, lien, product, statut, raison).run();
  if (r.meta && r.meta.changes) await journal(env, 'DigitalPaye', statut === 'a_verifier' ? 'Paiement reçu (à vérifier)' : 'Paiement reçu', '', '', ref + ' · ' + montant + ' FCFA' + (product ? ' · ' + product : '') + (raison ? ' · ' + raison : ''));
  return R({ ok: true }, 200);
}

const ADMIN_PAGE_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://geoexpertacademy.ci; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const role = env.ROLE || 'tout';
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(req, env) });
    try {
      if (!env.ACCESS) return reply({ error: 'Configuration incomplète : KV ACCESS manquant.' }, 500, req, env);
      await loadCatalog(env);
      const origin = req.headers.get('Origin');
      const sameOrigin = role === 'admin' && origin === url.origin;
      if (origin && !sameOrigin && !allowedOrigins(env).includes(origin)) return reply({ error: 'Origine non autorisée.' }, 403, req, env);
      if (role !== 'admin' && url.pathname === '/api/certificat' && req.method === 'GET') return await publicCert(req, env, url);
      // Webhooks DigitalPaye : sur le Worker apprenant (public). Le Worker admin, derrière Access, ne les reçoit qu'en local (tests).
      if (url.pathname === '/webhook/digitalpaye' && (role !== 'admin' || env.ACCESS_OPTIONAL === 'oui')) return await webhookDigitalPaye(req, env);
      // Gros fichiers : lien signé donné par /api/file (ouvert directement par le navigateur, sans code d'accès dans l'adresse).
      if (role !== 'admin' && url.pathname.startsWith('/dl/') && (req.method === 'GET' || req.method === 'HEAD')) return await download(req, env, url);
      // Ressources (Mes ressources) : lien signé donné par /api/ressource ; le nom de l'apprenant est ajouté au document.
      if (role !== 'admin' && url.pathname.startsWith('/r/') && req.method === 'GET') return await ressDownload(req, env, url);
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

// Ressources et charte renvoyées à la connexion (liste seulement : les fichiers passent par /api/ressource).
async function loginRessources(env, rec, c, now) {
  if (!env.DB) return {};
  const list = (await loadRessources(env)).map(r => {
    const from = ressUnlock(rec, r, now);
    return from === null ? null : { id: r.id, title: r.title, descr: r.descr, kind: r.kind, ready: !!(r.r2 && env.FICHIERS && env.DL_SECRET), locked: from > now, unlockAt: from };
  }).filter(Boolean);
  return { ressources: list, charte: { version: CHARTE.version, accepted: await charteAcceptee(env, c), texte: CHARTE } };
}

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
        videos: vis(m).map(v => {
          const t = trialLock(rec, v.k, now);
          return t ? { k: v.k, title: v.title, dur: v.dur, locked: true, unlockAt: t } : { k: v.k, title: v.title, dur: v.dur, ready: !!cfg.ids[v.k],
            files: (v.files || []).map(f => f.r2 ? { k: f.k, title: f.title + ' (' + fmtSize(f.size || 0) + ')', ready: !!env.FICHIERS } : { k: f.k, title: f.title, ready: !!cfg.files[f.k] }) };
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
      quiz: await loadQuizKeys(env, rec),
      ...(await loginRessources(env, rec, c, now)),
      ...(await (async () => { const x = await loadCertsAndReviews(env, c); return { certificats: x.certs, avisDonnes: x.reviewed }; })()),
    }, 200, req, env);
  }

  // Acceptation de la charte de l'apprenant (version en cours) : code, date et heure, version.
  if (url.pathname === '/api/charte-accept') {
    if (!env.DB) return reply({ error: 'Enregistrement indisponible pour le moment.' }, 503, req, env);
    if (String(body.version || '') !== CHARTE.version) return reply({ error: 'La charte a changé : rechargez la page pour lire la nouvelle version.' }, 409, req, env);
    await env.DB.prepare('INSERT OR IGNORE INTO chartes (code, version, t) VALUES (?, ?, ?)').bind(c, CHARTE.version, now).run();
    return reply({ ok: true, version: CHARTE.version, accepted: await charteAcceptee(env, c) }, 200, req, env);
  }

  // Ressources : vérifie le droit (formation, date de déblocage, charte) puis donne un lien de 30 minutes.
  if (url.pathname === '/api/ressource') {
    if (!env.DL_SECRET) return reply({ error: 'Cette ressource sera disponible prochainement.' }, 404, req, env);
    const chk = await ressCheck(env, rec, c, String(body.id || ''), now);
    if (chk.error) return reply({ error: chk.error }, chk.status, req, env);
    return reply({ url: await ressLink(env, url.origin, chk.r.id, c, now), kind: chk.r.kind }, 200, req, env);
  }

  // Leçons, exercices, fichiers et quiz : seulement après l'acceptation de la charte.
  if (['/api/play', '/api/file', '/api/quiz', '/api/quiz-answer'].includes(url.pathname) && !(await charteAcceptee(env, c)))
    return reply({ error: 'Acceptez d\'abord la charte de l\'apprenant : rechargez la page.', charte: true }, 403, req, env);

  // Mini-quiz : questions sans les bonnes réponses ; la correction se fait ici, sur le serveur.
  if (url.pathname === '/api/quiz' || url.pathname === '/api/quiz-answer') {
    if (!env.DB) return reply({ error: 'Quiz indisponible pour le moment.' }, 503, req, env);
    const k = String(body.k || '');
    const e = entitled(rec, k, now);
    if (!ownsLesson(rec, k) || !e.ok) return reply({ error: 'Ce quiz n\'est pas disponible pour vous.' }, 403, req, env);
    const row = await env.DB.prepare('SELECT data FROM quizzes WHERE k = ?').bind(k).first();
    if (!row) return reply({ error: 'Pas de quiz pour cette leçon.' }, 404, req, env);
    const qs = JSON.parse(row.data);
    if (url.pathname === '/api/quiz') {
      const last = await env.DB.prepare('SELECT score, total, t FROM quiz_results WHERE code = ? AND k = ?').bind(c, k).first();
      return reply({ questions: qs.map(x => ({ q: x.q, choices: x.choices })), last: last || null }, 200, req, env);
    }
    const ans = Array.isArray(body.answers) ? body.answers : [];
    if (ans.length !== qs.length) return reply({ error: 'Répondez à toutes les questions.' }, 400, req, env);
    const ok = qs.map((x, i) => parseInt(ans[i], 10) === x.answer);
    const score = ok.filter(Boolean).length;
    await env.DB.batch([
      env.DB.prepare('INSERT INTO quiz_results (code, k, score, total, t) VALUES (?, ?, ?, ?, ?) ON CONFLICT (code, k) DO UPDATE SET score = excluded.score, total = excluded.total, t = excluded.t').bind(c, k, score, qs.length, now),
      env.DB.prepare('INSERT INTO learners (code, last, last_activity) VALUES (?, NULL, ?) ON CONFLICT (code) DO UPDATE SET last_activity = excluded.last_activity').bind(c, now),
    ]);
    return reply({ score, total: qs.length, ok, answers: qs.map(x => x.answer), explain: qs.map(x => x.explain || '') }, 200, req, env);
  }

  // Avis de fin de formation (un par formation ; une nouvelle réponse remplace l'ancienne).
  if (url.pathname === '/api/avis') {
    if (!env.DB) return reply({ error: 'Avis indisponible pour le moment.' }, 503, req, env);
    const module = String(body.module || '');
    if (!rec.modules.some(g => g.m === module) || !findModule(module)) return reply({ error: 'Formation inconnue.' }, 400, req, env);
    const stars = parseInt(body.stars, 10);
    if (!(stars >= 1 && stars <= 5)) return reply({ error: 'Choisissez une note de 1 à 5 étoiles.' }, 400, req, env);
    const text = String(body.text || '').trim().slice(0, 1000), consent = body.consent ? 1 : 0;
    await env.DB.batch([
      env.DB.prepare('DELETE FROM reviews WHERE code = ? AND module = ?').bind(c, module),
      env.DB.prepare("INSERT INTO reviews (code, module, name, stars, text, consent, t, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'nouveau')").bind(c, module, rec.label, stars, text, consent, now),
    ]);
    return reply({ ok: true }, 200, req, env);
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
    if (!ownsLesson(rec, k)) return reply({ error: 'Cette vidéo ne fait pas partie de votre formation.' }, 403, req, env);
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
    if (/-f\d+$/.test(k) && !ownsLesson(rec, lessonOfFile(k))) return reply({ error: 'Fichier non disponible pour votre formation.' }, 403, req, env);
    // Gros fichier (R2) : mêmes vérifications que ci-dessus, puis un lien signé de courte durée (la page l'ouvre directement).
    const big = /-f\d+$/.test(k) ? lessonFile(k) : null;
    if (big && big.r2) {
      if (!env.FICHIERS || !env.DL_SECRET) return reply({ error: 'Ce fichier sera disponible prochainement.' }, 404, req, env);
      const exp = String(Math.floor(now / 1000) + DL_MINUTES * 60);
      return reply({ url: url.origin + '/dl/' + k + '/' + exp + '/' + (await dlSig(env, k, big.r2, exp)), size: big.size || 0 }, 200, req, env);
    }

    // On cherche le nom du fichier pour le navigateur
    const m = findModule(moduleOf(k));
    const cfgF = await getCfg(env), ext = ((cfgF.names[k] || '').match(/\.[a-z0-9]{1,5}$/i) || ['.pdf'])[0].toLowerCase();
    let filename = k + ext;
    if (m) {
      const ex = m.exercises.find(x => x.k === k) || (m.videos.find(v => v.k === lessonOfFile(k)) || { files: [] }).files.find(x => x.k === k);
      if (ex) filename = ex.title.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') + ext;
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

// Enregistre la liste des leçons d'une formation dans D1 (null = revenir à la liste du code).
async function saveLessons(env, key, videos, who, maxNum) {
  await loadCatalog(env, true);
  const data = catRaw ? JSON.parse(JSON.stringify(catRaw)) : { modules: {}, maxNum: {} };
  data.modules = data.modules || {}; data.maxNum = data.maxNum || {};
  if (videos) data.modules[key] = videos; else delete data.modules[key];
  if (maxNum) data.maxNum[key] = Math.max(maxNum, data.maxNum[key] || 0);
  await env.DB.prepare('INSERT INTO content (id, data, updated, who) VALUES (1, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET data = excluded.data, updated = excluded.updated, who = excluded.who')
    .bind(JSON.stringify(data), Date.now(), who || '').run();
  await loadCatalog(env, true);
}

// Tous les codes : liste KV complète (sans limite de 500) + index D1. La liste KV peut mettre jusqu'à 60 s
// à montrer un nouveau code ; l'index D1, rempli à la création, le montre tout de suite.
// De même, elle peut montrer encore ~60 s un code supprimé : les codes supprimés (table codes_supprimes)
// sont donc écartés, pour ne jamais les remettre dans l'index.
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
      (await env.DB.prepare('SELECT code FROM codes_supprimes').all()).results.forEach(r => set.delete(r.code));
    } catch (e) { /* table pas encore créée : comme avant */ }
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
      env.DB.prepare('SELECT code, k, done_at FROM progress'),
      env.DB.prepare('SELECT code, last, last_activity FROM learners'),
      env.DB.prepare("SELECT substr(k, 1, instr(k, '-') - 1) AS m, COUNT(*) AS n FROM progress WHERE done_at > ? GROUP BY m").bind(since),
      env.DB.prepare('SELECT code, phone FROM contacts'),
      env.DB.prepare('SELECT code, kind, MAX(t) AS t FROM relances GROUP BY code, kind'),
      env.DB.prepare('SELECT code, COUNT(*) AS n FROM exercises GROUP BY code'),
    ]);
    const at = c => out.byCode[c] = out.byCode[c] || {};
    const visible = new Set(); CAT.forEach(m => vis(m).forEach(v => visible.add(v.k)));
    for (const x of p.results) {
      const o = Object.assign(at(x.code), { seen: true }); o.n = (o.n || 0) + (visible.has(x.k) ? 1 : 0);
      if (x.done_at > 1 && x.done_at > (o.lastDone || 0)) o.lastDone = x.done_at;
    }
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
  const modules = CAT.map(m => ({
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
// Nouveau code libre (12 caractères).
async function freeCode(env) {
  let code, tries = 0;
  do { code = randomCode(12); tries++; } while ((await env.ACCESS.get('s:' + code)) && tries < 5);
  return code;
}
// Nouveaux codes : tous les modules du produit dès le départ, limités par l'essai de 7 jours.
// La date de fin (12 ou 24 mois) est fixée à la première utilisation du code.
async function createAccess(env, code, label, product, phone, immediate, now) {
  const prod = PRODUCTS[product];
  const modules = prod.now.concat(prod.later).map(m => ({ m, from: now }));
  const rec = {
    label, product, modules, created: now, expires: null, active: true, logins: 0, seen: [],
    essai: true, mois: product.startsWith('pack-') ? MONTHS_PACK : MONTHS_SINGLE, premiereUtilisation: null, accesComplet: immediate,
  };
  await env.ACCESS.put('s:' + code, JSON.stringify(rec));
  if (env.DB) await env.DB.prepare('INSERT OR IGNORE INTO codes (code, created) VALUES (?, ?)').bind(code, now).run();
  if (env.DB && phone) await env.DB.prepare('INSERT OR REPLACE INTO contacts (code, phone, updated) VALUES (?, ?, ?)').bind(code, phone, now).run();
  return rec;
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
        done: p.n || 0, lessons: rec.modules.reduce((s, g) => { const m = findModule(g.m); return s + (m ? vis(m).length : 0); }, 0),
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
      catalog: CAT.map(m => ({ key: m.key, title: m.title, videos: m.videos.map(v => ({ k: v.k, title: v.title, dur: v.dur, hidden: !!v.hidden, id: cfg.ids[v.k] || '', files: (v.files || []).map(f => f.r2 ? { k: f.k, title: f.title, has: true, r2: f.r2, size: f.size || 0 } : { k: f.k, title: f.title, has: !!cfg.files[f.k] }) })), exercises: m.exercises.map(e => ({ k: e.k, title: e.title, has: !!cfg.files[e.k] })) })),
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
    let act = 0, notes = [], phone = '', relances = [], chartes = [];
    const quiz = {};
    if (env.DB) {
      const [l, n, ct, rl, qr, ch] = await env.DB.batch([
        env.DB.prepare('SELECT last_activity FROM learners WHERE code = ?').bind(c),
        env.DB.prepare('SELECT id, t, who, text FROM admin_notes WHERE code = ? ORDER BY t DESC').bind(c),
        env.DB.prepare('SELECT phone FROM contacts WHERE code = ?').bind(c),
        env.DB.prepare('SELECT kind, t, who FROM relances WHERE code = ? ORDER BY t DESC').bind(c),
        env.DB.prepare('SELECT k, score, total, t FROM quiz_results WHERE code = ?').bind(c),
        env.DB.prepare('SELECT version, t FROM chartes WHERE code = ? ORDER BY t DESC').bind(c),
      ]);
      chartes = ch.results;
      act = (l.results[0] && l.results[0].last_activity) || 0;
      notes = n.results;
      phone = (ct.results[0] && ct.results[0].phone) || '';
      relances = rl.results;
      qr.results.forEach(x => { quiz[x.k] = { score: x.score, total: x.total, t: x.t }; });
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
        return { key: m.key, title: m.title, from: g.from, lessons: vis(m).map(v => ({ k: v.k, title: v.title, done: progress.done[v.k] || 0, quiz: quiz[v.k] || null })),
          exercises: m.exercises.map(e => ({ k: e.k, title: e.title, done: (progress.ex && progress.ex[e.k]) || 0 })) };
      }).filter(Boolean),
      synced: !!(act || Object.keys(progress.done).length),
      remplace: rec.remplace ? prettyCode(rec.remplace) : '', remplacePar: rec.remplacePar ? prettyCode(rec.remplacePar) : '',
      adminNotes: notes, phone, relances, certificats: (await loadCertsAndReviews(env, c)).certs,
      chartes, charteVersion: CHARTE.version,
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

  // Mini-quiz : liste (avec statistiques), enregistrement, suppression.
  if (url.pathname === '/admin/quizzes' && req.method === 'GET') {
    if (!env.DB) return reply({ quizzes: [] }, 200, req, env);
    const [q, r, all] = await env.DB.batch([
      env.DB.prepare('SELECT k, data, updated, who FROM quizzes'),
      env.DB.prepare('SELECT k, COUNT(*) AS n, AVG(score * 100.0 / total) AS avg FROM quiz_results GROUP BY k'),
      env.DB.prepare('SELECT code, k, score, total, t FROM quiz_results ORDER BY t DESC LIMIT 500'),
    ]);
    const st = {}; r.results.forEach(x => { st[x.k] = { n: x.n, avg: Math.round(x.avg) }; });
    // Résultats un par un (tableau « Résultats des quiz ») : le nom de l'apprenant est retrouvé par la page avec son code.
    const results = all.results.map(x => ({ code: prettyCode(x.code), k: x.k, score: x.score, total: x.total, t: x.t }));
    return reply({ quizzes: q.results.map(x => ({ k: x.k, questions: JSON.parse(x.data), updated: x.updated, who: x.who, stats: st[x.k] || { n: 0, avg: null } })), results }, 200, req, env);
  }
  if (url.pathname === '/admin/quiz' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const k = String(b.k || ''), m = findModule(moduleOf(k)), v = m && m.videos.find(x => x.k === k);
    if (!v) return reply({ error: 'Leçon inconnue.' }, 400, req, env);
    const cq = cleanQuiz(b.questions);
    if (cq.error) return reply({ error: cq.error }, 400, req, env);
    await env.DB.prepare('INSERT INTO quizzes (k, data, updated, who) VALUES (?, ?, ?, ?) ON CONFLICT (k) DO UPDATE SET data = excluded.data, updated = excluded.updated, who = excluded.who').bind(k, JSON.stringify(cq.questions), now, who).run();
    await journal(env, who, 'Quiz enregistré', '', '', m.title.split(' : ')[0] + ' / ' + v.title.slice(0, 50) + ' (' + cq.questions.length + ' question(s))');
    return reply({ ok: true }, 200, req, env);
  }
  if (url.pathname === '/admin/quiz-delete' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const k = String(b.k || '');
    const row = await env.DB.prepare('SELECT k FROM quizzes WHERE k = ?').bind(k).first();
    if (!row) return reply({ error: 'Quiz introuvable.' }, 404, req, env);
    await env.DB.batch([env.DB.prepare('DELETE FROM quizzes WHERE k = ?').bind(k), env.DB.prepare('DELETE FROM quiz_results WHERE k = ?').bind(k)]);
    const m = findModule(moduleOf(k)), v = m && m.videos.find(x => x.k === k);
    await journal(env, who, 'Quiz supprimé', '', '', v ? m.title.split(' : ')[0] + ' / ' + v.title.slice(0, 50) : k);
    return reply({ ok: true }, 200, req, env);
  }

  // Attestations et avis : liste, création d'une attestation, révocation, statut d'un avis.
  if (url.pathname === '/admin/attestations' && req.method === 'GET') {
    if (!env.DB) return reply({ certificats: [], avis: [] }, 200, req, env);
    const [a, r] = await env.DB.batch([
      env.DB.prepare('SELECT id, code, module, name, title, hours, t, who, revoked FROM certificates ORDER BY t DESC LIMIT 500'),
      env.DB.prepare('SELECT id, code, module, name, stars, text, consent, t, status FROM reviews ORDER BY t DESC LIMIT 500'),
    ]);
    const pc = x => ({ ...x, code: prettyCode(x.code) });
    return reply({ certificats: a.results.map(pc), avis: r.results.map(pc) }, 200, req, env);
  }
  if (url.pathname === '/admin/certificat' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const c = normCode(b.code);
    const raw = c && await env.ACCESS.get('s:' + c);
    if (!raw) return reply({ error: 'Code introuvable.' }, 404, req, env);
    const rec = JSON.parse(raw), m = findModule(String(b.module || ''));
    if (!m || !rec.modules.some(g => g.m === m.key)) return reply({ error: 'Cette formation ne fait pas partie de son accès.' }, 400, req, env);
    const name = String(b.name || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    if (name.length < 3) return reply({ error: 'Écrivez le nom complet qui figurera sur l\'attestation.' }, 400, req, env);
    const existing = await env.DB.prepare('SELECT id FROM certificates WHERE code = ? AND module = ? AND revoked = 0').bind(c, m.key).first();
    if (existing) return reply({ error: 'Une attestation existe déjà pour cette formation (' + existing.id + '). Révoquez-la d\'abord pour en créer une nouvelle.' }, 400, req, env);
    let id, tries = 0;
    do { id = certId(); tries++; } while ((await env.DB.prepare('SELECT id FROM certificates WHERE id = ?').bind(id).first()) && tries < 5);
    await env.DB.prepare('INSERT INTO certificates (id, code, module, name, title, hours, t, who) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, c, m.key, name, m.title, moduleHours(m), now, who).run();
    await journal(env, who, 'Attestation délivrée', prettyCode(c), rec.label, id + ' · ' + m.title.split(' : ')[0] + ' · ' + name);
    return reply({ ok: true, id }, 200, req, env);
  }
  if (url.pathname === '/admin/certificat-revoke' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const row = await env.DB.prepare('SELECT id, code, name FROM certificates WHERE id = ?').bind(String(b.id || '')).first();
    if (!row) return reply({ error: 'Attestation introuvable.' }, 404, req, env);
    await env.DB.prepare('UPDATE certificates SET revoked = 1 WHERE id = ?').bind(row.id).run();
    await journal(env, who, 'Attestation révoquée', prettyCode(row.code), row.name, row.id);
    return reply({ ok: true }, 200, req, env);
  }
  if (url.pathname === '/admin/avis-statut' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const row = await env.DB.prepare('SELECT id, consent, name FROM reviews WHERE id = ?').bind(parseInt(b.id, 10) || 0).first();
    if (!row) return reply({ error: 'Avis introuvable.' }, 404, req, env);
    if (!['nouveau', 'publiable', 'masque'].includes(b.status)) return reply({ error: 'Statut inconnu.' }, 400, req, env);
    if (b.status === 'publiable' && !row.consent) return reply({ error: 'L\'apprenant n\'a pas accepté que cet avis soit publié.' }, 400, req, env);
    await env.DB.prepare('UPDATE reviews SET status = ? WHERE id = ?').bind(b.status, row.id).run();
    await journal(env, who, b.status === 'publiable' ? 'Avis marqué publiable' : b.status === 'masque' ? 'Avis masqué' : 'Avis remis en « nouveau »', '', row.name, '');
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
        for (const t of ['progress', 'notes', 'learners', 'contacts', 'relances', 'admin_notes', 'exercises', 'prefs', 'quiz_results', 'reviews', 'codes', 'paiements', 'chartes']) st.push(env.DB.prepare('DELETE FROM ' + t + ' WHERE code = ?').bind(x));
        st.push(env.DB.prepare("UPDATE journal SET label = '(données supprimées)' WHERE code = ?").bind(prettyCode(x)));
        st.push(env.DB.prepare('INSERT OR IGNORE INTO codes_supprimes (code, t) VALUES (?, ?)').bind(x, now));
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
        env.DB.prepare('UPDATE quiz_results SET code = ? WHERE code = ?').bind(code, old),
        env.DB.prepare('UPDATE certificates SET code = ? WHERE code = ?').bind(code, old),
        env.DB.prepare('UPDATE reviews SET code = ? WHERE code = ?').bind(code, old),
        env.DB.prepare('UPDATE paiements SET code = ? WHERE code = ?').bind(code, old),
        env.DB.prepare('UPDATE chartes SET code = ? WHERE code = ?').bind(code, old),
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
    const code = await freeCode(env);
    const rec = await createAccess(env, code, label, b.product, phone, !!b.immediate, now);
    await journal(env, who, 'Code créé', prettyCode(code), label, b.product + (b.immediate ? ', sans période d\'essai' : ', avec période d\'essai'));
    return reply({ code: prettyCode(code), label, expires: rec.expires }, 200, req, env);
  }

  // Paiements reçus de DigitalPaye (les plus récents d'abord) + compteurs.
  if (url.pathname === '/admin/paiements' && req.method === 'GET') {
    if (!env.DB) return reply({ paiements: [], aEnvoyer: 0, aVerifier: 0 }, 200, req, env);
    const [l, n] = await env.DB.batch([
      env.DB.prepare('SELECT ref, t, prenom, nom, phone, montant, lien, product, statut, raison, code, envoye_t, who FROM paiements ORDER BY t DESC LIMIT 300'),
      env.DB.prepare('SELECT statut, COUNT(*) AS n FROM paiements GROUP BY statut'),
    ]);
    const paiements = await Promise.all(l.results.map(async p => {
      const o = Object.assign({}, p, { code: p.code ? prettyCode(p.code) : '' });
      if (p.code) {
        const raw = await env.ACCESS.get('s:' + p.code), rec = raw ? JSON.parse(raw) : null;
        o.debloque = rec ? (rec.accesComplet ? 0 : rec.premiereUtilisation ? trialEnd(rec) : unlockFrom(now)) : 0;
        o.codeActif = !!(rec && rec.active);
      }
      return o;
    }));
    const cnt = s => (n.results.find(x => x.statut === s) || { n: 0 }).n;
    return reply({ paiements, aEnvoyer: cnt('a_envoyer'), aVerifier: cnt('a_verifier'), prix: PRIX }, 200, req, env);
  }

  // « Créer le code et envoyer sur WhatsApp » : un seul code par paiement, même en cas de double clic.
  if (url.pathname === '/admin/paiement-code' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const p = await env.DB.prepare('SELECT * FROM paiements WHERE ref = ?').bind(String(b.ref || '')).first();
    if (!p) return reply({ error: 'Paiement introuvable.' }, 404, req, env);
    // Nom et numéro non transmis par DigitalPaye : ceux saisis par l'administrateur.
    if (!p.code && !(p.prenom || p.nom)) {
      const parts = capitalize(cleanText(b.nom, 60)).split(' ').filter(Boolean);
      if (!parts.length) return reply({ error: 'Indiquez le prénom et le nom du client (visibles en filigrane sur ses vidéos).' }, 400, req, env);
      p.prenom = parts[0].slice(0, 40); p.nom = parts.slice(1).join(' ').slice(0, 40);
    }
    if (!p.code && !p.phone && b.phone) {
      const ph = normPhone(b.phone);
      if (ph === null) return reply({ error: 'Numéro WhatsApp invalide. Exemple : 07 87 01 50 30 ou +225 07 87 01 50 30.' }, 400, req, env);
      p.phone = ph;
    }
    const label = (p.prenom + ' ' + p.nom).trim().slice(0, 40) || 'Client ' + p.ref;
    const out = (code, product, deja) => reply({ code: prettyCode(code), label, prenom: p.prenom || '', phone: p.phone, product, debloque: unlockFrom(now), deja: !!deja }, 200, req, env);
    if (p.code) return out(p.code, p.product, true);
    if (p.statut === 'ignore') return reply({ error: 'Ce paiement a été marqué « ignoré ».' }, 400, req, env);
    const product = p.statut === 'a_verifier' ? String(b.product || '') : p.product;
    if (!PRODUCTS[product]) return reply({ error: 'Choisissez d\'abord la formation payée.' }, 400, req, env);
    const code = await freeCode(env);
    const claim = await env.DB.prepare("UPDATE paiements SET code = ?, product = ?, statut = 'envoye', envoye_t = ?, who = ?, prenom = ?, nom = ?, phone = ? WHERE ref = ? AND code IS NULL")
      .bind(code, product, now, who, p.prenom || '', p.nom || '', p.phone || '', p.ref).run();
    if (!claim.meta || claim.meta.changes !== 1) { // un autre clic a été plus rapide : on renvoie son code
      const again = await env.DB.prepare('SELECT code, product FROM paiements WHERE ref = ?').bind(p.ref).first();
      return out(again.code, again.product, true);
    }
    await createAccess(env, code, label, product, p.phone || '', false, now);
    await journal(env, who, 'Code créé depuis un paiement', prettyCode(code), label, product + ', avec période d\'essai · paiement ' + p.ref);
    return out(code, product, false);
  }

  // Ignorer un paiement sans code (par exemple votre propre paiement de test), ou le remettre « À vérifier ».
  if (url.pathname === '/admin/paiement-statut' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    if (!['ignore', 'a_verifier'].includes(b.statut)) return reply({ error: 'Statut inconnu.' }, 400, req, env);
    const r = await env.DB.prepare('UPDATE paiements SET statut = ?, who = ? WHERE ref = ? AND code IS NULL').bind(b.statut, who, String(b.ref || '')).run();
    if (!r.meta || r.meta.changes !== 1) return reply({ error: 'Paiement introuvable ou code déjà créé.' }, 400, req, env);
    await journal(env, who, b.statut === 'ignore' ? 'Paiement ignoré' : 'Paiement remis à vérifier', '', '', String(b.ref));
    return reply({ ok: true }, 200, req, env);
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

  // Contenu : enregistrer la liste des leçons d'une formation (ordre, titres, durées, masquées, ajoutées, supprimées).
  if (url.pathname === '/admin/content' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const m = findModule(String(b.module || ''));
    if (!m) return reply({ error: 'Formation inconnue.' }, 400, req, env);
    const list = Array.isArray(b.videos) ? b.videos : [];
    if (!list.length || list.length > 200) return reply({ error: 'La formation doit garder au moins une leçon.' }, 400, req, env);
    const old = new Map(m.videos.map(v => [v.k, v]));
    // Numéro le plus haut déjà utilisé (code, version actuelle, historique) : une nouvelle leçon ne reprend jamais une ancienne clé.
    const nums = [...CATALOG.find(x => x.key === m.key).videos, ...m.videos].map(v => +v.k.split('-v')[1] || 0);
    let next = Math.max(...nums, (catRaw && catRaw.maxNum && catRaw.maxNum[m.key]) || 0);
    const seen = new Set(), out = [];
    for (let i = 0; i < list.length; i++) {
      const x = list[i] || {}, n = i + 1;
      const title = String(x.title || '').trim().replace(/\s+/g, ' ').slice(0, 200);
      const dur = String(x.dur || '').trim();
      if (!title) return reply({ error: 'Leçon n° ' + n + ' : écrivez un titre.' }, 400, req, env);
      if (!/^\d{1,2}(:\d{2}){1,2}$/.test(dur)) return reply({ error: 'Leçon n° ' + n + ' (« ' + title.slice(0, 40) + ' ») : durée au format 12:34 ou 1:02:03.' }, 400, req, env);
      let k = String(x.k || '');
      if (k) { if (!old.has(k) || seen.has(k)) return reply({ error: 'Leçon n° ' + n + ' : leçon inconnue.' }, 400, req, env); }
      else { next++; k = m.key + '-v' + String(next).padStart(2, '0'); }
      seen.add(k);
      const v = { k, title, dur };
      if (x.hidden) v.hidden = true;
      const files = old.has(k) ? (old.get(k).files || []) : [];   // les fichiers se gèrent à part (envoi / suppression)
      if (files.length) v.files = files;
      out.push(v);
    }
    if (!out.some(v => !v.hidden)) return reply({ error: 'Au moins une leçon doit rester visible.' }, 400, req, env);
    const removed = m.videos.filter(v => !seen.has(v.k));
    await saveLessons(env, m.key, out, who, next);
    const added = out.filter(v => !old.has(v.k)).length, hid = out.filter(v => v.hidden).length;
    await journal(env, who, 'Contenu modifié', '', '', m.title.split(' : ')[0] + ' : ' + out.length + ' leçon(s)' + (added ? ', ' + added + ' ajoutée(s)' : '') + (removed.length ? ', ' + removed.length + ' supprimée(s)' : '') + (hid ? ', ' + hid + ' masquée(s)' : ''));
    return reply({ ok: true, added: out.filter(v => !old.has(v.k)).map(v => v.k) }, 200, req, env);
  }
  // Contenu : revenir au contenu d'origine d'une formation (celui du code).
  if (url.pathname === '/admin/content-reset' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const m = CATALOG.find(x => x.key === String(b.module || ''));
    if (!m) return reply({ error: 'Formation inconnue.' }, 400, req, env);
    await saveLessons(env, m.key, null, who);
    await journal(env, who, 'Contenu remis à l\'origine', '', '', m.title.split(' : ')[0]);
    return reply({ ok: true }, 200, req, env);
  }
  // Contenu : retirer un fichier d'une leçon.
  if (url.pathname === '/admin/lesson-file-delete' && req.method === 'POST') {
    const b = await readJson(req);
    const k = String(b.k || ''), m = findModule(moduleOf(k)), v = m && m.videos.find(x => x.k === lessonOfFile(k));
    if (!v || !(v.files || []).some(f => f.k === k)) return reply({ error: 'Fichier introuvable.' }, 404, req, env);
    await saveLessons(env, m.key, m.videos.map(x => x.k === v.k ? Object.assign({}, x, { files: x.files.filter(f => f.k !== k) }) : x), who);
    await env.ACCESS.delete('f:' + k);
    const cfg = await getCfg(env); delete cfg.files[k]; delete cfg.names[k]; await env.ACCESS.put('cfg', JSON.stringify(cfg));
    const r2 = (v.files.find(f => f.k === k) || {}).r2;   // gros fichier : seulement détaché, il reste dans R2
    await journal(env, who, 'Fichier de leçon retiré', '', '', k + (r2 ? ' · ' + r2 + ' (reste dans R2)' : ''));
    return reply({ ok: true }, 200, req, env);
  }

  // Gros fichiers (R2) : liste du stockage + espace utilisé. Le dépôt se fait par le tableau de bord Cloudflare ou wrangler.
  // ---- Mes ressources : liste, réglages, fichier, retrait ; acceptations de la charte.
  if (url.pathname === '/admin/ressources' && req.method === 'GET') {
    const items = await loadRessources(env, true);
    let chartes = [];
    if (env.DB) chartes = (await env.DB.prepare('SELECT code, version, t FROM chartes ORDER BY t DESC').all()).results.map(x => Object.assign(x, { code: prettyCode(x.code) }));
    return reply({
      items: items.map(r => { let n = 0; try { n = JSON.parse(r.stamp || '[]').length; } catch (e) { n = 0; } const o = Object.assign({}, r, { zones: n }); delete o.stamp; return o; }),
      r2: !!env.FICHIERS, modules: CATALOG.map(m => ({ key: m.key, title: m.title })),
      charte: { version: CHARTE.version, date: CHARTE.date, acceptations: chartes },
    }, 200, req, env);
  }
  if (url.pathname === '/admin/ressource' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req);
    const title = String(b.title || '').trim().replace(/\s+/g, ' ').slice(0, 120);
    const descr = String(b.descr || '').trim().replace(/\s+/g, ' ').slice(0, 300);
    const regle = RESS_REGLES.includes(b.regle) ? b.regle : null;
    const pour = String(b.pour || '');
    if (!title) return reply({ error: 'Donnez un titre à la ressource.' }, 400, req, env);
    if (!regle) return reply({ error: 'Choisissez la règle de déblocage.' }, 400, req, env);
    if (pour && !findModule(pour) && !PRODUCTS[pour]) return reply({ error: 'Formation inconnue.' }, 400, req, env);
    const visible = b.visible === false || b.visible === 0 ? 0 : 1, ordre = Math.max(0, Math.min(999, parseInt(b.ordre, 10) || 0));
    let id = String(b.id || '');
    if (id) {
      const old = await env.DB.prepare('SELECT id FROM ressources WHERE id = ?').bind(id).first();
      if (!old) return reply({ error: 'Ressource introuvable.' }, 404, req, env);
      await env.DB.prepare('UPDATE ressources SET title = ?, descr = ?, regle = ?, pour = ?, visible = ?, ordre = ?, updated = ?, who = ? WHERE id = ?')
        .bind(title, descr, regle, pour, visible, ordre, now, who, id).run();
    } else {
      const kind = b.kind === 'html' ? 'html' : 'pdf';
      const base = (String(b.newId || title).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'ressource').slice(0, 30);
      id = base;
      for (let i = 2; await env.DB.prepare('SELECT id FROM ressources WHERE id = ?').bind(id).first(); i++) id = base + '-' + i;
      await env.DB.prepare("INSERT INTO ressources (id, title, descr, kind, r2, size, stamp, regle, pour, ordre, visible, updated, who) VALUES (?, ?, ?, ?, '', 0, '', ?, ?, ?, ?, ?, ?)")
        .bind(id, title, descr, kind, regle, pour, ordre, visible, now, who).run();
    }
    await journal(env, who, b.id ? 'Ressource modifiée' : 'Ressource ajoutée', '', '', id + ' · ' + title + ' · ' + regle + (pour ? ' · ' + pour : '') + (visible ? '' : ' · retenue'));
    return reply({ ok: true, id }, 200, req, env);
  }
  // Fichier d'une ressource. PDF : déjà préparé dans la page d'administration (zones de marquage, en-tête X-Stamp).
  if (url.pathname === '/admin/ressource-fichier' && req.method === 'PUT') {
    if (!env.DB || !env.FICHIERS) return reply({ error: 'Stockage indisponible (base ou R2).' }, 503, req, env);
    const id = String(url.searchParams.get('id') || '');
    const r = /^[a-z0-9-]{1,40}$/.test(id) ? await env.DB.prepare('SELECT * FROM ressources WHERE id = ?').bind(id).first() : null;
    if (!r) return reply({ error: 'Ressource introuvable.' }, 404, req, env);
    const buf = new Uint8Array(await req.arrayBuffer());
    if (buf.length < 100 || buf.length > RESS_MAX) return reply({ error: 'Fichier vide ou supérieur à 30 Mo.' }, 400, req, env);
    let stamp = '';
    if (r.kind === 'pdf') {
      let zones = [];
      try { zones = JSON.parse(req.headers.get('X-Stamp') || '[]'); } catch (e) { zones = []; }
      const marker = enc.encode('%GXRZONE');
      const ok = Array.isArray(zones) && zones.length && zones.length <= 50 && zones.every(z => z && [z.off, z.x, z.y, z.w].every(Number.isFinite) && z.w > 50
        && z.off >= 0 && z.off + RESS_ZONE <= buf.length && marker.every((x, i) => buf[z.off + i] === x));
      if (String.fromCharCode(...buf.slice(0, 5)) !== '%PDF-' || !ok) return reply({ error: 'Ce PDF n\'a pas pu être préparé pour le marquage du nom. Réessayez ; s\'il est protégé par un mot de passe, enregistrez-en une copie sans protection.' }, 400, req, env);
      stamp = JSON.stringify(zones.map(z => ({ off: z.off, x: z.x, y: z.y, w: z.w })));
    } else {
      const text = new TextDecoder().decode(buf);
      if (!/<html[\s>]/i.test(text)) return reply({ error: 'Ce fichier n\'est pas une page HTML.' }, 400, req, env);
      if (!text.includes('%%RESERVE%%')) return reply({ error: 'La page HTML doit contenir %%RESERVE%% à l\'endroit où le nom de l\'apprenant doit apparaître (voir le guide).' }, 400, req, env);
    }
    const key = 'ressources/' + id + '/' + now + (r.kind === 'html' ? '.html' : '.pdf');
    await env.FICHIERS.put(key, buf, { httpMetadata: { contentType: r.kind === 'html' ? 'text/html; charset=utf-8' : 'application/pdf' } });
    await env.DB.prepare('UPDATE ressources SET r2 = ?, size = ?, stamp = ?, updated = ?, who = ? WHERE id = ?').bind(key, buf.length, stamp, now, who, id).run();
    if (r.r2 && r.r2 !== key) await env.FICHIERS.delete(r.r2);
    const fname = String(url.searchParams.get('name') || '').replace(/[^\w.\- ]/g, '').slice(-80);
    await journal(env, who, r.r2 ? 'Fichier de ressource remplacé' : 'Fichier de ressource envoyé', '', '', id + (fname ? ' · ' + fname : '') + ' (' + fmtSize(buf.length) + ')');
    return reply({ ok: true, size: buf.length }, 200, req, env);
  }
  if (url.pathname === '/admin/ressource-delete' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    const b = await readJson(req), id = String(b.id || '');
    const r = /^[a-z0-9-]{1,40}$/.test(id) ? await env.DB.prepare('SELECT * FROM ressources WHERE id = ?').bind(id).first() : null;
    if (!r) return reply({ error: 'Ressource introuvable.' }, 404, req, env);
    await env.DB.prepare('DELETE FROM ressources WHERE id = ?').bind(id).run();
    if (r.r2 && env.FICHIERS) await env.FICHIERS.delete(r.r2);
    await journal(env, who, 'Ressource retirée', '', '', id + ' · ' + r.title);
    return reply({ ok: true }, 200, req, env);
  }

  if (url.pathname === '/admin/r2' && req.method === 'GET') {
    if (!env.FICHIERS) return reply({ enabled: false, objects: [], total: 0 }, 200, req, env);
    // Les fichiers de « Mes ressources » comptent dans l'espace utilisé, mais ne sont pas proposés pour les leçons.
    const l = await r2List(env);
    return reply({ enabled: true, limit: 10e9, total: l.total, objects: l.objects.filter(o => !o.key.startsWith('ressources/')) }, 200, req, env);
  }
  // Rattacher un fichier déposé dans R2 à une leçon (il apparaît chez les apprenants comme les autres fichiers de leçon).
  if (url.pathname === '/admin/r2-attach' && req.method === 'POST') {
    if (!env.DB) return reply({ error: 'Base de données indisponible.' }, 503, req, env);
    if (!env.FICHIERS) return reply({ error: 'Stockage des gros fichiers (R2) non relié à ce Worker.' }, 503, req, env);
    const b = await readJson(req);
    const lk = String(b.lesson || ''), m = findModule(moduleOf(lk)), lesson = m && m.videos.find(v => v.k === lk);
    if (!lesson) return reply({ error: 'Leçon inconnue.' }, 400, req, env);
    const key = String(b.key || '').slice(0, 1024);
    const obj = key ? await env.FICHIERS.head(key) : null;
    if (!obj) return reply({ error: 'Fichier introuvable dans le stockage R2 : vérifiez son nom.' }, 404, req, env);
    const title = String(b.title || '').trim().replace(/\s+/g, ' ').slice(0, 120) || key.split('/').pop().replace(/\.[^.]*$/, '');
    const files = lesson.files || [];
    if (files.some(f => f.r2 === key)) return reply({ error: 'Ce fichier est déjà rattaché à cette leçon.' }, 400, req, env);
    const k = lk + '-f' + (1 + Math.max(0, ...files.map(f => +f.k.split('-f')[1] || 0)));
    await saveLessons(env, m.key, m.videos.map(v => v.k === lk ? Object.assign({}, v, { files: files.concat({ k, title, r2: key, size: obj.size }) }) : v), who);
    await journal(env, who, 'Gros fichier rattaché', '', '', k + ' · ' + key + ' (' + fmtSize(obj.size) + ')');
    return reply({ ok: true, k }, 200, req, env);
  }

  if (url.pathname === '/admin/ids' && req.method === 'PUT') {
    const b = await readJson(req);
    const cfg = await getCfg(env);
    const valid = /^[0-9a-fA-F-]{36}$/;
    let n = 0;
    for (const [k, v] of Object.entries(b.ids || {})) {
      if (!/^[a-z0-9]+-v\d{2,3}$/.test(k)) continue;
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
    const lessonFile = /^[a-z0-9]+-v\d{2,3}-f\d+$/.test(k);
    if (!/^[a-z0-9]+-e\d+$/.test(k) && !lessonFile) return reply({ error: 'Exercice inconnu.' }, 400, req, env);
    const lesson = lessonFile && (findModule(moduleOf(k)) || { videos: [] }).videos.find(v => v.k === lessonOfFile(k));
    if (lessonFile && !lesson) return reply({ error: 'Leçon inconnue.' }, 400, req, env);
    const fname = String(url.searchParams.get('name') || '').replace(/[^\w.\- ]/g, '').slice(-80);
    const buf = await req.arrayBuffer();
    if (buf.byteLength < 100 || buf.byteLength > 10 * 1024 * 1024) return reply({ error: 'Fichier vide ou supérieur à 10 Mo.' }, 400, req, env);
    await env.ACCESS.put('f:' + k, buf);
    const cfg = await getCfg(env); cfg.files[k] = true; if (fname) cfg.names[k] = fname;
    await env.ACCESS.put('cfg', JSON.stringify(cfg));
    if (lessonFile && !(lesson.files || []).some(f => f.k === k)) {
      const title = String(url.searchParams.get('title') || fname.replace(/\.[^.]*$/, '') || 'Fichier').trim().slice(0, 120);
      await saveLessons(env, moduleOf(k), findModule(moduleOf(k)).videos.map(v => v.k === lesson.k ? Object.assign({}, v, { files: (v.files || []).concat({ k, title }) }) : v), who);
    }
    await journal(env, who, lessonFile ? 'Fichier de leçon envoyé' : 'Fichier d\'exercice envoyé', '', '', k + (fname ? ' · ' + fname : '') + ' (' + Math.round(buf.byteLength / 1024) + ' Ko)');
    return reply({ ok: true }, 200, req, env);
  }
  return reply({ error: 'Introuvable.' }, 404, req, env);
}