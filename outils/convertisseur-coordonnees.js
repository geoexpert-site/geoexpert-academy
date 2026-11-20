/* Convertisseur de coordonnées GPS (WGS84) <-> UTM (WGS84).
   Mode « Côte d'Ivoire » (par défaut) : zones 29N et 30N, points contrôlés dans le pays.
   Mode « monde » : toutes les zones UTM (1 à 60, nord et sud).
   Fonctionne entièrement dans le navigateur : aucune donnée n'est envoyée ni stockée.
   Dépend de proj4js (fichier local proj4.js, chargé avant celui-ci).
   La partie « moteur » (GeoConv) est séparée de l'interface pour pouvoir être testée sous Node. */
(function (root) {
  'use strict';

  var proj4 = root.proj4;
  if (!proj4) throw new Error('proj4 est introuvable');

  proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');

  // Une zone est un objet { z: 1..60, h: 'N' | 'S' }. Le code EPSG vaut 32600+z (nord) ou 32700+z (sud).
  function epsgDe(zone) { return 'EPSG:' + ((zone.h === 'N' ? 32600 : 32700) + zone.z); }
  function etiquette(zone) { return zone.z + zone.h; }
  function enregistrer(zone) {
    var code = epsgDe(zone);
    if (!proj4.defs(code)) {
      proj4.defs(code, '+proj=utm +zone=' + zone.z + (zone.h === 'S' ? ' +south' : '') + ' +datum=WGS84 +units=m +no_defs');
    }
    return code;
  }
  // Les trois définitions de la Côte d'Ivoire sont déclarées d'emblée.
  enregistrer({ z: 29, h: 'N' }); enregistrer({ z: 30, h: 'N' });

  // Rectangle englobant la Côte d'Ivoire, avec une petite marge
  var CI = { latMin: 4.2, latMax: 10.9, lonMin: -8.8, lonMax: -2.3 };
  var MAX_LIGNES = 5000;

  function CIerreur(lat, lon) {
    return new Error('Ce point est en dehors de la Côte d’Ivoire (latitude ' + lat.toFixed(5) + ', longitude ' + lon.toFixed(5) +
      '). Vérifiez vos valeurs : en Côte d’Ivoire la latitude est entre 4 et 11 et la longitude entre −9 et −2. Pour un autre pays, choisissez « Autre pays » en haut de l’outil.');
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

  // Lit « 30N », « 30 », « 35S »… Renvoie { z, h } ou null.
  // Côte d'Ivoire : seulement 29N et 30N (l'hémisphère peut être omis).
  // Monde : zone 1 à 60 ; l'hémisphère (N ou S) peut être omis seulement si defautH est fourni.
  function lireZone(texte, monde, defautH) {
    var m = /^\s*(\d{1,2})\s*([NSns])?\s*$/.exec(String(texte == null ? '' : texte));
    if (!m) return null;
    var z = parseInt(m[1], 10), h = m[2] ? m[2].toUpperCase() : (monde ? (defautH || '') : 'N');
    if (!h) return null;
    if (monde) return z >= 1 && z <= 60 ? { z: z, h: h } : null;
    return (z === 29 || z === 30) && h === 'N' ? { z: z, h: h } : null;
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
    return Math.min(60, Math.floor((lon + 180) / 6) + 1);
  }

  // GPS (WGS84, degrés décimaux) -> UTM.
  // zoneForcee : null (automatique) ou { z, h }. monde : false = Côte d'Ivoire, true = monde entier.
  function gpsVersUtm(lat, lon, zoneForcee, monde) {
    if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) throw new Error('Valeur invalide : saisissez des nombres, par exemple 5.3600 et -4.0083.');
    if (lat < -90 || lat > 90) throw new Error('Latitude invalide : elle doit être comprise entre −90 et 90.');
    if (lon < -180 || lon > 180) throw new Error('Longitude invalide : elle doit être comprise entre −180 et 180.');
    if (!monde && !dansCI(lat, lon)) throw CIerreur(lat, lon);
    if (lat < -80 || lat > 84) throw new Error('Le système UTM ne couvre que les latitudes entre −80 et 84.');
    var auto = zoneDepuisLongitude(lon);
    var h = lat >= 0 ? 'N' : 'S';
    var zone;
    if (zoneForcee) {
      if (zoneForcee.h && zoneForcee.h !== h) throw new Error('La zone ' + etiquette(zoneForcee) + ' ne correspond pas à l’hémisphère de ce point (' + (h === 'N' ? 'nord' : 'sud') + ').');
      zone = { z: zoneForcee.z, h: h };
    } else {
      zone = { z: auto, h: h };
    }
    if (!monde && !(zone.z === 29 || zone.z === 30)) throw new Error('Zone UTM non prise en charge dans ce mode : la Côte d’Ivoire utilise les zones 29N et 30N.');
    var code = enregistrer(zone);
    var xy = proj4('EPSG:4326', code, [lon, lat]);
    return { easting: xy[0], northing: xy[1], zone: zone.z, hemisphere: h, zoneAuto: auto, forcee: zone.z !== auto, label: etiquette(zone), epsg: code };
  }

  // UTM -> GPS. zone : { z, h }.
  function utmVersGps(est, nord, zone, monde) {
    if (typeof est !== 'number' || typeof nord !== 'number' || isNaN(est) || isNaN(nord)) throw new Error('Valeur invalide : l’Est et le Nord doivent être des nombres, par exemple 207000 et 592000.');
    if (!zone) throw new Error('Zone invalide : ' + (monde ? 'écrivez un numéro de 1 à 60 suivi de N ou S, par exemple 31N.' : 'choisissez 29N ou 30N.'));
    if (est < 100000 || est > 900000) throw new Error('Valeur Est invalide : en UTM, l’Est est compris entre 100 000 et 900 000 mètres. Vérifiez que vous n’avez pas inversé Est et Nord.');
    if (monde) {
      if (nord < 0 || nord > 10000000) throw new Error('Valeur Nord invalide : en UTM, le Nord est compris entre 0 et 10 000 000 mètres.');
    } else if (nord < 0 || nord > 1200000) {
      throw new Error('Valeur Nord invalide : en Côte d’Ivoire, le Nord est compris entre environ 470 000 et 1 190 000 mètres.');
    }
    var ll = proj4(enregistrer(zone), 'EPSG:4326', [est, nord]);
    var lon = ll[0], lat = ll[1];
    if (!monde && !dansCI(lat, lon)) {
      throw new Error('Ce point est en dehors de la Côte d’Ivoire (latitude ' + lat.toFixed(5) + ', longitude ' + lon.toFixed(5) +
        '). Vérifiez la zone (29N ou 30N) : une mauvaise zone décale le point d’environ 6 degrés. Pour un autre pays, choisissez « Autre pays » en haut de l’outil.');
    }
    if (!isFinite(lat) || !isFinite(lon) || lat < -90 || lat > 90) throw new Error('Ces coordonnées ne correspondent à aucun point valide. Vérifiez l’Est, le Nord et la zone.');
    return { lat: lat, lon: lon, latDms: decimalVersDms(lat, true), lonDms: decimalVersDms(lon, false), zone: zone.z, label: etiquette(zone) };
  }

  // --- Plusieurs points ---------------------------------------------------
  function decouperLigne(ligne) {
    var sep = ligne.indexOf('\t') >= 0 ? '\t' : (ligne.indexOf(';') >= 0 ? ';' : ',');
    return ligne.split(sep).map(function (c) { return c.trim(); });
  }

  // mode : 'gps' (lignes « latitude, longitude ») ou 'utm' (lignes « Est, Nord, zone »)
  // zoneParDefaut : null ou { z, h }
  function convertirLot(texte, mode, zoneParDefaut, monde) {
    var lignes = String(texte || '').split(/\r?\n/);
    var lignesUtiles = [];
    lignes.forEach(function (l, i) { if (l.trim() !== '') lignesUtiles.push({ n: i + 1, t: l }); });
    var tronque = lignesUtiles.length > MAX_LIGNES;
    if (tronque) lignesUtiles = lignesUtiles.slice(0, MAX_LIGNES);
    var exZone = monde ? '31N' : '30N';
    var lignesRes = lignesUtiles.map(function (l) {
      var champs = decouperLigne(l.t);
      var r = { ligne: l.n };
      try {
        if (mode === 'gps') {
          if (champs.length !== 2) throw new Error('Format attendu : latitude, longitude (deux valeurs par ligne).');
          var lat = lireNombre(champs[0]), lon = lireNombre(champs[1]);
          if (isNaN(lat) || isNaN(lon)) throw new Error('Valeur invalide : latitude et longitude doivent être des nombres.');
          var u = gpsVersUtm(lat, lon, zoneParDefaut || null, monde);
          r.ok = true; r.lat = lat; r.lon = lon; r.est = u.easting; r.nord = u.northing; r.zone = u.label;
        } else {
          if (champs.length < 2 || champs.length > 3) throw new Error('Format attendu : Est, Nord, zone (par exemple 207000, 592000, ' + exZone + ').');
          var e = lireNombre(champs[0]), n = lireNombre(champs[1]);
          var z = champs.length === 3 ? lireZone(champs[2], monde) : zoneParDefaut;
          if (champs.length === 3 && !z) throw new Error('Zone invalide : écrivez ' + (monde ? 'un numéro de 1 à 60 suivi de N ou S (par exemple 31N).' : '29N ou 30N.'));
          if (!z) throw new Error('Zone manquante : ajoutez-la en 3e colonne (' + (monde ? 'par exemple 31N' : '29N ou 30N') + ') ou indiquez-la dans le champ prévu.');
          if (isNaN(e) || isNaN(n)) throw new Error('Valeur invalide : l’Est et le Nord doivent être des nombres.');
          var g = utmVersGps(e, n, z, monde);
          r.ok = true; r.est = e; r.nord = n; r.zone = g.label; r.lat = g.lat; r.lon = g.lon; r.latDms = g.latDms; r.lonDms = g.lonDms;
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

  function echapperXml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Description lisible d'un point (pour la carte et le KML)
  function descriptionPoint(r) {
    return 'Ligne ' + r.ligne + ' : ' + fmt(r.lat, 6) + ', ' + fmt(r.lon, 6) + ' (UTM ' + r.zone + ' : Est ' + fmt(r.est, 2) + ' m, Nord ' + fmt(r.nord, 2) + ' m)';
  }

  // Fichier KML (Google Earth, QGIS…) : uniquement les points convertis. Ordre KML : longitude, latitude.
  function versKml(res) {
    var pts = res.lignes.filter(function (r) { return r.ok; });
    var out = ['<?xml version="1.0" encoding="UTF-8"?>', '<kml xmlns="http://www.opengis.net/kml/2.2">', '<Document>', '<name>Points convertis</name>'];
    pts.forEach(function (r) {
      out.push('<Placemark><name>Point ' + r.ligne + '</name><description>' + echapperXml(descriptionPoint(r)) + '</description>' +
        '<Point><coordinates>' + r.lon.toFixed(8) + ',' + r.lat.toFixed(8) + ',0</coordinates></Point></Placemark>');
    });
    out.push('</Document>', '</kml>');
    return out.join('\n') + '\n';
  }

  root.GeoConv = {
    lireNombre: lireNombre, lireZone: lireZone, dmsVersDecimal: dmsVersDecimal, decimalVersDms: decimalVersDms,
    zoneDepuisLongitude: zoneDepuisLongitude, gpsVersUtm: gpsVersUtm, utmVersGps: utmVersGps,
    convertirLot: convertirLot, colonnes: colonnes, valeursLigne: valeursLigne, versCsv: versCsv, versKml: versKml,
    descriptionPoint: descriptionPoint, dansCI: dansCI
  };
})(typeof window !== 'undefined' ? window : globalThis);
