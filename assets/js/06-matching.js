/* 06-matching.js — Compatibilidad estudiante ↔ reto, armado de equipo y sugerencia de mentor.
   Funciones puras: reciben los objetos, no leen estado oculto. */
window.Matching = (function () {
  var W = CFG.PESOS_MATCH;

  function nivelDe(est, skill) {
    var h = (est.habilidades || []).filter(function (x) { return x.skill === skill; })[0];
    return h ? h.nivel : 0;
  }

  /* ---- Filtros duros: descartan al candidato con un motivo legible ---- */
  function filtroDuro(est, reto) {
    var criticas = (reto.habilidadesRequeridas || []).filter(function (h) { return h.peso === 3; });
    var faltantes = criticas.filter(function (h) { return nivelDe(est, h.skill) < h.nivelMin; });
    if (faltantes.length) {
      return { ok: false, motivo: 'No cumple el requisito indispensable: ' +
        faltantes.map(function (h) {
          return M.habilidadNombre(h.skill) + ' (' + M.nivelLabel(h.nivelMin) + ' o más)';
        }).join(', ') };
    }
    var minHoras = Math.ceil((reto.horasSemana || 10) * 0.7);
    if ((est.horasSemana || 0) < minHoras) {
      return { ok: false, motivo: 'Declara ' + (est.horasSemana || 0) + ' h/semana y el reto necesita al menos ' + minHoras + ' h.' };
    }
    if (reto.modalidad !== 'remoto' && est.modalidad === 'remoto' && reto.modalidad === 'presencial') {
      return { ok: false, motivo: 'El reto es presencial y el estudiante solo tiene disponibilidad remota.' };
    }
    return { ok: true };
  }

  /* ---- Puntaje 0–100 con desglose explicable ---- */
  function evaluar(est, reto) {
    if (!est || !reto) return { total: 0, banda: 'baja', desglose: [], descartado: true, motivo: 'Datos incompletos.' };

    var duro = filtroDuro(est, reto);
    var req = reto.habilidadesRequeridas || [];
    var pesoTotal = U.sum(req, function (h) { return h.peso; }) || 1;
    var desglose = [];

    /* A. Cobertura de habilidades requeridas */
    var cubiertas = req.filter(function (h) { return nivelDe(est, h.skill) > 0; });
    var pCob = U.sum(cubiertas, function (h) { return h.peso; }) / pesoTotal;
    desglose.push({
      id: 'cobertura', label: 'Habilidades requeridas', max: W.cobertura,
      puntos: pCob * W.cobertura,
      detalle: cubiertas.length + ' de ' + req.length + ' habilidades pedidas' +
        (cubiertas.length ? ': ' + cubiertas.map(function (h) { return M.habilidadNombre(h.skill); }).join(', ') : '')
    });

    /* B. Profundidad de nivel declarado */
    var pNivel = U.sum(req, function (h) {
      return h.peso * Math.min(1, nivelDe(est, h.skill) / (h.nivelMin || 1));
    }) / pesoTotal;
    desglose.push({
      id: 'nivel', label: 'Nivel declarado', max: W.nivel, puntos: pNivel * W.nivel,
      detalle: pNivel >= 0.99 ? 'Alcanza o supera el nivel pedido en todas' :
               (pNivel >= 0.7 ? 'Cerca del nivel pedido' : 'Por debajo del nivel pedido en varias')
    });

    /* B2. Respaldo de ese nivel. Un nivel sin sustento vale la mitad que uno
       verificado por un docente: la app premia lo que se puede probar, no lo
       que se afirma. Quien empieza sin nada pierde puntos, no queda fuera. */
    var VALOR_RESPALDO = { declarado: 0, respaldado: 0.6, verificado: 1 };
    var estados = { declarado: 0, respaldado: 0, verificado: 0 };
    var pRespaldo = U.sum(req, function (r) {
      var h = M.habilidadDe(est, r.skill);
      if (!h) return 0;
      var e = M.estadoHabilidad(h);
      estados[e]++;
      return r.peso * VALOR_RESPALDO[e];
    }) / pesoTotal;
    var detRespaldo;
    if (estados.verificado) detRespaldo = estados.verificado + ' verificada' + (estados.verificado === 1 ? '' : 's') + ' por un docente';
    else if (estados.respaldado) detRespaldo = estados.respaldado + ' con certificado o trabajo propio, sin revisar aún';
    else detRespaldo = 'Ninguna habilidad tiene respaldo adjunto todavía';
    desglose.push({
      id: 'respaldo', label: 'Respaldo del nivel', max: W.respaldo,
      puntos: pRespaldo * W.respaldo, detalle: detRespaldo
    });

    /* C. Disponibilidad horaria */
    var need = reto.horasSemana || 10;
    var ratio = Math.min(1, (est.horasSemana || 0) / need);
    desglose.push({
      id: 'disponibilidad', label: 'Disponibilidad', max: W.disponibilidad, puntos: ratio * W.disponibilidad,
      detalle: (est.horasSemana || 0) + ' h/semana disponibles frente a ' + need + ' h requeridas'
    });

    /* D. Afinidad carrera / intereses */
    var afines = CFG.CARRERAS[est.carrera] || [];
    var intereses = est.intereses || [];
    var pAfin = 0, detAfin = 'Sin relación directa con su carrera';
    if (intereses.indexOf(reto.categoria) !== -1) { pAfin = 1; detAfin = 'Es un área que declaró como interés'; }
    else if (afines.indexOf(reto.categoria) !== -1) { pAfin = 0.7; detAfin = 'Su carrera (' + est.carrera + ') se relaciona con el área'; }
    else if (afines.length && afines.indexOf(reto.categoria) === -1 && cubiertas.length) { pAfin = 0.3; detAfin = 'Tiene habilidades del área aunque su carrera es otra'; }
    desglose.push({ id: 'afinidad', label: 'Afinidad con el área', max: W.afinidad, puntos: pAfin * W.afinidad, detalle: detAfin });

    /* E. Ciclo académico */
    var complejidad = (reto.semanas || 3) + (req.filter(function (h) { return h.peso === 3; }).length);
    var idealMin = complejidad >= 7 ? 6 : 4;
    var ciclo = est.ciclo || 1;
    var pCiclo = ciclo >= idealMin ? 1 : (ciclo >= idealMin - 1 ? 0.65 : 0.25);
    desglose.push({
      id: 'ciclo', label: 'Ciclo académico', max: W.ciclo, puntos: pCiclo * W.ciclo,
      detalle: 'Ciclo ' + ciclo + (pCiclo === 1 ? ' — adecuado para la complejidad del reto' : ' — algo temprano para este reto')
    });

    /* F. Modalidad y ubicación */
    var pMod = 0, detMod = 'Modalidad distinta a la del reto';
    if (est.modalidad === reto.modalidad) { pMod = 1; detMod = 'Coincide la modalidad (' + CFG.MODALIDADES[reto.modalidad] + ')'; }
    else if (est.modalidad === 'hibrido' || reto.modalidad === 'remoto') { pMod = 0.7; detMod = 'Modalidad compatible'; }
    desglose.push({ id: 'modalidad', label: 'Modalidad', max: W.modalidad, puntos: pMod * W.modalidad, detalle: detMod });

    /* G. Desempeño histórico */
    var rating = M.ratingEstudiante(est.id);
    var completados = M.proyectosCompletados(est.id).length;
    var pHist = rating === null ? 0.5 : U.clamp(rating / 100, 0, 1);
    var bonoExp = Math.min(0.2, completados * 0.1);
    desglose.push({
      id: 'historial', label: 'Desempeño previo', max: W.historial,
      puntos: Math.min(1, pHist + bonoExp) * W.historial,
      detalle: rating === null ? 'Primera participación en Talent Lab' :
        (completados + ' ' + U.plural(completados, 'proyecto') + ' cerrado' + (completados === 1 ? '' : 's') + ' · promedio ' + rating + '/100')
    });

    /* H. Habilidades deseables */
    var des = reto.habilidadesDeseables || [];
    var desTiene = des.filter(function (s) { return nivelDe(est, s) > 0; });
    var pDes = des.length ? desTiene.length / des.length : 0.5;
    desglose.push({
      id: 'deseables', label: 'Habilidades deseables', max: W.deseables, puntos: pDes * W.deseables,
      detalle: des.length ? (desTiene.length + ' de ' + des.length + ' habilidades deseables') : 'El reto no pidió habilidades adicionales'
    });

    var total = U.sum(desglose, function (x) { return x.puntos; });

    /* Ajustes de equidad y compromiso */
    var ajustes = [];
    if (completados === 0) { total += 4; ajustes.push({ txt: 'Primera oportunidad en el programa', v: 4 }); }
    if (completados >= 2) { total -= 8; ajustes.push({ txt: 'Ya participó en 2 o más microproyectos', v: -8 }); }
    if (M.tieneProyectoActivo(est.id)) { total -= 25; ajustes.push({ txt: 'Tiene un microproyecto en curso', v: -25 }); }

    total = Math.round(U.clamp(total, 0, 100));

    return {
      total: duro.ok ? total : 0,
      descartado: !duro.ok,
      motivo: duro.ok ? '' : duro.motivo,
      banda: banda(duro.ok ? total : 0),
      desglose: desglose,
      ajustes: ajustes,
      faltantes: req.filter(function (h) { return nivelDe(est, h.skill) === 0; }).map(function (h) { return h.skill; })
    };
  }

  function banda(t) {
    if (t >= 80) return 'excelente';
    if (t >= 65) return 'buena';
    if (t >= 50) return 'aceptable';
    return 'baja';
  }
  var BANDAS = {
    excelente: { label: 'Compatibilidad excelente', clase: 'match--verde', chip: 'chip--ok' },
    buena:     { label: 'Buena compatibilidad',     clase: '',             chip: 'chip--brand' },
    aceptable: { label: 'Compatibilidad aceptable', clase: '',             chip: 'chip--warn' },
    baja:      { label: 'Compatibilidad baja',      clase: 'match--gris',  chip: '' }
  };

  /* ---- Ranking de postulantes de un reto ---- */
  function rankearPostulantes(retoId) {
    var r = M.reto(retoId);
    return U.sortBy(M.postulacionesDe(retoId).map(function (p) {
      var est = M.usuario(p.estudianteId);
      var res = evaluar(est, r);
      return { postulacion: p, estudiante: est, match: res };
    }), function (x) { return x.match.total; }, true);
  }

  /* ---- Retos recomendados para un estudiante ---- */
  function retosPara(estudianteId) {
    var est = M.usuario(estudianteId);
    return U.sortBy(Store.where('retos', function (r) { return r.estado === 'publicado'; }).map(function (r) {
      return { reto: r, match: evaluar(est, r) };
    }), function (x) { return x.match.total; }, true);
  }

  /* ---- Estudiantes candidatos (postulen o no) ---- */
  function candidatos(retoId) {
    var r = M.reto(retoId);
    return U.sortBy(M.estudiantes().map(function (est) {
      return { estudiante: est, match: evaluar(est, r), postulacion: M.postulacionDe(retoId, est.id) };
    }), function (x) { return x.match.total; }, true);
  }

  /* ---- Cobertura de habilidades de un conjunto de estudiantes ---- */
  function cobertura(retoId, estudianteIds) {
    var r = M.reto(retoId);
    var req = r.habilidadesRequeridas || [];
    var pesoTotal = U.sum(req, function (h) { return h.peso; }) || 1;
    var cubiertas = [], faltantes = [];
    req.forEach(function (h) {
      var alguien = estudianteIds.some(function (id) {
        var e = M.usuario(id);
        return e && nivelDe(e, h.skill) >= h.nivelMin;
      });
      (alguien ? cubiertas : faltantes).push(h);
    });
    return {
      pct: Math.round((U.sum(cubiertas, function (h) { return h.peso; }) / pesoTotal) * 100),
      cubiertas: cubiertas.map(function (h) { return h.skill; }),
      faltantes: faltantes.map(function (h) { return h.skill; })
    };
  }

  /* ---- Sugerencia de equipo: mejor puntaje + cobertura complementaria ---- */
  function sugerirEquipo(retoId, tamano) {
    var r = M.reto(retoId);
    tamano = tamano || r.tamanoEquipo || 2;
    var pool = rankearPostulantes(retoId).filter(function (x) {
      return !x.match.descartado && x.postulacion.estado !== 'no_seleccionada' && !M.tieneProyectoActivo(x.estudiante.id);
    });
    if (!pool.length) return { ids: [], cobertura: cobertura(retoId, []), pool: [] };

    var elegidos = [pool[0].estudiante.id];
    while (elegidos.length < tamano && elegidos.length < pool.length) {
      var base = cobertura(retoId, elegidos).pct;
      var mejor = null, mejorScore = -1;
      pool.forEach(function (c) {
        if (elegidos.indexOf(c.estudiante.id) !== -1) return;
        var ganancia = cobertura(retoId, elegidos.concat([c.estudiante.id])).pct - base;
        var score = 0.6 * c.match.total + 0.4 * (ganancia * 2);
        if (score > mejorScore) { mejorScore = score; mejor = c; }
      });
      if (!mejor) break;
      elegidos.push(mejor.estudiante.id);
    }
    return { ids: elegidos, cobertura: cobertura(retoId, elegidos), pool: pool };
  }

  /* ---- Sugerencia de mentor ---- */
  function sugerirMentores(retoId) {
    var r = M.reto(retoId);
    var req = (r.habilidadesRequeridas || []).map(function (h) { return h.skill; });
    return U.sortBy(M.mentores().map(function (m) {
      var coincide = req.filter(function (s) { return (m.habilidades || []).indexOf(s) !== -1; });
      var carga = M.cargaMentor(m.id);
      var max = m.maxProyectos || 3;
      var disponible = carga < max;
      var score = Math.round(
        60 * (req.length ? coincide.length / req.length : 0.5) +
        40 * (1 - carga / max)
      );
      return {
        mentor: m, score: disponible ? score : 0, disponible: disponible, carga: carga, max: max,
        coincidencias: coincide.map(M.habilidadNombre)
      };
    }), function (x) { return x.score; }, true);
  }

  return {
    evaluar: evaluar, filtroDuro: filtroDuro, banda: banda, BANDAS: BANDAS,
    rankearPostulantes: rankearPostulantes, retosPara: retosPara, candidatos: candidatos,
    cobertura: cobertura, sugerirEquipo: sugerirEquipo, sugerirMentores: sugerirMentores,
    nivelDe: nivelDe
  };
})();
