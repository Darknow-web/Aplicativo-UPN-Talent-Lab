/* 11-views-empresa.js — Panel de empresa, catálogo de retos, detalle y formulario de reto */
window.Vistas = window.Vistas || {};
(function () {
  var h = U.html, raw = U.raw;

  /* ================= Panel de empresa ================= */
  Vistas.panelEmpresa = function (u) {
    var mios = Store.where('retos', function (r) { return r.empresaId === u.id; });
    var proys = M.proyectosDe(u.id);
    var activos = proys.filter(function (p) { return ['en_curso', 'en_validacion'].indexOf(p.estado) !== -1; });
    var porEvaluar = proys.filter(function (p) { return Auth.can('evaluar:empresa', p); });
    var borradores = mios.filter(function (r) { return ['borrador', 'observado'].indexOf(r.estado) !== -1; });

    return h`
      ${C.pageHead('Hola, ' + u.nombre.split(' ')[0] + ' 👋', (u.razonSocial || '') + ' · ' + u.distrito,
        h`<a class="btn btn--primary" href="#/reto/nuevo">${C.icono('mas', 18)} Publicar un reto</a>`)}

      ${C.tarjetaAcciones(u)}

      <div class="grid grid--stats">
        ${C.stat('Retos publicados', mios.filter(function (r) { return ['publicado', 'en_seleccion'].indexOf(r.estado) !== -1; }).length, 'recibiendo postulaciones', true)}
        ${C.stat('Proyectos activos', activos.length, 'en ejecución ahora')}
        ${C.stat('Proyectos cerrados', proys.filter(function (p) { return p.estado === 'cerrado'; }).length, 'con entregable recibido')}
        ${C.stat('Estudiantes UPN', U.unique([].concat.apply([], proys.map(function (p) { return p.estudianteIds; }))).length, 'han trabajado contigo')}
      </div>

      <div class="split mt">
        <div>
          <h2>Mis proyectos</h2>
          ${proys.length ? h`<div class="grid grid--2 mt-sm">${U.sortBy(proys, function (p) { return p.inicio; }, true).map(C.cardProyecto)}</div>`
            : C.vacio('🚀', 'Todavía no tienes proyectos', 'Cuando la UPN conforme el equipo para uno de tus retos, aparecerá aquí.')}

          <h2 class="mt">Mis retos</h2>
          ${mios.length ? h`<div class="panel"><ul class="list">${U.sortBy(mios, function (r) { return r.creado; }, true).map(filaReto)}</ul></div>`
            : C.vacio('📋', 'Aún no publicas ningún reto', 'Cuéntanos qué necesitas resolver y la UPN te propondrá un equipo.',
                h`<a class="btn btn--primary" href="#/reto/nuevo">Publicar mi primer reto</a>`)}
        </div>
        <div class="stack">
          <div class="card card--accent">
            <h3>¿Qué puedo pedir?</h3>
            <p class="small muted">Un reto funciona cuando es concreto y cabe en 2 a 4 semanas.</p>
            <ul class="small muted" style="margin-bottom:0">
              <li>Reactivar redes sociales y crear contenido</li>
              <li>Ordenar el inventario o un proceso</li>
              <li>Calcular costos y fijar precios</li>
              <li>Armar una web o catálogo simple</li>
              <li>Diseñar identidad de marca y etiquetas</li>
              <li>Construir un tablero de ventas</li>
            </ul>
          </div>
          ${tarjetaPerfilEmpresa(u)}
        </div>
      </div>`;
  };

  function tarjetaPerfilEmpresa(u) {
    return h`<div class="card">
      <div class="card__head">${C.avatar(u, 'avatar--lg')}
        <div class="hcol"><h3 class="card__title">${u.razonSocial || u.nombre}</h3>
          <p class="tiny muted mb0">${u.sector || ''}</p></div></div>
      <p class="small muted">${U.truncar(u.descripcion || 'Completa la descripción de tu negocio para que los estudiantes te conozcan.', 150)}</p>
      <a class="btn btn--ghost btn--sm btn--block" href="#/perfil">Editar datos de la empresa</a>
    </div>`;
  }

  function filaReto(r) {
    var post = M.postulacionesDe(r.id).length;
    return h`<li><a class="listitem" href="#/reto/${r.id}">
      <span class="avatar avatar--sm" aria-hidden="true">${M.categoria(r.categoria).icono}</span>
      <span class="listitem__main">
        <span class="listitem__t">${r.titulo}</span>
        <span class="listitem__s">${r.codigo} · ${r.semanas} semanas${post ? ' · ' + post + ' ' + U.plural(post, 'postulante') : ''}</span>
      </span>
      <span class="listitem__end">${C.chipReto(r)}</span>
    </a></li>`;
  }

  /* ================= Catálogo de retos ================= */
  Vistas.retos = function (p, q) {
    var u = Auth.actual();
    var rol = u ? u.rol : null;
    if (rol === 'empresa') return retosEmpresa(u, q);
    if (rol === 'coordinador') return retosCoordinacion(q);
    return retosCatalogo(u, q);
  };

  function filtros(q, opciones) {
    return h`<form class="searchbar" data-action="filtro:retos">
      <input class="input" type="search" name="q" value="${q.q || ''}" placeholder="Buscar por palabra clave…" aria-label="Buscar retos">
      <select class="select" name="cat" aria-label="Área">
        <option value="">Todas las áreas</option>
        ${Object.keys(CFG.CATEGORIAS).map(function (k) {
          return raw('<option value="' + k + '"' + (q.cat === k ? ' selected' : '') + '>' + U.esc(CFG.CATEGORIAS[k].label) + '</option>');
        })}
      </select>
      <select class="select" name="dur" aria-label="Duración">
        <option value="">Cualquier duración</option>
        ${[2, 3, 4].map(function (n) {
          return raw('<option value="' + n + '"' + (String(q.dur) === String(n) ? ' selected' : '') + '>' + n + ' semanas</option>');
        })}
      </select>
      ${opciones || ''}
      <button class="btn btn--ghost" type="submit">${C.icono('lupa', 16)} Filtrar</button>
    </form>`;
  }

  function aplicaFiltro(r, q) {
    if (q.q && !(U.contiene(r.titulo, q.q) || U.contiene(r.problema, q.q) || U.contiene(M.empresaNombre(r.empresaId), q.q))) return false;
    if (q.cat && r.categoria !== q.cat) return false;
    if (q.dur && String(r.semanas) !== String(q.dur)) return false;
    return true;
  }

  function retosCatalogo(u, q) {
    var esEstudiante = u && u.rol === 'estudiante';
    var lista = Store.where('retos', function (r) {
      return ['publicado'].indexOf(r.estado) !== -1 && aplicaFiltro(r, q);
    });
    var conMatch = esEstudiante
      ? U.sortBy(lista.map(function (r) { return { reto: r, match: Matching.evaluar(u, r) }; }), function (x) { return x.match.total; }, true)
      : lista.map(function (r) { return { reto: r, match: null }; });

    return h`
      ${C.pageHead(esEstudiante ? 'Oportunidades para ti' : 'Retos abiertos',
        esEstudiante ? 'Ordenados por tu compatibilidad. El porcentaje considera tus habilidades, tu disponibilidad y tu carrera.'
                     : lista.length + ' ' + U.plural(lista.length, 'reto') + ' de empresas esperando equipo.')}
      ${esEstudiante && M.tieneProyectoActivo(u.id)
        ? C.aviso('info', 'ℹ️', 'Ya tienes un microproyecto en curso. Podrás postular a otro reto cuando lo cierres.') : ''}
      ${filtros(q)}
      ${conMatch.length
        ? h`<div class="grid grid--auto">${conMatch.map(function (x) { return C.cardReto(x.reto, { match: x.match }); })}</div>`
        : C.vacio('🔍', 'No hay retos con esos filtros', 'Prueba quitando algún filtro o busca otra palabra.',
            h`<a class="btn btn--ghost" href="#/retos">Ver todos</a>`)}`;
  }

  function retosEmpresa(u, q) {
    var mios = Store.where('retos', function (r) { return r.empresaId === u.id && aplicaFiltro(r, q); });
    var grupos = U.groupBy(mios, 'estado');
    var orden = ['borrador', 'observado', 'en_revision', 'publicado', 'en_seleccion', 'en_ejecucion', 'finalizado', 'rechazado', 'cancelado'];
    return h`
      ${C.pageHead('Mis retos', mios.length + ' ' + U.plural(mios.length, 'reto') + ' en total',
        h`<a class="btn btn--primary" href="#/reto/nuevo">${C.icono('mas', 18)} Publicar un reto</a>`)}
      ${filtros(q)}
      ${mios.length ? orden.filter(function (e) { return grupos[e]; }).map(function (e) {
        return h`<h2 style="font-size:1rem;margin-top:1.2rem">${CFG.RETO_ESTADOS[e].label} <span class="chip">${grupos[e].length}</span></h2>
          <div class="panel"><ul class="list">${grupos[e].map(filaReto)}</ul></div>`;
      }) : C.vacio('📋', 'Sin retos', 'Publica tu primera necesidad y la UPN te propondrá un equipo.',
        h`<a class="btn btn--primary" href="#/reto/nuevo">Publicar un reto</a>`)}`;
  }

  function retosCoordinacion(q) {
    var estado = q.estado || 'todos';
    var todos = Store.where('retos', function (r) { return aplicaFiltro(r, q); });
    var lista = estado === 'todos' ? todos : todos.filter(function (r) { return r.estado === estado; });
    var cuenta = function (e) { return Store.where('retos', function (r) { return r.estado === e; }).length; };
    var tabs = [
      { k: 'todos', l: 'Todos', n: todos.length },
      { k: 'en_revision', l: 'Por revisar', n: cuenta('en_revision') },
      { k: 'publicado', l: 'Publicados', n: cuenta('publicado') },
      { k: 'en_seleccion', l: 'En selección', n: cuenta('en_seleccion') },
      { k: 'en_ejecucion', l: 'En ejecución', n: cuenta('en_ejecucion') },
      { k: 'finalizado', l: 'Finalizados', n: cuenta('finalizado') }
    ];
    return h`
      ${C.pageHead('Retos del programa', 'Revisa, publica y da seguimiento a todos los retos.',
        h`<a class="btn btn--primary" href="#/reto/nuevo">${C.icono('mas', 18)} Nuevo reto</a>`)}
      <div class="tabs">${tabs.map(function (t) {
        return h`<a class="tab ${estado === t.k ? 'is-on' : ''}" href="#/retos?estado=${t.k}">${t.l} ${t.n ? raw('<span class="chip tiny">' + t.n + '</span>') : ''}</a>`;
      })}</div>
      ${filtros(q, raw('<input type="hidden" name="estado" value="' + U.esc(estado) + '">'))}
      ${lista.length ? h`<div class="panel"><ul class="list">${U.sortBy(lista, function (r) { return r.creado; }, true).map(function (r) {
        var post = M.postulacionesDe(r.id).length;
        return h`<li><a class="listitem" href="#/reto/${r.id}">
          ${C.avatar(M.usuario(r.empresaId))}
          <span class="listitem__main">
            <span class="listitem__t">${r.titulo}</span>
            <span class="listitem__s">${M.empresaNombre(r.empresaId)} · ${r.codigo} · ${r.semanas} sem${post ? ' · ' + post + ' postulantes' : ''}</span>
          </span>
          <span class="listitem__end">${C.chipReto(r)}</span>
        </a></li>`;
      })}</ul></div>` : C.vacio('📭', 'Nada por aquí', 'No hay retos en este estado.')}`;
  }

  /* ================= Detalle del reto ================= */
  Vistas.retoDetalle = function (p) {
    var r = M.reto(p.id);
    if (!r) return Vistas.noEncontrado('#/reto/' + p.id);
    var u = Auth.actual();
    var emp = M.usuario(r.empresaId);
    var proy = M.proyectoDeReto(r.id);
    var esDuena = u && u.rol === 'empresa' && r.empresaId === u.id;
    var esCoord = u && u.rol === 'coordinador';
    var esEst = u && u.rol === 'estudiante';
    var miPost = esEst ? M.postulacionDe(r.id, u.id) : null;
    var match = esEst ? Matching.evaluar(u, r) : null;

    /* Los retos no publicados solo los ven su empresa y la coordinación */
    if (['publicado', 'en_seleccion', 'en_ejecucion', 'finalizado'].indexOf(r.estado) === -1 && !esDuena && !esCoord) {
      return Vistas.sinPermiso(['empresa', 'coordinador']);
    }

    return h`
      ${C.volver(u && u.rol === 'empresa' ? '#/retos' : '#/retos', 'Volver a retos')}
      <div class="split split--wide mt-sm">
        <div class="stack">
          <div class="card">
            <div class="card__head">
              ${C.avatar(emp, 'avatar--lg')}
              <div class="hcol">
                <p class="tiny muted mb0">${r.codigo}</p>
                <h1 style="font-size:1.4rem;margin:.1rem 0">${r.titulo}</h1>
                <p class="small muted mb0">
                  <a href="#/perfil/${emp.id}">${emp.razonSocial || emp.nombre}</a> · ${emp.distrito} · ${emp.sector || ''}
                </p>
              </div>
            </div>
            <div class="chips">
              ${C.chipReto(r)} ${C.chipCategoria(r.categoria)}
              <span class="chip">${C.icono('reloj', 13)} ${r.semanas} semanas</span>
              <span class="chip">${r.horasSemana} h/semana</span>
              <span class="chip">${r.tamanoEquipo} ${U.plural(r.tamanoEquipo, 'vacante')}</span>
              <span class="chip">${CFG.MODALIDADES[r.modalidad]}</span>
            </div>
          </div>

          <div class="card">
            <h2 style="font-size:1.05rem">La necesidad</h2>
            <p style="white-space:pre-wrap">${r.problema}</p>
            <h2 style="font-size:1.05rem" class="mt">Qué espera recibir la empresa</h2>
            <p style="white-space:pre-wrap">${r.resultado}</p>
            ${(r.entregables || []).length ? h`
              <h2 style="font-size:1.05rem" class="mt">Entregables comprometidos</h2>
              <ul>${r.entregables.map(function (e) { return h`<li>${e}</li>`; })}</ul>` : ''}
          </div>

          <div class="card">
            <h2 style="font-size:1.05rem">Habilidades</h2>
            <p class="small muted">Las marcadas en oscuro son indispensables.</p>
            ${C.chipsHabilidades(r.habilidadesRequeridas)}
            ${(r.habilidadesDeseables || []).length ? h`
              <p class="small muted mt-sm mb0">Suman puntos, pero no son obligatorias:</p>
              ${C.chipsHabilidades(r.habilidadesDeseables)}` : ''}
          </div>

          ${(esDuena || esCoord) ? panelPostulantes(r, esCoord) : ''}
          ${(esDuena || esCoord) ? historialReto(r) : ''}
        </div>

        <div class="stack">
          ${esEst ? panelEstudiante(r, u, miPost, match) : ''}
          ${accionesReto(r, u, esDuena, esCoord, proy)}
          ${proy ? h`<div class="card">
            <h3>Proyecto en marcha</h3>
            <p class="small muted">${proy.codigo} · ${CFG.PROYECTO_ESTADOS[proy.estado].label}</p>
            ${C.medidor(M.progreso(proy), proy.estado === 'cerrado')}
            <a class="btn btn--primary btn--block mt-sm" href="#/proyecto/${proy.id}">Ver tablero del proyecto</a>
          </div>` : ''}
          <div class="card">
            <h3>Datos del reto</h3>
            <ul class="list small">
              <li style="padding:.4rem 0"><b>Duración:</b> ${r.semanas} semanas</li>
              <li style="padding:.4rem 0"><b>Dedicación:</b> ${r.horasSemana} h por semana</li>
              <li style="padding:.4rem 0"><b>Equipo:</b> ${r.tamanoEquipo} ${U.plural(r.tamanoEquipo, 'estudiante')}</li>
              <li style="padding:.4rem 0"><b>Modalidad:</b> ${CFG.MODALIDADES[r.modalidad]}</li>
              <li style="padding:.4rem 0"><b>Postulaciones hasta:</b> ${U.fecha(r.fechaLimitePostulacion)}</li>
              <li style="padding:.4rem 0"><b>Publicado:</b> ${r.publicado ? U.haceTiempo(r.publicado) : '—'}</li>
            </ul>
          </div>
        </div>
      </div>`;
  };

  function panelEstudiante(r, u, miPost, match) {
    if (miPost) {
      var etiquetas = { postulada: ['info', '📨', 'Tu postulación fue enviada. La coordinación la revisará.'],
        preseleccionada: ['warn', '⭐', 'Estás preseleccionado para este reto.'],
        seleccionada: ['ok', '🎉', '¡Fuiste seleccionado para este reto!'],
        no_seleccionada: ['danger', '💬', 'Esta vez no fuiste seleccionado. Sigue postulando a otros retos.'] };
      var e = etiquetas[miPost.estado] || etiquetas.postulada;
      return h`<div class="card">
        <h3>Tu postulación</h3>
        ${C.aviso(e[0], e[1], e[2])}
        <p class="small muted mt-sm">Enviada ${U.haceTiempo(miPost.creado)} · compatibilidad ${miPost.score}%</p>
        <blockquote class="small" style="border-left:3px solid var(--border);padding-left:.8rem;margin:.5rem 0;color:var(--text-soft)">${miPost.motivacion}</blockquote>
        ${miPost.estado === 'postulada' ? h`<button class="btn btn--ghost btn--sm btn--block"
          data-action="postulacion:retirar" data-id="${miPost.id}" data-confirm="¿Retirar tu postulación a este reto?">Retirar postulación</button>` : ''}
      </div>`;
    }

    var puede = r.estado === 'publicado' && !M.tieneProyectoActivo(u.id) && !match.descartado;
    return h`<div class="card card--accent">
      <h3>Tu compatibilidad</h3>
      <div class="row" style="gap:.75rem;margin-bottom:.5rem">
        ${C.anilloMatch(match, true)}
      </div>
      ${match.descartado ? C.aviso('warn', '⚠️', match.motivo) : ''}
      ${C.desgloseMatch(match)}
      <div class="mt-sm">
        ${puede
          ? h`<button class="btn btn--primary btn--block" data-action="postulacion:abrir" data-id="${r.id}">Postular a este reto</button>`
          : h`<button class="btn btn--block" disabled>${
              r.estado !== 'publicado' ? 'Este reto ya no recibe postulaciones'
              : (M.tieneProyectoActivo(u.id) ? 'Ya tienes un proyecto en curso' : 'No cumples los requisitos indispensables')
            }</button>`}
      </div>
    </div>`;
  }

  function accionesReto(r, u, esDuena, esCoord, proy) {
    if (!u || (!esDuena && !esCoord)) return '';
    var acciones = [];

    if (Auth.can('reto:editar', r)) acciones.push(h`<a class="btn btn--ghost btn--block" href="#/reto/${r.id}/editar">Editar reto</a>`);
    if (Auth.can('reto:enviar', r)) acciones.push(h`<button class="btn btn--primary btn--block" data-action="reto:transicion" data-id="${r.id}" data-destino="en_revision">Enviar a revisión de la UPN</button>`);
    if (esCoord && r.estado === 'en_revision') {
      acciones.push(h`<button class="btn btn--primary btn--block" data-action="reto:transicion" data-id="${r.id}" data-destino="publicado" data-confirm="¿Publicar este reto para que los estudiantes postulen?">Aprobar y publicar</button>`);
      acciones.push(h`<button class="btn btn--ghost btn--block" data-action="reto:observar" data-id="${r.id}">Devolver con observaciones</button>`);
      acciones.push(h`<button class="btn btn--ghost btn--block" data-action="reto:rechazar" data-id="${r.id}">Rechazar</button>`);
    }
    if (esCoord && r.estado === 'publicado') {
      acciones.push(h`<button class="btn btn--primary btn--block" data-action="reto:transicion" data-id="${r.id}" data-destino="en_seleccion" data-confirm="¿Cerrar postulaciones y pasar a selección de equipo?">Cerrar postulaciones</button>`);
    }
    if (esCoord && r.estado === 'en_seleccion') {
      acciones.push(h`<a class="btn btn--primary btn--block" href="#/matching/${r.id}">Conformar equipo</a>`);
    }
    if (!acciones.length) return '';

    return h`<div class="card">
      <h3>Acciones</h3>
      ${r.notasRevision && ['observado', 'rechazado'].indexOf(r.estado) !== -1
        ? C.aviso('warn', '📝', raw('<b>Observación de la coordinación:</b> ' + U.esc(r.notasRevision))) : ''}
      <div class="stack" style="gap:.5rem">${acciones}</div>
    </div>`;
  }

  function panelPostulantes(r, esCoord) {
    var lista = Matching.rankearPostulantes(r.id);
    if (!lista.length) {
      return h`<div class="card"><h2 style="font-size:1.05rem">Postulantes</h2>
        ${C.vacio('👥', 'Todavía nadie ha postulado', r.estado === 'publicado'
          ? 'El reto está publicado. Los estudiantes con habilidades afines lo verán en sus oportunidades.'
          : 'Este reto no recibió postulaciones.')}</div>`;
    }
    return h`<div class="panel">
      <div class="panel__head">
        <h3>Postulantes (${lista.length})</h3>
        ${esCoord && r.estado === 'en_seleccion' ? h`<a class="btn btn--primary btn--sm" href="#/matching/${r.id}">Conformar equipo</a>` : ''}
      </div>
      <ul class="list">
        ${lista.map(function (x) {
          return h`<li><div class="listitem">
            ${C.avatar(x.estudiante)}
            <span class="listitem__main">
              <span class="listitem__t"><a href="#/perfil/${x.estudiante.id}">${x.estudiante.nombre}</a></span>
              <span class="listitem__s">${x.estudiante.carrera} · Ciclo ${x.estudiante.ciclo} · ${x.estudiante.horasSemana} h/sem</span>
              <span class="tiny muted">${U.truncar(x.postulacion.motivacion, 110)}</span>
            </span>
            <span class="listitem__end">
              ${C.anilloMatch(x.match)}
              ${x.postulacion.estado !== 'postulada' ? h`<span class="chip ${x.postulacion.estado === 'seleccionada' ? 'chip--ok' : ''}">${
                { seleccionada: 'Seleccionado', no_seleccionada: 'No seleccionado', preseleccionada: 'Preseleccionado' }[x.postulacion.estado]
              }</span>` : ''}
            </span>
          </div></li>`;
        })}
      </ul>
    </div>`;
  }

  function historialReto(r) {
    return h`<div class="card">
      <h2 style="font-size:1.05rem">Historial</h2>
      <ul class="timeline">
        ${U.sortBy(r.historial || [], function (x) { return x.at; }, true).map(function (x, i) {
          return h`<li>
            <span class="timeline__dot ${i === 0 ? 'timeline__dot--now' : ''}"></span>
            <p class="timeline__t">${(CFG.RETO_ESTADOS[x.estado] || {}).label || x.estado}</p>
            <p class="timeline__m">${U.haceTiempo(x.at)}${x.por ? ' · ' + M.nombre(x.por) : ''}</p>
            ${x.nota ? h`<p class="small muted">${x.nota}</p>` : ''}
          </li>`;
        })}
      </ul>
    </div>`;
  }

  /* ================= Formulario de reto ================= */
  Vistas.retoForm = function (p) {
    var u = Auth.actual();
    var r = p.id ? M.reto(p.id) : null;
    if (p.id && !r) return Vistas.noEncontrado('#/reto/' + p.id + '/editar');
    if (r && !Auth.can('reto:editar', r)) return Vistas.sinPermiso(['empresa', 'coordinador']);

    var esNuevo = !r;
    var v = r || { semanas: 3, horasSemana: 10, tamanoEquipo: 2, modalidad: 'hibrido', categoria: '', entregables: [], habilidadesRequeridas: [], habilidadesDeseables: [] };
    var reqIds = (v.habilidadesRequeridas || []).map(function (x) { return x.skill; });

    return h`<div style="max-width:800px;margin:0 auto">
      ${C.volver(esNuevo ? '#/retos' : '#/reto/' + r.id)}
      ${C.pageHead(esNuevo ? 'Publicar un reto' : 'Editar reto',
        'Descríbelo en lenguaje simple. La coordinación de la UPN lo revisará antes de publicarlo.')}
      <div class="stepper">
        <span class="stepper__s stepper__s--on"><b>1</b> Tu necesidad</span>
        <span class="stepper__s"><b>2</b> Habilidades</span>
        <span class="stepper__s"><b>3</b> Duración</span>
      </div>
      <form data-action="reto:guardar" class="stack">
        <input type="hidden" name="id" value="${r ? r.id : ''}">
        ${u.rol === 'coordinador' ? h`<div class="card">${C.campo({ name: 'empresaId', label: 'Empresa que plantea el reto', tipo: 'select', required: true,
          opciones: M.empresas().map(function (e) { return { value: e.id, label: e.razonSocial || e.nombre }; }), valor: v.empresaId })}</div>` : ''}

        <div class="card">
          <h2 style="font-size:1.05rem">1. Tu necesidad</h2>
          ${C.campo({ name: 'titulo', label: 'Título del reto', required: true, maxlength: 90, valor: v.titulo,
            placeholder: 'Ej.: Reactivar las redes sociales de mi panadería', ayuda: 'Una frase que resuma qué necesitas.' })}
          ${C.campo({ name: 'categoria', label: 'Área principal', tipo: 'select', required: true, vacio: 'Elige un área…', valor: v.categoria,
            opciones: Object.keys(CFG.CATEGORIAS).map(function (k) { return { value: k, label: CFG.CATEGORIAS[k].icono + ' ' + CFG.CATEGORIAS[k].label }; }) })}
          ${C.campo({ name: 'problema', label: '¿Qué problema tienes hoy?', tipo: 'textarea', rows: 5, required: true, valor: v.problema,
            placeholder: 'Cuenta la situación tal como es: qué pasa, desde cuándo y cómo te afecta.',
            ayuda: 'Sin tecnicismos. Mientras más concreto, mejor será el equipo que te asignen.' })}
          ${C.campo({ name: 'resultado', label: '¿Qué te gustaría tener al final?', tipo: 'textarea', rows: 3, required: true, valor: v.resultado,
            placeholder: 'Ej.: redes activas, con fotos propias y un flujo de pedidos por WhatsApp.' })}
          ${C.campo({ name: 'entregables', label: 'Entregables concretos (uno por línea)', tipo: 'textarea', rows: 4,
            valor: (v.entregables || []).join('\n'),
            placeholder: 'Plan de contenido para 4 semanas\nBanco de 30 fotos\nGuía para el personal' })}
        </div>

        <div class="card">
          <h2 style="font-size:1.05rem">2. Habilidades que necesita el equipo</h2>
          <p class="small muted">Marca las que hagan falta. Las <b>indispensables</b> filtran a quién puede postular.</p>
          <div class="field">
            <span class="field__label">Habilidades requeridas</span>
            ${C.checkHabilidades('req', reqIds)}
          </div>
          <div class="field">
            <span class="field__label">Indispensables (deben cumplirse sí o sí)</span>
            <p class="field__hint" style="margin-top:0">Solo marca aquí las que ya elegiste arriba y sin las cuales el reto no se puede hacer.</p>
            ${C.checkHabilidades('criticas', (v.habilidadesRequeridas || []).filter(function (x) { return x.peso === 3; }).map(function (x) { return x.skill; }))}
          </div>
          <div class="field">
            <span class="field__label">Deseables (suman, pero no son obligatorias)</span>
            ${C.checkHabilidades('des', v.habilidadesDeseables || [])}
          </div>
        </div>

        <div class="card">
          <h2 style="font-size:1.05rem">3. Duración y equipo</h2>
          <div class="field-row field-row--3">
            ${C.campo({ name: 'semanas', label: 'Duración', tipo: 'select', valor: v.semanas,
              opciones: [{ value: 2, label: '2 semanas' }, { value: 3, label: '3 semanas' }, { value: 4, label: '4 semanas' }] })}
            ${C.campo({ name: 'horasSemana', label: 'Horas por semana', tipo: 'number', min: 4, max: 20, valor: v.horasSemana })}
            ${C.campo({ name: 'tamanoEquipo', label: 'Estudiantes', tipo: 'number', min: 1, max: 4, valor: v.tamanoEquipo })}
          </div>
          <div class="field-row field-row--2">
            ${C.campo({ name: 'modalidad', label: 'Modalidad', tipo: 'select', valor: v.modalidad,
              opciones: Object.keys(CFG.MODALIDADES).map(function (k) { return { value: k, label: CFG.MODALIDADES[k] }; }) })}
            ${C.campo({ name: 'fechaLimitePostulacion', label: 'Postulaciones hasta', tipo: 'date',
              valor: v.fechaLimitePostulacion || U.sumarDias(U.hoy(), 14) })}
          </div>
        </div>

        <div class="btnrow">
          <button class="btn btn--primary btn--lg" type="submit" name="accion" value="guardar">Guardar borrador</button>
          <button class="btn btn--dark btn--lg" type="submit" name="accion" value="enviar">Guardar y enviar a revisión</button>
        </div>
      </form>
    </div>`;
  };
})();
