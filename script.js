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

  const text = encodeURIComponent(
    `Bonjour GeoExpert,\nJe suis ${profile} et le simulateur du site m'a recommandé : ${data.formation}.\nJe souhaite en savoir plus.`
  );
  document.getElementById('simResultCta').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

  simResult.classList.add('show');
});
