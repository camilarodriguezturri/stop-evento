import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const [dir, out, ...objs] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 900, height: 900 } });
p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => m.type()==='error' && console.log('CERR', m.text()));
for (const o of objs) {
  await p.goto('http://localhost:8766/index.html?obj=' + o);
  await p.waitForFunction(() => window.LISTO, null, { timeout: 60000 });
  await p.screenshot({ path: `${out}/${o}.png`, omitBackground: true });
  console.log('ok', o);
}
await b.close();
