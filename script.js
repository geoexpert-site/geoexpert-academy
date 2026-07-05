// ==========================================================
// GeoExpert Academy — script principal
// ==========================================================

// --- Menu mobile ---
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle?.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

mainNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

// --- Ticker de coordonnées dans le hero ---
const coordsEl = document.getElementById('heroCoords');
if (coordsEl) {
  const baseLat = 5.336;
  const baseLng = -4.029;
  let t = 0;
  setInterval(() => {
    t += 0.01;
    const lat = baseLat + Math.sin(t) * 0.002;
    const lng = baseLng + Math.cos(t) * 0.002;
    coordsEl.textContent = `${lat.toFixed(5)}°N  ${Math.abs(lng).toFixed(5)}°O`;
  }, 400);
}

// --- Formulaire d'inscription -> message WhatsApp pré-rempli ---
const WHATSAPP_NUMBER = "2250787015030";

const form = document.getElementById('inscriptionForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('fName').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const formation = document.getElementById('fFormation').value;
  const message = document.getElementById('fMessage').value.trim();

  const lines = [
    `Bonjour GeoExpert Academy,`,
    `Je souhaite m'inscrire à une formation.`,
    ``,
    `Nom : ${name}`,
    `WhatsApp : ${phone}`,
    `Formation : ${formation}`,
    ``,
    `📎 Je vais joindre ma capture d'écran de paiement dans ce chat.`,
  ];
  if (message) lines.push(``, `Message : ${message}`);

  const text = encodeURIComponent(lines.join('\n'));
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

  window.open(url, '_blank', 'noopener');
});
const presVideoFacade = document.getElementById('presVideoFacade');
if (presVideoFacade) {
  const videoId = presVideoFacade.dataset.videoId;
  // Affiche automatiquement la miniature YouTube en fond
  presVideoFacade.style.backgroundImage = `url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg')`;

  presVideoFacade.addEventListener('click', function () {
    this.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1"
      title="Vidéo de présentation GeoExpert" frameborder="0" allowfullscreen
      allow="autoplay; encrypted-media"></iframe>`;
  });
}

// --- Simulateur de parcours ---
const simData = {
  "Étudiant": {
    formation: "ArcMap + QGIS — Spécial BTP (Août 2026)",
    desc: "Une excellente porte d'entrée dans les SIG, avec un contenu appliqué et recherché sur le marché de l'emploi."
  },
  "Géographe": {
    formation: "SIG & Environnement",
    desc: "Approfondissez vos compétences avec une spécialisation directement liée à votre formation initiale."
  },
  "Géologue": {
    formation: "SIG appliqué à l'exploration minière",
    desc: "Cartographie géologique, prospection et suivi de sites — adapté à votre secteur."
  },
  "Ingénieur": {
    formation: "ArcMap + QGIS — Spécial BTP (Août 2026)",
    desc: "Conçue spécifiquement pour les professionnels du BTP : implantation, suivi de chantier, cartographie de projets."
  },
  "Urbaniste": {
    formation: "SIG & Urbanisme",
    desc: "Aménagement du territoire, zonage et analyse spatiale urbaine, appliqués à vos projets."
  },
  "ONG": {
    formation: "SIG & Environnement",
    desc: "Cartographie de zones vulnérables, suivi environnemental — utile pour vos projets de terrain."
  },
  "Autre": {
  formation: "Un échange personnalisé",
  desc: "Votre profil ne rentre dans aucune case toute faite ? Décrivez-nous votre métier et vos besoins, on vous recommandera la formation la plus adaptée — ou on en construit une sur mesure."
}
};

const simOptions = document.getElementById('simOptions');
const simResult = document.getElementById('simResult');

simOptions?.addEventListener('click', (e) => {
  const btn = e.target.closest('.sim-chip');
  if (!btn) return;

  simOptions.querySelectorAll('.sim-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');

  const profile = btn.dataset.profile;
  const data = simData[profile];

  document.getElementById('simResultTitle').textContent = data.formation;
  document.getElementById('simResultDesc').textContent = data.desc;

const text = profile === "Autre"
  ? encodeURIComponent(`Bonjour GeoExpert,\nJe n'ai pas trouvé mon profil dans votre simulateur. Pouvez-vous m'aider à trouver la formation adaptée à mon métier ?`)
  : encodeURIComponent(`Bonjour GeoExpert,\nJe suis ${profile} et le simulateur du site m'a recommandé : ${data.formation}.\nJe souhaite en savoir plus.`);
  
  document.getElementById('simResultCta').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

  simResult.classList.add('show');
});

// --- Carte interactive Leaflet ---
// Modifiez uniquement ce tableau pour ajouter/modifier/supprimer des points.
const mapPoints = [
{
    lat: 5.383732,
    lng: -3.956526,
    titre: "Formation Professionnelle en Géomatique, SIG & Cartographie",
    description: "Formation intensive de 40 heures permettant de maîtriser les SIG, la cartographie et les outils géospatiaux à travers des projets concrets et des études de cas appliquées à plusieurs secteurs d'activité.",
    lieu: "Cocody Saint-Viateur – Rond-point Y4, Abidjan",
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
    categorieLabel: "pROJET SIG",
    type: "environnement",
    image: "images/cartebke.jpg"
  },
  {
    lat: 5.388291,
    lng: -3.986180,
    titre: "Développement d'une application WebSIG pour la gestion des données foncières",
    description: "Conception et développement d'une application WebSIG avec ArcGIS Online permettant la visualisation, la consultation et le partage sécurisé des données foncières via une interface web interactive.",
    lieu: "Cocody 7ᵉ Tranche, Abidjan",
    categorieLabel: "webSIG",
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
    lat:  6.557422,
    lng: -5.018573,
    titre: "Cartographie du relief du dépatement de Toumodi",
    description: "Conception d'une carte thématique du relief du département de Toumodi à l'aide d'outils SIG et de données altimétriques. Le projet met en évidence les variations d'altitude et les caractéristiques topographiques afin de faciliter les analyses spatiales et la prise de décision.",
    lieu: "Toumodi",
    categorieLabel: "Télédétection",
    type: "environnement",
    image: "images/cartetoumodi.jpg"
  },
  {
    lat: 8.139500,
    lng: -5.100000,
    titre: "Cartographie de l'occupation du sol de la sous-préfecture de Katiola",
    description: "Réalisation d'une carte d'occupation du sol à partir d'images satellitaires afin d'identifier les différentes unités d'utilisation des terres (zones agricoles, forêts, savanes, habitats et plans d'eau). Cette cartographie constitue un outil d'aide à la planification territoriale, au suivi de l'évolution du paysage et à la gestion durable des ressources naturelles.",
    lieu: "Sous-préfecture de Katiola",
    categorieLabel: "Télédétection",
    type: "environnement",
    image: "images/cartekatiola.jpg"
},
{
    lat: 6.818802,
    lng: -4.556134,
    titre: "Cartographie des sites d'orpaillage clandestin de Booré Ettienkro",
    description: "Réalisation d'une cartographie des sites d'orpaillage clandestin à Booré Ettienkro à partir de données de terrain et d'analyses spatiales. Ce travail a permis de localiser les zones d'exploitation, d'évaluer leur répartition spatiale et de fournir un outil d'aide à la surveillance environnementale et à la prise de décision.",
    lieu: "Booré Ettienkro",
    categorieLabel: "Zone d'intervention",
    type: "environnement",
    image: "images/carteborreettienkto.jpg"
},
{
    lat: 4.748510,
    lng: -6.636300,
    titre: "Cartographie du relief de la région de San Pedro",
    description: "Réalisation d'une carte du relief de la région de San Pedro à partir d'un Modèle Numérique de Terrain (MNT). Cette cartographie met en évidence les variations altitudinales et les principales formes du relief afin d'appuyer les études d'aménagement du territoire, les analyses environnementales et la planification des infrastructures.",
    lieu: "San Pedro",
    categorieLabel: "Télédétection",
    type: "environnement",
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
];

const typeColors = {
  formation: "#0092A6",
  cartographie: "#A83C93",
  environnement: "#3FA34D",
  climat: "#5DADE2",
  websig: "#4B3F92",
  energie: "#E67E22",
  relief: "#9C7C4E",
  occupation_sol: "#7CB342",
  zone_intervention: "#C0392B",
  hydrographie: "#2E86C1",
  foncier: "#6D4C41"
};

const mapEl = document.getElementById('mapAbidjan');
if (mapEl && typeof L !== 'undefined') {
  const map = L.map('mapAbidjan').setView([6.2, -4.8], 7);

  // Vue carte classique (par défaut)
  const carteClassique = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  // Vue satellite (Esri World Imagery — gratuit, sans clé API)
  const vueSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18
  });

  // Bouton pour basculer entre les deux vues
  L.control.layers({
    "🗺️ Carte": carteClassique,
    "🛰️ Satellite": vueSatellite
  }).addTo(map);

  mapPoints.forEach(point => {
    const marker = L.circleMarker([point.lat, point.lng], {
      radius: 9,
      fillColor: typeColors[point.type] || "#0092A6",
      color: "#fff",
      weight: 2,
      fillOpacity: 0.9
    }).addTo(map);
    
    marker.bindTooltip("Cliquez pour en savoir plus", { direction: "top", offset: [0, -8] });
    
    const imageHtml = point.image
      ? `<img src="${point.image}" alt="${point.titre}">`
      : '';

    marker.bindPopup(`
      <div class="map-popup">
        ${imageHtml}
        <span class="map-popup-tag">${point.categorieLabel}</span>
        <h4>${point.titre}</h4>
        <p class="map-popup-lieu">📍 ${point.lieu}</p>
        <p>${point.description}</p>
      </div>
    `);
  });
}
// --- Vérification de certificat ---
// Ajoutez une entrée ici pour chaque certificat délivré.
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
    nom: "Bamba ibrahim",
    formation: "Géomatique, SIG & Cartographie",
    duree: "15 heures",
    niveau: "Débutant",
    lieu: "Abidjan, Présentiel",
    date: "30 juin 2026"
  },
  // Copiez ce bloc et modifiez-le pour chaque nouveau certificat.
];

