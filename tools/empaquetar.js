#!/usr/bin/env node
/* tools/empaquetar.js — Fusiona la app en un único archivo HTML autocontenido.
   Genera:
     dist/upn-talent-lab.html  documento completo (doble clic / compartir por WhatsApp)
     dist/artifact.html        solo el contenido, para publicadores que aportan su propio esqueleto
   Uso: node tools/empaquetar.js                                                        */

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const leer = p => fs.readFileSync(path.join(RAIZ, p), 'utf8');

const FUENTE = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap';

let html = leer('index.html');

/* --- 1. CSS en línea ---
   Se usa la forma de callback en replace() a propósito: el contenido inyectado puede
   incluir secuencias como $& o $', que en la forma de cadena se interpretarían como
   patrones de reemplazo y corromperían el resultado en silencio. */
const css = leer('assets/css/styles.css');
html = html.replace(/<link rel="stylesheet" href="assets\/css\/styles\.css">/,
  () => '<style>\n' + css + '\n</style>');

/* --- 2. JS en línea, respetando el orden de carga declarado en index.html --- */
const scripts = [];
html = html.replace(/<script src="(assets\/js\/[^"]+)"><\/script>\s*/g, (m, src) => {
  scripts.push(src);
  return '';
});
if (!scripts.length) { console.error('No se encontró ningún <script src="assets/js/...">'); process.exit(1); }

const js = scripts.map(src =>
  '/* ===== ' + src + ' ===== */\n' + leer(src)
).join('\n');

html = html.replace(/<\/body>/, () => '<script>\n' + js + '\n</script>\n</body>');

/* --- 3. Documento completo --- */
fs.mkdirSync(path.join(RAIZ, 'dist'), { recursive: true });
fs.writeFileSync(path.join(RAIZ, 'dist/upn-talent-lab.html'), html, 'utf8');

/* --- 4. Variante sin esqueleto (title + style + contenido del body) --- */
const cuerpo = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>'));
const artifact =
  '<title>UPN Talent Lab</title>\n' +
  '<link rel="stylesheet" href="' + FUENTE + '">\n' +
  '<style>\n' + css + '\n</style>\n' +
  cuerpo.replace(/<script>[\s\S]*<\/script>/, () => '<script>\n' + js + '\n</script>');
fs.writeFileSync(path.join(RAIZ, 'dist/artifact.html'), artifact, 'utf8');

const kb = f => Math.round(fs.statSync(path.join(RAIZ, f)).size / 1024);
console.log('Scripts fusionados: ' + scripts.length);
console.log('dist/upn-talent-lab.html  ' + kb('dist/upn-talent-lab.html') + ' KB');
console.log('dist/artifact.html        ' + kb('dist/artifact.html') + ' KB');
