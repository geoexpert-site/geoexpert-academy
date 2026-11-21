/* Interface « Distance et gisement entre deux points ». Tout reste dans le navigateur : rien n'est envoyé ni stocké. */
(function () {
  'use strict';
  var D = window.GeoDistance, OC = window.OutilsCommun;
  var $ = function (id) { return document.getElementById(id); };
  var dernier = null;
  var saisie = window.GeoSaisie.monter($('saisie'), {
    id: 'd', titre: 'Points (2 points, ou plus pour un cheminement)',
    aide: {
      utm: 'Un point par ligne : Est, Nord (et la zone si besoin). Avec plus de 2 points, l’outil calcule chaque segment et la distance totale. Exemple : 388000; 592000',
      gps: 'Un point par ligne : latitude, longitude en degrés décimaux. Avec plus de 2 points, l’outil calcule chaque segment et la distance totale. Exemple : 5.3600, -4.0083'
    },
    exemple: { utm: '388000; 592000\n388300; 592400', gps: '5.3600, -4.0083\n6.8276, -5.2893' }
  });

  function item(label, valeur, copie) {
    var div = document.createElement('div'); div.className = 'cv-res-item';
    var txt = document.createElement('div'); txt.className = 'cv-res-text';
    var l = document.createElement('span'); l.className = 'cv-res-label'; l.textContent = label;
    var v = document.createElement('span'); v.className = 'cv-res-value'; v.textContent = valeur;
    txt.appendChild(l); txt.appendChild(v); div.appendChild(txt); div.appendChild(OC.boutonCopier(copie, label));
    return div;
  }
  function plat(n, d) { return n.toFixed(d).replace('.', ','); }

  function effacer() {
    OC.cacher($('d-msg')); $('d-warn').textContent = ''; $('d-res').textContent = ''; $('d-table').textContent = ''; $('d-actions').hidden = true; $('d-methode').hidden = true; dernier = null;
  }

  function calculer() {
    effacer();
    var r = D.calculer(saisie.texte(), saisie.mode(), saisie.zone());
    if (!r.ok) { OC.afficherErreur($('d-msg'), r.erreur); return; }
    dernier = r;
    r.avertissements.forEach(function (a) { var w = document.createElement('p'); w.className = 'cv-msg info'; w.textContent = a; $('d-warn').appendChild(w); });
    var res = $('d-res'), s = r.segments;
    if (s.length === 1) {
      var g = s[0];
      res.appendChild(item('Distance', D.fr(g.distance, 2) + ' m', plat(g.distance, 2)));
      res.appendChild(item('Distance en kilomètres', D.fr(g.distance / 1000, 4) + ' km', plat(g.distance / 1000, 4)));
      res.appendChild(item('Azimut du point 1 vers le point 2 (depuis le Nord, sens horaire)', D.texteDegres(g.azimut), g.azimut === null ? '' : plat(g.azimut, 4)));
      res.appendChild(item('Gisement en grades (gon)', D.texteGon(g.gon), g.gon === null ? '' : plat(g.gon, 4)));
      res.appendChild(item('Azimut inverse (du point 2 vers le point 1)', D.texteDegres(g.azimutInverse), g.azimutInverse === null ? '' : plat(g.azimutInverse, 4)));
      res.appendChild(item('Gisement inverse en grades (gon)', D.texteGon(g.gonInverse), g.gonInverse === null ? '' : plat(g.gonInverse, 4)));
    } else {
      res.appendChild(item('Distance totale du cheminement (' + s.length + ' segments)', D.fr(r.total, 2) + ' m (' + D.fr(r.total / 1000, 4) + ' km)', plat(r.total, 2)));
      var tab = document.createElement('table'); tab.className = 'cv-table';
      var th = document.createElement('thead'), tr = document.createElement('tr');
      ['Segment', 'Distance (m)', 'Azimut (°)', 'Gisement (gon)', 'Azimut inverse (°)'].forEach(function (h) { var c = document.createElement('th'); c.textContent = h; tr.appendChild(c); });
      th.appendChild(tr); tab.appendChild(th);
      var tb = document.createElement('tbody');
      s.forEach(function (g) {
        var l = document.createElement('tr');
        [g.de + ' → ' + g.vers, D.fr(g.distance, 2), g.azimut === null ? '—' : D.fr(g.azimut, 4), g.gon === null ? '—' : D.fr(g.gon, 4), g.azimutInverse === null ? '—' : D.fr(g.azimutInverse, 4)].forEach(function (v) { var c = document.createElement('td'); c.textContent = v; l.appendChild(c); });
        tb.appendChild(l);
      });
      tab.appendChild(tb); $('d-table').appendChild(tab);
    }
    $('d-methode').textContent = r.mode === 'gps'
      ? 'Points en GPS : la distance est calculée sur l’ellipsoïde WGS84 (le plus court chemin à la surface de la Terre, méthode de Vincenty), pas à plat ; l’azimut est compté depuis le Nord géographique.'
      : 'Points en UTM : la distance est calculée à plat, sur le plan UTM (théorème de Pythagore) ; l’azimut est compté depuis le Nord du quadrillage UTM.';
    $('d-methode').hidden = false;
    $('d-actions').hidden = false;
  }

  $('d-calc').addEventListener('click', calculer);
  $('d-exemple').addEventListener('click', function () {
    saisie.definir('utm', 30, '388000; 592000\n388300; 592400\n');
    calculer();
  });
  $('d-clear').addEventListener('click', function () { saisie.vider(); effacer(); });
  saisie.surChangement(function (quoi) { if (quoi === 'mode') effacer(); });
  $('d-copy-wrap').appendChild(OC.boutonCopier(function () { return dernier ? D.resumeTexte(dernier) : ''; }, 'le résultat', 'Copier le résultat'));
  $('d-csv').addEventListener('click', function () { if (dernier) OC.telecharger(D.versCsv(dernier, OC.celluleCsv), 'text/csv;charset=utf-8', 'distance-gisement.csv'); });
})();
