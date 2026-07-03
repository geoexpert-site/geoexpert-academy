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
// --- Vidéo de présentation (chargement au clic, pas avant) ---
const presVideoFacade = document.getElementById('presVideoFacade');
presVideoFacade?.addEventListener('click', function () {
  const videoId = this.dataset.videoId;
  this.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1"
    title="Vidéo de présentation GeoExpert" frameborder="0" allowfullscreen
    allow="autoplay; encrypted-media"></iframe>`;
});

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
  }
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
    image: ""
  },
  {
    lat: 6.822850,
    lng: -5.275669,
    titre: "Système d'Information Géographique pour la gestion intégrée des lacs artificiels",
    description: "Conception et mise en œuvre d'un Système d'Information Géographique (SIG) dédié à l'analyse, au suivi et à la gestion intégrée des lacs artificiels de la ville de Yamoussoukro afin d'appuyer la prise de décision.",
    lieu: "Yamoussoukro",
    categorieLabel: "Projet SIG réalisé",
    type: "projet",
    image: ""
  },
  {
    lat: 7.704786,
    lng: -5.034898,
    titre: "Cartographie des villages non électrifiés et conception d'un SIG",
    description: "Collecte de données géographiques, géolocalisation des villages non électrifiés et développement d'un Système d'Information Géographique destiné à soutenir la planification des projets d'électrification rurale.",
    lieu: "Bouaké",
    categorieLabel: "Projet SIG réalisé",
    type: "projet",
    image: ""
  },
  {
    lat: 5.388291,
    lng: -3.986180,
    titre: "Développement d'une application WebSIG pour la gestion des données foncières",
    description: "Conception et développement d'une application WebSIG avec ArcGIS Online permettant la visualisation, la consultation et le partage sécurisé des données foncières via une interface web interactive.",
    lieu: "Cocody 7ᵉ Tranche, Abidjan",
    categorieLabel: "WebSIG",
    type: "projet",
    image: ""
  },
];

const typeColors = {
  formation: "#0092A6",
  projet: "#4B3F92",
  zone: "#A83C93"
};

const mapEl = document.getElementById('mapAbidjan');
if (mapEl && typeof L !== 'undefined') {
  const map = L.map('mapAbidjan').setView([6.2, -4.8], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  mapPoints.forEach(point => {
    const marker = L.circleMarker([point.lat, point.lng], {
      radius: 9,
      fillColor: typeColors[point.type] || "#0092A6",
      color: "#fff",
      weight: 2,
      fillOpacity: 0.9
    }).addTo(map);

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
