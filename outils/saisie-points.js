/* Bloc de saisie de points partagé par les outils (coordonnées vers KML, distance, visualiseur) :
   choix UTM / GPS, zone, liste collée (un point par ligne) et ajout point par point.
   Même logique que le calculateur de surface. Tout reste dans le navigateur. */
(function (root) {
  'use strict';
  var C = root.GeoConv;

  // conteneur : élément vide. opts : { id (préfixe unique), aide : { utm, gps }, exemple : { utm, gps } (placeholders) }
  function monter(conteneur, opts) {
    var id = opts.id || 'pt';
    conteneur.innerHTML =
      '<div class="cv-mode" role="radiogroup" aria-label="Type de coordonnées">' +
        '<label><input type="radio" name="' + id + '-mode" value="utm" checked> Coordonnées UTM (Est, Nord)</label>' +
        '<label><input type="radio" name="' + id + '-mode" value="gps"> Coordonnées GPS (latitude, longitude)</label>' +
      '</div>' +
      '<div class="cv-field" style="margin-bottom:14px">' +
        '<label for="' + id + '-zone" id="' + id + '-zone-label">Zone UTM</label>' +
        '<select id="' + id + '-zone"></select>' +
        '<small>La Côte d’Ivoire est à cheval sur les zones 29N (à l’ouest de 6° O) et 30N.</small>' +
      '</div>' +
      '<div class="cv-field">' +
        '<label for="' + id + '-txt">' + (opts.titre || 'Points (un par ligne)') + '</label>' +
        '<textarea id="' + id + '-txt" spellcheck="false" autocomplete="off" autocapitalize="off" aria-describedby="' + id + '-aide"></textarea>' +
        '<small id="' + id + '-aide"></small>' +
      '</div>' +
      (opts.importer === false ? '' :
      '<div class="cv-field cv-import" style="margin-bottom:14px">' +
        '<label for="' + id + '-file">Importer un fichier de points</label>' +
        '<input type="file" id="' + id + '-file" multiple accept=".csv,.txt,.tsv,.gpx,.kml,.geojson,.json">' +
        '<small>Fichiers CSV, TXT, GPX, KML ou GeoJSON, un ou plusieurs à la fois (5 Mo maximum chacun). Le fichier est lu dans votre navigateur et n’est envoyé nulle part. Les points importés remplacent la liste ci-dessus.</small>' +
        '<div id="' + id + '-import-msg" class="cv-msg info" role="status" hidden></div>' +
      '</div>') +
      '<div class="sf-add">' +
        '<span class="cv-label">Ou ajoutez les points un par un</span>' +
        '<div class="cv-row2">' +
          '<div class="cv-field"><label for="' + id + '-a" id="' + id + '-lab-a">Est (mètres)</label><input type="text" id="' + id + '-a" inputmode="decimal" autocomplete="off"></div>' +
          '<div class="cv-field"><label for="' + id + '-b" id="' + id + '-lab-b">Nord (mètres)</label><input type="text" id="' + id + '-b" inputmode="decimal" autocomplete="off"></div>' +
        '</div>' +
        '<button type="button" class="btn btn-outline" id="' + id + '-add">Ajouter le point</button>' +
        '<div id="' + id + '-add-msg" class="cv-msg err" role="alert" hidden></div>' +
      '</div>';

    var $ = function (s) { return document.getElementById(id + '-' + s); };
    var ecouteurs = [];
    function modeActuel() { return conteneur.querySelector('input[name="' + id + '-mode"]:checked').value; }

    function majMode() {
      var utm = modeActuel() === 'utm', sel = $('zone');
      sel.textContent = '';
      (utm ? [['30', '30N (EPSG:32630)'], ['29', '29N (EPSG:32629)']] : [['0', 'Automatique (selon la longitude)'], ['29', 'Forcer la zone 29N'], ['30', 'Forcer la zone 30N']]).forEach(function (o) {
        var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; sel.appendChild(op);
      });
      $('zone-label').textContent = utm ? 'Zone UTM (si elle n’est pas écrite sur la ligne)' : 'Zone UTM';
      $('lab-a').textContent = utm ? 'Est (mètres)' : 'Latitude';
      $('lab-b').textContent = utm ? 'Nord (mètres)' : 'Longitude';
      $('a').placeholder = utm ? '388000' : '5.3600';
      $('b').placeholder = utm ? '592000' : '-4.0083';
      var a = opts.aide || {};
      $('aide').textContent = utm
        ? (a.utm || 'Un point par ligne : Est, Nord (et la zone si besoin), séparés par une virgule, un point-virgule, une tabulation ou un espace. Exemple : 388000; 592000')
        : (a.gps || 'Un point par ligne : latitude, longitude en degrés décimaux. Exemple : 5.3600, -4.0083');
      var ex = opts.exemple || {};
      $('txt').placeholder = utm ? (ex.utm || '388000; 592000\n388100; 592000') : (ex.gps || '5.3600, -4.0083\n5.3610, -4.0083');
      ecouteurs.forEach(function (f) { f('mode'); });
    }
    Array.prototype.forEach.call(conteneur.querySelectorAll('input[name="' + id + '-mode"]'), function (r) { r.addEventListener('change', majMode); });
    $('zone').addEventListener('change', function () { ecouteurs.forEach(function (f) { f('zone'); }); });
    $('txt').addEventListener('input', function () { ecouteurs.forEach(function (f) { f('texte'); }); });

    function ajouter() {
      var msg = $('add-msg'); msg.hidden = true;
      var a = C.lireNombre($('a').value), b = C.lireNombre($('b').value);
      if ($('a').value.trim() === '' || $('b').value.trim() === '' || isNaN(a) || isNaN(b)) {
        msg.textContent = 'Valeur invalide : ' + (modeActuel() === 'utm' ? 'l’Est et le Nord' : 'la latitude et la longitude') + ' doivent être des nombres.';
        msg.hidden = false; return;
      }
      var t = $('txt'), ligne = $('a').value.trim().replace(',', '.') + '; ' + $('b').value.trim().replace(',', '.');
      t.value = (t.value.trim() === '' ? '' : t.value.replace(/\s+$/, '') + '\n') + ligne + '\n';
      $('a').value = ''; $('b').value = ''; $('a').focus();
      ecouteurs.forEach(function (f) { f('texte'); });
    }
    $('add').addEventListener('click', ajouter);
    ['a', 'b'].forEach(function (k) { $(k).addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); ajouter(); } }); });

    // --- Import de fichiers (lus localement) ---
    function lireTexte(f) {
      return new Promise(function (ok, ko) {
        var fr = new FileReader();
        fr.onload = function () { ok(String(fr.result)); };
        fr.onerror = function () { ko(new Error('lecture impossible')); };
        fr.readAsText(f);
      });
    }
    function meilleureZone(pts) { // zone 29N ou 30N où le plus de points tombent en Côte d'Ivoire
      var best = 30, max = -1;
      [29, 30].forEach(function (zz) {
        var n = 0;
        pts.forEach(function (p) { try { C.utmVersGps(p.est, p.nord, { z: zz, h: 'N' }, false); n++; } catch (e) {} });
        if (n > max) { max = n; best = zz; }
      });
      return { zone: best, n: max };
    }
    function importer(input) {
      var GI = root.GeoImport, msg = $('import-msg'), fichiers = Array.prototype.slice.call(input.files || []);
      msg.hidden = true;
      if (!fichiers.length) return;
      if (!GI) { msg.className = 'cv-msg err'; msg.textContent = 'L’import de fichiers n’est pas disponible. Rechargez la page.'; msg.hidden = false; return; }
      Promise.all(fichiers.map(function (f) {
        if (f.size > GI.MAX_OCTETS) return Promise.resolve({ nom: f.name, erreur: 'fichier trop gros (5 Mo maximum)' });
        return lireTexte(f).then(function (t) { var r = GI.lireSommets(f.name, t); r.nom = f.name; return r; }, function () { return { nom: f.name, erreur: 'lecture impossible' }; });
      })).then(function (res) {
        var gps = [], utm = [], erreurs = [], ignorees = 0, approx = false;
        res.forEach(function (r) {
          if (r.erreur) { erreurs.push(r.nom + ' : ' + r.erreur); return; }
          if (!r.points.length) { erreurs.push(r.nom + ' : aucun point trouvé'); return; }
          ignorees += r.ignorees || 0; if (r.approx) approx = true;
          (r.mode === 'gps' ? gps : utm).push.apply(r.mode === 'gps' ? gps : utm, r.points);
        });
        var mode = gps.length >= utm.length ? 'gps' : 'utm', pts = mode === 'gps' ? gps : utm;
        if (!pts.length) { msg.className = 'cv-msg err'; msg.textContent = 'Aucun point importé. ' + erreurs.join(' ; '); msg.hidden = false; input.value = ''; return; }
        var info = pts.length + ' point' + (pts.length > 1 ? 's' : '') + ' importé' + (pts.length > 1 ? 's' : '') + ' (' + (mode === 'gps' ? 'GPS' : 'UTM') + ').';
        if (gps.length && utm.length) info += ' Vos fichiers mélangent GPS et UTM : seuls les points ' + (mode === 'gps' ? 'GPS' : 'UTM') + ' ont été gardés, importez les autres séparément.';
        if (ignorees) info += ' ' + ignorees + ' ligne' + (ignorees > 1 ? 's' : '') + ' ignorée' + (ignorees > 1 ? 's' : '') + ' (valeurs non numériques).';
        var zone = null;
        if (mode === 'utm' && pts.some(function (p) { return !p.zone; })) {
          var mz = meilleureZone(pts.filter(function (p) { return !p.zone; }));
          zone = mz.zone;
          info += ' Le fichier n’indique pas la zone UTM : la zone ' + zone + 'N a été choisie automatiquement. Changez-la dans la liste si besoin.';
        }
        if (approx) info += ' Pour les lignes et polygones, le point utilisé est le centre approché de la forme.';
        if (erreurs.length) info += ' Problème : ' + erreurs.join(' ; ') + '.';
        saisie.definir(mode, zone, GI.versTexte(mode, pts));
        msg.className = 'cv-msg info'; msg.textContent = info; msg.hidden = false;
        input.value = '';
        ecouteurs.forEach(function (f) { f('texte'); });
        if (opts.apresImport) opts.apresImport();
      });
    }
    if (opts.importer !== false) $('file').addEventListener('change', function () { importer(this); });

    var saisie;
    majMode();
    return saisie = {
      mode: modeActuel,
      zone: function () { return parseInt($('zone').value, 10) || 0; },
      texte: function () { return $('txt').value; },
      definir: function (mode, zone, texte) {
        conteneur.querySelector('input[name="' + id + '-mode"][value="' + mode + '"]').checked = true;
        majMode();
        if (zone != null) $('zone').value = String(zone);
        $('txt').value = texte || '';
      },
      vider: function () { $('txt').value = ''; $('add-msg').hidden = true; },
      surChangement: function (f) { ecouteurs.push(f); }
    };
  }

  root.GeoSaisie = { monter: monter };
})(window);
