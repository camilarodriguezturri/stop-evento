# Cápsula del tiempo · stop.

Para **stop.**, el evento de post. (27 de octubre). Extensión de la app SPOT! con la identidad de
[Dedicatorias post.](https://estefigarrido.github.io/dedicatorias-post/) (Sora / Reddit Sans / JetBrains Mono,
notita festoneada, botones pill) y la estructura de la *Spotify Time Capsule*.

- Sitio: carpeta [`docs/`](docs/) (lista para GitHub Pages, sin build).
- Probar en local: `cd docs && python3 -m http.server` → <http://localhost:8000>.

## Recorrido

1. **Inicio** (azul): título sticker, cápsulas de vidrio flotando llenas de stickers y los 4 pasos.
2. **Cómo funciona** (negro): 3 pantallas de explicación con una pila de stickers motivacionales que crece
   ("¡vos podés!", "un paso a la vez", "constancia"…). Se puede **Omitir**.
3. **Paso 1 · Elegí tu cápsula** (negro): trofeo, sobre o botella de agua, de vidrio rosa translúcido.
   La elegida se llena de stickers.
4. **Paso 2 · Sumá tus objetivos** (azul): tarjeta de preguntas con *Sumar*, *Otra pregunta* y *Aleatorio*
   (cada toque suma otra pregunta al azar; hasta 6). Cada objetivo cae como sticker adentro de tu cápsula.
5. **Paso 3 · Escribite una nota** (crema): la notita festoneada de post. Se puede *Omitir*.
6. **Paso 4 · Sellala** (negro): la cápsula llena; la nota entra como sticker, destello y sello `s.`.
7. **Carga** (negro, se puede omitir): stickers motivacionales superpuestos — "Mandando tu cápsula al 27/10…".
8. **¡Felicitaciones!** (rosa): confeti y tarjeta para compartir en historias.
9. **Esperando** (negro): cápsula llena con candado y cuenta regresiva al 27/10.
10. **El 27/10** (azul): la cápsula tiembla; carga "Abriendo tu cápsula…" y se abre como *stories*: los stickers
    salen volando → tu nota → ¿dónde estás hoy? → una pantalla por objetivo → resumen "¡Creciste!".
11. **Sellar una nueva** arranca desde los números de hoy (y sube la meta si ya la cumpliste).

## Identidad y animación

- Fondos planos por pantalla: azul `#7AA1FF`, rosa `#F79EE1`, crema `#EDE8DB` y negro. Sin gradientes;
  sombras duras. Cielo de estrellitas que titilan.
- **stop.** en Sora regular con interletrado cerrado, como el logo de post. Los títulos tipo sticker usan tres capas
  del mismo texto (contorno oscuro, contorno de color y letra llena) para que no se vean bordes internos.
- **Stickers estilo post** (globo, pastilla, flor festoneada y círculo) con los objetivos y metas de cada persona.
- **Misceláneas**: puntos de SPOT! y flores/puntos/aros de post. — flotan, giran, laten y respiran.
- **Cápsulas**: cada una son dos imágenes alineadas (`docs/assets/capsulas/<id>-atras.png` y `-frente.png`):
  los stickers van en el medio, así quedan *adentro* del vidrio. Se renderizan con three.js desde
  [`herramientas/capsulas-3d/vidrio.html`](herramientas/capsulas-3d/vidrio.html).

## Configuración

Todo en [`docs/config.js`](docs/config.js):

- `PROXIMO_EVENTO`: nombre y fecha de apertura (27/10/2026, 18 h). La cápsula se abre sola cuando llega.
- `EVENTO_ACTUAL`: dónde se arma (aparece en "La sellaste el … en …").
- `DEMO`: muestra "Demo: simular que llegó el 27/10" para probar la apertura sin esperar (también `?demo`).
- `OBJETIVOS`: lista con nombre, unidad, rango, paso, valores iniciales y la pregunta del paso 2 (hasta 6 por cápsula).

Por ahora la cápsula se guarda en el teléfono (`localStorage`). Para que viaje entre dispositivos y la marca
pueda avisar cuando se abre, el próximo paso es guardarla en Supabase como en Dedicatorias.
