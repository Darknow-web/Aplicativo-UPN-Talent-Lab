/* 15-views-proyecto.js — Lista de proyectos y tablero de trabajo compartido por los 4 roles */
window.Vistas = window.Vistas || {};
(function () {
  var h = U.html, raw = U.raw;

  /* ================= Lista ================= */
  Vistas.proyectos = function (p, q) {
    var u = Auth.actual();
    var lista = u.rol === 'coordinador' ? Store.all('proyectos') : M.proyectosDe(u.id);
    var filtro = q.estado || 'todos';
    if (filtro !== 'todos') lista = lista.filter(function (x) { return x.estado === filtro; });
    lista = U.sortBy(lista, function (x) { return x.inicio; }, true);

    var titulos = { estudiante: 'Mis proyectos', empresa: 'Mis proyectos', mentor: 'Proyectos que acompaño', coordinador: 'Todos los proyectos' };
    var tabs = [{ k: 'todos', l: 'Todos' }, { k: 'en_curso', l: 'En curso' }, { k: 'en_validacion', l: 'En validación' },
                { k: 'aprobado', l: 'Aprobados' }, { k: 'cerrado', l: 'Cerrados' }];

    return h`
      ${C.pageHead(titulos[u.rol], lista.length + ' ' + U.plural(lista.length, 'microproyecto'))}
      <div class="tabs">${tabs.map(function (t) {
        return h`<a class="tab ${filtro === t.k ? 'is-on' : ''}" href="#/proyectos?estado=${t.k}">${t.l}</a>`;
      })}</div>
      ${lista.length ? h`<div class="grid grid--auto">${lista.map(C.cardProyecto)}</div>`
        : C.vacio('🚀', 'Sin proyectos en este estado', 'Cambia de pestaña o vuelve más tarde.')}`;
  };

  /* ================= Tablero ================= */
  Vistas.proyecto = function (p, q) {
    var proy = M.proyecto(p.id);
    if (!proy) return Vistas.noEncontrado('#/proyecto/' + p.id);
    if (!Auth.can('proyecto:ver', proy)) return Vistas.sinPermiso(['estudiante', 'empresa', 'mentor', 'coordinador']);

    var u = Auth.actual();
    var r = M.reto(proy.retoId);
    var tab = q.tab || 'resumen';
    var tabs = [
      { k: 'resumen', l: 'Resumen' },
      { k: 'hitos', l: 'Hitos', n: (proy.hitos || []).filter(function (x) { return x.estado === 'entregado'; }).length },
      { k: 'bitacora', l: 'Bitácora' },
      { k: 'entrega', l: 'Entrega final' },
      { k: 'evaluacion', l: 'Evaluación' },
      { k: 'equipo', l: 'Equipo' }
    ];

    var cuerpo = { resumen: tabResumen, hitos: tabHitos, bitacora: tabBitacora,
                   entrega: tabEntrega, evaluacion: tabEvaluacion, equipo: tabEquipo }[tab] || tabResumen;

    return h`
      ${C.volver('#/proyectos', 'Volver a proyectos')}
      <div class="card mt-sm">
        <div class="card__head">
          <span class="avatar avatar--lg" aria-hidden="true">${M.categoria(r.categoria).icono}</span>
          <div class="hcol">
            <p class="tiny muted mb0">${proy.codigo} · ${r.codigo}</p>
            <h1 style="font-size:1.35rem;margin:.1rem 0">${r.titulo}</h1>
            <p class="small muted mb0">${M.empresaNombre(proy.empresaId)} · ${U.fecha(proy.inicio)} a ${U.fecha(proy.fin)}</p>
          </div>
          ${C.chipProyecto(proy)}
        </div>
        ${C.medidor(M.progreso(proy), proy.estado === 'cerrado')}
        <div class="chips mt-sm">
          <span class="chip">Semana ${M.semanaActual(proy)} de ${proy.semanas}</span>
          <span class="chip">Mentor: ${M.nombre(proy.mentorId)}</span>
          <span class="chip">${proy.estudianteIds.length} ${U.plural(proy.estudianteIds.length, 'estudiante')}</span>
        </div>
      </div>

      <div class="tabs mt">${tabs.map(function (t) {
        return h`<a class="tab ${tab === t.k ? 'is-on' : ''}" href="#/proyecto/${proy.id}?tab=${t.k}">
          ${t.l}${t.n ? raw(' <span class="chip chip--warn tiny">' + t.n + '</span>') : ''}</a>`;
      })}</div>

      ${cuerpo(proy, r, u)}`;
  };

  /* ---------- Resumen ---------- */
  function tabResumen(proy, r, u) {
    var siguiente = (proy.hitos || []).filter(function (x) { return x.estado !== 'aprobado'; })[0];
    var ultimas = U.sortBy(proy.bitacora || [], function (b) { return b.at; }, true)
      .filter(function (b) { return u.rol !== 'empresa' || b.visibleEmpresa; }).slice(0, 4);

    return h`<div class="split">
      <div class="stack">
        <div class="card">
          <h2 style="font-size:1.05rem">El reto</h2>
          <p style="white-space:pre-wrap">${r.problema}</p>
          <h3 class="mt">Resultado esperado</h3>
          <p style="white-space:pre-wrap">${r.resultado}</p>
          ${(r.entregables || []).length ? h`<h3 class="mt">Entregables comprometidos</h3>
            <ul>${r.entregables.map(function (e) { return h`<li>${e}</li>`; })}</ul>` : ''}
        </div>

        <div class="panel">
          <div class="panel__head"><h3>Últimos movimientos</h3>
            <a class="tiny" href="#/proyecto/${proy.id}?tab=bitacora">Ver bitácora</a></div>
          ${ultimas.length ? h`<div class="panel__body"><ul class="bitacora">${ultimas.map(function (b) { return itemBitacora(b); })}</ul></div>`
            : h`<div class="panel__body center"><p class="small muted mb0">Aún no hay registros en la bitácora.</p></div>`}
        </div>
      </div>

      <div class="stack">
        ${siguiente ? h`<div class="card card--accent">
          <h3>Hito en curso</h3>
          <p class="small muted mb0">Semana ${siguiente.semana} · vence ${U.fecha(siguiente.fechaLimite)}</p>
          <p style="font-weight:700;margin:.3rem 0">${siguiente.titulo}</p>
          <p class="small muted">${siguiente.descripcion}</p>
          ${C.chipHito(siguiente)}
          <a class="btn btn--primary btn--block mt-sm" href="#/proyecto/${proy.id}?tab=hitos">Ir a los hitos</a>
        </div>` : h`<div class="card">${C.aviso('ok', '🎉', 'Todos los hitos fueron aprobados.')}</div>`}

        <div class="card">
          <h3>Equipo</h3>
          <ul class="list">
            ${proy.estudianteIds.map(function (id) {
              return h`<li style="padding:.5rem 0">${C.persona(M.usuario(id),
                (proy.liderId === id ? 'Líder · ' : '') + (M.usuario(id) ? M.usuario(id).carrera : ''))}</li>`;
            })}
            <li style="padding:.5rem 0">${C.persona(M.usuario(proy.mentorId), 'Docente mentor')}</li>
            <li style="padding:.5rem 0">${C.persona(M.usuario(proy.empresaId), 'Empresa')}</li>
          </ul>
        </div>

        <div class="card">
          <h3>Cronograma</h3>
          <ul class="timeline">
            ${(proy.hitos || []).map(function (hi) {
              var cls = hi.estado === 'aprobado' ? 'timeline__dot--ok'
                : (hi.estado === 'observado' ? 'timeline__dot--warn'
                : (hi.estado === 'entregado' ? 'timeline__dot--now' : ''));
              return h`<li><span class="timeline__dot ${cls}"></span>
                <p class="timeline__t">${hi.titulo}</p>
                <p class="timeline__m">Semana ${hi.semana} · ${U.fecha(hi.fechaLimite)}</p>
              </li>`;
            })}
          </ul>
        </div>
      </div>
    </div>`;
  }

  /* ---------- Hitos ---------- */
  function tabHitos(proy, r, u) {
    var puedeEntregar = Auth.can('hito:entregar', proy);
    var puedeRevisar = Auth.can('hito:revisar', proy);

    return h`<div class="stack">
      ${!puedeEntregar && !puedeRevisar ? C.aviso('info', 'ℹ️', 'Estás viendo el avance del equipo. Solo el equipo entrega y el mentor revisa.') : ''}
      ${(proy.hitos || []).map(function (hi) {
        return h`<div class="hito hito--${hi.estado}">
          <div class="hito__head">
            <div class="hcol">
              <p class="tiny muted mb0">Semana ${hi.semana} · vence ${U.fecha(hi.fechaLimite)}</p>
              <h3 style="margin:.1rem 0">${hi.titulo}</h3>
              <p class="small muted mb0">${hi.descripcion}</p>
            </div>
            ${C.chipHito(hi)}
          </div>

          ${hi.evidencia ? h`<p class="small mt-sm mb0">
            📎 <a href="${U.safeUrl(hi.evidencia)}" target="_blank" rel="noopener noreferrer">${U.hostOf(hi.evidencia) || 'Ver evidencia'}</a>
            ${hi.entregadoAt ? h`<span class="tiny muted"> · entregado ${U.haceTiempo(hi.entregadoAt)}</span>` : ''}
          </p>` : ''}
          ${hi.nota ? h`<p class="small muted" style="white-space:pre-wrap">${hi.nota}</p>` : ''}
          ${hi.feedback ? h`<div class="mt-sm">${C.aviso(hi.estado === 'observado' ? 'warn' : 'ok',
            hi.estado === 'observado' ? '⚠️' : '✅', raw('<b>Mentor:</b> ' + U.esc(hi.feedback)))}</div>` : ''}

          ${puedeEntregar && ['pendiente', 'observado'].indexOf(hi.estado) !== -1 ? h`
            <form class="mt-sm" data-action="hito:entregar">
              <input type="hidden" name="proyectoId" value="${proy.id}">
              <input type="hidden" name="hitoId" value="${hi.id}">
              <div class="field-row field-row--2">
                ${C.campo({ name: 'evidencia', label: 'Enlace a la evidencia', required: true,
                  placeholder: 'https://drive.google.com/…', valor: hi.evidencia })}
                ${C.campo({ name: 'nota', label: 'Comentario para el mentor', placeholder: 'Qué incluye esta entrega' })}
              </div>
              <button class="btn btn--primary btn--sm" type="submit">Entregar hito</button>
            </form>` : ''}

          ${puedeRevisar && hi.estado === 'entregado' ? h`
            <form class="mt-sm" data-action="hito:revisar">
              <input type="hidden" name="proyectoId" value="${proy.id}">
              <input type="hidden" name="hitoId" value="${hi.id}">
              ${C.campo({ name: 'feedback', label: 'Comentario para el equipo', tipo: 'textarea', rows: 2,
                placeholder: 'Qué está bien y qué debe mejorar' })}
              <div class="btnrow">
                <button class="btn btn--ok btn--sm" type="submit" name="decision" value="aprobado">Aprobar hito</button>
                <button class="btn btn--ghost btn--sm" type="submit" name="decision" value="observado">Devolver con observaciones</button>
              </div>
            </form>` : ''}
        </div>`;
      })}
    </div>`;
  }

  /* ---------- Bitácora ---------- */
  var TIPOS_BITACORA = { avance: '📈 Avance', bloqueo: '🚧 Bloqueo', reunion: '🤝 Reunión', decision: '🧭 Decisión', entrega: '📦 Entrega' };

  function itemBitacora(b) {
    var autor = M.usuario(b.autorId);
    return h`<li class="bitacora__item">
      ${C.avatar(autor, 'avatar--sm')}
      <div class="bitacora__b">
        <div class="bitacora__meta">
          <b>${autor ? autor.nombre : 'Usuario'}</b>
          <span class="chip tiny">${TIPOS_BITACORA[b.tipo] || b.tipo}</span>
          <span>Semana ${b.semana}</span>
          ${b.horas ? h`<span>· ${b.horas} h</span>` : ''}
          <span>· ${U.haceTiempo(b.at)}</span>
          ${!b.visibleEmpresa ? h`<span class="chip tiny">Solo equipo y UPN</span>` : ''}
        </div>
        <p>${b.texto}</p>
      </div>
    </li>`;
  }

  function tabBitacora(proy, r, u) {
    var visibles = (proy.bitacora || []).filter(function (b) { return u.rol !== 'empresa' || b.visibleEmpresa; });
    var lista = U.sortBy(visibles, function (b) { return b.at; }, true);
    var horas = U.sum(proy.bitacora || [], function (b) { return b.horas || 0; });

    return h`<div class="split">
      <div>
        <div class="panel">
          <div class="panel__head"><h3>Bitácora del proyecto</h3>
            <span class="tiny muted">${horas} horas registradas</span></div>
          ${lista.length ? h`<div class="panel__body"><ul class="bitacora">${lista.map(itemBitacora)}</ul></div>`
            : h`<div class="panel__body">${C.vacio('📓', 'Bitácora vacía', 'Registra aquí reuniones, avances y bloqueos. Este historial respalda la constancia.')}</div>`}
        </div>
      </div>
      <div>
        ${Auth.can('bitacora:escribir', proy) ? h`<form class="card" data-action="bitacora:agregar">
          <input type="hidden" name="proyectoId" value="${proy.id}">
          <h3>Registrar avance</h3>
          ${C.campo({ name: 'tipo', label: 'Tipo', tipo: 'select',
            opciones: Object.keys(TIPOS_BITACORA).map(function (k) { return { value: k, label: TIPOS_BITACORA[k] }; }) })}
          <div class="field-row field-row--2">
            ${C.campo({ name: 'semana', label: 'Semana', tipo: 'number', min: 1, max: proy.semanas, valor: M.semanaActual(proy) })}
            ${C.campo({ name: 'horas', label: 'Horas dedicadas', tipo: 'number', min: 0, max: 40, valor: 2 })}
          </div>
          ${C.campo({ name: 'texto', label: '¿Qué pasó?', tipo: 'textarea', rows: 4, required: true,
            placeholder: 'Describe el avance, la reunión o el problema encontrado.' })}
          <label class="checkline checkline--on">
            <input type="checkbox" name="visibleEmpresa" value="true" checked>
            <span>Visible para la empresa</span>
          </label>
          <button class="btn btn--primary btn--block mt-sm" type="submit">Guardar en la bitácora</button>
          <p class="tiny muted mt-sm mb0">Las entradas no se pueden borrar: la bitácora es el respaldo del trabajo realizado.</p>
        </form>` : h`<div class="card">${C.aviso('info', 'ℹ️', 'La bitácora es de solo lectura para tu rol o el proyecto ya está cerrado.')}</div>`}
      </div>
    </div>`;
  }

  /* ---------- Entrega final ---------- */
  function tabEntrega(proy, r, u) {
    var ef = proy.entregaFinal;
    if (ef) {
      return h`<div class="split">
        <div class="card">
          <h2 style="font-size:1.1rem">${ef.titulo}</h2>
          <p class="small muted">Enviada por ${M.nombre(ef.porId)} · ${U.haceTiempo(ef.at)}</p>
          <p style="white-space:pre-wrap">${ef.resumen}</p>
          <h3 class="mt">Entregables</h3>
          <ul class="list">
            ${(ef.enlaces || []).map(function (e) {
              return h`<li><a class="listitem" style="padding-left:0" href="${U.safeUrl(e.url)}" target="_blank" rel="noopener noreferrer">
                <span class="avatar avatar--sm" aria-hidden="true">🔗</span>
                <span class="listitem__main"><span class="listitem__t">${e.label}</span>
                  <span class="listitem__s">${U.hostOf(e.url)}</span></span>
              </a></li>`;
            })}
          </ul>
        </div>
        <div class="card">
          <h3>Estado</h3>
          ${proy.estado === 'en_validacion' ? C.aviso('warn', '⏳', 'Esperando la evaluación del mentor y de la empresa.')
            : (proy.estado === 'cerrado' ? C.aviso('ok', '🏅', 'Proyecto cerrado y constancias emitidas.')
            : C.aviso('ok', '✅', 'Entrega aprobada. Falta emitir las constancias.'))}
          <a class="btn btn--ghost btn--block mt-sm" href="#/proyecto/${proy.id}?tab=evaluacion">Ver evaluación</a>
        </div>
      </div>`;
    }

    if (!Auth.can('entrega:final', proy)) {
      return C.vacio('📦', 'Todavía no hay entrega final',
        'El equipo enviará el resultado cuando complete los hitos del microproyecto.');
    }

    var pendientes = (proy.hitos || []).filter(function (x) { return x.estado !== 'aprobado'; });
    return h`<div style="max-width:700px">
      ${pendientes.length > 1 ? C.aviso('warn', '⚠️',
        'Te faltan ' + pendientes.length + ' hitos por aprobar. Complétalos antes de la entrega final.') : ''}
      <form class="card mt-sm" data-action="entrega:final">
        <input type="hidden" name="proyectoId" value="${proy.id}">
        <h2 style="font-size:1.1rem">Enviar la entrega final</h2>
        <p class="small muted">Esto notifica al mentor y a la empresa para que evalúen el trabajo.</p>
        ${C.campo({ name: 'titulo', label: 'Título de la entrega', required: true,
          valor: 'Entrega final — ' + U.truncar(r.titulo, 50) })}
        ${C.campo({ name: 'resumen', label: 'Resumen de lo entregado', tipo: 'textarea', rows: 5, required: true,
          placeholder: 'Qué se hizo, qué se logró y qué debe hacer la empresa de ahora en adelante.' })}
        <h3 class="mt">Enlaces a los entregables</h3>
        <div class="field-row field-row--2">
          ${C.campo({ name: 'label1', label: 'Nombre', valor: 'Carpeta de entregables' })}
          ${C.campo({ name: 'url1', label: 'Enlace', required: true, placeholder: 'https://drive.google.com/…' })}
        </div>
        <div class="field-row field-row--2">
          ${C.campo({ name: 'label2', label: 'Nombre (opcional)' })}
          ${C.campo({ name: 'url2', label: 'Enlace (opcional)' })}
        </div>
        <div class="field-row field-row--2">
          ${C.campo({ name: 'label3', label: 'Nombre (opcional)' })}
          ${C.campo({ name: 'url3', label: 'Enlace (opcional)' })}
        </div>
        <button class="btn btn--primary btn--block btn--lg" type="submit">Enviar entrega final</button>
      </form>
    </div>`;
  }

  /* ---------- Evaluación ---------- */
  function tabEvaluacion(proy, r, u) {
    var evs = proy.evaluaciones || [];
    var mentorEv = evs.filter(function (e) { return e.rol === 'mentor'; })[0];
    var empresaEv = evs.filter(function (e) { return e.rol === 'empresa'; })[0];
    var certs = Store.where('constancias', function (c) { return c.proyectoId === proy.id; });

    return h`<div class="split">
      <div class="stack">
        ${tarjetaEval('Evaluación del docente mentor', mentorEv, proy)}
        ${tarjetaEval('Evaluación de la empresa', empresaEv, proy)}
        ${!proy.entregaFinal ? C.aviso('info', 'ℹ️', 'La evaluación se habilita cuando el equipo envía la entrega final.') : ''}
      </div>

      <div class="stack">
        ${(Auth.can('evaluar:mentor', proy) || Auth.can('evaluar:empresa', proy)) ? formEvaluacion(proy, u) : ''}

        ${proy.estado === 'aprobado' && Auth.can('constancia:emitir', proy) ? h`<div class="card card--accent">
          <h3>Emitir constancias</h3>
          <p class="small muted">Se generará una constancia con código verificable para cada integrante del equipo.</p>
          <ul class="list">${proy.estudianteIds.map(function (id) {
            return h`<li style="padding:.4rem 0">${C.persona(M.usuario(id), proy.liderId === id ? 'Líder de equipo' : 'Integrante')}</li>`;
          })}</ul>
          <button class="btn btn--primary btn--block" data-action="constancia:emitir" data-id="${proy.id}"
            data-confirm="¿Emitir las constancias y cerrar el microproyecto? Esta acción no se puede deshacer.">
            ${C.icono('medalla', 18)} Emitir ${proy.estudianteIds.length} ${U.plural(proy.estudianteIds.length, 'constancia')}
          </button>
        </div>` : ''}

        ${certs.length ? h`<div class="card">
          <h3>Constancias emitidas</h3>
          <ul class="list">${certs.map(function (c) {
            return h`<li><a class="listitem" style="padding-left:0" href="#/constancia/${c.codigo}">
              <span class="avatar avatar--sm" aria-hidden="true">🏅</span>
              <span class="listitem__main">
                <span class="listitem__t">${c.snapshot.estudiante}</span>
                <span class="listitem__s"><code>${c.codigo}</code></span>
              </span>
              <span class="listitem__end">${c.estado === 'vigente' ? h`<span class="chip chip--ok">Vigente</span>` : h`<span class="chip chip--danger">Anulada</span>`}</span>
            </a></li>`;
          })}</ul>
        </div>` : ''}

        <div class="card">
          <h3>Rúbrica</h3>
          <ul class="small muted" style="margin-bottom:0;padding-left:1rem">
            ${CFG.RUBRICA.map(function (c) { return h`<li><b>${c.label}:</b> ${c.ayuda}</li>`; })}
          </ul>
        </div>
      </div>
    </div>`;
  }

  function tarjetaEval(titulo, ev, proy) {
    if (!ev) return h`<div class="card"><h3>${titulo}</h3><p class="small muted mb0">Pendiente.</p></div>`;
    return h`<div class="card">
      <div class="row row--between"><h3 style="margin:0">${titulo}</h3>
        <span class="chip ${ev.decision === 'aprobado' ? 'chip--ok' : 'chip--warn'}">${ev.decision === 'aprobado' ? 'Aprobado' : 'Observado'}</span></div>
      <p class="tiny muted">${M.nombre(ev.evaluadorId)} · ${U.haceTiempo(ev.at)} · ${M.puntajeEval(ev)}/100</p>
      <ul class="list">
        ${CFG.RUBRICA.map(function (c) {
          return h`<li style="padding:.35rem 0"><div class="row row--between">
            <span class="small">${c.label}</span>${C.estrellas(ev.criterios[c.id] || 0)}</div></li>`;
        })}
      </ul>
      ${ev.comentario ? h`<blockquote class="small" style="border-left:3px solid var(--lucuma);padding-left:.8rem;margin:.6rem 0 0;color:var(--text-soft)">${ev.comentario}</blockquote>` : ''}
    </div>`;
  }

  function formEvaluacion(proy, u) {
    return h`<form class="card card--accent" data-action="evaluacion:enviar">
      <input type="hidden" name="proyectoId" value="${proy.id}">
      <h3>Tu evaluación</h3>
      <p class="small muted">Califica del 1 (muy bajo) al 5 (excelente).</p>
      ${CFG.RUBRICA.map(function (c) {
        return h`<div class="field">
          <span class="field__label">${c.label}</span>
          <p class="tiny muted" style="margin:0 0 .3rem">${c.ayuda}</p>
          ${C.selectorEstrellas('crit_' + c.id, 4)}
        </div>`;
      })}
      ${C.campo({ name: 'comentario', label: 'Comentario', tipo: 'textarea', rows: 3,
        placeholder: u.rol === 'empresa' ? '¿Qué te pareció el resultado? ¿Lo estás usando?' : '¿Cómo trabajó el equipo?' })}
      <div class="btnrow">
        <button class="btn btn--primary" type="submit" name="decision" value="aprobado">Aprobar entrega</button>
        <button class="btn btn--ghost" type="submit" name="decision" value="observado">Observar y devolver</button>
      </div>
    </form>`;
  }

  /* ---------- Equipo ---------- */
  function tabEquipo(proy, r, u) {
    return h`<div class="grid grid--auto">
      ${proy.estudianteIds.map(function (id) {
        var e = M.usuario(id);
        if (!e) return '';
        var horas = U.sum((proy.bitacora || []).filter(function (b) { return b.autorId === id; }), function (b) { return b.horas || 0; });
        return h`<div class="card">
          <div class="card__head">${C.avatar(e, 'avatar--lg')}
            <div class="hcol">
              <h3 class="card__title"><a href="#/perfil/${e.id}">${e.nombre}</a></h3>
              <p class="tiny muted mb0">${e.carrera} · Ciclo ${e.ciclo}</p>
            </div>
            ${proy.liderId === id ? h`<span class="chip chip--brand">Líder</span>` : ''}
          </div>
          <div class="chips">${(e.habilidades || []).slice(0, 4).map(function (s) {
            return h`<span class="chip">${M.habilidadNombre(s.skill)}</span>`; })}</div>
          <div class="card__foot"><span class="tiny muted">${horas} h registradas</span>
            <span class="tiny muted">${(proy.bitacora || []).filter(function (b) { return b.autorId === id; }).length} entradas</span></div>
        </div>`;
      })}
      <div class="card">
        <div class="card__head">${C.avatar(M.usuario(proy.mentorId), 'avatar--lg')}
          <div class="hcol"><h3 class="card__title">${M.nombre(proy.mentorId)}</h3>
            <p class="tiny muted mb0">Docente mentor</p></div></div>
        <p class="small muted">${(M.usuario(proy.mentorId) || {}).especialidad || ''}</p>
      </div>
      <div class="card">
        <div class="card__head">${C.avatar(M.usuario(proy.empresaId), 'avatar--lg')}
          <div class="hcol"><h3 class="card__title">${M.empresaNombre(proy.empresaId)}</h3>
            <p class="tiny muted mb0">Empresa · ${(M.usuario(proy.empresaId) || {}).distrito || ''}</p></div></div>
        <p class="small muted">Contacto: ${M.nombre(proy.empresaId)}</p>
      </div>
    </div>`;
  }
})();
