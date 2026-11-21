/* Convertisseur d'unités de surface : m², are, hectare, ha-a-ca, km², acre et lot.
   Constantes exactes : 1 ha = 10 000 m², 1 a = 100 m², 1 ca = 1 m², 1 acre = 4 046,8564224 m².
   La taille du lot est modifiable (elle varie selon les communes).
   Aucune donnée n'est envoyée ni stockée. Séparé de l'interface pour pouvoir être testé sous Node. */
(function (root) {
  'use strict';

  var M2 = { m2: 1, are: 100, ha: 10000, km2: 1e6, acre: 4046.8564224 };
  var LOT_DEFAUT = 600;   // m² : valeur courante, modifiable (n'est pas une valeur officielle)
  var M2_MAX = 1e18;      // au-delà : probable erreur de saisie (la Terre entière fait environ 5,1 × 10^14 m²)

  // Lit un nombre saisi : virgule ou point décimal, espaces (y compris insécables) pour les milliers.
  //  « 12 345,67 » et « 12345.67 » valent 12345,67 ; « 1,234.5 » vaut 1234,5 ; « 1.234.567 » vaut 1234567 ;
  //  « 1.234 » seul est lu comme 1,234 (le point est un séparateur décimal).
  function lireNombre(texte) {
    var t = String(texte == null ? '' : texte).replace(/[\s  ']/g, '').replace(/[−–]/g, '-');
    if (t === '') return { ok: false, vide: true, erreur: 'Saisissez une valeur.' };
    if (!/^[+-]?[0-9.,]+$/.test(t) || !/[0-9]/.test(t)) return { ok: false, erreur: 'Valeur invalide : saisissez un nombre, par exemple 12 345,67.' };
    var signe = 1;
    if (t[0] === '-') { signe = -1; t = t.slice(1); } else if (t[0] === '+') t = t.slice(1);
    var nbV = (t.match(/,/g) || []).length, nbP = (t.match(/\./g) || []).length;
    var dec;
    if (nbV && nbP) {
      var sep = t.lastIndexOf(',') > t.lastIndexOf('.') ? ',' : '.', autre = sep === ',' ? '.' : ',';
      var iDec = t.lastIndexOf(sep), ent = t.slice(0, iDec), frac = t.slice(iDec + 1);
      var groupes = ent.split(autre);
      var groupesOk = groupes.length > 1 && /^\d{1,3}$/.test(groupes[0]) && groupes.slice(1).every(function (g) { return /^\d{3}$/.test(g); });
      if (ent.indexOf(sep) >= 0 || !groupesOk || !/^\d*$/.test(frac)) return { ok: false, erreur: 'Valeur invalide : vérifiez les virgules et les points de votre nombre.' };
      dec = groupes.join('') + '.' + frac;
    } else if (nbV + nbP > 1) {
      if (!/^\d{1,3}(?:[.,]\d{3})+$/.test(t)) return { ok: false, erreur: 'Valeur invalide : plusieurs séparateurs. Écrivez par exemple 12 345,67 ou 12345.67.' };
      dec = t.replace(/[.,]/g, '');
    } else dec = t.replace(',', '.');
    if (!/^\d*\.?\d*$/.test(dec) || dec === '.') return { ok: false, erreur: 'Valeur invalide : saisissez un nombre, par exemple 12 345,67.' };
    var v = signe * parseFloat(dec);
    if (!isFinite(v)) return { ok: false, erreur: 'Valeur trop grande.' };
    return { ok: true, valeur: v };
  }

  function lireLot(texte) {
    var r = lireNombre(texte);
    if (!r.ok || !(r.valeur > 0) || r.valeur > 1e9) return { ok: false, erreur: 'La taille du lot doit être un nombre supérieur à 0 (en m²), par exemple 600.' };
    return { ok: true, valeur: r.valeur };
  }

  // Décompose des m² en hectares, ares et centiares (le reste est arrondi au centième de centiare, avec retenue).
  function decomposerHaAca(m2) {
    var cs = BigInt(Math.round(m2 * 100)); // centièmes de centiare (entiers : pas de dérive)
    var ha = cs / 1000000n, r = cs % 1000000n;
    return { ha: Number(ha), a: Number(r / 10000n), ca: Number(r % 10000n) / 100 };
  }

  // entree : { unite : 'm2'|'are'|'ha'|'haaca'|'km2'|'acre'|'lot', valeur (texte ou nombre) } ou, pour 'haaca', { ha, a, ca } (textes vides = 0).
  // lot : taille d'un lot en m² (texte ou nombre).
  function convertir(entree, lot) {
    var lotLu = typeof lot === 'number' ? { ok: lot > 0, valeur: lot, erreur: 'La taille du lot doit être un nombre supérieur à 0 (en m²), par exemple 600.' } : lireLot(lot);
    if (!lotLu.ok) return { ok: false, champ: 'lot', erreur: lotLu.erreur };
    var tailleLot = lotLu.valeur, m2;
    if (entree.unite === 'haaca') {
      var parts = [['ha', 'hectares', 10000], ['a', 'ares', 100], ['ca', 'centiares', 1]], total = 0, tousVides = true;
      for (var i = 0; i < parts.length; i++) {
        var txt = entree[parts[i][0]];
        if (txt == null || String(txt).trim() === '') continue;
        tousVides = false;
        var r = lireNombre(txt);
        if (!r.ok) return { ok: false, champ: parts[i][0], erreur: 'Valeur invalide dans le champ « ' + parts[i][1] + ' » : saisissez un nombre, par exemple 12.' };
        if (r.valeur < 0) return { ok: false, champ: parts[i][0], erreur: 'Les ' + parts[i][1] + ' ne peuvent pas être négatifs.' };
        total += r.valeur * parts[i][2];
      }
      if (tousVides) return { ok: false, vide: true, erreur: 'Saisissez une valeur.' };
      m2 = total;
    } else {
      var f = entree.unite === 'lot' ? tailleLot : M2[entree.unite];
      if (!f) return { ok: false, erreur: 'Unité inconnue.' };
      var lu = lireNombre(entree.valeur);
      if (!lu.ok) return { ok: false, vide: lu.vide, champ: 'valeur', erreur: lu.erreur };
      if (lu.valeur < 0) return { ok: false, champ: 'valeur', erreur: 'Une surface ne peut pas être négative : saisissez une valeur supérieure ou égale à 0.' };
      m2 = lu.valeur * f;
    }
    if (!isFinite(m2) || m2 > M2_MAX) return { ok: false, champ: 'valeur', erreur: 'Valeur trop grande : cet outil accepte jusqu’à un milliard de milliards de m² (1 000 000 000 000 km²). Vérifiez votre saisie.' };
    return {
      ok: true, m2: m2, are: m2 / 100, ha: m2 / 10000, km2: m2 / 1e6, acre: m2 / M2.acre, lot: m2 / tailleLot,
      haaca: decomposerHaAca(m2), tailleLot: tailleLot
    };
  }

  // --- Mise en forme française : virgule décimale, espace fine pour les milliers ---
  function formater(v, chiffres) {
    if (v === 0) return '0';
    return v.toLocaleString('fr-FR', { maximumSignificantDigits: chiffres || 10, useGrouping: true });
  }
  function formaterHaAca(h) {
    var ca = h.ca.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    return h.ha.toLocaleString('fr-FR') + ' ha ' + h.a + ' a ' + ca + ' ca';
  }
  // Valeur à copier : nombre brut, virgule décimale, sans séparateur de milliers
  function brut(v, chiffres) { return formater(v, chiffres).replace(/[\s  ]/g, ''); }

  root.GeoUnites = {
    M2: M2, LOT_DEFAUT: LOT_DEFAUT, M2_MAX: M2_MAX,
    lireNombre: lireNombre, lireLot: lireLot, convertir: convertir, decomposerHaAca: decomposerHaAca,
    formater: formater, formaterHaAca: formaterHaAca, brut: brut
  };
})(typeof window !== 'undefined' ? window : globalThis);
