// Piezas compartidas: las cápsulas de vidrio, los stickers, la notita festoneada, las misceláneas y los fondos animados.
(() => {
  'use strict';

  const COLORES = { azul: '#7aa1ff', rosa: '#f79ee1' };

  // ---------- cápsulas de vidrio que se llenan de stickers ----------
  // Cada cápsula son dos imágenes alineadas (fondo y vidrio de adelante); los stickers van en el medio.
  // zona = [x0, y0, x1, y1] en % de la caja: dónde se apilan. mascara = recortar al interior.
  const CAPSULAS = [
    { id: 'trofeo', nombre: 'Un trofeo', para: 'para tus logros', zona: [24, 8, 76, 50], mascara: true },
    { id: 'sobre', nombre: 'Un sobre', para: 'para tus mensajes', zona: [22, 16, 80, 66], mascara: false },
    { id: 'botella', nombre: 'Una botella de agua', para: 'para cada entrenamiento', zona: [30, 24, 74, 90], mascara: true },
  ];
  const ENVASES = CAPSULAS; // compatibilidad
  const imgCapa = (id, capa) => `assets/capsulas/${id}-${capa}.png`;

  function envase(id) {
    const c = CAPSULAS.find((x) => x.id === id) || CAPSULAS[0];
    const div = document.createElement('div');
    div.className = 'envase capsula capsula--' + c.id;
    div.dataset.id = c.id;
    div.innerHTML =
      '<img class="capsula__atras" alt="" draggable="false" width="600" height="600">' +
      '<div class="capsula__relleno"></div>' +
      '<img class="capsula__frente" alt="" draggable="false" width="600" height="600">';
    div.querySelector('.capsula__atras').src = imgCapa(c.id, 'atras');
    div.querySelector('.capsula__frente').src = imgCapa(c.id, 'frente');
    if (c.mascara) div.querySelector('.capsula__relleno').style.setProperty('--mascara', `url(${imgCapa(c.id, 'atras')})`);
    return div;
  }

  // ---------- stickers estilo post ----------
  const TIPOS_ST = ['globo', 'pastilla', 'flor', 'circulo'];
  const COLORES_ST = ['azul', 'crema', 'oscuro', 'rosa'];
  function sticker({ txt, tipo = 'pastilla', color = 'azul' }) {
    const el = document.createElement('span');
    el.className = `st st--${tipo} st--${color}`;
    if (tipo === 'flor') el.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${FLOR[11]}"/></svg>`;
    const t = document.createElement('span');
    t.className = 'st__txt';
    t.textContent = txt;
    el.append(t);
    return el;
  }

  let semillaSt = 7;
  const rnd = () => ((semillaSt = (semillaSt * 9301 + 49297) % 233280) / 233280);

  // Apila los stickers de abajo hacia arriba dentro de la zona de la cápsula.
  // animar: los nuevos caen desde arriba. desde: índice a partir del cual animar.
  function llenar(cap, items, { animar = true, desde = 0, demora = 0 } = {}) {
    const c = CAPSULAS.find((x) => x.id === cap.dataset.id);
    const rel = cap.querySelector('.capsula__relleno');
    const [x0, y0, x1, y1] = c.zona;
    const cols = 2;
    const altoFila = Math.min(12, (y1 - y0) / Math.max(3, Math.ceil(items.length / cols)));
    [...rel.children].slice(desde).forEach((n) => n.remove());
    semillaSt = 7 + desde * 13;
    items.slice(desde).forEach((it, k) => {
      const i = desde + k;
      const fila = Math.floor(i / cols), col = i % cols;
      const ancho = (x1 - x0) / cols;
      const x = x0 + ancho * (col + .5) + (rnd() - .5) * ancho * .5 + (fila % 2 ? ancho * .18 : -ancho * .1);
      const y = y1 - altoFila * (fila + .55) + (rnd() - .5) * 3;
      const r = Math.round((rnd() - .5) * 50);
      const el = sticker(it);
      el.style.setProperty('--x', x.toFixed(1) + '%');
      el.style.setProperty('--y', Math.max(y0, y).toFixed(1) + '%');
      el.style.setProperty('--r', r + 'deg');
      rel.append(el);
      if (animar && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const alto = cap.clientHeight || 300;
        el.animate([
          { transform: `translate(-50%, -50%) translateY(${-alto * .9}px) rotate(${r - 120}deg)`, opacity: 0 },
          { transform: `translate(-50%, -50%) translateY(${-alto * .5}px) rotate(${r - 60}deg)`, opacity: 1, offset: .25 },
          { transform: `translate(-50%, -50%) translateY(8px) rotate(${r + 8}deg)`, offset: .78 },
          { transform: `translate(-50%, -50%) rotate(${r}deg)` },
        ], { duration: 850, delay: demora + k * 160, easing: 'cubic-bezier(.45,0,.4,1)', fill: 'backwards' });
      }
    });
  }

  // Hace saltar los stickers fuera de la cápsula (apertura).
  function vaciar(cap) {
    const rel = cap.querySelector('.capsula__relleno');
    rel.style.setProperty('--mascara', 'none');
    [...rel.children].forEach((el, i) => {
      const r = parseFloat(el.style.getPropertyValue('--r')) || 0;
      const dx = (i % 2 ? 1 : -1) * (60 + (i * 37) % 120);
      el.animate([
        { transform: `translate(-50%, -50%) rotate(${r}deg)` },
        { transform: `translate(-50%, -50%) translate(${dx * .4}px, -160px) rotate(${r + 90}deg) scale(1.3)`, offset: .45 },
        { transform: `translate(-50%, -50%) translate(${dx}px, -60px) rotate(${r + 200}deg) scale(1.5)`, opacity: 0 },
      ], { duration: 1100, delay: i * 60, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
    });
  }

  // Collage de stickers motivacionales superpuestos (pantallas de carga y explicación).
  const FRASES = [
    { txt: '¡vos podés!', tipo: 'flor', color: 'azul' },
    { txt: 'un paso a la vez', tipo: 'globo', color: 'crema' },
    { txt: 'stop.', tipo: 'circulo', color: 'rosa' },
    { txt: 'constancia', tipo: 'pastilla', color: 'azul' },
    { txt: 'respirá y seguí', tipo: 'globo', color: 'rosa' },
    { txt: '¡dale!', tipo: 'flor', color: 'rosa' },
    { txt: 'tu mejor versión', tipo: 'pastilla', color: 'crema' },
    { txt: 'nos vemos el 27/10', tipo: 'pastilla', color: 'azul' },
    { txt: '+1', tipo: 'circulo', color: 'crema' },
    { txt: 'a tu ritmo', tipo: 'pastilla', color: 'rosa' },
    { txt: 'ya arrancaste', tipo: 'globo', color: 'oscuro' },
    { txt: '¡genial!', tipo: 'pastilla', color: 'azul' },
  ];
  const POS_COLLAGE = [[50, 46, -8], [34, 28, 12], [68, 26, -14], [34, 64, -10], [66, 66, 9], [52, 14, 6], [50, 82, -4], [26, 46, -20], [74, 46, 16], [42, 38, 18], [60, 54, -16], [48, 62, 4]];
  // nuevosDesde: los anteriores ya están y no se vuelven a animar.
  function collage(cont, { n = 9, desde = 0, intervalo = 170, nuevosDesde = 0 } = {}) {
    if (!cont) return;
    cont.textContent = '';
    const red = matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (let i = 0; i < n; i++) {
      const f = FRASES[(desde + i) % FRASES.length];
      const [x, y, r] = POS_COLLAGE[i % POS_COLLAGE.length];
      const el = sticker(f);
      el.classList.add('st--grande');
      el.style.setProperty('--x', x + '%');
      el.style.setProperty('--y', y + '%');
      el.style.setProperty('--r', r + 'deg');
      el.style.setProperty('--i', i);
      cont.append(el);
      if (!red && i >= nuevosDesde) el.animate([
        { transform: `translate(-50%, -50%) rotate(${r - 30}deg) scale(0)` },
        { transform: `translate(-50%, -50%) rotate(${r + 6}deg) scale(1.15)`, offset: .7 },
        { transform: `translate(-50%, -50%) rotate(${r}deg) scale(1)` },
      ], { duration: 520, delay: (i - nuevosDesde) * intervalo, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'backwards' });
    }
  }

  // Insignia "Viaje en el tiempo": despertador hecho de puntos, como el panda de post.
  function insigniaReloj() {
    const C = [100, 112], R = 64, P = 7, r = 2.7;
    const pts = [];
    const dentro = (x, y) => {
      const d = Math.hypot(x - C[0], y - C[1]);
      if (d >= R - 15 && d <= R) return true;                            // aro
      for (const bx of [56, 144]) if (Math.hypot(x - bx, y - 46) <= 17 && y < 52) return true; // campanas
      for (let k = 0; k < 12; k++) {                                     // marcas de las horas
        const a = (k / 12) * Math.PI * 2, largo = k % 3 ? 4 : 10;
        for (let t = 0; t <= largo; t += 3) {
          const px = C[0] + Math.sin(a) * (R - 22 - t), py = C[1] - Math.cos(a) * (R - 22 - t);
          if (Math.hypot(x - px, y - py) < 3.6) return true;
        }
      }
      if (Math.hypot(x - C[0], y - C[1]) < 6) return true;               // centro
      if (y > 172 && y < 186 && (Math.abs(x - 62) < 8 || Math.abs(x - 138) < 8)) return true; // patas
      return false;
    };
    for (let y = 24; y <= 190; y += P) for (let x = 24; x <= 176; x += P) if (dentro(x, y)) pts.push(`<circle cx="${x}" cy="${y}" r="${r}"/>`);
    const aguja = (largo) => {
      let d = '';
      for (let t = 10; t <= largo; t += P) d += `<circle cx="${C[0]}" cy="${C[1] - t}" r="${r}"/>`;
      return d;
    };
    return '<svg viewBox="0 0 200 200" class="insignia" aria-hidden="true">' +
      // silueta del sticker: borde crema grueso y relleno de color
      '<g class="insignia__borde">' +
        `<circle cx="${C[0]}" cy="${C[1]}" r="${R + 4}"/><circle cx="56" cy="46" r="21"/><circle cx="144" cy="46" r="21"/>` +
        '<rect x="52" y="168" width="20" height="22" rx="8"/><rect x="128" y="168" width="20" height="22" rx="8"/>' +
      '</g>' +
      '<g class="insignia__fondo">' +
        `<circle cx="${C[0]}" cy="${C[1]}" r="${R + 4}"/><circle cx="56" cy="46" r="21"/><circle cx="144" cy="46" r="21"/>` +
        '<rect x="52" y="168" width="20" height="22" rx="8"/><rect x="128" y="168" width="20" height="22" rx="8"/>' +
      '</g>' +
      `<g class="insignia__puntos">${pts.join('')}</g>` +
      `<g class="insignia__puntos aguja aguja--hora">${aguja(30)}</g>` +
      `<g class="insignia__puntos aguja aguja--min">${aguja(46)}</g>` +
    '</svg>';
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

  window.Piezas = { COLORES, CAPSULAS, insigniaReloj, ENVASES, envase, sticker, llenar, vaciar, collage, cielo, confeti, crearNota, pintarNota, escalarNota, decorar, mezcla, limpiar };
})();
