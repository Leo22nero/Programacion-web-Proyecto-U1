const track = document.querySelector('.track');
const cards = [...document.querySelectorAll('.card')];
const glass = document.querySelector('.glass');
const gTitle = document.getElementById('g-title');
const gDesc = document.getElementById('g-desc');

const step = 380;                 // ancho de tarjeta (340) + gap (40)
const max = (cards.length - 1) * step;
const DELAY = 200;                // ms que la foto debe estar quieta
let target = 0, current = 0, active = -1, settledSince = 0;

window.addEventListener('wheel', e => {
  target = Math.min(max, Math.max(0, target + e.deltaY));
}, { passive: true });

// Clic en una foto: el carrusel se desliza hasta ella
cards.forEach((card, i) => {
  card.addEventListener('click', () => { target = i * step; });
});

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