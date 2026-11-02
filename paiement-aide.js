/* Aide au paiement dans les navigateurs intégrés (Facebook, Instagram, TikTok…).
   Script partagé, écrit en ES5 (WebView anciennes). Il ne change rien dans un vrai navigateur.
   Utilisation : window.geoPaiementAide(lien, nomFormation) renvoie true si la fenêtre d'aide
   s'est affichée (l'appelant ne doit alors pas ouvrir le lien), false sinon. */
(function () {
  var WHATSAPP = '2250787015030';
  var UA = navigator.userAgent || '';
  var EST_INTEGRE = /FBAN|FBAV|FB_IAB|FBIOS|Instagram|musical_ly|TikTok|Bytedance|BytedanceWebview|Snapchat|LinkedInApp|; wv\)/i.test(UA);
  var EST_IOS = /iPhone|iPad|iPod/i.test(UA);
  var EST_ANDROID = /Android/i.test(UA);
  var LIEN_DIGITALPAYE = /^https?:\/\/checkout\.digitalpaye\.com\//i;

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt) e.appendChild(document.createTextNode(txt));
    return e;
  }

  function injecterStyle() {
    if (document.getElementById('gx-style')) return;
    var s = document.createElement('style');
    s.id = 'gx-style';
    s.appendChild(document.createTextNode(
      '.gx-fond{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.7);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;-webkit-overflow-scrolling:touch}' +
      '.gx-boite{background:#fff;border-radius:12px;max-width:460px;width:100%;padding:24px 20px 20px;position:relative;box-sizing:border-box;max-height:100%;overflow:auto;color:#1F1D2B;font-size:16px;line-height:1.45}' +
      '.gx-fermer{position:absolute;top:6px;right:6px;width:44px;height:44px;background:none;border:0;font-size:28px;line-height:1;cursor:pointer;color:#1F1D2B}' +
      '.gx-titre{font-size:20px;line-height:1.3;margin:0 36px 12px 0;font-weight:700}' +
      '.gx-boite .btn{width:100%;box-sizing:border-box;min-height:48px;font-size:16px;margin-bottom:10px;text-align:center;text-decoration:none}' +
      '.gx-etapes{margin:0 0 14px;padding-left:22px;font-size:16px}' +
      '.gx-etapes li{margin-bottom:6px}' +
      '.gx-lien{width:100%;box-sizing:border-box;padding:12px;border:1px solid #ccc;border-radius:8px;font-size:16px;font-family:inherit;margin-bottom:10px}' +
      '.gx-info{margin:0 0 10px;font-size:16px;color:#0b6b2e;font-weight:600}' +
      '.gx-note{margin:6px 0 0;font-size:16px;color:#555}'
    ));
    document.head.appendChild(s);
  }

  function copier(texte, champ, fini) {
    function repli() {
      try {
        champ.removeAttribute('readonly');
        champ.focus();
        champ.select();
        champ.setSelectionRange(0, texte.length);
        var ok = document.execCommand && document.execCommand('copy');
        champ.setAttribute('readonly', 'readonly');
        return !!ok;
      } catch (e) { return false; }
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texte).then(function () { fini(true); }, function () { fini(repli()); });
        return;
      }
    } catch (e) {}
    fini(repli());
  }

  function afficher(lien, nom) {
    injecterStyle();
    var ancien = document.getElementById('gx-aide');
    if (ancien) ancien.parentNode.removeChild(ancien);

    var fond = el('div', 'gx-fond');
    fond.id = 'gx-aide';
    var boite = el('div', 'gx-boite');
    boite.setAttribute('role', 'dialog');
    boite.setAttribute('aria-modal', 'true');
    boite.setAttribute('aria-labelledby', 'gx-titre');

    var fermer = el('button', 'gx-fermer', '×');
    fermer.type = 'button';
    fermer.setAttribute('aria-label', 'Fermer');
    var titre = el('h3', 'gx-titre', 'Pour payer en toute sécurité, ouvrez cette page dans votre navigateur');
    titre.id = 'gx-titre';
    boite.appendChild(fermer);
    boite.appendChild(titre);

    if (EST_ANDROID) {
      var sansProtocole = lien.replace(/^https?:\/\//i, '');
      var intent = 'intent://' + sansProtocole + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(lien) + ';end';
      var chrome = el('a', 'btn btn-primary', 'Ouvrir dans Chrome');
      chrome.href = intent;
      boite.appendChild(chrome);
    } else if (EST_IOS) {
      var ol = el('ol', 'gx-etapes');
      ol.appendChild(el('li', '', 'Touchez le bouton de partage (ou les trois points « ... »).'));
      ol.appendChild(el('li', '', 'Choisissez « Ouvrir dans Safari ».'));
      boite.appendChild(ol);
    }

    var champ = el('input', 'gx-lien');
    champ.type = 'text';
    champ.value = lien;
    champ.setAttribute('readonly', 'readonly');
    champ.setAttribute('aria-label', 'Lien de paiement');
    var info = el('p', 'gx-info');
    info.style.display = 'none';
    var note = el('p', 'gx-note');
    note.style.display = 'none';

    var btnCopier = el('button', 'btn btn-outline', 'Copier le lien de paiement');
    btnCopier.type = 'button';
    btnCopier.onclick = function () {
      copier(lien, champ, function (ok) {
        if (ok) {
          info.textContent = 'Lien copié';
          info.style.display = 'block';
          note.style.display = 'none';
        } else {
          info.style.display = 'none';
          note.textContent = 'Copiez ce lien et collez-le dans Chrome.';
          note.style.display = 'block';
          champ.focus();
          try { champ.select(); } catch (e) {}
        }
      });
    };
    boite.appendChild(btnCopier);
    boite.appendChild(info);
    boite.appendChild(note);
    boite.appendChild(champ);

    var message = 'Bonjour, je souhaite m\'inscrire à ' + (nom || 'une formation') + ' et payer en ligne.';
    var wa = el('a', 'btn btn-whatsapp', 'Payer avec l\'aide du formateur sur WhatsApp');
    wa.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message);
    wa.setAttribute('data-fbq-skip', '');
    boite.appendChild(wa);
    boite.appendChild(el('p', 'gx-note', 'Paiement sécurisé par DigitalPaye.'));

    fond.appendChild(boite);
    document.body.appendChild(fond);

    function fermerFenetre() {
      document.removeEventListener('keydown', surTouche);
      if (fond.parentNode) fond.parentNode.removeChild(fond);
    }
    function surTouche(e) { if (e.key === 'Escape' || e.keyCode === 27) fermerFenetre(); }
    fermer.onclick = fermerFenetre;
    fond.onclick = function (e) { if (e.target === fond) fermerFenetre(); };
    document.addEventListener('keydown', surTouche);
    try { fermer.focus(); } catch (e) {}
  }

  window.geoPaiementAide = function (lien, nom) {
    if (!EST_INTEGRE || !lien || !LIEN_DIGITALPAYE.test(lien)) return false;
    try { afficher(lien, nom); return true; } catch (e) { return false; }
  };

  /* Liens <a> DigitalPaye (page d'inscription en présentiel) : même fenêtre d'aide. */
  if (EST_INTEGRE) {
    document.addEventListener('click', function (e) {
      var n = e.target;
      while (n && n !== document && !(n.tagName === 'A' && n.href)) n = n.parentNode;
      if (!n || n === document || n.className.indexOf('gx-') > -1 || !LIEN_DIGITALPAYE.test(n.href)) return;
      var nom = n.getAttribute('data-product') || 'la formation en présentiel Géomaticien Opérationnel';
      if (window.geoPaiementAide(n.href, nom)) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  }
})();
