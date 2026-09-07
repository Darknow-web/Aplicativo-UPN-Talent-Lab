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
            <h2 style="font-size:1.05rem">Probar sin registrarse</h2>
            <p class="small muted">Un clic y entras. Cada cuenta tiene una acción del ciclo lista para probar;
              entre todas se recorre el programa completo.</p>
            <div class="demogrid">
              ${cuentas.map(function (c) {
                return h`<button class="demobtn" data-action="auth:demo" data-id="${c.user.id}">
                  ${C.avatar(c.user)}
                  <span style="min-width:0">
                    <b>${c.accion}</b>
                    <span>${CFG.ROLES[c.user.rol].icono} ${c.user.rol === 'empresa' ? (c.user.razonSocial || c.user.nombre) : c.user.nombre}</span>
                    <span class="tiny">${c.detalle}</span>
                  </span>
                </button>`;
              })}
            </div>
            <p class="tiny muted mt-sm mb0">Contraseña de todas las cuentas demo: <code>demo1234</code></p>
          </div>
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

  /* ---------------- Guía de uso ---------------- */
  var GUIA_ROLES = [
    {
      rol: 'empresa', titulo: 'Si eres una empresa',
      resumen: 'Planteas una necesidad concreta y recibes un resultado, sin costo y sin contratar a nadie.',
      pasos: [
        ['Publicar un reto', 'Describe tu problema en lenguaje simple, qué te gustaría recibir y cuántas semanas puedes acompañar. Un asistente de 3 pasos te guía.'],
        ['Esperar la revisión', 'La coordinación de la UPN revisa que sea realizable en 2 a 4 semanas. Puede publicarlo o devolvértelo con observaciones para ajustarlo.'],
        ['Recibir tu equipo', 'La universidad elige a los estudiantes y les asigna un docente. Te avisamos cuándo empieza.'],
        ['Seguir el avance', 'Ves los hitos semana a semana y la bitácora del equipo, sin tener que estar pidiendo reportes.'],
        ['Evaluar el resultado', 'Cuando llega la entrega final, la calificas con 5 criterios y decides si la apruebas o pides correcciones.']
      ],
      donde: ['Mi panel', 'Mis retos', 'Publicar reto', 'Mis proyectos', 'Talento UPN']
    },
    {
      rol: 'estudiante', titulo: 'Si eres estudiante UPN',
      resumen: 'Ganas experiencia real con una empresa y te llevas una constancia que cualquiera puede verificar.',
      pasos: [
        ['Completar tu perfil', 'Registra tus habilidades con su nivel del 1 al 5. De eso depende qué retos te recomendamos y a cuáles puedes postular.'],
        ['Explorar oportunidades', 'Cada reto te muestra tu porcentaje de compatibilidad y por qué: qué habilidades cubres, tu disponibilidad, tu carrera.'],
        ['Postular', 'Explicas en pocas líneas por qué quieres participar. Solo puedes tener un microproyecto a la vez.'],
        ['Trabajar el proyecto', 'Entregas un hito por semana con el enlace a tu evidencia, y registras tus horas y avances en la bitácora.'],
        ['Entregar y cerrar', 'Envías la entrega final. Cuando el mentor y la empresa aprueban, recibes tu constancia y se suma a tu portafolio.']
      ],
      donde: ['Mi panel', 'Oportunidades', 'Mis postulaciones', 'Mis proyectos', 'Constancias', 'Mi perfil y portafolio']
    },
    {
      rol: 'mentor', titulo: 'Si eres docente o mentor',
      resumen: 'Acompañas al equipo y respondes por la calidad académica del trabajo.',
      pasos: [
        ['Recibir la asignación', 'La coordinación te asigna según tu especialidad y tu carga actual de proyectos.'],
        ['Revisar cada hito', 'El equipo entrega semanalmente. Apruebas o devuelves con un comentario concreto de qué corregir.'],
        ['Acompañar en la bitácora', 'Dejas decisiones y orientaciones escritas, que quedan como respaldo del trabajo.'],
        ['Evaluar la entrega final', 'Calificas con la rúbrica de 5 criterios y decides si el proyecto queda aprobado.']
      ],
      donde: ['Mi panel', 'Proyectos que acompaño', 'Estudiantes', 'Retos del programa']
    },
    {
      rol: 'coordinador', titulo: 'Si eres de la coordinación UPN',
      resumen: 'Controlas la calidad del programa de punta a punta.',
      pasos: [
        ['Revisar los retos', 'Publicas, devuelves con observaciones o rechazas lo que las empresas proponen.'],
        ['Cerrar postulaciones', 'Cuando hay suficientes candidatos, cierras el reto y pasas a selección.'],
        ['Conformar el equipo', 'Ves el ranking de compatibilidad con el detalle de cada puntaje, y el sistema te sugiere un equipo que cubra todas las habilidades del reto.'],
        ['Asignar al docente', 'Con su afinidad al área y su carga actual a la vista.'],
        ['Emitir constancias', 'Cuando mentor y empresa aprobaron, generas las constancias con código verificable y el proyecto queda cerrado.']
      ],
      donde: ['Panel de coordinación', 'Retos', 'Proyectos', 'Talento', 'Constancias', 'Reportes']
    }
  ];

  Vistas.ayuda = function (p, q) {
    var rolSel = q.rol || (Auth.actual() ? Auth.actual().rol : 'empresa');
    var bloque = GUIA_ROLES.filter(function (g) { return g.rol === rolSel; })[0] || GUIA_ROLES[0];

    return h`<div style="max-width:900px;margin:0 auto">
      ${C.pageHead('Guía de uso', 'Qué hay dentro de la aplicación y cómo se usa, explicado por rol.')}

      <section class="card card--accent">
        <h2 style="font-size:1.05rem;margin-bottom:.3rem">En una frase</h2>
        <p class="mb0">Una empresa plantea una necesidad concreta, la UPN elige a los estudiantes según sus
          habilidades y en <b>2 a 4 semanas</b>, con un docente acompañando, el reto queda resuelto:
          la empresa recibe el resultado y el estudiante una <b>constancia verificable</b> para su CV.</p>
      </section>

      <h2 class="mt">El ciclo completo</h2>
      <p class="muted small">Ocho pasos, del problema a la constancia.</p>
      <ol class="ciclo">
        ${[
          ['La empresa plantea', 'Describe su necesidad y la envía a la UPN.'],
          ['La UPN revisa', 'Publica el reto, o lo devuelve con observaciones.'],
          ['Los estudiantes postulan', 'Con su porcentaje de compatibilidad a la vista.'],
          ['Se arma el equipo', 'Por ranking de habilidades, cubriendo todo lo que el reto pide.'],
          ['Se asigna un mentor', 'Un docente del área, con cupo disponible.'],
          ['Se ejecuta', 'Hitos semanales, bitácora y revisión del mentor.'],
          ['Se evalúa', 'Mentor y empresa califican con la misma rúbrica.'],
          ['Se emite la constancia', 'Con código único que cualquiera puede verificar.']
        ].map(function (x) {
          return h`<li><b>${x[0]}</b><span>${x[1]}</span></li>`;
        })}
      </ol>

      <h2 class="mt">Según tu rol</h2>
      <div class="tabs">
        ${GUIA_ROLES.map(function (g) {
          return h`<a class="tab ${rolSel === g.rol ? 'is-on' : ''}" href="#/ayuda?rol=${g.rol}">
            ${CFG.ROLES[g.rol].icono} ${CFG.ROLES[g.rol].label}</a>`;
        })}
      </div>

      <div class="card">
        <h3 style="margin-bottom:.2rem">${bloque.titulo}</h3>
        <p class="small muted">${bloque.resumen}</p>
        <ol class="ciclo ciclo--simple mt-sm">
          ${bloque.pasos.map(function (x) { return h`<li><b>${x[0]}</b><span>${x[1]}</span></li>`; })}
        </ol>
        <p class="small mt"><b>Dónde lo encuentras:</b></p>
        <div class="chips">${bloque.donde.map(function (d) { return h`<span class="chip chip--brand">${d}</span>`; })}</div>
      </div>

      <h2 class="mt">Probar la demostración</h2>
      <p class="muted small">Cada cuenta entra con una acción del ciclo esperando. Recorriéndolas en
        orden se ve el programa completo, de principio a fin.</p>
      <div class="panel"><ul class="list">
        ${Auth.cuentasDemo().map(function (c, i) {
          return h`<li><div class="listitem">
            <span class="avatar avatar--sm" aria-hidden="true">${i + 1}</span>
            <span class="listitem__main">
              <span class="listitem__t">${c.accion}</span>
              <span class="listitem__s">${CFG.ROLES[c.user.rol].icono} ${c.detalle}</span>
            </span>
            <span class="listitem__end"><button class="btn btn--ghost btn--sm" data-action="auth:demo" data-id="${c.user.id}">Entrar</button></span>
          </div></li>`;
        })}
      </ul></div>

      <h2 class="mt">Preguntas frecuentes</h2>
      <div class="stack">
        ${[
          { q: '¿Cuánto le cuesta a la empresa?', a: 'Nada. Es parte de la vinculación de la UPN con su entorno. La empresa aporta su tiempo para las reuniones y la información que el equipo necesita.' },
          { q: '¿Cuántas horas dedica el estudiante?', a: 'Entre 8 y 12 horas por semana según el reto, durante 2 a 4 semanas. Cada reto lo indica antes de postular.' },
          { q: '¿Puedo tener dos microproyectos a la vez?', a: 'No. Solo uno activo por estudiante, para asegurar que el compromiso con la empresa se cumpla.' },
          { q: '¿Cómo se elige a los estudiantes?', a: 'Por un puntaje de 0 a 100 que pesa habilidades, nivel declarado, disponibilidad, afinidad con la carrera, ciclo y desempeño previo. El puntaje siempre se muestra desglosado: nadie queda seleccionado sin que se vea por qué.' },
          { q: '¿Qué pasa si la entrega no cumple?', a: 'El mentor o la empresa pueden observarla. El proyecto vuelve a ejecución y el equipo corrige antes de volver a enviarla.' },
          { q: '¿La constancia sirve para mi CV?', a: 'Sí. Incluye la empresa, el periodo, las horas, las competencias acreditadas y un código que cualquier reclutador puede verificar en línea, sin cuenta.' },
          { q: '¿Los datos son reales?', a: 'No. Es una demostración con empresas y estudiantes de ejemplo, y todo se guarda solo en tu navegador. Puedes crear, modificar y borrar sin miedo: en Ajustes se restauran los datos originales.' }
        ].map(function (f) {
          return h`<div class="card"><h3 style="margin-bottom:.25rem">${f.q}</h3><p class="small muted mb0">${f.a}</p></div>`;
        })}
      </div>

      <div class="card mt center">
        <h3>¿Listo para probarlo?</h3>
        <a class="btn btn--primary btn--lg" href="#/ingresar">Entrar con una cuenta demo</a>
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
