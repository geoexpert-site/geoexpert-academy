/* Lecture d'une liste de points (UTM ou GPS), partagée par les outils : calculateur de surface,
   coordonnées vers KML/GeoJSON/CSV, distance et gisement, visualiseur sur carte.
   S'appuie sur le moteur du convertisseur (GeoConv, qui utilise proj4.js).
   Séparé de l'interface pour pouvoir être testé sous Node. Aucune donnée n'est envoyée ni stockée. */
(function (root) {
  'use strict';
  var C = root.GeoConv;
  if (!C) throw new Error('GeoConv (convertisseur-coordonnees.js) doit être chargé avant ce fichier');

  var MAX_POINTS = 2000;

  // Une ligne : séparateurs ; tabulation, virgule ou espaces (virgule décimale acceptée)
  function jetons(ligne) {
    var l = ligne.trim();
    if (/[;\t]/.test(l)) return l.split(/[;\t]/).map(function (s) { return s.trim(); }).filter(function (s, i, a) { return s !== '' || i < a.length - 1; });
    if (l.indexOf(',') >= 0) {
      var c = l.split(',').map(function (s) { return s.trim(); });
      var tousNombres = c.slice(0, 2).every(function (s) { return !isNaN(C.lireNombre(s)); });
      if (c.length <= 3 && c.every(function (s) { return s !== ''; }) && tousNombres) return c;
    }
    return l.split(/\s+/);
  }

  // Lit la liste. mode : 'utm' (Est, Nord[, zone]) ou 'gps' (latitude, longitude).
  // zone : 29 ou 30 (zone par défaut en UTM, imposée en GPS) ; 0 = automatique (GPS seulement).
  // opts : { max, parcelle (true : messages écrits pour un contour de parcelle), messageVide }
  // Renvoie { ok:false, erreur } ou { ok:true, points:[{ n, x, y, lat, lon }], zone, avertissements }.
  function lire(texte, mode, zone, opts) {
    opts = opts || {};
    var max = opts.max || MAX_POINTS;
    var lignes = String(texte || '').split(/\r?\n/), brutes = [];
    lignes.forEach(function (l, i) { if (l.trim() !== '') brutes.push({ n: i + 1, t: l }); });
    // Ligne d'en-tête (aucun chiffre) : ignorée
    if (brutes.length && !/\d/.test(brutes[0].t)) brutes.shift();
    if (brutes.length > max) return { ok: false, erreur: 'Trop de points (' + brutes.length + ') : cet outil en accepte ' + max + ' au maximum.' };
    if (!brutes.length) return { ok: false, erreur: opts.messageVide || 'Saisissez au moins un point : un par ligne.' };

    var pts = [], avert = [];
    try {
      if (mode === 'gps') {
        var gps = brutes.map(function (b) {
          var j = jetons(b.t);
          if (j.length !== 2) throw new Error('Ligne ' + b.n + ' : format attendu « latitude, longitude » (deux valeurs). Exemple : 5.3600, -4.0083');
          var lat = C.lireNombre(j[0]), lon = C.lireNombre(j[1]);
          if (isNaN(lat) || isNaN(lon)) throw new Error('Ligne ' + b.n + ' : valeur non numérique. La latitude et la longitude doivent être des nombres, par exemple 5.3600 et -4.0083.');
          return { n: b.n, lat: lat, lon: lon };
        });
        var zz = zone;
        if (!zz) {
          var moy = gps.reduce(function (s, g) { return s + g.lon; }, 0) / gps.length;
          zz = C.zoneDepuisLongitude(moy);
          if (zz !== 29 && zz !== 30) throw new Error('Ces points sont en dehors de la Côte d’Ivoire (zones UTM 29N et 30N). Vérifiez vos valeurs.');
        }
        var zonesPts = {};
        gps.forEach(function (g) {
          var u;
          try { u = C.gpsVersUtm(g.lat, g.lon, { z: zz, h: 'N' }, false); }
          catch (e) { throw new Error('Ligne ' + g.n + ' : ' + e.message); }
          zonesPts[C.zoneDepuisLongitude(g.lon)] = true;
          pts.push({ n: g.n, x: u.easting, y: u.northing, lat: g.lat, lon: g.lon });
        });
        if (Object.keys(zonesPts).length > 1) avert.push((opts.parcelle ? 'Votre parcelle est à cheval' : 'Vos points sont à cheval') + ' sur les zones UTM 29N et 30N : tous les points ont été calculés dans la zone ' + zz + 'N.');
        zone = zz;
      } else {
        var zonesVues = {};
        var lues = brutes.map(function (b) {
          var j = jetons(b.t);
          if (j.length < 2 || j.length > 3) throw new Error('Ligne ' + b.n + ' : format attendu « Est, Nord » ou « Est, Nord, zone » (par exemple 388000, 592000, 30N).');
          var est = C.lireNombre(j[0]), nord = C.lireNombre(j[1]);
          if (isNaN(est) || isNaN(nord)) throw new Error('Ligne ' + b.n + ' : valeur non numérique. L’Est et le Nord doivent être des nombres, par exemple 388000 et 592000.');
          var z = j.length === 3 ? C.lireZone(j[2], false) : (zone ? { z: zone, h: 'N' } : null);
          if (j.length === 3 && !z) throw new Error('Ligne ' + b.n + ' : zone invalide, écrivez 29N ou 30N.');
          if (!z) throw new Error('Ligne ' + b.n + ' : zone manquante. Ajoutez-la en 3e colonne (29N ou 30N) ou choisissez-la dans la liste.');
          zonesVues[z.z] = true;
          return { n: b.n, est: est, nord: nord, z: z };
        });
        var listeZ = Object.keys(zonesVues);
        if (listeZ.length > 1) throw new Error('Les points sont dans des zones UTM différentes (29N et 30N). Tous les points ' + (opts.parcelle ? 'd’une parcelle' : 'd’une même liste') + ' doivent être dans la même zone : convertissez-les d’abord dans une seule zone.');
        lues.forEach(function (l) {
          var g;
          try { g = C.utmVersGps(l.est, l.nord, l.z, false); }
          catch (e) { throw new Error('Ligne ' + l.n + ' : ' + e.message); }
          pts.push({ n: l.n, x: l.est, y: l.nord, lat: g.lat, lon: g.lon });
        });
        zone = parseInt(listeZ[0], 10);
      }
    } catch (e) { return { ok: false, erreur: e.message }; }
    return { ok: true, points: pts, zone: zone, avertissements: avert };
  }

  // Écart (m) entre deux points UTM du même plan
  function ecart(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  root.GeoPoints = { lire: lire, jetons: jetons, ecart: ecart, MAX_POINTS: MAX_POINTS };
})(typeof window !== 'undefined' ? window : globalThis);
