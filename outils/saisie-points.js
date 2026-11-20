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

    majMode();
    return {
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
