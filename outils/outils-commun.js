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

  function afficherErreur(zone, message) { zone.className = 'cv-msg err'; zone.textContent = message; zone.hidden = false; }
  function cacher(zone) { zone.hidden = true; zone.textContent = ''; }

  root.OutilsCommun = { copier: copier, boutonCopier: boutonCopier, telecharger: telecharger, afficherErreur: afficherErreur, cacher: cacher };
})(window);
