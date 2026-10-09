# Cápsula del tiempo · stop.

Para **stop.**, el evento de post. Extensión de la app SPOT! con la identidad de [Dedicatorias post.](https://estefigarrido.github.io/dedicatorias-post/)
(Sora / Reddit Sans / JetBrains Mono, notita festoneada, botones pill), en versión clara:
fondo `#EDE8DB`, azul `#7AA1FF` y rosa `#F79EE1`.

- Sitio: carpeta [`docs/`](docs/) (lista para GitHub Pages, sin build).
- Probar en local: `cd docs && python3 -m http.server` → <http://localhost:8000>.

## La idea

Como la *Playlist para el Futuro* de Spotify, pero con objetivos personales y atada a cada edición de stop.:

1. **En stop.** la persona arma su cápsula en 4 pasos:
   1. **Elegí tu cápsula**: casillero del vestuario, caramañola, pelota que se abre o trofeo con tapa (carrusel animado).
   2. **Tus objetivos**: hasta 3 (correr, entrenar, fuerza, descansar, menos pantalla…) con *dónde estoy hoy* y *mi meta*.
   3. **Una nota para tu yo del futuro**: la notita festoneada de post. (`para:` + mensaje), en azul o rosa.
   4. **Sellala**: mantener presionado; la nota cae adentro, se cierra la tapa y aparece el sello `s.`.
2. **Mientras tanto** el inicio muestra la cápsula sellada con candado y la cuenta regresiva al próximo evento.
3. **En la próxima edición de stop.** la cápsula se desbloquea y se abre como *stories*:
   hace N días la sellaste → tu nota del pasado → ¿dónde estás hoy? (actualizás los números) →
   una pantalla por objetivo (antes → hoy, % de crecimiento, cuánto falta para la meta) → resumen “¡Creciste!”.
4. **Sellar una nueva** arranca la próxima cápsula desde los números de hoy (y sube la meta si ya la cumpliste),
   así cada evento compara contra la última vez.

### Identidad

- **stop.** está escrito como el logo de post.: Sora regular con interletrado cerrado, letra llena y contorno grueso.
  Los títulos tipo sticker usan tres capas del mismo texto (contorno oscuro, contorno de color y letra llena sin trazo)
  para que nunca se vean los bordes internos de la tipografía.
- **Misceláneas**: mezcla de los puntos de SPOT! (color con borde) y los de post. (puntos oscuros, aros y flores
  festoneadas). Flotan, las flores giran, los puntos laten y los aros respiran (`piezas.js`, `forma()` y `mezcla()`).
- Todo tiene animación: títulos que caen, pasos que entran, cápsulas con movimiento propio (dial del casillero,
  burbujas en la caramañola, pelota que rebota, destello del trofeo), brillo en los botones, cuenta regresiva que gira.

## Configuración

Todo en [`docs/config.js`](docs/config.js):

- `EVENTO_ACTUAL` y `PROXIMO_EVENTO`: nombre y fecha. La cápsula se abre sola cuando llega la fecha.
- `DEMO`: muestra “Demo: simular que llegó el evento” para probar la apertura sin esperar (también `?demo`).
- `OBJETIVOS`: la lista de objetivos, con unidad, rango, paso y valores iniciales. `mas: false` = bajar es crecer.

Por ahora la cápsula se guarda en el teléfono (`localStorage`). Para que viaje entre dispositivos y la marca
pueda avisar cuando se abre, el próximo paso es guardarla en Supabase como en Dedicatorias.
