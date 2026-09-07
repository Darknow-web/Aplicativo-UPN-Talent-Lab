/* server.js — Servidor estático sin dependencias para UPN Talent Lab.
   Pensado para Cloud Run: escucha en $PORT y en 0.0.0.0. También sirve para
   desarrollo local con `npm start`.                                            */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const RAIZ = __dirname;
/* Cloud Run INYECTA el puerto en $PORT y comprueba que el contenedor escuche
   justamente ahí: si se fija a un número, la instancia nunca responde y el
   despliegue falla. El 3000 es solo el valor por defecto para trabajar en
   local. No reemplazar esta línea por un puerto fijo. */
const PUERTO = 3000;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.pdf': 'application/pdf'
};

/* Solo se sirven estos directorios y archivos: el resto del repositorio
   (workflows, herramientas, .git) no tiene por qué quedar expuesto. */
const PERMITIDOS = [
  /^index\.html$/,
  /^404\.html$/,
  /^metadata\.json$/,
  /^assets\//,
  /^dist\//
];

function esPermitido(rel) {
  return PERMITIDOS.some(function (re) { return re.test(rel); });
}

/* Resuelve la ruta pedida dentro de la raíz.
   Devuelve null si se sale de ella (path traversal) o no está permitida. */
function resolver(pathname) {
  let decodificado;
  try { decodificado = decodeURIComponent(pathname); }
  catch (e) { return null; }                       // %-encoding inválido

  if (decodificado.indexOf('\0') !== -1) return null;

  const rel = decodificado.replace(/^\/+/, '') || 'index.html';
  const absoluto = path.resolve(RAIZ, rel);

  // La comprobación de verdad: el archivo debe quedar dentro de la raíz.
  if (absoluto !== RAIZ && !absoluto.startsWith(RAIZ + path.sep)) return null;

  const dentro = path.relative(RAIZ, absoluto).split(path.sep).join('/');
  if (!esPermitido(dentro)) return null;

  return absoluto;
}

function cabeceras(tipo, longitud, cache) {
  return {
    'Content-Type': tipo || 'text/plain; charset=utf-8',
    /* Declarar la longitud no es opcional: sin ella la respuesta va troceada y,
       si un proxy la corta a la mitad, el navegador la da por completa. Un .js
       cortado no se puede interpretar, se descarta entero y su global nunca se
       define -> la app arranca creyendo que falta un módulo. Con Content-Length
       el corte falla a la vista en vez de colarse en silencio. No quitar. */
    'Content-Length': longitud,
    'Cache-Control': cache || 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
}

function enviar(res, codigo, cuerpo, tipo, cache) {
  res.writeHead(codigo, cabeceras(tipo, Buffer.byteLength(cuerpo), cache));
  res.end(cuerpo);
}

function noEncontrado(res) {
  fs.readFile(path.join(RAIZ, '404.html'), function (err, buf) {
    if (err) return enviar(res, 404, 'No encontrado');
    enviar(res, 404, buf, TIPOS['.html']);
  });
}

const servidor = http.createServer(function (req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return enviar(res, 405, 'Método no permitido');
  }

  let pathname;
  try { pathname = new URL(req.url, 'http://localhost').pathname; }
  catch (e) { return enviar(res, 400, 'Petición inválida'); }

  const archivo = resolver(pathname);
  if (!archivo) return noEncontrado(res);

  fs.stat(archivo, function (err, st) {
    if (err || !st.isFile()) return noEncontrado(res);

    const ext = path.extname(archivo).toLowerCase();
    const tipo = TIPOS[ext] || 'application/octet-stream';
    /* Los assets no llevan hash en el nombre, así que un cacheo largo dejaría
       a la gente con una versión vieja después de cada despliegue. */
    const cache = ext === '.html' ? 'no-cache' : 'public, max-age=300';

    if (req.method === 'HEAD') {
      res.writeHead(200, cabeceras(tipo, st.size, cache));
      return res.end();
    }

    fs.readFile(archivo, function (err2, buf) {
      if (err2) return enviar(res, 500, 'Error al leer el archivo');
      enviar(res, 200, buf, tipo, cache);
    });
  });
});

servidor.listen(PUERTO, '0.0.0.0', function () {
  console.log('UPN Talent Lab escuchando en http://0.0.0.0:' + PUERTO);
});

/* Cloud Run envía SIGTERM al retirar una instancia. */
process.on('SIGTERM', function () {
  servidor.close(function () { process.exit(0); });
});
