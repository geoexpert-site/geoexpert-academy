/* Interface du convertisseur. Tout reste dans le navigateur : aucun stockage.
   Aucune requête vers un autre site n'est faite avant un clic explicite de l'utilisateur
   (boutons « Voir sur… » et « Afficher sur la carte »). */
(function () {
  'use strict';
  var G = window.GeoConv;
  var $ = function (id) { return document.getElementById(id); };

  function monde() { return $('region').value === 'monde'; }

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

  // --- Lecture des zones selon le mode ---
  var RE_ZONE = /^\s*(\d{1,2})\s*([NSns])?\s*$/;
  var MSG_ZONE_MONDE = 'Zone invalide : écrivez un numéro de 1 à 60, suivi de N ou S (par exemple 31N ou 35S).';

  // Zone forcée pour GPS -> UTM : null = automatique. Le N/S peut être omis en mode monde.
  function zoneForcee(selId, txtId) {
    if (!monde()) { var v = $(selId).value; return v === 'auto' ? null : { z: parseInt(v, 10), h: 'N' }; }
    var t = $(txtId).value.trim();
    if (t === '') return null;
    var m = RE_ZONE.exec(t);
    var z = m ? parseInt(m[1], 10) : 0;
    if (!m || z < 1 || z > 60) throw new Error(MSG_ZONE_MONDE);
    return { z: z, h: m[2] ? m[2].toUpperCase() : null };
  }
  // Zone pour UTM -> GPS : obligatoire (ou facultative si `facultative`), avec N/S en mode monde.
  function zoneUtm(selId, txtId, facultative) {
    if (!monde()) { var v = $(selId).value; return { z: parseInt(v, 10), h: 'N' }; }
    var t = $(txtId).value.trim();
    if (t === '' && facultative) return null;
    var z = G.lireZone(t, true);
    if (!z) throw new Error(MSG_ZONE_MONDE);
    return z;
  }

  // --- Mode (Côte d'Ivoire / monde) ---
  function majRegion() {
    var m = monde();
    [['g-zone', 'g-zone-w'], ['u-zone', 'u-zone-w'], ['b-zone', 'b-zone-w']].forEach(function (p) {
      $(p[0]).hidden = m; $(p[1]).hidden = !m;
    });
    $('g-lat-aide').textContent = m ? 'Positive au nord de l’équateur, négative au sud (entre -80 et 84).' : 'Positive au nord de l’équateur (Côte d’Ivoire : entre 4 et 11).';
    $('g-lon-aide').textContent = m ? 'Négative à l’ouest de Greenwich, positive à l’est.' : 'Négative à l’ouest de Greenwich (Côte d’Ivoire : entre -9 et -2).';
    $('g-zone-aide').textContent = m
      ? 'Laissez vide pour que la zone soit trouvée selon la longitude (sans les exceptions de la Norvège et du Svalbard). Vous pouvez la forcer, par exemple 31N.'
      : 'La Côte d’Ivoire est à cheval sur les zones 29N (à l’ouest de 6° O) et 30N.';
    $('g-lon-h').value = m ? $('g-lon-h').value : 'O';
    ['g-msg', 'u-msg', 'b-msg'].forEach(function (id) { cacher($(id)); });
    $('g-res').textContent = ''; $('u-res').textContent = ''; effacerLot();
    majAideLot();
  }
  $('region').addEventListener('change', majRegion);

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
      var u = G.gpsVersUtm(lat, lon, zoneForcee('g-zone', 'g-zone-w'), monde());
      resultats($('g-res'), [
        { label: 'Est (m)', valeur: u.easting.toFixed(2) },
        { label: 'Nord (m)', valeur: u.northing.toFixed(2) },
        { label: 'Zone UTM', valeur: u.label + ' (' + u.epsg + ')', copie: u.label },
        { label: 'Hémisphère', valeur: u.hemisphere === 'N' ? 'Nord' : 'Sud' }
      ]);
      ajouterCarte($('g-res'), lat, lon);
      if (u.forcee) {
        msg.className = 'cv-msg info';
        msg.textContent = 'Vous avez forcé la zone ' + u.label + ' alors que ce point se trouve dans la zone ' + u.zoneAuto + u.hemisphere + '. Le résultat est correct mais plus déformé : utilisez la zone automatique sauf si votre projet impose l’autre.';
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
      var r = G.utmVersGps(est, nord, zoneUtm('u-zone', 'u-zone-w', false), monde());
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
  var dernier = null, dernierMode = 'gps', carte = null;

  function majAideLot() {
    var gps = $('b-mode').value === 'gps', m = monde();
    $('b-aide').textContent = gps
      ? 'Une ligne par point : latitude, longitude (séparées par une virgule, un point-virgule ou une tabulation). Exemple : 5.3600, -4.0083'
      : 'Une ligne par point : Est, Nord, zone (' + (m ? '31N, 35S…' : '29N ou 30N') + '). Exemple : 388283.08; 592550.20; ' + (m ? '31N' : '30N') + '. La zone peut aussi être indiquée dans le champ au-dessus.';
    $('b-zone-label').textContent = gps ? (m ? 'Zone UTM de sortie (vide = automatique)' : 'Zone UTM de sortie') : 'Zone si absente de la ligne';
    $('b-txt').placeholder = gps ? '5.3600, -4.0083\n7.6906, -5.0303' : (m ? '452482.53; 5411717.18; 31N' : '388283.08; 592550.20; 30N\n276051.65; 850624.61; 30N');
    $('b-zone-w').placeholder = gps ? 'Vide = automatique (par exemple 31N)' : 'Par exemple 31N';
  }
  $('b-mode').addEventListener('change', majAideLot);

  function effacerLot() {
    $('b-out').textContent = ''; $('b-copy-wrap').textContent = ''; cacher($('b-msg'));
    ['b-csv', 'b-kml', 'b-map'].forEach(function (id) { $(id).disabled = true; });
    $('b-extra').hidden = true; $('b-mapbox').hidden = true;
    if (carte) { carte.remove(); carte = null; }
    dernier = null;
  }

  $('b-go').addEventListener('click', function () {
    var msg = $('b-msg'); effacerLot();
    var texte = $('b-txt').value;
    if (texte.trim() === '') { afficherErreur(msg, 'Collez d’abord vos points, un par ligne.'); return; }
    var mode = $('b-mode').value, res;
    try {
      var z = mode === 'gps' ? zoneForcee('b-zone', 'b-zone-w') : zoneUtm('b-zone', 'b-zone-w', true);
      if (!monde() && mode === 'utm') { z = $('b-zone').value === 'auto' ? null : { z: parseInt($('b-zone').value, 10), h: 'N' }; }
      res = G.convertirLot(texte, mode, z, monde());
    } catch (err) { afficherErreur(msg, err.message); return; }
    dernier = res; dernierMode = mode;
    if (!res.lignes.length) { afficherErreur(msg, 'Aucune ligne à convertir.'); return; }

    var cols = G.colonnes(mode);
    var table = document.createElement('table'); table.className = 'cv-table';
    var cap = document.createElement('caption'); cap.style.cssText = 'position:absolute;left:-9999px'; cap.textContent = 'Résultats de la conversion';
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
    if (res.tronque) resume += '. Seules les ' + res.max + ' premières lignes ont été traitées';
    msg.className = 'cv-msg info'; msg.textContent = resume + '.'; msg.hidden = false;

    $('b-csv').disabled = false;
    $('b-kml').disabled = nbOk === 0; $('b-map').disabled = nbOk === 0; $('b-extra').hidden = nbOk === 0;
    var bc = boutonCopier(tsv.join('\n'), 'le tableau');
    bc.textContent = 'Copier le tableau';
    bc.addEventListener('click', function () { setTimeout(function () { if (bc.textContent === 'Copier') bc.textContent = 'Copier le tableau'; }, 1700); });
    $('b-copy-wrap').appendChild(bc);
  });

  function telecharger(contenu, type, nom) {
    var blob = new Blob([contenu], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = nom;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  $('b-csv').addEventListener('click', function () {
    if (!dernier) return;
    telecharger(G.versCsv(dernier, dernierMode), 'text/csv;charset=utf-8', dernierMode === 'gps' ? 'coordonnees-gps-vers-utm.csv' : 'coordonnees-utm-vers-gps.csv');
  });
  $('b-kml').addEventListener('click', function () {
    if (!dernier) return;
    telecharger(G.versKml(dernier), 'application/vnd.google-earth.kml+xml;charset=utf-8', 'points-convertis.kml');
  });

  // Carte : Leaflet (copie locale) chargé seulement au clic ; le fond de carte vient d'OpenStreetMap.
  function chargerLeaflet(suite, echec) {
    if (window.L) { suite(); return; }
    var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'leaflet/leaflet.css'; document.head.appendChild(css);
    var js = document.createElement('script'); js.src = 'leaflet/leaflet.js'; js.onload = suite; js.onerror = echec;
    document.head.appendChild(js);
  }
  $('b-map').addEventListener('click', function () {
    if (!dernier) return;
    var pts = dernier.lignes.filter(function (r) { return r.ok; });
    if (!pts.length) return;
    var btn = this; btn.disabled = true;
    chargerLeaflet(function () {
      btn.disabled = false;
      var L = window.L, box = $('b-mapbox');
      box.hidden = false;
      if (carte) { carte.remove(); carte = null; }
      carte = L.map(box, { scrollWheelZoom: false });
      var plan = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
      });
      // Vue satellite : images Esri World Imagery (chargées seulement si l'utilisateur choisit « Satellite »)
      var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, maxNativeZoom: 18,
        attribution: 'Tiles &copy; Esri &mdash; Source : Esri, Maxar, Earthstar Geographics et la communauté GIS'
      });
      plan.addTo(carte);
      L.control.layers({ 'Plan (OpenStreetMap)': plan, 'Satellite (Esri)': satellite }, null, { collapsed: false }).addTo(carte);
      var coins = [];
      pts.forEach(function (r) {
        var p = document.createElement('div'); p.textContent = G.descriptionPoint(r);
        L.marker([r.lat, r.lon]).addTo(carte).bindPopup(p);
        coins.push([r.lat, r.lon]);
      });
      if (coins.length === 1) carte.setView(coins[0], 15); else carte.fitBounds(coins, { padding: [30, 30], maxZoom: 16 });
      carte.invalidateSize();
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, function () {
      btn.disabled = false;
      afficherErreur($('b-msg'), 'La carte n’a pas pu être chargée. Vérifiez votre connexion, ou téléchargez le fichier KML.');
    });
  });

  $('b-clear').addEventListener('click', function () { $('b-txt').value = ''; effacerLot(); });

  // --- Importer des points (fichiers lus localement) ---
  function lireTexte(fichier) {
    return new Promise(function (ok, ko) {
      var fr = new FileReader();
      fr.onload = function () { ok(String(fr.result)); };
      fr.onerror = function () { ko(new Error('lecture impossible')); };
      fr.readAsText(fichier);
    });
  }
  $('b-file').addEventListener('change', function () {
    var input = this, fichiers = Array.prototype.slice.call(input.files || []);
    var msg = $('b-import-msg'); cacher(msg);
    if (!fichiers.length) return;
    var GI = window.GeoImport;
    Promise.all(fichiers.map(function (f) {
      if (f.size > GI.MAX_OCTETS) return Promise.resolve({ nom: f.name, erreur: 'fichier trop gros (5 Mo maximum)' });
      return lireTexte(f).then(function (t) { var r = GI.lireFichier(f.name, t); r.nom = f.name; return r; },
        function () { return { nom: f.name, erreur: 'lecture impossible' }; });
    })).then(function (res) {
      var gps = [], utm = [], erreurs = [], ignorees = 0, nbFichiers = 0, approx = false;
      res.forEach(function (r) {
        if (r.erreur) { erreurs.push(r.nom + ' : ' + r.erreur); return; }
        if (!r.points.length) { erreurs.push(r.nom + ' : aucun point trouvé'); return; }
        nbFichiers++; ignorees += r.ignorees || 0; if (r.approx) approx = true;
        (r.mode === 'gps' ? gps : utm).push.apply(r.mode === 'gps' ? gps : utm, r.points);
      });
      var mode = gps.length >= utm.length ? 'gps' : 'utm', pts = mode === 'gps' ? gps : utm;
      var texte = [];
      if (!pts.length) {
        msg.className = 'cv-msg err'; msg.textContent = 'Aucun point importé. ' + erreurs.join(' ; '); msg.hidden = false; input.value = ''; return;
      }
      var info = pts.length + ' point' + (pts.length > 1 ? 's' : '') + ' importé' + (pts.length > 1 ? 's' : '') + ' (' + (mode === 'gps' ? 'GPS' : 'UTM') + ').';
      if (gps.length && utm.length) info += ' Vos fichiers mélangent GPS et UTM : seuls les points ' + (mode === 'gps' ? 'GPS' : 'UTM') + ' ont été gardés, importez les autres séparément.';
      if (ignorees) info += ' ' + ignorees + ' ligne' + (ignorees > 1 ? 's' : '') + ' ignorée' + (ignorees > 1 ? 's' : '') + ' (valeurs non numériques).';
      if (mode === 'utm' && pts.some(function (p) { return !p.zone; })) {
        if (!monde()) {
          // Zone absente du fichier : on prend celle (29N ou 30N) où le plus de points tombent en Côte d'Ivoire.
          var meilleure = 30, max = -1;
          [29, 30].forEach(function (zz) {
            var n = 0;
            pts.forEach(function (p) { if (!p.zone) { try { G.utmVersGps(p.est, p.nord, { z: zz, h: 'N' }, false); n++; } catch (e) {} } });
            if (n > max) { max = n; meilleure = zz; }
          });
          $('b-zone').value = String(meilleure);
          info += ' Le fichier n’indique pas la zone UTM : la zone ' + meilleure + 'N a été choisie automatiquement (' + max + ' point' + (max > 1 ? 's' : '') + ' tombent en Côte d’Ivoire). Changez-la dans la liste « Zone si absente de la ligne » si besoin.';
        } else {
          info += ' Le fichier n’indique pas la zone UTM : renseignez-la dans le champ « Zone si absente de la ligne » (par exemple 31N), puis cliquez sur « Convertir la liste ».';
        }
      }
      if (approx) info += ' Pour les lignes et polygones, le point utilisé est le centre approché de la forme.';
      if (erreurs.length) info += ' Problème : ' + erreurs.join(' ; ') + '.';
      $('b-mode').value = mode; majAideLot();
      $('b-txt').value = GI.versTexte(mode, pts);
      msg.className = 'cv-msg info'; msg.textContent = info; msg.hidden = false;
      input.value = '';
      $('b-go').click();
    });
  });

  majAideLot();
  majRegion();
})();
