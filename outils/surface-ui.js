/* Interface du calculateur de surface. Tout reste dans le navigateur : rien n'est envoyé ni stocké. */
(function () {
  'use strict';
  var S = window.GeoSurface, C = window.GeoConv, OC = window.OutilsCommun;
  var $ = function (id) { return document.getElementById(id); };
  var dernier = null, svg = '';

  function mode() { return document.querySelector('input[name="smode"]:checked').value; }

  function majMode() {
    var utm = mode() === 'utm';
    var sel = $('s-zone');
    sel.textContent = '';
    (utm ? [['30', '30N (EPSG:32630)'], ['29', '29N (EPSG:32629)']] : [['0', 'Automatique (selon la longitude)'], ['29', 'Forcer la zone 29N'], ['30', 'Forcer la zone 30N']]).forEach(function (o) {
      var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; sel.appendChild(op);
    });
    $('s-zone-label').textContent = utm ? 'Zone UTM (si elle n’est pas écrite sur la ligne)' : 'Zone UTM';
    $('s-lab-a').textContent = utm ? 'Est (mètres)' : 'Latitude';
    $('s-lab-b').textContent = utm ? 'Nord (mètres)' : 'Longitude';
    $('s-a').placeholder = utm ? '388000' : '5.3600';
    $('s-b').placeholder = utm ? '592000' : '-4.0083';
    $('s-aide').textContent = utm
      ? 'Un point par ligne : Est, Nord (et la zone si besoin), séparés par une virgule, un point-virgule, une tabulation ou un espace. Exemple : 388000; 592000'
      : 'Un point par ligne : latitude, longitude en degrés décimaux. Exemple : 5.3600, -4.0083';
    $('s-txt').placeholder = utm ? '388000; 592000\n388100; 592000\n388100; 592100\n388000; 592100' : '5.3600, -4.0083\n5.3610, -4.0083\n5.3610, -4.0073';
    effacerResultat();
  }
  Array.prototype.forEach.call(document.querySelectorAll('input[name="smode"]'), function (r) { r.addEventListener('change', majMode); });

  function effacerResultat() {
    OC.cacher($('s-msg')); $('s-warn').textContent = ''; $('s-res').textContent = ''; $('s-actions').hidden = true; $('s-draw').hidden = true; $('s-draw-svg').textContent = '';
    dernier = null; svg = '';
  }

  function item(label, valeur, copie) {
    var div = document.createElement('div'); div.className = 'cv-res-item';
    var txt = document.createElement('div'); txt.className = 'cv-res-text';
    var l = document.createElement('span'); l.className = 'cv-res-label'; l.textContent = label;
    var v = document.createElement('span'); v.className = 'cv-res-value'; v.textContent = valeur;
    txt.appendChild(l); txt.appendChild(v);
    div.appendChild(txt); div.appendChild(OC.boutonCopier(copie != null ? copie : valeur, label));
    return div;
  }

  function calculer() {
    effacerResultat();
    var msg = $('s-msg');
    var z = parseInt($('s-zone').value, 10) || 0;
    var r = S.analyser($('s-txt').value, mode(), z);
    if (!r.ok) { OC.afficherErreur(msg, r.erreur); return; }
    dernier = r;

    // Avertissements
    var warn = $('s-warn');
    if (r.croise) {
      var w = document.createElement('p'); w.className = 'cv-msg err';
      w.textContent = 'Attention : votre contour se croise ou se touche lui-même. La surface affichée n’a plus de sens. Vérifiez l’ordre de vos points : ils doivent suivre le contour de la parcelle, dans l’ordre.';
      warn.appendChild(w);
    }
    r.avertissements.forEach(function (a) {
      var w = document.createElement('p'); w.className = 'cv-msg info'; w.textContent = a; warn.appendChild(w);
    });

    var res = $('s-res');
    res.appendChild(item('Surface', S.fr(r.surface, 2) + ' m²', r.surface.toFixed(2) + ' m2'));
    res.appendChild(item('Hectares', S.fr(r.surface / 10000, 4) + ' ha', (r.surface / 10000).toFixed(4) + ' ha'));
    res.appendChild(item('Hectares, ares, centiares', S.texteHaAca(r)));
    res.appendChild(item('Périmètre', S.fr(r.perimetre, 2) + ' m', r.perimetre.toFixed(2) + ' m'));
    res.appendChild(item('Nombre de points', r.points.length + ' (zone UTM ' + r.label + ')', String(r.points.length)));

    svg = S.dessinSvg(r);
    $('s-draw-svg').innerHTML = svg; // le SVG ne contient que des nombres calculés : aucun texte saisi par l'utilisateur
    var el = $('s-draw-svg').firstChild; el.setAttribute('role', 'img'); el.setAttribute('aria-label', 'Schéma de la parcelle avec ses sommets numérotés');
    el.removeAttribute('width'); el.removeAttribute('height'); el.style.width = '100%'; el.style.height = 'auto';
    $('s-draw').hidden = false;
    $('s-actions').hidden = false;
  }

  $('s-calc').addEventListener('click', calculer);

  // Ajouter un point au formulaire -> ajouté à la liste
  $('s-add').addEventListener('click', function () {
    var msg = $('s-msg'); OC.cacher(msg);
    var a = C.lireNombre($('s-a').value), b = C.lireNombre($('s-b').value);
    if ($('s-a').value.trim() === '' || $('s-b').value.trim() === '' || isNaN(a) || isNaN(b)) {
      OC.afficherErreur(msg, 'Valeur invalide : ' + (mode() === 'utm' ? 'l’Est et le Nord' : 'la latitude et la longitude') + ' doivent être des nombres.'); return;
    }
    var t = $('s-txt'), ligne = $('s-a').value.trim().replace(',', '.') + '; ' + $('s-b').value.trim().replace(',', '.');
    t.value = (t.value.trim() === '' ? '' : t.value.replace(/\s+$/, '') + '\n') + ligne + '\n';
    $('s-a').value = ''; $('s-b').value = ''; $('s-a').focus();
  });
  ['s-a', 's-b'].forEach(function (id) {
    $(id).addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); $('s-add').click(); } });
  });

  // Exemple : terrain d'essai de 100 m x 100 m (UTM 30N, Abidjan)
  $('s-exemple').addEventListener('click', function () {
    document.querySelector('input[name="smode"][value="utm"]').checked = true;
    majMode();
    $('s-zone').value = '30';
    $('s-txt').value = '388000; 592000\n388100; 592000\n388100; 592100\n388000; 592100\n';
    calculer();
  });

  $('s-clear').addEventListener('click', function () { $('s-txt').value = ''; effacerResultat(); });

  // Copier le résultat, CSV, schéma
  $('s-copy-wrap').appendChild(OC.boutonCopier(function () { return dernier ? S.texteResultat(dernier) : ''; }, 'le résultat', 'Copier le résultat'));
  $('s-csv').addEventListener('click', function () { if (dernier) OC.telecharger(S.versCsv(dernier), 'text/csv;charset=utf-8', 'points-parcelle.csv'); });
  $('s-svg').addEventListener('click', function () { if (svg) OC.telecharger(svg, 'image/svg+xml;charset=utf-8', 'schema-parcelle.svg'); });

  majMode();
})();
