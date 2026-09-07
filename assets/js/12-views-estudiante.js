/* 12-views-estudiante.js — Panel del estudiante, postulaciones y portafolio público */
window.Vistas = window.Vistas || {};
(function () {
  var h = U.html, raw = U.raw;

  /* ================= Panel ================= */
  Vistas.panelEstudiante = function (u) {
    var proys = M.proyectosDe(u.id);
    var activo = proys.filter(function (p) { return ['en_curso', 'en_validacion'].indexOf(p.estado) !== -1; })[0];
    var posts = Store.where('postulaciones', function (p) { return p.estudianteId === u.id; });
    var certs = M.constanciasDe(u.id).filter(function (c) { return c.estado === 'vigente'; });
    var reco = Matching.retosPara(u.id).slice(0, 3);
    var perfilCompleto = (u.habilidades || []).length >= 3;

    return h`
      ${C.pageHead('Hola, ' + u.nombre.split(' ')[0] + ' 👋',
        u.carrera + ' · Ciclo ' + u.ciclo + ' · ' + u.campus,
        h`<a class="btn btn--primary" href="#/retos">${C.icono('brujula', 18)} Ver oportunidades</a>`)}

      ${C.tarjetaAcciones(u)}

      <div class="grid grid--stats">
        ${C.stat('Proyectos', proys.length, U.plural(proys.length, 'microproyecto'), true)}
        ${C.stat('Postulaciones', posts.length, posts.filter(function (p) { return p.estado === 'postulada'; }).length + ' en revisión')}
        ${C.stat('Constancias', certs.length, 'verificables')}
        ${C.stat('Horas acreditadas', U.sum(certs, function (c) { return c.snapshot.horas || 0; }), 'de experiencia real')}
      </div>

      <div class="split mt">
        <div class="stack">
          ${activo ? proyectoActivo(activo, u) : h`<div class="card">
            <h2>Todavía no tienes un microproyecto activo</h2>
            <p class="small muted">Postula a un reto y, si te seleccionan, aquí verás tu tablero con los hitos semanales.</p>
            <a class="btn btn--primary" href="#/retos">Explorar retos abiertos</a>
          </div>`}

          <div>
            <div class="row row--between">
              <h2 style="margin:0">Retos recomendados para ti</h2>
              <a class="tiny" href="#/retos">Ver todos</a>
            </div>
            ${reco.length ? h`<div class="grid grid--2 mt-sm">${reco.map(function (x) { return C.cardReto(x.reto, { match: x.match }); })}</div>`
              : C.vacio('🔍', 'No hay retos abiertos ahora', 'Cuando una empresa publique un nuevo reto, aparecerá aquí.')}
          </div>
        </div>

        <div class="stack">
          <div class="card">
            <div class="card__head">${C.avatar(u, 'avatar--lg')}
              <div class="hcol"><h3 class="card__title">${u.nombre}</h3>
                <p class="tiny muted mb0">${u.codigoUPN}</p></div></div>
            <p class="small muted">${U.truncar(u.bio || 'Agrega una breve presentación a tu perfil.', 130)}</p>
            <p class="tiny muted">Habilidades declaradas</p>
            ${(u.habilidades || []).length
              ? h`<div class="chips">${(u.habilidades || []).slice(0, 6).map(function (s) {
                  return h`<span class="chip chip--brand">${M.habilidadNombre(s.skill)} · ${s.nivel}/5</span>`; })}</div>`
              : h`<p class="small muted">Aún no registras habilidades.</p>`}
            <a class="btn btn--ghost btn--sm btn--block mt-sm" href="#/perfil">Editar perfil y portafolio</a>
          </div>

          ${certs.length ? h`<div class="card">
            <h3>Mis constancias</h3>
            ${certs.slice(0, 3).map(function (c) {
              return h`<a class="listitem" style="padding-left:0;padding-right:0" href="#/constancia/${c.codigo}">
                <span class="avatar avatar--sm" aria-hidden="true">🏅</span>
                <span class="listitem__main">
                  <span class="listitem__t">${U.truncar(c.snapshot.reto, 40)}</span>
                  <span class="listitem__s">${c.snapshot.empresa}</span>
                </span>
              </a>`;
            })}
            <a class="btn btn--ghost btn--sm btn--block mt-sm" href="#/constancias">Ver todas</a>
          </div>` : ''}
        </div>
      </div>`;
  };

  function proyectoActivo(p, u) {
    var r = M.reto(p.retoId);
    var pct = M.progreso(p);
    var sem = M.semanaActual(p);
    var siguiente = (p.hitos || []).filter(function (x) { return x.estado !== 'aprobado'; })[0];
    return h`<div class="card card--accent">
      <p class="tiny muted mb0">Tu microproyecto activo · ${p.codigo}</p>
      <h2 style="margin:.1rem 0 .3rem">${r.titulo}</h2>
      <p class="small muted">${M.empresaNombre(p.empresaId)} · Semana ${sem} de ${p.semanas} · Mentor: ${M.nombre(p.mentorId)}</p>
      ${C.medidor(pct)}
      ${siguiente ? h`<div class="mt-sm">
        ${C.aviso(siguiente.estado === 'observado' ? 'warn' : 'info',
          siguiente.estado === 'observado' ? '⚠️' : '🎯',
          raw('<b>Siguiente hito:</b> ' + U.esc(siguiente.titulo) + ' — vence el ' + U.esc(U.fecha(siguiente.fechaLimite)) +
            (siguiente.estado === 'observado' ? '. Tu mentor pidió correcciones.' : '')))}
      </div>` : ''}
      <a class="btn btn--primary btn--block mt-sm" href="#/proyecto/${p.id}">Abrir mi tablero</a>
    </div>`;
  }

  /* ================= Mis postulaciones ================= */
  Vistas.postulaciones = function () {
    var u = Auth.actual();
    var lista = U.sortBy(Store.where('postulaciones', function (p) { return p.estudianteId === u.id; }),
      function (p) { return p.creado; }, true);

    var etiqueta = { postulada: ['chip--info', 'En revisión'], preseleccionada: ['chip--warn', 'Preseleccionado'],
      seleccionada: ['chip--ok', 'Seleccionado'], no_seleccionada: ['', 'No seleccionado'] };

    return h`
      ${C.pageHead('Mis postulaciones', lista.length + ' ' + U.plural(lista.length, 'postulación', 'postulaciones') + ' enviadas',
        h`<a class="btn btn--primary" href="#/retos">Buscar más retos</a>`)}
      ${lista.length ? h`<div class="panel"><ul class="list">
        ${lista.map(function (p) {
          var r = M.reto(p.retoId);
          if (!r) return '';
          var e = etiqueta[p.estado] || etiqueta.postulada;
          return h`<li><div class="listitem">
            ${C.avatar(M.usuario(r.empresaId))}
            <span class="listitem__main">
              <span class="listitem__t"><a href="#/reto/${r.id}">${r.titulo}</a></span>
              <span class="listitem__s">${M.empresaNombre(r.empresaId)} · postulaste ${U.haceTiempo(p.creado)}</span>
              <span class="tiny muted">Compatibilidad ${p.score}%</span>
            </span>
            <span class="listitem__end">
              <span class="chip ${e[0]}">${e[1]}</span>
              ${p.estado === 'postulada' ? h`<button class="btn btn--ghost btn--sm" data-action="postulacion:retirar" data-id="${p.id}"
                data-confirm="¿Retirar tu postulación?">Retirar</button>` : ''}
            </span>
          </div></li>`;
        })}
      </ul></div>` : C.vacio('📨', 'Aún no has postulado', 'Explora los retos abiertos y postula al que mejor calce contigo.',
        h`<a class="btn btn--primary" href="#/retos">Ver oportunidades</a>`)}`;
  };

  /* ================= Portafolio público ================= */
  Vistas.portafolio = function (p) {
    var est = Store.where('users', function (x) { return x.rol === 'estudiante' && x.slug === p.slug; })[0];
    if (!est) return Vistas.noEncontrado('#/portafolio/' + p.slug);
    if (!est.portafolioPublico) {
      return C.vacio('🔒', 'Portafolio privado', 'Este estudiante decidió no mostrar su portafolio públicamente.', null, 'h1');
    }
    var items = (est.portafolio || []).filter(function (i) { return i.visible; });
    var certs = M.constanciasDe(est.id).filter(function (c) { return c.estado === 'vigente'; });

    return h`<div style="max-width:900px;margin:0 auto">
      <section class="pf-hero">
        ${C.avatar(est, 'avatar--xl')}
        <h1>${est.nombre}</h1>
        <p>${est.carrera} · Ciclo ${est.ciclo} · ${est.campus}</p>
        <p style="margin-top:.6rem;max-width:60ch">${est.bio || ''}</p>
        <div class="chips mt-sm">
          ${(est.habilidades || []).map(function (s) {
            return raw('<span class="chip" style="background:rgba(255,255,255,.14);border-color:transparent;color:#fff">' +
              U.esc(M.habilidadNombre(s.skill)) + '</span>');
          })}
        </div>
      </section>

      <div class="grid grid--stats mt">
        ${C.stat('Microproyectos', items.length, 'con empresas reales', true)}
        ${C.stat('Constancias', certs.length, 'verificables')}
        ${C.stat('Horas', U.sum(certs, function (c) { return c.snapshot.horas || 0; }), 'de experiencia')}
        ${C.stat('Empresas', U.unique(certs.map(function (c) { return c.snapshot.empresa; })).length, 'atendidas')}
      </div>

      <h2 class="mt">Experiencia en UPN Talent Lab</h2>
      ${items.length ? h`<div class="stack">${items.map(function (i) {
        var c = Store.find('constancias', i.constanciaId);
        return h`<div class="card">
          <div class="card__head">
            <span class="avatar" aria-hidden="true">💼</span>
            <div class="hcol">
              <h3 class="card__title">${i.titulo}</h3>
              <p class="tiny muted mb0">${i.empresa} · ${i.rol}${c ? ' · ' + U.fecha(c.snapshot.inicio) + ' a ' + U.fecha(c.snapshot.fin) : ''}</p>
            </div>
          </div>
          <p class="small">${i.relato}</p>
          <div class="chips">${(i.habilidades || []).map(function (x) { return h`<span class="chip chip--brand">${x}</span>`; })}</div>
          ${c ? h`<div class="card__foot">
            <code class="tiny">${c.codigo}</code>
            <a class="btn btn--ghost btn--sm" href="#/verificar/${c.codigo}">${C.icono('escudo', 15)} Verificar</a>
          </div>` : ''}
        </div>`;
      })}</div>` : C.vacio('📁', 'Portafolio en construcción', 'Este estudiante aún no ha cerrado su primer microproyecto.')}
    </div>`;
  };
})();
