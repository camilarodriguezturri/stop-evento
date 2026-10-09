# Render de las cápsulas de vidrio

Las cápsulas (trofeo, sobre, botella) se dibujan con three.js y un shader de vidrio rosa, en dos capas
alineadas: `atras` (el fondo de la cápsula) y `frente` (el vidrio). En la app los stickers van entre las dos.

```bash
npm i three@0.160.0                 # en esta carpeta
python3 -m http.server 8766 &       # sirve vidrio.html y node_modules
node render-vidrio.mjs salida trofeo sobre botella
```

Genera `salida/<obj>-atras.png` y `salida/<obj>-frente.png` (900 × 900, fondo transparente).
Recortar ambas con el mismo encuadre a 600 × 600 y copiarlas a `docs/assets/capsulas/`.
