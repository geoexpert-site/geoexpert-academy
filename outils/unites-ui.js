/* Interface du convertisseur d'unités de surface. Tout reste dans le navigateur : rien n'est envoyé ni stocké. */
(function () {
  'use strict';
  var U = window.GeoUnites, OC = window.OutilsCommun;
  var $ = function (id) { return document.getElementById(id); };

  var LIBELLES = [
    ['m2', 'Mètres carrés (m²)'], ['are', 'Ares (a)'], ['ha', 'Hectares (ha)'], ['haaca', 'Hectares, ares, centiares (ha-a-ca)'],
    ['km2', 'Kilomètres carrés (km²)'], ['acre', 'Acres'], ['lot', 'Lots']
  ];

  function majChamps() {
    var haaca = $('u-unite').value === 'haaca';
    $('u-simple').hidden = haaca; $('u-haaca').hidden = !haaca;
    calculer();
  }

  function ligne(label, valeur, copie) {
    var div = document.createElement('div'); div.className = 'cv-res-item';
    var txt = document.createElement('div'); txt.className = 'cv-res-text';
    var l = document.createElement('span'); l.className = 'cv-res-label'; l.textContent = label;
    var v = document.createElement('span'); v.className = 'cv-res-value'; v.textContent = valeur;
    txt.appendChild(l); txt.appendChild(v); div.appendChild(txt); div.appendChild(OC.boutonCopier(copie, label));
    return div;
  }

  function calculer() {
    var msg = $('u-msg'), res = $('u-res');
    OC.cacher(msg); res.textContent = ''; $('u-note').textContent = '';
    ['u-val', 'u-ha', 'u-a', 'u-ca', 'u-lot'].forEach(function (i) { $(i).removeAttribute('aria-invalid'); });
    var unite = $('u-unite').value;
    var r = U.convertir({ unite: unite, valeur: $('u-val').value, ha: $('u-ha').value, a: $('u-a').value, ca: $('u-ca').value }, $('u-lot').value);
    if (!r.ok) {
      if (r.vide) return; // rien saisi : pas de message d'erreur
      var champ = { valeur: 'u-val', ha: 'u-ha', a: 'u-a', ca: 'u-ca', lot: 'u-lot' }[r.champ];
      if (champ) $(champ).setAttribute('aria-invalid', 'true');
      OC.afficherErreur(msg, r.erreur); return;
    }
    var F = U.formater, B = U.brut;
    res.appendChild(ligne('Mètres carrés (m²)', F(r.m2) + ' m²', B(r.m2) + ' m2'));
    res.appendChild(ligne('Ares (a)', F(r.are) + ' a', B(r.are) + ' a'));
    res.appendChild(ligne('Hectares (ha)', F(r.ha) + ' ha', B(r.ha) + ' ha'));
    res.appendChild(ligne('Hectares, ares, centiares (ha-a-ca)', U.formaterHaAca(r.haaca), U.formaterHaAca(r.haaca)));
    res.appendChild(ligne('Kilomètres carrés (km²)', F(r.km2) + ' km²', B(r.km2) + ' km2'));
    res.appendChild(ligne('Acres', F(r.acre) + ' acres', B(r.acre) + ' acres'));
    res.appendChild(ligne('Lots de ' + F(r.tailleLot) + ' m²', F(r.lot) + ' lots', B(r.lot) + ' lots'));
    var ca = r.haaca.ca;
    if (ca !== Math.floor(ca)) {
      var entiers = Math.floor(ca), reste = Math.round((ca - entiers) * 100) / 100;
      $('u-note').textContent = 'En centiares entiers : ' + U.formaterHaAca({ ha: r.haaca.ha, a: r.haaca.a, ca: entiers }) + ', et un reste de ' + F(reste) + ' ca.';
    }
  }

  var champs = ['u-val', 'u-ha', 'u-a', 'u-ca', 'u-lot'];
  champs.forEach(function (i) { $(i).addEventListener('input', calculer); });
  $('u-unite').addEventListener('change', majChamps);

  $('u-exemple').addEventListener('click', function () {
    $('u-unite').value = 'm2'; $('u-val').value = '12 345,67'; $('u-lot').value = String(U.LOT_DEFAUT); majChamps();
  });
  $('u-clear').addEventListener('click', function () {
    champs.forEach(function (i) { if (i !== 'u-lot') $(i).value = ''; });
    $('u-lot').value = String(U.LOT_DEFAUT); calculer();
  });

  var sel = $('u-unite');
  LIBELLES.forEach(function (o) { var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; sel.appendChild(op); });
  $('u-lot').value = String(U.LOT_DEFAUT);
  majChamps();
})();
