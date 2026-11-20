/* Fonctions partagées par les outils gratuits (convertisseur, calculateur de surface).
   Tout reste dans le navigateur : rien n'est envoyé ni stocké. */
(function (root) {
  'use strict';

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

  // Bouton « Copier ». libelleOk : texte affiché après la copie ; libelleDefaut : texte normal.
  function boutonCopier(texte, libelle, libelleDefaut) {
    var defaut = libelleDefaut || 'Copier';
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'cv-copy'; b.textContent = defaut;
    b.setAttribute('aria-label', 'Copier ' + libelle);
    b.addEventListener('click', function () {
      copier(typeof texte === 'function' ? texte() : texte).then(function () {
        b.textContent = 'Copié'; b.classList.add('ok');
        setTimeout(function () { b.textContent = defaut; b.classList.remove('ok'); }, 1600);
      }, function () { b.textContent = 'Échec'; setTimeout(function () { b.textContent = defaut; }, 1600); });
    });
    return b;
  }

  // Télécharge un texte comme fichier (créé dans le navigateur)
  function telecharger(contenu, type, nom) {
    var blob = new Blob([contenu], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = nom;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // Cellule CSV (séparateur « ; ») : neutralise les formules des tableurs et protège les guillemets.
  function celluleCsv(v) {
    var s = String(v);
    if (/^[=+@\t\r]/.test(s) || (/^-/.test(s) && isNaN(parseFloat(s)))) s = "'" + s;
    if (/[";\r\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  // Nombre au format français : virgule décimale, espace fine insécable pour les milliers.
  function nombreFr(v, decimales) {
    if (!isFinite(v)) return String(v);
    var s = Math.abs(v).toFixed(decimales).split('.');
    var ent = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (v < 0 && Number(s.join('.')) !== 0 ? '−' : '') + ent + (s[1] ? ',' + s[1] : '');
  }

  // Onglets accessibles (flèches gauche/droite). Chaque onglet référence son panneau par aria-controls.
  function onglets(conteneur) {
    var tabs = Array.prototype.slice.call(conteneur.querySelectorAll('.cv-tab'));
    function ouvrir(tab, focus) {
      tabs.forEach(function (t) {
        var actif = t === tab;
        t.setAttribute('aria-selected', actif ? 'true' : 'false');
        t.tabIndex = actif ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !actif;
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
    return ouvrir;
  }

  function afficherErreur(zone, message) { zone.className = 'cv-msg err'; zone.textContent = message; zone.hidden = false; }
  function cacher(zone) { zone.hidden = true; zone.textContent = ''; }

  root.OutilsCommun = { copier: copier, boutonCopier: boutonCopier, telecharger: telecharger, celluleCsv: celluleCsv, nombreFr: nombreFr, onglets: onglets, afficherErreur: afficherErreur, cacher: cacher };
})(window);
