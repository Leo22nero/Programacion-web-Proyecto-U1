const shoots = {
  'terre-rouge': {
    title: 'Terre Rouge',
    subtitle: 'Fotografía · 2026',
    img: 'img/portafolios/portafolio-imagen1.png',
    desc: 'Aquí explicas el shoot: la idea, cómo se hizo, qué querías transmitir y cómo fue el proceso.',
    cliente: 'Nombre del cliente',
    anio: '2026',
    servicio: 'Fotografía de producto',
    galeria: [
      'img/portafolios/portafolio-imagen1.png',
      'img/portafolios/portafolio-imagen2.jpeg',
      'img/portafolios/portafolio-imagen3.jpeg'
    ]
  },
  'segundo-proyecto': {
    title: 'Segundo proyecto',
    subtitle: 'Fotografía · 2026',
    img: 'img/portafolios/portafolio-imagen2.jpeg',
    desc: 'Descripción del segundo proyecto.',
    cliente: 'Nombre del cliente',
    anio: '2026',
    servicio: 'Fotografía',
    galeria: [
      'img/portafolios/portafolio-imagen2.jpeg',
      'img/portafolios/portafolio-imagen3.jpeg'
    ]
  },
  'tercer-proyecto': {
    title: 'Tercer proyecto',
    subtitle: 'Fotografía · 2026',
    img: 'img/portafolios/portafolio-imagen3.jpeg',
    desc: 'Descripción del tercer proyecto.',
    cliente: 'Nombre del cliente',
    anio: '2026',
    servicio: 'Fotografía',
    galeria: [
      'img/portafolios/portafolio-imagen3.jpeg',
      'img/portafolios/portafolio-imagen1.png'
    ]
  }
};

const id = new URLSearchParams(location.search).get('id');
const s = shoots[id];

if (!s) {
  location.replace('Portafolios.html');   // id inválido: regresa al carrusel
} else {
  document.title = s.title + ' | Immersive Lens';

  const img = document.getElementById('s-img');
  img.src = s.img;
  img.alt = s.title;

  document.getElementById('s-title').textContent = s.title;
  document.getElementById('s-sub').textContent = s.subtitle;
  document.getElementById('s-desc').textContent = s.desc;
  document.getElementById('s-cliente').textContent = s.cliente;
  document.getElementById('s-anio').textContent = s.anio;
  document.getElementById('s-servicio').textContent = s.servicio;

  const galeria = document.getElementById('s-galeria');
  s.galeria.forEach(src => {
    const im = document.createElement('img');
    im.src = src;
    im.alt = s.title;
    im.loading = 'lazy';
    galeria.appendChild(im);
  });
}