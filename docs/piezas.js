// Piezas compartidas: las cápsulas (objetos 3D), la notita festoneada, las misceláneas y los fondos animados.
(() => {
  'use strict';

  const COLORES = { azul: '#7aa1ff', rosa: '#f79ee1' };

  // ---------- cápsulas: objetos 3D de runners, ciclistas, patinadores y cocineros ----------
  const ENVASES = [
    { id: 'zapatilla', nombre: 'Una zapatilla', para: 'para runners' },
    { id: 'casco', nombre: 'Un casco', para: 'para ciclistas' },
    { id: 'patin', nombre: 'Un patín', para: 'para quienes patinan' },
    { id: 'olla', nombre: 'Una olla', para: 'para quienes cocinan' },
    { id: 'botella', nombre: 'Una caramañola', para: 'para cualquier aventura' },
  ];
  const imgEnvase = (id) => `assets/capsulas/${id}.png`;

  function envase(id) {
    const e = ENVASES.find((x) => x.id === id) || ENVASES[0];
    const div = document.createElement('div');
    div.className = 'envase envase--' + e.id;
    div.innerHTML = '<span class="envase__aura"></span><img alt="" draggable="false" width="600" height="600">';
    div.querySelector('img').src = imgEnvase(e.id);
    return div;
  }

  // Objetos 3D que flotan por la pantalla (como en la intro de Spotify).
  // items: [{ id, x, y, s, r }]
  function flotantes(cont, items) {
    if (!cont) return;
    cont.textContent = '';
    items.forEach((it, i) => {
      const img = document.createElement('img');
      img.className = 'flotante';
      img.alt = '';
      img.src = imgEnvase(it.id);
      img.style.setProperty('--x', it.x);
      img.style.setProperty('--y', it.y);
      img.style.setProperty('--s', it.s + 'px');
      img.style.setProperty('--r', (it.r || 0) + 'deg');
      img.style.setProperty('--d', (5 + (i % 3) * 1.4) + 's');
      img.style.setProperty('--i', i);
      cont.append(img);
    });
  }

  // Cielo de estrellitas titilando, distinto en cada pantalla.
  function cielo(cont, semilla = 1, n = 26) {
    if (!cont) return;
    let x = semilla * 7919;
    const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
    cont.textContent = '';
    for (let i = 0; i < n; i++) {
      const e = document.createElement('i');
      e.style.left = (rnd() * 100).toFixed(1) + '%';
      e.style.top = (rnd() * 100).toFixed(1) + '%';
      e.style.setProperty('--t', (1.5 + rnd() * 3).toFixed(1) + 'px');
      e.style.setProperty('--d', (2 + rnd() * 3).toFixed(1) + 's');
      e.style.animationDelay = (-rnd() * 4).toFixed(1) + 's';
      cont.append(e);
    }
  }

  // Lluvia de puntos y flores (festejo del sellado).
  function confeti(cont, n = 34) {
    if (!cont) return;
    cont.textContent = '';
    const tipos = ['punto', 'punto-o', 'flor', 'aro', 'punto'];
    const colores = ['azul', 'crema', 'azul', 'crema', 'oscuro'];
    for (let i = 0; i < n; i++) {
      const it = { t: tipos[i % tipos.length], c: colores[(i * 3) % colores.length] };
      const el = document.createElement('span');
      el.className = 'confeti__pieza';
      el.style.left = ((i * 37) % 100) + '%';
      el.style.setProperty('--s', (8 + (i * 7) % 18) + 'px');
      el.style.setProperty('--d', (2.4 + (i % 5) * .5) + 's');
      el.style.setProperty('--dl', (-(i % 9) * .35) + 's');
      el.style.setProperty('--gx', ((i % 2 ? 1 : -1) * (10 + (i * 13) % 40)) + 'px');
      el.innerHTML = '<svg viewBox="0 0 100 100">' + forma(it) + '</svg>';
      cont.append(el);
    }
  }

  // ---------- la notita (misma construcción que dedicatorias post.) ----------
  const DIM = { S: 619, M: 956, L: 1044 };
  const limpiar = (s) => String(s || '').replace(/\s+/g, ' ').trim();
  const talle = (largo) => (largo <= 40 ? 'S' : largo <= 110 ? 'M' : 'L');
  const rgba = (hex, a) =>
    `rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)}, ${a})`;

  function crearNota() {
    const wrap = document.createElement('div');
    wrap.className = 'nota-wrap';
    wrap.innerHTML =
      '<div class="nota"><div class="nota__para"><span>para: </span><span class="nota__nombre"></span></div>' +
      '<p class="nota__msg"></p><span class="nota__fecha"></span></div>';
    return wrap;
  }

  function pintarNota(wrap, d, { placeholder = false } = {}) {
    const nota = wrap.firstElementChild;
    const para = limpiar(d.para);
    const msg = limpiar(d.mensaje);
    nota.dataset.talle = talle(msg.length);
    nota.style.setProperty('--nota-bg', rgba(COLORES[d.color] || COLORES.azul, 0.8));
    nota.classList.toggle('vacia', placeholder && !msg);
    nota.querySelector('.nota__nombre').textContent = para || (placeholder ? '···' : '');
    nota.querySelector('.nota__msg').textContent = msg || (placeholder ? 'Tu mensaje va a aparecer acá.' : '');
    nota.querySelector('.nota__fecha').textContent = d.fecha || '';
  }

  // Ajusta --u (px por unidad de diseño) para que la nota entre en maxW x maxH.
  function escalarNota(wrap, maxW, maxH, maxU = 0.3) {
    const nota = wrap.firstElementChild;
    const t = nota.dataset.talle || 'M';
    // Sin transición mientras se mide: si no, el alto sale del ancho viejo.
    nota.style.transition = 'none';
    let u = Math.max(0.05, Math.min(maxW / DIM[t], maxU));
    wrap.style.setProperty('--u', u.toFixed(4) + 'px');
    const alto = wrap.firstElementChild.offsetHeight;
    if (alto > maxH) {
      u *= maxH / alto;
      wrap.style.setProperty('--u', u.toFixed(4) + 'px');
    }
    void nota.offsetWidth;
    nota.style.transition = '';
  }

  // ---------- misceláneas: mezcla de los puntos de SPOT! y las flores/puntos de post. ----------
  // Flor festoneada como las de la pieza post.
  function florPath(puntas = 11, radio = 42, amp = 5) {
    let d = '';
    for (let i = 0; i <= 180; i++) {
      const a = (i / 180) * Math.PI * 2;
      const r = radio + amp * Math.cos(puntas * a);
      d += (i ? 'L' : 'M') + (50 + r * Math.cos(a)).toFixed(2) + ' ' + (50 + r * Math.sin(a)).toFixed(2);
    }
    return d + 'Z';
  }
  const FLOR = { 11: florPath(11), 8: florPath(8, 40, 6) };
  const COL = { azul: 'var(--azul)', rosa: 'var(--rosa)', crema: 'var(--crema)', oscuro: 'var(--oscuro)' };

  // t: 'punto' (SPOT!: color con borde), 'punto-o' (post.: oscuro con borde de color),
  //    'aro', 'flor' (oscura con borde de color), 'flor-hueca' (solo contorno). c: azul | rosa | crema
  function forma(it) {
    const c = COL[it.c || 'azul'];
    switch (it.t) {
      case 'punto':
        return `<circle cx="50" cy="50" r="42" fill="${c}" stroke="var(--oscuro)" stroke-width="9"/>`;
      case 'punto-o':
        return `<circle cx="50" cy="50" r="40" fill="var(--oscuro)" stroke="${c}" stroke-width="12"/>`;
      case 'aro':
        return `<circle cx="50" cy="50" r="40" fill="none" stroke="${it.c ? c : 'var(--oscuro)'}" stroke-width="9"/>`;
      case 'flor':
        return `<path d="${FLOR[it.p || 11]}" fill="var(--oscuro)" stroke="${c}" stroke-width="7" stroke-linejoin="round"/>`;
      default: // flor-hueca
        return `<path d="${FLOR[it.p || 11]}" fill="none" stroke="${it.c ? c : 'var(--oscuro)'}" stroke-width="6" stroke-linejoin="round"/>`;
    }
  }

  // items: [{ t, x, y, s, c?, p? }]
  function decorar(cont, items) {
    if (!cont) return;
    cont.textContent = '';
    items.forEach((it, i) => {
      const el = document.createElement('span');
      el.className = 'deco__item deco__' + it.t;
      el.style.setProperty('--x', it.x);
      el.style.setProperty('--y', it.y);
      el.style.setProperty('--s', it.s + 'px');
      el.style.setProperty('--d', (4.5 + (i % 4) * 1.2) + 's');
      el.style.setProperty('--dl', (-(i * 0.9)).toFixed(1) + 's');
      el.style.setProperty('--fx', (i % 2 ? 7 : -7) + 'px');
      el.style.setProperty('--fy', (i % 3 ? -12 : -18) + 'px');
      el.style.setProperty('--i', i);
      el.innerHTML = '<svg viewBox="0 0 100 100">' + forma(it) + '</svg>';
      cont.append(el);
    });
  }

  // Genera una mezcla repetible (misma semilla = mismo dibujo), pegada a los bordes para no tapar el texto.
  const TIPOS = [
    { t: 'flor', s: [30, 44] }, { t: 'punto', s: [10, 18] }, { t: 'aro', s: [14, 24] },
    { t: 'punto-o', s: [12, 22] }, { t: 'flor-hueca', s: [28, 40] }, { t: 'punto', s: [16, 26] },
    { t: 'flor', s: [22, 30], p: 8 }, { t: 'punto', s: [8, 12] },
  ];
  function mezcla(semilla, n = 7, { y0 = 4, y1 = 92 } = {}) {
    let x = semilla * 9301 + 49297;
    const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: n }, (_, i) => {
      const tipo = TIPOS[(i + semilla) % TIPOS.length];
      const izq = i % 2 === 0;
      return {
        t: tipo.t,
        p: tipo.p,
        s: Math.round(tipo.s[0] + rnd() * (tipo.s[1] - tipo.s[0])),
        c: ['azul', 'rosa', 'azul', 'crema', 'rosa'][(i + semilla) % 5],
        x: (izq ? 2 + rnd() * 16 : 76 + rnd() * 16).toFixed(1) + '%',
        y: (y0 + ((i + rnd() * 0.8) / n) * (y1 - y0)).toFixed(1) + '%',
      };
    });
  }

  window.Piezas = { COLORES, ENVASES, envase, imgEnvase, flotantes, cielo, confeti, crearNota, pintarNota, escalarNota, decorar, mezcla, limpiar };
})();
