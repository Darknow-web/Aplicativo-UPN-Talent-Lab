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
    excel:       { nombre: 'Excel', categoria: 'datos' },
    powerbi:     { nombre: 'Power BI', categoria: 'datos' },
    sql:         { nombre: 'SQL', categoria: 'datos' },
    analitica:   { nombre: 'Analítica web', categoria: 'datos' },
    wordpress:   { nombre: 'WordPress', categoria: 'tecnologia' },
    ecommerce:   { nombre: 'E-commerce', categoria: 'tecnologia' },
    frontend:    { nombre: 'Desarrollo web', categoria: 'tecnologia' },
    automatiza:  { nombre: 'Automatización de tareas', categoria: 'tecnologia' },
    costos:      { nombre: 'Costos y precios', categoria: 'negocios' },
    finanzas:    { nombre: 'Finanzas', categoria: 'negocios' },
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

  /* Pesos del algoritmo de matching (suman 100).
     El nivel declarado pierde peso frente al respaldo que lo sostiene: la app
     deja de premiar lo que alguien dice y empieza a premiar lo que puede probar. */
  var PESOS_MATCH = {
    cobertura: 38,     // habilidades requeridas cubiertas (ponderadas por importancia)
    nivel: 10,         // profundidad del nivel declarado
    respaldo: 12,      // qué tan sustentado está ese nivel (certificado, trabajo, verificación)
    disponibilidad: 12,
    afinidad: 8,       // carrera / intereses vs categoría del reto
    ciclo: 5,
    modalidad: 5,
    historial: 5,
    deseables: 5
  };


  /* ---------- Niveles de habilidad ----------
     Definidos por la evidencia que los sostiene, no por autopercepción:
     así declarar un nivel deja de ser una opinión y pasa a ser una afirmación
     que se sostiene o no se sostiene. */
  var NIVELES = {
    1: { label: 'Básico',     corto: 'Bás.', afirma: 'Lo vi en un curso, lo uso con guía',
         respaldo: 'Se autodeclara, no necesita respaldo' },
    2: { label: 'Intermedio', corto: 'Int.', afirma: 'Lo he usado para resolver algo real, solo',
         respaldo: 'Certificado intermedio, o un trabajo propio que puedas mostrar' },
    3: { label: 'Avanzado',   corto: 'Avz.', afirma: 'Puedo hacerme cargo de punta a punta',
         respaldo: 'Certificado avanzado, o un microproyecto Talent Lab confirmado por un mentor' }
  };

  /* Estado del respaldo de una habilidad. Se calcula, no se guarda. */
  var RESPALDOS = {
    declarado:  { label: 'Declarado',  chip: '',            ayuda: 'Sin respaldo adjunto' },
    respaldado: { label: 'Respaldado', chip: 'chip--info',  ayuda: 'Tiene certificado o trabajo propio, falta revisarlo' },
    verificado: { label: 'Verificado', chip: 'chip--ok',    ayuda: 'Confirmado por un docente tras un trabajo real' }
  };

  /* ---------- Catálogo de certificados ----------
     Equivalencias definidas por la UPN entre certificaciones reconocidas y el
     nivel que acreditan. Es lo que evita que dos estudiantes con el mismo
     certificado se asignen niveles distintos. */
  var CERTIFICADOS = [
    { nombre: 'Microsoft Office Specialist: Excel Associate', emisor: 'Microsoft', skills: ['excel'], nivel: 2 },
    { nombre: 'Microsoft Office Specialist: Excel Expert', emisor: 'Microsoft', skills: ['excel'], nivel: 3 },
    { nombre: 'Microsoft PL-300: Power BI Data Analyst', emisor: 'Microsoft', skills: ['powerbi', 'analitica'], nivel: 3 },
    { nombre: 'Microsoft DP-900: Azure Data Fundamentals', emisor: 'Microsoft', skills: ['sql', 'analitica'], nivel: 1 },
    { nombre: 'Google Data Analytics Certificate', emisor: 'Google', skills: ['analitica', 'excel', 'sql'], nivel: 2 },
    { nombre: 'Google Analytics Individual Qualification', emisor: 'Google', skills: ['analitica'], nivel: 2 },
    { nombre: 'Google Ads Search Certification', emisor: 'Google', skills: ['metaads', 'seo'], nivel: 2 },
    { nombre: 'Google Digital Marketing & E-commerce', emisor: 'Google', skills: ['marketing', 'ecommerce', 'seo'], nivel: 2 },
    { nombre: 'Meta Social Media Marketing Professional', emisor: 'Meta', skills: ['community', 'metaads', 'contenido'], nivel: 2 },
    { nombre: 'Meta Certified Digital Marketing Associate', emisor: 'Meta', skills: ['metaads'], nivel: 2 },
    { nombre: 'HubSpot Inbound Marketing', emisor: 'HubSpot', skills: ['contenido', 'copy'], nivel: 1 },
    { nombre: 'HubSpot Content Marketing', emisor: 'HubSpot', skills: ['contenido', 'copy', 'seo'], nivel: 2 },
    { nombre: 'Adobe Certified Professional: Illustrator', emisor: 'Adobe', skills: ['illustrator', 'branding'], nivel: 3 },
    { nombre: 'Adobe Certified Professional: Photoshop', emisor: 'Adobe', skills: ['fotografia'], nivel: 3 },
    { nombre: 'Adobe Certified Professional: Premiere Pro', emisor: 'Adobe', skills: ['video'], nivel: 3 },
    { nombre: 'Canva Design School: Graphic Design Essentials', emisor: 'Canva', skills: ['canva'], nivel: 1 },
    { nombre: 'Canva Design School: Advanced Design', emisor: 'Canva', skills: ['canva'], nivel: 2 },
    { nombre: 'WordPress for Beginners', emisor: 'Udemy', skills: ['wordpress'], nivel: 1 },
    { nombre: 'Scrum Fundamentals Certified', emisor: 'SCRUMstudy', skills: ['procesos'], nivel: 1 },
    { nombre: 'Lean Six Sigma Yellow Belt', emisor: 'CSSC', skills: ['procesos'], nivel: 2 },
    { nombre: 'Lean Six Sigma Green Belt', emisor: 'CSSC', skills: ['procesos', 'inventarios'], nivel: 3 },
    { nombre: 'APICS CPIM Parte 1', emisor: 'ASCM', skills: ['inventarios', 'logistica'], nivel: 2 },
    { nombre: 'Certificado de Excel Financiero', emisor: 'UPN', skills: ['excel', 'finanzas', 'costos'], nivel: 2 }
  ];

  /* Cuando el certificado no está en el catálogo, se lee su título.
     El orden importa: se evalúa de mayor a menor nivel. */
  var REGLAS_NIVEL_TEXTO = [
    { nivel: 3, re: /(avanzad|advanced|expert|profesional|professional|specialist|master|\bc1\b|\bc2\b|green belt|black belt)/i },
    { nivel: 2, re: /(intermedi|intermediate|associate|practitioner|\bb1\b|\bb2\b|yellow belt)/i },
    { nivel: 1, re: /(b[áa]sic|basic|fundament|introducc|introduction|beginner|essentials|inicial|\ba1\b|\ba2\b)/i }
  ];

  /* ---------- Encargos de la prueba práctica ----------
     Se piden solo cuando alguien declara Intermedio o Avanzado sin respaldo en
     una habilidad indispensable del reto al que postula. Son encargos cortos y
     concretos, revisados por un docente: nunca cuestionarios de opción múltiple,
     que se resuelven con el celular al lado y miden memoria, no capacidad. */
  var PRUEBAS_POR_HABILIDAD = {
    excel: 'Con una planilla de ventas de 200 filas (te la enviamos), arma una tabla dinámica de ventas por mes y producto, y una fórmula que marque los productos que están bajo su punto de reposición. Sube el archivo o un enlace.',
    powerbi: 'Con el archivo de ventas que te enviamos, construye un tablero de una página que responda: qué producto rota más, en qué mes y a qué tipo de cliente. Comparte el enlace o una captura del tablero publicado.',
    sql: 'Con la base de ejemplo que te enviamos, escribe tres consultas: ventas totales por mes, los diez productos más vendidos, y los clientes que no compran hace 90 días.',
    analitica: 'Toma una cuenta o web de ejemplo y explica en una página qué medirías para saber si está funcionando, con qué indicadores y cada cuánto los revisarías.',
    community: 'Propón un plan de contenido de dos semanas para una panadería de barrio: qué publicar cada día, con qué objetivo y en qué formato. Una página.',
    contenido: 'Escribe tres publicaciones para una veterinaria que quiere educar a sus clientes sobre vacunación, cada una con su texto y la idea de imagen.',
    copy: 'Escribe el texto de venta de un servicio de limpieza de oficinas: un mensaje de WhatsApp de apertura, una descripción para redes y un titular.',
    metaads: 'Diseña una campaña de S/ 300 para una ferretería: objetivo, público, formato de anuncio, texto y cómo medirías si funcionó.',
    seo: 'Elige un negocio local y entrega diez palabras clave con las que debería aparecer en Google, más tres mejoras concretas para su ficha de Google Empresa.',
    canva: 'Diseña tres piezas para redes de un negocio de tejidos: una de producto, una de promoción y una de marca. Comparte el enlace de Canva.',
    illustrator: 'Diseña una propuesta de logotipo para un taller de tejidos de alpaca, en versión principal y reducida. Comparte el archivo o un enlace.',
    branding: 'Define en una página la identidad de una marca de tejidos: personalidad, paleta, tipografías y qué debe evitar.',
    fotografia: 'Toma seis fotos de un producto cualquiera que tengas en casa, con luz natural y fondo neutro. Comparte el enlace a la carpeta.',
    video: 'Edita un video vertical de 30 segundos presentando un producto, con texto en pantalla. Comparte el enlace.',
    wordpress: 'Monta una página de inicio con secciones de servicios, precios y contacto. Comparte el enlace del sitio de prueba.',
    frontend: 'Construye una página de una sola vista con un formulario de contacto que valide los campos. Comparte el enlace o el repositorio.',
    ecommerce: 'Explica en una página cómo montarías la venta en línea de una panadería: catálogo, medios de pago, entrega y qué medirías.',
    automatiza: 'Arma un flujo que reciba un formulario y lo escriba en una hoja de cálculo enviando un correo de aviso. Comparte una captura del flujo.',
    costos: 'Con los datos de compra de cinco productos que te enviamos, calcula el costo real por unidad incluyendo flete y propón un precio de venta.',
    finanzas: 'Arma el flujo de caja de tres meses de un negocio pequeño con los datos que te enviamos, e identifica en qué mes se queda sin liquidez.',
    inventarios: 'Con la lista de 50 productos que te enviamos, propón una codificación, un punto de reposición por producto y un procedimiento de conteo semanal.',
    procesos: 'Elige un proceso que conozcas, diagrámalo tal como es hoy y propón una versión mejorada explicando qué eliminaste y por qué.',
    logistica: 'Propón la ruta de reparto de un día para seis clientes en distintos distritos, justificando el orden.',
    ventas: 'Escribe el guion de una llamada de venta a una empresa que no te conoce, con las tres objeciones más probables y su respuesta.',
    atencion: 'Escribe cómo responderías por WhatsApp a tres clientes: uno que pregunta precios, uno que reclama y uno que quiere devolver un producto.',
    encuestas: 'Diseña una encuesta de diez preguntas para saber por qué los clientes de una panadería eligen dónde comprar, y explica qué harías con los resultados.',
    redaccion: 'Redacta un correo de presentación de una empresa de limpieza a un administrador de oficinas que no la conoce.',
    seguridad: 'Identifica cinco riesgos en un taller de confecciones y propón una medida de control para cada uno.'
  };

  var HORAS_POR_SEMANA_DEFECTO = 10;

  return {
    APP: 'UPN Talent Lab',
    SCHEMA: 4,
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
    NIVELES: NIVELES,
    RESPALDOS: RESPALDOS,
    CERTIFICADOS: CERTIFICADOS,
    REGLAS_NIVEL_TEXTO: REGLAS_NIVEL_TEXTO,
    PRUEBAS_POR_HABILIDAD: PRUEBAS_POR_HABILIDAD,
    HORAS_POR_SEMANA_DEFECTO: HORAS_POR_SEMANA_DEFECTO
  };
})();
