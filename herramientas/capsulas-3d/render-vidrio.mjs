import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const [out, ...objs] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 900, height: 900 } });
p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => m.type()==='error' && console.log('CERR', m.text()));
for (const o of objs) for (const capa of ['atras', 'frente']) {
  await p.goto(`http://localhost:8766/vidrio.html?obj=${o}&capa=${capa}`);
  await p.waitForFunction(() => window.LISTO, null, { timeout: 60000 });
  await p.screenshot({ path: `${out}/${o}-${capa}.png`, omitBackground: true });
}
await b.close();
