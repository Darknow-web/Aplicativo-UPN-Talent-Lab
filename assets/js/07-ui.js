/* 07-ui.js — Toasts, modales y utilidades de interfaz */
window.UI = (function () {
  var ultimoFoco = null;

  function toast(mensaje, tipo, ms) {
    var cont = document.getElementById('toasts');
    if (!cont) return;
    var el = document.createElement('div');
    el.className = 'toast' + (tipo ? ' toast--' + tipo : '');
    el.textContent = mensaje;
    cont.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transition = 'opacity .25s';
      setTimeout(function () { el.remove(); }, 260);
    }, ms || 3600);
  }

  function abrirModal(titulo, contenidoHtml) {
    var m = document.getElementById('modal');
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-cuerpo').innerHTML = U.str(contenidoHtml);
    ultimoFoco = document.activeElement;
    m.hidden = false;
    document.body.style.overflow = 'hidden';
    var f = m.querySelector('input,select,textarea,button:not([data-action="ui:cerrar-modal"])');
    if (f) setTimeout(function () { f.focus(); }, 60);
  }

  function cerrarModal() {
    var m = document.getElementById('modal');
    if (!m || m.hidden) return;
    m.hidden = true;
    document.getElementById('modal-cuerpo').innerHTML = '';
    document.body.style.overflow = '';
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    ultimoFoco = null;
  }

  function modalAbierto() { var m = document.getElementById('modal'); return m && !m.hidden; }

  /* Trampa de foco dentro del modal */
  function atraparFoco(e) {
    if (!modalAbierto() || e.key !== 'Tab') return;
    var box = document.querySelector('.modal__box');
    var f = box.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var primero = f[0], ultimo = f[f.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  }

  function abrirMenu() {
    document.getElementById('sidebar').classList.add('is-open');
    document.getElementById('scrim').hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function cerrarMenu() {
    document.getElementById('sidebar').classList.remove('is-open');
    document.getElementById('scrim').hidden = true;
    if (!modalAbierto()) document.body.style.overflow = '';
  }

  function tema(nuevo) {
    var t = nuevo || Store.lsGet(CFG.KEY_TEMA) || 'auto';
    if (t === 'auto') document.documentElement.removeAttribute('data-tema');
    else document.documentElement.setAttribute('data-tema', t);
    if (nuevo) Store.lsSet(CFG.KEY_TEMA, t);
    return t;
  }
  function temaActual() { return Store.lsGet(CFG.KEY_TEMA) || 'auto'; }

  function copiar(texto) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(function () { toast('Copiado al portapapeles', 'ok'); },
        function () { toast('No se pudo copiar', 'err'); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = texto; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('Copiado al portapapeles', 'ok'); }
      catch (e) { toast('No se pudo copiar', 'err'); }
      ta.remove();
    }
  }

  return {
    toast: toast, abrirModal: abrirModal, cerrarModal: cerrarModal, modalAbierto: modalAbierto,
    atraparFoco: atraparFoco, abrirMenu: abrirMenu, cerrarMenu: cerrarMenu,
    tema: tema, temaActual: temaActual, copiar: copiar
  };
})();
