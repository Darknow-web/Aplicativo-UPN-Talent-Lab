/* 05-models.js — Reglas de negocio: ciclo del reto, proyecto, evaluación y constancia */
window.M = (function () {

  /* ================= Helpers de lectura ================= */
  function usuario(id) { return Store.find('users', id); }
  function nombre(id) { var u = usuario(id); return u ? u.nombre : 'Usuario'; }
  function empresaNombre(id) { var u = usuario(id); return u ? (u.razonSocial || u.nombre) : 'Empresa'; }
  function reto(id) { return Store.find('retos', id); }
  function proyecto(id) { return Store.find('proyectos', id); }
  function habilidadNombre(id) { return (CFG.HABILIDADES[id] || {}).nombre || id; }
  function categoria(id) { return CFG.CATEGORIAS[id] || { label: id, icono: '📌' }; }

  function estudiantes() { return Store.where('users', function (u) { return u.rol === 'estudiante'; }); }
  function empresas() { return Store.where('users', function (u) { return u.rol === 'empresa'; }); }
  function mentores() { return Store.where('users', function (u) { return u.rol === 'mentor'; }); }
  function coordinadores() { return Store.where('users', function (u) { return u.rol === 'coordinador'; }); }

  function proyectoDeReto(retoId) {
    return Store.where('proyectos', function (p) { return p.retoId === retoId; })[0] || null;
  }
  function postulacionesDe(retoId) {
    return Store.where('postulaciones', function (p) { return p.retoId === retoId; });
  }
  function postulacionDe(retoId, estudianteId) {
    return Store.where('postulaciones', function (p) {
      return p.retoId === retoId && p.estudianteId === estudianteId;
    })[0] || null;
  }
  function proyectosDe(userId) {
    var u = usuario(userId); if (!u) return [];
    return Store.where('proyectos', function (p) {
      if (u.rol === 'empresa') return p.empresaId === u.id;
      if (u.rol === 'mentor') return p.mentorId === u.id;
      if (u.rol === 'estudiante') return (p.estudianteIds || []).indexOf(u.id) !== -1;
      return true;
    });
  }
  function constanciasDe(estudianteId) {
    return Store.where('constancias', function (c) { return c.estudianteId === estudianteId; });
  }
  function constanciaPorCodigo(codigo) {
    var c = String(codigo || '').trim().toUpperCase();
    return Store.where('constancias', function (x) { return x.codigo.toUpperCase() === c; })[0] || null;
  }
  function cargaMentor(mentorId) {
    return Store.where('proyectos', function (p) {
      return p.mentorId === mentorId && ['en_curso', 'en_validacion'].indexOf(p.estado) !== -1;
    }).length;
  }
  function tieneProyectoActivo(estudianteId) {
    return Store.where('proyectos', function (p) {
      return (p.estudianteIds || []).indexOf(estudianteId) !== -1 &&
             ['en_curso', 'en_validacion'].indexOf(p.estado) !== -1;
    }).length > 0;
  }
  function proyectosCompletados(estudianteId) {
    return Store.where('proyectos', function (p) {
      return (p.estudianteIds || []).indexOf(estudianteId) !== -1 && p.estado === 'cerrado';
    });
  }
  function ratingEstudiante(estudianteId) {
    var evs = [];
    proyectosCompletados(estudianteId).forEach(function (p) {
      (p.evaluaciones || []).forEach(function (e) { evs.push(puntajeEval(e)); });
    });
    if (!evs.length) return null;
    return Math.round(U.sum(evs) / evs.length);
  }
  function puntajeEval(ev) {
    var vals = CFG.RUBRICA.map(function (c) { return ev.criterios[c.id] || 0; });
    return Math.round((U.sum(vals) / (vals.length * 5)) * 100);
  }
  function puntajeProyecto(p) {
    var evs = p.evaluaciones || [];
    if (!evs.length) return null;
    return Math.round(U.sum(evs.map(puntajeEval)) / evs.length);
  }
  function progreso(p) {
    var hs = p.hitos || [];
    if (!hs.length) return 0;
    return U.pct(hs.filter(function (h) { return h.estado === 'aprobado'; }).length, hs.length);
  }
  function semanaActual(p) {
    var t = U.diasEntre(p.inicio, U.hoy());
    return U.clamp(Math.floor(t / 7) + 1, 1, p.semanas);
  }
  function horasProyecto(p, estudianteId) {
    var h = U.sum((p.bitacora || []).filter(function (b) {
      return !estudianteId || b.autorId === estudianteId;
    }), function (b) { return b.horas || 0; });
    // Si no hay horas registradas se usa la carga estimada del reto
    var r = reto(p.retoId);
    var estimado = (r ? r.horasSemana : 10) * p.semanas;
    return Math.max(h, estimado);
  }

  /* ================= Notificaciones ================= */
  function notificar(userId, tipo, titulo, cuerpo, link) {
    if (!userId) return;
    Store.get().notificaciones.push({
      id: U.uid('n'), userId: userId, tipo: tipo, titulo: titulo,
      cuerpo: cuerpo, link: link || '', leida: false, at: new Date().toISOString()
    });
  }
  function notificacionesDe(userId) {
    return U.sortBy(Store.where('notificaciones', function (n) { return n.userId === userId; }),
      function (n) { return n.at; }, true);
  }
  function noLeidas(userId) {
    return Store.where('notificaciones', function (n) { return n.userId === userId && !n.leida; }).length;
  }
  function marcarLeidas(userId) {
    Store.tx(function (d) {
      d.notificaciones.forEach(function (n) { if (n.userId === userId) n.leida = true; });
    });
  }

  /* ================= Retos ================= */
  function crearReto(empresaId, datos) {
    var codigo = Store.siguienteCodigo('reto', 'RET');
    var r = {
      id: U.uid('r'), codigo: codigo, empresaId: empresaId,
      titulo: datos.titulo, problema: datos.problema, resultado: datos.resultado,
      categoria: datos.categoria, entregables: datos.entregables || [],
      habilidadesRequeridas: datos.habilidadesRequeridas || [],
      habilidadesDeseables: datos.habilidadesDeseables || [],
      semanas: parseInt(datos.semanas, 10) || 3,
      horasSemana: parseInt(datos.horasSemana, 10) || 10,
      tamanoEquipo: parseInt(datos.tamanoEquipo, 10) || 2,
      modalidad: datos.modalidad || 'hibrido',
      fechaLimitePostulacion: datos.fechaLimitePostulacion || U.sumarDias(U.hoy(), 14),
      estado: 'borrador', notasRevision: '',
      creado: new Date().toISOString(),
      historial: [{ estado: 'borrador', at: new Date().toISOString(), por: empresaId, nota: '' }]
    };
    Store.insert('retos', r);
    Store.auditar('reto:crear', 'reto', r.id);
    return r;
  }

  function transicionesPosibles(r, rol) {
    var map = CFG.RETO_TRANSICIONES[r.estado] || {};
    return Object.keys(map).filter(function (destino) {
      return map[destino].indexOf(rol) !== -1;
    });
  }

  function transicionReto(retoId, destino, opts) {
    opts = opts || {};
    var u = Auth.actual();
    var r = reto(retoId);
    if (!r) return { ok: false, error: 'El reto no existe.' };
    var permitidos = transicionesPosibles(r, u ? u.rol : null);
    if (permitidos.indexOf(destino) === -1)
      return { ok: false, error: 'No puedes cambiar el reto de “' + CFG.RETO_ESTADOS[r.estado].label + '” a “' + (CFG.RETO_ESTADOS[destino] || {}).label + '”.' };

    Store.tx(function () {
      r.estado = destino;
      if (destino === 'publicado') r.publicado = new Date().toISOString();
      if (opts.nota !== undefined) r.notasRevision = opts.nota;
      r.historial.push({ estado: destino, at: new Date().toISOString(), por: u ? u.id : null, nota: opts.nota || '' });
      Store.auditar('reto:' + destino, 'reto', r.id, { nota: opts.nota || '' });

      /* Notificaciones según el destino */
      if (destino === 'en_revision') {
        coordinadores().forEach(function (c) {
          notificar(c.id, 'reto', 'Nuevo reto para revisar',
            empresaNombre(r.empresaId) + ' envió “' + r.titulo + '”.', '#/reto/' + r.id);
        });
      }
      if (destino === 'publicado') {
        notificar(r.empresaId, 'reto', 'Tu reto fue publicado',
          '“' + r.titulo + '” ya está visible para los estudiantes.', '#/reto/' + r.id);
      }
      if (destino === 'observado') {
        notificar(r.empresaId, 'reto', 'Tu reto tiene observaciones',
          opts.nota || 'La coordinación dejó comentarios para ajustar el reto.', '#/reto/' + r.id);
      }
      if (destino === 'rechazado') {
        notificar(r.empresaId, 'reto', 'Tu reto no fue aprobado',
          opts.nota || 'La coordinación no aprobó este reto.', '#/reto/' + r.id);
      }
      if (destino === 'en_seleccion') {
        coordinadores().forEach(function (c) {
          notificar(c.id, 'seleccion', 'Postulaciones cerradas',
            '“' + r.titulo + '” está listo para conformar equipo.', '#/matching/' + r.id);
        });
      }
    });
    return { ok: true, reto: r };
  }

  /* ================= Postulaciones ================= */
  function postular(estudianteId, retoId, datos) {
    var r = reto(retoId);
    if (!r) return { ok: false, error: 'El reto no existe.' };
    if (r.estado !== 'publicado') return { ok: false, error: 'Este reto ya no recibe postulaciones.' };
    if (r.fechaLimitePostulacion && U.diasEntre(U.hoy(), r.fechaLimitePostulacion) < 0)
      return { ok: false, error: 'El plazo para postular venció el ' + U.fecha(r.fechaLimitePostulacion) + '.' };
    if (postulacionDe(retoId, estudianteId)) return { ok: false, error: 'Ya postulaste a este reto.' };
    if (tieneProyectoActivo(estudianteId))
      return { ok: false, error: 'Ya tienes un microproyecto en curso. Solo se permite uno a la vez.' };
    if (!String(datos.motivacion || '').trim())
      return { ok: false, error: 'Cuéntale a la empresa por qué quieres participar.' };

    var res = Matching.evaluar(usuario(estudianteId), r);
    var p = {
      id: U.uid('post'), retoId: retoId, estudianteId: estudianteId,
      motivacion: String(datos.motivacion).trim(),
      disponibilidadConfirmada: !!datos.disponibilidad,
      estado: 'postulada', score: res.total, creado: new Date().toISOString()
    };
    Store.insert('postulaciones', p);
    Store.tx(function () {
      Store.auditar('postulacion:crear', 'postulacion', p.id, { retoId: retoId });
      notificar(r.empresaId, 'postulacion', 'Nueva postulación',
        nombre(estudianteId) + ' postuló a “' + r.titulo + '”.', '#/reto/' + r.id);
    });
    return { ok: true, postulacion: p };
  }

  function retirarPostulacion(postId) {
    var p = Store.find('postulaciones', postId);
    if (!p) return { ok: false, error: 'No existe la postulación.' };
    if (p.estado === 'seleccionada') return { ok: false, error: 'Ya fuiste seleccionado; comunícate con la coordinación.' };
    Store.remove('postulaciones', postId);
    return { ok: true };
  }

  function decidirPostulacion(postId, estado, nota) {
    var p = Store.find('postulaciones', postId);
    if (!p) return { ok: false, error: 'No existe la postulación.' };
    Store.tx(function () {
      p.estado = estado;
      p.nota = nota || '';
      p.decididaAt = new Date().toISOString();
      Store.auditar('postulacion:' + estado, 'postulacion', p.id);
    });
    return { ok: true };
  }

  /* ================= Conformación de equipo ================= */
  function conformarEquipo(retoId, opts) {
    var r = reto(retoId);
    if (!r) return { ok: false, error: 'El reto no existe.' };
    if (r.estado !== 'en_seleccion') return { ok: false, error: 'El reto debe estar en selección para conformar el equipo.' };
    var ids = opts.estudianteIds || [];
    if (!ids.length) return { ok: false, error: 'Selecciona al menos un estudiante.' };
    if (!opts.mentorId) return { ok: false, error: 'Asigna un docente o mentor.' };
    var mentor = usuario(opts.mentorId);
    if (!mentor || mentor.rol !== 'mentor') return { ok: false, error: 'El mentor seleccionado no es válido.' };
    if (cargaMentor(mentor.id) >= (mentor.maxProyectos || 3))
      return { ok: false, error: 'Ese mentor ya alcanzó su máximo de proyectos simultáneos.' };
    var ocupado = ids.filter(tieneProyectoActivo);
    if (ocupado.length) return { ok: false, error: nombre(ocupado[0]) + ' ya tiene un microproyecto en curso.' };

    var u = Auth.actual();
    var inicio = opts.inicio || U.sumarDias(U.hoy(), 3);
    var codigo = Store.siguienteCodigo('proyecto', 'PRY');
    var hitos = (CFG.PLANTILLA_HITOS[r.semanas] || CFG.PLANTILLA_HITOS[3]).map(function (h, i) {
      return {
        id: U.uid('hito'), semana: i + 1, titulo: h.titulo, descripcion: h.descripcion,
        fechaLimite: U.sumarDias(inicio, (i + 1) * 7), estado: 'pendiente',
        evidencia: '', nota: '', feedback: '', entregadoAt: null, revisadoAt: null
      };
    });

    var p = {
      id: U.uid('pr'), codigo: codigo, retoId: r.id, empresaId: r.empresaId,
      mentorId: mentor.id, estudianteIds: ids, liderId: opts.liderId || ids[0],
      coordinadorId: u ? u.id : null,
      inicio: inicio, fin: U.sumarDias(inicio, r.semanas * 7), semanas: r.semanas,
      estado: 'en_curso', creado: new Date().toISOString(),
      hitos: hitos, bitacora: [], entregaFinal: null, evaluaciones: []
    };

    Store.insert('proyectos', p);
    Store.tx(function () {
      r.estado = 'en_ejecucion';
      r.historial.push({ estado: 'en_ejecucion', at: new Date().toISOString(), por: u ? u.id : null, nota: 'Equipo conformado' });
      postulacionesDe(r.id).forEach(function (post) {
        post.estado = ids.indexOf(post.estudianteId) !== -1 ? 'seleccionada' : 'no_seleccionada';
        post.decididaAt = new Date().toISOString();
      });
      Store.auditar('equipo:conformar', 'proyecto', p.id, { retoId: r.id, integrantes: ids.length });

      ids.forEach(function (id) {
        notificar(id, 'proyecto', '¡Fuiste seleccionado!',
          'Trabajarás en “' + r.titulo + '” con ' + empresaNombre(r.empresaId) + '.', '#/proyecto/' + p.id);
      });
      postulacionesDe(r.id).filter(function (x) { return x.estado === 'no_seleccionada'; }).forEach(function (x) {
        notificar(x.estudianteId, 'postulacion', 'No fuiste seleccionado esta vez',
          'El equipo de “' + r.titulo + '” ya fue conformado. Sigue postulando a otros retos.', '#/retos');
      });
      notificar(mentor.id, 'proyecto', 'Nuevo proyecto asignado',
        'Acompañarás “' + r.titulo + '” con ' + ids.length + ' ' + U.plural(ids.length, 'estudiante') + '.', '#/proyecto/' + p.id);
      notificar(r.empresaId, 'proyecto', 'Tu equipo está listo',
        'La universidad conformó el equipo para “' + r.titulo + '”. El proyecto inicia el ' + U.fecha(inicio) + '.', '#/proyecto/' + p.id);
    });
    return { ok: true, proyecto: p };
  }

  /* ================= Hitos ================= */
  function entregarHito(proyectoId, hitoId, datos) {
    var p = proyecto(proyectoId); if (!p) return { ok: false, error: 'Proyecto no encontrado.' };
    var h = (p.hitos || []).filter(function (x) { return x.id === hitoId; })[0];
    if (!h) return { ok: false, error: 'Hito no encontrado.' };
    var url = U.safeUrl(datos.evidencia);
    if (!url) return { ok: false, error: 'Agrega un enlace válido con la evidencia (Drive, Figma, Canva, etc.).' };
    Store.tx(function () {
      h.estado = 'entregado'; h.evidencia = url; h.nota = String(datos.nota || '').trim();
      h.entregadoAt = new Date().toISOString();
      Store.auditar('hito:entregar', 'proyecto', p.id, { hito: h.titulo });
      notificar(p.mentorId, 'hito', 'Hito entregado para revisión',
        nombre(Auth.actual() ? Auth.actual().id : p.liderId) + ' entregó “' + h.titulo + '”.', '#/proyecto/' + p.id + '?tab=hitos');
      notificar(p.empresaId, 'proyecto', 'Avance del equipo',
        'El equipo entregó el hito “' + h.titulo + '”.', '#/proyecto/' + p.id);
    });
    return { ok: true };
  }

  function revisarHito(proyectoId, hitoId, decision, feedback) {
    var p = proyecto(proyectoId); if (!p) return { ok: false, error: 'Proyecto no encontrado.' };
    var h = (p.hitos || []).filter(function (x) { return x.id === hitoId; })[0];
    if (!h) return { ok: false, error: 'Hito no encontrado.' };
    if (decision === 'observado' && !String(feedback || '').trim())
      return { ok: false, error: 'Explica al equipo qué debe corregir.' };
    Store.tx(function () {
      h.estado = decision;
      h.feedback = String(feedback || '').trim();
      h.revisadoAt = new Date().toISOString();
      Store.auditar('hito:' + decision, 'proyecto', p.id, { hito: h.titulo });
      p.estudianteIds.forEach(function (id) {
        notificar(id, 'hito', decision === 'aprobado' ? 'Hito aprobado' : 'Hito observado',
          '“' + h.titulo + '”: ' + (h.feedback || 'Sin comentarios.'), '#/proyecto/' + p.id + '?tab=hitos');
      });
    });
    return { ok: true };
  }

  /* ================= Bitácora ================= */
  function agregarBitacora(proyectoId, datos) {
    var p = proyecto(proyectoId); if (!p) return { ok: false, error: 'Proyecto no encontrado.' };
    var texto = String(datos.texto || '').trim();
    if (texto.length < 10) return { ok: false, error: 'Escribe al menos una frase describiendo el avance.' };
    var u = Auth.actual();
    Store.tx(function () {
      p.bitacora.push({
        id: U.uid('b'), autorId: u.id, tipo: datos.tipo || 'avance',
        semana: parseInt(datos.semana, 10) || semanaActual(p),
        horas: parseFloat(datos.horas) || 0,
        texto: texto, visibleEmpresa: datos.visibleEmpresa !== false && datos.visibleEmpresa !== 'false',
        at: new Date().toISOString()
      });
      Store.auditar('bitacora:agregar', 'proyecto', p.id);
    });
    return { ok: true };
  }

  /* ================= Entrega final ================= */
  function entregaFinal(proyectoId, datos) {
    var p = proyecto(proyectoId); if (!p) return { ok: false, error: 'Proyecto no encontrado.' };
    var pendientes = (p.hitos || []).filter(function (h) { return h.estado !== 'aprobado'; });
    if (pendientes.length > 1)
      return { ok: false, error: 'Aún tienes ' + pendientes.length + ' hitos sin aprobar. Complétalos antes de la entrega final.' };
    if (!String(datos.resumen || '').trim()) return { ok: false, error: 'Describe qué estás entregando.' };
    var enlaces = (datos.enlaces || []).map(function (e) {
      return { label: String(e.label || 'Entregable').trim(), url: U.safeUrl(e.url) };
    }).filter(function (e) { return e.url; });
    if (!enlaces.length) return { ok: false, error: 'Agrega al menos un enlace al entregable.' };

    var u = Auth.actual();
    Store.tx(function () {
      p.entregaFinal = {
        titulo: String(datos.titulo || 'Entrega final').trim(),
        resumen: String(datos.resumen).trim(), enlaces: enlaces,
        at: new Date().toISOString(), porId: u.id
      };
      (p.hitos || []).forEach(function (h) {
        if (h.estado !== 'aprobado' && !h.evidencia) { h.estado = 'entregado'; h.entregadoAt = new Date().toISOString(); }
      });
      p.estado = 'en_validacion';
      Store.auditar('entrega:final', 'proyecto', p.id);
      notificar(p.mentorId, 'evaluacion', 'Entrega final recibida',
        'El equipo de “' + reto(p.retoId).titulo + '” envió la entrega final. Te toca evaluar.', '#/proyecto/' + p.id + '?tab=evaluacion');
      notificar(p.empresaId, 'evaluacion', 'Entrega final recibida',
        'Ya puedes revisar el resultado de “' + reto(p.retoId).titulo + '” y evaluarlo.', '#/proyecto/' + p.id + '?tab=evaluacion');
    });
    return { ok: true };
  }

  /* ================= Evaluación ================= */
  function evaluar(proyectoId, datos) {
    var p = proyecto(proyectoId); if (!p) return { ok: false, error: 'Proyecto no encontrado.' };
    var u = Auth.actual();
    var rol = u.rol === 'empresa' ? 'empresa' : 'mentor';
    if ((p.evaluaciones || []).some(function (e) { return e.rol === rol; }))
      return { ok: false, error: 'Ya registraste tu evaluación de este proyecto.' };

    var criterios = {};
    var faltan = [];
    CFG.RUBRICA.forEach(function (c) {
      var v = parseInt(datos['crit_' + c.id], 10);
      if (!v) faltan.push(c.label);
      criterios[c.id] = U.clamp(v || 0, 0, 5);
    });
    if (faltan.length) return { ok: false, error: 'Falta calificar: ' + faltan.join(', ') + '.' };

    var decision = datos.decision === 'observado' ? 'observado' : 'aprobado';
    if (decision === 'observado' && !String(datos.comentario || '').trim())
      return { ok: false, error: 'Explica qué debe corregir el equipo.' };

    Store.tx(function () {
      p.evaluaciones.push({
        id: U.uid('ev'), rol: rol, evaluadorId: u.id, at: new Date().toISOString(),
        decision: decision, criterios: criterios, comentario: String(datos.comentario || '').trim()
      });
      Store.auditar('evaluacion:' + rol, 'proyecto', p.id, { decision: decision });

      if (decision === 'observado') {
        p.estado = 'en_curso';
        p.entregaFinal = null;
        p.estudianteIds.forEach(function (id) {
          notificar(id, 'evaluacion', 'La entrega fue observada',
            String(datos.comentario || ''), '#/proyecto/' + p.id + '?tab=entrega');
        });
      } else {
        var tieneMentor = p.evaluaciones.some(function (e) { return e.rol === 'mentor' && e.decision === 'aprobado'; });
        var tieneEmpresa = p.evaluaciones.some(function (e) { return e.rol === 'empresa' && e.decision === 'aprobado'; });
        if (tieneMentor && tieneEmpresa) {
          p.estado = 'aprobado';
          coordinadores().forEach(function (c) {
            notificar(c.id, 'constancia', 'Proyecto listo para constancias',
              '“' + reto(p.retoId).titulo + '” fue aprobado por mentor y empresa.', '#/proyecto/' + p.id + '?tab=evaluacion');
          });
          p.estudianteIds.forEach(function (id) {
            notificar(id, 'evaluacion', '¡Tu proyecto fue aprobado!',
              'Mentor y empresa aprobaron la entrega. La coordinación emitirá tu constancia.', '#/proyecto/' + p.id);
          });
        } else {
          var falta = tieneMentor ? 'la empresa' : 'el mentor';
          p.estudianteIds.forEach(function (id) {
            notificar(id, 'evaluacion', 'Una evaluación registrada',
              'Falta la evaluación de ' + falta + ' para cerrar el proyecto.', '#/proyecto/' + p.id + '?tab=evaluacion');
          });
        }
      }
    });
    return { ok: true };
  }

  /* ================= Constancias ================= */
  function generarCodigo() {
    var codigo, intentos = 0;
    do {
      codigo = 'UTL-' + new Date().getFullYear() + '-' + U.bloqueCodigo(4) + '-' + U.bloqueCodigo(4);
      intentos++;
    } while (constanciaPorCodigo(codigo) && intentos < 8);
    return codigo;
  }

  function emitirConstancias(proyectoId) {
    var p = proyecto(proyectoId); if (!p) return { ok: false, error: 'Proyecto no encontrado.' };
    if (p.estado !== 'aprobado')
      return { ok: false, error: 'Solo se emiten constancias de proyectos aprobados por el mentor y la empresa.' };
    var u = Auth.actual();
    var r = reto(p.retoId);
    var emitidas = [];

    Store.tx(function () {
      p.estudianteIds.forEach(function (id) {
        if (constanciasDe(id).some(function (c) { return c.proyectoId === p.id; })) return;
        var est = usuario(id);
        var habs = U.unique((r.habilidadesRequeridas || []).map(function (h) { return h.skill; })
          .filter(function (s) { return (est.habilidades || []).some(function (x) { return x.skill === s; }); })
          .concat((est.habilidades || []).map(function (x) { return x.skill; })
            .filter(function (s) { return (r.habilidadesDeseables || []).indexOf(s) !== -1; })))
          .map(habilidadNombre);
        if (!habs.length) habs = (r.habilidadesRequeridas || []).map(function (h) { return habilidadNombre(h.skill); });

        var c = {
          id: U.uid('c'), codigo: generarCodigo(), proyectoId: p.id, estudianteId: id,
          emitidaAt: U.hoy(), emitidaPorId: u ? u.id : null, estado: 'vigente',
          snapshot: {
            estudiante: est.nombre, codigoUPN: est.codigoUPN, carrera: est.carrera,
            reto: r.titulo, empresa: empresaNombre(r.empresaId),
            mentor: nombre(p.mentorId), coordinador: u ? u.nombre : 'Coordinación UPN',
            rol: p.liderId === id ? 'Líder de equipo' : 'Integrante',
            inicio: p.inicio, fin: p.fin, semanas: p.semanas,
            horas: horasProyecto(p, null) ? Math.round(horasProyecto(p) ) : r.horasSemana * p.semanas,
            puntaje: puntajeProyecto(p) || 0, categoria: r.categoria,
            habilidades: habs,
            logro: (p.entregaFinal && p.entregaFinal.resumen) ? U.truncar(p.entregaFinal.resumen, 240) : r.resultado
          }
        };
        Store.get().constancias.push(c);
        emitidas.push(c);

        est.portafolio = est.portafolio || [];
        est.portafolio.push({
          id: U.uid('pf'), constanciaId: c.id, proyectoId: p.id,
          titulo: r.titulo, empresa: c.snapshot.empresa, rol: c.snapshot.rol,
          relato: c.snapshot.logro, habilidades: c.snapshot.habilidades, visible: true,
          enlaces: [{ label: 'Verificar constancia', url: '#/verificar/' + c.codigo }]
        });

        notificar(id, 'constancia', 'Constancia emitida',
          'Ya puedes descargar tu constancia verificable del proyecto con ' + c.snapshot.empresa + '.',
          '#/constancia/' + c.codigo);
      });

      p.estado = 'cerrado';
      r.estado = 'finalizado';
      r.historial.push({ estado: 'finalizado', at: new Date().toISOString(), por: u ? u.id : null, nota: 'Constancias emitidas' });
      Store.auditar('constancia:emitir', 'proyecto', p.id, { cantidad: emitidas.length });
      notificar(p.empresaId, 'proyecto', 'Microproyecto cerrado',
        'El proyecto “' + r.titulo + '” se cerró formalmente. ¡Gracias por participar!', '#/proyecto/' + p.id);
      notificar(p.mentorId, 'proyecto', 'Microproyecto cerrado',
        'Se emitieron las constancias de “' + r.titulo + '”.', '#/proyecto/' + p.id);
    });

    return { ok: true, constancias: emitidas };
  }

  function anularConstancia(id, motivo) {
    var c = Store.find('constancias', id);
    if (!c) return { ok: false, error: 'Constancia no encontrada.' };
    if (!String(motivo || '').trim()) return { ok: false, error: 'Indica el motivo de la anulación.' };
    Store.tx(function () {
      c.estado = 'anulada'; c.motivoAnulacion = String(motivo).trim(); c.anuladaAt = U.hoy();
      var est = usuario(c.estudianteId);
      if (est && est.portafolio) est.portafolio = est.portafolio.filter(function (pf) { return pf.constanciaId !== c.id; });
      Store.auditar('constancia:anular', 'constancia', c.id, { motivo: motivo });
      notificar(c.estudianteId, 'constancia', 'Constancia anulada', String(motivo).trim(), '#/mis-constancias');
    });
    return { ok: true };
  }

  function verificar(codigo) {
    var c = constanciaPorCodigo(codigo);
    if (!c) return { encontrada: false };
    return { encontrada: true, constancia: c, vigente: c.estado === 'vigente' };
  }

  /* ================= Métricas ================= */
  function metricas() {
    var proyectosT = Store.all('proyectos');
    var cerrados = proyectosT.filter(function (p) { return p.estado === 'cerrado'; });
    var horas = U.sum(cerrados, function (p) { return horasProyecto(p) * p.estudianteIds.length; });
    var evs = [];
    proyectosT.forEach(function (p) { (p.evaluaciones || []).forEach(function (e) { evs.push(puntajeEval(e)); }); });
    return {
      empresas: empresas().length,
      estudiantes: estudiantes().length,
      retosPublicados: Store.where('retos', function (r) { return r.estado === 'publicado'; }).length,
      retosTotales: Store.all('retos').length,
      proyectosActivos: proyectosT.filter(function (p) { return ['en_curso', 'en_validacion'].indexOf(p.estado) !== -1; }).length,
      proyectosCerrados: cerrados.length,
      constancias: Store.where('constancias', function (c) { return c.estado === 'vigente'; }).length,
      horas: horas,
      satisfaccion: evs.length ? Math.round(U.sum(evs) / evs.length) : null
    };
  }

  return {
    usuario: usuario, nombre: nombre, empresaNombre: empresaNombre, reto: reto, proyecto: proyecto,
    habilidadNombre: habilidadNombre, categoria: categoria,
    estudiantes: estudiantes, empresas: empresas, mentores: mentores, coordinadores: coordinadores,
    proyectoDeReto: proyectoDeReto, postulacionesDe: postulacionesDe, postulacionDe: postulacionDe,
    proyectosDe: proyectosDe, constanciasDe: constanciasDe, constanciaPorCodigo: constanciaPorCodigo,
    cargaMentor: cargaMentor, tieneProyectoActivo: tieneProyectoActivo,
    proyectosCompletados: proyectosCompletados, ratingEstudiante: ratingEstudiante,
    puntajeEval: puntajeEval, puntajeProyecto: puntajeProyecto,
    progreso: progreso, semanaActual: semanaActual, horasProyecto: horasProyecto,
    notificar: notificar, notificacionesDe: notificacionesDe, noLeidas: noLeidas, marcarLeidas: marcarLeidas,
    crearReto: crearReto, transicionReto: transicionReto, transicionesPosibles: transicionesPosibles,
    postular: postular, retirarPostulacion: retirarPostulacion, decidirPostulacion: decidirPostulacion,
    conformarEquipo: conformarEquipo, entregarHito: entregarHito, revisarHito: revisarHito,
    agregarBitacora: agregarBitacora, entregaFinal: entregaFinal, evaluar: evaluar,
    emitirConstancias: emitirConstancias, anularConstancia: anularConstancia, verificar: verificar,
    metricas: metricas
  };
})();
