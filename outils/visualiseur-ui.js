/* Visualiseur de coordonnées sur une carte : Leaflet (copie locale) + fond de carte OpenStreetMap.
   Les coordonnées ne sont jamais envoyées. Seules les tuiles de fond de carte sont demandées au serveur OpenStreetMap
   (qui voit donc la zone consultée). Le fond de carte n'est demandé qu'au moment d'afficher les points.
   Politique d'usage des tuiles OSM : attribution affichée, pas de téléchargement en masse, en-tête Referer d'origine conservé. */
(function () {
  'use strict';
  var P = window.GeoPoints, OC = window.OutilsCommun, L = window.L;
  var $ = function (id) { return document.getElementById(id); };
  var MAX_POINTS = 500;
  var saisie = window.GeoSaisie.monter($('saisie'), {
    id: 'v', titre: 'Points (un par ligne)',
    exemple: { utm: '388000; 592000\n388100; 592000\n388100; 592100\n388000; 592100', gps: '5.3600, -4.0083\n7.6906, -5.0300' }
  });
  var carte = null, calques = null, etat = { marqueurs: [], erreursTuiles: 0, tuilesChargees: 0 };

  function relier() { return document.querySelector('input[name="relier"]:checked').value; }

  function popup(q, label) {
    var d = document.createElement('div');
    var t = document.createElement('strong'); t.textContent = 'Point ' + q.num; d.appendChild(t);
    [['Latitude', q.lat.toFixed(6)], ['Longitude', q.lon.toFixed(6)], ['Est (UTM ' + label + ')', q.x.toFixed(2) + ' m'], ['Nord (UTM ' + label + ')', q.y.toFixed(2) + ' m']].forEach(function (l) {
      d.appendChild(document.createElement('br')); d.appendChild(document.createTextNode(l[0] + ' : ' + l[1]));
    });
    return d;
  }

  function messageFond(texte) {
    var m = $('v-fond'); if (!texte) { m.hidden = true; m.textContent = ''; return; }
    m.className = 'cv-msg info'; m.textContent = texte; m.hidden = false;
  }

  function creerCarte() {
    var boite = $('v-carte');
    boite.hidden = false;
    carte = L.map(boite, { scrollWheelZoom: false, worldCopyJump: false, minZoom: 3 });
    var fond = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    });
    fond.on('tileload', function () { etat.tuilesChargees++; messageFond(''); });
    fond.on('tileerror', function () { etat.erreursTuiles++; });
    fond.on('load', function () { // toutes les tuiles visibles sont terminées (chargées ou en erreur)
      if (etat.tuilesChargees === 0 && etat.erreursTuiles > 0) {
        messageFond('Le fond de carte n’a pas pu être chargé (pas de connexion, ou serveur OpenStreetMap indisponible). Vos points restent affichés sur fond vide : leur position est correcte. Réessayez avec une connexion.');
      }
    });
    fond.addTo(carte);
    calques = L.layerGroup().addTo(carte);
    // La molette ne zoome qu'après un clic sur la carte : évite de bloquer le défilement de la page.
    carte.on('click', function () { carte.scrollWheelZoom.enable(); });
    carte.on('mouseout', function () { carte.scrollWheelZoom.disable(); });
  }

  function afficher() {
    OC.cacher($('v-msg')); $('v-warn').textContent = ''; messageFond('');
    var lec = P.lire(saisie.texte(), saisie.mode(), saisie.zone(), { max: MAX_POINTS, messageVide: 'Saisissez au moins un point : un par ligne.' });
    if (!lec.ok) { OC.afficherErreur($('v-msg'), lec.erreur); return; }
    var pts = lec.points, geo = relier(), label = lec.zone + 'N';
    if (geo === 'ligne' && pts.length < 2) { OC.afficherErreur($('v-msg'), 'Pour relier les points par une ligne, il faut au moins 2 points.'); return; }
    if (geo === 'polygone' && pts.length < 3) { OC.afficherErreur($('v-msg'), 'Pour relier les points par un polygone, il faut au moins 3 points.'); return; }
    if (!window.L) { OC.afficherErreur($('v-msg'), 'La bibliothèque de carte n’a pas pu être chargée. Rechargez la page.'); return; }
    L = window.L;
    lec.avertissements.forEach(function (a) { var w = document.createElement('p'); w.className = 'cv-msg info'; w.textContent = a; $('v-warn').appendChild(w); });

    if (!carte) creerCarte();
    etat.erreursTuiles = 0; etat.tuilesChargees = 0; etat.marqueurs = [];
    calques.clearLayers();
    var coins = [];
    pts.forEach(function (q, k) {
      q.num = k + 1;
      var icone = L.divIcon({ className: 'sig-marqueur', html: String(q.num), iconSize: [28, 28] });
      var m = L.marker([q.lat, q.lon], { icon: icone, title: 'Point ' + q.num, alt: 'Point ' + q.num, keyboard: true }).bindPopup(popup(q, label));
      m.addTo(calques); etat.marqueurs.push(m);
      coins.push([q.lat, q.lon]);
    });
    if (geo === 'ligne') L.polyline(coins, { color: '#0092A6', weight: 3 }).addTo(calques);
    else if (geo === 'polygone') L.polygon(coins, { color: '#0092A6', weight: 3, fillColor: '#0092A6', fillOpacity: 0.15 }).addTo(calques);
    carte.invalidateSize();
    if (coins.length === 1) carte.setView(coins[0], 15); else carte.fitBounds(coins, { padding: [40, 40], maxZoom: 17 });
    if (navigator.onLine === false) messageFond('Vous semblez hors connexion : le fond de carte ne pourra pas se charger. Vos points restent affichés sur fond vide.');
    $('v-carte').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  $('v-go').addEventListener('click', afficher);
  $('v-exemple').addEventListener('click', function () {
    saisie.definir('gps', 0, '5.3600, -4.0083\n6.8276, -5.2893\n7.6906, -5.0300\n');
    document.querySelector('input[name="relier"][value="aucun"]').checked = true;
    afficher();
  });
  $('v-clear').addEventListener('click', function () {
    saisie.vider(); OC.cacher($('v-msg')); $('v-warn').textContent = ''; messageFond('');
    if (calques) calques.clearLayers();
    etat.marqueurs = [];
  });
  document.querySelectorAll('input[name="relier"]').forEach(function (r) { r.addEventListener('change', function () { if (carte && etat.marqueurs.length) afficher(); }); });

  // Accès pour les tests automatiques
  window.GeoVisualiseur = { carte: function () { return carte; }, marqueurs: function () { return etat.marqueurs; }, etat: etat };
})();
