// Configuración de la Cápsula del tiempo de stop. (evento de post.)
// Editá estos valores sin tocar app.js.
window.CAPSULA_CONFIG = {
  // Evento donde se sella la cápsula (el de hoy).
  EVENTO_ACTUAL: { nombre: 'stop.', fecha: '2026-10-09T18:00:00-03:00' },

  // Evento donde se desbloquea. Cuando llega esta fecha, la cápsula se puede abrir.
  PROXIMO_EVENTO: { nombre: 'la próxima edición de stop.', fecha: '2027-04-10T18:00:00-03:00' },

  // Muestra el botón "Demo: simular que llegó el evento" (también con ?demo en el link).
  DEMO: true,

  // Objetivos que se pueden elegir (hasta 3). "mas: false" = bajar el número es crecer.
  OBJETIVOS: [
    { id: 'correr',    nombre: 'Correr',          unidad: 'km por salida',      corto: 'km',         min: 0, max: 42, paso: 1, hoy: 3, meta: 10 },
    { id: 'entrenar',  nombre: 'Entrenar',        unidad: 'días por semana',    corto: 'días',       min: 0, max: 7, paso: 1, hoy: 2, meta: 4 },
    { id: 'pasos',     nombre: 'Caminar',         unidad: 'mil pasos por día',  corto: 'mil pasos',  min: 0, max: 30, paso: 1, hoy: 5, meta: 10 },
    { id: 'fuerza',    nombre: 'Fuerza',          unidad: 'kg en sentadilla',   corto: 'kg',         min: 0, max: 200, paso: 5, hoy: 40, meta: 70 },
    { id: 'estirar',   nombre: 'Estirar',         unidad: 'min por día',        corto: 'min',        min: 0, max: 60, paso: 5, hoy: 0, meta: 15 },
    { id: 'dormir',    nombre: 'Descansar',       unidad: 'horas por noche',    corto: 'h',          min: 3, max: 10, paso: 0.5, hoy: 6, meta: 8 },
    { id: 'agua',      nombre: 'Hidratarme',      unidad: 'litros por día',     corto: 'l',          min: 0, max: 5, paso: 0.5, hoy: 1, meta: 2 },
    { id: 'pantalla',  nombre: 'Menos pantalla',  unidad: 'horas por día',      corto: 'h',          min: 0, max: 14, paso: 0.5, hoy: 6, meta: 3, mas: false },
  ],
};
