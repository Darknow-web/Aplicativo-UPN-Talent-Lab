/* 00-config.js — Constantes del dominio UPN Talent Lab */
window.CFG = (function () {
  var ROLES = {
    estudiante:   { label: 'Estudiante',      icono: '🎓', color: 'info' },
    empresa:      { label: 'Empresa',         icono: '🏪', color: 'brand' },
    mentor:       { label: 'Docente / Mentor', icono: '🧭', color: 'violeta' },
    coordinador:  { label: 'Coordinación UPN', icono: '🏛️', color: 'ok' }
  };

  /* Estados del reto y transiciones permitidas por rol */
  var RETO_ESTADOS = {
    borrador:     { label: 'Borrador',       chip: '' },
    en_revision:  { label: 'En revisión',    chip: 'chip--warn' },
    observado:    { label: 'Observado',      chip: 'chip--danger' },
    publicado:    { label: 'Publicado',      chip: 'chip--ok' },
    en_seleccion: { label: 'En selección',   chip: 'chip--info' },
    en_ejecucion: { label: 'En ejecución',   chip: 'chip--violeta' },
    finalizado:   { label: 'Finalizado',     chip: 'chip--dark' },
    rechazado:    { label: 'Rechazado',      chip: 'chip--danger' },
    cancelado:    { label: 'Cancelado',      chip: '' }
  };

  var RETO_TRANSICIONES = {
    borrador:     { en_revision: ['empresa', 'coordinador'], cancelado: ['empresa', 'coordinador'] },
    en_revision:  { publicado: ['coordinador'], observado: ['coordinador'], rechazado: ['coordinador'] },
    observado:    { en_revision: ['empresa', 'coordinador'], cancelado: ['empresa', 'coordinador'] },
    publicado:    { en_seleccion: ['coordinador'], cancelado: ['coordinador'] },
    en_seleccion: { en_ejecucion: ['coordinador'], publicado: ['coordinador'], cancelado: ['coordinador'] },
    en_ejecucion: { finalizado: ['coordinador'] },
    finalizado:   {},
    rechazado:    { borrador: ['coordinador'] },
    cancelado:    {}
  };

  var PROYECTO_ESTADOS = {
    en_curso:      { label: 'En curso',        chip: 'chip--violeta' },
    en_validacion: { label: 'En validación',   chip: 'chip--warn' },
    aprobado:      { label: 'Aprobado',        chip: 'chip--ok' },
    cerrado:       { label: 'Cerrado',         chip: 'chip--dark' }
  };

  var HITO_ESTADOS = {
    pendiente:  { label: 'Pendiente',  chip: '' },
    entregado:  { label: 'Entregado',  chip: 'chip--info' },
    observado:  { label: 'Observado',  chip: 'chip--warn' },
    aprobado:   { label: 'Aprobado',   chip: 'chip--ok' }
  };

  var CATEGORIAS = {
    marketing:    { label: 'Marketing y redes',    icono: '📣' },
    diseno:       { label: 'Diseño y marca',       icono: '🎨' },
    datos:        { label: 'Datos y reportes',     icono: '📊' },
    tecnologia:   { label: 'Tecnología y web',     icono: '💻' },
    negocios:     { label: 'Negocios y finanzas',  icono: '💼' },
    operaciones:  { label: 'Procesos y operaciones', icono: '⚙️' },
    comunicacion: { label: 'Comunicación y contenido', icono: '✍️' }
  };

  /* Catálogo de habilidades: id -> {nombre, categoria} */
  var HABILIDADES = {
    community:   { nombre: 'Community management', categoria: 'marketing' },
    contenido:   { nombre: 'Creación de contenido', categoria: 'marketing' },
    metaads:     { nombre: 'Publicidad en Meta Ads', categoria: 'marketing' },
    seo:         { nombre: 'SEO', categoria: 'marketing' },
    copy:        { nombre: 'Copywriting', categoria: 'comunicacion' },
    fotografia:  { nombre: 'Fotografía de producto', categoria: 'diseno' },
    video:       { nombre: 'Edición de video', categoria: 'diseno' },
    canva:       { nombre: 'Canva / piezas gráficas', categoria: 'diseno' },
    illustrator: { nombre: 'Illustrator', categoria: 'diseno' },
    branding:    { nombre: 'Identidad de marca', categoria: 'diseno' },
    excel:       { nombre: 'Excel avanzado', categoria: 'datos' },
    powerbi:     { nombre: 'Power BI', categoria: 'datos' },
    sql:         { nombre: 'SQL', categoria: 'datos' },
    analitica:   { nombre: 'Analítica web', categoria: 'datos' },
    wordpress:   { nombre: 'WordPress', categoria: 'tecnologia' },
    ecommerce:   { nombre: 'E-commerce', categoria: 'tecnologia' },
    frontend:    { nombre: 'Desarrollo web', categoria: 'tecnologia' },
    automatiza:  { nombre: 'Automatización de tareas', categoria: 'tecnologia' },
    costos:      { nombre: 'Costos y precios', categoria: 'negocios' },
    finanzas:    { nombre: 'Finanzas básicas', categoria: 'negocios' },
    ventas:      { nombre: 'Técnicas de venta', categoria: 'negocios' },
    atencion:    { nombre: 'Atención al cliente', categoria: 'negocios' },
    inventarios: { nombre: 'Gestión de inventarios', categoria: 'operaciones' },
    procesos:    { nombre: 'Mejora de procesos', categoria: 'operaciones' },
    logistica:   { nombre: 'Logística', categoria: 'operaciones' },
    seguridad:   { nombre: 'Seguridad y salud ocupacional', categoria: 'operaciones' },
    redaccion:   { nombre: 'Redacción corporativa', categoria: 'comunicacion' },
    encuestas:   { nombre: 'Estudios de mercado', categoria: 'negocios' }
  };

  /* Afinidad carrera -> categorías (para el matching) */
  var CARRERAS = {
    'Administración y Marketing':      ['marketing', 'negocios', 'comunicacion'],
    'Comunicación Audiovisual':        ['diseno', 'comunicacion', 'marketing'],
    'Diseño Gráfico':                  ['diseno', 'marketing'],
    'Ingeniería de Sistemas':          ['tecnologia', 'datos'],
    'Ingeniería Industrial':           ['operaciones', 'datos', 'negocios'],
    'Contabilidad y Finanzas':         ['negocios', 'datos'],
    'Administración de Empresas':      ['negocios', 'operaciones', 'marketing'],
    'Ciencias de la Comunicación':     ['comunicacion', 'marketing'],
    'Ingeniería Empresarial':          ['operaciones', 'negocios', 'tecnologia'],
    'Psicología':                      ['comunicacion', 'negocios']
  };

  var CAMPUS = ['Trujillo San Isidro', 'Trujillo El Molino', 'Lima Los Olivos', 'Lima San Juan de Lurigancho', 'Lima Breña', 'Cajamarca'];

  var MODALIDADES = { remoto: 'Remoto', hibrido: 'Híbrido', presencial: 'Presencial' };

  /* Plantillas de hitos según duración del reto */
  var PLANTILLA_HITOS = {
    2: [
      { titulo: 'Diagnóstico y propuesta', descripcion: 'Levantar información con la empresa, analizar la situación actual y presentar el plan de trabajo.' },
      { titulo: 'Producción y entrega', descripcion: 'Ejecutar la solución acordada y entregar los productos finales a la empresa.' }
    ],
    3: [
      { titulo: 'Diagnóstico', descripcion: 'Reunión de arranque, levantamiento de información y análisis de la situación actual.' },
      { titulo: 'Propuesta y producción', descripcion: 'Diseñar la solución, validarla con el mentor y producir los entregables.' },
      { titulo: 'Entrega y cierre', descripcion: 'Entregar resultados, capacitar a la empresa y documentar el trabajo.' }
    ],
    4: [
      { titulo: 'Diagnóstico', descripcion: 'Reunión de arranque con la empresa, levantamiento de información y análisis de la situación actual.' },
      { titulo: 'Propuesta', descripcion: 'Diseñar la solución y validarla con el mentor y la empresa.' },
      { titulo: 'Producción', descripcion: 'Ejecutar la propuesta y construir los entregables comprometidos.' },
      { titulo: 'Entrega y cierre', descripcion: 'Entregar resultados, capacitar a la empresa y documentar el trabajo.' }
    ]
  };

  /* Rúbrica de evaluación (1 a 5 por criterio) */
  var RUBRICA = [
    { id: 'cumplimiento', label: 'Cumplimiento de entregables', ayuda: '¿Entregó lo comprometido y a tiempo?' },
    { id: 'calidad',      label: 'Calidad del trabajo',          ayuda: '¿El resultado es aplicable y está bien hecho?' },
    { id: 'comunicacion', label: 'Comunicación',                 ayuda: '¿Informó avances con claridad y a tiempo?' },
    { id: 'autonomia',    label: 'Autonomía y actitud',          ayuda: '¿Propuso soluciones sin depender de indicaciones constantes?' },
    { id: 'impacto',      label: 'Impacto para la empresa',      ayuda: '¿El trabajo aporta valor real al negocio?' }
  ];

  /* Pesos del algoritmo de matching (suman 100) */
  var PESOS_MATCH = {
    cobertura: 40,     // habilidades requeridas cubiertas (ponderadas por importancia)
    nivel: 15,         // profundidad del nivel declarado
    disponibilidad: 12,
    afinidad: 10,      // carrera / intereses vs categoría del reto
    ciclo: 6,
    modalidad: 5,
    historial: 7,
    deseables: 5
  };

  var HORAS_POR_SEMANA_DEFECTO = 10;

  return {
    APP: 'UPN Talent Lab',
    SCHEMA: 3,
    KEY_DB: 'utl.db',
    KEY_SESSION: 'utl.session',
    KEY_TEMA: 'utl.tema',
    ROLES: ROLES,
    RETO_ESTADOS: RETO_ESTADOS,
    RETO_TRANSICIONES: RETO_TRANSICIONES,
    PROYECTO_ESTADOS: PROYECTO_ESTADOS,
    HITO_ESTADOS: HITO_ESTADOS,
    CATEGORIAS: CATEGORIAS,
    HABILIDADES: HABILIDADES,
    CARRERAS: CARRERAS,
    CAMPUS: CAMPUS,
    MODALIDADES: MODALIDADES,
    PLANTILLA_HITOS: PLANTILLA_HITOS,
    RUBRICA: RUBRICA,
    PESOS_MATCH: PESOS_MATCH,
    HORAS_POR_SEMANA_DEFECTO: HORAS_POR_SEMANA_DEFECTO
  };
})();
