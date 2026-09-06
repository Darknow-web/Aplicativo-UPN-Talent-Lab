/* 09-router.js — Router por hash, guards por rol y render de la navegación */
window.Router = (function () {
  var rutas = [];
  var actual = null;

  function add(patron, cfg) {
    var partes = patron.split('/').filter(Boolean);
    rutas.push({ patron: patron, partes: partes, cfg: cfg });
  }

  function parseHash() {
    var hash = location.hash.replace(/^#/, '') || '/';
    var qi = hash.indexOf('?');
    var path = qi === -1 ? hash : hash.slice(0, qi);
    var qs = qi === -1 ? '' : hash.slice(qi + 1);
    var query = {};
    qs.split('&').filter(Boolean).forEach(function (par) {
      var kv = par.split('=');
      query[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
    });
    if (path.charAt(0) !== '/') path = '/' + path;
    return { path: path, query: query };
  }

  function match(path) {
    var segs = path.split('/').filter(Boolean);
    for (var i = 0; i < rutas.length; i++) {
      var r = rutas[i];
      if (r.partes.length !== segs.length) continue;
      var params = {}, ok = true;
      for (var j = 0; j < r.partes.length; j++) {
        var p = r.partes[j];
        if (p.charAt(0) === ':') params[p.slice(1)] = decodeURIComponent(segs[j]);
        else if (p !== segs[j]) { ok = false; break; }
      }
      if (ok) return { ruta: r, params: params };
    }
    return null;
  }

  function go(hash) {
    if (location.hash === hash || location.hash === '#' + hash) render();
    else location.hash = hash;
  }
  function setQuery(cambios) {
    var s = parseHash();
    Object.keys(cambios).forEach(function (k) {
      if (cambios[k] === null || cambios[k] === '') delete s.query[k];
      else s.query[k] = cambios[k];
    });
    var qs = Object.keys(s.query).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(s.query[k]);
    }).join('&');
    location.hash = '#' + s.path + (qs ? '?' + qs : '');
  }
  function params() { return actual ? actual : { path: '/', query: {}, params: {} }; }
  function refresh() { render(); }

  /* ---------------- Navegación por rol ---------------- */
  function navPara(rol) {
    var comun = [{ href: '#/notificaciones', icono: 'campana', label: 'Notificaciones', badge: true }];
    if (!rol) {
      return {
        principal: [
          { href: '#/', icono: 'inicio', label: 'Inicio', corto: 'Inicio' },
          { href: '#/retos', icono: 'retos', label: 'Retos abiertos', corto: 'Retos' },
          { href: '#/verificar', icono: 'escudo', label: 'Verificar constancia', corto: 'Verificar' },
          { href: '#/ayuda', icono: 'ayuda', label: 'Cómo funciona', corto: 'Ayuda' }
        ], secundaria: []
      };
    }
    if (rol === 'estudiante') return {
      principal: [
        { href: '#/', icono: 'inicio', label: 'Mi panel', corto: 'Panel' },
        { href: '#/retos', icono: 'brujula', label: 'Oportunidades', corto: 'Retos' },
        { href: '#/postulaciones', icono: 'doc', label: 'Mis postulaciones', corto: 'Postulé' },
        { href: '#/proyectos', icono: 'maletin', label: 'Mis proyectos', corto: 'Proyectos' },
        { href: '#/constancias', icono: 'medalla', label: 'Constancias', corto: 'Constancias' }
      ],
      secundaria: comun.concat([
        { href: '#/perfil', icono: 'usuario', label: 'Mi perfil y portafolio' },
        { href: '#/ayuda', icono: 'ayuda', label: 'Cómo funciona' }
      ])
    };
    if (rol === 'empresa') return {
      principal: [
        { href: '#/', icono: 'inicio', label: 'Mi panel', corto: 'Panel' },
        { href: '#/retos', icono: 'retos', label: 'Mis retos', corto: 'Retos' },
        { href: '#/reto/nuevo', icono: 'mas', label: 'Publicar reto', corto: 'Publicar' },
        { href: '#/proyectos', icono: 'maletin', label: 'Mis proyectos', corto: 'Proyectos' },
        { href: '#/talento', icono: 'personas', label: 'Talento UPN', corto: 'Talento' }
      ],
      secundaria: comun.concat([
        { href: '#/perfil', icono: 'edificio', label: 'Datos de la empresa' },
        { href: '#/ayuda', icono: 'ayuda', label: 'Cómo funciona' }
      ])
    };
    if (rol === 'mentor') return {
      principal: [
        { href: '#/', icono: 'inicio', label: 'Mi panel', corto: 'Panel' },
        { href: '#/proyectos', icono: 'maletin', label: 'Proyectos que acompaño', corto: 'Proyectos' },
        { href: '#/retos', icono: 'retos', label: 'Retos del programa', corto: 'Retos' },
        { href: '#/talento', icono: 'personas', label: 'Estudiantes', corto: 'Talento' }
      ],
      secundaria: comun.concat([
        { href: '#/perfil', icono: 'usuario', label: 'Mi perfil' },
        { href: '#/ayuda', icono: 'ayuda', label: 'Cómo funciona' }
      ])
    };
    return {
      principal: [
        { href: '#/', icono: 'inicio', label: 'Panel de coordinación', corto: 'Panel' },
        { href: '#/retos', icono: 'retos', label: 'Retos', corto: 'Retos' },
        { href: '#/proyectos', icono: 'maletin', label: 'Proyectos', corto: 'Proyectos' },
        { href: '#/talento', icono: 'personas', label: 'Talento', corto: 'Talento' },
        { href: '#/constancias', icono: 'medalla', label: 'Constancias', corto: 'Constancias' }
      ],
      secundaria: comun.concat([
        { href: '#/reportes', icono: 'grafico', label: 'Reportes' },
        { href: '#/perfil', icono: 'usuario', label: 'Mi perfil' },
        { href: '#/ayuda', icono: 'ayuda', label: 'Cómo funciona' }
      ])
    };
  }

  function pintarNav(pathActual) {
    var u = Auth.actual();
    var nav = navPara(u ? u.rol : null);
    var pendientes = u ? M.noLeidas(u.id) : 0;
    var h = U.html;

    function link(it, clase) {
      var activo = pathActual === it.href.replace('#', '') ||
                   (it.href !== '#/' && pathActual.indexOf(it.href.replace('#', '')) === 0);
      return h`<a class="${clase}" href="${it.href}" ${U.raw(activo ? 'aria-current="page"' : '')}>
        ${C.icono(it.icono)}<span>${it.label}</span>
        ${it.badge && pendientes ? h`<span class="navlink__pill">${pendientes}</span>` : ''}
      </a>`;
    }

    document.getElementById('nav-lateral').innerHTML = U.str(h`
      ${nav.principal.map(function (it) { return link(it, 'navlink'); })}
      ${nav.secundaria.length ? h`<div class="navgroup">Más</div>` : ''}
      ${nav.secundaria.map(function (it) { return link(it, 'navlink'); })}
    `);

    document.getElementById('nav-foot').innerHTML = U.str(u ? h`
      <a class="navlink" href="#/perfil" style="padding-left:.4rem">
        ${C.avatar(u)}<span style="min-width:0">
          <span style="display:block;font-weight:700;font-size:.86rem;overflow:hidden;text-overflow:ellipsis">${u.rol === 'empresa' ? (u.razonSocial || u.nombre) : u.nombre}</span>
          <span style="display:block;font-size:.75rem;color:#A8A29A">${CFG.ROLES[u.rol].label}</span>
        </span>
      </a>
      <button class="navlink" style="width:100%;background:none;border:0;cursor:pointer;text-align:left" data-action="auth:salir">
        ${C.icono('salir')}<span>Cerrar sesión</span>
      </button>
    ` : h`
      <a class="btn btn--primary btn--block" href="#/ingresar">Ingresar</a>
      <a class="navlink mt-sm" href="#/registro" style="justify-content:center">Crear una cuenta</a>
    `);

    /* Barra inferior móvil: 5 accesos */
    var tabs = nav.principal.slice(0, 4).concat(u ? [{ href: '#/notificaciones', icono: 'campana', label: 'Avisos', corto: 'Avisos', badge: true }]
                                                  : [{ href: '#/ingresar', icono: 'usuario', label: 'Ingresar', corto: 'Ingresar' }]);
    document.getElementById('tabbar').innerHTML = U.str(h`${tabs.map(function (it) {
      var activo = pathActual === it.href.replace('#', '') ||
                   (it.href !== '#/' && pathActual.indexOf(it.href.replace('#', '')) === 0);
      return h`<a class="tablink" href="${it.href}" ${U.raw(activo ? 'aria-current="page"' : '')}>
        ${C.icono(it.icono, 22)}<span>${it.corto || it.label}</span>
        ${it.badge && pendientes ? h`<span class="tablink__dot"></span>` : ''}
      </a>`;
    })}`);

    /* Acciones de la topbar */
    document.getElementById('topbar-actions').innerHTML = U.str(h`
      <button class="iconbtn" data-action="ui:tema" title="Cambiar tema" aria-label="Cambiar tema claro u oscuro">
        ${C.icono(UI.temaActual() === 'oscuro' ? 'inicio' : 'ajustes', 20)}
      </button>
      ${u ? h`<a class="iconbtn" href="#/notificaciones" aria-label="Notificaciones${pendientes ? ': ' + pendientes + ' sin leer' : ''}">
          ${C.icono('campana', 21)}${pendientes ? h`<span class="iconbtn__dot">${pendientes}</span>` : ''}
        </a>
        <a class="iconbtn" href="#/perfil" aria-label="Mi perfil">${C.avatar(u, 'avatar--sm')}</a>`
        : h`<a class="btn btn--primary btn--sm" href="#/ingresar">Ingresar</a>`}
    `);
  }

  /* ---------------- Render ---------------- */
  function render() {
    var s = parseHash();
    var m = match(s.path);

    if (!m) {
      pintarNav(s.path);
      pintar(Vistas.noEncontrado(s.path), 'Página no encontrada');
      return;
    }

    var cfg = m.ruta.cfg;
    var u = Auth.actual();

    /* Guard: requiere sesión */
    if (cfg.roles && cfg.roles.indexOf('*') === -1) {
      if (!u) {
        location.hash = '#/ingresar?next=' + encodeURIComponent(s.path);
        return;
      }
      if (cfg.roles.indexOf(u.rol) === -1) {
        pintarNav(s.path);
        pintar(Vistas.sinPermiso(cfg.roles), 'Sin acceso');
        return;
      }
    }

    actual = { path: s.path, query: s.query, params: m.params };
    var shell = document.getElementById('app-shell');
    if (cfg.layout === 'print') shell.classList.add('layout-print');
    else shell.classList.remove('layout-print');

    pintarNav(s.path);
    var contenido;
    try {
      contenido = cfg.view(m.params, s.query);
    } catch (e) {
      console.error('Error al renderizar', s.path, e);
      contenido = C.aviso('danger', '⚠️', 'Ocurrió un error al mostrar esta pantalla. Prueba recargar la página.');
    }
    pintar(contenido, cfg.titulo);
  }

  function pintar(contenido, titulo) {
    var cont = document.getElementById('contenido');
    cont.innerHTML = U.str(contenido);
    document.title = (titulo ? titulo + ' · ' : '') + CFG.APP;
    UI.cerrarMenu();
    window.scrollTo(0, 0);
    var h1 = cont.querySelector('h1');
    if (h1) { h1.setAttribute('tabindex', '-1'); }
  }

  function start() {
    window.addEventListener('hashchange', render);
    render();
  }

  return { add: add, start: start, go: go, refresh: refresh, params: params, setQuery: setQuery, parseHash: parseHash, navPara: navPara };
})();