const btnVerifier = document.getElementById('btnVerifier');
const inputCode = document.getElementById('codeCertificat');
const resultatDiv = document.getElementById('resultat');

function verifierCertificat() {
  const saisie = inputCode.value.trim().toUpperCase();

  if (!saisie) {
    resultatDiv.className = 'show invalide';
    resultatDiv.innerHTML = `<h3>Champ vide</h3><p>Veuillez entrer un code de certificat.</p>`;
    return;
  }

  const trouve = certificatsValides.find(c => c.code.toUpperCase() === saisie);

  if (trouve) {
    resultatDiv.className = 'show valide';
    resultatDiv.innerHTML = `
      <h3>Certificat authentique</h3>
      <p><strong>Titulaire :</strong> ${trouve.nom}</p>
      <p><strong>Formation :</strong> ${trouve.formation}</p>
      <p><strong>Durée :</strong> ${trouve.duree} — ${trouve.niveau}</p>
      <p><strong>Lieu :</strong> ${trouve.lieu}</p>
      <p><strong>Date :</strong> ${trouve.date}</p>
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

// --- Laisser un avis (envoi WhatsApp pour validation) ---

const btnLaisserAvis = document.getElementById('btnLaisserAvis');
const avisForm = document.getElementById('avisForm');

btnLaisserAvis?.addEventListener('click', () => {
  avisForm.classList.toggle('show');
});

avisForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const nom = document.getElementById('avisNom').value.trim();
  const formationSuivie = document.getElementById('avisFormation').value.trim();
  const messageAvis = document.getElementById('avisMessage').value.trim();

  const lines = [
    `Bonjour GeoExpert,`,
    `Je souhaite partager un avis sur ma formation.`,
    ``,
    `Nom : ${nom}`,
    `Formation suivie : ${formationSuivie}`,
    `Avis : ${messageAvis}`,
  ];

  const text = encodeURIComponent(lines.join('\n'));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener');
});
