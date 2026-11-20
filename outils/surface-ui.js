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

  $('s-clear').addEventListener('click', function () { $('s-txt').value = ''; effacerResultat(); $('s-multi').hidden = true; parcellesImportees = []; OC.cacher($('s-import-msg')); });

  // Copier le résultat, CSV, schéma
  $('s-copy-wrap').appendChild(OC.boutonCopier(function () { return dernier ? S.texteResultat(dernier) : ''; }, 'le résultat', 'Copier le résultat'));
  $('s-csv').addEventListener('click', function () { if (dernier) OC.telecharger(S.versCsv(dernier), 'text/csv;charset=utf-8', 'points-parcelle.csv'); });
  $('s-svg').addEventListener('click', function () { if (svg) OC.telecharger(svg, 'image/svg+xml;charset=utf-8', 'schema-parcelle.svg'); });

  // --- Importer un fichier de parcelles (lu localement) ---
  var parcellesImportees = [];

  function zoneAutoUtm(p) { // zone 29N ou 30N où le plus de points tombent en Côte d'Ivoire (si le fichier n'indique pas la zone)
    var meilleure = 30, max = -1;
    [29, 30].forEach(function (zz) {
      var n = 0;
      p.points.forEach(function (q) { try { C.utmVersGps(q.est, q.nord, { z: zz, h: 'N' }, false); n++; } catch (e) {} });
      if (n > max) { max = n; meilleure = zz; }
    });
    return meilleure;
  }
  function analyserParcelle(p) {
    return S.analyser(window.GeoImport.versTexte(p.mode, p.points), p.mode, p.mode === 'utm' ? zoneAutoUtm(p) : 0);
  }
  function chargerParcelle(p) { // met la parcelle dans la zone de saisie et calcule
    var GI = window.GeoImport;
    document.querySelector('input[name="smode"][value="' + p.mode + '"]').checked = true;
    majMode();
    if (p.mode === 'utm') $('s-zone').value = String(zoneAutoUtm(p));
    $('s-txt').value = GI.versTexte(p.mode, p.points) + '\n';
    calculer();
  }

  function afficherTableau() {
    var wrap = $('s-multi-table'); wrap.textContent = '';
    var table = document.createElement('table'); table.className = 'cv-table';
    var cap = document.createElement('caption'); cap.style.cssText = 'position:absolute;left:-9999px'; cap.textContent = 'Surface de chaque parcelle importée';
    table.appendChild(cap);
    var thead = document.createElement('thead'), trh = document.createElement('tr');
    ['Parcelle', 'Points', 'Surface (m\u00b2)', 'Hectares', 'ha-a-ca', 'Périmètre (m)', 'Statut', ''].forEach(function (c) { var th = document.createElement('th'); th.scope = 'col'; th.textContent = c; trh.appendChild(th); });
    thead.appendChild(trh); table.appendChild(thead);
    var tb = document.createElement('tbody'), total = 0, nbOk = 0, tsv = ['Parcelle\tPoints\tSurface (m2)\tHectares\tha-a-ca\tPérimètre (m)\tStatut'];
    parcellesImportees.forEach(function (l) {
      var r = l.res, tr = document.createElement('tr');
      var trous = l.trous ? ' (trous ignorés : ' + l.trous + ')' : '';
      var vals = r.ok
        ? [l.libelle, String(r.points.length), S.fr(r.surface, 2), S.fr(r.surface / 10000, 4), S.texteHaAca(r), S.fr(r.perimetre, 2), (r.croise ? 'Contour croisé : surface sans sens' : 'OK') + trous]
        : [l.libelle, '', '', '', '', '', r.erreur];
      vals.forEach(function (v, i) {
        var td = document.createElement('td'); td.textContent = v;
        if (i === 6 && (!r.ok || r.croise)) td.className = 'err';
        tr.appendChild(td);
      });
      var tdv = document.createElement('td');
      if (r.ok) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'cv-copy'; b.textContent = 'Voir';
        b.setAttribute('aria-label', 'Voir le détail de la parcelle ' + l.libelle);
        b.addEventListener('click', function () { chargerParcelle(l.p); $('s-res').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
        tdv.appendChild(b);
        if (!r.croise) { total += r.surface; nbOk++; }
      }
      tr.appendChild(tdv); tb.appendChild(tr);
      tsv.push(vals.map(function (x) { return x; }).join('\t'));
    });
    if (nbOk > 1) {
      var trT = document.createElement('tr');
      ['Total (' + nbOk + ' parcelles valides)', '', S.fr(total, 2), S.fr(total / 10000, 4), S.texteHaAca({ haAca: S.formatHaAca(total) }), '', '', ''].forEach(function (v) {
        var td = document.createElement('td'); td.textContent = v; td.style.fontWeight = '700'; trT.appendChild(td);
      });
      tb.appendChild(trT);
    }
    table.appendChild(tb); wrap.appendChild(table);
    $('s-multi-copy').textContent = '';
    $('s-multi-copy').appendChild(OC.boutonCopier(tsv.join('\n'), 'le tableau', 'Copier le tableau'));
    $('s-multi').hidden = false;
  }

  function lireTexteFichier(f) {
    return new Promise(function (ok, ko) {
      var fr = new FileReader();
      fr.onload = function () { ok(String(fr.result)); };
      fr.onerror = function () { ko(new Error('lecture impossible')); };
      fr.readAsText(f);
    });
  }

  $('s-file').addEventListener('change', function () {
    var input = this, fichiers = Array.prototype.slice.call(input.files || []), msg = $('s-import-msg'), GI = window.GeoImport;
    OC.cacher(msg);
    if (!fichiers.length) return;
    Promise.all(fichiers.map(function (f) {
      if (f.size > GI.MAX_OCTETS) return Promise.resolve({ nom: f.name, erreur: 'fichier trop gros (5 Mo maximum)' });
      return lireTexteFichier(f).then(function (t) { var r = GI.lireParcelles(f.name, t); r.nom = f.name; return r; },
        function () { return { nom: f.name, erreur: 'lecture impossible' }; });
    })).then(function (res) {
      var parcelles = [], erreurs = [], MAX_PARCELLES = 500, tronque = false;
      res.forEach(function (r) {
        if (r.erreur) { erreurs.push(r.nom + ' : ' + r.erreur); return; }
        if (!r.parcelles.length) { erreurs.push(r.nom + ' : aucune parcelle ni point trouvé'); return; }
        r.parcelles.forEach(function (p) {
          if (parcelles.length >= MAX_PARCELLES) { tronque = true; return; }
          p.fichier = r.nom; p.libelle = (fichiers.length > 1 ? r.nom + ' : ' : '') + p.libelle; parcelles.push(p);
        });
      });
      input.value = '';
      if (!parcelles.length) { msg.className = 'cv-msg err'; msg.textContent = 'Aucune parcelle importée. ' + erreurs.join(' ; '); msg.hidden = false; return; }
      var info = parcelles.length + ' parcelle' + (parcelles.length > 1 ? 's' : '') + ' importée' + (parcelles.length > 1 ? 's' : '') + '.';
      var trous = parcelles.reduce(function (s, p) { return s + (p.trous || 0); }, 0);
      if (trous) info += ' ' + trous + ' trou' + (trous > 1 ? 's' : '') + ' ignoré' + (trous > 1 ? 's' : '') + ' : la surface est celle du contour extérieur, trous compris.';
      if (tronque) info += ' Seules les ' + MAX_PARCELLES + ' premières parcelles ont été gardées.';
      if (erreurs.length) info += ' Problème : ' + erreurs.join(' ; ') + '.';
      msg.className = 'cv-msg info'; msg.textContent = info; msg.hidden = false;
      effacerResultat(); $('s-multi').hidden = true;
      if (parcelles.length === 1) { chargerParcelle(parcelles[0]); return; }
      parcellesImportees = parcelles.map(function (p) { return { libelle: p.libelle, trous: p.trous || 0, p: p, res: analyserParcelle(p) }; });
      afficherTableau();
    });
  });

  $('s-multi-csv').addEventListener('click', function () {
    if (parcellesImportees.length) OC.telecharger(S.versCsvParcelles(parcellesImportees), 'text/csv;charset=utf-8', 'surfaces-parcelles.csv');
  });

  majMode();
})();
