// Piezas compartidas: las cápsulas deportivas, la notita festoneada y las misceláneas flotantes.
(() => {
  'use strict';

  const COLORES = { azul: '#7aa1ff', rosa: '#f79ee1' };

  // ---------- envases deportivos (viewBox 200 x 220). La tapa va en <g class="tapa"> para animarla. ----------
  const sombra = '<ellipse class="sombra" cx="100" cy="208" rx="66" ry="8"/>';
  const ENVASES = [
    {
      id: 'locker',
      nombre: 'Un casillero del vestuario',
      svg: sombra +
        '<g class="cuerpo">' +
          '<rect x="42" y="16" width="116" height="188" rx="12" fill="var(--azul)" class="tr"/>' +
          '<rect x="54" y="28" width="92" height="164" rx="6" fill="var(--oscuro)"/>' +
          '<path d="M58 92h84" stroke="var(--crema)" stroke-width="4" stroke-linecap="round" opacity=".5"/>' +
          '<rect x="64" y="58" width="30" height="34" rx="4" fill="var(--rosa)" class="tr fino"/>' +
          '<circle cx="118" cy="150" r="16" fill="var(--azul)" class="tr fino"/>' +
        '</g>' +
        '<g class="tapa">' +
          '<rect x="54" y="28" width="92" height="164" rx="6" fill="var(--azul)" class="tr"/>' +
          '<path d="M72 46h56M72 56h56M72 66h56" class="tr fino"/>' +
          '<rect x="80" y="84" width="40" height="20" rx="5" fill="var(--crema)" class="tr fino"/>' +
          '<text x="100" y="99" class="envase__num">07</text>' +
          '<path d="M66 120v40" class="brillo"/>' +
          '<g class="dial"><circle cx="126" cy="140" r="14" fill="var(--rosa)" class="tr"/><path d="M126 130v8" class="tr fino"/></g>' +
        '</g>',
    },
    {
      id: 'botella',
      nombre: 'Una caramañola',
      svg: sombra +
        '<g class="cuerpo">' +
          '<path d="M60 76c0-12 8-18 18-18h44c10 0 18 6 18 18v112c0 10-8 16-18 16H78c-10 0-18-6-18-16z" fill="var(--rosa)" class="tr"/>' +
          '<path d="M60 112c26 8 54 8 80 0v40c-26 8-54 8-80 0z" fill="var(--azul)" class="tr"/>' +
          '<text x="100" y="140" class="envase__marca">stop.</text>' +
          '<path d="M74 82v18M74 166v20" class="brillo"/>' +
          '<circle class="burbuja" cx="88" cy="186" r="4"/><circle class="burbuja b2" cx="112" cy="190" r="3"/><circle class="burbuja b3" cx="100" cy="184" r="2.5"/>' +
        '</g>' +
        '<g class="tapa">' +
          '<path d="M128 46c22 0 22 26 2 26" class="tr"/>' +
          '<rect x="72" y="38" width="56" height="24" rx="7" fill="var(--azul)" class="tr"/>' +
          '<rect x="90" y="16" width="20" height="24" rx="6" fill="var(--crema)" class="tr"/>' +
          '<path d="M84 44v12M96 44v12M108 44v12M120 44v12" class="tr fino"/>' +
        '</g>',
    },
    {
      id: 'pelota',
      nombre: 'Una pelota que se abre',
      svg: sombra +
        '<g class="rebota">' +
          '<g class="cuerpo">' +
            '<path d="M34 128a66 66 0 0 0 132 0z" fill="var(--azul)" class="tr"/>' +
            '<path d="M100 128v66M56 128c0 22 10 42 26 56M144 128c0 22-10 42-26 56" class="tr fino"/>' +
            '<path d="M48 138c4 20 16 36 34 46" class="brillo"/>' +
          '</g>' +
          '<g class="tapa">' +
            '<path d="M34 128a66 66 0 0 1 132 0z" fill="var(--rosa)" class="tr"/>' +
            '<path d="M100 62v66M56 128c0-22 10-42 26-56M144 128c0-22-10-42-26-56" class="tr fino"/>' +
            '<path d="M58 98c6-14 16-24 30-30" class="brillo"/>' +
          '</g>' +
        '</g>',
    },
    {
      id: 'trofeo',
      nombre: 'Un trofeo con tapa',
      svg: sombra +
        '<g class="cuerpo">' +
          '<path d="M62 84H46c-10 0-12 10-10 18 4 16 18 24 34 26M138 84h16c10 0 12 10 10 18-4 16-18 24-34 26" class="tr" style="stroke-width:7"/>' +
          '<path d="M60 74h80v30c0 26-18 42-40 42s-40-16-40-42z" fill="var(--rosa)" class="tr"/>' +
          '<path d="M74 88v16c0 10 4 18 10 24" class="brillo destello"/>' +
          '<rect x="90" y="144" width="20" height="22" fill="var(--azul)" class="tr"/>' +
          '<rect x="64" y="164" width="72" height="16" rx="5" fill="var(--azul)" class="tr"/>' +
          '<rect x="54" y="178" width="92" height="26" rx="6" fill="var(--oscuro)" class="tr"/>' +
          '<text x="100" y="197" class="envase__marca envase__marca--clara">stop.</text>' +
        '</g>' +
        '<g class="tapa">' +
          '<path d="M56 76c10-28 78-28 88 0z" fill="var(--azul)" class="tr"/>' +
          '<circle cx="100" cy="46" r="9" fill="var(--crema)" class="tr"/>' +
        '</g>',
    },
  ];

  function envase(id) {
    const e = ENVASES.find((x) => x.id === id) || ENVASES[0];
    const div = document.createElement('div');
    div.className = 'envase envase--' + e.id;
    div.innerHTML = '<svg viewBox="0 0 200 220" aria-hidden="true">' + e.svg + '</svg>';
    return div;
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

  window.Piezas = { COLORES, ENVASES, envase, crearNota, pintarNota, escalarNota, decorar, mezcla, limpiar };
})();
