/* 17-views-cuenta.js — Perfil propio, perfil público de otros y ajustes */
window.Vistas = window.Vistas || {};
(function () {
  var h = U.html, raw = U.raw;

  Vistas.perfil = function (p) {
    var u = Auth.actual();
    var id = p.id || (u ? u.id : null);
    var persona = id ? M.usuario(id) : null;
    if (!persona) return Vistas.noEncontrado('#/perfil/' + (p.id || ''));
    var propio = u && u.id === persona.id;
    if (!propio) return perfilPublico(persona);
    if (persona.rol === 'estudiante') return perfilEstudiante(persona);
    if (persona.rol === 'empresa') return perfilEmpresa(persona);
    return perfilSimple(persona);
  };

  /* ---------- Estudiante (editable) ---------- */
  function perfilEstudiante(u) {
    var mapa = {};
    (u.habilidades || []).forEach(function (s) { mapa[s.skill] = s; });
    var porCat = U.groupBy(Object.keys(CFG.HABILIDADES), function (k) { return CFG.HABILIDADES[k].categoria; });
    var pendientes = (u.habilidades || []).filter(function (s) {
      return s.nivel >= 2 && M.estadoHabilidad(s) === 'declarado';
    });
    var pruebas = M.pruebasDe(u.id).filter(function (pr) { return pr.estado === 'solicitada' || pr.estado === 'observada'; });

    return h`<div style="max-width:860px;margin:0 auto">
      ${C.pageHead('Mi perfil', 'Mientras más completo, mejores recomendaciones recibirás.',
        u.slug ? h`<a class="btn btn--ghost" href="#/portafolio/${u.slug}">Ver mi portafolio público</a>` : null)}

      ${pruebas.length ? h`<div style="margin-bottom:1rem">${C.aviso('warn', '📝',
        raw('Tienes ' + pruebas.length + ' ' + U.plural(pruebas.length, 'prueba') + ' práctica pendiente. ' +
        '<a href="#/postulaciones"><b>Ver de qué se trata</b></a>'))}</div>` : ''}

      <form class="stack" data-action="perfil:guardar">
        <div class="card">
          <div class="card__head">${C.avatar(u, 'avatar--xl')}
            <div class="hcol"><h2 style="margin:0">${u.nombre}</h2>
              <p class="small muted mb0">${u.codigoUPN} · ${u.email}</p></div></div>
          ${C.campo({ name: 'nombre', label: 'Nombres y apellidos', required: true, valor: u.nombre })}
          ${C.campo({ name: 'bio', label: 'Presentación breve', tipo: 'textarea', rows: 3, valor: u.bio,
            placeholder: '¿Qué te interesa? ¿En qué te sientes fuerte?', ayuda: 'Esto lo ven las empresas y aparece en tu portafolio.' })}
          <div class="field-row field-row--2">
            ${C.campo({ name: 'carrera', label: 'Carrera', tipo: 'select', valor: u.carrera, opciones: Object.keys(CFG.CARRERAS) })}
            ${C.campo({ name: 'ciclo', label: 'Ciclo', tipo: 'number', min: 1, max: 10, valor: u.ciclo })}
          </div>
          <div class="field-row field-row--2">
            ${C.campo({ name: 'campus', label: 'Campus', tipo: 'select', valor: u.campus, opciones: CFG.CAMPUS })}
            ${C.campo({ name: 'distrito', label: 'Distrito donde vives', valor: u.distrito })}
          </div>
          <div class="field-row field-row--2">
            ${C.campo({ name: 'horasSemana', label: 'Horas por semana que puedes dedicar', tipo: 'number', min: 4, max: 30, valor: u.horasSemana })}
            ${C.campo({ name: 'modalidad', label: 'Modalidad', tipo: 'select', valor: u.modalidad,
              opciones: Object.keys(CFG.MODALIDADES).map(function (k) { return { value: k, label: CFG.MODALIDADES[k] }; }) })}
          </div>
          <label class="checkline ${u.portafolioPublico ? 'checkline--on' : ''}">
            <input type="checkbox" name="portafolioPublico" value="true" ${raw(u.portafolioPublico ? 'checked' : '')}>
            <span>Mostrar mi portafolio públicamente (para compartirlo en mi CV)</span>
          </label>
        </div>

        <div class="card">
          <h2 style="font-size:1.05rem">Mis habilidades</h2>
          <p class="small muted">El nivel no es cuánto crees que sabes: es qué puedes sostener con algo.
            Declarar Intermedio o Avanzado sin respaldo no te bloquea, pero coordinación lo verá al
            compararte, y si la habilidad es indispensable para el reto te pediremos una prueba corta.</p>

          <div class="niveles-ref">
            ${[1, 2, 3].map(function (n) {
              return h`<div class="niveles-ref__i">
                <b>${CFG.NIVELES[n].label}</b>
                <span>${CFG.NIVELES[n].afirma}</span>
                <em>${CFG.NIVELES[n].respaldo}</em>
              </div>`;
            })}
          </div>

          ${pendientes.length ? h`<div class="mt-sm">${C.aviso('warn', '⚠️',
            raw('Sin respaldo: <b>' + U.esc(pendientes.map(function (x) { return M.habilidadNombre(x.skill); }).join(', ')) +
            '</b>. Agrega un certificado o un trabajo tuyo más abajo.'))}</div>` : ''}

          ${Object.keys(porCat).map(function (cat) {
            return h`<div class="mt">
              <p class="eyebrow">${M.categoria(cat).icono} ${M.categoria(cat).label}</p>
              <div class="stack" style="gap:.5rem">
                ${porCat[cat].map(function (k) {
                  var hab = mapa[k];
                  var nivel = hab ? hab.nivel : 0;
                  var estado = hab ? M.estadoHabilidad(hab) : 'declarado';
                  return h`<div class="habrow ${nivel >= 2 ? 'habrow--alto' : ''}">
                    <div class="habrow__top">
                      <label class="habrow__n" for="hab_${k}">${CFG.HABILIDADES[k].nombre}</label>
                      ${nivel && estado !== 'declarado'
                        ? h`<span class="chip ${CFG.RESPALDOS[estado].chip} tiny">${CFG.RESPALDOS[estado].label}${estado === 'verificado' ? ' ✓' : ''}</span>`
                        : ''}
                      <select class="select habrow__s" id="hab_${k}" name="hab_${k}"
                        data-action="perfil:nivel" data-skill="${k}">
                        ${[['', 'No la tengo'], ['1', 'Básico'], ['2', 'Intermedio'], ['3', 'Avanzado']].map(function (o) {
                          return raw('<option value="' + o[0] + '"' + (String(nivel || '') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>');
                        })}
                      </select>
                    </div>

                    <div class="habrow__resp" id="resp_${k}" ${raw(nivel >= 2 ? '' : 'hidden')}>
                      ${estado === 'verificado'
                        ? h`<p class="tiny mb0" style="color:var(--ok)">Verificada por ${M.nombre(hab.verificadoPorId)}${hab.verificadoVia === 'prueba' ? ' tras tu prueba práctica' : ' en un microproyecto'}. Ya no necesitas sustentarla.</p>`
                        : h`
                        <div class="field-row field-row--2" style="gap:.5rem">
                          <div class="field" style="margin:0">
                            <label class="tiny" for="tipo_${k}">¿Con qué lo sustentas?</label>
                            <select class="select" id="tipo_${k}" name="tipo_${k}">
                              ${[['ninguno', 'Todavía con nada'], ['certificado', 'Un certificado'], ['trabajo', 'Un trabajo mío']].map(function (o) {
                                return raw('<option value="' + o[0] + '"' + ((hab && hab.respaldoTipo) === o[0] ? ' selected' : '') + '>' + o[1] + '</option>');
                              })}
                            </select>
                          </div>
                          <div class="field" style="margin:0">
                            <label class="tiny" for="det_${k}">Nombre del certificado o del trabajo</label>
                            <input class="input" id="det_${k}" name="det_${k}" data-action="perfil:certificado" data-skill="${k}"
                              list="lista-certificados" placeholder="Ej.: Microsoft Office Specialist: Excel Associate"
                              value="${hab && hab.respaldoDetalle ? hab.respaldoDetalle : ''}">
                          </div>
                        </div>
                        <input class="input mt-sm" name="url_${k}" placeholder="Enlace al certificado o al trabajo (opcional)"
                          value="${hab && hab.respaldoUrl ? hab.respaldoUrl : ''}">
                        <p class="tiny muted mb0" id="sug_${k}"></p>`}
                    </div>
                  </div>`;
                })}
              </div>
            </div>`;
          })}

          <datalist id="lista-certificados">
            ${CFG.CERTIFICADOS.map(function (c) { return raw('<option value="' + U.esc(c.nombre) + '">'); })}
          </datalist>
        </div>

        <button class="btn btn--primary btn--lg" type="submit">Guardar cambios</button>
      </form>

      ${(u.portafolio || []).length ? h`<div class="card mt">
        <h2 style="font-size:1.05rem">Mi portafolio</h2>
        <p class="small muted">Se llena solo con cada microproyecto cerrado. Puedes editar el relato.</p>
        ${(u.portafolio || []).map(function (i) {
          return h`<form class="card mt-sm" data-action="portafolio:guardar">
            <input type="hidden" name="itemId" value="${i.id}">
            <h3 style="margin-bottom:.1rem">${i.titulo}</h3>
            <p class="tiny muted">${i.empresa} · ${i.rol}</p>
            ${C.campo({ name: 'relato', label: 'Cómo lo cuentas en tu CV', tipo: 'textarea', rows: 3, valor: i.relato })}
            <label class="checkline ${i.visible ? 'checkline--on' : ''}">
              <input type="checkbox" name="visible" value="true" ${raw(i.visible ? 'checked' : '')}>
              <span>Mostrar en mi portafolio público</span>
            </label>
            <button class="btn btn--ghost btn--sm mt-sm" type="submit">Guardar</button>
          </form>`;
        })}
      </div>` : ''}

      ${bloqueSesion()}
    </div>`;
  }

  /* ---------- Empresa (editable) ---------- */
  function perfilEmpresa(u) {
    return h`<div style="max-width:760px;margin:0 auto">
      ${C.pageHead('Datos de mi empresa', 'Los estudiantes ven esta información al mirar tus retos.')}
      <form class="card" data-action="perfil:guardar">
        <div class="card__head">${C.avatar(u, 'avatar--xl')}
          <div class="hcol"><h2 style="margin:0">${u.razonSocial || u.nombre}</h2>
            <p class="small muted mb0">${u.email}</p></div>
          ${u.verificada ? h`<span class="chip chip--ok">Verificada</span>` : h`<span class="chip chip--warn">Por verificar</span>`}</div>
        ${C.campo({ name: 'razonSocial', label: 'Nombre o razón social', required: true, valor: u.razonSocial })}
        <div class="field-row field-row--2">
          ${C.campo({ name: 'nombre', label: 'Persona de contacto', required: true, valor: u.nombre })}
          ${C.campo({ name: 'cargo', label: 'Cargo', valor: u.cargo })}
        </div>
        <div class="field-row field-row--2">
          ${C.campo({ name: 'ruc', label: 'RUC', valor: u.ruc })}
          ${C.campo({ name: 'trabajadores', label: 'N° de trabajadores', tipo: 'number', min: 1, valor: u.trabajadores })}
        </div>
        <div class="field-row field-row--2">
          ${C.campo({ name: 'sector', label: 'Rubro', valor: u.sector })}
          ${C.campo({ name: 'distrito', label: 'Distrito y ciudad', valor: u.distrito })}
        </div>
        ${C.campo({ name: 'web', label: 'Página web o red social', valor: u.web, placeholder: 'minegocio.pe' })}
        ${C.campo({ name: 'descripcion', label: 'Sobre el negocio', tipo: 'textarea', rows: 4, valor: u.descripcion })}
        <button class="btn btn--primary btn--block" type="submit">Guardar cambios</button>
      </form>
      ${bloqueSesion()}
    </div>`;
  }

  /* ---------- Mentor y coordinación ---------- */
  function perfilSimple(u) {
    return h`<div style="max-width:760px;margin:0 auto">
      ${C.pageHead('Mi perfil', CFG.ROLES[u.rol].label)}
      <form class="card" data-action="perfil:guardar">
        <div class="card__head">${C.avatar(u, 'avatar--xl')}
          <div class="hcol"><h2 style="margin:0">${u.nombre}</h2>
            <p class="small muted mb0">${u.email}</p></div>${C.chipRol(u.rol)}</div>
        ${C.campo({ name: 'nombre', label: 'Nombre completo', required: true, valor: u.nombre })}
        ${u.rol === 'mentor' ? h`
          <div class="field-row field-row--2">
            ${C.campo({ name: 'facultad', label: 'Facultad', valor: u.facultad })}
            ${C.campo({ name: 'maxProyectos', label: 'Máx. proyectos simultáneos', tipo: 'number', min: 1, max: 6, valor: u.maxProyectos })}
          </div>
          ${C.campo({ name: 'especialidad', label: 'Especialidad', valor: u.especialidad })}
          ${C.campo({ name: 'bio', label: 'Presentación', tipo: 'textarea', rows: 3, valor: u.bio })}
          <div class="field">
            <span class="field__label">Áreas en las que puedo acompañar</span>
            ${C.checkHabilidades('habilidades', u.habilidades || [])}
          </div>` : h`
          <div class="field-row field-row--2">
            ${C.campo({ name: 'area', label: 'Área', valor: u.area })}
            ${C.campo({ name: 'campus', label: 'Campus', tipo: 'select', valor: u.campus, opciones: CFG.CAMPUS })}
          </div>
          ${C.campo({ name: 'cargo', label: 'Cargo', valor: u.cargo })}`}
        <button class="btn btn--primary btn--block" type="submit">Guardar cambios</button>
      </form>
      ${bloqueSesion()}
    </div>`;
  }

  /* ---------- Perfil visto por otros ---------- */
  function perfilPublico(persona) {
    if (persona.rol === 'empresa') {
      var retos = Store.where('retos', function (r) {
        return r.empresaId === persona.id && ['publicado', 'en_seleccion', 'en_ejecucion', 'finalizado'].indexOf(r.estado) !== -1;
      });
      return h`<div style="max-width:860px;margin:0 auto">
        ${C.volver('#/retos')}
        <div class="card mt-sm">
          <div class="card__head">${C.avatar(persona, 'avatar--xl')}
            <div class="hcol">
              <h1 style="font-size:1.4rem;margin:0">${persona.razonSocial || persona.nombre}</h1>
              <p class="small muted mb0">${persona.sector || ''} · ${persona.distrito || ''}</p>
            </div>
            ${persona.verificada ? h`<span class="chip chip--ok">Empresa verificada</span>` : ''}</div>
          <p>${persona.descripcion || ''}</p>
          <div class="chips">
            <span class="chip">${persona.trabajadores || '—'} trabajadores</span>
            <span class="chip">${({ micro: 'Microempresa', pequena: 'Pequeña empresa', mediana: 'Mediana empresa' })[persona.tamano] || ''}</span>
            ${persona.web ? h`<a class="chip chip--brand" href="${U.safeUrl(persona.web)}" target="_blank" rel="noopener noreferrer">${U.hostOf(persona.web)}</a>` : ''}
          </div>
        </div>
        <h2 class="mt">Retos de esta empresa</h2>
        ${retos.length ? h`<div class="grid grid--2">${retos.map(function (r) { return C.cardReto(r); })}</div>`
          : C.vacio('📋', 'Sin retos publicados', 'Esta empresa aún no tiene retos visibles.')}
      </div>`;
    }

    if (persona.rol === 'estudiante') {
      var certs = M.constanciasDe(persona.id).filter(function (c) { return c.estado === 'vigente'; });
      var rating = M.ratingEstudiante(persona.id);
      return h`<div style="max-width:860px;margin:0 auto">
        ${C.volver('#/talento')}
        <div class="card mt-sm">
          <div class="card__head">${C.avatar(persona, 'avatar--xl')}
            <div class="hcol">
              <h1 style="font-size:1.4rem;margin:0">${persona.nombre}</h1>
              <p class="small muted mb0">${persona.carrera} · Ciclo ${persona.ciclo} · ${persona.campus}</p>
            </div>
            ${M.tieneProyectoActivo(persona.id) ? h`<span class="chip chip--warn">Con proyecto activo</span>` : h`<span class="chip chip--ok">Disponible</span>`}</div>
          <p>${persona.bio || ''}</p>
          <div class="chips">
            <span class="chip">${persona.horasSemana} h/semana</span>
            <span class="chip">${CFG.MODALIDADES[persona.modalidad]}</span>
            ${rating ? h`<span class="chip chip--ok">Desempeño ${rating}/100</span>` : ''}
          </div>
        </div>

        <div class="grid grid--2 mt">
          <div class="card">
            <h2 style="font-size:1.05rem">Habilidades declaradas</h2>
            ${(persona.habilidades || []).length ? h`<ul class="list">
              ${U.sortBy(persona.habilidades || [], function (s) { return s.nivel; }, true).map(function (s) {
                return h`<li style="padding:.4rem 0">
                  <div class="row row--between">
                    <span class="small">${M.habilidadNombre(s.skill)}</span>
                    <span class="chip ${CFG.RESPALDOS[M.estadoHabilidad(s)].chip} tiny">${M.nivelLabel(s.nivel)}${M.estadoHabilidad(s) === 'verificado' ? ' ✓' : ''}</span>
                  </div>
                  ${s.respaldoDetalle ? h`<p class="tiny muted mb0">${s.respaldoDetalle}</p>` : ''}
                </li>`;
              })}</ul>` : h`<p class="small muted">Sin habilidades registradas.</p>`}
          </div>
          <div class="card">
            <h2 style="font-size:1.05rem">Experiencia acreditada</h2>
            ${certs.length ? h`<ul class="list">${certs.map(function (c) {
              return h`<li style="padding:.5rem 0">
                <p class="small mb0"><b>${U.truncar(c.snapshot.reto, 42)}</b></p>
                <p class="tiny muted mb0">${c.snapshot.empresa} · ${c.snapshot.horas} h · ${c.snapshot.puntaje}/100</p>
              </li>`;
            })}</ul>
            ${persona.portafolioPublico && persona.slug ? h`<a class="btn btn--ghost btn--sm btn--block mt-sm" href="#/portafolio/${persona.slug}">Ver portafolio completo</a>` : ''}`
              : h`<p class="small muted">Aún no ha cerrado microproyectos.</p>`}
          </div>
        </div>
      </div>`;
    }

    return h`<div style="max-width:640px;margin:0 auto">
      ${C.volver('#/')}
      <div class="card mt-sm">
        <div class="card__head">${C.avatar(persona, 'avatar--xl')}
          <div class="hcol"><h1 style="font-size:1.3rem;margin:0">${persona.nombre}</h1>
            <p class="small muted mb0">${persona.especialidad || persona.area || ''}</p></div>${C.chipRol(persona.rol)}</div>
        <p>${persona.bio || ''}</p>
        ${persona.rol === 'mentor' ? h`<div class="chips">${(persona.habilidades || []).map(function (s) {
          return h`<span class="chip chip--brand">${M.habilidadNombre(s)}</span>`; })}</div>` : ''}
      </div>
    </div>`;
  }

  function bloqueSesion() {
    return h`<div class="card mt">
      <h3>Cuenta</h3>
      <div class="btnrow">
        <a class="btn btn--ghost btn--sm" href="#/ajustes">Ajustes de la aplicación</a>
        <button class="btn btn--ghost btn--sm" data-action="auth:salir">Cerrar sesión</button>
      </div>
    </div>`;
  }

  /* ================= Ajustes ================= */
  Vistas.ajustes = function () {
    var tema = UI.temaActual();
    return h`<div style="max-width:700px;margin:0 auto">
      ${C.pageHead('Ajustes', 'Preferencias de la aplicación y datos de demostración')}

      <div class="card">
        <h3>Apariencia</h3>
        <div class="btnrow">
          ${[['auto', 'Automático'], ['claro', 'Claro'], ['oscuro', 'Oscuro']].map(function (t) {
            return h`<button class="btn ${tema === t[0] ? 'btn--primary' : 'btn--ghost'} btn--sm" data-action="ui:tema" data-tema="${t[0]}">${t[1]}</button>`;
          })}
        </div>
      </div>

      <div class="card mt">
        <h3>Datos de esta demostración</h3>
        <p class="small muted">Todo se guarda únicamente en este navegador. Nada se envía a ningún servidor.</p>
        <ul class="list small">
          <li style="padding:.4rem 0"><b>Usuarios:</b> ${Store.all('users').length}</li>
          <li style="padding:.4rem 0"><b>Retos:</b> ${Store.all('retos').length}</li>
          <li style="padding:.4rem 0"><b>Proyectos:</b> ${Store.all('proyectos').length}</li>
          <li style="padding:.4rem 0"><b>Constancias:</b> ${Store.all('constancias').length}</li>
          <li style="padding:.4rem 0"><b>Espacio usado:</b> ${Store.tamanoKb()} KB</li>
        </ul>
        <div class="btnrow">
          <button class="btn btn--ghost btn--sm" data-action="datos:exportar">Descargar copia (JSON)</button>
          <button class="btn btn--danger btn--sm" data-action="datos:reiniciar"
            data-confirm="¿Restaurar los datos de demostración? Se perderá todo lo que hayas creado en este navegador.">Reiniciar datos demo</button>
        </div>
      </div>

      <div class="card mt">
        <h3>Sobre este aplicativo</h3>
        <p class="small muted mb0">
          UPN Talent Lab es un prototipo funcional del programa de vinculación entre estudiantes de la
          Universidad Privada del Norte y pequeñas y medianas empresas. Funciona sin conexión y sin servidor:
          los datos viven en tu navegador, por lo que cada dispositivo tiene su propia copia.
        </p>
      </div>
    </div>`;
  };
})();
