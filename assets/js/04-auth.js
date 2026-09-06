/* 04-auth.js — Sesión, cuentas demo y permisos */
window.Auth = (function () {
  var actualId = null;

  function iniciarSesionPorId(id) {
    var u = Store.find('users', id);
    if (!u) return null;
    actualId = u.id;
    Store.lsSet(CFG.KEY_SESSION, u.id);
    Store.auditar('sesion:iniciar', 'user', u.id);
    Store.guardar();
    return u;
  }

  function login(email, pass) {
    var e = String(email || '').trim().toLowerCase();
    var u = Store.all('users').filter(function (x) { return x.email.toLowerCase() === e; })[0];
    if (!u) return { ok: false, error: 'No existe una cuenta con ese correo.' };
    if (String(pass) !== u.pass) return { ok: false, error: 'La contraseña no es correcta.' };
    iniciarSesionPorId(u.id);
    return { ok: true, user: u };
  }

  function logout() {
    actualId = null;
    Store.lsDel(CFG.KEY_SESSION);
  }

  function restaurar() {
    var id = Store.lsGet(CFG.KEY_SESSION);
    if (id && Store.find('users', id)) actualId = id;
    else actualId = null;
    return actual();
  }

  function actual() { return actualId ? Store.find('users', actualId) : null; }
  function rol() { var u = actual(); return u ? u.rol : null; }
  function es(r) { return rol() === r; }
  function autenticado() { return !!actual(); }

  function registrar(datos) {
    var email = String(datos.email || '').trim().toLowerCase();
    if (!email) return { ok: false, error: 'Ingresa un correo.' };
    if (Store.all('users').some(function (u) { return u.email.toLowerCase() === email; }))
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
    if (String(datos.pass || '').length < 6)
      return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };

    var u = {
      id: U.uid('u'), rol: datos.rol, nombre: String(datos.nombre || '').trim(),
      email: email, pass: datos.pass, creado: new Date().toISOString()
    };
    if (datos.rol === 'estudiante') {
      u.codigoUPN = String(datos.codigoUPN || '').trim() || ('N' + U.bloqueCodigo(8));
      u.carrera = datos.carrera || 'Administración de Empresas';
      u.ciclo = parseInt(datos.ciclo, 10) || 5;
      u.campus = datos.campus || CFG.CAMPUS[0];
      u.horasSemana = parseInt(datos.horasSemana, 10) || CFG.HORAS_POR_SEMANA_DEFECTO;
      u.modalidad = datos.modalidad || 'hibrido';
      u.distrito = datos.distrito || '';
      u.bio = datos.bio || '';
      u.habilidades = [];
      u.intereses = CFG.CARRERAS[u.carrera] || [];
      u.portafolio = [];
      u.portafolioPublico = true;
      u.slug = U.slugify(u.nombre) + '-' + u.codigoUPN.slice(-4);
    } else if (datos.rol === 'empresa') {
      u.razonSocial = String(datos.razonSocial || '').trim();
      u.ruc = String(datos.ruc || '').trim();
      u.sector = datos.sector || '';
      u.tamano = datos.tamano || 'micro';
      u.distrito = datos.distrito || '';
      u.web = datos.web || '';
      u.cargo = datos.cargo || '';
      u.trabajadores = parseInt(datos.trabajadores, 10) || 1;
      u.descripcion = datos.descripcion || '';
      u.logo = '🏢';
      u.verificada = false;
    }
    Store.insert('users', u);
    Store.auditar('usuario:registrar', 'user', u.id, { rol: u.rol });
    iniciarSesionPorId(u.id);
    return { ok: true, user: u };
  }

  /* ---------- Permisos ----------
     can(accion, recurso) -> boolean. Se usa tanto para pintar la UI
     como para revalidar dentro del handler (defensa en profundidad). */
  function can(accion, rec) {
    var u = actual();
    var r = u ? u.rol : null;
    rec = rec || {};

    switch (accion) {
      /* --- Retos --- */
      case 'reto:crear':
        return r === 'empresa' || r === 'coordinador';
      case 'reto:editar':
        if (r === 'coordinador') return true;
        return r === 'empresa' && rec.empresaId === u.id &&
               ['borrador', 'observado'].indexOf(rec.estado) !== -1;
      case 'reto:enviar':
        return r === 'empresa' && rec.empresaId === u.id &&
               ['borrador', 'observado'].indexOf(rec.estado) !== -1;
      case 'reto:revisar':
        return r === 'coordinador' && rec.estado === 'en_revision';
      case 'reto:cerrarPostulacion':
        return r === 'coordinador' && rec.estado === 'publicado';
      case 'reto:verCompleto':
        if (r === 'coordinador') return true;
        if (r === 'empresa') return rec.empresaId === u.id;
        return false;

      /* --- Postulaciones --- */
      case 'postulacion:crear':
        return r === 'estudiante' && rec.estado === 'publicado';
      case 'postulacion:verLista':
        return r === 'coordinador' || (r === 'empresa' && rec.empresaId === u.id);
      case 'postulacion:decidir':
        return r === 'coordinador';

      /* --- Equipos y proyectos --- */
      case 'equipo:conformar':
        return r === 'coordinador' && rec.estado === 'en_seleccion';
      case 'proyecto:ver':
        if (r === 'coordinador') return true;
        if (!rec) return false;
        if (r === 'empresa') return rec.empresaId === u.id;
        if (r === 'mentor') return rec.mentorId === u.id;
        if (r === 'estudiante') return (rec.estudianteIds || []).indexOf(u.id) !== -1;
        return false;
      case 'hito:entregar':
        return r === 'estudiante' && (rec.estudianteIds || []).indexOf(u.id) !== -1 &&
               rec.estado === 'en_curso';
      case 'hito:revisar':
        return (r === 'mentor' && rec.mentorId === u.id) || r === 'coordinador';
      case 'bitacora:escribir':
        return can('proyecto:ver', rec) && rec.estado !== 'cerrado';
      case 'entrega:final':
        return r === 'estudiante' && (rec.estudianteIds || []).indexOf(u.id) !== -1 &&
               rec.estado === 'en_curso';
      case 'evaluar:mentor':
        return r === 'mentor' && rec.mentorId === u.id && rec.estado === 'en_validacion';
      case 'evaluar:empresa':
        return r === 'empresa' && rec.empresaId === u.id && rec.estado === 'en_validacion';
      case 'proyecto:cerrar':
        return r === 'coordinador' && rec.estado === 'aprobado';

      /* --- Constancias --- */
      case 'constancia:emitir':
        return r === 'coordinador';
      case 'constancia:anular':
        return r === 'coordinador';

      /* --- Directorios --- */
      case 'talento:ver':
        return r === 'coordinador' || r === 'mentor' || r === 'empresa';
      case 'reportes:ver':
        return r === 'coordinador';

      /* --- Perfil --- */
      case 'perfil:editar':
        return !!u && rec.id === u.id;
      default:
        return false;
    }
  }

  function cuentasDemo() {
    return [
      { id: 'u_est1', desc: 'Estudiante con proyecto terminado y constancia' },
      { id: 'u_est3', desc: 'Estudiante con proyecto en ejecución' },
      { id: 'u_emp2', desc: 'Empresa con proyecto activo' },
      { id: 'u_emp5', desc: 'Empresa con reto en revisión' },
      { id: 'u_men3', desc: 'Mentor con un hito por revisar' },
      { id: 'u_coord1', desc: 'Coordinación: revisar retos y armar equipos' }
    ].map(function (c) {
      var u = Store.find('users', c.id);
      return u ? { user: u, desc: c.desc } : null;
    }).filter(Boolean);
  }

  return {
    login: login, logout: logout, restaurar: restaurar, actual: actual, rol: rol,
    es: es, autenticado: autenticado, registrar: registrar, can: can,
    iniciarSesionPorId: iniciarSesionPorId, cuentasDemo: cuentasDemo
  };
})();
