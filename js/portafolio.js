const track = document.querySelector('.track');
const cards = [...document.querySelectorAll('.card')];
const glass = document.querySelector('.glass');
const gTitle = document.getElementById('g-title');
const gDesc = document.getElementById('g-desc');

const step = 380;                 // ancho de tarjeta (340) + gap (40)
const max = (cards.length - 1) * step;
const DELAY = 200;                // ms que la foto debe estar quieta
const DURACION = 700;             // ms de la expansión
let target = 0, current = 0, active = -1, settledSince = 0;

/* ---------- Elementos del shoot ---------- */
const shoot = document.getElementById('shoot');
const shootScroll = document.getElementById('shoot-scroll');
const volver = document.getElementById('volver');
const heroImg = document.getElementById('s-img');

// Foto "voladora" que crece desde la tarjeta
const viewer = document.createElement('div');
viewer.className = 'viewer';
viewer.innerHTML = '<img alt="">';
document.body.appendChild(viewer);
const viewerImg = viewer.querySelector('img');

let isOpen = false, busy = false, openIndex = -1;

const full = () => ({
  left: '0px', top: '0px',
  width: innerWidth + 'px', height: innerHeight + 'px',
  borderRadius: '0px'
});
const rectOf = el => {
  const r = el.getBoundingClientRect();
  return {
    left: r.left + 'px', top: r.top + 'px',
    width: r.width + 'px', height: r.height + 'px',
    borderRadius: '14px'
  };
};

// Anima la foto voladora de un rectángulo a otro
function fly(from, to) {
  Object.assign(viewer.style, from);
  viewer.classList.add('on');
  const anim = viewer.animate([from, to], {
    duration: DURACION,
    easing: 'cubic-bezier(.77, 0, .18, 1)'
  });
  Object.assign(viewer.style, to);       // estado final al terminar
  return anim.finished;
}

function fillShoot(s, src) {
  viewerImg.src = src;
  heroImg.src = src;
  heroImg.alt = s.title;
  document.getElementById('s-title').textContent = s.title;
  document.getElementById('s-sub').textContent = s.subtitle;
  document.getElementById('s-desc').textContent = s.desc;
  document.getElementById('s-cliente').textContent = s.cliente;
  document.getElementById('s-anio').textContent = s.anio;
  document.getElementById('s-servicio').textContent = s.servicio;

  const galeria = document.getElementById('s-galeria');
  galeria.innerHTML = '';
  (s.galeria || []).forEach(g => {
    const im = document.createElement('img');
    im.src = g;
    im.alt = s.title;
    im.loading = 'lazy';
    galeria.appendChild(im);
  });
}

async function openShoot(i) {
  if (isOpen || busy) return;
  const card = cards[i];
  const s = shoots[card.dataset.id];
  if (!s) {
    console.warn('No hay datos en shoots para:', card.dataset.id);
    return;
  }

  busy = true;
  isOpen = true;
  openIndex = i;

  const img = card.querySelector('img');
  fillShoot(s, img.currentSrc || img.src);
  const listo = heroImg.decode().catch(() => {});

  document.body.classList.add('abierto');
  history.pushState({ shoot: card.dataset.id }, '', '#' + card.dataset.id);

  await fly(rectOf(card), full());       // la foto crece
  await listo;

  // La capa del shoot queda justo debajo de la foto y luego se retira
  shootScroll.scrollTop = 0;
  shoot.classList.add('on');
  shoot.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    viewer.classList.remove('on');
    busy = false;
  }));
}

async function closeShoot() {
  if (!isOpen || busy) return;
  busy = true;

  const card = cards[openIndex];
  Object.assign(viewer.style, full());
  viewer.classList.add('on');            // la foto cubre todo...
  shoot.classList.remove('on');          // ...y se quita la capa debajo
  shoot.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('abierto');

  await fly(full(), rectOf(card));       // vuelve a su tarjeta
  viewer.classList.remove('on');
  isOpen = false;
  openIndex = -1;
  busy = false;
}

// Cerrar: botón, Esc o "atrás" del navegador
function pedirCierre() {
  if (!isOpen || busy) return;
  if (history.state && history.state.shoot) history.back();   // dispara popstate
  else closeShoot();
}
volver.addEventListener('click', pedirCierre);
window.addEventListener('keydown', e => { if (e.key === 'Escape') pedirCierre(); });
window.addEventListener('popstate', () => { if (isOpen) closeShoot(); });

// Clic: si la foto está enfocada abre el shoot; si no, el carrusel va hacia ella
cards.forEach((card, i) => {
  card.addEventListener('click', () => {
    if (isOpen) return;
    const centered = Math.abs(current - i * step) < step * 0.12;
    if (centered) openShoot(i);
    else target = i * step;
  });
});

/* ---------- Scroll ---------- */
window.addEventListener('wheel', e => {
  if (isOpen) return;
  target = Math.min(max, Math.max(0, target + e.deltaY));
}, { passive: true });

/* ---------- Animación ---------- */
function render() {
  const vel = Math.abs(target - current);

  current += (target - current) * 0.08;

  track.style.transform =
    `translateX(${window.innerWidth / 2 - 170 - current}px)`;

  cards.forEach((card, i) => {
    const d = (i * step - current) / step;
    const abs = Math.min(Math.abs(d), 2);
    card.style.transform =
      `rotateY(${d * -25}deg) translateZ(${-abs * 120}px) scale(${1 - abs * 0.08})`;
    card.style.filter = `grayscale(${Math.min(abs, 1)})`;
  });

  // Tarjeta glass: aparece cuando la foto está centrada y quieta
  const idx = Math.round(current / step);
  const centered = Math.abs(current - idx * step) < step * 0.12;

  if (vel < 10 && centered) {
    if (!settledSince) settledSince = performance.now();

    if (idx !== active && performance.now() - settledSince > DELAY) {
      active = idx;
      gTitle.textContent = cards[idx].dataset.title;
      gDesc.textContent = cards[idx].dataset.desc;
      glass.classList.add('visible');
    }
  } else {
    settledSince = 0;
    active = -1;
    glass.classList.remove('visible');
  }

  requestAnimationFrame(render);
}
render();