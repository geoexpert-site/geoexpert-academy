/* Interface du convertisseur. Tout reste dans le navigateur : aucune requête réseau, aucun stockage. */
(function () {
  'use strict';
  var G = window.GeoConv;
  var $ = function (id) { return document.getElementById(id); };

  // --- Onglets ---
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.cv-tab'));
  function ouvrir(tab, focus) {
    tabs.forEach(function (t) {
      var actif = t === tab;
      t.setAttribute('aria-selected', actif ? 'true' : 'false');
      t.tabIndex = actif ? 0 : -1;
      $(t.getAttribute('aria-controls')).hidden = !actif;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { ouvrir(t); });
    t.addEventListener('keydown', function (e) {
      var j = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : -1;
      if (j >= 0) { e.preventDefault(); ouvrir(tabs[j], true); }
    });
  });

  // --- Copier ---
  function copier(texte) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(texte);
    return new Promise(function (ok, ko) {
      var ta = document.createElement('textarea');
      ta.value = texte; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? ok() : ko(); } catch (e) { ko(e); }
      document.body.removeChild(ta);
    });
  }
  function boutonCopier(texte, libelle) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'cv-copy'; b.textContent = 'Copier';
    b.setAttribute('aria-label', 'Copier ' + libelle);
    b.addEventListener('click', function () {
      copier(texte).then(function () {
        b.textContent = 'Copié'; b.classList.add('ok');
        setTimeout(function () { b.textContent = 'Copier'; b.classList.remove('ok'); }, 1600);
      }, function () { b.textContent = 'Échec'; setTimeout(function () { b.textContent = 'Copier'; }, 1600); });
    });
    return b;
  }

  function afficherErreur(zone, message) { zone.className = 'cv-msg err'; zone.textContent = message; zone.hidden = false; }
  function cacher(zone) { zone.hidden = true; zone.textContent = ''; }

  function resultats(conteneur, items) {
    conteneur.textContent = '';
    items.forEach(function (it) {
      var div = document.createElement('div'); div.className = 'cv-res-item';
      var txt = document.createElement('div'); txt.className = 'cv-res-text';
      var l = document.createElement('span'); l.className = 'cv-res-label'; l.textContent = it.label;
      var v = document.createElement('span'); v.className = 'cv-res-value'; v.textContent = it.valeur;
      txt.appendChild(l); txt.appendChild(v);
      div.appendChild(txt); div.appendChild(boutonCopier(it.copie != null ? it.copie : it.valeur, it.label));
      conteneur.appendChild(div);
    });
    if (items.length > 1) {
      var tout = boutonCopier(items.map(function (it) { return it.label + ' : ' + it.valeur; }).join('\n'), 'tous les résultats');
      tout.className += ' cv-copy-all'; tout.textContent = 'Copier tout';
      conteneur.appendChild(tout);
    }
  }

  // Boutons « Voir sur la carte » : ouvrent un site externe seulement si l'utilisateur clique.
  function ajouterCarte(conteneur, lat, lon) {
    var la = lat.toFixed(6), lo = lon.toFixed(6);
    var liens = [
      { t: 'Voir sur OpenStreetMap', u: 'https://www.openstreetmap.org/?mlat=' + la + '&mlon=' + lo + '#map=16/' + la + '/' + lo },
      { t: 'Voir sur Google Earth', u: 'https://earth.google.com/web/search/' + la + ',' + lo }
    ];
    var boite = document.createElement('div'); boite.className = 'cv-map';
    var ligne = document.createElement('div'); ligne.className = 'cv-map-btns';
    liens.forEach(function (x) {
      var a = document.createElement('a');
      a.className = 'btn btn-outline'; a.href = x.u; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = x.t;
      ligne.appendChild(a);
    });
    var note = document.createElement('small');
    note.textContent = 'Ces boutons ouvrent un autre site et lui transmettent la position de ce point.';
    boite.appendChild(ligne); boite.appendChild(note);
    conteneur.appendChild(boite);
  }

  function zoneChoisie(sel) { return sel.value === 'auto' ? 0 : parseInt(sel.value, 10); }

  // --- 1. GPS -> UTM ---
  var gMode = document.querySelectorAll('input[name="gmode"]');
  function majModeGps() {
    var dms = document.querySelector('input[name="gmode"]:checked').value === 'dms';
    $('g-dec').hidden = dms; $('g-dms').hidden = !dms;
    cacher($('g-msg')); $('g-res').textContent = '';
  }
  Array.prototype.forEach.call(gMode, function (r) { r.addEventListener('change', majModeGps); });
  majModeGps(); // le navigateur peut restaurer un choix après un rechargement

  $('g-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('g-msg'); cacher(msg); $('g-res').textContent = '';
    try {
      var lat, lon;
      if (document.querySelector('input[name="gmode"]:checked').value === 'dms') {
        lat = G.dmsVersDecimal($('g-lat-d').value, $('g-lat-m').value, $('g-lat-s').value, $('g-lat-h').value);
        lon = G.dmsVersDecimal($('g-lon-d').value, $('g-lon-m').value, $('g-lon-s').value, $('g-lon-h').value);
      } else {
        if ($('g-lat').value.trim() === '' || $('g-lon').value.trim() === '') throw new Error('Saisissez la latitude et la longitude.');
        lat = G.lireNombre($('g-lat').value); lon = G.lireNombre($('g-lon').value);
        if (isNaN(lat) || isNaN(lon)) throw new Error('Valeur invalide : saisissez des nombres, par exemple 5.3600 et -4.0083 (la virgule est acceptée).');
      }
      var u = G.gpsVersUtm(lat, lon, zoneChoisie($('g-zone')));
      var items = [
        { label: 'Est (m)', valeur: u.easting.toFixed(2) },
        { label: 'Nord (m)', valeur: u.northing.toFixed(2) },
        { label: 'Zone UTM', valeur: u.label + ' (' + u.epsg + ')', copie: u.label },
        { label: 'Hémisphère', valeur: 'Nord' }
      ];
      resultats($('g-res'), items);
      ajouterCarte($('g-res'), lat, lon);
      if (u.forcee) {
        msg.className = 'cv-msg info';
        msg.textContent = 'Vous avez forcé la zone ' + u.label + ' alors que ce point se trouve dans la zone ' + u.zoneAuto + 'N. Le résultat est correct mais plus déformé : utilisez la zone automatique sauf si votre projet impose l’autre.';
        msg.hidden = false;
      }
    } catch (err) { afficherErreur(msg, err.message); }
  });

  // --- 2. UTM -> GPS ---
  $('u-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('u-msg'); cacher(msg); $('u-res').textContent = '';
    try {
      if ($('u-est').value.trim() === '' || $('u-nord').value.trim() === '') throw new Error('Saisissez l’Est et le Nord.');
      var est = G.lireNombre($('u-est').value), nord = G.lireNombre($('u-nord').value);
      if (isNaN(est) || isNaN(nord)) throw new Error('Valeur invalide : l’Est et le Nord doivent être des nombres, par exemple 388283.08 et 592550.20.');
      var r = G.utmVersGps(est, nord, parseInt($('u-zone').value, 10));
      resultats($('u-res'), [
        { label: 'Latitude (degrés décimaux)', valeur: r.lat.toFixed(6) },
        { label: 'Longitude (degrés décimaux)', valeur: r.lon.toFixed(6) },
        { label: 'Latitude (DMS)', valeur: r.latDms },
        { label: 'Longitude (DMS)', valeur: r.lonDms },
        { label: 'Latitude, longitude', valeur: r.lat.toFixed(6) + ', ' + r.lon.toFixed(6) }
      ]);
      ajouterCarte($('u-res'), r.lat, r.lon);
    } catch (err) { afficherErreur(msg, err.message); }
  });

  // --- 3. Plusieurs points ---
  var dernier = null, dernierMode = 'gps';
  function majAideLot() {
    var gps = $('b-mode').value === 'gps';
    $('b-aide').textContent = gps
      ? 'Une ligne par point : latitude, longitude (séparées par une virgule, un point-virgule ou une tabulation). Exemple : 5.3600, -4.0083'
      : 'Une ligne par point : Est, Nord, zone (29N ou 30N). Exemple : 388283.08; 592550.20; 30N. La zone peut aussi être choisie dans la liste.';
    $('b-zone-label').textContent = gps ? 'Zone UTM de sortie' : 'Zone si absente de la ligne';
    $('b-txt').placeholder = gps ? '5.3600, -4.0083\n7.6906, -5.0303' : '388283.08; 592550.20; 30N\n276051.65; 850624.61; 30N';
  }
  $('b-mode').addEventListener('change', function () { majAideLot(); });
  majAideLot();

  $('b-go').addEventListener('click', function () {
    var msg = $('b-msg'); cacher(msg);
    $('b-out').textContent = ''; $('b-csv').disabled = true; $('b-copy-wrap').textContent = '';
    var texte = $('b-txt').value;
    if (texte.trim() === '') { afficherErreur(msg, 'Collez d’abord vos points, un par ligne.'); return; }
    var mode = $('b-mode').value;
    var z = zoneChoisie($('b-zone'));
    var res = G.convertirLot(texte, mode, z);
    dernier = res; dernierMode = mode;

    var cols = G.colonnes(mode);
    var table = document.createElement('table'); table.className = 'cv-table';
    var cap = document.createElement('caption'); cap.className = 'sr-only'; cap.style.cssText = 'position:absolute;left:-9999px'; cap.textContent = 'Résultats de la conversion';
    table.appendChild(cap);
    var thead = document.createElement('thead'), trh = document.createElement('tr');
    cols.forEach(function (c) { var th = document.createElement('th'); th.scope = 'col'; th.textContent = c; trh.appendChild(th); });
    thead.appendChild(trh); table.appendChild(thead);
    var tb = document.createElement('tbody');
    var nbOk = 0, nbErr = 0, tsv = [cols.join('\t')];
    res.lignes.forEach(function (r) {
      var tr = document.createElement('tr');
      var vals = G.valeursLigne(r, mode);
      vals.forEach(function (v, i) {
        var td = document.createElement('td'); td.textContent = v;
        if (!r.ok && i === vals.length - 1) td.className = 'err';
        tr.appendChild(td);
      });
      tb.appendChild(tr);
      if (r.ok) nbOk++; else nbErr++;
      tsv.push(vals.join('\t'));
    });
    table.appendChild(tb);
    $('b-out').appendChild(table);

    var resume = nbOk + ' point' + (nbOk > 1 ? 's' : '') + ' converti' + (nbOk > 1 ? 's' : '');
    if (nbErr) resume += ', ' + nbErr + ' ligne' + (nbErr > 1 ? 's' : '') + ' en erreur (voir la dernière colonne)';
    if (res.tronque) resume += '. Seules les ' + res.max + ' premières lignes ont été traitées.';
    msg.className = nbErr || res.tronque ? 'cv-msg info' : 'cv-msg info'; msg.textContent = resume + '.'; msg.hidden = false;
    if (!res.lignes.length) { afficherErreur(msg, 'Aucune ligne à convertir.'); return; }
    $('b-csv').disabled = nbOk === 0 && nbErr === 0;
    $('b-copy-wrap').appendChild(boutonCopier(tsv.join('\n'), 'le tableau'));
    $('b-copy-wrap').firstChild.textContent = 'Copier le tableau';
    $('b-copy-wrap').firstChild.addEventListener('click', function () {
      var b = this; setTimeout(function () { if (b.textContent === 'Copier') b.textContent = 'Copier le tableau'; }, 1700);
    });
  });

  $('b-csv').addEventListener('click', function () {
    if (!dernier) return;
    var blob = new Blob([G.versCsv(dernier, dernierMode)], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = dernierMode === 'gps' ? 'coordonnees-gps-vers-utm.csv' : 'coordonnees-utm-vers-gps.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });

  $('b-clear').addEventListener('click', function () {
    $('b-txt').value = ''; $('b-out').textContent = ''; $('b-copy-wrap').textContent = ''; cacher($('b-msg')); $('b-csv').disabled = true; dernier = null;
  });
})();
