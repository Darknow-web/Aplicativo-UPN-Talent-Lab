/* 01-utils.js — Utilidades y plantillas HTML seguras (barrera anti-XSS) */
window.U = (function () {

  /* ---- Escape ---- */
  var MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(v) {
    if (v === null || v === undefined) return '';
    return String(v).replace(/[&<>"']/g, function (c) { return MAP[c]; });
  }

  /* ---- Raw: marca contenido ya seguro ---- */
  function Raw(s) { this.value = s; }
  Raw.prototype.toString = function () { return this.value; };
  function raw(s) { return new Raw(s == null ? '' : String(s)); }

  function render(v) {
    if (v === null || v === undefined || v === false || v === true) return '';
    if (v instanceof Raw) return v.value;
    if (Array.isArray(v)) {
      var out = '';
      for (var i = 0; i < v.length; i++) out += render(v[i]);
      return out;
    }
    return esc(v);
  }

  /* Tagged template: escapa TODA interpolación salvo Raw/arrays de Raw */
  function html(strings) {
    var out = strings[0];
    for (var i = 1; i < arguments.length; i++) out += render(arguments[i]) + strings[i];
    return new Raw(out);
  }

  /* Convierte cualquier valor de vista a string listo para innerHTML */
  function str(v) { return render(v); }

  /* URLs seguras: bloquea javascript:, vbscript:, data: no-imagen */
  function safeUrl(u) {
    if (!u) return '';
    var s = String(u).trim();
    if (/^(https?:\/\/|mailto:|tel:|#|\.\/|\/)/i.test(s)) return s;
    if (/^data:image\//i.test(s)) return s;
    if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(s)) return 'https://' + s; // "midominio.com/x"
    return '';
  }
  function hostOf(u) {
    var s = safeUrl(u);
    if (!s) return '';
    try { return new URL(s, 'https://x.invalid').hostname.replace(/^www\./, ''); } catch (e) { return s; }
  }

  /* ---- Identificadores ---- */
  function uid(prefix) {
    var r;
    if (window.crypto && window.crypto.randomUUID) r = window.crypto.randomUUID().slice(0, 8);
    else r = Math.random().toString(36).slice(2, 10);
    return (prefix || 'id') + '_' + r;
  }
  var ALFA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sin 0 O 1 I L
  function bloqueCodigo(n) {
    var s = '';
    for (var i = 0; i < n; i++) s += ALFA.charAt(Math.floor(Math.random() * ALFA.length));
    return s;
  }
  function slugify(s) {
    return String(s || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  }
  function iniciales(nombre) {
    var p = String(nombre || '?').trim().split(/\s+/);
    return ((p[0] || '?')[0] + (p.length > 1 ? p[1][0] : '')).toUpperCase();
  }

  /* ---- Fechas (se guardan como YYYY-MM-DD) ---- */
  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
  var MESES_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];
  function hoy() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function parseFecha(s) {
    if (!s) return null;
    var p = String(s).slice(0, 10).split('-');
    if (p.length < 3) return null;
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function sumarDias(s, dias) {
    var d = parseFecha(s); if (!d) return s;
    d.setDate(d.getDate() + dias);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function fecha(s) {
    var d = parseFecha(s); if (!d) return '—';
    return d.getDate() + ' ' + MESES[d.getMonth()] + ' ' + d.getFullYear();
  }
  function fechaLarga(s) {
    var d = parseFecha(s); if (!d) return '—';
    return d.getDate() + ' de ' + MESES_L[d.getMonth()] + ' de ' + d.getFullYear();
  }
  function diasEntre(a, b) {
    var x = parseFecha(a), y = parseFecha(b);
    if (!x || !y) return 0;
    return Math.round((y - x) / 86400000);
  }
  function haceTiempo(iso) {
    if (!iso) return '';
    var t = new Date(iso).getTime();
    if (isNaN(t)) return '';
    var m = Math.floor((Date.now() - t) / 60000);
    if (m < 1) return 'ahora';
    if (m < 60) return 'hace ' + m + ' min';
    var h = Math.floor(m / 60);
    if (h < 24) return 'hace ' + h + ' h';
    var d = Math.floor(h / 24);
    if (d === 1) return 'ayer';
    if (d < 30) return 'hace ' + d + ' días';
    return fecha(new Date(t).toISOString().slice(0, 10));
  }

  /* ---- Varios ---- */
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }
  function debounce(fn, ms) {
    var t; return function () {
      var self = this, args = arguments;
      clearTimeout(t); t = setTimeout(function () { fn.apply(self, args); }, ms || 250);
    };
  }
  function groupBy(arr, key) {
    return (arr || []).reduce(function (acc, it) {
      var k = typeof key === 'function' ? key(it) : it[key];
      (acc[k] = acc[k] || []).push(it); return acc;
    }, {});
  }
  function sortBy(arr, fn, desc) {
    return (arr || []).slice().sort(function (a, b) {
      var x = fn(a), y = fn(b);
      if (x === y) return 0;
      return (x > y ? 1 : -1) * (desc ? -1 : 1);
    });
  }
  function unique(arr) { return (arr || []).filter(function (v, i, a) { return a.indexOf(v) === i; }); }
  function sum(arr, fn) { return (arr || []).reduce(function (t, x) { return t + (fn ? fn(x) : x); }, 0); }
  function truncar(s, n) {
    s = String(s || '');
    return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
  }
  function plural(n, uno, muchos) { return n === 1 ? uno : (muchos || uno + 's'); }

  /* FormData -> objeto (soporta campos múltiples con name="x[]") */
  function formData(form) {
    var o = {};
    new FormData(form).forEach(function (v, k) {
      if (k.slice(-2) === '[]') {
        k = k.slice(0, -2);
        (o[k] = o[k] || []).push(v);
      } else if (o.hasOwnProperty(k)) {
        o[k] = [].concat(o[k], v);
      } else o[k] = v;
    });
    return o;
  }

  function normaliza(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function contiene(texto, termino) {
    if (!termino) return true;
    return normaliza(texto).indexOf(normaliza(termino)) !== -1;
  }

  return {
    esc: esc, raw: raw, html: html, str: str, safeUrl: safeUrl, hostOf: hostOf,
    uid: uid, bloqueCodigo: bloqueCodigo, slugify: slugify, iniciales: iniciales,
    hoy: hoy, fecha: fecha, fechaLarga: fechaLarga, sumarDias: sumarDias,
    diasEntre: diasEntre, haceTiempo: haceTiempo, parseFecha: parseFecha,
    clamp: clamp, pct: pct, debounce: debounce, groupBy: groupBy, sortBy: sortBy,
    unique: unique, sum: sum, truncar: truncar, plural: plural,
    formData: formData, normaliza: normaliza, contiene: contiene
  };
})();
