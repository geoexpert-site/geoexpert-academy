/* Interface « Coordonnées vers KML / GeoJSON / CSV ». Tout reste dans le navigateur : rien n'est envoyé ni stocké. */
(function () {
  'use strict';
  var E = window.GeoExport, OC = window.OutilsCommun;
  var $ = function (id) { return document.getElementById(id); };
  var saisie = window.GeoSaisie.monter($('saisie'), {
    id: 'g', titre: 'Points (un par ligne, dans l’ordre)',
    exemple: { utm: '388000; 592000\n388100; 592000\n388100; 592100\n388000; 592100', gps: '5.3600, -4.0083\n5.3610, -4.0083\n5.3610, -4.0073' }
  });

  function geometrie() { return document.querySelector('input[name="geom"]:checked').value; }

  function preparer() {
    OC.cacher($('g-msg')); $('g-info').textContent = '';
    var res = E.preparer(saisie.texte(), saisie.mode(), saisie.zone(), geometrie());
    if (!res.ok) { OC.afficherErreur($('g-msg'), res.erreur); return null; }
    var nb = res.points.length;
    var info = $('g-info');
    var p = document.createElement('p'); p.className = 'cv-msg info';
    p.textContent = 'Prêt : ' + nb + ' point' + (nb > 1 ? 's' : '') + ' (' + (res.geometrie === 'points' ? 'points séparés' : res.geometrie === 'ligne' ? 'une ligne' : 'un polygone refermé automatiquement') + '), zone UTM ' + res.label + '. Fichiers en WGS84.';
    info.appendChild(p);
    res.avertissements.forEach(function (a) { var w = document.createElement('p'); w.className = 'cv-msg info'; w.textContent = a; info.appendChild(w); });
    return res;
  }

  function exporter(extension, type, fabriquer) {
    var res = preparer();
    if (!res) return;
    var objet = E.nettoyerNomObjet($('g-objet').value, 'Mon objet');
    var fichier = E.nettoyerNomFichier($('g-fichier').value, 'mes-points');
    OC.telecharger(fabriquer(res, objet), type, fichier + '.' + extension);
  }

  $('g-kml').addEventListener('click', function () { exporter('kml', 'application/vnd.google-earth.kml+xml;charset=utf-8', E.versKml); });
  $('g-json').addEventListener('click', function () { exporter('geojson', 'application/geo+json;charset=utf-8', E.versGeoJson); });
  $('g-csv').addEventListener('click', function () { exporter('csv', 'text/csv;charset=utf-8', function (res, objet) { return E.versCsv(res, objet, OC.celluleCsv); }); });

  $('g-exemple').addEventListener('click', function () {
    saisie.definir('utm', 30, '388000; 592000\n388100; 592000\n388100; 592100\n388000; 592100\n');
    document.querySelector('input[name="geom"][value="polygone"]').checked = true;
    $('g-fichier').value = 'ma-parcelle'; $('g-objet').value = 'Ma parcelle';
    preparer();
  });
  $('g-clear').addEventListener('click', function () { saisie.vider(); OC.cacher($('g-msg')); $('g-info').textContent = ''; });
  saisie.surChangement(function () { OC.cacher($('g-msg')); $('g-info').textContent = ''; });
})();
