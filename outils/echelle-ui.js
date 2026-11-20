/* Interface du calculateur d'échelle. Tout reste dans le navigateur : rien n'est envoyé ni stocké. */
(function () {
  'use strict';
  var E = window.GeoEchelle, U = window.GeoUnites, OC = window.OutilsCommun;
  var $ = function (id) { return document.getElementById(id); };
  OC.onglets(document.querySelector('.cv-tabs'));

  function item(label, valeur, copie) {
    var div = document.createElement('div'); div.className = 'cv-res-item';
    var txt = document.createElement('div'); txt.className = 'cv-res-text';
    var l = document.createElement('span'); l.className = 'cv-res-label'; l.textContent = label;
    var v = document.createElement('span'); v.className = 'cv-res-value'; v.textContent = valeur;
    txt.appendChild(l); txt.appendChild(v); div.appendChild(txt); div.appendChild(OC.boutonCopier(copie != null ? copie : valeur, label));
    return div;
  }
  var F = U.formater;
  function metres(m) { return F(m) + ' m'; }

  function vider(p) { OC.cacher($(p + '-msg')); $(p + '-res').textContent = ''; $(p + '-barre').textContent = ''; $(p + '-barre').hidden = true; }
  function dessiner(p, denom) {
    var b = E.barre(denom), zone = $(p + '-barre');
    zone.innerHTML = b.svg; // SVG fabriqué par l'outil à partir de nombres : aucun texte saisi par l'utilisateur
    var svg = zone.firstChild; svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Barre d’échelle : ' + F(b.totalCm) + ' cm sur la carte valent ' + b.etiquetteTotal + ' sur le terrain');
    var legende = document.createElement('p'); legende.className = 'cv-hint';
    legende.textContent = 'Barre d’échelle 1/' + F(denom, 12) + ' : ' + F(b.totalCm) + ' cm sur la carte = ' + b.etiquetteTotal + ' sur le terrain. Schéma indicatif : sa taille à l’écran n’est pas garantie.';
    zone.appendChild(legende); zone.hidden = false;
  }
  function erreur(p, r, champs) {
    $(p + '-msg').className = 'cv-msg err'; $(p + '-msg').textContent = r.erreur; $(p + '-msg').hidden = false;
    champs.forEach(function (c) { $(c).setAttribute('aria-invalid', 'true'); });
  }
  function reset(champs) { champs.forEach(function (c) { $(c).removeAttribute('aria-invalid'); }); }

  // (a) échelle + distance sur la carte -> distance réelle
  function calculA() {
    vider('a'); reset(['a-ech', 'a-d']);
    var r = E.distanceReelle($('a-ech').value, $('a-d').value, $('a-u').value);
    if (!r.ok) { if (!r.vide) erreur('a', r, r.erreur.indexOf('Échelle') === 0 || r.erreur.indexOf('Saisissez une échelle') === 0 ? ['a-ech'] : ['a-d']); return; }
    $('a-res').appendChild(item('Distance réelle', metres(r.reelM), U.brut(r.reelM) + ' m'));
    $('a-res').appendChild(item('Distance réelle en kilomètres', F(r.reelKm) + ' km', U.brut(r.reelKm) + ' km'));
    dessiner('a', r.denom);
  }
  // (b) échelle + distance réelle -> distance sur la carte
  function calculB() {
    vider('b'); reset(['b-ech', 'b-d']);
    var r = E.distanceCarte($('b-ech').value, $('b-d').value, $('b-u').value);
    if (!r.ok) { if (!r.vide) erreur('b', r, r.erreur.indexOf('Échelle') === 0 || r.erreur.indexOf('Saisissez une échelle') === 0 ? ['b-ech'] : ['b-d']); return; }
    $('b-res').appendChild(item('Distance sur la carte', F(r.carteCm) + ' cm', U.brut(r.carteCm) + ' cm'));
    $('b-res').appendChild(item('Distance sur la carte en millimètres', F(r.carteMm) + ' mm', U.brut(r.carteMm) + ' mm'));
    dessiner('b', r.denom);
  }
  // (c) distance sur la carte + distance réelle -> échelle
  function calculC() {
    vider('c'); reset(['c-dc', 'c-dr']);
    var r = E.trouverEchelle($('c-dc').value, $('c-uc').value, $('c-dr').value, $('c-ur').value);
    if (!r.ok) { if (!r.vide) erreur('c', r, ['c-dc', 'c-dr']); return; }
    var texte = '1/' + F(r.entier, 12);
    $('c-res').appendChild(item('Échelle de la carte', texte, '1/' + r.entier));
    if (!r.exacte) $('c-res').appendChild(item('Valeur exacte du calcul', '1/' + F(r.denom, 8), '1/' + U.brut(r.denom, 8)));
    if (r.courante && !(r.exacte && r.courante === r.entier)) {
      var p = document.createElement('p'); p.className = 'cv-hint';
      p.textContent = 'L’échelle courante la plus proche est 1/' + F(r.courante, 12) + ' (écart de ' + F(r.ecartCourante, 2) + ' %). Vos mesures contiennent peut-être une petite erreur.';
      $('c-res').appendChild(p);
    }
    dessiner('c', r.denom);
  }

  [['a', calculA, ['a-ech', 'a-d', 'a-u']], ['b', calculB, ['b-ech', 'b-d', 'b-u']], ['c', calculC, ['c-dc', 'c-uc', 'c-dr', 'c-ur']]].forEach(function (o) {
    $(o[0] + '-go').addEventListener('click', o[1]);
    o[2].forEach(function (id) {
      $(id).addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); o[1](); } });
      if ($(id).tagName === 'SELECT') $(id).addEventListener('change', o[1]);
    });
    $(o[0] + '-clear').addEventListener('click', function () { o[2].forEach(function (id) { if ($(id).tagName === 'INPUT') $(id).value = ''; }); vider(o[0]); reset(o[2]); });
  });
  $('a-exemple').addEventListener('click', function () { $('a-ech').value = '1/50 000'; $('a-d').value = '4'; $('a-u').value = 'cm'; calculA(); });
  $('b-exemple').addEventListener('click', function () { $('b-ech').value = '1/50 000'; $('b-d').value = '2'; $('b-u').value = 'km'; calculB(); });
  $('c-exemple').addEventListener('click', function () { $('c-dc').value = '4'; $('c-uc').value = 'cm'; $('c-dr').value = '2'; $('c-ur').value = 'km'; calculC(); });

  // Boutons d'échelles courantes
  ['a', 'b'].forEach(function (p) {
    var zone = $(p + '-boutons');
    E.COURANTES.forEach(function (n) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'btn btn-outline'; b.textContent = '1/' + F(n, 12);
      b.setAttribute('aria-label', 'Échelle 1 sur ' + F(n, 12));
      b.addEventListener('click', function () {
        $(p + '-ech').value = '1/' + F(n, 12);
        Array.prototype.forEach.call(zone.children, function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        (p === 'a' ? calculA : calculB)();
      });
      zone.appendChild(b);
    });
    $(p + '-ech').addEventListener('input', function () { Array.prototype.forEach.call(zone.children, function (x) { x.setAttribute('aria-pressed', 'false'); }); });
  });
})();
