/* 10-views-public.js — Landing, acceso, ayuda, verificador y pantallas de sistema */
window.Vistas = window.Vistas || {};
(function () {
  var h = U.html, raw = U.raw;

  /* ---------------- Inicio: landing o panel según sesión ---------------- */
  Vistas.inicio = function (p, q) {
    var u = Auth.actual();
    if (!u) return landing();
    if (u.rol === 'estudiante') return Vistas.panelEstudiante(u);
    if (u.rol === 'empresa') return Vistas.panelEmpresa(u);
    if (u.rol === 'mentor') return Vistas.panelMentor(u);
    return Vistas.panelCoordinador(u);
  };

  function landing() {
    var mt = M.metricas();
    var destacados = Store.where('retos', function (r) { return r.estado === 'publicado'; }).slice(0, 3);
    return h`
      <section class="hero">
        <span class="eyebrow" style="color:#5B4715">Universidad Privada del Norte</span>
        <h1>Talento universitario resolviendo retos reales de pequeñas empresas</h1>
        <p>Las empresas plantean una necesidad concreta. La UPN selecciona a los estudiantes según sus habilidades.
           En 2 a 4 semanas, con acompañamiento de un docente, el reto queda resuelto y el estudiante se lleva
           experiencia verificable para su CV.</p>
        <div class="hero__cta">
          <a class="btn btn--dark btn--lg" href="#/registro?rol=empresa">Soy una empresa</a>
          <a class="btn btn--lg" style="background:#fff" href="#/registro?rol=estudiante">Soy estudiante UPN</a>
        </div>
        <div class="hero__kpis">
          <div class="hero__kpi"><b>${mt.retosPublicados}</b><span>retos abiertos hoy</span></div>
          <div class="hero__kpi"><b>${mt.estudiantes}</b><span>estudiantes inscritos</span></div>
          <div class="hero__kpi"><b>${mt.empresas}</b><span>empresas aliadas</span></div>
          <div class="hero__kpi"><b>${mt.constancias}</b><span>constancias emitidas</span></div>
        </div>
      </section>

      <h2>Cómo funciona</h2>
      <p class="muted small">Un microproyecto de 2 a 4 semanas, de principio a fin.</p>
      <div class="steps mt">
        <div class="step"><h3>La empresa plantea su necesidad</h3><p>Un problema concreto y acotado: “necesito ordenar mi inventario”, “quiero reactivar mis redes”. Sin tecnicismos.</p></div>
        <div class="step"><h3>La UPN selecciona al equipo</h3><p>La coordinación revisa el reto, compara habilidades declaradas y arma el equipo con un docente mentor.</p></div>
        <div class="step"><h3>2 a 4 semanas de trabajo</h3><p>Hitos semanales, bitácora de avances y revisión del mentor. La empresa ve el progreso en todo momento.</p></div>
        <div class="step"><h3>Resultado y constancia</h3><p>La empresa recibe el entregable. El estudiante obtiene una constancia con código verificable y su portafolio.</p></div>
      </div>

      <h2 class="mt">Retos abiertos ahora</h2>
      ${destacados.length ? h`<div class="grid grid--auto mt-sm">${destacados.map(function (r) { return C.cardReto(r); })}</div>
        <p class="mt center"><a class="btn btn--ghost" href="#/retos">Ver todos los retos</a></p>`
        : C.vacio('📭', 'Todavía no hay retos publicados', 'Vuelve pronto o publica el primero desde tu cuenta de empresa.',
            h`<a class="btn btn--primary" href="#/registro?rol=empresa">Publicar un reto</a>`)}

      <div class="split mt">
        <div class="card">
          <h2>Para las empresas</h2>
          <ul class="small">
            <li>Resuelves algo que tienes pendiente hace meses, sin contratar personal.</li>
            <li>Trabajas con estudiantes seleccionados por sus habilidades, no al azar.</li>
            <li>Un docente de la UPN supervisa el trabajo y responde por la calidad.</li>
            <li>Ves el avance semana a semana y recibes entregables concretos.</li>
          </ul>
          <a class="btn btn--primary btn--block mt-sm" href="#/registro?rol=empresa">Plantear mi necesidad</a>
        </div>
        <div class="card">
          <h2>Para los estudiantes</h2>
          <ul class="small">
            <li>Experiencia real con una empresa, no un caso de clase.</li>
            <li>Constancia con código verificable que cualquiera puede validar en línea.</li>
            <li>Un portafolio público con lo que hiciste y para quién.</li>
            <li>Acompañamiento de un docente durante todo el microproyecto.</li>
          </ul>
          <a class="btn btn--primary btn--block mt-sm" href="#/registro?rol=estudiante">Postular a un reto</a>
        </div>
      </div>

      <div class="card mt center">
        <h2>¿Te mostraron una constancia?</h2>
        <p class="muted small">Verifica en segundos si es auténtica con su código.</p>
        <a class="btn btn--dark" href="#/verificar">${C.icono('escudo', 18)} Verificar una constancia</a>
      </div>
    `;
  }

  /* ---------------- Ingresar ---------------- */
  Vistas.ingresar = function (p, q) {
    if (Auth.autenticado()) { setTimeout(function () { Router.go('#/'); }, 0); return h`<p>Redirigiendo…</p>`; }
    var cuentas = Auth.cuentasDemo();
    return h`
      <div style="max-width:820px;margin:0 auto">
        ${C.pageHead('Ingresar a Talent Lab', 'Usa una cuenta de demostración o entra con tu correo.')}
        <div class="split">
          <div class="card">
            <h2 style="font-size:1.05rem">Entrar con mi cuenta</h2>
            <form data-action="auth:login">
              <input type="hidden" name="next" value="${q.next || '/'}">
              ${C.campo({ name: 'email', label: 'Correo', tipo: 'email', required: true, placeholder: 'nombre@upn.demo' })}
              ${C.campo({ name: 'pass', label: 'Contraseña', tipo: 'password', required: true, placeholder: '••••••••' })}
              <button class="btn btn--primary btn--block" type="submit">Ingresar</button>
            </form>
            <p class="small muted mt-sm mb0">¿No tienes cuenta? <a href="#/registro">Créala aquí</a>.</p>
          </div>
          <div class="card">
            <h2 style="font-size:1.05rem">Cuentas de demostración</h2>
            <p class="small muted">Un clic y entras. Cada una muestra el sistema desde un rol distinto.</p>
            <div class="demogrid">
              ${cuentas.map(function (c) {
                return h`<button class="demobtn" data-action="auth:demo" data-id="${c.user.id}">
                  ${C.avatar(c.user)}
                  <span style="min-width:0">
                    <b>${c.user.rol === 'empresa' ? (c.user.razonSocial || c.user.nombre) : c.user.nombre}</b>
                    <span>${CFG.ROLES[c.user.rol].icono} ${c.desc}</span>
                  </span>
                </button>`;
              })}
            </div>
            <p class="tiny muted mt-sm mb0">Contraseña de todas las cuentas demo: <code>demo1234</code></p>
          </div>
        </div>
      </div>`;
  };

  /* ---------------- Registro ---------------- */
  Vistas.registro = function (p, q) {
    var rol = q.rol === 'empresa' ? 'empresa' : (q.rol === 'estudiante' ? 'estudiante' : '');
    if (!rol) {
      return h`<div style="max-width:720px;margin:0 auto">
        ${C.pageHead('Crear una cuenta', '¿Desde dónde vas a participar en Talent Lab?')}
        <div class="grid grid--2">
          <a class="card card--link" href="#/registro?rol=estudiante">
            <div class="empty__ico">🎓</div><h3>Soy estudiante UPN</h3>
            <p class="small muted">Quiero postular a retos, ganar experiencia y obtener constancias verificables.</p>
          </a>
          <a class="card card--link" href="#/registro?rol=empresa">
            <div class="empty__ico">🏪</div><h3>Represento a una empresa</h3>
            <p class="small muted">Tengo una necesidad concreta y quiero que un equipo de estudiantes la resuelva.</p>
          </a>
        </div>
        <p class="small muted mt center">Los docentes y la coordinación reciben su acceso desde la universidad.</p>
      </div>`;
    }

    return h`<div style="max-width:720px;margin:0 auto">
      ${C.pageHead(rol === 'estudiante' ? 'Registro de estudiante' : 'Registro de empresa',
        rol === 'estudiante' ? 'Con tus datos podremos recomendarte los retos que mejor calzan contigo.'
                             : 'Con estos datos los estudiantes conocerán tu negocio.')}
      <div class="card">
        <form data-action="auth:registro">
          <input type="hidden" name="rol" value="${rol}">
          ${rol === 'estudiante' ? h`
            ${C.campo({ name: 'nombre', label: 'Nombres y apellidos', required: true, placeholder: 'Ana Torres Ramos' })}
            <div class="field-row field-row--2">
              ${C.campo({ name: 'codigoUPN', label: 'Código UPN', placeholder: 'N00123456' })}
              ${C.campo({ name: 'ciclo', label: 'Ciclo', tipo: 'number', min: 1, max: 10, valor: 5, required: true })}
            </div>
            ${C.campo({ name: 'carrera', label: 'Carrera', tipo: 'select', required: true, opciones: Object.keys(CFG.CARRERAS) })}
            <div class="field-row field-row--2">
              ${C.campo({ name: 'campus', label: 'Campus', tipo: 'select', opciones: CFG.CAMPUS })}
              ${C.campo({ name: 'horasSemana', label: 'Horas por semana disponibles', tipo: 'number', min: 4, max: 30, valor: 10 })}
            </div>
            ${C.campo({ name: 'modalidad', label: 'Modalidad de trabajo', tipo: 'select',
              opciones: Object.keys(CFG.MODALIDADES).map(function (k) { return { value: k, label: CFG.MODALIDADES[k] }; }), valor: 'hibrido' })}
          ` : h`
            ${C.campo({ name: 'razonSocial', label: 'Nombre o razón social', required: true, placeholder: 'Mi Negocio S.A.C.' })}
            ${C.campo({ name: 'nombre', label: 'Tu nombre (persona de contacto)', required: true })}
            <div class="field-row field-row--2">
              ${C.campo({ name: 'cargo', label: 'Tu cargo', placeholder: 'Dueño, administradora…' })}
              ${C.campo({ name: 'ruc', label: 'RUC', placeholder: '20123456789' })}
            </div>
            <div class="field-row field-row--2">
              ${C.campo({ name: 'sector', label: 'Rubro', placeholder: 'Panadería, ferretería, servicios…' })}
              ${C.campo({ name: 'trabajadores', label: 'N° de trabajadores', tipo: 'number', min: 1, valor: 5 })}
            </div>
            ${C.campo({ name: 'distrito', label: 'Distrito y ciudad', placeholder: 'Trujillo' })}
            ${C.campo({ name: 'descripcion', label: 'Cuéntanos de tu negocio', tipo: 'textarea', rows: 3,
              placeholder: '¿A qué se dedica? ¿Desde cuándo? ¿Quiénes son sus clientes?' })}
          `}
          <hr>
          ${C.campo({ name: 'email', label: 'Correo', tipo: 'email', required: true })}
          ${C.campo({ name: 'pass', label: 'Contraseña', tipo: 'password', required: true, ayuda: 'Mínimo 6 caracteres.' })}
          <button class="btn btn--primary btn--block btn--lg" type="submit">Crear mi cuenta</button>
        </form>
      </div>
      <p class="small muted mt center">¿Ya tienes cuenta? <a href="#/ingresar">Ingresa aquí</a>.</p>
    </div>`;
  };

  /* ---------------- Verificador público ---------------- */
  Vistas.verificar = function (p, q) {
    var codigo = p.codigo || q.codigo || '';
    var res = codigo ? M.verificar(codigo) : null;
    return h`<div style="max-width:720px;margin:0 auto">
      ${C.pageHead('Verificar una constancia', 'Ingresa el código impreso en la constancia para comprobar su autenticidad.')}
      <div class="card">
        <form data-action="cert:verificar">
          <div class="searchbar" style="margin-bottom:0">
            <input class="input" name="codigo" value="${codigo}" placeholder="UTL-2026-XXXX-XXXX"
              style="text-transform:uppercase;font-family:ui-monospace,Menlo,monospace;letter-spacing:.06em" required>
            <button class="btn btn--primary" type="submit">Verificar</button>
          </div>
        </form>
      </div>

      ${!res ? '' : (!res.encontrada
        ? h`<div class="mt">${C.aviso('danger', '❌', raw('No encontramos ninguna constancia con el código <b>' + U.esc(codigo) + '</b>. Revisa que esté bien escrito.'))}</div>`
        : resultadoVerificacion(res))}

      ${!codigo ? h`<div class="card mt">
        <h3>¿Qué garantiza esta verificación?</h3>
        <ul class="small muted">
          <li>Que el estudiante efectivamente participó en el microproyecto.</li>
          <li>Que el trabajo fue supervisado por un docente de la UPN.</li>
          <li>Que la empresa recibió el entregable y evaluó el resultado.</li>
        </ul>
        <p class="small muted mb0">Prueba con un código real de la demo: <code>UTL-2026-9F4K-2QMD</code></p>
      </div>` : ''}
    </div>`;
  };

  function resultadoVerificacion(res) {
    var c = res.constancia, s = c.snapshot;
    if (!res.vigente) {
      return h`<div class="mt">
        ${C.aviso('danger', '⚠️', raw('Esta constancia fue <b>anulada</b> por la coordinación el ' + U.esc(U.fecha(c.anuladaAt)) + '.'))}
        <div class="card mt"><p class="small mb0"><b>Motivo:</b> ${c.motivoAnulacion || '—'}</p></div>
      </div>`;
    }
    return h`<div class="mt">
      ${C.aviso('ok', '✅', 'Constancia auténtica y vigente.')}
      <div class="card mt">
        <div class="card__head">
          ${C.avatar(M.usuario(c.estudianteId), 'avatar--lg')}
          <div class="hcol">
            <h2 style="margin:0">${s.estudiante}</h2>
            <p class="small muted mb0">${s.carrera} · Código ${s.codigoUPN}</p>
          </div>
        </div>
        <dl class="cert__meta" style="background:var(--surface-2)">
          <div><dt>Reto resuelto</dt><dd>${s.reto}</dd></div>
          <div><dt>Empresa</dt><dd>${s.empresa}</dd></div>
          <div><dt>Periodo</dt><dd>${U.fecha(s.inicio)} — ${U.fecha(s.fin)}</dd></div>
          <div><dt>Dedicación</dt><dd>${s.horas} horas</dd></div>
          <div><dt>Rol</dt><dd>${s.rol}</dd></div>
          <div><dt>Docente mentor</dt><dd>${s.mentor}</dd></div>
          <div><dt>Evaluación</dt><dd>${s.puntaje}/100</dd></div>
          <div><dt>Emitida</dt><dd>${U.fecha(c.emitidaAt)}</dd></div>
        </dl>
        <p class="small"><b>Competencias acreditadas:</b></p>
        <div class="chips">${(s.habilidades || []).map(function (x) { return h`<span class="chip chip--brand">${x}</span>`; })}</div>
        <div class="card__foot">
          <code class="tiny">${c.codigo}</code>
          <a class="btn btn--ghost btn--sm" href="#/constancia/${c.codigo}">Ver constancia completa</a>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- Notificaciones ---------------- */
  Vistas.notificaciones = function () {
    var u = Auth.actual();
    var lista = M.notificacionesDe(u.id);
    return h`<div style="max-width:760px;margin:0 auto">
      ${C.pageHead('Notificaciones', lista.length ? lista.filter(function (n) { return !n.leida; }).length + ' sin leer' : 'Aquí llegan los avisos del programa',
        lista.length ? h`<button class="btn btn--ghost btn--sm" data-action="notif:leer-todas">Marcar todas como leídas</button>` : null)}
      ${lista.length ? h`<div class="panel"><ul class="list">
        ${lista.map(function (n) {
          return h`<li><a class="listitem" href="${n.link || '#/'}" data-action="notif:abrir" data-id="${n.id}">
            <span class="avatar avatar--sm" style="${raw(n.leida ? 'background:var(--surface-2)' : '')}" aria-hidden="true">${iconoNotif(n.tipo)}</span>
            <span class="listitem__main">
              <span class="listitem__t">${n.titulo}${!n.leida ? raw(' <span class="chip chip--brand tiny">Nuevo</span>') : ''}</span>
              <span class="listitem__s">${n.cuerpo}</span>
            </span>
            <span class="listitem__end tiny muted">${U.haceTiempo(n.at)}</span>
          </a></li>`;
        })}
      </ul></div>` : C.vacio('🔔', 'Sin notificaciones', 'Cuando haya novedades en tus retos o proyectos, aparecerán aquí.')}
    </div>`;
  };
  function iconoNotif(t) {
    return { reto: '📋', postulacion: '📨', seleccion: '🎯', proyecto: '🚀', hito: '✅', evaluacion: '⭐', constancia: '🏅' }[t] || '🔔';
  }

  /* ---------------- Ayuda ---------------- */
  Vistas.ayuda = function () {
    return h`<div style="max-width:860px;margin:0 auto">
      ${C.pageHead('Cómo funciona UPN Talent Lab', 'El recorrido completo, explicado por rol.')}
      <div class="steps">
        <div class="step"><h3>1. La empresa plantea</h3><p>Describe su necesidad en lenguaje simple, indica qué espera recibir y cuántas semanas puede acompañar.</p></div>
        <div class="step"><h3>2. La UPN revisa</h3><p>La coordinación verifica que el reto sea realizable en 2 a 4 semanas y lo publica, o pide ajustes.</p></div>
        <div class="step"><h3>3. Los estudiantes postulan</h3><p>Ven su porcentaje de compatibilidad y postulan explicando por qué quieren participar.</p></div>
        <div class="step"><h3>4. Se conforma el equipo</h3><p>La coordinación usa el ranking de compatibilidad, arma un equipo que cubra todas las habilidades y asigna un docente mentor.</p></div>
      </div>
      <div class="steps mt">
        <div class="step"><h3>5. Ejecución</h3><p>Hitos semanales, bitácora de horas y avances, y revisión del mentor en cada entrega parcial.</p></div>
        <div class="step"><h3>6. Entrega final</h3><p>El equipo entrega el resultado con sus enlaces y documentación.</p></div>
        <div class="step"><h3>7. Evaluación doble</h3><p>El mentor evalúa el proceso y la empresa el resultado, ambos con la misma rúbrica de 5 criterios.</p></div>
        <div class="step"><h3>8. Constancia</h3><p>Con ambas aprobaciones, la coordinación emite la constancia con código verificable y se suma al portafolio.</p></div>
      </div>

      <h2 class="mt">Preguntas frecuentes</h2>
      <div class="stack">
        ${[
          { q: '¿Cuánto cuesta para la empresa?', a: 'Nada. Es parte de la vinculación de la UPN con su entorno. La empresa aporta su tiempo para las reuniones y la información que el equipo necesita.' },
          { q: '¿Cuántas horas dedica el estudiante?', a: 'Entre 8 y 12 horas por semana según el reto, durante 2 a 4 semanas. Cada reto lo indica antes de postular.' },
          { q: '¿Puedo tener dos microproyectos a la vez?', a: 'No. Solo se permite uno activo por estudiante, para asegurar que el compromiso con la empresa se cumpla.' },
          { q: '¿Qué pasa si la entrega no cumple?', a: 'El mentor o la empresa pueden observarla. El proyecto vuelve a ejecución y el equipo corrige antes de volver a enviarla.' },
          { q: '¿La constancia sirve para mi CV?', a: 'Sí. Incluye la empresa, el periodo, las horas, las competencias acreditadas y un código que cualquier reclutador puede verificar en línea.' },
          { q: '¿Quién es el docente mentor?', a: 'Un docente UPN del área del reto. Revisa cada hito, orienta al equipo y responde por la calidad académica del trabajo.' }
        ].map(function (f) {
          return h`<div class="card"><h3 style="margin-bottom:.25rem">${f.q}</h3><p class="small muted mb0">${f.a}</p></div>`;
        })}
      </div>
    </div>`;
  };

  /* ---------------- Sistema ---------------- */
  Vistas.noEncontrado = function (path) {
    return h`${C.vacio('🧭', 'No encontramos esa página',
      'La dirección ' + path + ' no existe o cambió de lugar.',
      h`<a class="btn btn--primary" href="#/">Ir al inicio</a>`, 'h1')}`;
  };
  Vistas.sinPermiso = function (roles) {
    var u = Auth.actual();
    return h`${C.vacio('🔒', 'Esta sección no es para tu rol',
      'Tu cuenta es de ' + (u ? CFG.ROLES[u.rol].label : 'invitado') + ' y esta pantalla es de ' +
      roles.map(function (r) { return CFG.ROLES[r] ? CFG.ROLES[r].label : r; }).join(' o ') + '.',
      h`<a class="btn btn--primary" href="#/">Volver a mi panel</a>`, 'h1')}`;
  };
})();
