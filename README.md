# Cápsula del tiempo · post.

Extensión de la app SPOT! con la identidad de [Dedicatorias post.](https://estefigarrido.github.io/dedicatorias-post/)
(Sora / Reddit Sans / JetBrains Mono, notita festoneada, botones pill), en versión clara:
fondo `#EDE8DB`, azul `#7AA1FF` y rosa `#F79EE1`.

- Sitio: carpeta [`docs/`](docs/) (lista para GitHub Pages, sin build).
- Probar en local: `cd docs && python3 -m http.server` → <http://localhost:8000>.

## La idea

Como la *Playlist para el Futuro* de Spotify, pero con objetivos personales y atada a los eventos de la marca:

1. **En un evento post.** la persona arma su cápsula en 4 pasos:
   1. **Elegí tu cápsula**: frasco, lata, sobre lacrado o cajita (carrusel).
   2. **Tus objetivos**: hasta 3 (correr, entrenar, fuerza, descansar, menos pantalla…) con *dónde estoy hoy* y *mi meta*.
   3. **Una nota para tu yo del futuro**: la notita festoneada de post. (`para:` + mensaje), en azul o rosa.
   4. **Sellala**: mantener presionado; la nota cae adentro, se cierra la tapa y aparece el sello `p.`.
2. **Mientras tanto** el inicio muestra la cápsula sellada con candado y la cuenta regresiva al próximo evento.
3. **En el próximo evento** la cápsula se desbloquea y se abre como *stories*:
   hace N días la sellaste → tu nota del pasado → ¿dónde estás hoy? (actualizás los números) →
   una pantalla por objetivo (antes → hoy, % de crecimiento, cuánto falta para la meta) → resumen “¡Creciste!”.
4. **Sellar una nueva** arranca la próxima cápsula desde los números de hoy (y sube la meta si ya la cumpliste),
   así cada evento compara contra la última vez.

### Misceláneas nuevas

Reemplazan los aros, puntos y estrellas-flor del sistema anterior por formas del universo “tiempo”:
píldora/cápsula bicolor, reloj de arena, chispa de 4 puntas, luna, cerradura, onda, candado y arco.
Todas con contorno `#252525` y relleno azul/rosa/crema, flotando igual que antes (`docs/index.html`, `<symbol id="d-…">`).

## Configuración

Todo en [`docs/config.js`](docs/config.js):

- `EVENTO_ACTUAL` y `PROXIMO_EVENTO`: nombre y fecha. La cápsula se abre sola cuando llega la fecha.
- `DEMO`: muestra “Demo: simular que llegó el evento” para probar la apertura sin esperar (también `?demo`).
- `OBJETIVOS`: la lista de objetivos, con unidad, rango, paso y valores iniciales. `mas: false` = bajar es crecer.

Por ahora la cápsula se guarda en el teléfono (`localStorage`). Para que viaje entre dispositivos y la marca
pueda avisar cuando se abre, el próximo paso es guardarla en Supabase como en Dedicatorias.
