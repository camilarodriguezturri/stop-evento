// Configuración de la Cápsula del tiempo de stop. (evento de post.)
// Editá estos valores sin tocar app.js.
window.CAPSULA_CONFIG = {
  // Dónde se arma la cápsula (aparece en "La sellaste el … en …").
  EVENTO_ACTUAL: { nombre: 'la app SPOT!', fecha: '2026-10-09T18:00:00-03:00' },

  // El evento donde se desbloquea. Cuando llega esta fecha, la cápsula se puede abrir.
  PROXIMO_EVENTO: { nombre: 'stop.', fecha: '2026-11-28T18:00:00-03:00' },

  // Muestra el botón "Demo: simular que llegó el 28/11" (también con ?demo en el link).
  DEMO: true,

  // Canciones para elegir en el paso 3 (también se puede escribir otra).
  // "audio": archivo propio que suena siempre; sin él se busca la vista previa de 30 s en iTunes/Deezer.
  CANCIONES: [
    { titulo: 'Color esperanza', artista: 'Diego Torres', audio: 'assets/audio/color-esperanza.mp3' },
    { titulo: 'Eye of the Tiger', artista: 'Survivor' },
    { titulo: "Don't Stop Me Now", artista: 'Queen' },
    { titulo: 'Lose Yourself', artista: 'Eminem' },
    { titulo: 'Stronger', artista: 'Kanye West' },
    { titulo: "Can't Hold Us", artista: 'Macklemore & Ryan Lewis' },
    { titulo: 'Believer', artista: 'Imagine Dragons' },
    { titulo: 'Titanium', artista: 'David Guetta ft. Sia' },
    { titulo: 'Hall of Fame', artista: 'The Script' },
    { titulo: 'Run the World (Girls)', artista: 'Beyoncé' },
    { titulo: 'Remember the Name', artista: 'Fort Minor' },
    { titulo: 'Unstoppable', artista: 'Sia' },
    { titulo: 'Gonna Fly Now', artista: 'Bill Conti' },
    { titulo: 'Muchachos', artista: 'La Mosca Tsé-Tsé' },
    { titulo: 'Thunder', artista: 'Imagine Dragons' },
    { titulo: 'We Will Rock You', artista: 'Queen' },
  ],

  // Grupos de la app SPOT! con los que se puede compartir el progreso (ejemplo).
  GRUPOS: [
    { nombre: 'Runners del Obelisco', miembros: 24 },
    { nombre: 'Bici los domingos', miembros: 11 },
    { nombre: 'Patín en el Rosedal', miembros: 8 },
    { nombre: 'Team stop.', miembros: 57 },
  ],

  // Objetivos (hasta 6 por cápsula). "pregunta" aparece en la tarjeta del paso 2.
  // "mas: false" = bajar el número es crecer.
  OBJETIVOS: [
    { id: 'correr',   nombre: 'Correr',         unidad: 'km por salida',      corto: 'km',      min: 0, max: 42,  paso: 1,   hoy: 3,  meta: 10, pregunta: '¿Cuántos km querés correr de una?' },
    { id: 'pedalear', nombre: 'Pedalear',       unidad: 'km por salida',      corto: 'km',      min: 0, max: 150, paso: 5,   hoy: 10, meta: 30, pregunta: '¿Hasta dónde querés llegar en bici?' },
    { id: 'patinar',  nombre: 'Patinar',        unidad: 'min sin frenar',     corto: 'min',     min: 0, max: 120, paso: 5,   hoy: 10, meta: 30, pregunta: '¿Cuánto querés patinar sin frenar?' },
    { id: 'entrenar', nombre: 'Moverme',        unidad: 'días por semana',    corto: 'días',    min: 0, max: 7,   paso: 1,   hoy: 2,  meta: 4,  pregunta: '¿Cuántos días por semana querés moverte?' },
    { id: 'pasos',    nombre: 'Caminar',        unidad: 'mil pasos por día',  corto: 'mil pasos', min: 0, max: 30, paso: 1,  hoy: 5,  meta: 10, pregunta: '¿Cuántos pasos querés sumar por día?' },
    { id: 'fuerza',   nombre: 'Fuerza',         unidad: 'kg en sentadilla',   corto: 'kg',      min: 0, max: 200, paso: 5,   hoy: 40, meta: 60, pregunta: '¿Cuántos kg querés levantar en sentadilla?' },
    { id: 'estirar',  nombre: 'Estirar',        unidad: 'min por día',        corto: 'min',     min: 0, max: 60,  paso: 5,   hoy: 0,  meta: 15, pregunta: '¿Cuántos minutos por día querés estirar?' },
    { id: 'dormir',   nombre: 'Descansar',      unidad: 'horas por noche',    corto: 'h',       min: 3, max: 10,  paso: 0.5, hoy: 6,  meta: 8,  pregunta: '¿Cuántas horas querés dormir por noche?' },
    { id: 'agua',     nombre: 'Hidratarme',     unidad: 'litros por día',     corto: 'l',       min: 0, max: 5,   paso: 0.5, hoy: 1,  meta: 2,  pregunta: '¿Cuánta agua querés tomar por día?' },
    { id: 'pantalla', nombre: 'Menos pantalla', unidad: 'horas por día',      corto: 'h',       min: 0, max: 14,  paso: 0.5, hoy: 6,  meta: 3,  pregunta: '¿Cuántas horas de celu querés sacarte de encima?', mas: false },
  ],
};
