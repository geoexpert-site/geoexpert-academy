/* Interface du convertisseur DMS <-> degrés décimaux. Tout reste dans le navigateur : rien n'est envoyé ni stocké. */
(function () {
  'use strict';
  var G = window.GeoDms, OC = window.OutilsCommun;
  var $ = function (id) { return document.getElementById(id); };
  var ouvrirOnglet = OC.onglets(document.querySelector('.cv-tabs'));
  var dernier = null;

  function item(label, valeur, copie) {
    var div = document.createElement('div'); div.className = 'cv-res-item';
    var txt = document.createElement('div'); txt.className = 'cv-res-text';
    var l = document.createElement('span'); l.className = 'cv-res-label'; l.textContent = label;
    var v = document.createElement('span'); v.className = 'cv-res-value'; v.textContent = valeur;
    txt.appendChild(l); txt.appendChild(v); div.appendChild(txt); div.appendChild(OC.boutonCopier(copie != null ? copie : valeur, label));
    return div;
  }

  // Une conversion (onglets 1 et 2) : p = 'a' (DMS -> décimal) ou 'b' (décimal -> DMS)
  function convertir(p) {
    var msg = $(p + '-msg'), res = $(p + '-res');
    OC.cacher(msg); res.textContent = '';
    $(p + '-lat').removeAttribute('aria-invalid'); $(p + '-lon').removeAttribute('aria-invalid');
    var la = G.lireAngle($(p + '-lat').value, 'lat'), lo = G.lireAngle($(p + '-lon').value, 'lon');
    if (!la.ok || !lo.ok) {
      var erreurs = [];
      if (!la.ok) { erreurs.push(la.erreur); $(p + '-lat').setAttribute('aria-invalid', 'true'); }
      if (!lo.ok) { erreurs.push(lo.erreur); $(p + '-lon').setAttribute('aria-invalid', 'true'); }
      OC.afficherErreur(msg, erreurs.join(' '));
      return;
    }
    var latDec = G.texteDecimal(la.valeur), lonDec = G.texteDecimal(lo.valeur);
    var latDms = G.texteDms(la.valeur, 'lat'), lonDms = G.texteDms(lo.valeur, 'lon');
    if (p === 'a') {
      res.appendChild(item('Latitude en degrés décimaux', latDec + ' °', latDec));
      res.appendChild(item('Longitude en degrés décimaux', lonDec + ' °', lonDec));
      res.appendChild(item('Latitude, longitude (à copier)', latDec + ', ' + lonDec));
    } else {
      res.appendChild(item('Latitude en DMS', latDms));
      res.appendChild(item('Longitude en DMS', lonDms));
      res.appendChild(item('Latitude, longitude (à copier)', latDms + ' ; ' + lonDms));
    }
  }
  ['a', 'b'].forEach(function (p) {
    $(p + '-go').addEventListener('click', function () { convertir(p); });
    [p + '-lat', p + '-lon'].forEach(function (id) { $(id).addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); convertir(p); } }); });
  });
  $('a-exemple').addEventListener('click', function () { $('a-lat').value = '5°21\'36"N'; $('a-lon').value = '4°0\'29.88"O'; convertir('a'); });
  $('b-exemple').addEventListener('click', function () { $('b-lat').value = '5.3600'; $('b-lon').value = '-4.0083'; convertir('b'); });
  $('a-clear').addEventListener('click', function () { $('a-lat').value = ''; $('a-lon').value = ''; OC.cacher($('a-msg')); $('a-res').textContent = ''; });
  $('b-clear').addEventListener('click', function () { $('b-lat').value = ''; $('b-lon').value = ''; OC.cacher($('b-msg')); $('b-res').textContent = ''; });

  // --- Liste de points ---
  function effacerListe() {
    OC.cacher($('c-msg')); $('c-out').textContent = ''; $('c-actions').hidden = true; $('c-copy-wrap').textContent = ''; dernier = null;
  }
  $('c-go').addEventListener('click', function () {
    effacerListe();
    var res = G.convertirLot($('c-txt').value);
    if (!res.lignes.length) { OC.afficherErreur($('c-msg'), 'Collez au moins un point : une ligne par point, avec la latitude puis la longitude.'); return; }
    dernier = res;
    var tab = document.createElement('table'); tab.className = 'cv-table';
    var th = document.createElement('thead'), tr = document.createElement('tr');
    G.COLONNES.forEach(function (h) { var c = document.createElement('th'); c.textContent = h; tr.appendChild(c); });
    th.appendChild(tr); tab.appendChild(th);
    var tb = document.createElement('tbody'), nbOk = 0;
    res.lignes.forEach(function (r) {
      var l = document.createElement('tr');
      G.valeursLigne(r).forEach(function (v, i) {
        var c = document.createElement('td'); c.textContent = v;
        if (!r.ok && i === 5) c.className = 'err';
        l.appendChild(c);
      });
      if (r.ok) nbOk++;
      tb.appendChild(l);
    });
    tab.appendChild(tb); $('c-out').appendChild(tab);
    var info = $('c-msg'), n = res.lignes.length;
    info.className = 'cv-msg ' + (nbOk === n ? 'info' : 'err');
    info.textContent = nbOk + ' ligne' + (nbOk > 1 ? 's' : '') + ' convertie' + (nbOk > 1 ? 's' : '') + ' sur ' + n + '.' + (nbOk < n ? ' Les lignes en erreur sont expliquées dans la dernière colonne.' : '') +
      (res.tronque ? ' Seules les ' + res.max + ' premières lignes ont été traitées.' : '');
    info.hidden = false;
    $('c-actions').hidden = false;
    $('c-copy-wrap').appendChild(OC.boutonCopier(function () { return G.versTexte(dernier); }, 'le tableau', 'Copier le tableau'));
  });
  $('c-csv').addEventListener('click', function () { if (dernier) OC.telecharger(G.versCsv(dernier, OC.celluleCsv), 'text/csv;charset=utf-8', 'coordonnees-dms-decimal.csv'); });
  $('c-exemple').addEventListener('click', function () {
    $('c-txt').value = '5.3600, -4.0083\n5°21\'36"N 4°0\'29.88"W\n7.6906; -5.0300\n9°27\'28.8"N; 5°37\'46.56"O\n';
    $('c-go').click();
  });
  $('c-clear').addEventListener('click', function () { $('c-txt').value = ''; effacerListe(); });
})();
