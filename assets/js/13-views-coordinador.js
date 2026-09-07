/* 13-views-coordinador.js — Panel de coordinación, conformación de equipos, talento y reportes */
window.Vistas = window.Vistas || {};
(function () {
  var h = U.html, raw = U.raw;

  /* ================= Panel ================= */
  Vistas.panelCoordinador = function (u) {
    var mt = M.metricas();
    var porRevisar = Store.where('retos', function (r) { return r.estado === 'en_revision'; });
    var porSeleccionar = Store.where('retos', function (r) { return r.estado === 'en_seleccion'; });
    var porCertificar = Store.where('proyectos', function (p) { return p.estado === 'aprobado'; });
    var activos = Store.where('proyectos', function (p) { return ['en_curso', 'en_validacion'].indexOf(p.estado) !== -1; });
    var pendientes = porRevisar.length + porSeleccionar.length + porCertificar.length;

    return h`
      ${C.pageHead('Coordinación Talent Lab', u.area + ' · ' + u.campus,
        h`<a class="btn btn--ghost" href="#/reportes">${C.icono('grafico', 18)} Reportes</a>
          <a class="btn btn--primary" href="#/reto/nuevo">${C.icono('mas', 18)} Nuevo reto</a>`)}

      ${C.tarjetaAcciones(u)}

      <div class="grid grid--stats">
        ${C.stat('Empresas aliadas', mt.empresas, 'con retos publicados', true)}
        ${C.stat('Estudiantes', mt.estudiantes, 'inscritos en el programa')}
        ${C.stat('Proyectos activos', activos.length, 'en ejecución ahora')}
        ${C.stat('Constancias', mt.constancias, 'emitidas y vigentes')}
      </div>

      <div class="split mt">
        <div class="stack">
          ${bandeja('Retos esperando revisión', porRevisar, function (r) {
            return h`<li><a class="listitem" href="#/reto/${r.id}">
              ${C.avatar(M.usuario(r.empresaId))}
              <span class="listitem__main">
                <span class="listitem__t">${r.titulo}</span>
                <span class="listitem__s">${M.empresaNombre(r.empresaId)} · enviado ${U.haceTiempo(r.creado)}</span>
              </span>
              <span class="listitem__end"><span class="chip chip--warn">Revisar</span></span>
            </a></li>`;
          }, '✅', 'Nada pendiente por revisar')}

          ${bandeja('Equipos por conformar', porSeleccionar, function (r) {
            var n = M.postulacionesDe(r.id).length;
            return h`<li><a class="listitem" href="#/matching/${r.id}">
              <span class="avatar avatar--sm" aria-hidden="true">🎯</span>
              <span class="listitem__main">
                <span class="listitem__t">${r.titulo}</span>
                <span class="listitem__s">${n} ${U.plural(n, 'postulante')} · equipo de ${r.tamanoEquipo}</span>
              </span>
              <span class="listitem__end"><span class="chip chip--info">Conformar</span></span>
            </a></li>`;
          }, '👥', 'No hay retos en selección')}

          ${bandeja('Proyectos listos para constancia', porCertificar, function (p) {
            var r = M.reto(p.retoId);
            return h`<li><a class="listitem" href="#/proyecto/${p.id}?tab=evaluacion">
              <span class="avatar avatar--sm" aria-hidden="true">🏅</span>
              <span class="listitem__main">
                <span class="listitem__t">${r ? r.titulo : p.codigo}</span>
                <span class="listitem__s">${p.estudianteIds.length} ${U.plural(p.estudianteIds.length, 'estudiante')} · aprobado por mentor y empresa</span>
              </span>
              <span class="listitem__end"><span class="chip chip--ok">Emitir</span></span>
            </a></li>`;
          }, '🏅', 'Sin constancias pendientes')}

          <div>
            <div class="row row--between"><h2 style="margin:0">Proyectos en ejecución</h2><a class="tiny" href="#/proyectos">Ver todos</a></div>
            ${activos.length ? h`<div class="grid grid--2 mt-sm">${activos.map(C.cardProyecto)}</div>`
              : C.vacio('🚀', 'Sin proyectos activos', 'Cuando se conforme un equipo, el proyecto aparecerá aquí.')}
          </div>
        </div>

        <div class="stack">
          <div class="card">
            <h3>Impacto del programa</h3>
            <ul class="list small">
              <li style="padding:.45rem 0"><b>${mt.empresas}</b> empresas aliadas</li>
              <li style="padding:.45rem 0"><b>${mt.estudiantes}</b> estudiantes inscritos</li>
              <li style="padding:.45rem 0"><b>${mt.proyectosCerrados}</b> microproyectos cerrados</li>
              <li style="padding:.45rem 0"><b>${mt.horas}</b> horas de experiencia acreditadas</li>
              <li style="padding:.45rem 0"><b>${mt.constancias}</b> constancias vigentes</li>
              ${mt.satisfaccion !== null ? h`<li style="padding:.45rem 0"><b>${mt.satisfaccion}/100</b> evaluación promedio</li>` : ''}
            </ul>
            <a class="btn btn--ghost btn--sm btn--block" href="#/reportes">Ver reportes completos</a>
          </div>
          <div class="card">
            <h3>Carga de mentores</h3>
            ${M.mentores().map(function (m) {
              var carga = M.cargaMentor(m.id), max = m.maxProyectos || 3;
              return h`<div style="margin-bottom:.7rem">
                <div class="row row--between"><span class="small"><b>${m.nombre}</b></span><span class="tiny muted">${carga}/${max}</span></div>
                ${C.progreso(U.pct(carga, max))}
                <span class="tiny muted">${m.especialidad}</span>
              </div>`;
            })}
          </div>
        </div>
      </div>`;
  };

  function bandeja(titulo, lista, filaFn, ico, vacioTxt) {
    return h`<div class="panel">
      <div class="panel__head"><h3>${titulo}</h3>${lista.length ? h`<span class="chip chip--brand">${lista.length}</span>` : ''}</div>
      ${lista.length ? h`<ul class="list">${lista.map(filaFn)}</ul>`
        : h`<div class="panel__body center"><p class="small muted mb0">${ico} ${vacioTxt}</p></div>`}
    </div>`;
  }

  /* ================= Conformación de equipo ================= */
  Vistas.matching = function (p, q) {
    var r = M.reto(p.id);
    if (!r) return Vistas.noEncontrado('#/matching/' + p.id);
    if (r.estado !== 'en_seleccion') {
      return h`${C.volver('#/reto/' + r.id)}
        ${C.vacio('⏳', 'Este reto no está en selección',
          'El reto está en estado “' + CFG.RETO_ESTADOS[r.estado].label + '”. Cierra las postulaciones para conformar el equipo.',
          h`<a class="btn btn--primary" href="#/reto/${r.id}">Ir al reto</a>`)}`;
    }

    var sugerido = Matching.sugerirEquipo(r.id);
    var seleccion = q.sel ? q.sel.split(',').filter(Boolean) : sugerido.ids;
    var mentores = Matching.sugerirMentores(r.id);
    var mentorSel = q.mentor || (mentores[0] && mentores[0].disponible ? mentores[0].mentor.id : '');
    var cob = Matching.cobertura(r.id, seleccion);
    var ranking = Matching.rankearPostulantes(r.id);

    return h`
      ${C.volver('#/reto/' + r.id, 'Volver al reto')}
      ${C.pageHead('Conformar equipo', r.titulo + ' · ' + M.empresaNombre(r.empresaId))}

      <div class="split split--wide">
        <div class="stack">
          <div class="panel">
            <div class="panel__head">
              <h3>Postulantes ordenados por compatibilidad (${ranking.length})</h3>
              <button class="btn btn--ghost btn--sm" data-action="equipo:sugerir" data-id="${r.id}">Usar equipo sugerido</button>
            </div>
            <ul class="list">
              ${ranking.map(function (x) {
                var on = seleccion.indexOf(x.estudiante.id) !== -1;
                var ocupado = M.tieneProyectoActivo(x.estudiante.id);
                return h`<li>
                  <div class="listitem" style="align-items:flex-start">
                    <input type="checkbox" class="equipo-check" style="width:20px;height:20px;margin-top:.6rem;accent-color:var(--bronce)"
                      data-action="equipo:toggle" data-reto="${r.id}" data-id="${x.estudiante.id}"
                      ${raw(on ? 'checked' : '')} ${raw(x.match.descartado || ocupado ? 'disabled' : '')}
                      aria-label="Seleccionar a ${x.estudiante.nombre}">
                    <span class="listitem__main">
                      <span class="listitem__t"><a href="#/perfil/${x.estudiante.id}">${x.estudiante.nombre}</a>
                        ${ocupado ? raw('<span class="chip chip--warn tiny">Con proyecto activo</span>') : ''}</span>
                      <span class="listitem__s">${x.estudiante.carrera} · Ciclo ${x.estudiante.ciclo} · ${x.estudiante.horasSemana} h/sem · ${CFG.MODALIDADES[x.estudiante.modalidad]}</span>
                      ${x.match.descartado ? h`<span class="tiny" style="color:var(--danger)">${x.match.motivo}</span>` : ''}
                      ${senales(x.estudiante.id, r)}
                      <details style="margin-top:.4rem">
                        <summary class="tiny" style="cursor:pointer;color:var(--bronce);font-weight:700">Ver por qué este puntaje</summary>
                        <div style="margin-top:.4rem">${C.desgloseMatch(x.match)}</div>
                        <p class="tiny muted" style="margin-top:.5rem"><b>Motivación:</b> ${x.postulacion.motivacion}</p>
                      </details>
                    </span>
                    <span class="listitem__end">${C.anilloMatch(x.match)}</span>
                  </div>
                </li>`;
              })}
            </ul>
          </div>
        </div>

        <div class="stack">
          <form class="card" data-action="equipo:conformar">
            <input type="hidden" name="retoId" value="${r.id}">
            <input type="hidden" name="estudianteIds" value="${seleccion.join(',')}">
            <h3>Equipo seleccionado</h3>
            ${seleccion.length ? h`<ul class="list">
              ${seleccion.map(function (id, i) {
                var e = M.usuario(id);
                return h`<li style="padding:.4rem 0"><div class="row row--between">
                  ${C.persona(e, i === 0 ? 'Líder de equipo' : 'Integrante')}
                  <button type="button" class="btn btn--ghost btn--sm" data-action="equipo:toggle" data-reto="${r.id}" data-id="${id}">Quitar</button>
                </div></li>`;
              })}
            </ul>` : h`<p class="small muted">Marca a los estudiantes en la lista de la izquierda.</p>`}

            <p class="tiny muted mt-sm mb0">Cobertura de habilidades requeridas</p>
            ${C.medidor(cob.pct, cob.pct >= 80)}
            ${cob.faltantes.length ? C.aviso('warn', '⚠️', raw('Sin cubrir: <b>' +
                U.esc(cob.faltantes.map(M.habilidadNombre).join(', ')) + '</b>')) : C.aviso('ok', '✅', 'El equipo cubre todas las habilidades requeridas.')}

            <hr>
            <div class="field">
              <label for="mentorId">Docente mentor <span style="color:var(--danger)">*</span></label>
              <select class="select" id="mentorId" name="mentorId" required data-action="equipo:mentor" data-reto="${r.id}">
                <option value="">Elige un mentor…</option>
                ${mentores.map(function (m) {
                  return raw('<option value="' + U.esc(m.mentor.id) + '"' + (mentorSel === m.mentor.id ? ' selected' : '') +
                    (m.disponible ? '' : ' disabled') + '>' + U.esc(m.mentor.nombre) +
                    ' — ' + m.score + '% afinidad · ' + m.carga + '/' + m.max + ' proyectos' + (m.disponible ? '' : ' (sin cupo)') + '</option>');
                })}
              </select>
              ${mentorSel && mentores.filter(function (m) { return m.mentor.id === mentorSel; })[0]
                ? h`<p class="field__hint">Coincide en: ${(mentores.filter(function (m) { return m.mentor.id === mentorSel; })[0].coincidencias.join(', ')) || 'ninguna habilidad específica'}</p>` : ''}
            </div>
            ${C.campo({ name: 'inicio', label: 'Fecha de inicio', tipo: 'date', valor: U.sumarDias(U.hoy(), 3), required: true })}
            <p class="tiny muted">Se generarán ${r.semanas} hitos semanales automáticamente y se notificará a todos los involucrados.</p>
            <button class="btn btn--primary btn--block btn--lg" type="submit"
              ${raw(seleccion.length ? '' : 'disabled')}>Conformar equipo e iniciar proyecto</button>
          </form>

          <div class="card">
            <h3>Habilidades que pide el reto</h3>
            ${(r.habilidadesRequeridas || []).map(function (hab) {
              var cubierta = cob.cubiertas.indexOf(hab.skill) !== -1;
              return h`<div class="row row--between" style="padding:.3rem 0;border-bottom:1px solid var(--border)">
                <span class="small">${M.habilidadNombre(hab.skill)} ${hab.peso === 3 ? raw('<span class="chip chip--dark tiny">Indispensable</span>') : ''}</span>
                <span class="chip ${cubierta ? 'chip--ok' : 'chip--danger'}">${cubierta ? '✓' : '✗'}</span>
              </div>`;
            })}
          </div>
        </div>
      </div>`;
  };


  /* Contexto sobre lo que declaró un candidato, frente a este reto en concreto.
     No acusa: una subida de nivel puede ser exageración o un curso recién
     terminado. Quien decide es la coordinación, y decide con el dato a la vista. */
  function senales(estudianteId, reto) {
    var se = M.senalesDe(estudianteId, reto);
    if (!se.sinRespaldo.length && !se.subidasRecientes.length && !se.pruebas.length) return h``;
    return h`<span class="senales">
      ${se.subidasRecientes.map(function (c) {
        return h`<span class="senal senal--ojo">subió ${M.habilidadNombre(c.skill)} de
          ${M.nivelLabel(c.de)} a ${M.nivelLabel(c.a)} ${U.haceTiempo(c.at)}, ya publicado este reto</span>`;
      })}
      ${se.sinRespaldo.map(function (x) {
        return h`<span class="senal">${M.habilidadNombre(x.skill)} ${M.nivelLabel(x.nivel)} sin respaldo</span>`;
      })}
      ${se.pruebas.map(function (pr) {
        var txt = { solicitada: 'prueba práctica pendiente', entregada: 'prueba entregada, por revisar',
                    aprobada: 'prueba aprobada', observada: 'prueba con observaciones' }[pr.estado];
        return h`<span class="senal ${pr.estado === 'aprobada' ? 'senal--ok' : ''}">${M.habilidadNombre(pr.skill)}: ${txt}</span>`;
      })}
    </span>`;
  }

  /* ================= Directorio de talento ================= */
  Vistas.talento = function (p, q) {
    var lista = M.estudiantes().filter(function (e) {
      if (q.q && !(U.contiene(e.nombre, q.q) || U.contiene(e.carrera, q.q) ||
        (e.habilidades || []).some(function (s) { return U.contiene(M.habilidadNombre(s.skill), q.q); }))) return false;
      if (q.hab && !(e.habilidades || []).some(function (s) { return s.skill === q.hab; })) return false;
      if (q.campus && e.campus !== q.campus) return false;
      return true;
    });

    return h`
      ${C.pageHead('Talento UPN', lista.length + ' ' + U.plural(lista.length, 'estudiante') + ' con habilidades declaradas')}
      <form class="searchbar" data-action="filtro:talento">
        <input class="input" type="search" name="q" value="${q.q || ''}" placeholder="Buscar por nombre, carrera o habilidad…" aria-label="Buscar estudiantes">
        <select class="select" name="hab" aria-label="Habilidad">
          <option value="">Cualquier habilidad</option>
          ${Object.keys(CFG.HABILIDADES).map(function (k) {
            return raw('<option value="' + k + '"' + (q.hab === k ? ' selected' : '') + '>' + U.esc(CFG.HABILIDADES[k].nombre) + '</option>');
          })}
        </select>
        <select class="select" name="campus" aria-label="Campus">
          <option value="">Todos los campus</option>
          ${CFG.CAMPUS.map(function (c) {
            return raw('<option value="' + U.esc(c) + '"' + (q.campus === c ? ' selected' : '') + '>' + U.esc(c) + '</option>');
          })}
        </select>
        <button class="btn btn--ghost" type="submit">Filtrar</button>
      </form>
      ${lista.length ? h`<div class="grid grid--auto">${lista.map(function (e) {
        var certs = M.constanciasDe(e.id).filter(function (c) { return c.estado === 'vigente'; });
        var rating = M.ratingEstudiante(e.id);
        return h`<a class="card card--link" href="#/perfil/${e.id}">
          <div class="card__head">${C.avatar(e, 'avatar--lg')}
            <div class="hcol">
              <h3 class="card__title">${e.nombre}</h3>
              <p class="tiny muted mb0">${e.carrera} · Ciclo ${e.ciclo}</p>
              <p class="tiny muted mb0">${e.campus}</p>
            </div>
            ${M.tieneProyectoActivo(e.id) ? h`<span class="chip chip--warn">Ocupado</span>` : h`<span class="chip chip--ok">Disponible</span>`}
          </div>
          <div class="chips">${(e.habilidades || []).slice(0, 4).map(function (s) {
            return h`<span class="chip">${M.habilidadNombre(s.skill)}</span>`; })}</div>
          <div class="card__foot">
            <span class="tiny muted">${e.horasSemana} h/sem · ${CFG.MODALIDADES[e.modalidad]}</span>
            <span class="tiny muted">${certs.length ? certs.length + ' ' + U.plural(certs.length, 'constancia') : 'Sin experiencia aún'}${rating ? ' · ' + rating + '/100' : ''}</span>
          </div>
        </a>`;
      })}</div>` : C.vacio('🔍', 'Sin resultados', 'Prueba con otra habilidad o quita los filtros.')}`;
  };

  /* ================= Reportes ================= */
  Vistas.reportes = function () {
    var mt = M.metricas();
    var retos = Store.all('retos');
    var porCategoria = U.groupBy(retos, 'categoria');
    var porEstado = U.groupBy(retos, 'estado');
    var proyectos = Store.all('proyectos');
    var maxCat = Math.max.apply(null, Object.keys(porCategoria).map(function (k) { return porCategoria[k].length; }).concat([1]));

    return h`
      ${C.pageHead('Reportes del programa', 'Indicadores de gestión de UPN Talent Lab')}
      <div class="grid grid--stats">
        ${C.stat('Retos recibidos', mt.retosTotales, 'desde el inicio', true)}
        ${C.stat('Microproyectos', proyectos.length, mt.proyectosCerrados + ' cerrados')}
        ${C.stat('Horas acreditadas', mt.horas, 'de experiencia estudiantil')}
        ${C.stat('Evaluación promedio', mt.satisfaccion !== null ? mt.satisfaccion + '/100' : '—', 'mentor y empresa')}
      </div>

      <div class="split mt">
        <div class="panel">
          <div class="panel__head"><h3>Retos por área</h3></div>
          <div class="panel__body">
            ${Object.keys(porCategoria).map(function (k) {
              var n = porCategoria[k].length;
              return h`<div style="margin-bottom:.75rem">
                <div class="row row--between"><span class="small">${M.categoria(k).icono} ${M.categoria(k).label}</span><b class="small">${n}</b></div>
                ${C.progreso(U.pct(n, maxCat))}
              </div>`;
            })}
          </div>
        </div>
        <div class="panel">
          <div class="panel__head"><h3>Retos por estado</h3></div>
          <div class="panel__body">
            <ul class="list small">
              ${Object.keys(porEstado).map(function (k) {
                return h`<li style="padding:.45rem 0"><div class="row row--between">
                  ${C.chipReto({ estado: k })}<b>${porEstado[k].length}</b></div></li>`;
              })}
            </ul>
          </div>
        </div>
      </div>

      <div class="panel mt">
        <div class="panel__head"><h3>Detalle de microproyectos</h3></div>
        <div class="table-wrap">
          <table class="tbl">
            <thead><tr><th>Código</th><th>Reto</th><th>Empresa</th><th>Equipo</th><th>Mentor</th><th>Avance</th><th>Estado</th></tr></thead>
            <tbody>
              ${proyectos.map(function (p) {
                var r = M.reto(p.retoId);
                return h`<tr>
                  <td><a href="#/proyecto/${p.id}">${p.codigo}</a></td>
                  <td>${U.truncar(r ? r.titulo : '—', 42)}</td>
                  <td>${U.truncar(M.empresaNombre(p.empresaId), 26)}</td>
                  <td>${p.estudianteIds.length}</td>
                  <td>${U.truncar(M.nombre(p.mentorId), 22)}</td>
                  <td style="min-width:110px">${C.medidor(M.progreso(p), p.estado === 'cerrado')}</td>
                  <td>${C.chipProyecto(p)}</td>
                </tr>`;
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel mt">
        <div class="panel__head"><h3>Empresas participantes</h3></div>
        <div class="table-wrap">
          <table class="tbl">
            <thead><tr><th>Empresa</th><th>Rubro</th><th>Ciudad</th><th>Retos</th><th>Proyectos</th></tr></thead>
            <tbody>
              ${M.empresas().map(function (e) {
                var rs = Store.where('retos', function (r) { return r.empresaId === e.id; });
                var ps = Store.where('proyectos', function (p) { return p.empresaId === e.id; });
                return h`<tr>
                  <td><a href="#/perfil/${e.id}">${e.razonSocial || e.nombre}</a></td>
                  <td>${e.sector || '—'}</td><td>${e.distrito || '—'}</td>
                  <td>${rs.length}</td><td>${ps.length}</td>
                </tr>`;
              })}
            </tbody>
          </table>
        </div>
      </div>`;
  };

  /* ================= Bandeja de pruebas prácticas ================= */
  Vistas.pruebas = function () {
    var todas = U.sortBy(Store.all('pruebas'), function (pr) { return pr.solicitadaAt; }, true);
    var porRevisar = todas.filter(function (pr) { return pr.estado === 'entregada'; });
    var esperando = todas.filter(function (pr) { return pr.estado === 'solicitada'; });
    var cerradas = todas.filter(function (pr) { return ['aprobada', 'observada'].indexOf(pr.estado) !== -1; });

    function tarjeta(pr, conFormulario) {
      var est = M.usuario(pr.estudianteId);
      var r = M.reto(pr.retoId);
      return h`<div class="card">
        <div class="card__head">
          ${C.avatar(est)}
          <div class="hcol">
            <h3 class="card__title">${M.habilidadNombre(pr.skill)} · ${M.nivelLabel(pr.nivelPretendido)}</h3>
            <p class="tiny muted mb0"><a href="#/perfil/${pr.estudianteId}">${est ? est.nombre : ''}</a>
              ${r ? ' · para “' + U.truncar(r.titulo, 34) + '”' : ''}</p>
          </div>
          <span class="chip ${pr.estado === 'aprobada' ? 'chip--ok' : (pr.estado === 'entregada' ? 'chip--info' : 'chip--warn')}">
            ${({ solicitada: 'Sin entregar', entregada: 'Por revisar', aprobada: 'Aprobada', observada: 'Observada' })[pr.estado]}</span>
        </div>
        <p class="small muted">${pr.encargo}</p>
        ${pr.evidenciaUrl ? h`<p class="small mb0">📎
          <a href="${U.safeUrl(pr.evidenciaUrl)}" target="_blank" rel="noopener noreferrer">${U.hostOf(pr.evidenciaUrl) || 'Ver el trabajo'}</a>
          <span class="tiny muted"> · entregada ${U.haceTiempo(pr.entregadaAt)}</span></p>` : ''}
        ${pr.comentario ? h`<div class="mt-sm">${C.aviso(pr.estado === 'aprobada' ? 'ok' : 'warn', '💬', pr.comentario)}</div>` : ''}
        ${conFormulario ? h`<form class="mt-sm" data-action="prueba:revisar">
          <input type="hidden" name="pruebaId" value="${pr.id}">
          ${C.campo({ name: 'comentario', label: 'Comentario para el estudiante', tipo: 'textarea', rows: 2,
            placeholder: 'Qué resolvió bien y qué le faltó' })}
          <div class="btnrow">
            <button class="btn btn--ok btn--sm" type="submit" name="decision" value="aprobada">Aprobar y verificar la habilidad</button>
            <button class="btn btn--ghost btn--sm" type="submit" name="decision" value="observada">Devolver con observaciones</button>
          </div>
        </form>` : ''}
      </div>`;
    }

    return h`
      ${C.pageHead('Pruebas prácticas', 'Se piden solo cuando alguien declara Intermedio o Avanzado sin respaldo en una habilidad indispensable del reto al que postula.')}

      ${!todas.length ? C.vacio('📝', 'No hay pruebas pendientes',
        'Aparecen automáticamente cuando una postulación lo amerita.') : h`
        <h2 style="font-size:1rem">Por revisar ${porRevisar.length ? raw('<span class="chip chip--info">' + porRevisar.length + '</span>') : ''}</h2>
        ${porRevisar.length ? h`<div class="stack">${porRevisar.map(function (pr) { return tarjeta(pr, true); })}</div>`
          : h`<p class="small muted">Nada entregado esperando revisión.</p>`}

        ${esperando.length ? h`<h2 style="font-size:1rem" class="mt">Solicitadas, aún sin entregar</h2>
          <div class="stack">${esperando.map(function (pr) { return tarjeta(pr, false); })}</div>` : ''}

        ${cerradas.length ? h`<h2 style="font-size:1rem" class="mt">Ya revisadas</h2>
          <div class="stack">${cerradas.map(function (pr) { return tarjeta(pr, false); })}</div>` : ''}
      `}`;
  };

})();
