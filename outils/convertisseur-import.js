/* Lecture de fichiers de points (CSV, TXT, GPX, KML, GeoJSON) pour l'outil « Plusieurs points ».
   Les fichiers sont lus par le navigateur (FileReader) : rien n'est envoyé nulle part. */
(function (root) {
  'use strict';
  var G = root.GeoConv;
  var MAX_OCTETS = 5 * 1024 * 1024;

  function norm(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  }
  var NOMS_LAT = ['lat', 'latitude', 'latitud'];
  var NOMS_LON = ['lon', 'lng', 'long', 'longitude', 'longitud'];
  var NOMS_EST = ['est', 'easting', 'estm', 'xutm', 'eastingm'];
  var NOMS_NORD = ['nord', 'northing', 'nordm', 'yutm', 'northingm'];
  var NOMS_ZONE = ['zone', 'fuseau', 'utmzone', 'zoneutm'];

  function indexDe(noms, liste) {
    for (var i = 0; i < noms.length; i++) if (liste.indexOf(noms[i]) >= 0) return i;
    return -1;
  }

  // Découpe une ligne CSV en respectant les guillemets
  function champs(ligne, sep) {
    var out = [], cur = '', q = false;
    for (var i = 0; i < ligne.length; i++) {
      var c = ligne.charAt(i);
      if (c === '"') { if (q && ligne.charAt(i + 1) === '"') { cur += '"'; i++; } else q = !q; }
      else if (c === sep && !q) { out.push(cur.trim()); cur = ''; }
      else cur += c;
    }
    out.push(cur.trim());
    return out;
  }

  function lireCsv(texte) {
    var lignes = texte.replace(/^﻿/, '').split(/\r?\n/).filter(function (l) { return l.trim() !== ''; });
    if (!lignes.length) return { erreur: 'Le fichier est vide.' };
    var premiere = lignes[0];
    var sep = premiere.indexOf('\t') >= 0 ? '\t' : (premiere.indexOf(';') >= 0 ? ';' : ',');
    var rows = lignes.map(function (l) { return champs(l, sep); });

    var estNombre = function (v) { return !isNaN(G.lireNombre(v)); };
    var entete = rows[0].every(function (v) { return v === '' || !estNombre(v); });
    var noms = entete ? rows[0].map(norm) : [];
    var data = entete ? rows.slice(1) : rows;
    if (!data.length) return { erreur: 'Aucune ligne de données après l’en-tête.' };

    var iLat = indexDe(noms, NOMS_LAT), iLon = indexDe(noms, NOMS_LON);
    var iEst = indexDe(noms, NOMS_EST), iNord = indexDe(noms, NOMS_NORD), iZone = indexDe(noms, NOMS_ZONE);

    // Noms de colonnes plus libres : « latitude_deg », « Longitude (°) », « X coord »…
    if (entete) {
      var brut = rows[0].map(function (h) { return ' ' + h.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ') + ' '; });
      var trouver = function (mots) {
        for (var i = 0; i < brut.length; i++) for (var j = 0; j < mots.length; j++) if (brut[i].indexOf(' ' + mots[j] + ' ') >= 0) return i;
        return -1;
      };
      if (iLat < 0) iLat = trouver(['lat', 'latitude', 'latitud']);
      if (iLon < 0) iLon = trouver(['lon', 'long', 'lng', 'longitude', 'longitud']);
      if (iEst < 0) iEst = trouver(['est', 'easting']);      // « X_Est_m », « Est (m) »…
      if (iNord < 0) iNord = trouver(['nord', 'northing']);  // « Y_Nord_m », « Nord (m) »…
      if (iZone < 0) iZone = trouver(['zone', 'fuseau']);
    }

    // Colonne de géométrie WKT (exports QGIS, OpenStreetMap…) : POINT (lon lat), ou le centre approché d'un polygone
    var iWkt = -1;
    if (iLat < 0 || iLon < 0) {
      var reWkt = /^\s*(MULTI)?(POINT|LINESTRING|POLYGON)/i;
      for (var c = 0; c < (data[0] || []).length; c++) {
        if (reWkt.test(data[0][c]) || (entete && /^(wkt|geom|geometry|thegeom|wktgeom|geometrie)$/.test(noms[c]))) { iWkt = c; break; }
      }
    }
    if (iWkt >= 0 && !(iLat >= 0 && iLon >= 0)) {
      var ptsWkt = [], ignWkt = 0, approx = false;
      data.forEach(function (r) {
        var txt = String(r[iWkt] || ''), re = /(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)\s+(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)/g, m, n = 0, sx = 0, sy = 0;
        var sommets = [];
        while ((m = re.exec(txt))) sommets.push([parseFloat(m[1]), parseFloat(m[2])]);
        // un anneau de polygone se termine par son premier sommet : on ne le compte qu'une fois
        if (sommets.length > 2 && sommets[0][0] === sommets[sommets.length - 1][0] && sommets[0][1] === sommets[sommets.length - 1][1]) sommets.pop();
        sommets.forEach(function (s) { sx += s[0]; sy += s[1]; n++; });
        if (!n) { ignWkt++; return; }
        if (n > 1) approx = true;
        ptsWkt.push({ lat: Math.round(sy / n * 1e7) / 1e7, lon: Math.round(sx / n * 1e7) / 1e7 });
      });
      return { mode: 'gps', points: ptsWkt, ignorees: ignWkt, approx: approx };
    }

    var mode = null, a, b, z = -1;
    if (iLat >= 0 && iLon >= 0) { mode = 'gps'; a = iLat; b = iLon; }
    else if (iEst >= 0 && iNord >= 0) { mode = 'utm'; a = iEst; b = iNord; z = iZone; }
    else if (entete) {
      var iX = noms.indexOf('x'), iY = noms.indexOf('y');
      if (iX < 0 || iY < 0) return { erreur: 'Colonnes non reconnues (colonnes trouvées : ' + rows[0].slice(0, 12).join(', ') + (rows[0].length > 12 ? '…' : '') + '). Nommez-les latitude et longitude, ou Est et Nord (plus zone), ou x et y, ou gardez une colonne de géométrie WKT.' };
      var x0 = G.lireNombre((data[0] || [])[iX]);
      if (Math.abs(x0) > 1000) { mode = 'utm'; a = iX; b = iY; z = iZone; }
      else { mode = 'gps'; a = iY; b = iX; } // x = longitude, y = latitude
    } else {
      var v0 = G.lireNombre(rows[0][0]);
      if (Math.abs(v0) > 1000) { mode = 'utm'; a = 0; b = 1; z = rows[0].length > 2 ? 2 : -1; }
      else { mode = 'gps'; a = 0; b = 1; } // latitude, longitude
    }

    var points = [], ignorees = 0;
    data.forEach(function (r) {
      var p = G.lireNombre(r[a]), q = G.lireNombre(r[b]);
      if (isNaN(p) || isNaN(q)) { ignorees++; return; }
      if (mode === 'gps') points.push({ lat: p, lon: q });
      else points.push({ est: p, nord: q, zone: z >= 0 ? String(r[z] || '').trim() : '' });
    });
    return { mode: mode, points: points, ignorees: ignorees };
  }

  function analyserXml(texte) {
    var doc = new DOMParser().parseFromString(texte, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) return null;
    return doc;
  }

  function lireGpx(texte) {
    var doc = analyserXml(texte);
    if (!doc) return { erreur: 'Fichier GPX illisible.' };
    var points = [];
    ['wpt', 'trkpt', 'rtept'].forEach(function (tag) {
      var els = doc.getElementsByTagName(tag);
      for (var i = 0; i < els.length; i++) {
        var lat = G.lireNombre(els[i].getAttribute('lat')), lon = G.lireNombre(els[i].getAttribute('lon'));
        if (!isNaN(lat) && !isNaN(lon)) points.push({ lat: lat, lon: lon });
      }
    });
    return { mode: 'gps', points: points, ignorees: 0 };
  }

  function lireKml(texte) {
    var doc = analyserXml(texte);
    if (!doc) return { erreur: 'Fichier KML illisible.' };
    var points = [], els = doc.getElementsByTagName('coordinates');
    for (var i = 0; i < els.length; i++) {
      var parent = els[i].parentNode;
      if (!parent || parent.localName !== 'Point') continue; // seulement les points (pas les lignes ni les polygones)
      var c = els[i].textContent.trim().split(',');
      var lon = G.lireNombre(c[0]), lat = G.lireNombre(c[1]);
      if (!isNaN(lat) && !isNaN(lon)) points.push({ lat: lat, lon: lon });
    }
    return { mode: 'gps', points: points, ignorees: 0 };
  }

  function lireGeoJson(texte) {
    var obj;
    try { obj = JSON.parse(texte); } catch (e) { return { erreur: 'Fichier GeoJSON illisible.' }; }
    var points = [];
    (function marcher(o) {
      if (!o || typeof o !== 'object') return;
      if (Array.isArray(o)) { o.forEach(marcher); return; }
      if (o.type === 'FeatureCollection') marcher(o.features);
      else if (o.type === 'Feature') marcher(o.geometry);
      else if (o.type === 'GeometryCollection') marcher(o.geometries);
      else if (o.type === 'Point' && Array.isArray(o.coordinates)) ajouter(o.coordinates);
      else if (o.type === 'MultiPoint' && Array.isArray(o.coordinates)) o.coordinates.forEach(ajouter);
    })(obj);
    function ajouter(c) { if (typeof c[0] === 'number' && typeof c[1] === 'number') points.push({ lat: c[1], lon: c[0] }); }
    return { mode: 'gps', points: points, ignorees: 0 };
  }

  // Lit un fichier déjà chargé en texte. Renvoie { mode, points, ignorees } ou { erreur }.
  function lireFichier(nom, texte) {
    var ext = (/\.([a-z0-9]+)$/i.exec(nom) || [, ''])[1].toLowerCase();
    var debut = texte.replace(/^﻿/, '').trimStart().charAt(0);
    if (ext === 'gpx') return lireGpx(texte);
    if (ext === 'kml') return lireKml(texte);
    if (ext === 'geojson' || (ext === 'json')) return lireGeoJson(texte);
    if (ext === 'csv' || ext === 'txt' || ext === 'tsv') return lireCsv(texte);
    if (debut === '{') return lireGeoJson(texte);
    if (debut === '<') return /<gpx/i.test(texte) ? lireGpx(texte) : lireKml(texte);
    return lireCsv(texte);
  }

  // Met les points au format de la zone de texte « Plusieurs points ».
  function versTexte(mode, points) {
    return points.map(function (p) {
      return mode === 'gps' ? p.lat + ', ' + p.lon : p.est + '; ' + p.nord + (p.zone ? '; ' + p.zone : '');
    }).join('\n');
  }

  root.GeoImport = { lireFichier: lireFichier, versTexte: versTexte, MAX_OCTETS: MAX_OCTETS };
})(window);
