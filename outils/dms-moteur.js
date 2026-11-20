/* Convertisseur degrés-minutes-secondes (DMS) <-> degrés décimaux, pour la latitude et la longitude.
   Accepte plusieurs écritures : 5°20'30.5"N, 5 20 30.5 N, 5° 20′ 30,5″, N 5 20 30.5, -4.0083, avec virgule ou point,
   et O ou W pour l'Ouest. Aucune donnée n'est envoyée ni stockée.
   Séparé de l'interface pour pouvoir être testé sous Node. */
(function (root) {
  'use strict';

  var MAX_LIGNES = 5000;
  var DECIMALES = 8; // 8 décimales = environ 1 mm ; assez fin pour un aller-retour sans dérive (secondes au millième)

  // Mots entiers -> lettre
  function lettresDepuisMots(t) {
    return t.replace(/\b(nord|north)\b/gi, 'N').replace(/\b(sud|south)\b/gi, 'S').replace(/\b(est|east)\b/gi, 'E')
      .replace(/\bouest\b/gi, 'O').replace(/\bwest\b/gi, 'W');
  }

  // Lit une latitude (type 'lat') ou une longitude (type 'lon') écrite en DMS ou en décimal.
  // Renvoie { ok:true, valeur (degrés décimaux) } ou { ok:false, erreur }.
  function lireAngle(texte, type) {
    var nom = type === 'lat' ? 'latitude' : 'longitude', max = type === 'lat' ? 90 : 180;
    var s = String(texte == null ? '' : texte).trim();
    if (s === '') return { ok: false, erreur: 'Saisissez la ' + nom + '.' };
    var t = lettresDepuisMots(s.replace(/[−–—]/g, '-'));
    var lettres = t.match(/[A-Za-z]/g) || [];
    if (lettres.length > 1) return { ok: false, erreur: 'La ' + nom + ' « ' + s + ' » contient plusieurs lettres : une seule lettre est permise (' + (type === 'lat' ? 'N ou S' : 'E, O ou W') + ').' };
    var hem = lettres.length ? lettres[0].toUpperCase() : '';
    if (hem && !/^[NSEOW]$/.test(hem)) return { ok: false, erreur: 'Lettre non reconnue « ' + lettres[0] + ' » dans la ' + nom + ' : utilisez ' + (type === 'lat' ? 'N ou S' : 'E, O ou W') + '.' };
    if (hem && type === 'lat' && !/^[NS]$/.test(hem)) return { ok: false, erreur: 'Une latitude se termine par N (nord) ou S (sud), pas par ' + hem + '. Avez-vous inversé latitude et longitude ?' };
    if (hem && type === 'lon' && !/^[EOW]$/.test(hem)) return { ok: false, erreur: 'Une longitude se termine par E (est) ou O / W (ouest), pas par ' + hem + '. Avez-vous inversé latitude et longitude ?' };
    var u = t.replace(/[A-Za-z]/g, ' ').replace(/''/g, ' ').replace(/[°º˚'′’‘´`"″”“]/g, ' ');
    var nombres = u.match(/[+-]?\d+(?:[.,]\d+)?/g) || [];
    var reste = u.replace(/[+-]?\d+(?:[.,]\d+)?/g, ' ').replace(/[\s,;:]/g, '');
    if (reste !== '') return { ok: false, erreur: 'La ' + nom + ' « ' + s + ' » contient un caractère non reconnu (« ' + reste.charAt(0) + ' »). Exemples : 5°20\'30.5"N ou 5.3418.' };
    if (nombres.length === 0) return { ok: false, erreur: 'La ' + nom + ' « ' + s + ' » ne contient aucun nombre.' };
    if (nombres.length > 3) return { ok: false, erreur: 'La ' + nom + ' « ' + s + ' » contient trop de nombres : écrivez au plus degrés, minutes et secondes.' };
    var signe = 1;
    if (/^-/.test(nombres[0])) signe = -1;
    for (var i = 1; i < nombres.length; i++) if (/^[+-]/.test(nombres[i])) return { ok: false, erreur: 'Seuls les degrés peuvent porter un signe : les minutes et les secondes sont toujours positives.' };
    if (hem && /^-/.test(nombres[0])) return { ok: false, erreur: 'Choisissez : soit un signe moins, soit une lettre (' + (type === 'lat' ? 'N ou S' : 'E, O ou W') + '), pas les deux.' };
    if (/^[SOW]$/.test(hem)) signe = -1;
    var v = nombres.map(function (n) { return Math.abs(parseFloat(n.replace(',', '.'))); });
    var deg = v[0], min = v.length > 1 ? v[1] : 0, sec = v.length > 2 ? v[2] : 0;
    if (nombres.length > 1 && deg !== Math.floor(deg)) return { ok: false, erreur: 'Quand les minutes sont données, les degrés doivent être un nombre entier (par exemple 5°20\').' };
    if (nombres.length > 2 && min !== Math.floor(min)) return { ok: false, erreur: 'Quand les secondes sont données, les minutes doivent être un nombre entier (par exemple 20′ 30.5″).' };
    if (min >= 60) return { ok: false, erreur: 'Les minutes doivent être comprises entre 0 et 59 (elles valent ' + nombres[1].replace(/^[+-]/, '') + ').' };
    if (sec >= 60) return { ok: false, erreur: 'Les secondes doivent être inférieures à 60 (elles valent ' + nombres[2].replace(/^[+-]/, '') + '). 60 secondes font 1 minute.' };
    var total = deg + min / 60 + sec / 3600;
    if (total > max) return { ok: false, erreur: 'Une ' + nom + ' doit être comprise entre −' + max + ' et ' + max + ' degrés (valeur lue : ' + String(Math.round(total * 1e6) / 1e6).replace('.', ',') + ' °).' };
    return { ok: true, valeur: signe * total };
  }

  // Degrés décimaux -> { d, m, s, hem } (secondes arrondies au millième, avec retenue : jamais 60 secondes ni 60 minutes)
  function decimalVersDms(valeur, type) {
    var ms = Math.round(Math.abs(valeur) * 3600000); // millièmes de seconde, entiers
    var d = Math.floor(ms / 3600000), reste = ms % 3600000, m = Math.floor(reste / 60000), s = (reste % 60000) / 1000;
    var hem = ms === 0 ? (type === 'lat' ? 'N' : 'E') : (type === 'lat' ? (valeur < 0 ? 'S' : 'N') : (valeur < 0 ? 'O' : 'E'));
    return { d: d, m: m, s: s, hem: hem };
  }
  function nombreCourt(v, dec) { // 30.500 -> « 30.5 », 36.000 -> « 36 »
    var t = v.toFixed(dec);
    return t.indexOf('.') >= 0 ? t.replace(/0+$/, '').replace(/\.$/, '') : t;
  }
  function texteDms(valeur, type) {
    var p = decimalVersDms(valeur, type);
    return p.d + '° ' + p.m + '′ ' + nombreCourt(p.s, 3) + '″ ' + p.hem;
  }
  function texteDecimal(valeur) {
    var t = nombreCourt(valeur, DECIMALES);
    return t === '-0' ? '0' : t;
  }

  // --- Plusieurs points : une ligne = une latitude et une longitude, en DMS ou en décimal ---
  function decouperLigne(ligne) {
    var t = ligne.trim();
    var m = /[;\t]/.exec(t);
    if (m) {
      var parts = t.split(/[;\t]/).map(function (x) { return x.trim(); });
      if (parts.length === 2 && parts[0] && parts[1]) return { lat: parts[0], lon: parts[1] };
      return { erreur: 'Format attendu : latitude et longitude séparées par un point-virgule (deux valeurs).' };
    }
    var l = lettresDepuisMots(t);
    var re = /[A-Za-z]/g, pos = [], r;
    while ((r = re.exec(l)) !== null) pos.push(r.index);
    if (pos.length === 2) {
      var avant = l.slice(0, pos[0]).replace(/[\s,]/g, '') === ''; // lettre en tête : « N 5 20 30 W 4 1 2 »
      var coupe = avant ? pos[1] : pos[0] + 1;
      var a = l.slice(0, coupe).replace(/[\s,;]+$/, ''), b = l.slice(coupe).replace(/^[\s,;]+/, '');
      if (a && b) return { lat: a, lon: b };
    } else if (pos.length === 1 || pos.length > 2) {
      return { erreur: 'Une seule lettre (N/S pour la latitude, E/O/W pour la longitude) par valeur : écrivez-en une après la latitude et une après la longitude, ou séparez-les par un point-virgule.' };
    }
    // Sans lettres : décimal « 5.36, -4.01 » / « 5,36 -4,01 » / « 5.36,-4.01 », ou DMS signé « 5 21 36 -4 0 29.88 »
    var u = l.replace(/''/g, ' ').replace(/[°º˚'′’‘´`"″”“]/g, ' ').replace(/[−–—]/g, '-');
    var nums = u.match(/[+-]?\d+(?:[.,]\d+)?/g) || [];
    if (nums.length === 2 && /^\S+(?:\s*,\s+|\s+|,)\S+$/.test(u.trim())) {
      var d = u.trim().split(/\s*,\s+|\s+/);
      if (d.length === 1) d = u.trim().split(',');
      if (d.length === 2) return { lat: d[0], lon: d[1] };
    }
    if (nums.length === 2) return { lat: nums[0], lon: nums[1] };
    if (nums.length === 6) return { lat: nums.slice(0, 3).join(' '), lon: nums.slice(3).join(' ') };
    if (nums.length === 4) return { lat: nums.slice(0, 2).join(' '), lon: nums.slice(2).join(' ') };
    return { erreur: 'Ligne non reconnue : écrivez la latitude puis la longitude, par exemple 5.3600, -4.0083 ou 5°21\'36"N; 4°0\'29.88"O.' };
  }

  function convertirLot(texte) {
    var lignes = String(texte || '').split(/\r?\n/), utiles = [];
    lignes.forEach(function (l, i) { if (l.trim() !== '') utiles.push({ n: i + 1, t: l }); });
    if (utiles.length && !/\d/.test(utiles[0].t)) utiles.shift(); // ligne d'en-tête
    var tronque = utiles.length > MAX_LIGNES;
    if (tronque) utiles = utiles.slice(0, MAX_LIGNES);
    return {
      tronque: tronque, max: MAX_LIGNES,
      lignes: utiles.map(function (l) {
        var r = { ligne: l.n, source: l.t.trim() };
        var c = decouperLigne(l.t);
        if (c.erreur) { r.ok = false; r.erreur = c.erreur; return r; }
        var la = lireAngle(c.lat, 'lat'), lo = lireAngle(c.lon, 'lon');
        if (!la.ok) { r.ok = false; r.erreur = la.erreur; return r; }
        if (!lo.ok) { r.ok = false; r.erreur = lo.erreur; return r; }
        r.ok = true; r.lat = la.valeur; r.lon = lo.valeur;
        r.latDec = texteDecimal(la.valeur); r.lonDec = texteDecimal(lo.valeur);
        r.latDms = texteDms(la.valeur, 'lat'); r.lonDms = texteDms(lo.valeur, 'lon');
        return r;
      })
    };
  }

  var COLONNES = ['Ligne', 'Latitude (degrés décimaux)', 'Longitude (degrés décimaux)', 'Latitude (DMS)', 'Longitude (DMS)', 'Statut'];
  function valeursLigne(r) { return r.ok ? [r.ligne, r.latDec, r.lonDec, r.latDms, r.lonDms, 'OK'] : [r.ligne, '', '', '', '', r.erreur]; }
  function versCsv(res, celluleCsv) {
    var out = [COLONNES.map(celluleCsv).join(';')];
    res.lignes.forEach(function (r) { out.push(valeursLigne(r).map(celluleCsv).join(';')); });
    return '﻿' + out.join('\r\n') + '\r\n';
  }
  function versTexte(res) { // pour « Copier » : colonnes séparées par une tabulation (se colle dans un tableur)
    return [COLONNES.join('\t')].concat(res.lignes.map(function (r) { return valeursLigne(r).join('\t'); })).join('\n');
  }

  root.GeoDms = {
    lireAngle: lireAngle, decimalVersDms: decimalVersDms, texteDms: texteDms, texteDecimal: texteDecimal,
    decouperLigne: decouperLigne, convertirLot: convertirLot, versCsv: versCsv, versTexte: versTexte, valeursLigne: valeursLigne, COLONNES: COLONNES, MAX_LIGNES: MAX_LIGNES
  };
})(typeof window !== 'undefined' ? window : globalThis);
