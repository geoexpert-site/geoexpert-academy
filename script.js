// ==========================================================
// GeoExpert Academy — script principal
// ==========================================================

// --- Menu mobile ---
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle?.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

// Ferme le menu mobile après un clic sur un lien
mainNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

// --- Petit ticker de coordonnées dans le hero (clin d'oeil géomatique) ---
const coordsEl = document.getElementById('heroCoords');
if (coordsEl) {
  const baseLat = 5.336;   // Abidjan approx.
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
