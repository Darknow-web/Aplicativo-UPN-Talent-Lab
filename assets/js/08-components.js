/* 08-components.js — Piezas de interfaz reutilizables (devuelven Raw seguro) */
window.C = (function () {
  var h = U.html, raw = U.raw;

  /* ---------- Iconos SVG inline ---------- */
  var PATHS = {
    inicio: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    retos: '<path d="M4 5h16v14H4z"/><path d="M8 3v4M16 3v4M4 10h16"/>',
    brujula: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    maletin: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
    personas: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.5M17 20a6 6 0 0 0-2-4.4"/>',
    medalla: '<circle cx="12" cy="9" r="5"/><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5"/>',
    campana: '<path d="M18 15V10a6 6 0 1 0-12 0v5l-2 3h16z"/><path d="M10 21h4"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    escudo: '<path d="M12 3l8 3v6c0 4.5-3.2 8.2-8 9-4.8-.8-8-4.5-8-9V6z"/>',
    ayuda: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.3"/><path d="M12 17h.01"/>',
    ajustes: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    mas: '<path d="M12 5v14M5 12h14"/>',
    lupa: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    volver: '<path d="M15 18l-6-6 6-6"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    edificio: '<path d="M4 21V6a1 1 0 0 1 1-1h6v16"/><path d="M11 10h8a1 1 0 0 1 1 1v10"/><path d="M7 9h1M7 13h1M7 17h1M15 14h1M15 18h1"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
    salir: '<path d="M10 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/><path d="M16 17l5-5-5-5M21 12H9"/>',
    imprimir: '<path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="7" rx="2"/><path d="M7 16h10v5H7z"/>',
    grafico: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'
  };
  function icono(n, size) {
    var p = PATHS[n] || PATHS.doc;
    return raw('<svg viewBox="0 0 24 24" width="' + (size || 20) + '" height="' + (size || 20) +
      '" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>');
  }

  /* ---------- Identidad ---------- */
  function avatar(user, clase) {
    if (!user) return h`<span class="avatar ${clase || ''}">?</span>`;
    if (user.rol === 'empresa' && user.logo) return h`<span class="avatar ${clase || ''}" aria-hidden="true">${user.logo}</span>`;
    return h`<span class="avatar ${clase || ''}" aria-hidden="true">${U.iniciales(user.nombre)}</span>`;
  }
  function persona(user, sub, clase) {
    if (!user) return h``;
    return h`<span class="persona">
      ${avatar(user, clase || 'avatar--sm')}
      <span style="min-width:0">
        <span class="persona__n">${user.rol === 'empresa' ? (user.razonSocial || user.nombre) : user.nombre}</span>
        ${sub ? h`<span class="persona__r">${sub}</span>` : ''}
      </span>
    </span>`;
  }
  function chipRol(rol) {
    var r = CFG.ROLES[rol]; if (!r) return h``;
    return h`<span class="chip chip--${r.color === 'brand' ? 'brand' : r.color}">${r.icono} ${r.label}</span>`;
  }

  /* ---------- Estados ---------- */
  function chipReto(reto) {
    var e = CFG.RETO_ESTADOS[reto.estado] || { label: reto.estado, chip: '' };
    return h`<span class="chip ${e.chip}">${e.label}</span>`;
  }
  function chipProyecto(p) {
    var e = CFG.PROYECTO_ESTADOS[p.estado] || { label: p.estado, chip: '' };
    return h`<span class="chip ${e.chip}">${e.label}</span>`;
  }
  function chipHito(hito) {
    var e = CFG.HITO_ESTADOS[hito.estado] || { label: hito.estado, chip: '' };
    return h`<span class="chip ${e.chip}">${e.label}</span>`;
  }
  function chipCategoria(cat) {
    var c = M.categoria(cat);
    return h`<span class="chip chip--brand">${c.icono} ${c.label}</span>`;
  }
  function chipsHabilidades(skills, max) {
    var lista = (skills || []).slice(0, max || 99);
    var resto = (skills || []).length - lista.length;
    return h`<span class="chips">
      ${lista.map(function (s) {
        var id = typeof s === 'string' ? s : s.skill;
        var extra = (typeof s === 'object' && s.nivelMin) ? ' · ' + M.nivelLabel(s.nivelMin) + '+' : '';
        var critico = (typeof s === 'object' && s.peso === 3);
        return h`<span class="chip ${critico ? 'chip--dark' : ''}">${M.habilidadNombre(id)}${extra}</span>`;
      })}
      ${resto > 0 ? h`<span class="chip">+${resto}</span>` : ''}
    </span>`;
  }


  /* Habilidad declarada por un estudiante: nivel + qué tan sustentado está. */
  function chipHabilidad(hab, conNivel) {
    var estado = M.estadoHabilidad(hab);
    var r = CFG.RESPALDOS[estado];
    var titulo = M.nivelLabel(hab.nivel) + ' · ' + r.label + '. ' +
      (hab.respaldoDetalle ? hab.respaldoDetalle : r.ayuda);
    return h`<span class="chip ${r.chip}" title="${titulo}">
      ${M.habilidadNombre(hab.skill)}${conNivel === false ? '' : ' · ' + M.nivelLabel(hab.nivel)}
      ${estado === 'verificado' ? raw('<b aria-label="verificada">✓</b>') : ''}
    </span>`;
  }

  /* ---------- Progreso y match ---------- */
  function progreso(pct, ok) {
    return h`<div class="progress ${ok ? 'progress--ok' : ''}" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
      <div class="progress__bar" style="width:${U.clamp(pct, 0, 100)}%"></div>
    </div>`;
  }
  function medidor(pct, ok) {
    return h`<div class="meter">${progreso(pct, ok)}<b>${pct}%</b></div>`;
  }
  function anilloMatch(match, etiqueta) {
    var b = Matching.BANDAS[match.banda] || Matching.BANDAS.baja;
    return h`<span class="match ${b.clase}" title="${b.label}">
      <span class="match__ring" style="--p:${match.total}"><span>${match.total}</span></span>
      ${etiqueta ? h`<span class="tiny"><b>${b.label}</b></span>` : ''}
    </span>`;
  }
  function desgloseMatch(match) {
    return h`<ul class="breakdown">
      ${match.desglose.map(function (d) {
        return h`<li>
          <span><b>${d.label}</b><br><span class="muted tiny">${d.detalle}</span></span>
          <span class="nowrap"><b>${Math.round(d.puntos)}</b><span class="muted tiny">/${d.max}</span></span>
          ${progreso(Math.round((d.puntos / d.max) * 100))}
        </li>`;
      })}
      ${(match.ajustes || []).map(function (a) {
        return h`<li><span class="tiny ${a.v < 0 ? 'muted' : ''}">${a.v > 0 ? '➕' : '➖'} ${a.txt}</span><span class="tiny nowrap">${a.v > 0 ? '+' : ''}${a.v}</span></li>`;
      })}
    </ul>`;
  }
  function estrellas(n) {
    var full = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6.5 7 .9-5 4.8 1.2 7L12 17.8 5.8 21.2 7 14.2 2 9.4l7-.9z"/></svg>';
    var empty = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3 6.5 7 .9-5 4.8 1.2 7L12 17.8 5.8 21.2 7 14.2 2 9.4l7-.9z"/></svg>';
    var s = '';
    for (var i = 1; i <= 5; i++) s += (i <= n ? full : empty);
    return h`<span class="stars" aria-label="${n} de 5">${raw(s)}</span>`;
  }

  /* ---------- Contenedores ---------- */
  /* nivel: 'h1' cuando el estado vacío es la pantalla completa (404, sin permiso),
     'h3' (por defecto) cuando va dentro de una sección que ya tiene su encabezado. */
  function vacio(ico, titulo, texto, cta, nivel) {
    var t = nivel === 'h1' ? 'h1' : 'h3';
    return h`<div class="empty">
      <div class="empty__ico" aria-hidden="true">${ico}</div>
      ${raw('<' + t + '>' + U.esc(titulo) + '</' + t + '>')}
      <p>${texto}</p>
      ${cta || ''}
    </div>`;
  }
  function stat(k, v, d, brand) {
    return h`<div class="stat ${brand ? 'stat--brand' : ''}">
      <div class="stat__k">${k}</div>
      <div class="stat__v">${v}</div>
      ${d ? h`<div class="stat__d">${d}</div>` : ''}
    </div>`;
  }
  function aviso(tipo, ico, texto) {
    return h`<div class="notice notice--${tipo}"><span class="notice__ico" aria-hidden="true">${ico}</span><p>${texto}</p></div>`;
  }
  function volver(href, texto) {
    return h`<a class="btn btn--ghost btn--sm no-print" href="${href}">${icono('volver', 16)} ${texto || 'Volver'}</a>`;
  }
  function pageHead(titulo, sub, acciones) {
    return h`<div class="page-head">
      <div class="page-head__txt"><h1>${titulo}</h1>${sub ? h`<p>${sub}</p>` : ''}</div>
      ${acciones ? h`<div class="page-head__actions">${acciones}</div>` : ''}
    </div>`;
  }

  /* ---------- Formularios ---------- */
  function campo(o) {
    var id = o.id || ('f_' + o.name);
    var comun = 'id="' + U.esc(id) + '" name="' + U.esc(o.name) + '"' +
      (o.required ? ' required' : '') + (o.placeholder ? ' placeholder="' + U.esc(o.placeholder) + '"' : '') +
      (o.min !== undefined ? ' min="' + U.esc(o.min) + '"' : '') + (o.max !== undefined ? ' max="' + U.esc(o.max) + '"' : '') +
      (o.maxlength ? ' maxlength="' + U.esc(o.maxlength) + '"' : '') +
      (o.disabled ? ' disabled' : '');
    var control;
    if (o.tipo === 'textarea') {
      control = raw('<textarea class="textarea" ' + comun + (o.rows ? ' rows="' + o.rows + '"' : '') + '>' + U.esc(o.valor || '') + '</textarea>');
    } else if (o.tipo === 'select') {
      control = h`<select class="select" ${raw(comun)}>
        ${o.vacio ? h`<option value="">${o.vacio}</option>` : ''}
        ${(o.opciones || []).map(function (op) {
          var val = op.value !== undefined ? op.value : op;
          var lab = op.label !== undefined ? op.label : op;
          return raw('<option value="' + U.esc(val) + '"' + (String(o.valor) === String(val) ? ' selected' : '') + '>' + U.esc(lab) + '</option>');
        })}
      </select>`;
    } else {
      control = raw('<input class="input" type="' + U.esc(o.tipo || 'text') + '" ' + comun +
        ' value="' + U.esc(o.valor === undefined || o.valor === null ? '' : o.valor) + '">');
    }
    return h`<div class="field">
      <label for="${id}">${o.label}${o.required ? raw(' <span aria-hidden="true" style="color:var(--danger)">*</span>') : ''}</label>
      ${control}
      ${o.ayuda ? h`<p class="field__hint">${o.ayuda}</p>` : ''}
    </div>`;
  }

  function checkHabilidades(name, seleccionadas, categoriasFiltro) {
    seleccionadas = seleccionadas || [];
    var ids = Object.keys(CFG.HABILIDADES).filter(function (k) {
      return !categoriasFiltro || categoriasFiltro.indexOf(CFG.HABILIDADES[k].categoria) !== -1;
    });
    return h`<div class="checkgrid checkgrid--3">
      ${ids.map(function (k) {
        var on = seleccionadas.indexOf(k) !== -1;
        return raw('<label class="checkline' + (on ? ' checkline--on' : '') + '">' +
          '<input type="checkbox" name="' + U.esc(name) + '[]" value="' + U.esc(k) + '"' + (on ? ' checked' : '') + '>' +
          '<span>' + U.esc(CFG.HABILIDADES[k].nombre) + '</span></label>');
      })}
    </div>`;
  }

  function selectorEstrellas(name, valor) {
    return h`<div class="starpick" role="radiogroup">
      ${[1, 2, 3, 4, 5].map(function (n) {
        return raw('<input type="radio" id="' + U.esc(name + n) + '" name="' + U.esc(name) + '" value="' + n + '"' +
          (String(valor) === String(n) ? ' checked' : '') + '>' +
          '<label for="' + U.esc(name + n) + '" title="' + n + ' de 5">' + n + '</label>');
      })}
    </div>`;
  }

  /* ---------- Tarjeta de reto ---------- */
  function cardReto(r, opts) {
    opts = opts || {};
    var emp = M.usuario(r.empresaId);
    var m = opts.match;
    var post = M.postulacionesDe(r.id).length;
    return h`<a class="card card--link" href="#/reto/${r.id}">
      <div class="card__head">
        ${avatar(emp)}
        <div class="hcol">
          <h3 class="card__title">${r.titulo}</h3>
          <p class="tiny muted mb0">${emp ? (emp.razonSocial || emp.nombre) : ''} · ${emp ? emp.distrito : ''}</p>
        </div>
        ${m ? anilloMatch(m) : chipReto(r)}
      </div>
      <p class="small muted">${U.truncar(r.problema, 130)}</p>
      <div class="chips">
        ${chipCategoria(r.categoria)}
        <span class="chip">${icono('reloj', 13)} ${r.semanas} semanas</span>
        <span class="chip">${r.tamanoEquipo} ${U.plural(r.tamanoEquipo, 'vacante')}</span>
        <span class="chip">${CFG.MODALIDADES[r.modalidad]}</span>
      </div>
      <div class="card__foot">
        <span class="tiny muted">${chipsHabilidades((r.habilidadesRequeridas || []).map(function (x) { return x.skill; }), 3)}</span>
        ${opts.mostrarPostulantes !== false && post ? h`<span class="tiny muted nowrap">${post} ${U.plural(post, 'postulante')}</span>` : ''}
      </div>
    </a>`;
  }

  /* ---------- Tarjeta de proyecto ---------- */
  function cardProyecto(p) {
    var r = M.reto(p.retoId);
    var pct = M.progreso(p);
    return h`<a class="card card--link" href="#/proyecto/${p.id}">
      <div class="card__head">
        <div class="hcol">
          <p class="tiny muted mb0">${p.codigo}</p>
          <h3 class="card__title">${r ? r.titulo : 'Proyecto'}</h3>
          <p class="tiny muted mb0">${M.empresaNombre(p.empresaId)}</p>
        </div>
        ${chipProyecto(p)}
      </div>
      ${medidor(pct, p.estado === 'cerrado')}
      <div class="card__foot">
        <span class="avatar-stack">${(p.estudianteIds || []).map(function (id) { return avatar(M.usuario(id), 'avatar--sm'); })}</span>
        <span class="tiny muted">${U.fecha(p.inicio)} → ${U.fecha(p.fin)}</span>
      </div>
    </a>`;
  }


  /* ---------- Próximas acciones ----------
     Calcula qué puede hacer AHORA el usuario según el estado real de sus datos
     y lo muestra como pasos con botón directo. Es lo que evita que alguien
     entre y no sepa por dónde empezar. */
  function proximasAcciones(u) {
    var a = [];
    if (!u) return a;

    if (u.rol === 'estudiante') {
      var proys = M.proyectosDe(u.id);
      var activo = proys.filter(function (p) { return p.estado === 'en_curso'; })[0];
      if (activo) {
        var hito = (activo.hitos || []).filter(function (h) {
          return h.estado === 'pendiente' || h.estado === 'observado';
        })[0];
        if (hito) {
          a.push({ ico: '📤', txt: hito.estado === 'observado'
              ? 'Corregir el hito “' + hito.titulo + '”, tu mentor pidió cambios'
              : 'Entregar el hito “' + hito.titulo + '”',
            btn: 'Ir al hito', href: '#/proyecto/' + activo.id + '?tab=hitos', destacado: true });
        } else if (!activo.entregaFinal) {
          a.push({ ico: '📦', txt: 'Todos tus hitos están aprobados: envía la entrega final',
            btn: 'Enviar entrega', href: '#/proyecto/' + activo.id + '?tab=entrega', destacado: true });
        }
        a.push({ ico: '📓', txt: 'Registra tus horas y avances en la bitácora',
          btn: 'Escribir', href: '#/proyecto/' + activo.id + '?tab=bitacora' });
      } else {
        var mejor = Matching.retosPara(u.id)[0];
        if (mejor) {
          a.push({ ico: '🎯', txt: 'Postula al reto que mejor calza contigo: “' +
              U.truncar(mejor.reto.titulo, 42) + '” (' + mejor.match.total + '% de compatibilidad)',
            btn: 'Ver el reto', href: '#/reto/' + mejor.reto.id, destacado: true });
        }
      }
      if ((u.habilidades || []).length < 3) {
        a.push({ ico: '✨', txt: 'Agrega tus habilidades para recibir mejores recomendaciones',
          btn: 'Completar perfil', href: '#/perfil' });
      }
      if (M.constanciasDe(u.id).filter(function (c) { return c.estado === 'vigente'; }).length) {
        a.push({ ico: '🏅', txt: 'Descarga tu constancia o comparte tu portafolio',
          btn: 'Ver constancias', href: '#/constancias' });
      }
    }

    if (u.rol === 'empresa') {
      var mios = Store.where('retos', function (r) { return r.empresaId === u.id; });
      var borrador = mios.filter(function (r) { return ['borrador', 'observado'].indexOf(r.estado) !== -1; })[0];
      var porEvaluar = M.proyectosDe(u.id).filter(function (p) { return Auth.can('evaluar:empresa', p); })[0];
      var enCurso = M.proyectosDe(u.id).filter(function (p) { return p.estado === 'en_curso'; })[0];

      if (porEvaluar) a.push({ ico: '⭐', txt: 'Recibiste una entrega: revísala y evalúala',
        btn: 'Evaluar', href: '#/proyecto/' + porEvaluar.id + '?tab=evaluacion', destacado: true });
      if (borrador) a.push({ ico: '📝', txt: borrador.estado === 'observado'
          ? 'La UPN dejó observaciones en “' + U.truncar(borrador.titulo, 34) + '”'
          : 'Tienes un reto sin enviar a revisión',
        btn: 'Continuar', href: '#/reto/' + borrador.id, destacado: !porEvaluar });
      if (!mios.length) a.push({ ico: '🚀', txt: 'Publica tu primera necesidad y la UPN te propondrá un equipo',
        btn: 'Publicar reto', href: '#/reto/nuevo', destacado: true });
      if (enCurso) a.push({ ico: '📈', txt: 'Sigue el avance del equipo que trabaja para ti',
        btn: 'Ver avance', href: '#/proyecto/' + enCurso.id });
      if (!borrador && mios.length) a.push({ ico: '➕', txt: 'Publica otra necesidad',
        btn: 'Nuevo reto', href: '#/reto/nuevo' });
    }

    if (u.rol === 'mentor') {
      var asignados = M.proyectosDe(u.id);
      var conHito = null, hitoPend = null;
      asignados.forEach(function (p) {
        (p.hitos || []).forEach(function (h) {
          if (h.estado === 'entregado' && !conHito) { conHito = p; hitoPend = h; }
        });
      });
      var evaluar = asignados.filter(function (p) { return Auth.can('evaluar:mentor', p); })[0];
      if (conHito) a.push({ ico: '🔍', txt: 'Un equipo entregó “' + hitoPend.titulo + '”: apruébalo o pide cambios',
        btn: 'Revisar', href: '#/proyecto/' + conHito.id + '?tab=hitos', destacado: true });
      if (evaluar) a.push({ ico: '⭐', txt: 'Hay una entrega final esperando tu evaluación',
        btn: 'Evaluar', href: '#/proyecto/' + evaluar.id + '?tab=evaluacion', destacado: !conHito });
      if (!conHito && !evaluar) a.push({ ico: '✅', txt: 'No tienes pendientes. Revisa cómo van tus equipos',
        btn: 'Ver proyectos', href: '#/proyectos' });
    }

    if (u.rol === 'coordinador') {
      var revisar = Store.where('retos', function (r) { return r.estado === 'en_revision'; })[0];
      var armar = Store.where('retos', function (r) { return r.estado === 'en_seleccion'; })[0];
      var certificar = Store.where('proyectos', function (p) { return p.estado === 'aprobado'; })[0];
      if (revisar) a.push({ ico: '📋', txt: 'Una empresa envió “' + U.truncar(revisar.titulo, 36) + '” para revisión',
        btn: 'Revisar', href: '#/reto/' + revisar.id, destacado: true });
      if (armar) a.push({ ico: '🎯', txt: 'Un reto cerró postulaciones: arma el equipo',
        btn: 'Conformar', href: '#/matching/' + armar.id, destacado: !revisar });
      if (certificar) a.push({ ico: '🏅', txt: 'Un proyecto fue aprobado: emite las constancias',
        btn: 'Emitir', href: '#/proyecto/' + certificar.id + '?tab=evaluacion', destacado: !revisar && !armar });
      if (!revisar && !armar && !certificar) a.push({ ico: '✅', txt: 'Bandeja al día. Revisa los proyectos en marcha',
        btn: 'Ver proyectos', href: '#/proyectos' });
    }

    return a;
  }

  function tarjetaAcciones(u) {
    var acc = proximasAcciones(u);
    if (!acc.length) return h``;
    return h`<section class="acciones" aria-label="Qué puedes hacer ahora">
      <h2 class="acciones__t">${icono('brujula', 18)} ¿Qué puedes hacer ahora?</h2>
      <ol class="acciones__l">
        ${acc.slice(0, 4).map(function (x) {
          return h`<li>
            <a class="accion ${x.destacado ? 'accion--on' : ''}" href="${x.href}">
              <span class="accion__n" aria-hidden="true">${x.ico}</span>
              <span class="accion__t">${x.txt}<span class="accion__b">${x.btn}</span></span>
              <span class="accion__v" aria-hidden="true">${icono('volver', 16)}</span>
            </a>
          </li>`;
        })}
      </ol>
    </section>`;
  }

  return {
    icono: icono, avatar: avatar, persona: persona, chipRol: chipRol,
    chipReto: chipReto, chipProyecto: chipProyecto, chipHito: chipHito,
    chipCategoria: chipCategoria, chipsHabilidades: chipsHabilidades,
    progreso: progreso, medidor: medidor, anilloMatch: anilloMatch, desgloseMatch: desgloseMatch,
    estrellas: estrellas, vacio: vacio, stat: stat, aviso: aviso, volver: volver, pageHead: pageHead,
    campo: campo, checkHabilidades: checkHabilidades, selectorEstrellas: selectorEstrellas,
    cardReto: cardReto, cardProyecto: cardProyecto, chipHabilidad: chipHabilidad,
    proximasAcciones: proximasAcciones, tarjetaAcciones: tarjetaAcciones
  };
})();
