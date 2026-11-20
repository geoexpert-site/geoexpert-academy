/* Convertisseur de coordonnées GPS (WGS84) <-> UTM (zones 29N et 30N), Côte d'Ivoire.
   Fonctionne entièrement dans le navigateur : aucune donnée n'est envoyée ni stockée.
   Dépend de proj4js (fichier local proj4.js, chargé avant celui-ci).
   La partie « moteur » (GeoConv) est séparée de l'interface pour pouvoir être testée sous Node. */
(function (root) {
  'use strict';

  var proj4 = root.proj4;
  if (!proj4) throw new Error('proj4 est introuvable');

  // Définitions EPSG (WGS84 et UTM WGS84, zones 29 et 30 nord)
  proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
  proj4.defs('EPSG:32629', '+proj=utm +zone=29 +datum=WGS84 +units=m +no_defs');
  proj4.defs('EPSG:32630', '+proj=utm +zone=30 +datum=WGS84 +units=m +no_defs');

  var EPSG = { 29: 'EPSG:32629', 30: 'EPSG:32630' };

  // Rectangle englobant la Côte d'Ivoire, avec une petite marge
  var CI = { latMin: 4.2, latMax: 10.9, lonMin: -8.8, lonMax: -2.3 };
  var MAX_LIGNES = 5000;

  function CIerreur(lat, lon) {
    return new Error('Ce point est en dehors de la Côte d’Ivoire (latitude ' + lat.toFixed(5) + ', longitude ' + lon.toFixed(5) +
      '). Vérifiez vos valeurs : en Côte d’Ivoire la latitude est entre 4 et 11 et la longitude entre −9 et −2.');
  }

  function dansCI(lat, lon) {
    return lat >= CI.latMin && lat <= CI.latMax && lon >= CI.lonMin && lon <= CI.lonMax;
  }

  // Nombre saisi par un utilisateur : accepte la virgule décimale, les espaces, le vrai signe moins.
  function lireNombre(texte) {
    if (typeof texte === 'number') return texte;
    var t = String(texte == null ? '' : texte).replace(/[\s  ]/g, '').replace(/[−–]/g, '-').replace(',', '.');
    if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(t)) return NaN;
    return parseFloat(t);
  }

  function lireZone(texte) {
    var m = /^\s*(29|30)\s*N?\s*$/i.exec(String(texte == null ? '' : texte));
    return m ? parseInt(m[1], 10) : 0;
  }

  // Degrés, minutes, secondes -> degrés décimaux. hem : 'N', 'S', 'E', 'O' (ou 'W').
  function dmsVersDecimal(d, m, s, hem) {
    var deg = lireNombre(d), min = lireNombre(m === '' || m == null ? 0 : m), sec = lireNombre(s === '' || s == null ? 0 : s);
    if (isNaN(deg) || isNaN(min) || isNaN(sec)) throw new Error('Valeur invalide : les degrés, minutes et secondes doivent être des nombres.');
    if (deg < 0 || min < 0 || sec < 0) throw new Error('En degrés-minutes-secondes, saisissez des valeurs positives et choisissez N/S ou E/O.');
    if (min >= 60 || sec >= 60) throw new Error('Les minutes et les secondes doivent être inférieures à 60.');
    var v = deg + min / 60 + sec / 3600;
    return /^[SOW]$/i.test(hem) ? -v : v;
  }

  // Degrés décimaux -> texte DMS
  function decimalVersDms(valeur, estLatitude) {
    var hem = estLatitude ? (valeur >= 0 ? 'N' : 'S') : (valeur >= 0 ? 'E' : 'O');
    var a = Math.abs(valeur);
    var d = Math.floor(a);
    var reste = (a - d) * 60;
    var m = Math.floor(reste);
    var s = Math.round((reste - m) * 60 * 1000) / 1000;
    if (s >= 60) { s = 0; m += 1; }
    if (m >= 60) { m = 0; d += 1; }
    return d + '° ' + m + '′ ' + s.toFixed(3) + '″ ' + hem;
  }

  function zoneDepuisLongitude(lon) {
    return Math.floor((lon + 180) / 6) + 1;
  }

  // GPS (WGS84, degrés décimaux) -> UTM. zoneForcee : 0 / null (automatique), 29 ou 30.
  function gpsVersUtm(lat, lon, zoneForcee) {
    if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) throw new Error('Valeur invalide : saisissez des nombres, par exemple 5.3600 et -4.0083.');
    if (lat < -90 || lat > 90) throw new Error('Latitude invalide : elle doit être comprise entre −90 et 90.');
    if (lon < -180 || lon > 180) throw new Error('Longitude invalide : elle doit être comprise entre −180 et 180.');
    if (!dansCI(lat, lon)) throw CIerreur(lat, lon);
    var auto = zoneDepuisLongitude(lon);
    var zone = zoneForcee ? zoneForcee : auto;
    if (zone !== 29 && zone !== 30) throw new Error('Zone UTM non prise en charge : cet outil gère les zones 29N et 30N.');
    var xy = proj4('EPSG:4326', EPSG[zone], [lon, lat]);
    return { easting: xy[0], northing: xy[1], zone: zone, zoneAuto: auto, forcee: zone !== auto, hemisphere: 'N', label: zone + 'N', epsg: EPSG[zone] };
  }

  // UTM -> GPS
  function utmVersGps(est, nord, zone) {
    if (typeof est !== 'number' || typeof nord !== 'number' || isNaN(est) || isNaN(nord)) throw new Error('Valeur invalide : l’Est et le Nord doivent être des nombres, par exemple 207000 et 592000.');
    if (zone !== 29 && zone !== 30) throw new Error('Zone invalide : choisissez 29N ou 30N.');
    if (est < 100000 || est > 900000) throw new Error('Valeur Est invalide : en UTM, l’Est est compris entre 100 000 et 900 000 mètres. Vérifiez que vous n’avez pas inversé Est et Nord.');
    if (nord < 0 || nord > 1200000) throw new Error('Valeur Nord invalide : en Côte d’Ivoire, le Nord est compris entre environ 470 000 et 1 190 000 mètres.');
    var ll = proj4(EPSG[zone], 'EPSG:4326', [est, nord]);
    var lon = ll[0], lat = ll[1];
    if (!dansCI(lat, lon)) {
      throw new Error('Ce point est en dehors de la Côte d’Ivoire (latitude ' + lat.toFixed(5) + ', longitude ' + lon.toFixed(5) +
        '). Vérifiez la zone (29N ou 30N) : une mauvaise zone décale le point d’environ 6 degrés.');
    }
    return { lat: lat, lon: lon, latDms: decimalVersDms(lat, true), lonDms: decimalVersDms(lon, false), zone: zone };
  }

  // --- Plusieurs points ---------------------------------------------------
  function decouperLigne(ligne) {
    var sep = ligne.indexOf('\t') >= 0 ? '\t' : (ligne.indexOf(';') >= 0 ? ';' : ',');
    return ligne.split(sep).map(function (c) { return c.trim(); });
  }

  // mode : 'gps' (lignes « latitude, longitude ») ou 'utm' (lignes « Est, Nord, zone »)
  function convertirLot(texte, mode, zoneParDefaut) {
    var lignes = String(texte || '').split(/\r?\n/);
    var lignesUtiles = [];
    lignes.forEach(function (l, i) { if (l.trim() !== '') lignesUtiles.push({ n: i + 1, t: l }); });
    var tronque = lignesUtiles.length > MAX_LIGNES;
    if (tronque) lignesUtiles = lignesUtiles.slice(0, MAX_LIGNES);
    var lignesRes = lignesUtiles.map(function (l) {
      var champs = decouperLigne(l.t);
      var r = { ligne: l.n };
      try {
        if (mode === 'gps') {
          if (champs.length !== 2) throw new Error('Format attendu : latitude, longitude (deux valeurs par ligne).');
          var lat = lireNombre(champs[0]), lon = lireNombre(champs[1]);
          if (isNaN(lat) || isNaN(lon)) throw new Error('Valeur invalide : latitude et longitude doivent être des nombres.');
          var u = gpsVersUtm(lat, lon, zoneParDefaut || 0);
          r.ok = true; r.lat = lat; r.lon = lon; r.est = u.easting; r.nord = u.northing; r.zone = u.label;
        } else {
          if (champs.length < 2 || champs.length > 3) throw new Error('Format attendu : Est, Nord, zone (par exemple 207000, 592000, 30N).');
          var e = lireNombre(champs[0]), n = lireNombre(champs[1]);
          var z = champs.length === 3 ? lireZone(champs[2]) : (zoneParDefaut || 0);
          if (champs.length === 3 && !z) throw new Error('Zone invalide : écrivez 29N ou 30N.');
          if (!z) throw new Error('Zone manquante : ajoutez-la en 3e colonne (29N ou 30N) ou choisissez-la dans la liste.');
          if (isNaN(e) || isNaN(n)) throw new Error('Valeur invalide : l’Est et le Nord doivent être des nombres.');
          var g = utmVersGps(e, n, z);
          r.ok = true; r.est = e; r.nord = n; r.zone = z + 'N'; r.lat = g.lat; r.lon = g.lon; r.latDms = g.latDms; r.lonDms = g.lonDms;
        }
      } catch (err) {
        r.ok = false; r.erreur = err.message;
      }
      return r;
    });
    return { lignes: lignesRes, tronque: tronque, max: MAX_LIGNES };
  }

  function fmt(v, n) { return v.toFixed(n); }

  // Colonnes affichées / exportées. Le séparateur du CSV est « ; » avec le point décimal : se lit directement dans QGIS et dans Excel (réglages FR : choisir « ; » à l'import).
  function colonnes(mode) {
    return mode === 'gps'
      ? ['Ligne', 'Latitude', 'Longitude', 'Est (m)', 'Nord (m)', 'Zone UTM', 'Statut']
      : ['Ligne', 'Est (m)', 'Nord (m)', 'Zone UTM', 'Latitude', 'Longitude', 'Latitude DMS', 'Longitude DMS', 'Statut'];
  }

  function valeursLigne(r, mode) {
    if (!r.ok) {
      return mode === 'gps' ? [r.ligne, '', '', '', '', '', r.erreur] : [r.ligne, '', '', '', '', '', '', '', r.erreur];
    }
    return mode === 'gps'
      ? [r.ligne, fmt(r.lat, 6), fmt(r.lon, 6), fmt(r.est, 2), fmt(r.nord, 2), r.zone, 'OK']
      : [r.ligne, fmt(r.est, 2), fmt(r.nord, 2), r.zone, fmt(r.lat, 6), fmt(r.lon, 6), r.latDms, r.lonDms, 'OK'];
  }

  function versCsv(res, mode) {
    function cellule(v) {
      var s = String(v);
      if (/^[=+@\t\r]/.test(s)) s = "'" + s; // neutralise les formules dans les tableurs
      if (/[";\r\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
      return s;
    }
    var out = [colonnes(mode).map(cellule).join(';')];
    res.lignes.forEach(function (r) { out.push(valeursLigne(r, mode).map(cellule).join(';')); });
    return '﻿' + out.join('\r\n') + '\r\n';
  }

  root.GeoConv = {
    lireNombre: lireNombre, lireZone: lireZone, dmsVersDecimal: dmsVersDecimal, decimalVersDms: decimalVersDms,
    zoneDepuisLongitude: zoneDepuisLongitude, gpsVersUtm: gpsVersUtm, utmVersGps: utmVersGps,
    convertirLot: convertirLot, colonnes: colonnes, valeursLigne: valeursLigne, versCsv: versCsv, dansCI: dansCI
  };
})(typeof window !== 'undefined' ? window : globalThis);
