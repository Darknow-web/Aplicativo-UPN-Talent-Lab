/* 14-views-mentor.js — Panel del docente mentor */
window.Vistas = window.Vistas || {};
(function () {
  var h = U.html, raw = U.raw;

  Vistas.panelMentor = function (u) {
    var proys = M.proyectosDe(u.id);
    var activos = proys.filter(function (p) { return ['en_curso', 'en_validacion'].indexOf(p.estado) !== -1; });
    var porRevisar = [];
    activos.forEach(function (p) {
      (p.hitos || []).forEach(function (hi) {
        if (hi.estado === 'entregado') porRevisar.push({ proyecto: p, hito: hi });
      });
    });
    var porEvaluar = proys.filter(function (p) { return Auth.can('evaluar:mentor', p); });
    var proximos = [];
    activos.forEach(function (p) {
      (p.hitos || []).forEach(function (hi) {
        if (hi.estado === 'pendiente' || hi.estado === 'observado') {
          proximos.push({ proyecto: p, hito: hi, dias: U.diasEntre(U.hoy(), hi.fechaLimite) });
        }
      });
    });
    proximos = U.sortBy(proximos, function (x) { return x.dias; }).slice(0, 5);

    return h`
      ${C.pageHead('Hola, ' + u.nombre.split(' ')[0] + ' 👋', u.especialidad + ' · Facultad de ' + u.facultad)}

      ${porRevisar.length ? h`<div style="margin-bottom:1rem">${C.aviso('warn', '📥',
        raw('Tienes <b>' + porRevisar.length + '</b> ' + U.plural(porRevisar.length, 'hito') + ' esperando tu revisión.'))}</div>` : ''}
      ${porEvaluar.length ? h`<div style="margin-bottom:1rem">${C.aviso('brand', '⭐',
        raw('Hay <b>' + porEvaluar.length + '</b> ' + U.plural(porEvaluar.length, 'entrega') + ' final por evaluar. ' +
        '<a href="#/proyecto/' + U.esc(porEvaluar[0].id) + '?tab=evaluacion"><b>Evaluar</b></a>'))}</div>` : ''}

      <div class="grid grid--stats">
        ${C.stat('Proyectos activos', activos.length, 'de ' + (u.maxProyectos || 3) + ' posibles', true)}
        ${C.stat('Hitos por revisar', porRevisar.length, 'entregados por los equipos')}
        ${C.stat('Estudiantes', U.unique([].concat.apply([], activos.map(function (p) { return p.estudianteIds; }))).length, 'bajo tu acompañamiento')}
        ${C.stat('Proyectos cerrados', proys.filter(function (p) { return p.estado === 'cerrado'; }).length, 'con constancia emitida')}
      </div>

      <div class="split mt">
        <div class="stack">
          <div class="panel">
            <div class="panel__head"><h3>Hitos esperando revisión</h3>
              ${porRevisar.length ? h`<span class="chip chip--warn">${porRevisar.length}</span>` : ''}</div>
            ${porRevisar.length ? h`<ul class="list">${porRevisar.map(function (x) {
              var r = M.reto(x.proyecto.retoId);
              return h`<li><a class="listitem" href="#/proyecto/${x.proyecto.id}?tab=hitos">
                <span class="avatar avatar--sm" aria-hidden="true">📥</span>
                <span class="listitem__main">
                  <span class="listitem__t">${x.hito.titulo} — semana ${x.hito.semana}</span>
                  <span class="listitem__s">${r ? r.titulo : ''} · entregado ${U.haceTiempo(x.hito.entregadoAt)}</span>
                </span>
                <span class="listitem__end"><span class="chip chip--info">Revisar</span></span>
              </a></li>`;
            })}</ul>` : h`<div class="panel__body center"><p class="small muted mb0">✅ Nada pendiente por revisar</p></div>`}
          </div>

          <div>
            <h2>Proyectos que acompaño</h2>
            ${proys.length ? h`<div class="grid grid--2 mt-sm">${U.sortBy(proys, function (p) { return p.inicio; }, true).map(C.cardProyecto)}</div>`
              : C.vacio('🧭', 'Todavía no tienes proyectos asignados', 'La coordinación te asignará como mentor cuando conforme un equipo de tu área.')}
          </div>
        </div>

        <div class="stack">
          <div class="card">
            <h3>Próximos vencimientos</h3>
            ${proximos.length ? h`<ul class="timeline" style="margin-top:.5rem">
              ${proximos.map(function (x) {
                var vencido = x.dias < 0;
                return h`<li>
                  <span class="timeline__dot ${vencido ? 'timeline__dot--warn' : 'timeline__dot--now'}"></span>
                  <p class="timeline__t">${x.hito.titulo}</p>
                  <p class="timeline__m">${U.truncar(M.reto(x.proyecto.retoId).titulo, 40)}</p>
                  <p class="tiny ${vencido ? '' : 'muted'}" style="${raw(vencido ? 'color:var(--danger)' : '')}">
                    ${vencido ? 'Venció hace ' + Math.abs(x.dias) + ' días' : (x.dias === 0 ? 'Vence hoy' : 'En ' + x.dias + ' días')}
                  </p>
                </li>`;
              })}
            </ul>` : h`<p class="small muted mb0">No hay hitos próximos a vencer.</p>`}
          </div>
          <div class="card">
            <h3>Mis especialidades</h3>
            <div class="chips">${(u.habilidades || []).map(function (s) {
              return h`<span class="chip chip--brand">${M.habilidadNombre(s)}</span>`; })}</div>
            <p class="small muted mt-sm mb0">${u.bio || ''}</p>
          </div>
        </div>
      </div>`;
  };
})();
