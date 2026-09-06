/* 18-actions.js — Registro central de acciones + delegación de eventos */
window.Actions = (function () {
  var mapa = {};
  function on(nombre, fn) { mapa[nombre] = fn; }
  function ejecutar(nombre, datos, el, ev) {
    var fn = mapa[nombre];
    if (!fn) { console.warn('Acción no registrada:', nombre); return; }
    try { fn(datos, el, ev); }
    catch (e) { console.error('Error en la acción ' + nombre, e); UI.toast('Ocurrió un error inesperado.', 'err'); }
  }

  /* ================= Interfaz ================= */
  on('ui:abrir-menu', function () { UI.abrirMenu(); });
  on('ui:cerrar-menu', function () { UI.cerrarMenu(); });
  on('ui:cerrar-modal', function () { UI.cerrarModal(); });
  on('ui:copiar', function (d) { UI.copiar(d.texto || ''); });
  on('ui:imprimir', function () { window.print(); });
  on('ui:tema', function (d) {
    var actual = UI.temaActual();
    var siguiente = d.tema || (actual === 'oscuro' ? 'claro' : 'oscuro');
    UI.tema(siguiente);
    Router.refresh();
  });

  /* ================= Sesión ================= */
  on('auth:login', function (d) {
    var res = Auth.login(d.email, d.pass);
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast('Bienvenido, ' + res.user.nombre.split(' ')[0], 'ok');
    Router.go('#' + (d.next && d.next !== '/ingresar' ? d.next : '/'));
  });
  on('auth:demo', function (d) {
    var u = Auth.iniciarSesionPorId(d.id);
    if (!u) return UI.toast('No se pudo iniciar la sesión demo.', 'err');
    UI.toast('Ingresaste como ' + u.nombre, 'ok');
    Router.go('#/');
  });
  on('auth:registro', function (d) {
    var res = Auth.registrar(d);
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast('¡Cuenta creada! Completa tu perfil para empezar.', 'ok');
    Router.go('#/');
  });
  on('auth:salir', function () {
    Auth.logout();
    UI.toast('Sesión cerrada');
    Router.go('#/');
  });

  /* ================= Retos ================= */
  on('reto:guardar', function (d) {
    var u = Auth.actual();
    var req = [].concat(d.req || []);
    var criticas = [].concat(d.criticas || []);
    var des = [].concat(d.des || []).filter(function (s) { return req.indexOf(s) === -1; });
    /* Las "indispensables" también cuentan como requeridas */
    criticas.forEach(function (s) { if (req.indexOf(s) === -1) req.push(s); });
    if (!req.length) return UI.toast('Marca al menos una habilidad requerida.', 'err');

    var habilidades = req.map(function (s) {
      var critica = criticas.indexOf(s) !== -1;
      return { skill: s, peso: critica ? 3 : 2, nivelMin: critica ? 3 : 2 };
    });
    var datos = {
      titulo: d.titulo, problema: d.problema, resultado: d.resultado, categoria: d.categoria,
      entregables: String(d.entregables || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean),
      habilidadesRequeridas: habilidades, habilidadesDeseables: des,
      semanas: d.semanas, horasSemana: d.horasSemana, tamanoEquipo: d.tamanoEquipo,
      modalidad: d.modalidad, fechaLimitePostulacion: d.fechaLimitePostulacion
    };

    var reto;
    if (d.id) {
      reto = M.reto(d.id);
      if (!reto || !Auth.can('reto:editar', reto)) return UI.toast('No puedes editar este reto.', 'err');
      Store.update('retos', d.id, datos);
      reto = M.reto(d.id);
    } else {
      var empresaId = u.rol === 'coordinador' ? d.empresaId : u.id;
      if (!empresaId) return UI.toast('Selecciona la empresa que plantea el reto.', 'err');
      reto = M.crearReto(empresaId, datos);
    }

    if (d.accion === 'enviar') {
      var res = M.transicionReto(reto.id, 'en_revision');
      if (!res.ok) { UI.toast(res.error, 'err'); return Router.go('#/reto/' + reto.id); }
      UI.toast('Reto enviado a revisión de la UPN.', 'ok');
    } else {
      UI.toast('Reto guardado como borrador.', 'ok');
    }
    Router.go('#/reto/' + reto.id);
  });

  on('reto:transicion', function (d) {
    var res = M.transicionReto(d.id, d.destino);
    if (!res.ok) return UI.toast(res.error, 'err');
    var msg = { en_revision: 'Reto enviado a revisión.', publicado: 'Reto publicado. Ya es visible para los estudiantes.',
      en_seleccion: 'Postulaciones cerradas. Ya puedes conformar el equipo.' };
    UI.toast(msg[d.destino] || 'Reto actualizado.', 'ok');
    if (d.destino === 'en_seleccion') Router.go('#/matching/' + d.id);
    else Router.refresh();
  });

  on('reto:observar', function (d) {
    UI.abrirModal('Devolver con observaciones', U.html`
      <form data-action="reto:observar-enviar">
        <input type="hidden" name="id" value="${d.id}">
        <p class="small muted">La empresa recibirá tu comentario y podrá corregir el reto.</p>
        ${C.campo({ name: 'nota', label: '¿Qué debe ajustar la empresa?', tipo: 'textarea', rows: 4, required: true,
          placeholder: 'Ej.: el alcance es muy amplio para 3 semanas; conviene enfocarlo solo en Instagram.' })}
        <button class="btn btn--primary btn--block" type="submit">Enviar observaciones</button>
      </form>`);
  });
  on('reto:observar-enviar', function (d) {
    var res = M.transicionReto(d.id, 'observado', { nota: d.nota });
    UI.cerrarModal();
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast('Observaciones enviadas a la empresa.', 'ok');
    Router.refresh();
  });

  on('reto:rechazar', function (d) {
    UI.abrirModal('Rechazar reto', U.html`
      <form data-action="reto:rechazar-enviar">
        <input type="hidden" name="id" value="${d.id}">
        ${C.campo({ name: 'nota', label: 'Motivo del rechazo', tipo: 'textarea', rows: 3, required: true })}
        <button class="btn btn--danger btn--block" type="submit">Rechazar reto</button>
      </form>`);
  });
  on('reto:rechazar-enviar', function (d) {
    var res = M.transicionReto(d.id, 'rechazado', { nota: d.nota });
    UI.cerrarModal();
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast('Reto rechazado.', 'ok');
    Router.refresh();
  });

  /* ================= Postulaciones ================= */
  on('postulacion:abrir', function (d) {
    var r = M.reto(d.id);
    if (!r) return;
    UI.abrirModal('Postular a “' + U.truncar(r.titulo, 40) + '”', U.html`
      <form data-action="postulacion:enviar">
        <input type="hidden" name="retoId" value="${r.id}">
        <p class="small muted">Cuéntale a la empresa por qué quieres participar y qué puedes aportar.
          Esto es lo primero que lee la coordinación.</p>
        ${C.campo({ name: 'motivacion', label: 'Tu motivación', tipo: 'textarea', rows: 5, required: true,
          placeholder: 'Ej.: manejo redes de dos emprendimientos familiares y puedo ir al local a tomar las fotos.' })}
        <label class="checkline checkline--on">
          <input type="checkbox" name="disponibilidad" value="true" checked required>
          <span>Confirmo que puedo dedicar ${r.horasSemana} horas por semana durante ${r.semanas} semanas.</span>
        </label>
        <button class="btn btn--primary btn--block mt-sm" type="submit">Enviar postulación</button>
      </form>`);
  });
  on('postulacion:enviar', function (d) {
    var u = Auth.actual();
    var res = M.postular(u.id, d.retoId, d);
    UI.cerrarModal();
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast('¡Postulación enviada! Te avisaremos por notificación.', 'ok');
    Router.refresh();
  });
  on('postulacion:retirar', function (d) {
    var res = M.retirarPostulacion(d.id);
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast('Postulación retirada.');
    Router.refresh();
  });

  /* ================= Conformación de equipo ================= */
  function seleccionActual() {
    var q = Router.parseHash().query;
    return q.sel ? q.sel.split(',').filter(Boolean) : null;
  }
  on('equipo:toggle', function (d, el) {
    var r = M.reto(d.reto);
    var sel = seleccionActual();
    if (sel === null) sel = Matching.sugerirEquipo(d.reto).ids;
    var i = sel.indexOf(d.id);
    if (i === -1) {
      if (r && sel.length >= (r.tamanoEquipo || 2) + 2) return UI.toast('El equipo ya es bastante grande para este reto.', 'warn');
      sel.push(d.id);
    } else sel.splice(i, 1);
    Router.setQuery({ sel: sel.join(',') || 'ninguno' });
  });
  on('equipo:sugerir', function (d) {
    var s = Matching.sugerirEquipo(d.id);
    if (!s.ids.length) return UI.toast('No hay postulantes elegibles para sugerir un equipo.', 'warn');
    Router.setQuery({ sel: s.ids.join(',') });
    UI.toast('Equipo sugerido: ' + s.cobertura.pct + '% de cobertura de habilidades.', 'ok');
  });
  on('equipo:mentor', function (d, el) { Router.setQuery({ mentor: el.value }); });
  on('equipo:conformar', function (d) {
    var ids = String(d.estudianteIds || '').split(',').filter(function (x) { return x && x !== 'ninguno'; });
    var res = M.conformarEquipo(d.retoId, { estudianteIds: ids, mentorId: d.mentorId, inicio: d.inicio, liderId: ids[0] });
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast('¡Equipo conformado! El proyecto ' + res.proyecto.codigo + ' ya está en marcha.', 'ok', 5000);
    Router.go('#/proyecto/' + res.proyecto.id);
  });

  /* ================= Proyecto ================= */
  on('hito:entregar', function (d) {
    var res = M.entregarHito(d.proyectoId, d.hitoId, d);
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast('Hito entregado. Tu mentor fue notificado.', 'ok');
    Router.refresh();
  });
  on('hito:revisar', function (d) {
    var res = M.revisarHito(d.proyectoId, d.hitoId, d.decision, d.feedback);
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast(d.decision === 'aprobado' ? 'Hito aprobado.' : 'Hito devuelto con observaciones.', 'ok');
    Router.refresh();
  });
  on('bitacora:agregar', function (d) {
    var res = M.agregarBitacora(d.proyectoId, { tipo: d.tipo, semana: d.semana, horas: d.horas,
      texto: d.texto, visibleEmpresa: d.visibleEmpresa === 'true' });
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast('Registro guardado en la bitácora.', 'ok');
    Router.refresh();
  });
  on('entrega:final', function (d) {
    var enlaces = [];
    for (var i = 1; i <= 3; i++) {
      if (d['url' + i]) enlaces.push({ label: d['label' + i] || 'Entregable ' + i, url: d['url' + i] });
    }
    var res = M.entregaFinal(d.proyectoId, { titulo: d.titulo, resumen: d.resumen, enlaces: enlaces });
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast('¡Entrega final enviada! El mentor y la empresa fueron notificados.', 'ok', 5000);
    Router.setQuery({ tab: 'evaluacion' });
  });
  on('evaluacion:enviar', function (d) {
    var res = M.evaluar(d.proyectoId, d);
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast(d.decision === 'aprobado' ? 'Evaluación registrada. ¡Gracias!' : 'Entrega devuelta al equipo con observaciones.', 'ok');
    Router.refresh();
  });

  /* ================= Constancias ================= */
  on('constancia:emitir', function (d) {
    var res = M.emitirConstancias(d.id);
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast('Se emitieron ' + res.constancias.length + ' constancias y el proyecto quedó cerrado.', 'ok', 5000);
    Router.refresh();
  });
  on('constancia:anular', function (d) {
    UI.abrirModal('Anular constancia', U.html`
      <form data-action="constancia:anular-enviar">
        <input type="hidden" name="id" value="${d.id}">
        ${C.aviso('warn', '⚠️', 'La constancia dejará de ser válida en la verificación pública y saldrá del portafolio del estudiante.')}
        ${C.campo({ name: 'motivo', label: 'Motivo de la anulación', tipo: 'textarea', rows: 3, required: true })}
        <button class="btn btn--danger btn--block" type="submit">Anular constancia</button>
      </form>`);
  });
  on('constancia:anular-enviar', function (d) {
    var res = M.anularConstancia(d.id, d.motivo);
    UI.cerrarModal();
    if (!res.ok) return UI.toast(res.error, 'err');
    UI.toast('Constancia anulada.');
    Router.refresh();
  });
  on('cert:verificar', function (d) {
    var cod = String(d.codigo || '').trim().toUpperCase();
    if (!cod) return UI.toast('Escribe un código.', 'err');
    Router.go('#/verificar/' + encodeURIComponent(cod));
  });

  /* ================= Perfil ================= */
  on('perfil:guardar', function (d) {
    var u = Auth.actual();
    if (!u) return;
    var cambios = {};
    ['nombre', 'bio', 'carrera', 'campus', 'distrito', 'modalidad', 'razonSocial', 'ruc', 'sector',
     'web', 'cargo', 'descripcion', 'facultad', 'especialidad', 'area'].forEach(function (k) {
      if (d[k] !== undefined) cambios[k] = String(d[k]).trim();
    });
    ['ciclo', 'horasSemana', 'trabajadores', 'maxProyectos'].forEach(function (k) {
      if (d[k] !== undefined && d[k] !== '') cambios[k] = parseInt(d[k], 10);
    });
    if (u.rol === 'estudiante') {
      cambios.portafolioPublico = d.portafolioPublico === 'true';
      var habs = [];
      Object.keys(CFG.HABILIDADES).forEach(function (k) {
        var v = parseInt(d['hab_' + k], 10);
        if (v >= 1 && v <= 5) habs.push({ skill: k, nivel: v });
      });
      cambios.habilidades = habs;
      if (cambios.carrera) cambios.intereses = CFG.CARRERAS[cambios.carrera] || u.intereses || [];
      if (cambios.nombre && u.codigoUPN) cambios.slug = U.slugify(cambios.nombre) + '-' + u.codigoUPN.slice(-4);
    }
    if (u.rol === 'mentor' && d.habilidades !== undefined) cambios.habilidades = [].concat(d.habilidades || []);
    Store.update('users', u.id, cambios);
    UI.toast('Perfil actualizado.', 'ok');
    Router.refresh();
  });

  on('portafolio:guardar', function (d) {
    var u = Auth.actual();
    Store.tx(function () {
      (u.portafolio || []).forEach(function (i) {
        if (i.id === d.itemId) { i.relato = String(d.relato || '').trim(); i.visible = d.visible === 'true'; }
      });
    });
    UI.toast('Portafolio actualizado.', 'ok');
    Router.refresh();
  });

  /* ================= Notificaciones ================= */
  on('notif:leer-todas', function () {
    M.marcarLeidas(Auth.actual().id);
    UI.toast('Notificaciones marcadas como leídas.');
    Router.refresh();
  });
  on('notif:abrir', function (d, el) {
    var n = Store.find('notificaciones', d.id);
    if (n && !n.leida) Store.update('notificaciones', d.id, { leida: true });
  });

  /* ================= Filtros ================= */
  function filtro(base) {
    return function (d) {
      var qs = Object.keys(d).filter(function (k) { return d[k] !== ''; })
        .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(d[k]); }).join('&');
      Router.go('#' + base + (qs ? '?' + qs : ''));
    };
  }
  on('filtro:retos', filtro('/retos'));
  on('filtro:talento', filtro('/talento'));
  on('filtro:constancias', filtro('/constancias'));

  /* ================= Datos ================= */
  /* Algunos visores incrustados no permiten descargas, así que además de intentar
     el archivo se ofrece copiar el contenido, que funciona en cualquier entorno. */
  on('datos:exportar', function () {
    var json = Store.exportar();
    UI.abrirModal('Copia de seguridad', U.html`
      <p class="small muted">Guarda este contenido en un archivo <code>.json</code>.
        Puedes restaurarlo más adelante desde cualquier dispositivo.</p>
      <div class="btnrow">
        <button class="btn btn--primary btn--sm" data-action="datos:copiar">Copiar todo</button>
        <button class="btn btn--ghost btn--sm" data-action="datos:descargar">Intentar descargar</button>
      </div>
      <textarea class="textarea mt-sm" readonly rows="8"
        style="font-family:ui-monospace,Menlo,monospace;font-size:.72rem" id="copia-json">${json}</textarea>
      <p class="tiny muted mb0">${Math.round(json.length / 1024)} KB · ${Store.all('users').length} usuarios,
        ${Store.all('retos').length} retos, ${Store.all('proyectos').length} proyectos.</p>`);
  });
  on('datos:copiar', function () { UI.copiar(Store.exportar()); });
  on('datos:descargar', function () {
    try {
      var blob = new Blob([Store.exportar()], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'upn-talent-lab-' + U.hoy() + '.json';
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      UI.toast('Si tu navegador no la descargó, usa “Copiar todo”.', 'ok', 5000);
    } catch (e) { UI.toast('Este entorno no permite descargas. Usa “Copiar todo”.', 'warn', 5000); }
  });
  on('datos:reiniciar', function () {
    Store.reiniciar();
    Auth.restaurar();
    UI.toast('Datos de demostración restaurados.', 'ok');
    Router.go('#/');
    Router.refresh();
  });

  /* ================= Delegación ================= */
  function datosDe(el) {
    var d = {};
    for (var k in el.dataset) if (k !== 'action' && k !== 'confirm') d[k] = el.dataset[k];
    return d;
  }

  function iniciar() {
    document.addEventListener('click', function (ev) {
      var el = ev.target.closest && ev.target.closest('[data-action]');
      if (!el || el.tagName === 'FORM') return;
      if (el.tagName === 'INPUT' && el.type === 'checkbox') return; // lo maneja "change"
      if (el.tagName === 'SELECT') return;
      var accion = el.dataset.action;
      if (el.tagName === 'A' && accion === 'notif:abrir') { ejecutar(accion, datosDe(el), el, ev); return; }
      ev.preventDefault();
      if (el.dataset.confirm && !window.confirm(el.dataset.confirm)) return;
      ejecutar(accion, datosDe(el), el, ev);
    });

    document.addEventListener('change', function (ev) {
      var el = ev.target.closest && ev.target.closest('[data-action]');
      if (!el || el.tagName === 'FORM') return;
      if (el.tagName !== 'INPUT' && el.tagName !== 'SELECT') return;
      ejecutar(el.dataset.action, datosDe(el), el, ev);
    });

    document.addEventListener('submit', function (ev) {
      var form = ev.target.closest && ev.target.closest('form[data-action]');
      if (!form) return;
      ev.preventDefault();
      if (form.dataset.confirm && !window.confirm(form.dataset.confirm)) return;
      var datos = U.formData(form);
      var sub = ev.submitter;
      if (sub && sub.name) datos[sub.name] = sub.value;
      ejecutar(form.dataset.action, datos, form, ev);
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') {
        if (UI.modalAbierto()) UI.cerrarModal();
        else UI.cerrarMenu();
      }
      UI.atraparFoco(ev);
    });
  }

  return { on: on, ejecutar: ejecutar, iniciar: iniciar };
})();
