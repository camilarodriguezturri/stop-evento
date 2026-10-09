# Render de las cápsulas 3D

`escena.html` arma cada objeto con three.js (`?obj=zapatilla|casco|patin|olla|botella|podio`) y lo dibuja con
fondo transparente. `render.mjs` abre la escena con Playwright y guarda un PNG por objeto.

```bash
npm i three@0.160.0                      # en esta carpeta
python3 -m http.server 8766 &            # sirve escena.html y node_modules
node render.mjs . salida zapatilla casco patin olla botella podio
```

Después recortar a 600 × 600 y copiar a `docs/assets/capsulas/`.
