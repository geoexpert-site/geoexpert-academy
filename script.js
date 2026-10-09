// ==========================================================
// GeoExpert Academy — script principal
// Version corrigée et sécurisée
// Organisation :
//   0. Helpers
//   1. Menu mobile
//   2. Sous-menus (dropdowns)
//   3. Formulaire d'inscription
//   4. Formulaire d'avis
//   5. Façade vidéo de présentation
//   6. Simulateur de parcours
//   7. Carte interactive Leaflet
//   8. Vérification de certificat
// ==========================================================

(function () {
  'use strict';

  function init() {

  // ==========================================================
  // 0. HELPERS
  // ==========================================================

  /** Numéro WhatsApp centralisé (format international sans +) */
  const WHATSAPP_NUMBER = "2250787015030";

  /**
   * Échappe les entités HTML pour prévenir tout XSS
   * si les données venaient un jour d'une source externe.
   */
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Ouvre un lien dans un nouvel onglet de manière fiable
   * (contourne les bloqueurs de popup sur mobile Safari).
   */
  function ouvrirLien(url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Construit une URL WhatsApp avec le message pré-rempli.
   */
  function whatsappUrl(message) {
    const params = new URLSearchParams({ text: message });
    return `https://wa.me/${WHATSAPP_NUMBER}?${params.toString()}`;
  }

  /** Détecte la préférence utilisateur pour réduire les animations. */
  const PREFERS_REDUCED_MOTION =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  // ==========================================================
  // 1. MENU MOBILE
  // ==========================================================
  try {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  /** Ferme le menu et remet aria-expanded à false. */
  function fermerMenu() {
    if (!mainNav || !navToggle) return;
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  /** Ouvre/ferme le menu et synchronise aria-expanded. */
  navToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Ferme le menu au clic sur un lien
  mainNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fermerMenu);
  });

  // Ferme le menu au clic en dehors
  document.addEventListener('click', (e) => {
    if (!mainNav?.classList.contains('open')) return;
    if (mainNav.contains(e.target) || navToggle?.contains(e.target)) return;
    fermerMenu();
  });

  // Ferme le menu avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav?.classList.contains('open')) {
      fermerMenu();
      navToggle?.focus();
    }
  });
  } catch (err) {
    console.error('[Section 1] erreur :', err);
  }

  // ==========================================================
  // 2. SOUS-MENUS (DROPDOWNS)
  // ==========================================================
  try {
  document.querySelectorAll('.nav-toggle-sub').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const navItem = this.closest('.nav-item');
      if (!navItem) return;

      const isOpen = navItem.classList.contains('open');

      // Ferme tous les autres sous-menus
      document.querySelectorAll('.nav-item.open').forEach(function (item) {
        if (item !== navItem) item.classList.remove('open');
      });

      // Toggle celui-ci
      navItem.classList.toggle('open', !isOpen);
    });
  });

  // Ferme les sous-menus au clic ailleurs
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-item.open').forEach(function (item) {
        item.classList.remove('open');
      });
    }
  });

  // Ferme les sous-menus à la touche Échap
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-item.open').forEach(function (item) {
        item.classList.remove('open');
      });
    }
  });
  } catch (err) {
    console.error('[Section 2] erreur :', err);
  }

  // ==========================================================
  // 3. FORMULAIRE D'INSCRIPTION
  // ==========================================================
  try {
  const form = document.getElementById('inscriptionForm');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name       = document.getElementById('fName')?.value.trim() ?? '';
    const phone      = document.getElementById('fPhone')?.value.trim() ?? '';
    const profession = document.getElementById('fProfession')?.value.trim() ?? '';
    const niveau     = document.getElementById('fNiveau')?.value ?? '';
    const ville      = document.getElementById('fVille')?.value.trim() ?? '';
    const mode       = document.getElementById('fMode')?.value ?? '';
    const formation  = document.getElementById('fFormation')?.value ?? '';
    const message    = document.getElementById('fMessage')?.value.trim() ?? '';

    if (!name || !phone || !profession || !niveau || !ville || !mode || !formation) {
      alert("Merci de remplir tous les champs obligatoires.");
      return;
    }

    const phoneClean = phone.replace(/\s+/g, '');
    if (!/^(\+?225)?0?[0-9]{8,10}$/.test(phoneClean)) {
      alert("Merci d'entrer un numéro de téléphone valide (ex : 07 87 01 50 30).");
      return;
    }

    const lines = [
      `Bonjour GeoExpert Academy,`,
      `Je souhaite m'inscrire à une formation.`,
      ``,
      `Nom : ${name}`,
      `WhatsApp : ${phone}`,
      `Profession / domaine : ${profession}`,
      `Niveau en SIG : ${niveau}`,
      `Ville : ${ville}`,
      `Mode de formation : ${mode}`,
      `Formation : ${formation}`,
      ``,
      `Je vais joindre ma capture d'écran de paiement dans ce chat.`,
    ];
    if (message) lines.push(``, `Message : ${message}`);

    ouvrirLien(whatsappUrl(lines.join('\n')));
    form.reset();
  });
  } catch (err) {
    console.error('[Section 3] erreur :', err);
  }

  // ==========================================================
  // 4. FORMULAIRE D'AVIS
  // ==========================================================
  try {
  const btnLaisserAvis = document.getElementById('btnLaisserAvis');
  const avisForm = document.getElementById('avisForm');

  btnLaisserAvis?.addEventListener('click', () => {
    avisForm?.classList.toggle('show');
  });

  avisForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nom             = document.getElementById('avisNom')?.value.trim() ?? '';
    const formationSuivie = document.getElementById('avisFormation')?.value.trim() ?? '';
    const messageAvis     = document.getElementById('avisMessage')?.value.trim() ?? '';

    if (!nom || !formationSuivie || !messageAvis) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    const lines = [
      `Bonjour GeoExpert,`,
      `Je souhaite partager un avis sur ma formation.`,
      ``,
      `Nom : ${nom}`,
      `Formation suivie : ${formationSuivie}`,
      `Avis : ${messageAvis}`,
    ];

    ouvrirLien(whatsappUrl(lines.join('\n')));

    avisForm.reset();
    avisForm.classList.remove('show');
  });
  } catch (err) {
    console.error('[Section 4] erreur :', err);
  }

  // ==========================================================
  // 5. FAÇADE VIDÉO DE PRÉSENTATION
  // ==========================================================
  try {
  const presVideoFacade = document.getElementById('presVideoFacade');

  if (presVideoFacade) {
    const videoId = presVideoFacade.dataset.videoId;

    const maxRes = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const hqRes  = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    presVideoFacade.style.backgroundImage = `url('${maxRes}')`;

    const testImg = new Image();
    testImg.src = maxRes;
    testImg.onerror = () => {
      presVideoFacade.style.backgroundImage = `url('${hqRes}')`;
    };

    presVideoFacade.addEventListener('click', function handler() {
      this.removeEventListener('click', handler);
      this.style.backgroundImage = 'none';
      this.innerHTML = `
        <iframe
          src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0"
          title="Vidéo de présentation GeoExpert"
          frameborder="0"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
          allow="autoplay; encrypted-media; picture-in-picture">
        </iframe>`;
    });
  }
  } catch (err) {
    console.error('[Section 5] erreur :', err);
  }

  // ==========================================================
  // 6. SIMULATEUR DE PARCOURS
  // ==========================================================
  try {
  const simData = {
    "Étudiant": {
      formation: "Devenez Géomaticien Opérationnel (Octobre 2026)",
      desc: "Une excellente porte d'entrée dans les SIG, avec un contenu appliqué et recherché sur le marché de l'emploi, quel que soit votre secteur."
    },
    "Géographe": {
      formation: "SIG & Environnement",
      desc: "Approfondissez vos compétences avec une spécialisation directement liée à votre formation initiale."
    },
    "Géologue": {
      formation: "Devenez Géomaticien Opérationnel (Octobre 2026)",
      desc: "Renforcez vos compétences SIG pour la cartographie géologique, la prospection et le suivi de sites miniers."
    },
    "Ingénieur": {
      formation: "Devenez Géomaticien Opérationnel (Octobre 2026)",
      desc: "Une formation complète en SIG et cartographie, directement applicable à vos projets d'ingénierie, quel que soit votre secteur."
    },
    "Urbaniste": {
      formation: "SIG & Urbanisme",
      desc: "Aménagement du territoire, zonage et analyse spatiale urbaine, appliqués à vos projets."
    },
    "ONG": {
      formation: "SIG & Environnement",
      desc: "Cartographie de zones vulnérables, suivi environnemental, utile pour vos projets de terrain."
    },
    "Autre": {
      formation: "Un échange personnalisé",
      desc: "Votre profil ne rentre dans aucune case toute faite ? Décrivez-nous votre métier et vos besoins, on vous recommandera la formation la plus adaptée ou on en construit une sur mesure."
    }
  };

  const simOptions = document.getElementById('simOptions');
  const simResult  = document.getElementById('simResult');

  simOptions?.addEventListener('click', (e) => {
    const btn = e.target.closest('.sim-chip');
    if (!btn) return;

    simOptions.querySelectorAll('.sim-chip').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');

    const profile = btn.dataset.profile;
    const data = simData[profile];

    if (!data) {
      console.warn(`Profil inconnu dans le simulateur : ${profile}`);
      return;
    }

    document.getElementById('simResultTitle').textContent = data.formation;
    document.getElementById('simResultDesc').textContent = data.desc;

    const text = profile === "Autre"
      ? `Bonjour GeoExpert,\nJe n'ai pas trouvé mon profil dans votre simulateur. Pouvez-vous m'aider à trouver la formation adaptée à mon métier ?`
      : `Bonjour GeoExpert,\nJe suis ${profile} et le simulateur du site m'a recommandé : ${data.formation}.\nJe souhaite en savoir plus.`;

    document.getElementById('simResultCta').href = whatsappUrl(text);

    simResult.classList.add('show');

    if (!PREFERS_REDUCED_MOTION) {
      simResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
  } catch (err) {
    console.error('[Section 6] erreur :', err);
  }

  // ==========================================================
  // 7. CARTE INTERACTIVE LEAFLET
  // ==========================================================
  try {
  const mapPoints = [
    {
      lat: 5.383732,
      lng: -3.956526,
      titre: "Formation Professionnelle en Géomatique, SIG & Cartographie",
      description: "Formation intensive de 40 heures permettant de maîtriser les SIG, la cartographie et les outils géospatiaux à travers des projets concrets et des études de cas appliquées à plusieurs secteurs d'activité.",
      lieu: "Cocody Saint-Viateur, Rond-point Y4, Abidjan",
      categorieLabel: "Formation",
      type: "formation",
      image: "images/salle.jpg"
    },
    {
      lat: 6.822850,
      lng: -5.275669,
      titre: "Système d'Information Géographique pour la gestion intégrée des lacs artificiels",
      description: "Conception et mise en œuvre d'un Système d'Information Géographique (SIG) dédié à l'analyse, au suivi et à la gestion intégrée des lacs artificiels de la ville de Yamoussoukro afin d'appuyer la prise de décision.",
      lieu: "Yamoussoukro",
      categorieLabel: "Projet SIG",
      type: "hydrographie",
      image: "images/carteyakro.jpg"
    },
    {
      lat: 7.704786,
      lng: -5.034898,
      titre: "Analyse spatiale des cas de diarrhée infantile en fonction de la proximité entre les puits et les fosses septiques",
      description: "Réalisation d'une analyse spatiale visant à étudier la relation entre les cas de diarrhée infantile et la distance séparant les puits des fosses septiques. Le projet a permis d'identifier les quartiers où la proximité entre ces infrastructures est associée à une fréquence plus élevée des cas de diarrhée, afin d'orienter les actions de santé publique et d'assainissement.",
      lieu: "Bouaké",
      categorieLabel: "Projet SIG",
      type: "environnement",
      image: "images/cartebke.jpg"
    },
    {
      lat: 5.388291,
      lng: -3.986180,
      titre: "Développement d'une application WebSIG pour la gestion des données foncières",
      description: "Conception et développement d'une application WebSIG avec ArcGIS Online permettant la visualisation, la consultation et le partage sécurisé des données foncières via une interface web interactive.",
      lieu: "Cocody 7ᵉ Tranche, Abidjan",
      categorieLabel: "WebSIG",
      type: "websig",
      image: "images/webmaping.jpg"
    },
    {
      lat: 5.496162,
      lng: -3.211064,
      titre: "Cartographie du réseau hydrographique du département d'Aboisso",
      description: "Production d'une carte du réseau hydrographique du département d'Aboisso pour l'identification des cours d'eau, l'analyse spatiale et l'appui aux projets d'aménagement et de développement territorial.",
      lieu: "Aboisso",
      categorieLabel: "Hydrographie",
      type: "cartographie",
      image: "images/carteaboisso.jpg"
    },
    {
      lat: 6.557422,
      lng: -5.018573,
      titre: "Cartographie du relief du département de Toumodi",
      description: "Conception d'une carte thématique du relief du département de Toumodi à l'aide d'outils SIG et de données altimétriques. Le projet met en évidence les variations d'altitude et les caractéristiques topographiques afin de faciliter les analyses spatiales et la prise de décision.",
      lieu: "Toumodi",
      categorieLabel: "Télédétection",
      type: "relief",
      image: "images/cartetoumodi.jpg"
    },
    {
      lat: 8.139500,
      lng: -5.100000,
      titre: "Cartographie de l'occupation du sol de la sous-préfecture de Katiola",
      description: "Réalisation d'une carte d'occupation du sol à partir d'images satellitaires afin d'identifier les différentes unités d'utilisation des terres (zones agricoles, forêts, savanes, habitats et plans d'eau). Cette cartographie constitue un outil d'aide à la planification territoriale, au suivi de l'évolution du paysage et à la gestion durable des ressources naturelles.",
      lieu: "Sous-préfecture de Katiola",
      categorieLabel: "Télédétection",
      type: "occupation_sol",
      image: "images/cartekatiola.jpg"
    },
    {
      lat: 6.818802,
      lng: -4.556134,
      titre: "Cartographie des sites d'orpaillage clandestin de Booré Ettienkro",
      description: "Réalisation d'une cartographie des sites d'orpaillage clandestin à Booré Ettienkro à partir de données de terrain et d'analyses spatiales. Ce travail a permis de localiser les zones d'exploitation, d'évaluer leur répartition spatiale et de fournir un outil d'aide à la surveillance environnementale et à la prise de décision.",
      lieu: "Booré Ettienkro",
      categorieLabel: "Zone d'intervention",
      type: "zone_intervention",
      image: "images/carteborreettienkto.jpg"
    },
    {
      lat: 4.748510,
      lng: -6.636300,
      titre: "Cartographie du relief de la région de San Pedro",
      description: "Réalisation d'une carte du relief de la région de San Pedro à partir d'un Modèle Numérique de Terrain (MNT). Cette cartographie met en évidence les variations altitudinales et les principales formes du relief afin d'appuyer les études d'aménagement du territoire, les analyses environnementales et la planification des infrastructures.",
      lieu: "San Pedro",
      categorieLabel: "Télédétection",
      type: "relief",
      image: "images/cartesanpedro.jpg"
    },
    {
      lat: 7.540000,
      lng: -5.550000,
      titre: "Spatialisation de la pluviométrie moyenne du Centre de la Côte d'Ivoire après la rupture climatique de 1979",
      description: "Réalisation d'une analyse spatiale de la pluviométrie moyenne dans le Centre de la Côte d'Ivoire à la suite de la rupture climatique de 1979. Ce projet a consisté à interpoler les données pluviométriques afin de cartographier leur répartition spatiale et d'identifier les zones les plus affectées par les changements climatiques, dans le but d'appuyer les études environnementales et la gestion des ressources naturelles.",
      lieu: "Centre de la Côte d'Ivoire",
      categorieLabel: "Climat",
      type: "climat",
      image: "images/cartecentreci.jpg"
    },
    {
      lat: 15.000000,
      lng: -1.500000,
      titre: "Cartographie des pays de l'Alliance des États du Sahel (AES)",
      description: "Conception d'une carte thématique des pays membres de l'Alliance des États du Sahel (AES), mettant en évidence leurs limites administratives, les principales villes, les réseaux de transport et les éléments géographiques majeurs. Cette cartographie constitue un support d'analyse géopolitique, territoriale et de communication.",
      lieu: "Mali, Burkina Faso, Niger",
      categorieLabel: "Cartographie",
      type: "cartographie",
      image: "images/cartepaysaes.jpg"
    }
  ];

  const typeColors = {
    formation:        "#0092A6",
    cartographie:     "#A83C93",
    environnement:    "#3FA34D",
    climat:           "#5DADE2",
    websig:           "#4B3F92",
    energie:          "#E67E22",
    relief:           "#9C7C4E",
    occupation_sol:   "#7CB342",
    zone_intervention:"#C0392B",
    hydrographie:     "#2E86C1",
    foncier:          "#6D4C41"
  };

  const mapEl = document.getElementById('mapAbidjan');

  if (mapEl && typeof L === 'undefined') {
    console.error('Leaflet (L) est introuvable : vérifie que leaflet.js est chargé AVANT script.js.');
    mapEl.textContent = "La carte n'a pas pu se charger. Recharge la page.";
  }

  if (mapEl && typeof L !== 'undefined') {
    const map = L.map('mapAbidjan', {
      closePopupOnClick: true,
      zoomAnimation: !PREFERS_REDUCED_MOTION,
      fadeAnimation: !PREFERS_REDUCED_MOTION
    }).setView([6.2, -4.8], 7);

    const carteClassique = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
      }
    ).addTo(map);

    const vueSatellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 18
      }
    );

    L.control.layers({
      "Carte": carteClassique,
      "Satellite": vueSatellite
    }).addTo(map);

    mapPoints.forEach((point) => {
      const marker = L.circleMarker([point.lat, point.lng], {
        radius: 9,
        fillColor: typeColors[point.type] || "#0092A6",
        color: "#fff",
        weight: 2,
        fillOpacity: 0.9
      }).addTo(map);

      marker.bindTooltip(escapeHTML(point.titre), {
        direction: "top",
        offset: [0, -8]
      });

      const imageHtml = point.image
        ? `<img src="${escapeHTML(point.image)}" alt="${escapeHTML(point.titre)}" loading="lazy" width="220" height="140">`
        : '';

      marker.bindPopup(`
        <div class="map-popup">
          ${imageHtml}
          <span class="map-popup-tag">${escapeHTML(point.categorieLabel)}</span>
          <h4>${escapeHTML(point.titre)}</h4>
          <p class="map-popup-lieu">${escapeHTML(point.lieu)}</p>
          <p>${escapeHTML(point.description)}</p>
        </div>
      `);
    });

    // Cadrage sur la Côte d'Ivoire (le point AES, très au nord, reste accessible en dézoomant)
    const pointsCI = mapPoints.filter((p) => p.lat < 10);
    if (pointsCI.length > 0) {
      const bounds = L.latLngBounds(pointsCI.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    // Recalcule la taille de la carte quand la mise en page est terminée
    // (évite une carte grise ou vide si le conteneur change de taille)
    window.addEventListener('load', () => map.invalidateSize());
    setTimeout(() => map.invalidateSize(), 400);
    window.addEventListener('resize', () => map.invalidateSize());
  }
  } catch (err) {
    console.error('[Section 7] erreur :', err);
  }

  // ==========================================================
  // 8. VÉRIFICATION DE CERTIFICAT
  // ==========================================================
  try {
  const certificatsValides = [
    {
      code: "GEA-06-2026-0001",
      nom: "Kouamé Kouakou Donatien",
      formation: "Géomatique, SIG & Cartographie",
      duree: "15 heures",
      niveau: "Débutant",
      lieu: "Abidjan, Présentiel",
      date: "30 juin 2026"
    },
    {
      code: "GEA-06-2026-0002",
      nom: "Koné Morata Mory",
      formation: "Géomatique, SIG & Cartographie",
      duree: "15 heures",
      niveau: "Débutant",
      lieu: "Abidjan, Présentiel",
      date: "30 juin 2026"
    },
    {
      code: "GEA-06-2026-0003",
      nom: "Kissié Marus Emannuel",
      formation: "Géomatique, SIG & Cartographie",
      duree: "15 heures",
      niveau: "Débutant",
      lieu: "Abidjan, Présentiel",
      date: "30 juin 2026"
    },
    {
      code: "GEA-06-2026-0004",
      nom: "Kouadio Kouakou Ulriche",
      formation: "Géomatique, SIG & Cartographie",
      duree: "15 heures",
      niveau: "Débutant",
      lieu: "Abidjan, Présentiel",
      date: "30 juin 2026"
    },
    {
      code: "GEA-06-2026-0005",
      nom: "Bamba Ibrahim",
      formation: "Géomatique, SIG & Cartographie",
      duree: "15 heures",
      niveau: "Débutant",
      lieu: "Abidjan, Présentiel",
      date: "30 juin 2026"
    }
  ];

  const btnVerifier = document.getElementById('btnVerifier');
  const inputCode   = document.getElementById('codeCertificat');
  const resultatDiv = document.getElementById('resultat');

  function verifierCertificat() {
    if (!inputCode || !resultatDiv) return;

    const saisie = inputCode.value.trim().replace(/\s+/g, '').toUpperCase();

    if (!saisie) {
      resultatDiv.className = 'show invalide';
      resultatDiv.innerHTML = `<h3>Champ vide</h3><p>Veuillez entrer un code de certificat.</p>`;
      return;
    }

    const trouve = certificatsValides.find(
      (c) => c.code.toUpperCase() === saisie
    );

    if (trouve) {
      resultatDiv.className = 'show valide';
      resultatDiv.innerHTML = `
        <h3>Certificat authentique</h3>
        <p><strong>Titulaire :</strong> ${escapeHTML(trouve.nom)}</p>
        <p><strong>Formation :</strong> ${escapeHTML(trouve.formation)}</p>
        <p><strong>Durée :</strong> ${escapeHTML(trouve.duree)}, ${escapeHTML(trouve.niveau)}</p>
        <p><strong>Lieu :</strong> ${escapeHTML(trouve.lieu)}</p>
        <p><strong>Date :</strong> ${escapeHTML(trouve.date)}</p>
      `;
    } else {
      resultatDiv.className = 'show invalide';
      resultatDiv.innerHTML = `
        <h3>Certificat introuvable</h3>
        <p>Ce code ne correspond à aucun certificat délivré par GeoExpert Academy. Vérifiez la saisie ou contactez-nous.</p>
      `;
    }
  }

  btnVerifier?.addEventListener('click', verifierCertificat);
  inputCode?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifierCertificat();
  });
  } catch (err) {
    console.error('[Section 8] erreur :', err);
  }


  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
