/* Calcul de surface d'une parcelle à partir de ses coordonnées (formule du lacet sur le plan UTM).
   Réutilise le moteur du convertisseur (GeoConv, qui s'appuie sur proj4.js) pour la lecture des nombres,
   des zones et la conversion GPS -> UTM. Aucune donnée n'est envoyée ni stockée.
   Séparé de l'interface pour pouvoir être testé sous Node. */
(function (root) {
  'use strict';
  var C = root.GeoConv, P = root.GeoPoints;
  if (!C || !P) throw new Error('GeoConv (convertisseur-coordonnees.js) et GeoPoints (outils-points.js) doivent être chargés avant ce fichier');

  var MAX_POINTS = P.MAX_POINTS;
  var DISTANCE_MAX = 50000; // mètres : au-delà, probable erreur de saisie

  function formatHaAca(surface) {
    var c = Math.floor(Math.round(surface * 1e6) / 1e6); // centiares entiers (les décimales sont tronquées)
    return { ha: Math.floor(c / 10000), a: Math.floor((c % 10000) / 100), ca: c % 100 };
  }

  function orientation(ax, ay, bx, by, cx, cy) {
    var v = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    return v > 0 ? 1 : v < 0 ? -1 : 0;
  }
  function surSegment(ax, ay, bx, by, px, py) {
    return Math.min(ax, bx) <= px && px <= Math.max(ax, bx) && Math.min(ay, by) <= py && py <= Math.max(ay, by);
  }
  function segmentsSeCoupent(p1, p2, p3, p4) {
    var o1 = orientation(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y), o2 = orientation(p1.x, p1.y, p2.x, p2.y, p4.x, p4.y);
    var o3 = orientation(p3.x, p3.y, p4.x, p4.y, p1.x, p1.y), o4 = orientation(p3.x, p3.y, p4.x, p4.y, p2.x, p2.y);
    if (o1 !== o2 && o3 !== o4) return true;
    if (o1 === 0 && surSegment(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)) return true;
    if (o2 === 0 && surSegment(p1.x, p1.y, p2.x, p2.y, p4.x, p4.y)) return true;
    if (o3 === 0 && surSegment(p3.x, p3.y, p4.x, p4.y, p1.x, p1.y)) return true;
    if (o4 === 0 && surSegment(p3.x, p3.y, p4.x, p4.y, p2.x, p2.y)) return true;
    return false;
  }
  // Contour qui se croise ou se touche lui-même (segments non voisins). Coordonnées relatives pour la précision.
  function contourCroise(pts) {
    var n = pts.length;
    if (n < 4) return false;
    for (var i = 0; i < n; i++) {
      for (var j = i + 1; j < n; j++) {
        if (j === i + 1 || (i === 0 && j === n - 1)) continue; // segments voisins
        if (segmentsSeCoupent(pts[i], pts[(i + 1) % n], pts[j], pts[(j + 1) % n])) return true;
      }
    }
    return false;
  }

  // mode : 'utm' (Est, Nord[, zone]) ou 'gps' (latitude, longitude).
  // zone : 29 ou 30 (zone par défaut pour l'UTM, ou zone imposée pour le GPS) ; 0 = automatique (GPS seulement).
  // Renvoie { ok:false, erreur } ou { ok:true, ... résultats }.
  function analyser(texte, mode, zone) {
    var lec = P.lire(texte, mode, zone, { parcelle: true, messageVide: 'Saisissez au moins 3 points : un par ligne, dans l’ordre du contour.' });
    if (!lec.ok) return lec;
    var pts = lec.points, avert = lec.avertissements.slice(), i;
    zone = lec.zone;

    // Polygone refermé automatiquement : on retire le dernier point s'il répète le premier
    if (pts.length > 3 && Math.hypot(pts[0].x - pts[pts.length - 1].x, pts[0].y - pts[pts.length - 1].y) < 1e-6) {
      pts.pop(); avert.push('Le dernier point répète le premier : le contour est refermé automatiquement, il a été retiré.');
    }
    // Points consécutifs identiques
    var net = [];
    pts.forEach(function (q) {
      var prec = net[net.length - 1];
      if (prec && Math.hypot(prec.x - q.x, prec.y - q.y) < 1e-6) {
        avert.push('Le point de la ligne ' + q.n + ' est identique au précédent : il a été ignoré.');
      } else net.push(q);
    });
    pts = net;
    pts.forEach(function (q, k) { q.num = k + 1; });
    if (pts.length < 3) return { ok: false, erreur: 'Il faut au moins 3 points différents pour former une parcelle (il en reste ' + pts.length + ').' };

    // Points trop éloignés
    var dmax = 0;
    for (i = 0; i < pts.length; i++) for (var j2 = i + 1; j2 < pts.length; j2++) {
      var d = Math.hypot(pts[i].x - pts[j2].x, pts[i].y - pts[j2].y);
      if (d > dmax) dmax = d;
    }
    if (dmax > DISTANCE_MAX) return { ok: false, erreur: 'Deux de vos points sont à ' + (dmax / 1000).toFixed(1).replace('.', ',') + ' km l’un de l’autre (plus de 50 km) : c’est probablement une erreur de saisie. Vérifiez vos coordonnées.' };

    // Formule du lacet, en coordonnées relatives au premier point (évite les erreurs d'arrondi sur de grands nombres)
    var x0 = pts[0].x, y0 = pts[0].y, rel = pts.map(function (q) { return { x: q.x - x0, y: q.y - y0 }; });
    var s2 = 0, per = 0, n = rel.length;
    for (i = 0; i < n; i++) {
      var a = rel[i], b = rel[(i + 1) % n];
      s2 += a.x * b.y - b.x * a.y;
      per += Math.hypot(b.x - a.x, b.y - a.y);
    }
    var surface = Math.abs(s2) / 2;
    var croise = contourCroise(rel);
    if (surface <= 1e-9 * per * per || surface < 1e-6) {
      if (croise) return { ok: false, erreur: 'Votre contour se croise lui-même (il forme un « 8 » ou un nœud papillon) : la surface n’a pas de sens. Vérifiez l’ordre de vos points : ils doivent suivre le contour, dans l’ordre.' };
      return { ok: false, erreur: 'Vos points sont alignés (ou presque) : ils ne forment pas une surface. Vérifiez vos coordonnées.' };
    }

    return {
      ok: true, mode: mode, zone: zone, label: zone + 'N', points: pts, avertissements: avert,
      surface: surface, perimetre: per, haAca: formatHaAca(surface), croise: croise
    };
  }

  // --- Mise en forme ---
  function fr(v, d) { // 12345.678 -> « 12 345,68 »
    var s = v.toFixed(d).split('.'), ent = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return d > 0 ? ent + ',' + s[1] : ent;
  }
  function deux(n) { return (n < 10 ? '0' : '') + n; }
  function texteHaAca(r) { return r.haAca.ha + ' ha ' + deux(r.haAca.a) + ' a ' + deux(r.haAca.ca) + ' ca'; }
  function texteResultat(r) {
    return 'Surface : ' + fr(r.surface, 2) + ' m² = ' + fr(r.surface / 10000, 4) + ' ha = ' + texteHaAca(r) + '\n' +
      'Périmètre : ' + fr(r.perimetre, 2) + ' m\n' +
      'Nombre de points : ' + r.points.length + ' (zone UTM ' + r.label + ')' + (r.croise ? '\nAttention : le contour se croise, la surface n’a pas de sens.' : '');
  }

  function versCsv(r) {
    var out = ['Point;Est (m);Nord (m);Zone UTM;Latitude;Longitude'];
    r.points.forEach(function (q) {
      out.push([q.num, q.x.toFixed(2), q.y.toFixed(2), r.label, q.lat.toFixed(6), q.lon.toFixed(6)].join(';'));
    });
    return '﻿' + out.join('\r\n') + '\r\n';
  }

  // Tableau de plusieurs parcelles. lignes : [{ libelle, res (résultat d'analyser, ok ou non), trous }]
  function versCsvParcelles(lignes) {
    function cellule(v) {
      var s = String(v);
      if (/^[=+@\t\r-]/.test(s) && isNaN(parseFloat(s))) s = "'" + s; // neutralise les formules dans les tableurs
      else if (/^[=+@\t\r]/.test(s)) s = "'" + s;
      if (/[";\r\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
      return s;
    }
    var out = ['Parcelle;Points;Surface (m2);Surface (ha);ha-a-ca;Perimetre (m);Zone UTM;Statut'];
    lignes.forEach(function (l) {
      var r = l.res, trous = l.trous ? ' (trous ignorés : ' + l.trous + ')' : '';
      out.push(r.ok
        ? [l.libelle, r.points.length, r.surface.toFixed(2), (r.surface / 10000).toFixed(4), texteHaAca(r), r.perimetre.toFixed(2), r.label, (r.croise ? 'Contour croisé : surface sans sens' : 'OK') + trous].map(cellule).join(';')
        : [l.libelle, '', '', '', '', '', '', r.erreur].map(cellule).join(';'));
    });
    return '\ufeff' + out.join('\r\n') + '\r\n';
  }

  // --- Dessin SVG (couleurs écrites en dur : le fichier téléchargé doit s'afficher partout) ---
  function longueurJolie(m) { // 1, 2 ou 5 x 10^k
    var p = Math.pow(10, Math.floor(Math.log10(m))), f = m / p;
    return (f >= 5 ? 5 : f >= 2 ? 2 : 1) * p;
  }
  function dessinSvg(r) {
    var W = 640, H = 460, M = 56, zoneW = W - 2 * M, zoneH = H - 2 * M - 24;
    var xs = r.points.map(function (q) { return q.x; }), ys = r.points.map(function (q) { return q.y; });
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs), minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    var dx = Math.max(maxX - minX, 1e-6), dy = Math.max(maxY - minY, 1e-6);
    var ech = Math.min(zoneW / dx, zoneH / dy);
    var offX = M + (zoneW - dx * ech) / 2, offY = M + (zoneH - dy * ech) / 2;
    var P = r.points.map(function (q) { return { x: offX + (q.x - minX) * ech, y: offY + (maxY - q.y) * ech, num: q.num }; });
    var cx = P.reduce(function (s, q) { return s + q.x; }, 0) / P.length, cy = P.reduce(function (s, q) { return s + q.y; }, 0) / P.length;
    var couleur = r.croise ? '#C0392B' : '#4B3F92', fond = r.croise ? 'rgba(192,57,43,0.12)' : 'rgba(0,146,166,0.18)';
    var s = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" font-family="Inter, Arial, sans-serif">',
      '<rect width="' + W + '" height="' + H + '" fill="#ffffff"/>',
      '<polygon points="' + P.map(function (q) { return q.x.toFixed(1) + ',' + q.y.toFixed(1); }).join(' ') + '" fill="' + fond + '" stroke="' + couleur + '" stroke-width="2.5" stroke-linejoin="round"/>'];
    P.forEach(function (q) {
      var vx = q.x - cx, vy = q.y - cy, l = Math.hypot(vx, vy) || 1;
      var tx = q.x + vx / l * 20, ty = q.y + vy / l * 20;
      s.push('<circle cx="' + q.x.toFixed(1) + '" cy="' + q.y.toFixed(1) + '" r="6" fill="#0092A6" stroke="#ffffff" stroke-width="1.5"/>');
      s.push('<text x="' + tx.toFixed(1) + '" y="' + (ty + 8).toFixed(1) + '" text-anchor="middle" font-size="24" font-weight="700" fill="#2A2A28">' + q.num + '</text>');
    });
    // Repère Nord
    s.push('<g transform="translate(' + (W - 40) + ',46)"><polygon points="0,-26 9,10 0,3 -9,10" fill="#4B3F92"/><text x="0" y="32" text-anchor="middle" font-size="22" font-weight="700" fill="#2A2A28">N</text></g>');
    // Échelle simple
    var lm = longueurJolie(110 / ech), lpx = lm * ech, bx = M, by = H - 40;
    var etiq = lm >= 1000 ? (lm / 1000) + ' km' : lm + ' m';
    s.push('<g><line x1="' + bx + '" y1="' + by + '" x2="' + (bx + lpx).toFixed(1) + '" y2="' + by + '" stroke="#2A2A28" stroke-width="2.5"/>' +
      '<line x1="' + bx + '" y1="' + (by - 6) + '" x2="' + bx + '" y2="' + (by + 6) + '" stroke="#2A2A28" stroke-width="2"/>' +
      '<line x1="' + (bx + lpx).toFixed(1) + '" y1="' + (by - 6) + '" x2="' + (bx + lpx).toFixed(1) + '" y2="' + (by + 6) + '" stroke="#2A2A28" stroke-width="2"/>' +
      '<text x="' + (bx + lpx / 2).toFixed(1) + '" y="' + (by + 26) + '" text-anchor="middle" font-size="19" fill="#2A2A28">' + etiq + '</text></g>');
    s.push('<text x="' + (W - M) + '" y="' + (H - 20) + '" text-anchor="end" font-size="18" fill="#6B6A72">Surface : ' + fr(r.surface, 2) + ' m² · UTM ' + r.label + '</text>');
    s.push('</svg>');
    return s.join('\n');
  }

  root.GeoSurface = {
    analyser: analyser, formatHaAca: formatHaAca, texteResultat: texteResultat, texteHaAca: texteHaAca,
    versCsv: versCsv, versCsvParcelles: versCsvParcelles, dessinSvg: dessinSvg, fr: fr, jetons: P.jetons, MAX_POINTS: MAX_POINTS
  };
})(typeof window !== 'undefined' ? window : globalThis);
