# Cápsula del tiempo · stop.

Para **stop.**, el evento de post. (27 de octubre). Extensión de la app SPOT! con la identidad de
[Dedicatorias post.](https://estefigarrido.github.io/dedicatorias-post/) (Sora / Reddit Sans / JetBrains Mono,
notita festoneada, botones pill) y la estructura de la *Spotify Time Capsule*.

- Sitio: carpeta [`docs/`](docs/) (lista para GitHub Pages, sin build).
- Probar en local: `cd docs && python3 -m http.server` → <http://localhost:8000>.

## Recorrido

1. **Inicio** (azul): título sticker con objetos 3D flotando y los 4 pasos.
2. **Paso 1 · Elegí tu cápsula** (negro): carrusel de objetos 3D — zapatilla (runners), casco (ciclistas),
   patín (quienes patinan), olla (quienes cocinan) y caramañola.
3. **Paso 2 · Sumá tus objetivos** (rosa): tarjeta de preguntas como la de Spotify, con *Sumar*,
   *Otra pregunta* y *Aleatorio*. Hasta 3 objetivos con "hoy" y "meta".
4. **Paso 3 · Escribite una nota** (crema): la notita festoneada de post. Se puede *Omitir*.
5. **Paso 4 · Sellala** (negro): la cápsula sobre un podio; se mantiene presionado, la nota entra, destello y sello `s.`.
6. **¡Felicitaciones!** (rosa): confeti y tarjeta para compartir en historias.
7. **Esperando** (negro): candado y cuenta regresiva al 27/10.
8. **El 27/10** (rosa): la cápsula tiembla y se abre como *stories*: hace N días la sellaste → tu nota →
   ¿dónde estás hoy? → una pantalla por objetivo (azul / negro / rosa) → resumen "¡Creciste!".
9. **Sellar una nueva** arranca desde los números de hoy (y sube la meta si ya la cumpliste).

## Identidad y animación

- Cada pantalla tiene su fondo: azul `#7AA1FF`, rosa `#F79EE1`, crema `#EDE8DB` y negro. Brillo animado en los
  bordes (como el marco de la cápsula de Spotify) y cielo de estrellitas que titilan.
- **stop.** en Sora regular con interletrado cerrado, como el logo de post. Los títulos tipo sticker usan tres capas
  del mismo texto (contorno oscuro, contorno de color y letra llena) para que no se vean bordes internos.
- **Misceláneas**: puntos de SPOT! y flores/puntos/aros de post. — flotan, giran, laten y respiran.
- Las cápsulas son imágenes 3D (`docs/assets/capsulas/*.png`), renderizadas con three.js desde
  [`herramientas/capsulas-3d/escena.html`](herramientas/capsulas-3d/escena.html). Se pueden reemplazar por
  renders propios con el mismo nombre (PNG con fondo transparente, cuadrado).

## Configuración

Todo en [`docs/config.js`](docs/config.js):

- `PROXIMO_EVENTO`: nombre y fecha de apertura (27/10/2026, 18 h). La cápsula se abre sola cuando llega.
- `EVENTO_ACTUAL`: dónde se arma (aparece en "La sellaste el … en …").
- `DEMO`: muestra "Demo: simular que llegó el 27/10" para probar la apertura sin esperar (también `?demo`).
- `OBJETIVOS`: lista con nombre, unidad, rango, paso, valores iniciales y la pregunta del paso 2.

Por ahora la cápsula se guarda en el teléfono (`localStorage`). Para que viaje entre dispositivos y la marca
pueda avisar cuando se abre, el próximo paso es guardarla en Supabase como en Dedicatorias.
