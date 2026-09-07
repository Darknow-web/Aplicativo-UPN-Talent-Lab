/* 19-app.js — Arranque: verificación de dependencias, rutas y bootstrap */
(function () {

  function verificarDependencias() {
    var faltan = ['CFG', 'U', 'Store', 'SEED', 'Auth', 'M', 'Matching', 'UI', 'C', 'Router', 'Vistas', 'Actions']
      .filter(function (g) { return !window[g]; });
    if (faltan.length) {
      document.getElementById('contenido').innerHTML =
        '<div class="empty"><div class="empty__ico">⚠️</div><h3>No se pudo cargar la aplicación</h3>' +
        '<p>Faltan estos módulos: ' + faltan.join(', ') + '. Revisa que todos los archivos de assets/js estén presentes.</p></div>';
      return false;
    }
    return true;
  }

  function definirRutas() {
    var T = ['estudiante', 'empresa', 'mentor', 'coordinador'];

    Router.add('/', { view: Vistas.inicio, roles: ['*'], titulo: 'Inicio' });
    Router.add('/ingresar', { view: Vistas.ingresar, roles: ['*'], titulo: 'Ingresar' });
    Router.add('/registro', { view: Vistas.registro, roles: ['*'], titulo: 'Crear cuenta' });
    Router.add('/ayuda', { view: Vistas.ayuda, roles: ['*'], titulo: 'Guía de uso' });
    Router.add('/verificar', { view: Vistas.verificar, roles: ['*'], titulo: 'Verificar constancia' });
    Router.add('/verificar/:codigo', { view: Vistas.verificar, roles: ['*'], titulo: 'Verificar constancia' });
    Router.add('/portafolio/:slug', { view: Vistas.portafolio, roles: ['*'], titulo: 'Portafolio' });
    Router.add('/constancia/:codigo', { view: Vistas.constancia, roles: ['*'], titulo: 'Constancia', layout: 'print' });

    Router.add('/retos', { view: Vistas.retos, roles: ['*'], titulo: 'Retos' });
    Router.add('/reto/nuevo', { view: Vistas.retoForm, roles: ['empresa', 'coordinador'], titulo: 'Publicar un reto' });
    Router.add('/reto/:id', { view: Vistas.retoDetalle, roles: ['*'], titulo: 'Reto' });
    Router.add('/reto/:id/editar', { view: Vistas.retoForm, roles: ['empresa', 'coordinador'], titulo: 'Editar reto' });
    Router.add('/matching/:id', { view: Vistas.matching, roles: ['coordinador'], titulo: 'Conformar equipo' });

    Router.add('/postulaciones', { view: Vistas.postulaciones, roles: ['estudiante'], titulo: 'Mis postulaciones' });
    Router.add('/proyectos', { view: Vistas.proyectos, roles: T, titulo: 'Proyectos' });
    Router.add('/proyecto/:id', { view: Vistas.proyecto, roles: T, titulo: 'Proyecto' });

    Router.add('/talento', { view: Vistas.talento, roles: ['empresa', 'mentor', 'coordinador'], titulo: 'Talento UPN' });
    Router.add('/reportes', { view: Vistas.reportes, roles: ['coordinador'], titulo: 'Reportes' });
    Router.add('/pruebas', { view: Vistas.pruebas, roles: ['coordinador', 'mentor'], titulo: 'Pruebas prácticas' });
    Router.add('/constancias', { view: Vistas.constancias, roles: ['estudiante', 'coordinador'], titulo: 'Constancias' });

    Router.add('/notificaciones', { view: Vistas.notificaciones, roles: T, titulo: 'Notificaciones' });
    Router.add('/perfil', { view: Vistas.perfil, roles: T, titulo: 'Mi perfil' });
    Router.add('/perfil/:id', { view: Vistas.perfil, roles: ['*'], titulo: 'Perfil' });
    Router.add('/ajustes', { view: Vistas.ajustes, roles: ['*'], titulo: 'Ajustes' });
  }

  function iniciar() {
    if (!verificarDependencias()) return;
    UI.tema();
    Store.cargar();
    Auth.restaurar();
    definirRutas();
    Actions.iniciar();
    Router.start();

    /* Primera visita sin sesión: una bienvenida breve. Solo una vez por navegador. */
    if (!Auth.autenticado() && !Store.lsGet('utl.bienvenida')) {
      setTimeout(function () { Actions.ejecutar('ui:bienvenida', {}); }, 700);
    }

    /* Sincronización entre pestañas del mismo navegador */
    window.addEventListener('storage', function (e) {
      if (e.key === CFG.KEY_DB) {
        Store.cargar();
        Router.refresh();
        UI.toast('Los datos cambiaron en otra pestaña.', 'warn');
      }
    });

    if (!Store.disponible) {
      UI.toast('Tu navegador bloquea el almacenamiento local: los cambios no se guardarán al recargar.', 'warn', 7000);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
