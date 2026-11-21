/* Calculateur d'échelle de carte : distance réelle, distance sur la carte, ou échelle.
   Lecture des nombres : GeoUnites (unites-moteur.js, virgule ou point décimal, espaces pour les milliers).
   Aucune donnée n'est envoyée ni stockée. Séparé de l'interface pour pouvoir être testé sous Node. */
(function (root) {
  'use strict';
  var U = root.GeoUnites;
  if (!U) throw new Error('GeoUnites (unites-moteur.js) doit être chargé avant ce fichier');

  var COURANTES = [1000, 5000, 10000, 25000, 50000, 200000];
  var AUTRES_COURANTES = [500, 1000, 2000, 5000, 10000, 20000, 25000, 50000, 100000, 200000, 250000, 500000, 1000000];
  var DENOM_MAX = 1e9;
  var DISTANCE_MAX_M = 1e12;
  var MM_PAR = { mm: 1, cm: 10 };       // distance sur la carte, en millimètres
  var M_PAR = { m: 1, km: 1000 };       // distance réelle, en mètres

  function net(x) { return Number(x.toPrecision(12)); } // supprime le bruit des flottants (0,1 + 0,2…)

  // « 1/50 000 », « 1:50000 », « 1 / 50.000 » ou « 50000 » -> dénominateur (nombre). Un point ou une virgule suivi de 3 chiffres
  // est un séparateur de milliers dans une échelle (« 1/50.000 » vaut 1/50 000).
  function lireEchelle(texte) {
    var t = String(texte == null ? '' : texte).trim();
    if (t === '') return { ok: false, vide: true, erreur: 'Saisissez une échelle, par exemple 1/50 000.' };
    var m = /^1\s*[\/:]\s*(.+)$/.exec(t);
    var den = m ? m[1] : t;
    var compact = den.replace(/[\s  ']/g, '');
    if (/^\d{1,3}(?:[.,]\d{3})+$/.test(compact)) compact = compact.replace(/[.,]/g, '');
    var r = U.lireNombre(compact);
    if (!r.ok) return { ok: false, erreur: 'Échelle invalide : écrivez-la sous la forme 1/50 000 (ou seulement 50 000).' };
    if (!(r.valeur > 0)) return { ok: false, erreur: 'Échelle invalide : le nombre après « 1/ » doit être supérieur à zéro.' };
    if (r.valeur < 1) return { ok: false, erreur: 'Échelle invalide : cet outil gère les échelles de réduction (1/500, 1/50 000…). Une échelle d’agrandissement, comme 2/1, n’est pas prise en charge.' };
    if (r.valeur > DENOM_MAX) return { ok: false, erreur: 'Échelle trop petite : le nombre après « 1/ » ne peut pas dépasser 1 000 000 000.' };
    return { ok: true, denom: r.valeur };
  }

  function lireDistance(texte, nom) {
    var r = U.lireNombre(texte);
    if (!r.ok) return { ok: false, vide: r.vide, erreur: r.vide ? 'Saisissez ' + nom + '.' : 'Valeur invalide pour ' + nom + ' : saisissez un nombre, par exemple 4 ou 2,5.' };
    if (r.valeur === 0) return { ok: false, erreur: 'La distance ne peut pas être zéro : saisissez une valeur supérieure à 0.' };
    if (r.valeur < 0) return { ok: false, erreur: 'La distance ne peut pas être négative : saisissez une valeur supérieure à 0.' };
    return { ok: true, valeur: r.valeur };
  }

  // Mode (a) : échelle + distance sur la carte -> distance réelle
  function distanceReelle(echelle, distCarte, uniteCarte) {
    var e = lireEchelle(echelle); if (!e.ok) return e;
    var d = lireDistance(distCarte, 'la distance sur la carte'); if (!d.ok) return d;
    var mm = d.valeur * MM_PAR[uniteCarte];
    var m = net(mm * e.denom / 1000);
    if (m > DISTANCE_MAX_M) return { ok: false, erreur: 'Résultat trop grand : vérifiez l’échelle et la distance saisies.' };
    return { ok: true, denom: e.denom, carteMm: mm, reelM: m, reelKm: net(m / 1000) };
  }

  // Mode (b) : échelle + distance réelle -> distance sur la carte
  function distanceCarte(echelle, distReelle, uniteReelle) {
    var e = lireEchelle(echelle); if (!e.ok) return e;
    var d = lireDistance(distReelle, 'la distance réelle'); if (!d.ok) return d;
    var m = d.valeur * M_PAR[uniteReelle];
    if (m > DISTANCE_MAX_M) return { ok: false, erreur: 'Distance trop grande : vérifiez votre saisie.' };
    var mm = net(m * 1000 / e.denom);
    return { ok: true, denom: e.denom, reelM: m, reelKm: net(m / 1000), carteMm: mm, carteCm: net(mm / 10) };
  }

  // Mode (c) : distance sur la carte + distance réelle -> échelle
  function trouverEchelle(distCarte, uniteCarte, distReelle, uniteReelle) {
    var c = lireDistance(distCarte, 'la distance sur la carte'); if (!c.ok) return c;
    var r = lireDistance(distReelle, 'la distance réelle'); if (!r.ok) return r;
    var mm = c.valeur * MM_PAR[uniteCarte], m = r.valeur * M_PAR[uniteReelle];
    if (m > DISTANCE_MAX_M) return { ok: false, erreur: 'Distance trop grande : vérifiez votre saisie.' };
    var denom = net(m * 1000 / mm);
    if (denom < 1) return { ok: false, erreur: 'La distance réelle est plus petite que la distance sur la carte : ce serait une échelle d’agrandissement, non prise en charge. Vérifiez vos unités (cm, m, km).' };
    if (denom > DENOM_MAX) return { ok: false, erreur: 'Résultat hors limites : vérifiez vos valeurs et vos unités.' };
    var proche = null, ecart = Infinity;
    AUTRES_COURANTES.forEach(function (n) { var e = Math.abs(denom - n) / n; if (e < ecart) { ecart = e; proche = n; } });
    return { ok: true, denom: denom, entier: Math.round(denom), exacte: Math.abs(denom - Math.round(denom)) < 1e-9 * denom, courante: ecart <= 0.05 ? proche : null, ecartCourante: ecart * 100 };
  }

  // Barre d'échelle pour 1/denom : 4 segments égaux de longueur ronde (1, 2 ou 5 × 10^k m), 3 à 7,5 cm de long sur la carte.
  function barre(denom) {
    var segM = null;
    for (var k = -2; k <= 9 && segM === null; k++) {
      [1, 2, 5].forEach(function (f) { var s = f * Math.pow(10, k); if (segM === null && 4 * s * 100 / denom >= 3) segM = s; });
    }
    var totalM = net(4 * segM), totalCm = net(totalM * 100 / denom);
    var PX_PAR_CM = 40, w = totalCm * PX_PAR_CM, x0 = 30, H = 78;
    function etiq(m) { return m >= 1000 ? U.formater(net(m / 1000), 6) + ' km' : U.formater(net(m), 6) + ' m'; }
    var s = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (w + 2 * x0) + ' ' + H + '" font-family="Inter, Arial, sans-serif">', '<rect width="' + (w + 2 * x0) + '" height="' + H + '" fill="#ffffff"/>'];
    for (var i = 0; i < 4; i++) {
      s.push('<rect x="' + (x0 + i * w / 4).toFixed(2) + '" y="30" width="' + (w / 4).toFixed(2) + '" height="14" fill="' + (i % 2 ? '#ffffff' : '#4B3F92') + '" stroke="#2A2A28" stroke-width="1.5"/>');
    }
    for (var j = 0; j <= 4; j++) {
      s.push('<text x="' + (x0 + j * w / 4).toFixed(2) + '" y="24" text-anchor="middle" font-size="13" fill="#2A2A28">' + (j === 0 ? '0' : etiq(net(j * segM))) + '</text>');
    }
    s.push('<text x="' + (x0 + w / 2).toFixed(2) + '" y="66" text-anchor="middle" font-size="12" fill="#6B6A72">Échelle 1/' + U.formater(denom, 12) + '</text>', '</svg>');
    return { svg: s.join(''), totalM: totalM, totalCm: totalCm, segM: segM, etiquetteTotal: etiq(totalM) };
  }

  root.GeoEchelle = {
    lireEchelle: lireEchelle, distanceReelle: distanceReelle, distanceCarte: distanceCarte, trouverEchelle: trouverEchelle, barre: barre,
    COURANTES: COURANTES
  };
})(typeof window !== 'undefined' ? window : globalThis);
