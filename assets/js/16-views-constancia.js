/* 16-views-constancia.js — Listado de constancias y constancia imprimible */
window.Vistas = window.Vistas || {};
(function () {
  var h = U.html, raw = U.raw;

  /* ================= Listado ================= */
  Vistas.constancias = function (p, q) {
    var u = Auth.actual();
    if (u.rol === 'estudiante') return constanciasEstudiante(u);
    return constanciasCoordinacion(q);
  };

  function constanciasEstudiante(u) {
    var lista = U.sortBy(M.constanciasDe(u.id), function (c) { return c.emitidaAt; }, true);
    return h`
      ${C.pageHead('Mis constancias', lista.length + ' ' + U.plural(lista.length, 'constancia') + ' de experiencia verificable',
        u.slug ? h`<a class="btn btn--ghost" href="#/portafolio/${u.slug}">Ver mi portafolio público</a>` : null)}
      ${lista.length ? h`<div class="grid grid--2">${lista.map(function (c) {
        return h`<div class="card ${c.estado === 'vigente' ? 'card--accent' : ''}">
          <div class="card__head">
            <span class="avatar avatar--lg" aria-hidden="true">${c.estado === 'vigente' ? '🏅' : '🚫'}</span>
            <div class="hcol">
              <h3 class="card__title">${c.snapshot.reto}</h3>
              <p class="tiny muted mb0">${c.snapshot.empresa}</p>
            </div>
          </div>
          <ul class="list small">
            <li style="padding:.3rem 0"><b>Periodo:</b> ${U.fecha(c.snapshot.inicio)} — ${U.fecha(c.snapshot.fin)}</li>
            <li style="padding:.3rem 0"><b>Dedicación:</b> ${c.snapshot.horas} horas · ${c.snapshot.rol}</li>
            <li style="padding:.3rem 0"><b>Evaluación:</b> ${c.snapshot.puntaje}/100</li>
          </ul>
          <div class="chips">${(c.snapshot.habilidades || []).map(function (x) { return h`<span class="chip chip--brand">${x}</span>`; })}</div>
          ${c.estado !== 'vigente' ? C.aviso('danger', '🚫', raw('Anulada: ' + U.esc(c.motivoAnulacion || ''))) : ''}
          <div class="card__foot">
            <code class="tiny">${c.codigo}</code>
            <span class="btnrow">
              <button class="btn btn--ghost btn--sm" data-action="ui:copiar" data-texto="${c.codigo}">Copiar código</button>
              <a class="btn btn--primary btn--sm" href="#/constancia/${c.codigo}">Ver / imprimir</a>
            </span>
          </div>
        </div>`;
      })}</div>` : C.vacio('🏅', 'Todavía no tienes constancias',
        'Cuando cierres tu primer microproyecto, la coordinación emitirá tu constancia verificable.',
        h`<a class="btn btn--primary" href="#/retos">Buscar un reto</a>`)}`;
  }

  function constanciasCoordinacion(q) {
    var lista = U.sortBy(Store.all('constancias'), function (c) { return c.emitidaAt; }, true);
    if (q.q) lista = lista.filter(function (c) {
      return U.contiene(c.snapshot.estudiante, q.q) || U.contiene(c.codigo, q.q) || U.contiene(c.snapshot.empresa, q.q);
    });
    var porEmitir = Store.where('proyectos', function (p) { return p.estado === 'aprobado'; });

    return h`
      ${C.pageHead('Constancias emitidas', lista.length + ' en total · ' +
        lista.filter(function (c) { return c.estado === 'vigente'; }).length + ' vigentes')}

      ${porEmitir.length ? h`<div style="margin-bottom:1rem">${C.aviso('brand', '🏅',
        raw('Hay <b>' + porEmitir.length + '</b> ' + U.plural(porEmitir.length, 'proyecto') + ' aprobado' + (porEmitir.length === 1 ? '' : 's') +
        ' esperando emisión. <a href="#/proyecto/' + U.esc(porEmitir[0].id) + '?tab=evaluacion"><b>Emitir ahora</b></a>'))}</div>` : ''}

      <form class="searchbar" data-action="filtro:constancias">
        <input class="input" type="search" name="q" value="${q.q || ''}" placeholder="Buscar por estudiante, empresa o código…" aria-label="Buscar constancias">
        <button class="btn btn--ghost" type="submit">Buscar</button>
      </form>

      ${lista.length ? h`<div class="panel"><div class="table-wrap">
        <table class="tbl">
          <thead><tr><th>Código</th><th>Estudiante</th><th>Reto</th><th>Empresa</th><th>Emitida</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            ${lista.map(function (c) {
              return h`<tr>
                <td><code class="tiny">${c.codigo}</code></td>
                <td>${c.snapshot.estudiante}</td>
                <td>${U.truncar(c.snapshot.reto, 34)}</td>
                <td>${U.truncar(c.snapshot.empresa, 24)}</td>
                <td class="nowrap">${U.fecha(c.emitidaAt)}</td>
                <td>${c.estado === 'vigente' ? h`<span class="chip chip--ok">Vigente</span>` : h`<span class="chip chip--danger">Anulada</span>`}</td>
                <td class="nowrap">
                  <a class="btn btn--ghost btn--sm" href="#/constancia/${c.codigo}">Ver</a>
                  ${c.estado === 'vigente' ? h`<button class="btn btn--ghost btn--sm" data-action="constancia:anular" data-id="${c.id}">Anular</button>` : ''}
                </td>
              </tr>`;
            })}
          </tbody>
        </table>
      </div></div>` : C.vacio('🏅', 'Sin constancias todavía', 'Se emiten al cerrar un microproyecto aprobado.')}`;
  }

  /* ================= Constancia imprimible ================= */
  Vistas.constancia = function (p) {
    var c = M.constanciaPorCodigo(p.codigo);
    if (!c) return Vistas.noEncontrado('#/constancia/' + p.codigo);
    var s = c.snapshot;
    var anulada = c.estado !== 'vigente';
    var urlVerif = 'Verifica en línea con el código ' + c.codigo;

    return h`<div class="cert-wrap">
      <div class="row row--between no-print" style="margin-bottom:.9rem">
        ${C.volver(Auth.es('estudiante') ? '#/constancias' : '#/verificar/' + c.codigo)}
        <span class="btnrow">
          <button class="btn btn--ghost btn--sm" data-action="ui:copiar" data-texto="${c.codigo}">Copiar código</button>
          <button class="btn btn--primary btn--sm" data-action="ui:imprimir">${C.icono('imprimir', 16)} Imprimir / Guardar PDF</button>
        </span>
      </div>

      ${anulada ? h`<div class="no-print" style="margin-bottom:1rem">${C.aviso('danger', '🚫',
        raw('Esta constancia fue anulada el ' + U.esc(U.fecha(c.anuladaAt)) + '. Motivo: ' + U.esc(c.motivoAnulacion || '—')))}</div>` : ''}

      <article class="cert ${anulada ? 'cert--anulada' : ''}">
        <div class="cert__inner">
          <span class="cert__ribbon" aria-hidden="true"></span>
          ${anulada ? h`<div class="cert__watermark" aria-hidden="true"><span>ANULADA</span></div>` : ''}

          <header class="cert__head">
            <svg viewBox="0 0 64 64" width="42" height="42" aria-hidden="true">
              <rect width="64" height="64" rx="14" fill="#F9B229"/>
              <path d="M32 12 46 40H18z" fill="#3C3C3B"/><rect x="27" y="40" width="10" height="12" rx="3" fill="#3C3C3B"/>
            </svg>
            <div>
              <h1>Universidad Privada del Norte</h1>
              <p>UPN Talent Lab · Programa de vinculación con el entorno empresarial</p>
            </div>
          </header>

          <p class="cert__kicker">Constancia de experiencia verificable</p>
          <p class="cert__line">La Universidad Privada del Norte deja constancia de que</p>
          <p class="cert__name">${s.estudiante}</p>
          <p class="cert__line">estudiante de <b>${s.carrera}</b>, código <b>${s.codigoUPN}</b>, participó como
            <b>${s.rol}</b> en el microproyecto</p>
          <p class="cert__reto">“${s.reto}”</p>
          <p class="cert__line">desarrollado para la empresa <b>${s.empresa}</b> con acompañamiento docente,
            entre el ${U.fechaLarga(s.inicio)} y el ${U.fechaLarga(s.fin)}.</p>

          <dl class="cert__meta">
            <div><dt>Duración</dt><dd>${s.semanas} semanas</dd></div>
            <div><dt>Dedicación</dt><dd>${s.horas} horas</dd></div>
            <div><dt>Área</dt><dd>${M.categoria(s.categoria).label}</dd></div>
            <div><dt>Evaluación final</dt><dd>${s.puntaje}/100</dd></div>
          </dl>

          <p class="small" style="text-align:center;margin-bottom:.4rem"><b>Competencias acreditadas</b></p>
          <div class="chips" style="justify-content:center">
            ${(s.habilidades || []).map(function (x) { return h`<span class="chip chip--brand">${x}</span>`; })}
          </div>

          ${s.logro ? h`<p class="cert__line" style="margin-top:1rem;font-style:italic">“${s.logro}”</p>` : ''}

          <div class="cert__firmas">
            <div class="cert__firma"><b>${s.mentor}</b>Docente mentor · UPN</div>
            <div class="cert__firma"><b>${s.coordinador}</b>Coordinación UPN Talent Lab</div>
          </div>

          <div class="cert__cod">
            <div>
              <p class="tiny" style="margin:0 0 .2rem;color:#8C877E">Código de verificación</p>
              <code>${c.codigo}</code>
              <p class="tiny" style="margin:.35rem 0 0;color:#8C877E">${urlVerif}</p>
            </div>
            <div class="cert__qr">${qrDecorativo(c.codigo)}</div>
          </div>
        </div>
      </article>

      <p class="small muted center mt no-print">
        Cualquiera puede comprobar la autenticidad de esta constancia en
        <a href="#/verificar/${c.codigo}">la página de verificación</a>.
      </p>
    </div>`;
  };

  /* Patrón visual determinista a partir del código (sin librerías externas) */
  function qrDecorativo(codigo) {
    var limpio = String(codigo).replace(/[^A-Z0-9]/gi, '');
    var celdas = '';
    var n = 9, cell = 8;
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        var i = y * n + x;
        var ch = limpio.charCodeAt(i % limpio.length) || 65;
        var on = ((ch + i * 7 + x * 3 + y * 5) % 3) === 0;
        // Esquinas de referencia siempre pintadas
        var esquina = (x < 3 && y < 3) || (x > n - 4 && y < 3) || (x < 3 && y > n - 4);
        var borde = esquina && (x === 0 || y === 0 || x === 2 || y === 2 || x === n - 1 || x === n - 3 || y === n - 1 || y === n - 3);
        if (esquina) on = borde || (x === 1 && y === 1) || (x === n - 2 && y === 1) || (x === 1 && y === n - 2);
        if (on) celdas += '<rect x="' + (x * cell) + '" y="' + (y * cell) + '" width="' + cell + '" height="' + cell + '"/>';
      }
    }
    return raw('<svg viewBox="0 0 ' + (n * cell) + ' ' + (n * cell) + '" width="76" height="76" fill="#3C3C3B" role="img" aria-label="Patrón del código ' +
      U.esc(codigo) + '"><rect width="' + (n * cell) + '" height="' + (n * cell) + '" fill="#fff"/>' + celdas + '</svg>');
  }
})();
