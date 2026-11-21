/* Coordonnées -> fichiers KML, GeoJSON et CSV (points, ligne ou polygone).
   Les fichiers KML et GeoJSON sont toujours en WGS84, dans l'ordre LONGITUDE puis LATITUDE.
   Lecture des points : GeoPoints (partagé). Aucune donnée n'est envoyée ni stockée.
   Séparé de l'interface pour pouvoir être testé sous Node. */
(function (root) {
  'use strict';
  var P = root.GeoPoints;
  if (!P) throw new Error('GeoPoints (outils-points.js) doit être chargé avant ce fichier');

  var MINIMUM = { points: 1, ligne: 2, polygone: 3 };
  var NOMS_RESERVES = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i; // noms interdits sous Windows

  // Nom de fichier sûr : sans accents, lettres/chiffres/tirets seulement, longueur limitée.
  function nettoyerNomFichier(nom, defaut) {
    var s = String(nom == null ? '' : nom).normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\.(kml|geojson|json|csv)$/i, '')
      .replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '');
    if (!s || NOMS_RESERVES.test(s)) s = defaut || 'mes-points';
    return s;
  }

  // Texte pour XML : retire les caractères interdits en XML 1.0 puis échappe & < > " '
  function echapperXml(texte) {
    return String(texte == null ? '' : texte)
      .replace(/[^\u0009\u000A\u000D -퟿-�\uD800-\uDFFF]/g, '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }

  // Nom d'objet : une seule ligne, sans caractères de contrôle, longueur limitée
  function nettoyerNomObjet(nom, defaut) {
    var s = String(nom == null ? '' : nom).replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
    return s || defaut;
  }

  // geometrie : 'points' | 'ligne' | 'polygone'
  function preparer(texte, mode, zone, geometrie) {
    var min = MINIMUM[geometrie];
    if (!min) return { ok: false, erreur: 'Choisissez une géométrie : points, ligne ou polygone.' };
    var libMin = geometrie === 'points' ? 'un point' : min + ' points';
    var lec = P.lire(texte, mode, zone, { messageVide: 'Saisissez au moins ' + libMin + ' : un par ligne.' });
    if (!lec.ok) return lec;
    var pts = lec.points, avert = lec.avertissements.slice();
    if (geometrie !== 'points') {
      // Polygone : le dernier point qui répète le premier est retiré (le contour est refermé automatiquement)
      if (geometrie === 'polygone' && pts.length > 3 && P.ecart(pts[0], pts[pts.length - 1]) < 1e-6) {
        pts = pts.slice(0, -1); avert.push('Le dernier point répète le premier : le contour est refermé automatiquement, il a été retiré.');
      }
      var net = [];
      pts.forEach(function (q) {
        var prec = net[net.length - 1];
        if (prec && P.ecart(prec, q) < 1e-6) avert.push('Le point de la ligne ' + q.n + ' est identique au précédent : il a été ignoré.');
        else net.push(q);
      });
      pts = net;
    }
    if (pts.length < min) return { ok: false, erreur: 'Il faut au moins ' + libMin + (geometrie === 'points' ? '' : ' différents') + ' pour ' + (geometrie === 'ligne' ? 'une ligne' : 'un polygone') + ' (il en reste ' + pts.length + ').' };
    pts.forEach(function (q, k) { q.num = k + 1; });
    return { ok: true, geometrie: geometrie, points: pts, zone: lec.zone, label: lec.zone + 'N', avertissements: avert };
  }

  function arrondi8(v) { return Number(v.toFixed(8)); } // 1 cm = environ 0,0000001 degré : 8 décimales = environ 1 mm
  function coord(q) { return [arrondi8(q.lon), arrondi8(q.lat)]; } // GeoJSON : [longitude, latitude]

  function versGeoJson(res, nomObjet) {
    var nom = nettoyerNomObjet(nomObjet, 'Mon objet'), feats;
    if (res.geometrie === 'points') {
      feats = res.points.map(function (q) {
        return { type: 'Feature', properties: { name: res.points.length > 1 ? nom + ' ' + q.num : nom, num: q.num }, geometry: { type: 'Point', coordinates: coord(q) } };
      });
    } else if (res.geometrie === 'ligne') {
      feats = [{ type: 'Feature', properties: { name: nom }, geometry: { type: 'LineString', coordinates: res.points.map(coord) } }];
    } else {
      var anneau = res.points.map(coord); anneau.push(anneau[0]);
      feats = [{ type: 'Feature', properties: { name: nom }, geometry: { type: 'Polygon', coordinates: [anneau] } }];
    }
    return JSON.stringify({ type: 'FeatureCollection', name: nom, features: feats }, null, 2) + '\n';
  }

  function kmlCoord(q) { return q.lon.toFixed(8) + ',' + q.lat.toFixed(8) + ',0'; } // KML : longitude, latitude, altitude

  function versKml(res, nomObjet) {
    var nom = nettoyerNomObjet(nomObjet, 'Mon objet');
    var out = ['<?xml version="1.0" encoding="UTF-8"?>', '<kml xmlns="http://www.opengis.net/kml/2.2">', '<Document>', '<name>' + echapperXml(nom) + '</name>'];
    if (res.geometrie === 'points') {
      res.points.forEach(function (q) {
        out.push('<Placemark><name>' + echapperXml(res.points.length > 1 ? nom + ' ' + q.num : nom) + '</name><description>' +
          echapperXml('UTM ' + res.label + ' : Est ' + q.x.toFixed(2) + ' m, Nord ' + q.y.toFixed(2) + ' m') + '</description>' +
          '<Point><coordinates>' + kmlCoord(q) + '</coordinates></Point></Placemark>');
      });
    } else if (res.geometrie === 'ligne') {
      out.push('<Placemark><name>' + echapperXml(nom) + '</name><LineString><tessellate>1</tessellate><coordinates>' +
        res.points.map(kmlCoord).join(' ') + '</coordinates></LineString></Placemark>');
    } else {
      var c = res.points.map(kmlCoord); c.push(c[0]);
      out.push('<Placemark><name>' + echapperXml(nom) + '</name><Polygon><tessellate>1</tessellate><outerBoundaryIs><LinearRing><coordinates>' +
        c.join(' ') + '</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>');
    }
    out.push('</Document>', '</kml>');
    return out.join('\n') + '\n';
  }

  // CSV : séparateur « ; », point décimal, lisible dans QGIS et Excel ; UTM et GPS (WGS84)
  function versCsv(res, nomObjet, celluleCsv) {
    var nom = nettoyerNomObjet(nomObjet, 'Mon objet');
    var out = ['Point;Nom;Est (m);Nord (m);Zone UTM;Latitude;Longitude'];
    res.points.forEach(function (q) {
      out.push([q.num, nom + ' ' + q.num, q.x.toFixed(2), q.y.toFixed(2), res.label, q.lat.toFixed(8), q.lon.toFixed(8)].map(celluleCsv).join(';'));
    });
    return '﻿' + out.join('\r\n') + '\r\n';
  }

  root.GeoExport = {
    preparer: preparer, versGeoJson: versGeoJson, versKml: versKml, versCsv: versCsv,
    nettoyerNomFichier: nettoyerNomFichier, nettoyerNomObjet: nettoyerNomObjet, echapperXml: echapperXml
  };
})(typeof window !== 'undefined' ? window : globalThis);
