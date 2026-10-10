// Cápsula del tiempo de stop. (evento de post.): sellar (4 pasos) → esperar al próximo evento → abrir y comparar.
(() => {
  'use strict';

  const CFG = window.CAPSULA_CONFIG;
  const P = window.Piezas;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const REDUCIDO = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DEMO = CFG.DEMO || new URLSearchParams(location.search).has('demo');
  const KEY = 'stop-capsula-v4';
  const DIA = 864e5;
  const MAX = 6; // objetivos por cápsula

  // ---------- datos ----------
  const leer = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify(datos)); } catch { /* sin storage */ } };
  const datos = leer();
  datos.historial ||= [];

  const objetivo = (id) => CFG.OBJETIVOS.find((o) => o.id === id);
  const fmt = (n) => Number(n).toLocaleString('es-AR', { maximumFractionDigits: 1 });
  // "la próxima edición de stop." + "." no debe quedar con dos puntos.
  const punto = (s) => (/[.!?]$/.test(s) ? s : s + '.');
  const fecha = (iso, opc = { day: 'numeric', month: 'long', year: 'numeric' }) =>
    new Date(iso).toLocaleDateString('es-AR', opc);

  let borrador = nuevoBorrador();

  // Lo que entra a la cápsula: un sticker por objetivo y otro con la meta; la nota y el logo al final.
  const ESTILOS = [['globo', 'crema'], ['pastilla', 'oscuro'], ['pastilla', 'azul'], ['globo', 'rosa'], ['pastilla', 'crema'], ['globo', 'azul']];
  function stickersDe(b, { nota = false } = {}) {
    const lista = [];
    b.objetivos.forEach((o, i) => {
      const def = objetivo(o.id);
      const [tipo, color] = ESTILOS[i % ESTILOS.length];
      lista.push({ txt: def.nombre, tipo, color });
      lista.push({ txt: `${fmt(o.meta)} ${def.corto}`, tipo: i % 2 ? 'circulo' : 'pastilla', color: i % 2 ? 'crema' : 'azul' });
      // Entre los stickers de texto se cuela una carita o una estrella.
      if (i % 2 === 0) lista.push(CARITAS[(i / 2) % CARITAS.length]);
    });
    if (nota && b.cancion) lista.push({ txt: '♪ ' + b.cancion.titulo, tipo: 'pastilla', color: 'rosa' });
    if (nota) lista.push({ txt: 'nota', tipo: 'globo', color: 'crema' }, { tipo: 'estrella', color: 'rosa' }, { txt: 'stop.', tipo: 'flor', color: 'azul' });
    return lista;
  }
  const CARITAS = [
    { tipo: 'cara', cara: 'gafas', color: 'azul' },
    { tipo: 'cara', cara: 'puntos', color: 'rosa' },
    { tipo: 'cara', cara: 'canchera', color: 'crema' },
    { tipo: 'cara', cara: 'dormida', color: 'azul' },
    { tipo: 'cara', cara: 'sonadora', color: 'azul' },
  ];
  const MUESTRA = [
    { txt: 'correr', tipo: 'globo', color: 'crema' }, { txt: '10 km', tipo: 'pastilla', color: 'azul' },
    CARITAS[4], { txt: '¡dale!', tipo: 'flor', color: 'oscuro' }, { txt: 'pedalear', tipo: 'pastilla', color: 'crema' },
    { tipo: 'estrella', color: 'rosa' }, { txt: '4 días', tipo: 'globo', color: 'azul' }, CARITAS[1],
    { txt: 'stop.', tipo: 'circulo', color: 'rosa' }, { txt: 'patinar', tipo: 'pastilla', color: 'oscuro' },
  ];
  // Cápsula llena con lo que eligió (o la muestra) dentro de un contenedor.
  function capsulaLlena(slot, id, items, opc = { animar: false }) {
    slot.textContent = '';
    const cap = P.envase(id);
    slot.append(cap);
    requestAnimationFrame(() => P.llenar(cap, items, opc));
    return cap;
  }
  function nuevoBorrador(objetivos = []) {
    return { envase: 'trofeo', objetivos, cancion: null, para: 'mi yo del futuro', mensaje: '', color: 'azul' };
  }

  function estadoCapsula() {
    const c = datos.capsula;
    if (!c) return 'vacio';
    if (c.abierta) return 'abierta';
    return c.simulada || Date.now() >= new Date(c.abreEn).getTime() ? 'lista' : 'sellada';
  }

  // ---------- navegación ----------
  const pantallas = Object.fromEntries($$('.pantalla').map((p) => [p.id.slice(2), p]));
  let actual = pantallas.inicio;
  const pila = [];
  const COLOR_TEMA = { azul: '#7aa1ff', rosa: '#f79ee1', crema: '#ede8db', negro: '#1d1d1f' };

  // El fondo de la página acompaña el color de la pantalla.
  function aplicarTema(tema) {
    document.body.dataset.tema = tema;
    $('meta[name="theme-color"]').content = COLOR_TEMA[tema];
  }

  async function ir(id, { atras = false } = {}) {
    const desde = actual;
    const hacia = pantallas[id];
    if (desde === hacia) return;
    if (!atras) pila.push(desde.id.slice(2));
    actual = hacia;
    al[id]?.();
    aplicarTema(hacia.dataset.tema);
    hacia.hidden = false;
    desde.classList.add('saliendo');
    hacia.classList.add('entrando');
    window.scrollTo(0, 0);
    if (!REDUCIDO) {
      desde.animate({ opacity: [1, 0] }, { duration: 140, fill: 'forwards' });
      $$('[data-anim]', hacia).forEach((el, i) => {
        el.animate(
          { opacity: [0, 1], transform: [`translateY(${atras ? -14 : 14}px)`, 'none'] },
          { duration: 420, delay: 60 + i * 45, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' },
        );
      });
      await new Promise((r) => setTimeout(r, 150));
    }
    desde.hidden = true;
    desde.getAnimations().forEach((a) => a.cancel());
    desde.classList.remove('saliendo');
    hacia.classList.remove('entrando');
    $('h1', hacia)?.focus({ preventScroll: true });
  }
  const volver = () => ir(pila.pop() || 'inicio', { atras: true });
  $$('[data-volver]').forEach((b) => b.addEventListener('click', volver));

  const al = {}; // hooks al entrar a cada pantalla

  // Pantalla de carga con stickers motivacionales; se puede omitir.
  function cargar(texto, ms = 2800) {
    const carga = $('#carga');
    $('#carga-texto').textContent = texto;
    P.collage($('#collage-carga'), { n: 9, desde: Math.floor(Math.random() * 12), intervalo: Math.min(220, ms / 12) });
    carga.hidden = false;
    aplicarTema('negro');
    const barra = $('.carga__barra i', carga);
    const anim = barra.animate({ transform: ['scaleX(0)', 'scaleX(1)'] }, { duration: ms, easing: 'linear', fill: 'forwards' });
    if (!REDUCIDO) carga.animate({ opacity: [0, 1] }, { duration: 200 });
    $('#carga-omitir').focus({ preventScroll: true });
    return new Promise((listo) => {
      const fin = () => { clearTimeout(t); $('#carga-omitir').onclick = null; anim.cancel(); carga.hidden = true; listo(); };
      const t = setTimeout(fin, ms);
      $('#carga-omitir').onclick = fin;
    });
  }

  function sacudir(el) {
    el.classList.remove('sacudir');
    void el.offsetWidth;
    el.classList.add('sacudir');
  }
  document.addEventListener('animationend', (e) => e.target.classList?.remove('sacudir'));

  // ---------- misceláneas, estrellitas y objetos flotantes ----------
  $$('.cielo').forEach((c, i) => P.cielo(c, i + 1));
  [
    { id: 'trofeo', x: '-6%', y: '0%', s: 150, r: -14, items: MUESTRA.slice(0, 5) },
    { id: 'botella', x: '72%', y: '-4%', s: 140, r: 16, items: MUESTRA.slice(2, 7) },
    { id: 'sobre', x: '64%', y: '58%', s: 150, r: -8, items: MUESTRA.slice(1, 6) },
  ].forEach((f, i) => {
    const cap = P.envase(f.id);
    cap.style.setProperty('--x', f.x);
    cap.style.setProperty('--y', f.y);
    cap.style.setProperty('--s', f.s + 'px');
    cap.style.setProperty('--r', f.r + 'deg');
    cap.style.setProperty('--d', (5 + i * 1.3) + 's');
    cap.style.setProperty('--i', i);
    $('#flot-inicio').append(cap);
    requestAnimationFrame(() => P.llenar(cap, f.items, { animar: true, demora: 500 + i * 300 }));
  });
  P.decorar($('#deco-inicio'), [
    { t: 'flor', x: '40%', y: '0%', s: 34, c: 'rosa' },
    { t: 'punto', x: '28%', y: '30%', s: 14, c: 'crema' },
    { t: 'aro', x: '88%', y: '40%', s: 24 },
    { t: 'punto-o', x: '58%', y: '10%', s: 18, c: 'rosa' },
    { t: 'flor-hueca', x: '6%', y: '44%', s: 30 },
    { t: 'punto', x: '22%', y: '90%', s: 18, c: 'rosa' },
    { t: 'flor', x: '62%', y: '92%', s: 26, c: 'crema', p: 8 },
    { t: 'punto', x: '90%', y: '86%', s: 10, c: 'crema' },
  ]);
  P.decorar($('#deco-espera'), P.mezcla(3, 9));
  P.decorar($('#deco-lista'), P.mezcla(5, 9));
  P.decorar($('#deco-nota'), P.mezcla(2, 6, { y0: 10, y1: 80 }));
  P.decorar($('#deco-sellar'), P.mezcla(7, 9, { y0: 2, y1: 70 }));
  P.decorar($('#deco-tarjeta'), P.mezcla(1, 6));
  $$('[data-fecha-evento]').forEach((el) => { el.textContent = fecha(CFG.PROXIMO_EVENTO.fecha, { day: 'numeric', month: 'long' }); });

  // ---------- inicio ----------
  const btnInicio = $('#btn-inicio');
  const btnInicio2 = $('#btn-inicio-2');
  const btnSimular = $('#btn-simular');
  let reloj = 0;

  function pintarInicio() {
    const est = estadoCapsula();
    const c = datos.capsula;
    $$('.estado', pantallas.inicio).forEach((el) => { el.hidden = el.dataset.estado !== est; });
    pantallas.inicio.dataset.tema = { vacio: 'azul', sellada: 'negro', lista: 'azul', abierta: 'crema' }[est];
    if (actual === pantallas.inicio) aplicarTema(pantallas.inicio.dataset.tema);
    clearInterval(reloj);
    btnInicio.hidden = false;
    btnInicio2.hidden = true;
    btnSimular.hidden = true;

    if (est === 'vacio') {
      $('.btn__texto', btnInicio).textContent = 'Armar mi cápsula';
    } else if (est === 'sellada') {
      capsulaLlena($('#envase-espera'), c.envase, stickersDe(c, { nota: true }));
      $('#espera-evento').textContent = `${c.evento} · ${fecha(c.abreEn, { day: 'numeric', month: 'long' })}`;
      $('#espera-fecha').textContent = 'El ' + fecha(c.abreEn, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      btnInicio.hidden = true;
      btnInicio2.hidden = false;
      btnInicio2.textContent = 'Romper la cápsula';
      btnSimular.hidden = !DEMO;
      tic();
      reloj = setInterval(tic, 1000);
    } else if (est === 'lista') {
      capsulaLlena($('#envase-lista'), c.envase, stickersDe(c, { nota: true }));
      $('#lista-texto').textContent =
        `La sellaste el ${fecha(c.selladaEn, { day: 'numeric', month: 'long' })} en ${punto(c.eventoOrigen)} Ahora vas a ver cuánto creciste.`;
      $('.btn__texto', btnInicio).textContent = 'Abrir mi cápsula';
    } else {
      pintarResumenMini();
      $('.btn__texto', btnInicio).textContent = 'Sellar una nueva cápsula';
      btnInicio2.hidden = false;
      btnInicio2.textContent = 'Ver mi cápsula de nuevo';
    }
  }

  function tic() {
    const c = datos.capsula;
    const falta = Math.max(0, new Date(c.abreEn).getTime() - Date.now());
    if (!falta) { pintarInicio(); return; }
    const u = { d: Math.floor(falta / DIA), h: Math.floor(falta / 36e5) % 24, m: Math.floor(falta / 6e4) % 60, s: Math.floor(falta / 1e3) % 60 };
    $$('#cuenta b').forEach((b) => {
      const v = String(u[b.dataset.u]).padStart(2, '0');
      if (b.textContent === v) return;
      b.textContent = v;
      b.classList.remove('cambia');
      void b.offsetWidth;
      b.classList.add('cambia');
    });
  }

  function ponerEnvase(slot, id) {
    slot.textContent = '';
    slot.append(P.envase(id));
  }

  function pintarResumenMini() {
    const c = datos.capsula;
    const cont = $('#resumen-mini');
    cont.textContent = '';
    const slot = document.createElement('div');
    slot.className = 'nota-slot nota-abierta';
    const nota = P.crearNota();
    P.pintarNota(nota, { ...c, fecha: fecha(c.selladaEn, { day: '2-digit', month: '2-digit', year: 'numeric' }) });
    slot.append(nota);
    cont.append(slot);
    requestAnimationFrame(() => P.escalarNota(nota, 260, 220));
    cont.append(listaResumen(c));
  }

  btnInicio.addEventListener('click', () => {
    const est = estadoCapsula();
    if (est === 'lista') cargar('Abriendo tu cápsula…').then(abrirHistoria);
    else if (est === 'abierta') {
      const c = datos.capsula;
      datos.historial.push(c);
      datos.capsula = null;
      guardar();
      // La cápsula nueva arranca desde donde estás hoy.
      borrador = nuevoBorrador(c.objetivos.map((o) => {
        const def = objetivo(o.id);
        const llego = def.mas === false ? o.ahora <= o.meta : o.ahora >= o.meta;
        const delta = Math.abs(o.meta - o.antes) || def.paso * 2;
        const meta = llego ? limitar(def, o.ahora + (def.mas === false ? -delta : delta)) : o.meta;
        return { id: o.id, hoy: o.ahora, meta };
      }));
      prepararPasos();
      ir('envase');
    } else {
      borrador = nuevoBorrador();
      prepararPasos();
      ir('intro');
    }
  });
  btnInicio2.addEventListener('click', () => {
    if (estadoCapsula() === 'sellada') $('#dlg-borrar').showModal();
    else abrirHistoria();
  });
  btnSimular.addEventListener('click', () => {
    datos.capsula.simulada = true;
    guardar();
    pintarInicio();
    $$('[data-anim]', pantallas.inicio).forEach((el, i) => !REDUCIDO && el.animate(
      { opacity: [0, 1], transform: ['scale(.96)', 'none'] }, { duration: 420, delay: i * 50, fill: 'backwards' }));
  });
  $('#dlg-seguir').addEventListener('click', () => $('#dlg-borrar').close());
  $('#dlg-confirmar').addEventListener('click', () => {
    datos.capsula = null;
    guardar();
    $('#dlg-borrar').close();
    pintarInicio();
  });
  al.inicio = pintarInicio;

  // ---------- cómo funciona (se puede omitir) ----------
  const INTRO = [
    { titulo: 'Una cápsula del tiempo para tu progreso', texto: 'Guardás dónde estás hoy y a dónde querés llegar. Te sirve para medir tu progreso, seguir tu proceso y motivarte.' },
    { titulo: 'Se abre en cada evento de stop.', texto: 'Tu cápsula queda sellada hasta la próxima fecha de la marca. La próxima es el 27/10.' },
    { titulo: 'Cada fecha es tu punto de comparación', texto: 'Ese día cargás tus números y los comparás con los de la última vez. Después sellás una nueva hasta el próximo evento.' },
  ];
  let introIdx = 0, introTimer = 0, introAnim = null;
  function pintarIntro(i) {
    introIdx = i;
    clearTimeout(introTimer);
    introAnim?.cancel();
    const d = INTRO[i];
    $('#t-intro').textContent = d.titulo;
    $('#intro-texto').textContent = d.texto;
    $('#intro-paso').textContent = `${i + 1} de ${INTRO.length}`;
    $('.btn__texto', $('#intro-sig')).textContent = i === INTRO.length - 1 ? 'Empezar' : 'Siguiente';
    // La pila de stickers crece en cada paso.
    P.collage($('#collage-intro'), { n: 4 + i * 4, nuevosDesde: i ? i * 4 : 0 });
    [...$('#barras-intro').children].forEach((b, k) => {
      if (!b.firstChild) b.append(document.createElement('b'));
      b.classList.toggle('hecha', k < i);
    });
    if (!REDUCIDO) {
      $$('.intro__textos > *', pantallas.intro).forEach((el, k) => el.animate(
        { opacity: [0, 1], transform: ['translateY(12px)', 'none'] }, { duration: 400, delay: k * 60, fill: 'backwards' }));
      introAnim = $('#barras-intro').children[i].firstChild.animate({ transform: ['scaleX(0)', 'scaleX(1)'] }, { duration: 5000, easing: 'linear', fill: 'forwards' });
      if (i < INTRO.length - 1) introTimer = setTimeout(() => pintarIntro(i + 1), 5000);
    }
  }
  al.intro = () => requestAnimationFrame(() => pintarIntro(0));
  const salirIntro = () => { clearTimeout(introTimer); introAnim?.cancel(); ir('envase'); };
  $('#intro-sig').addEventListener('click', () => (introIdx < INTRO.length - 1 ? pintarIntro(introIdx + 1) : salirIntro()));
  $('#intro-omitir').addEventListener('click', salirIntro);
  $('[data-volver]', pantallas.intro).addEventListener('click', () => { clearTimeout(introTimer); introAnim?.cancel(); });

  // ---------- paso 1: envase ----------
  const carrusel = $('#carrusel');
  const puntos = $('#puntos');
  P.ENVASES.forEach((e, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'opcion';
    b.setAttribute('role', 'radio');
    b.dataset.id = e.id;
    b.innerHTML = '<span class="opcion__escena"><span class="deco"></span></span><span class="opcion__nombre"></span><span class="opcion__para"></span>';
    $('.opcion__nombre', b).textContent = e.nombre;
    $('.opcion__para', b).textContent = e.para;
    const cap = P.envase(e.id);
    $('.opcion__escena', b).append(cap);
    requestAnimationFrame(() => P.llenar(cap, MUESTRA, { animar: false }));
    P.decorar($('.deco', b), P.mezcla(11 + i, 8));
    b.addEventListener('click', () => elegirEnvase(e.id, true));
    carrusel.append(b);
    const punto = document.createElement('button');
    punto.type = 'button';
    punto.setAttribute('aria-label', e.nombre);
    punto.addEventListener('click', () => elegirEnvase(e.id, true));
    puntos.append(punto);
  });

  function elegirEnvase(id, mover) {
    borrador.envase = id;
    $$('.opcion', carrusel).forEach((b, i) => {
      const on = b.dataset.id === id;
      b.setAttribute('aria-checked', on);
      b.tabIndex = on ? 0 : -1;
      puntos.children[i].classList.toggle('on', on);
      if (on && mover !== 'quieto') P.llenar($('.envase', b), MUESTRA, { animar: true });
      if (on && mover) carrusel.scrollTo({ left: i * carrusel.clientWidth, behavior: REDUCIDO ? 'auto' : 'smooth' });
    });
  }
  let scrollT = 0;
  carrusel.addEventListener('scroll', () => {
    clearTimeout(scrollT);
    scrollT = setTimeout(() => {
      const i = Math.round(carrusel.scrollLeft / carrusel.clientWidth);
      const id = P.ENVASES[i]?.id;
      if (id && id !== borrador.envase) elegirEnvase(id, false);
    }, 80);
  });
  carrusel.addEventListener('keydown', (e) => {
    const i = P.ENVASES.findIndex((x) => x.id === borrador.envase);
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = P.ENVASES[(i + d + P.ENVASES.length) % P.ENVASES.length].id;
    elegirEnvase(n, true);
    $(`.opcion[data-id="${n}"]`, carrusel).focus({ preventScroll: true });
  });
  al.envase = () => requestAnimationFrame(() => elegirEnvase(borrador.envase, true));
  pantallas.envase.dataset.volverA = 'inicio';

  // ---------- paso 2: objetivos ----------
  const chips = $('#chips');
  const metas = $('#metas');
  const limitar = (def, v) => Math.min(def.max, Math.max(def.min, Math.round(v / def.paso) * def.paso));

  CFG.OBJETIVOS.forEach((o) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.dataset.id = o.id;
    b.textContent = o.nombre;
    b.addEventListener('click', () => {
      const i = borrador.objetivos.findIndex((x) => x.id === o.id);
      if (i >= 0) borrador.objetivos.splice(i, 1);
      else if (borrador.objetivos.length < MAX) borrador.objetivos.push({ id: o.id, hoy: o.hoy, meta: o.meta });
      else { sacudir(chips); return; }
      pintarObjetivos();
      pintarPregunta(true);
    });
    chips.append(b);
  });

  // Tarjeta de preguntas, como las de Spotify: "Otra pregunta" cambia, "Sumar" la agrega, "Aleatorio" arma 3.
  const pregunta = $('#pregunta');
  let preguntaIdx = 0;
  const libres = () => CFG.OBJETIVOS.filter((o) => !borrador.objetivos.some((x) => x.id === o.id));
  function pintarPregunta(animar = false) {
    const lista = libres();
    const lleno = borrador.objetivos.length >= MAX || !lista.length;
    const o = lista[preguntaIdx % Math.max(1, lista.length)];
    pregunta.textContent = lleno ? `¡Tu cápsula está llena! Sumaste ${borrador.objetivos.length} objetivos.` : o.pregunta;
    pregunta.dataset.id = lleno ? '' : o.id;
    $('#btn-sumar').setAttribute('aria-disabled', lleno);
    $('#btn-pregunta').setAttribute('aria-disabled', lleno);
    $('#btn-aleatorio').setAttribute('aria-disabled', lleno);
    if (animar && !REDUCIDO) { pregunta.classList.remove('cambia'); void pregunta.offsetWidth; pregunta.classList.add('cambia'); }
  }
  function sumarObjetivo(id) {
    const o = objetivo(id);
    if (!o || borrador.objetivos.length >= MAX || borrador.objetivos.some((x) => x.id === id)) return false;
    borrador.objetivos.push({ id: o.id, hoy: o.hoy, meta: o.meta });
    return true;
  }
  $('#btn-pregunta').addEventListener('click', () => { preguntaIdx++; pintarPregunta(true); });
  $('#btn-sumar').addEventListener('click', (e) => {
    if (!sumarObjetivo(pregunta.dataset.id)) { sacudir(e.currentTarget); return; }
    pintarObjetivos();
    pintarPregunta(true);
  });
  // Aleatorio: suma una pregunta al azar cada vez (se pueden guardar varias).
  $('#btn-aleatorio').addEventListener('click', (e) => {
    const lista = libres();
    if (borrador.objetivos.length >= MAX || !lista.length) { sacudir(e.currentTarget); return; }
    const o = lista[Math.floor(Math.random() * lista.length)];
    pregunta.textContent = o.pregunta;
    sumarObjetivo(o.id);
    pintarObjetivos();
    pintarPregunta(true);
  });

  function stepper(label, valor, def, onCambio, cls = '') {
    const el = document.createElement('div');
    el.className = 'stepper ' + cls;
    el.innerHTML =
      '<span class="stepper__label"></span><div class="stepper__ctrl">' +
      '<button type="button" data-d="-1" aria-label="Menos">−</button><output></output>' +
      '<button type="button" data-d="1" aria-label="Más">+</button></div>';
    $('.stepper__label', el).textContent = label;
    const out = $('output', el);
    const pintar = () => { out.textContent = fmt(valor); };
    pintar();
    $$('button', el).forEach((b) => {
      b.setAttribute('aria-label', `${b.dataset.d > 0 ? 'Más' : 'Menos'} ${label.toLowerCase()} ${def.nombre.toLowerCase()}`);
      b.addEventListener('click', () => {
        valor = limitar(def, valor + def.paso * b.dataset.d);
        pintar();
        onCambio(valor);
        if (!REDUCIDO) out.animate({ scale: ['1', '1.15', '1'] }, { duration: 220, easing: 'cubic-bezier(.3,1.5,.5,1)' });
      });
    });
    return el;
  }

  function tarjetaMeta(o, filas) {
    const def = objetivo(o.id);
    const el = document.createElement('div');
    el.className = 'meta';
    el.innerHTML = '<div class="meta__top"><span class="meta__nombre"></span><span class="meta__unidad"></span></div><div class="meta__filas"></div>';
    $('.meta__nombre', el).textContent = def.nombre;
    $('.meta__unidad', el).textContent = def.unidad;
    filas.forEach((f) => $('.meta__filas', el).append(f));
    return el;
  }

  function pintarObjetivos() {
    $$('.chip', chips).forEach((b) => {
      const on = borrador.objetivos.some((x) => x.id === b.dataset.id);
      b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-disabled', !on && borrador.objetivos.length >= MAX);
    });
    const ya = new Set($$('.meta', metas).map((m) => m.dataset.id));
    metas.textContent = '';
    borrador.objetivos.forEach((o) => {
      const def = objetivo(o.id);
      const card = tarjetaMeta(o, [
        stepper('Hoy', o.hoy, def, (v) => { o.hoy = v; }),
        stepper('Meta', o.meta, def, (v) => { o.meta = v; }, 'stepper--meta'),
      ]);
      card.dataset.id = o.id;
      if (ya.has(o.id)) card.style.animation = 'none';
      metas.append(card);
    });
    $('[data-siguiente]', pantallas.objetivos).setAttribute('aria-disabled', !borrador.objetivos.length);
    pintarPregunta();
    pintarLlenado();
  }

  // La cápsula del paso 2 recibe un sticker por cada objetivo que se suma.
  let capObj = null, enCap = 0;
  function pintarLlenado() {
    const slot = $('#cap-objetivos');
    if (!capObj || capObj.dataset.id !== borrador.envase) {
      slot.textContent = '';
      capObj = P.envase(borrador.envase);
      slot.append(capObj);
      enCap = 0;
    }
    const items = stickersDe(borrador);
    const crece = items.length > enCap;
    const opc = crece ? { animar: true, desde: enCap } : { animar: false };
    const cap = capObj;
    requestAnimationFrame(() => P.llenar(cap, items, opc));
    enCap = items.length;
    const n = borrador.objetivos.length;
    const txt = $('#cap-contador');
    txt.textContent = n ? `${n} ${n === 1 ? 'objetivo adentro' : 'objetivos adentro'}${n >= MAX ? ' · ¡llena!' : ''}` : 'Tu cápsula está vacía. Sumá tu primer objetivo.';
    if (crece && !REDUCIDO) { txt.classList.remove('cambia'); void txt.offsetWidth; txt.classList.add('cambia'); }
  }
  al.objetivos = () => { capObj = null; requestAnimationFrame(pintarLlenado); };

  // ---------- paso 3: nota ----------
  const inPara = $('#in-para');
  const inMsg = $('#in-msg');
  const contMsg = $('#cont-msg');
  const notaPreview = P.crearNota();
  $('#slot-nota').append(notaPreview);

  function pintarPreview() {
    borrador.para = inPara.value;
    borrador.mensaje = inMsg.value;
    borrador.color = $('input[name="color"]:checked').value;
    P.pintarNota(notaPreview, borrador, { placeholder: true });
    P.escalarNota(notaPreview, Math.min(300, $('.preview').clientWidth - 48), 170);
    const n = inMsg.value.length;
    contMsg.textContent = `${n} / 150`;
    contMsg.classList.toggle('cerca', n >= 130);
    inMsg.style.height = 'auto';
    inMsg.style.height = inMsg.scrollHeight + 'px';
    $('[data-siguiente]', pantallas.nota).setAttribute('aria-disabled', P.limpiar(inMsg.value).length < 3);
  }
  [inPara, inMsg].forEach((el) => el.addEventListener('input', pintarPreview));
  $$('input[name="color"]').forEach((el) => el.addEventListener('change', pintarPreview));
  $$('.comienzo').forEach((b) => b.addEventListener('click', () => {
    const frase = b.textContent;
    const resto = inMsg.value.replace(new RegExp('^(' + $$('.comienzo').map((x) => x.textContent).join('|') + ')\\s*'), '');
    inMsg.value = (frase + ' ' + resto).slice(0, 150);
    pintarPreview();
    inMsg.focus();
    inMsg.setSelectionRange(inMsg.value.length, inMsg.value.length);
  }));
  $('#form').addEventListener('submit', (e) => e.preventDefault());
  // Omitir: la cápsula viaja solo con los objetivos y un mensaje de aliento.
  $('#btn-omitir').addEventListener('click', () => {
    if (!P.limpiar(inMsg.value)) inMsg.value = '¡Vamos que se puede! Acá están mis objetivos.';
    pintarPreview();
    ir('sellar');
  });
  al.nota = () => requestAnimationFrame(pintarPreview);

  // ---------- paso 3: canción ----------
  const listaCanciones = $('#canciones');
  const inCancion = $('#in-cancion');
  const iniciales = (t) => t.replace(/[^\p{L}\p{N} ]/gu, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const COLOR_TAPA = ['azul', 'rosa', 'crema'];
  const tapa = (c, i = 0) => `<span class="tapa tapa--${COLOR_TAPA[i % 3]}" aria-hidden="true"><b>${esc(iniciales(c.titulo))}</b></span>`;
  const mismaCancion = (a, b) => a && b && a.titulo === b.titulo && a.artista === b.artista;

  function pintarCanciones() {
    const q = inCancion.value.trim().toLowerCase();
    const lista = CFG.CANCIONES.filter((c) => !q || (c.titulo + ' ' + c.artista).toLowerCase().includes(q));
    listaCanciones.textContent = '';
    lista.forEach((c) => {
      const i = CFG.CANCIONES.indexOf(c);
      const li = document.createElement('li');
      li.innerHTML = `<button type="button" class="cancion" role="option">${tapa(c, i)}<span class="cancion__txt"><strong>${esc(c.titulo)}</strong><small>${esc(c.artista)}</small></span><span class="cancion__check" aria-hidden="true"></span></button>`;
      const b = $('button', li);
      b.setAttribute('aria-selected', !!mismaCancion(c, borrador.cancion));
      b.addEventListener('click', () => elegirCancion(c));
      listaCanciones.append(li);
    });
    // Si no está en la lista, se puede guardar igual.
    if (q && !lista.length) {
      const li = document.createElement('li');
      const propia = { titulo: inCancion.value.trim().slice(0, 40), artista: 'Elegida por vos' };
      li.innerHTML = `<button type="button" class="cancion cancion--propia">${tapa(propia, 1)}<span class="cancion__txt"><strong>Guardar “${esc(propia.titulo)}”</strong><small>No está en la lista, la guardamos igual</small></span></button>`;
      $('button', li).addEventListener('click', () => elegirCancion(propia));
      listaCanciones.append(li);
    }
  }
  function pintarDisco(animar) {
    const c = borrador.cancion;
    const cont = $('#disco-elegido');
    cont.innerHTML = c
      ? `<span class="disco" aria-hidden="true"><span class="disco__etiqueta">${esc(iniciales(c.titulo))}</span></span><span class="disco-elegido__txt"><small>tu canción</small><strong>${esc(c.titulo)}</strong><span>${esc(c.artista)}</span></span>`
      : '<span class="disco disco--vacio" aria-hidden="true"></span><span class="disco-elegido__txt"><small>tu canción</small><strong>Todavía no elegiste</strong><span>Tocá una de la lista</span></span>';
    if (animar && !REDUCIDO) cont.animate({ transform: ['scale(.94)', 'scale(1.03)', 'none'] }, { duration: 420, easing: 'cubic-bezier(.3,1.5,.5,1)' });
    $('[data-siguiente]', pantallas.cancion).setAttribute('aria-disabled', !c);
  }
  function elegirCancion(c) {
    borrador.cancion = { titulo: c.titulo, artista: c.artista };
    pintarDisco(true);
    pintarCanciones();
  }
  inCancion.addEventListener('input', pintarCanciones);
  $('#btn-cancion-azar').addEventListener('click', () => {
    inCancion.value = '';
    elegirCancion(CFG.CANCIONES[Math.floor(Math.random() * CFG.CANCIONES.length)]);
  });
  al.cancion = () => { pintarDisco(false); pintarCanciones(); };

  // ---------- compartir ----------
  const aviso = $('#toast');
  let avisoT = 0;
  function avisar(texto) {
    aviso.textContent = texto;
    aviso.hidden = false;
    aviso.classList.remove('visible');
    void aviso.offsetWidth;
    aviso.classList.add('visible');
    clearTimeout(avisoT);
    avisoT = setTimeout(() => { aviso.classList.remove('visible'); setTimeout(() => { aviso.hidden = true; }, 300); }, 2600);
  }

  // Compartir con tu grupo dentro de la app SPOT!
  const dlgGrupo = $('#dlg-grupo');
  const elegidos = new Set();
  function abrirGrupo(texto) {
    $('#dlg-grupo-texto').textContent = texto;
    elegidos.clear();
    const ul = $('#grupos');
    ul.textContent = '';
    CFG.GRUPOS.forEach((g, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<button type="button" class="grupo" aria-pressed="false"><span class="grupo__avatar grupo__avatar--${COLOR_TAPA[i % 3]}">${esc(iniciales(g.nombre))}</span><span class="grupo__txt"><strong>${esc(g.nombre)}</strong><small>${g.miembros} personas</small></span><span class="grupo__check" aria-hidden="true"></span></button>`;
      const b = $('button', li);
      b.addEventListener('click', () => {
        if (elegidos.has(g.nombre)) elegidos.delete(g.nombre); else elegidos.add(g.nombre);
        b.setAttribute('aria-pressed', elegidos.has(g.nombre));
        $('#grupo-enviar').setAttribute('aria-disabled', !elegidos.size);
      });
      ul.append(li);
    });
    $('#grupo-enviar').setAttribute('aria-disabled', 'true');
    dlgGrupo.showModal();
  }
  $('#grupo-enviar').addEventListener('click', (e) => {
    if (!elegidos.size) { sacudir(e.currentTarget); return; }
    const lista = [...elegidos];
    dlgGrupo.close();
    avisar(`¡Listo! Lo compartiste con ${lista.length === 1 ? lista[0] : lista.length + ' grupos'}.`);
  });
  $('#grupo-cancelar').addEventListener('click', () => dlgGrupo.close());
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-grupo]');
    if (b) abrirGrupo(b.dataset.grupoTexto || 'Tu grupo de SPOT! va a ver tu cápsula.');
  });

  function prepararPasos() {
    inPara.value = borrador.para;
    inMsg.value = borrador.mensaje;
    $(`input[name="color"][value="${borrador.color}"]`).checked = true;
    inCancion.value = '';
    pintarObjetivos();
  }

  // botones "Siguiente"
  const orden = ['envase', 'objetivos', 'cancion', 'nota', 'sellar'];
  $$('[data-siguiente]').forEach((b) => b.addEventListener('click', () => {
    if (b.getAttribute('aria-disabled') === 'true') {
      sacudir(b);
      if (actual === pantallas.nota) inMsg.focus();
      return;
    }
    ir(orden[orden.indexOf(actual.id.slice(2)) + 1]);
  }));

  // ---------- paso 4: sellar ----------
  const notaSellar = P.crearNota();
  $('#slot-sellar').append(notaSellar);
  const btnSellar = $('#btn-sellar');
  const avance = $('.mantener__avance');
  const LARGO = 226.2;
  const DURA = 1400;
  let t0 = 0, raf = 0, sellando = false;

  al.sellar = () => {
    capsulaLlena($('#envase-sellar'), borrador.envase, stickersDe(borrador), { animar: true, demora: 250 });
    // Solo la silueta del objeto, hecha de puntos, detrás de la cápsula.
    const sil = $('#silueta-sellar');
    sil.style.setProperty('--m1', `url(assets/capsulas/${borrador.envase}-frente.png)`);
    sil.style.setProperty('--m2', `url(assets/capsulas/${borrador.envase}-atras.png)`);
    P.pintarNota(notaSellar, borrador);
    notaSellar.style.cssText = '';
    $('#slot-sellar').style.cssText = '';
    requestAnimationFrame(() => P.escalarNota(notaSellar, 220, 190));
    [$('#sello'), $('#destello'), $('#envase-sellar')].forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
    avance.style.strokeDashoffset = LARGO;
    sellando = false;
    $('#ayuda-sellar').textContent = 'Mantené presionado para sellar';
  };

  function empezar(e) {
    if (sellando) return;
    e?.preventDefault?.();
    btnSellar.classList.add('presionando');
    t0 = performance.now() - (1 - parseFloat(avance.style.strokeDashoffset || LARGO) / LARGO) * DURA;
    cancelAnimationFrame(raf);
    const paso = (t) => {
      const p = Math.min(1, (t - t0) / DURA);
      avance.style.strokeDashoffset = LARGO * (1 - p);
      if (p < 1) raf = requestAnimationFrame(paso);
      else sellar();
    };
    raf = requestAnimationFrame(paso);
    navigator.vibrate?.(10);
  }
  function soltar() {
    if (sellando) return;
    btnSellar.classList.remove('presionando');
    cancelAnimationFrame(raf);
    const desde = parseFloat(avance.style.strokeDashoffset || LARGO);
    const t1 = performance.now();
    const volverAro = (t) => {
      const p = Math.min(1, (t - t1) / 250);
      avance.style.strokeDashoffset = desde + (LARGO - desde) * p;
      if (p < 1 && !btnSellar.classList.contains('presionando')) raf = requestAnimationFrame(volverAro);
    };
    raf = requestAnimationFrame(volverAro);
  }
  btnSellar.addEventListener('pointerdown', (e) => { btnSellar.setPointerCapture(e.pointerId); empezar(e); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => btnSellar.addEventListener(ev, soltar));
  btnSellar.addEventListener('contextmenu', (e) => e.preventDefault());
  btnSellar.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); empezar(); }
  });
  btnSellar.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') soltar(); });

  async function sellar() {
    sellando = true;
    btnSellar.classList.remove('presionando');
    navigator.vibrate?.([20, 40, 30]);
    $('#ayuda-sellar').textContent = 'Sellando…';
    const env = $('#envase-sellar .envase');
    const slot = $('#slot-sellar');
    const ahora = new Date();
    datos.capsula = {
      envase: borrador.envase,
      para: P.limpiar(borrador.para) || 'mi yo del futuro',
      mensaje: P.limpiar(borrador.mensaje),
      color: borrador.color,
      objetivos: borrador.objetivos.map((o) => ({ id: o.id, antes: o.hoy, meta: o.meta })),
      cancion: borrador.cancion,
      selladaEn: ahora.toISOString(),
      eventoOrigen: CFG.EVENTO_ACTUAL.nombre,
      evento: CFG.PROXIMO_EVENTO.nombre,
      abreEn: new Date(Math.max(new Date(CFG.PROXIMO_EVENTO.fecha).getTime(), ahora.getTime() + 60e3)).toISOString(),
    };
    guardar();
    if (!REDUCIDO) {
      const dy = env.getBoundingClientRect().top - slot.getBoundingClientRect().top + env.offsetHeight * .3;
      await slot.animate(
        [{ transform: 'none' }, { transform: 'translateY(-20px) rotate(-4deg)', offset: .3 }, { transform: `translateY(${dy}px) scale(.35)`, opacity: 0 }],
        { duration: 700, easing: 'cubic-bezier(.5,0,.6,1)', fill: 'forwards' },
      ).finished;
      P.llenar(env, stickersDe(borrador, { nota: true }), { animar: true, desde: stickersDe(borrador).length });
      await new Promise((r) => setTimeout(r, 400));
      await new Promise((r) => setTimeout(r, 900));
      $('#destello').animate({ opacity: [0, 1, 0], transform: ['scale(.2)', 'scale(6)', 'scale(8)'] }, { duration: 650, easing: 'ease-out' });
      await env.animate(
        { transform: ['scale(1)', 'scale(1.18) rotate(-6deg)', 'scale(.94) rotate(4deg)', 'scale(1)'] },
        { duration: 650, easing: 'cubic-bezier(.3,1.5,.5,1)' },
      ).finished;
      await $('#sello').animate(
        [{ opacity: 0, transform: 'scale(2) rotate(-20deg)' }, { opacity: 1, transform: 'scale(.9) rotate(-8deg)', offset: .7 }, { opacity: 1, transform: 'scale(1) rotate(-8deg)' }],
        { duration: 420, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'forwards' },
      ).finished;
      await new Promise((r) => setTimeout(r, 650));
    }
    pila.length = 0;
    await cargar('Mandando tu cápsula al 27/10…');
    ir('sellada');
  }

  // ---------- sellada ----------
  al.sellada = () => {
    const c = datos.capsula;
    capsulaLlena($('#envase-exito'), c.envase, stickersDe(c, { nota: true }), { animar: true, demora: 500 });
    $('#pieza-texto').textContent = `Se abre el ${fecha(c.abreEn, { day: 'numeric', month: 'long' })} en ${c.evento}`;
    const datosPieza = [`${c.objetivos.length} ${c.objetivos.length === 1 ? 'objetivo' : 'objetivos'}`, c.cancion && `♪ ${c.cancion.titulo}`, 'una nota para mí'].filter(Boolean);
    $('#pieza-datos').innerHTML = datosPieza.map((d) => `<li>${esc(d)}</li>`).join('');
    $('[data-grupo]', pantallas.sellada).dataset.grupoTexto = 'Tu grupo va a ver que sellaste tu cápsula hasta el 27/10.';
    P.decorar($('#deco-exito'), P.mezcla(1, 7, { y0: 8, y1: 50 }));
    if (!REDUCIDO) {
      $('#t-sellada').animate(
        { transform: ['scale(.4) rotate(-12deg)', 'scale(1.08) rotate(-4deg)', 'scale(1) rotate(-4deg)'], opacity: [0, 1, 1] },
        { duration: 600, delay: 250, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'both' },
      );
      $$('#pieza-datos li').forEach((li, i) => li.animate({ opacity: [0, 1], transform: ['translateY(10px) scale(.8)', 'none'] }, { duration: 400, delay: 900 + i * 120, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'backwards' }));
    }
  };
  $('#btn-historias').addEventListener('click', async () => {
    const c = datos.capsula;
    const texto = `Sellé mi cápsula del tiempo en SPOT! 🔒 Se abre el ${fecha(c.abreEn, { day: 'numeric', month: 'long' })} en stop.`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Mi cápsula del tiempo', text: texto }); return; }
    } catch (e) { if (e.name === 'AbortError') return; }
    avisar('Sacale captura a la pantalla y subila a tus historias.');
  });
  const alInicio = () => { pila.length = 0; ir('inicio', { atras: true }); };
  $('#btn-listo').addEventListener('click', alInicio);
  $('#btn-cerrar').addEventListener('click', alInicio);

  // ---------- comparación ----------
  function comparar(o) {
    const def = objetivo(o.id);
    const signo = def.mas === false ? -1 : 1;
    const delta = (o.ahora - o.antes) * signo;
    const pct = o.antes ? Math.round((delta / o.antes) * 100) : null;
    const total = (o.meta - o.antes) * signo;
    const avance = total > 0 ? Math.max(0, Math.min(1, delta / total)) : (delta >= 0 ? 1 : 0);
    const llego = signo > 0 ? o.ahora >= o.meta : o.ahora <= o.meta;
    return { def, delta, pct, avance, llego, falta: Math.abs(o.meta - o.ahora) };
  }

  function listaResumen(c) {
    const cont = document.createElement('div');
    cont.className = 'resumen';
    c.objetivos.forEach((o) => {
      const r = comparar(o);
      const fila = document.createElement('div');
      fila.className = 'resumen__fila';
      fila.innerHTML = '<strong></strong><em></em><div class="mini-riel"><i></i></div><small></small>';
      $('strong', fila).textContent = r.def.nombre;
      $('em', fila).textContent = r.delta > 0 ? (r.pct != null ? `+${r.pct}%` : `+${fmt(r.delta)}`) : r.delta < 0 ? (r.pct != null ? `${r.pct}%` : fmt(-r.delta)) : '=';
      $('.mini-riel i', fila).style.width = Math.max(4, r.avance * 100) + '%';
      $('small', fila).textContent = `${fmt(o.antes)} → ${fmt(o.ahora)} ${r.def.unidad} · meta ${fmt(o.meta)}`;
      cont.append(fila);
    });
    return cont;
  }

  // ---------- historia (apertura estilo stories) ----------
  const historia = $('#historia');
  const slidesCont = $('#slides');
  const barras = $('#barras');
  let slides = [];
  let idx = 0;
  let timer = 0;
  let barraAnim = null;

  let semillaCielo = 40;
  let idxCarga = 2;
  function slide({ tema, deco = [], html, auto = 6000, interactiva = false, alEntrar }) {
    const el = document.createElement('section');
    el.className = 'slide';
    el.dataset.tema = tema;
    el.hidden = true;
    el.innerHTML = '<div class="cielo" aria-hidden="true"></div><div class="deco" aria-hidden="true"></div>' + html;
    P.cielo($('.cielo', el), semillaCielo++);
    P.decorar($('.deco', el), deco);
    return { el, tema, auto, interactiva, alEntrar };
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function armarSlides() {
    const c = datos.capsula;
    const ref = c.simulada && !c.abierta ? new Date(c.abreEn) : new Date(c.abiertaEn || Date.now());
    const dias = Math.max(0, Math.round((ref - new Date(c.selladaEn)) / DIA));
    const lista = [];

    lista.push(slide({
      tema: 'negro',
      deco: P.mezcla(21, 9, { y0: 30, y1: 94 }),
      auto: 5200,
      html:
        `<p class="slide__kicker">cápsula del ${esc(fecha(c.selladaEn, { day: '2-digit', month: '2-digit', year: 'numeric' }))}</p>` +
        `<h2 class="slide__titulo">Hace ${dias} ${dias === 1 ? 'día' : 'días'} sellaste esta cápsula</h2>` +
        `<p class="slide__texto">En ${esc(punto(c.eventoOrigen))} Hoy se abre.</p>` +
        '<div class="slide__centro"><div class="envase-slot envase-slot--grande tiembla" data-envase></div></div>' +
        '<p class="slide__texto" data-abriendo>Abriendo…</p>',
      alEntrar: (el) => {
        const slot = $('[data-envase]', el);
        const cap = capsulaLlena(slot, c.envase, stickersDe({ objetivos: c.objetivos }, { nota: true }));
        setTimeout(() => {
          slot.classList.remove('tiembla');
          cap.classList.add('abierta');
          P.vaciar(cap);
          $('[data-abriendo]', el).textContent = '¡Se abrió!';
        }, REDUCIDO ? 0 : 2200);
      },
    }));

    lista.push(slide({
      // Fondo opuesto al color de la nota para que se lea.
      tema: c.color === 'rosa' ? 'azul' : 'rosa',
      deco: P.mezcla(22, 8, { y0: 28, y1: 94 }),
      auto: 8000,
      html:
        '<p class="slide__kicker">esto te escribiste</p>' +
        '<h2 class="slide__titulo">Un mensaje desde el pasado</h2>' +
        '<div class="slide__centro"><div class="nota-slot nota-abierta" data-nota></div></div>',
      alEntrar: (el) => {
        const slot = $('[data-nota]', el);
        if (!slot.firstChild) {
          const n = P.crearNota();
          P.pintarNota(n, { ...c, fecha: fecha(c.selladaEn, { day: '2-digit', month: '2-digit', year: 'numeric' }) });
          slot.append(n);
        }
        P.escalarNota(slot.firstChild, Math.min(290, el.clientWidth - 80), el.clientHeight * 0.46, 0.32);
        if (!REDUCIDO) slot.animate(
          { transform: ['translateY(60px) scale(.6) rotate(8deg)', 'none'], opacity: [0, 1] },
          { duration: 700, easing: 'cubic-bezier(.3,1.4,.5,1)' },
        );
      },
    }));

    if (c.cancion) {
      lista.push(slide({
        tema: 'negro',
        interactiva: true,
        deco: P.mezcla(24, 8, { y0: 26, y1: 94 }),
        html:
          '<p class="slide__kicker">tu canción de la cápsula</p>' +
          '<h2 class="slide__titulo">Subí el volumen</h2>' +
          '<div class="slide__centro"><div class="disco disco--grande" aria-hidden="true"><span class="disco__etiqueta">' + esc(iniciales(c.cancion.titulo)) + '</span></div></div>' +
          `<p class="slide__cancion"><strong>${esc(c.cancion.titulo)}</strong><span>${esc(c.cancion.artista)}</span></p>` +
          '<div class="slide__pie">' +
            `<a class="btn btn--secundario" href="https://open.spotify.com/search/${encodeURIComponent(c.cancion.titulo + ' ' + c.cancion.artista)}" target="_blank" rel="noopener">Escuchar en Spotify</a>` +
            '<button class="btn btn--primario" type="button" data-seguir>Seguir<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18M14 5l7 7-7 7"/></svg></button>' +
          '</div>',
        alEntrar: (el) => { $('[data-seguir]', el).onclick = () => mostrar(idx + 1); },
      }));
    }

    // Actualizar números de hoy.
    idxCarga = lista.length;
    const ahora = c.objetivos.map((o) => ({ ...o, ahora: o.ahora ?? o.antes }));
    lista.push(slide({
      tema: 'crema',
      interactiva: true,
      deco: P.mezcla(23, 3, { y0: 90, y1: 98 }),
      html:
        '<p class="slide__kicker">antes de comparar</p>' +
        '<h2 class="slide__titulo">¿Dónde estás hoy?</h2>' +
        '<p class="slide__texto">Actualizá tus números y te mostramos cuánto creciste.</p>' +
        '<div class="metas" data-metas></div>' +
        '<div class="slide__pie" style="margin-top:auto;padding-top:18px"><button class="btn btn--primario" type="button" data-ver>Ver cuánto crecí<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18M14 5l7 7-7 7"/></svg></button></div>',
      alEntrar: (el) => {
        const cont = $('[data-metas]', el);
        if (cont.firstChild) return;
        ahora.forEach((o) => {
          const def = objetivo(o.id);
          const card = tarjetaMeta(o, [stepper('Hoy', o.ahora, def, (v) => { o.ahora = v; })]);
          $('.meta__filas', card).style.gridTemplateColumns = '1fr';
          const hint = document.createElement('p');
          hint.className = 'meta__hint';
          hint.textContent = `Cuando la sellaste: ${fmt(o.antes)} · Tu meta: ${fmt(o.meta)}`;
          card.append(hint);
          cont.append(card);
        });
        $('[data-ver]', el).onclick = () => {
          c.objetivos = ahora;
          c.abierta = true;
          c.abiertaEn ||= (c.simulada ? c.abreEn : new Date().toISOString());
          guardar();
          // Rearmar las slides de comparación con los números nuevos.
          const fijas = slides.slice(0, idxCarga + 1);
          slides.slice(idxCarga + 1).forEach((s) => s.el.remove());
          slides = fijas.concat(slidesComparacion(c));
          slides.slice(idxCarga + 1).forEach((s) => slidesCont.append(s.el));
          pintarBarras();
          mostrar(idx + 1);
        };
      },
    }));

    if (c.abierta) lista.push(...slidesComparacion(c));
    return lista;
  }

  function slidesComparacion(c) {
    const lista = c.objetivos.map((o, i) => {
      const r = comparar(o);
      const lo = Math.min(o.antes, o.ahora, o.meta);
      const hi = Math.max(o.antes, o.ahora, o.meta);
      const pos = (v) => (hi === lo ? 50 : 6 + ((v - lo) / (hi - lo)) * 88);
      const titulo =
        r.delta > 0 ? (r.def.mas === false ? `Bajaste ${fmt(r.delta)} ${r.def.corto}` : r.pct != null ? `Creciste un ${r.pct}%` : `Sumaste ${fmt(r.delta)} ${r.def.corto}`) :
        r.delta === 0 ? 'Te mantuviste firme' : 'Este quedó para la próxima';
      const badge = r.llego ? '¡Meta cumplida!' : `Te faltan ${fmt(r.falta)} ${r.def.corto}`;
      const flecha = '<svg class="compara__flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18M14 5l7 7-7 7"/></svg>';
      const llenoDesde = pos(Math.min(o.antes, o.ahora));
      const llenoHasta = pos(Math.max(o.antes, o.ahora));
      const deco = P.mezcla(30 + i, 9, { y0: 26, y1: 96 });
      return slide({
        tema: ['azul', 'negro', 'rosa'][i % 3],
        deco,
        auto: 6500,
        html:
          `<p class="slide__kicker">${esc(r.def.nombre)} · ${i + 1} de ${c.objetivos.length}</p>` +
          `<h2 class="slide__titulo">${esc(titulo)}</h2>` +
          '<div class="slide__centro"><div class="compara">' +
            '<div class="compara__nums">' +
              `<div class="num num--antes"><b>${fmt(o.antes)}</b><span>antes</span></div>${flecha}` +
              `<div class="num"><b data-contar="${o.ahora}">${fmt(o.ahora)}</b><span>hoy</span></div>` +
            '</div>' +
            `<p class="compara__unidad">${esc(r.def.unidad)}</p>` +
            '<div class="pista">' +
              `<div class="pista__riel"><span class="pista__lleno" style="left:${llenoDesde}%;width:${Math.max(1, llenoHasta - llenoDesde)}%"></span></div>` +
              `<span class="pista__marca" style="left:${pos(o.antes)}%">antes</span>` +
              `<span class="pista__marca pista__marca--meta" style="left:${pos(o.meta)}%">meta ${fmt(o.meta)}</span>` +
            '</div>' +
            `<span class="badge ${i % 2 ? '' : 'badge--rosa'}">${esc(badge)}</span>` +
          '</div></div>',
        alEntrar: (el) => {
          if (REDUCIDO) return;
          const b = $('[data-contar]', el);
          const fin = Number(b.dataset.contar);
          const t1 = performance.now();
          const paso = (t) => {
            const p = Math.min(1, (t - t1) / 900);
            const v = o.antes + (fin - o.antes) * (1 - Math.pow(1 - p, 3));
            b.textContent = fmt(Math.round(v / r.def.paso) * r.def.paso);
            if (p < 1) requestAnimationFrame(paso);
          };
          requestAnimationFrame(paso);
          $('.pista__lleno', el).animate({ transform: ['scaleX(0)', 'scaleX(1)'] }, { duration: 900, easing: 'cubic-bezier(.2,.8,.2,1)' });
          $('.badge', el).animate({ transform: ['scale(0)', 'scale(1.15)', 'scale(1)'] }, { duration: 500, delay: 800, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'backwards' });
        },
      });
    });

    const crecio = c.objetivos.filter((o) => comparar(o).delta > 0).length;
    const metasOk = c.objetivos.filter((o) => comparar(o).llego).length;
    const final = slide({
      tema: 'azul',
      interactiva: true,
      deco: P.mezcla(40, 4, { y0: 3, y1: 14 }),
      html:
        `<p class="sticker sticker--${crecio ? 'azul' : 'rosa'} sticker--grande" data-texto="${crecio ? '¡Creciste!' : '¡Seguimos!'}" style="margin-top:12px">${crecio ? '¡Creciste!' : '¡Seguimos!'}</p>` +
        `<h2 class="slide__titulo" style="font-size:22px">Avanzaste en ${crecio} de ${c.objetivos.length} ${c.objetivos.length === 1 ? 'objetivo' : 'objetivos'}` +
        (metasOk ? ` y cumpliste ${metasOk} ${metasOk === 1 ? 'meta' : 'metas'}` : '') + '</h2>' +
        '<div data-resumen style="width:100%"></div>' +
        '<div class="slide__pie" style="margin-top:auto;padding-top:20px">' +
          '<button class="btn btn--primario" type="button" data-logro>Ver mi logro<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18M14 5l7 7-7 7"/></svg></button>' +
          '<button class="btn btn--secundario" type="button" data-grupo data-grupo-texto="Tu grupo va a ver cuánto creciste desde la última vez.">Compartir con mi grupo</button>' +
        '</div>',
      alEntrar: (el) => {
        const cont = $('[data-resumen]', el);
        cont.textContent = '';
        cont.append(listaResumen(c));
        $('[data-logro]', el).onclick = () => mostrar(idx + 1);
        if (!REDUCIDO) $('.sticker', el).animate(
          { transform: ['scale(.3) rotate(-14deg)', 'scale(1.1) rotate(-4deg)', 'scale(1) rotate(-4deg)'] },
          { duration: 650, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'both' },
        );
      },
    });
    // Logro "Viaje en el tiempo", con la estética de los logros de post.
    const logro = slide({
      tema: 'negro',
      interactiva: true,
      deco: P.mezcla(41, 6, { y0: 4, y1: 38 }),
      html:
        '<div class="logro">' +
          '<span class="logro__banda" aria-hidden="true"></span>' +
          '<svg class="logro__onda" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 34c40 0 60-16 100-16s60 16 100 16 60-16 100-16 60 16 100 16"/><path d="M0 46c40 0 60-16 100-16s60 16 100 16 60-16 100-16 60 16 100 16"/></svg>' +
          '<div class="logro__insignia">' + P.insigniaReloj() + '</div>' +
        '</div>' +
        '<p class="slide__kicker">nuevo logro</p>' +
        '<h2 class="slide__titulo">Viaje en el tiempo</h2>' +
        '<p class="slide__texto">Abriste tu cápsula y te comparaste con tu yo del pasado.</p>' +
        '<div class="slide__pie" style="margin-top:auto;padding-top:20px">' +
          '<button class="btn btn--primario" type="button" data-grupo data-grupo-texto="Tu grupo va a ver tu logro “Viaje en el tiempo”.">Compartir con mi grupo</button>' +
          '<button class="btn btn--secundario" type="button" data-nueva>Sellar una nueva cápsula</button>' +
          '<button class="link" type="button" data-cerrar>Cerrar</button>' +
        '</div>',
      alEntrar: (el) => {
        datos.logros ||= {};
        datos.logros.viajeEnElTiempo ||= new Date().toISOString();
        guardar();
        $('[data-nueva]', el).onclick = () => { cerrarHistoria(); btnInicio.click(); };
        $('[data-cerrar]', el).onclick = cerrarHistoria;
        if (!REDUCIDO) {
          $('.logro__insignia', el).animate(
            { transform: ['scale(0) rotate(-40deg)', 'scale(1.15) rotate(8deg)', 'scale(1) rotate(-4deg)'] },
            { duration: 900, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'both' },
          );
          // Las agujas giran rápido (viajan en el tiempo) y frenan.
          $$('.aguja', el).forEach((a, i) => a.animate(
            { transform: ['rotate(0deg)', `rotate(${i ? 1440 + 90 : 720 - 60}deg)`] },
            { duration: 2600, easing: 'cubic-bezier(.15,.7,.2,1)', fill: 'forwards' },
          ));
        }
      },
    });
    return [...lista, final, logro];
  }

  function pintarBarras() {
    barras.textContent = '';
    slides.forEach(() => {
      const i = document.createElement('i');
      i.append(document.createElement('b'));
      barras.append(i);
    });
  }

  function mostrar(n) {
    if (n < 0) n = 0;
    if (n >= slides.length) { cerrarHistoria(); return; }
    // No se puede saltear la carga de números.
    if (n > idxCarga && !datos.capsula.abierta) n = idxCarga;
    clearTimeout(timer);
    barraAnim?.cancel();
    slides.forEach((s, i) => { s.el.hidden = i !== n; });
    idx = n;
    const s = slides[n];
    historia.dataset.tema = s.tema;
    historia.classList.toggle('interactiva', s.interactiva);
    [...barras.children].forEach((b, i) => b.classList.toggle('hecha', i < n || (i === n && s.interactiva)));
    s.alEntrar?.(s.el);
    if (!REDUCIDO) {
      $$(':scope > :not(.deco):not(.cielo)', s.el).forEach((el, i) => el.animate(
        { opacity: [0, 1], transform: ['translateY(16px)', 'none'] },
        { duration: 450, delay: i * 70, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' },
      ));
    }
    if (!s.interactiva) {
      barraAnim = barras.children[n].firstChild.animate(
        { transform: ['scaleX(0)', 'scaleX(1)'] }, { duration: s.auto, easing: 'linear', fill: 'forwards' });
      timer = setTimeout(() => mostrar(n + 1), s.auto);
    }
  }

  function abrirHistoria() {
    slides = armarSlides();
    slidesCont.textContent = '';
    slides.forEach((s) => slidesCont.append(s.el));
    pintarBarras();
    historia.hidden = false;
    document.body.style.overflow = 'hidden';
    aplicarTema('negro');
    if (!REDUCIDO) historia.animate({ opacity: [0, 1], transform: ['scale(.96)', 'none'] }, { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' });
    mostrar(0);
    $('#historia-cerrar').focus();
  }

  function cerrarHistoria() {
    clearTimeout(timer);
    barraAnim?.cancel();
    historia.hidden = true;
    document.body.style.overflow = '';
    pintarInicio();
    aplicarTema(actual.dataset.tema);
  }

  $('#zona-atras').addEventListener('click', () => mostrar(idx - 1));
  $('#zona-adelante').addEventListener('click', () => mostrar(idx + 1));
  $('#historia-cerrar').addEventListener('click', cerrarHistoria);
  historia.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarHistoria();
    else if (e.key === 'ArrowRight' && !slides[idx].interactiva) mostrar(idx + 1);
    else if (e.key === 'ArrowLeft') mostrar(idx - 1);
  });
  // Mantener apretado pausa la historia, como en stories.
  let apretado = 0;
  let pausada = false;
  historia.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.historia__zona') || slides[idx]?.interactiva) return;
    apretado = performance.now();
    barraAnim?.pause();
    clearTimeout(timer);
  });
  historia.addEventListener('pointerup', () => {
    pausada = performance.now() - apretado > 300;
    if (!barraAnim || barraAnim.playState !== 'paused') return;
    barraAnim.play();
    const resta = slides[idx].auto - (barraAnim.currentTime || 0);
    timer = setTimeout(() => mostrar(idx + 1), resta);
  });
  // Si fue una pausa larga, soltar no avanza.
  $$('.historia__zona').forEach((z) => z.addEventListener('click', (e) => {
    if (pausada) { e.stopImmediatePropagation(); pausada = false; }
  }, true));

  // ---------- arranque ----------
  pintarInicio();
  prepararPasos();
})();
