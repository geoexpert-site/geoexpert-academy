/* Distance, azimut et gisement entre deux points (ou le long d'une chaîne de points : cheminement).
   Points en UTM : calcul à plat sur le plan UTM (théorème de Pythagore), azimut compté depuis le Nord du quadrillage.
   Points en GPS : calcul sur l'ellipsoïde WGS84 (méthode de Vincenty), azimut géodésique depuis le Nord géographique.
   Lecture des points : GeoPoints (partagé). Aucune donnée n'est envoyée ni stockée.
   Séparé de l'interface pour pouvoir être testé sous Node. */
(function (root) {
  'use strict';
  var P = root.GeoPoints;
  if (!P) throw new Error('GeoPoints (outils-points.js) doit être chargé avant ce fichier');

  var RAD = Math.PI / 180;
  var A = 6378137, F = 1 / 298.257223563, B = (1 - F) * A; // ellipsoïde WGS84
  var MAX_POINTS = 500;

  function modulo360(d) { return ((d % 360) + 360) % 360; }
  // Quand le résultat est à 360° ou presque par arrondi, on le ramène à 0 : 0 <= azimut < 360
  function norm(d) { var v = modulo360(d); return v >= 360 ? 0 : v; }

  // Distance et azimuts sur l'ellipsoïde WGS84 (problème géodésique inverse, formules de Vincenty).
  // Renvoie { distance (m), azimut (° du point 1 vers le point 2), azimutInverse (° du point 2 vers le point 1) } ou null si le calcul n'aboutit pas.
  function vincenty(lat1, lon1, lat2, lon2) {
    var U1 = Math.atan((1 - F) * Math.tan(lat1 * RAD)), U2 = Math.atan((1 - F) * Math.tan(lat2 * RAD));
    var L = (lon2 - lon1) * RAD, lambda = L, lambdaPrec;
    var sinU1 = Math.sin(U1), cosU1 = Math.cos(U1), sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
    var sinSigma, cosSigma, sigma, sinAlpha, cos2Alpha, cos2SigmaM, sinLambda, cosLambda, iter = 0;
    do {
      sinLambda = Math.sin(lambda); cosLambda = Math.cos(lambda);
      sinSigma = Math.sqrt(Math.pow(cosU2 * sinLambda, 2) + Math.pow(cosU1 * sinU2 - sinU1 * cosU2 * cosLambda, 2));
      if (sinSigma === 0) return { distance: 0, azimut: null, azimutInverse: null }; // points confondus
      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
      sigma = Math.atan2(sinSigma, cosSigma);
      sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
      cos2Alpha = 1 - sinAlpha * sinAlpha;
      cos2SigmaM = cos2Alpha !== 0 ? cosSigma - 2 * sinU1 * sinU2 / cos2Alpha : 0; // ligne équatoriale
      var C = F / 16 * cos2Alpha * (4 + F * (4 - 3 * cos2Alpha));
      lambdaPrec = lambda;
      lambda = L + (1 - C) * F * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    } while (Math.abs(lambda - lambdaPrec) > 1e-12 && ++iter < 200);
    if (iter >= 200) return null;
    var u2 = cos2Alpha * (A * A - B * B) / (B * B);
    var K1 = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
    var K2 = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
    var dSigma = K2 * sinSigma * (cos2SigmaM + K2 / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - K2 / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    var s = B * K1 * (sigma - dSigma);
    var az1 = Math.atan2(cosU2 * sinLambda, cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) / RAD;
    var az2 = Math.atan2(cosU1 * sinLambda, -sinU1 * cosU2 + cosU1 * sinU2 * cosLambda) / RAD; // azimut d'arrivée (sens de la marche)
    return { distance: s, azimut: norm(az1), azimutInverse: norm(az2 + 180) };
  }

  // Distance plane et azimut du quadrillage entre deux points UTM
  function plan(x1, y1, x2, y2) {
    var dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
    if (d === 0) return { distance: 0, azimut: null, azimutInverse: null };
    var az = norm(Math.atan2(dx, dy) / RAD);
    return { distance: d, azimut: az, azimutInverse: norm(az + 180) };
  }

  function gon(deg) { return deg === null ? null : deg * 400 / 360; }

  // mode : 'utm' ou 'gps'. zone : comme dans GeoPoints.lire. Au moins 2 points ; plus de 2 points = cheminement.
  function calculer(texte, mode, zone) {
    var lec = P.lire(texte, mode, zone, { max: MAX_POINTS, messageVide: 'Saisissez au moins 2 points : un par ligne.' });
    if (!lec.ok) return lec;
    var pts = lec.points;
    if (pts.length < 2) return { ok: false, erreur: 'Il faut au moins 2 points pour calculer une distance (un seul point saisi).' };
    pts.forEach(function (q, k) { q.num = k + 1; });
    var segments = [], total = 0;
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1];
      var r = mode === 'gps' ? vincenty(a.lat, a.lon, b.lat, b.lon) : plan(a.x, a.y, b.x, b.y);
      if (!r) return { ok: false, erreur: 'Le calcul entre les points ' + a.num + ' et ' + b.num + ' n’a pas abouti. Vérifiez vos coordonnées.' };
      segments.push({ de: a.num, vers: b.num, distance: r.distance, azimut: r.azimut, gon: gon(r.azimut), azimutInverse: r.azimutInverse, gonInverse: gon(r.azimutInverse) });
      total += r.distance;
    }
    var avert = lec.avertissements.slice();
    segments.forEach(function (s) { if (s.distance === 0) avert.push('Les points ' + s.de + ' et ' + s.vers + ' sont identiques : la distance est nulle et l’azimut n’a pas de sens.'); });
    return { ok: true, mode: mode, zone: lec.zone, label: lec.zone + 'N', points: pts, segments: segments, total: total, avertissements: avert };
  }

  // --- Mise en forme (français) ---
  function fr(v, d) {
    var s = Math.abs(v).toFixed(d).split('.');
    var ent = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (v < 0 && Number(s.join('.')) !== 0 ? '−' : '') + ent + (d > 0 ? ',' + s[1] : '');
  }
  function texteDegres(v) { return v === null ? 'non défini' : fr(v, 4) + ' °'; }
  function texteGon(v) { return v === null ? 'non défini' : fr(v, 4) + ' gon'; }

  function resumeTexte(r) {
    var s = r.segments, out = [];
    if (s.length === 1) {
      out.push('Distance : ' + fr(s[0].distance, 2) + ' m (' + fr(s[0].distance / 1000, 4) + ' km)');
      out.push('Azimut : ' + texteDegres(s[0].azimut) + ' (gisement ' + texteGon(s[0].gon) + ')');
      out.push('Azimut inverse : ' + texteDegres(s[0].azimutInverse) + ' (' + texteGon(s[0].gonInverse) + ')');
    } else {
      s.forEach(function (g) { out.push(g.de + ' → ' + g.vers + ' : ' + fr(g.distance, 2) + ' m, azimut ' + texteDegres(g.azimut) + ' (' + texteGon(g.gon) + ')'); });
      out.push('Distance totale : ' + fr(r.total, 2) + ' m (' + fr(r.total / 1000, 4) + ' km)');
    }
    return out.join('\n');
  }

  function versCsv(r, celluleCsv) {
    var out = ['Segment;De;Vers;Distance (m);Azimut (deg);Gisement (gon);Azimut inverse (deg);Gisement inverse (gon)'];
    r.segments.forEach(function (g, i) {
      out.push([i + 1, g.de, g.vers, g.distance.toFixed(3), g.azimut === null ? '' : g.azimut.toFixed(5), g.gon === null ? '' : g.gon.toFixed(5),
        g.azimutInverse === null ? '' : g.azimutInverse.toFixed(5), g.gonInverse === null ? '' : g.gonInverse.toFixed(5)].map(celluleCsv).join(';'));
    });
    out.push(['Total', '', '', r.total.toFixed(3), '', '', '', ''].map(celluleCsv).join(';'));
    return '﻿' + out.join('\r\n') + '\r\n';
  }

  root.GeoDistance = { calculer: calculer, vincenty: vincenty, plan: plan, fr: fr, resumeTexte: resumeTexte, versCsv: versCsv, texteDegres: texteDegres, texteGon: texteGon, MAX_POINTS: MAX_POINTS };
})(typeof window !== 'undefined' ? window : globalThis);
