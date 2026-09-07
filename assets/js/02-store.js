/* 02-store.js — Persistencia en localStorage con transacciones y migración de esquema */
window.Store = (function () {
  var db = null;
  var listeners = [];
  var disponible = (function () {
    try { var k = '__t'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return true; }
    catch (e) { return false; }
  })();
  var memoria = {}; // respaldo si localStorage está bloqueado (modo incógnito estricto)

  function lsGet(k) { try { return disponible ? localStorage.getItem(k) : (memoria[k] || null); } catch (e) { return null; } }
  function lsSet(k, v) {
    try { if (disponible) localStorage.setItem(k, v); else memoria[k] = v; return true; }
    catch (e) {
      if (e && (e.name === 'QuotaExceededError' || e.code === 22)) {
        window.UI && UI.toast('No hay espacio de almacenamiento. Libera datos en Ajustes.', 'err');
      }
      return false;
    }
  }
  function lsDel(k) { try { if (disponible) localStorage.removeItem(k); else delete memoria[k]; } catch (e) {} }

  function vacia() {
    return {
      meta: { schema: CFG.SCHEMA, creada: new Date().toISOString(), contadores: { reto: 0, proyecto: 0, constancia: 0 } },
      users: [], retos: [], postulaciones: [], proyectos: [], constancias: [],
      pruebas: [], notificaciones: [], auditoria: []
    };
  }

  /* --- Migraciones encadenadas --- */
  var MIGRACIONES = {
    // 1 -> 2 y 2 -> 3 no existieron en producción; se re-siembra para mantener coherencia
  };

  function migrar(data) {
    var v = (data.meta && data.meta.schema) || 0;
    while (v < CFG.SCHEMA && MIGRACIONES[v]) {
      data = MIGRACIONES[v](data);
      v++;
      data.meta.schema = v;
    }
    return v === CFG.SCHEMA ? data : null; // null => hay que re-sembrar
  }

  function cargar() {
    var crudo = lsGet(CFG.KEY_DB);
    if (crudo) {
      try {
        var data = JSON.parse(crudo);
        var migrada = migrar(data);
        if (migrada && migrada.users && migrada.users.length) { db = migrada; return db; }
        // esquema antiguo: respaldar antes de re-sembrar
        lsSet(CFG.KEY_DB + '.backup', crudo);
      } catch (e) {
        lsSet(CFG.KEY_DB + '.backup', crudo);
      }
    }
    db = window.SEED ? SEED.construir() : vacia();
    guardar();
    return db;
  }

  function guardar() {
    if (!db) return false;
    return lsSet(CFG.KEY_DB, JSON.stringify(db));
  }

  function get() { if (!db) cargar(); return db; }

  /* Transacción: muta y persiste una sola vez, luego avisa */
  function tx(fn) {
    var d = get();
    var r = fn(d);
    guardar();
    emitir();
    return r;
  }

  function emitir() { listeners.forEach(function (f) { try { f(); } catch (e) { console.error(e); } }); }
  function onChange(fn) { listeners.push(fn); }

  /* --- Consultas genéricas --- */
  function all(col) { return get()[col] || []; }
  function find(col, id) {
    var a = all(col);
    for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i];
    return null;
  }
  function where(col, fn) { return all(col).filter(fn); }
  function insert(col, obj) {
    tx(function (d) { d[col].push(obj); });
    return obj;
  }
  function update(col, id, cambios) {
    return tx(function (d) {
      var it = null;
      for (var i = 0; i < d[col].length; i++) if (d[col][i].id === id) it = d[col][i];
      if (!it) return null;
      Object.keys(cambios).forEach(function (k) { it[k] = cambios[k]; });
      return it;
    });
  }
  function remove(col, id) {
    tx(function (d) { d[col] = d[col].filter(function (x) { return x.id !== id; }); });
  }

  function siguienteCodigo(tipo, prefijo) {
    return tx(function (d) {
      d.meta.contadores[tipo] = (d.meta.contadores[tipo] || 0) + 1;
      var n = d.meta.contadores[tipo];
      return prefijo + '-' + new Date().getFullYear() + '-' + ('000' + n).slice(-4);
    });
  }

  function auditar(accion, entidad, entidadId, meta) {
    var u = window.Auth && Auth.actual();
    get().auditoria.push({
      id: U.uid('log'), at: new Date().toISOString(),
      actor: u ? u.id : null, rol: u ? u.rol : 'sistema',
      accion: accion, entidad: entidad, entidadId: entidadId, meta: meta || null
    });
  }

  function reiniciar() {
    lsDel(CFG.KEY_DB);
    lsDel(CFG.KEY_SESSION);
    db = window.SEED ? SEED.construir() : vacia();
    guardar();
    emitir();
  }

  function exportar() { return JSON.stringify(get(), null, 2); }
  function importar(texto) {
    var data = JSON.parse(texto);
    if (!data || !data.users) throw new Error('El archivo no tiene el formato esperado.');
    data.meta = data.meta || {}; data.meta.schema = CFG.SCHEMA;
    db = data; guardar(); emitir();
  }
  function tamanoKb() {
    try { return Math.round((lsGet(CFG.KEY_DB) || '').length / 1024); } catch (e) { return 0; }
  }

  return {
    cargar: cargar, get: get, guardar: guardar, tx: tx, onChange: onChange, emitir: emitir,
    all: all, find: find, where: where, insert: insert, update: update, remove: remove,
    siguienteCodigo: siguienteCodigo, auditar: auditar,
    reiniciar: reiniciar, exportar: exportar, importar: importar, tamanoKb: tamanoKb,
    lsGet: lsGet, lsSet: lsSet, lsDel: lsDel, disponible: disponible
  };
})();
