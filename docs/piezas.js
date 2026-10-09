// Piezas compartidas: las cápsulas (envases), la notita festoneada y las misceláneas flotantes.
(() => {
  'use strict';

  const COLORES = { azul: '#7aa1ff', rosa: '#f79ee1' };

  // ---------- envases (viewBox 200 x 220). La tapa va en <g class="tapa"> para animarla. ----------
  const sombra = '<ellipse class="sombra" cx="100" cy="208" rx="66" ry="8"/>';
  const ENVASES = [
    {
      id: 'frasco',
      nombre: 'Un frasco de vidrio',
      svg: sombra +
        '<g class="cuerpo">' +
          '<rect x="56" y="50" width="88" height="20" rx="6" fill="var(--azul)" class="tr"/>' +
          '<rect x="34" y="64" width="132" height="138" rx="32" fill="var(--azul)" class="tr"/>' +
          '<path d="M54 92v76" class="brillo"/>' +
          '<rect x="66" y="108" width="72" height="50" rx="10" fill="var(--crema)" class="tr"/>' +
          '<text x="102" y="142" class="envase__marca">p.</text>' +
        '</g>' +
        '<g class="tapa">' +
          '<rect x="46" y="24" width="108" height="32" rx="10" fill="var(--rosa)" class="tr"/>' +
          '<path d="M64 31v18M78 31v18M92 31v18M106 31v18M120 31v18M134 31v18" class="tr fino"/>' +
        '</g>',
    },
    {
      id: 'lata',
      nombre: 'Una lata sorpresa',
      svg: sombra +
        '<g class="cuerpo">' +
          '<path d="M48 58v134a52 14 0 0 0 104 0V58" fill="var(--rosa)" class="tr"/>' +
          '<path d="M48 104a52 14 0 0 0 104 0v44a52 14 0 0 1-104 0z" fill="var(--azul)" class="tr"/>' +
          '<text x="100" y="138" class="envase__marca">p.</text>' +
          '<path d="M62 80v12M62 172v10" class="brillo"/>' +
        '</g>' +
        '<g class="tapa">' +
          '<ellipse cx="100" cy="58" rx="52" ry="14" fill="var(--crema)" class="tr"/>' +
          '<ellipse cx="100" cy="58" rx="40" ry="9" class="tr fino"/>' +
          '<rect x="96" y="46" width="30" height="11" rx="5.5" fill="var(--crema)" class="tr fino"/>' +
        '</g>',
    },
    {
      id: 'sobre',
      nombre: 'Un sobre lacrado',
      svg: sombra +
        '<g class="cuerpo">' +
          '<rect x="20" y="78" width="160" height="116" rx="12" fill="var(--crema)" class="tr"/>' +
          '<path d="M22 190l66-50M178 190l-66-50" class="tr"/>' +
        '</g>' +
        '<g class="tapa">' +
          '<path d="M20 90a12 12 0 0 1 12-12h136a12 12 0 0 1 12 12l-70 56a16 16 0 0 1-20 0z" fill="var(--azul)" class="tr"/>' +
          '<circle cx="100" cy="140" r="20" fill="var(--rosa)" class="tr"/>' +
          '<text x="101" y="148" class="envase__marca envase__marca--chica">p.</text>' +
        '</g>',
    },
    {
      id: 'caja',
      nombre: 'Una cajita de regalo',
      svg: sombra +
        '<g class="cuerpo">' +
          '<rect x="40" y="98" width="120" height="100" rx="8" fill="var(--azul)" class="tr"/>' +
          '<rect x="88" y="98" width="24" height="100" fill="var(--rosa)" class="tr"/>' +
          '<path d="M54 116v28" class="brillo"/>' +
        '</g>' +
        '<g class="tapa">' +
          '<path d="M100 74c-30-34-58-8-28-2zM100 74c30-34 58-8 28-2z" fill="var(--azul)" class="tr"/>' +
          '<rect x="30" y="72" width="140" height="34" rx="8" fill="var(--rosa)" class="tr"/>' +
          '<rect x="88" y="72" width="24" height="34" fill="var(--azul)" class="tr"/>' +
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

  // ---------- misceláneas flotantes ----------
  // items: [{ t: 'pildora'|'reloj'|'chispa'|'luna'|'cerradura'|'onda'|'candado'|'arco', x, y, s, r? }]
  function decorar(cont, items) {
    if (!cont) return;
    cont.textContent = '';
    items.forEach((it, i) => {
      const el = document.createElement('span');
      el.className = 'deco__item';
      el.style.setProperty('--x', it.x);
      el.style.setProperty('--y', it.y);
      el.style.setProperty('--s', it.s + 'px');
      el.style.setProperty('--r0', (it.r ?? (i % 2 ? 12 : -14)) + 'deg');
      el.style.setProperty('--d', (5 + (i % 4) * 1.2) + 's');
      el.style.setProperty('--dl', (-(i * 0.9)).toFixed(1) + 's');
      el.style.setProperty('--fx', (i % 2 ? 6 : -6) + 'px');
      el.style.setProperty('--fy', (i % 3 ? -10 : -14) + 'px');
      el.style.setProperty('--fr', (i % 2 ? 12 : -10) + 'deg');
      el.innerHTML = '<svg viewBox="0 0 100 100"><use href="#d-' + it.t + '"/></svg>';
      cont.append(el);
    });
  }

  window.Piezas = { COLORES, ENVASES, envase, crearNota, pintarNota, escalarNota, decorar, limpiar };
})();
