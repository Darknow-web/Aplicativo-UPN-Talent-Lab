/* 03-seed.js — Datos de demostración. Las fechas se calculan relativas a hoy
   para que la demo siempre se vea vigente. */
window.SEED = (function () {

  function construir() {
    var hoy = U.hoy();
    var d = function (n) { return U.sumarDias(hoy, n); };
    var iso = function (n) { return new Date(Date.now() + n * 86400000).toISOString(); };

    /* ---------------- Usuarios ---------------- */
    var users = [
      /* Coordinación */
      { id: 'u_coord1', rol: 'coordinador', nombre: 'Mariana Salazar Ríos', email: 'coordinacion@upn.demo', pass: 'demo1234',
        cargo: 'Coordinadora de Vinculación con el Entorno', campus: 'Trujillo San Isidro', area: 'Dirección de Empleabilidad',
        telefono: '944 218 770' },

      /* Docentes / mentores */
      { id: 'u_men1', rol: 'mentor', nombre: 'Luis Fernando Chávez', email: 'luis.chavez@upn.demo', pass: 'demo1234',
        facultad: 'Negocios', especialidad: 'Marketing digital y ventas', campus: 'Trujillo San Isidro',
        habilidades: ['community', 'contenido', 'metaads', 'copy', 'ventas'], maxProyectos: 3,
        bio: 'Docente de Marketing con 11 años acompañando proyectos con pymes del norte del país.' },
      { id: 'u_men2', rol: 'mentor', nombre: 'Rocío Alvarado Paz', email: 'rocio.alvarado@upn.demo', pass: 'demo1234',
        facultad: 'Comunicaciones', especialidad: 'Identidad de marca y contenido audiovisual', campus: 'Lima Los Olivos',
        habilidades: ['branding', 'canva', 'illustrator', 'fotografia', 'video', 'redaccion'], maxProyectos: 3,
        bio: 'Diseñadora y docente. Dirige el taller de identidad visual para emprendimientos.' },
      { id: 'u_men3', rol: 'mentor', nombre: 'Jorge Meléndez Quiroz', email: 'jorge.melendez@upn.demo', pass: 'demo1234',
        facultad: 'Ingeniería', especialidad: 'Datos, automatización y procesos', campus: 'Lima San Juan de Lurigancho',
        habilidades: ['excel', 'powerbi', 'sql', 'automatiza', 'procesos', 'frontend', 'ecommerce'], maxProyectos: 4,
        bio: 'Ingeniero de sistemas. Investiga transformación digital en micro y pequeñas empresas.' },

      /* Empresas */
      { id: 'u_emp1', rol: 'empresa', nombre: 'Rosa Bustamante', email: 'rosa@delicianortena.demo', pass: 'demo1234',
        razonSocial: 'Panadería Delicia Norteña E.I.R.L.', ruc: '20553114782', sector: 'Alimentos y panificación',
        tamano: 'micro', distrito: 'Trujillo', web: 'delicianortena.pe', cargo: 'Dueña', trabajadores: 6, logo: '🥖',
        descripcion: 'Panadería de barrio con 12 años en Trujillo. Vende en local propio y quiere crecer con pedidos por WhatsApp.',
        verificada: true },
      { id: 'u_emp2', rol: 'empresa', nombre: 'Diego Ramírez Ocampo', email: 'diego@patasana.demo', pass: 'demo1234',
        razonSocial: 'Veterinaria PataSana S.A.C.', ruc: '20601447239', sector: 'Servicios veterinarios',
        tamano: 'pequena', distrito: 'Los Olivos, Lima', web: 'patasana.pe', cargo: 'Administrador', trabajadores: 11, logo: '🐾',
        descripcion: 'Clínica veterinaria con dos sedes. Atiende consultas, baños y venta de alimento balanceado.',
        verificada: true },
      { id: 'u_emp3', rol: 'empresa', nombre: 'Elena Chuquilín Vera', email: 'elena@kuntur.demo', pass: 'demo1234',
        razonSocial: 'Textiles Kuntur S.R.L.', ruc: '20495112034', sector: 'Textil y confecciones',
        tamano: 'pequena', distrito: 'Cajamarca', web: 'textileskuntur.pe', cargo: 'Gerenta general', trabajadores: 18, logo: '🧶',
        descripcion: 'Taller de tejidos de alpaca que vende a turistas y quiere abrir canal mayorista en Lima.',
        verificada: true },
      { id: 'u_emp4', rol: 'empresa', nombre: 'Óscar Paredes Lino', email: 'oscar@mundoferretero.demo', pass: 'demo1234',
        razonSocial: 'Mundo Ferretero E.I.R.L.', ruc: '20604778115', sector: 'Ferretería y construcción',
        tamano: 'pequena', distrito: 'San Juan de Lurigancho, Lima', web: '', cargo: 'Gerente', trabajadores: 9, logo: '🔧',
        descripcion: 'Ferretería con dos tiendas. Controla el stock en cuadernos y pierde ventas por quiebres.',
        verificada: true },
      { id: 'u_emp5', rol: 'empresa', nombre: 'Karina Vásquez Huamán', email: 'karina@ecolimpio.demo', pass: 'demo1234',
        razonSocial: 'EcoLimpio Servicios Generales S.A.C.', ruc: '20522987410', sector: 'Servicios de limpieza',
        tamano: 'micro', distrito: 'Trujillo', web: '', cargo: 'Fundadora', trabajadores: 7, logo: '🧽',
        descripcion: 'Servicio de limpieza para oficinas y locales comerciales. Consigue clientes solo por recomendación.',
        verificada: false },

      /* Estudiantes */
      { id: 'u_est1', rol: 'estudiante', nombre: 'Camila Rojas Peña', email: 'camila.rojas@upn.demo', pass: 'demo1234',
        codigoUPN: 'N00218745', carrera: 'Administración y Marketing', ciclo: 8, campus: 'Trujillo San Isidro',
        horasSemana: 15, modalidad: 'hibrido', distrito: 'Trujillo',
        habilidades: [
          { skill: 'community', nivel: 3, respaldoTipo: 'proyecto', respaldoDetalle: 'Microproyecto Talent Lab con Panadería Delicia Norteña' },
          { skill: 'contenido', nivel: 2, respaldoTipo: 'proyecto', respaldoDetalle: 'Microproyecto Talent Lab con Panadería Delicia Norteña' },
          { skill: 'metaads', nivel: 2, respaldoTipo: 'certificado', respaldoDetalle: 'Meta Certified Digital Marketing Associate', respaldoUrl: 'https://credentials.meta.com/ejemplo' },
          { skill: 'canva', nivel: 2, respaldoTipo: 'proyecto', respaldoDetalle: 'Microproyecto Talent Lab con Panadería Delicia Norteña' },
          { skill: 'copy', nivel: 1 }
        ],
        intereses: ['marketing', 'comunicacion'],
        bio: 'Me apasiona el marketing para negocios pequeños. Llevo dos años administrando redes de emprendimientos familiares.',
        portafolioPublico: true },
      { id: 'u_est2', rol: 'estudiante', nombre: 'Sebastián Torres Ludeña', email: 'sebastian.torres@upn.demo', pass: 'demo1234',
        codigoUPN: 'N00241130', carrera: 'Ciencias de la Comunicación', ciclo: 6, campus: 'Lima Los Olivos',
        horasSemana: 12, modalidad: 'remoto', distrito: 'Los Olivos, Lima',
        habilidades: [
          { skill: 'video', nivel: 3, respaldoTipo: 'certificado', respaldoDetalle: 'Adobe Certified Professional: Premiere Pro', respaldoUrl: 'https://credly.com/ejemplo' },
          { skill: 'fotografia', nivel: 2, respaldoTipo: 'trabajo', respaldoDetalle: 'Portafolio de fotografía de producto para tres marcas locales', respaldoUrl: 'https://behance.net/ejemplo' },
          { skill: 'contenido', nivel: 2, respaldoTipo: 'trabajo', respaldoDetalle: 'Reels producidos para una cafetería de Los Olivos', respaldoUrl: 'https://instagram.com/ejemplo' },
          { skill: 'copy', nivel: 2 },
          { skill: 'community', nivel: 1 }
        ],
        intereses: ['comunicacion', 'marketing', 'diseno'],
        bio: 'Editor de video y creador de contenido. Manejo Premiere, CapCut y produzco reels para marcas locales.',
        portafolioPublico: true },
      { id: 'u_est3', rol: 'estudiante', nombre: 'Valeria Quispe Mamani', email: 'valeria.quispe@upn.demo', pass: 'demo1234',
        codigoUPN: 'N00205562', carrera: 'Ingeniería de Sistemas', ciclo: 9, campus: 'Lima San Juan de Lurigancho',
        horasSemana: 18, modalidad: 'remoto', distrito: 'San Juan de Lurigancho, Lima',
        habilidades: [
          { skill: 'wordpress', nivel: 3, respaldoTipo: 'trabajo', respaldoDetalle: 'Cuatro tiendas montadas en WooCommerce, con documentación', respaldoUrl: 'https://github.com/ejemplo' },
          { skill: 'frontend', nivel: 2, respaldoTipo: 'trabajo', respaldoDetalle: 'Repositorio con tres proyectos web propios', respaldoUrl: 'https://github.com/ejemplo' },
          { skill: 'ecommerce', nivel: 2, respaldoTipo: 'trabajo', respaldoDetalle: 'Tienda en línea de una distribuidora de abarrotes' },
          { skill: 'automatiza', nivel: 1 },
          { skill: 'sql', nivel: 1 }
        ],
        intereses: ['tecnologia', 'datos'],
        bio: 'Desarrolladora web. He montado cuatro tiendas en WooCommerce y me gusta dejar todo documentado.',
        portafolioPublico: true },
      { id: 'u_est4', rol: 'estudiante', nombre: 'Diego Alarcón Vega', email: 'diego.alarcon@upn.demo', pass: 'demo1234',
        codigoUPN: 'N00223918', carrera: 'Ingeniería Industrial', ciclo: 9, campus: 'Trujillo El Molino',
        horasSemana: 14, modalidad: 'presencial', distrito: 'Trujillo',
        habilidades: [
          { skill: 'excel', nivel: 3, respaldoTipo: 'certificado', respaldoDetalle: 'Microsoft Office Specialist: Excel Expert', respaldoUrl: 'https://credly.com/ejemplo' },
          { skill: 'procesos', nivel: 2, respaldoTipo: 'certificado', respaldoDetalle: 'Lean Six Sigma Yellow Belt' },
          { skill: 'inventarios', nivel: 2, respaldoTipo: 'trabajo', respaldoDetalle: 'Control de almacén en prácticas de verano en una distribuidora' },
          { skill: 'logistica', nivel: 1 },
          { skill: 'seguridad', nivel: 1 }
        ],
        intereses: ['operaciones', 'datos'],
        bio: 'Me interesa ordenar operaciones de negocios pequeños: inventarios, tiempos y costos.',
        portafolioPublico: true },
      { id: 'u_est5', rol: 'estudiante', nombre: 'Fernanda Núñez Silva', email: 'fernanda.nunez@upn.demo', pass: 'demo1234',
        codigoUPN: 'N00234407', carrera: 'Contabilidad y Finanzas', ciclo: 7, campus: 'Cajamarca',
        horasSemana: 10, modalidad: 'hibrido', distrito: 'Cajamarca',
        habilidades: [
          { skill: 'excel', nivel: 2, respaldoTipo: 'certificado', respaldoDetalle: 'Microsoft Office Specialist: Excel Associate', respaldoUrl: 'https://credly.com/ejemplo' },
          { skill: 'costos', nivel: 2, respaldoTipo: 'certificado', respaldoDetalle: 'Certificado de Excel Financiero' },
          { skill: 'powerbi', nivel: 2 },
          { skill: 'finanzas', nivel: 1 }
        ],
        intereses: ['negocios', 'datos'],
        bio: 'Quiero especializarme en costos para pymes. Manejo Excel a nivel intermedio con certificación y estoy aprendiendo Power BI.',
        portafolioPublico: true },
      { id: 'u_est6', rol: 'estudiante', nombre: 'Mateo Ibáñez Cruz', email: 'mateo.ibanez@upn.demo', pass: 'demo1234',
        codigoUPN: 'N00247781', carrera: 'Diseño Gráfico', ciclo: 6, campus: 'Trujillo San Isidro',
        horasSemana: 16, modalidad: 'hibrido', distrito: 'Trujillo',
        habilidades: [
          { skill: 'canva', nivel: 3, respaldoTipo: 'proyecto', respaldoDetalle: 'Microproyecto Talent Lab con Panadería Delicia Norteña' },
          { skill: 'branding', nivel: 2, respaldoTipo: 'proyecto', respaldoDetalle: 'Microproyecto Talent Lab con Panadería Delicia Norteña' },
          { skill: 'fotografia', nivel: 2, respaldoTipo: 'proyecto', respaldoDetalle: 'Microproyecto Talent Lab con Panadería Delicia Norteña' },
          { skill: 'illustrator', nivel: 2, respaldoTipo: 'certificado', respaldoDetalle: 'Adobe Certified Professional: Illustrator', respaldoUrl: 'https://credly.com/ejemplo' }
        ],
        intereses: ['diseno', 'marketing'],
        bio: 'Diseñador enfocado en identidad visual. Me gusta trabajar marcas de barrio y darles carácter.',
        portafolioPublico: true },
      { id: 'u_est7', rol: 'estudiante', nombre: 'Lucía Paredes Gonzales', email: 'lucia.paredes@upn.demo', pass: 'demo1234',
        codigoUPN: 'N00239054', carrera: 'Administración de Empresas', ciclo: 6, campus: 'Lima Breña',
        horasSemana: 12, modalidad: 'presencial', distrito: 'Breña, Lima',
        habilidades: [
          { skill: 'atencion', nivel: 2, respaldoTipo: 'trabajo', respaldoDetalle: 'Dos años atendiendo en tienda de retail, medio tiempo' },
          { skill: 'ventas', nivel: 2, respaldoTipo: 'trabajo', respaldoDetalle: 'Dos años atendiendo en tienda de retail, medio tiempo' },
          { skill: 'excel', nivel: 1 },
          { skill: 'encuestas', nivel: 1 }
        ],
        intereses: ['negocios', 'marketing'],
        bio: 'Trabajo medio tiempo en retail. Me interesa la experiencia del cliente y los estudios de mercado.',
        portafolioPublico: true },
      { id: 'u_est8', rol: 'estudiante', nombre: 'Andrés Vílchez Mori', email: 'andres.vilchez@upn.demo', pass: 'demo1234',
        codigoUPN: 'N00251236', carrera: 'Ingeniería de Sistemas', ciclo: 7, campus: 'Lima Los Olivos',
        horasSemana: 20, modalidad: 'remoto', distrito: 'Comas, Lima',
        habilidades: [
          { skill: 'powerbi', nivel: 3, respaldoTipo: 'certificado', respaldoDetalle: 'Microsoft PL-300: Power BI Data Analyst', respaldoUrl: 'https://learn.microsoft.com/ejemplo' },
          { skill: 'analitica', nivel: 2, respaldoTipo: 'certificado', respaldoDetalle: 'Google Analytics Individual Qualification' },
          { skill: 'sql', nivel: 2, respaldoTipo: 'trabajo', respaldoDetalle: 'Consultas y reportes para el negocio familiar' },
          { skill: 'automatiza', nivel: 2 },
          { skill: 'excel', nivel: 2 }
        ],
        intereses: ['datos', 'tecnologia'],
        bio: 'Me gusta convertir datos desordenados en tableros que la gente sí usa.',
        portafolioPublico: true }
    ];

    users.forEach(function (u) { if (u.rol === 'estudiante') u.slug = U.slugify(u.nombre) + '-' + u.codigoUPN.slice(-4); });

    /* Camila y Mateo ya cerraron un microproyecto: su mentor confirmó allí qué
       habilidades demostraron de verdad, así que esas quedan verificadas. */
    ['u_est1', 'u_est6'].forEach(function (id) {
      var u = users.filter(function (x) { return x.id === id; })[0];
      (u.habilidades || []).forEach(function (h) {
        if (h.respaldoTipo !== 'proyecto') return;
        h.verificadoPorId = 'u_men1';
        h.verificadoProyectoId = 'pr1';
        h.verificadoVia = 'proyecto';
        h.verificadoAt = iso(-34);
      });
    });

    /* Fernanda subió Power BI de Básico a Intermedio dos días después de que se
       publicara el reto del tablero, y sin respaldo alguno. El sistema no la
       bloquea: registra el cambio, se lo muestra a coordinación al comparar
       candidatos y le pide una prueba corta. Es el caso que conviene discutir. */
    var fernanda = users.filter(function (x) { return x.id === 'u_est5'; })[0];
    fernanda.historialHabilidades = [
      { at: iso(-12), skill: 'powerbi', de: 1, a: 2 },
      { at: iso(-95), skill: 'excel', de: 1, a: 2 }
    ];

    /* ---------------- Retos ---------------- */
    function reto(o) {
      return Object.assign({
        entregables: [], habilidadesRequeridas: [], habilidadesDeseables: [],
        modalidad: 'hibrido', horasSemana: 10, tamanoEquipo: 2,
        historial: [], notasRevision: '', creado: iso(-20)
      }, o);
    }

    var retos = [
      reto({
        id: 'r1', codigo: 'RET-2026-0001', empresaId: 'u_emp1', estado: 'finalizado', categoria: 'marketing',
        titulo: 'Reactivar las redes sociales de la panadería',
        problema: 'Nuestro Facebook e Instagram están abandonados hace más de un año. Publicamos cuando nos acordamos, no tenemos fotos decentes de los productos y los clientes nuevos no nos encuentran. Vendemos casi todo en el mostrador y queremos empezar a recibir pedidos por WhatsApp.',
        resultado: 'Redes activas con publicaciones constantes, fotos propias de nuestros productos y un flujo claro para que la gente pida por WhatsApp.',
        entregables: ['Plan de contenido para 4 semanas', 'Banco de 30 fotos de productos', '12 publicaciones diseñadas y programadas', 'Guía corta para que el personal siga publicando'],
        habilidadesRequeridas: [{ skill: 'community', peso: 3, nivelMin: 2 }, { skill: 'contenido', peso: 3, nivelMin: 2 },
                                { skill: 'canva', peso: 2, nivelMin: 2 }, { skill: 'fotografia', peso: 2, nivelMin: 2 }],
        habilidadesDeseables: ['copy', 'metaads'],
        semanas: 4, horasSemana: 10, tamanoEquipo: 2, modalidad: 'hibrido',
        fechaLimitePostulacion: d(-70), creado: iso(-80), publicado: iso(-75)
      }),
      reto({
        id: 'r2', codigo: 'RET-2026-0002', empresaId: 'u_emp2', estado: 'en_ejecucion', categoria: 'tecnologia',
        titulo: 'Catálogo web con reserva de citas para la veterinaria',
        problema: 'Los dueños de mascotas nos escriben por WhatsApp a cualquier hora para preguntar precios y pedir cita. Se nos cruzan las citas y perdemos tiempo respondiendo lo mismo. No tenemos ninguna página propia.',
        resultado: 'Una web sencilla con nuestros servicios, precios y un formulario de reserva de citas que llegue ordenado a un correo o planilla.',
        entregables: ['Sitio web con 4 secciones', 'Formulario de reserva conectado a una hoja de cálculo', 'Manual de administración', 'Capacitación al personal'],
        habilidadesRequeridas: [{ skill: 'wordpress', peso: 3, nivelMin: 2 }, { skill: 'frontend', peso: 2, nivelMin: 2 },
                                { skill: 'automatiza', peso: 2, nivelMin: 2 }],
        habilidadesDeseables: ['ecommerce', 'analitica'],
        semanas: 4, horasSemana: 12, tamanoEquipo: 2, modalidad: 'remoto',
        fechaLimitePostulacion: d(-14), creado: iso(-30), publicado: iso(-25)
      }),
      reto({
        id: 'r3', codigo: 'RET-2026-0003', empresaId: 'u_emp3', estado: 'publicado', categoria: 'diseno',
        titulo: 'Identidad visual y etiquetas para línea de tejidos de alpaca',
        problema: 'Nuestros tejidos son de muy buena calidad pero la presentación no acompaña: la etiqueta está impresa en casa, no tenemos logo consistente y cada vendedora usa un diseño distinto en sus fotos.',
        resultado: 'Una identidad visual clara (logo, colores, tipografías) con etiquetas listas para imprimir y plantillas para redes.',
        entregables: ['Manual de marca básico (10 páginas)', 'Logo en versiones digitales e imprimibles', 'Diseño de etiqueta colgante y adhesiva', '6 plantillas editables para redes'],
        habilidadesRequeridas: [{ skill: 'branding', peso: 3, nivelMin: 2 }, { skill: 'illustrator', peso: 3, nivelMin: 2 },
                                { skill: 'canva', peso: 1, nivelMin: 1 }],
        habilidadesDeseables: ['fotografia', 'copy'],
        semanas: 3, horasSemana: 10, tamanoEquipo: 2, modalidad: 'remoto',
        fechaLimitePostulacion: d(9), creado: iso(-9), publicado: iso(-7)
      }),
      reto({
        id: 'r4', codigo: 'RET-2026-0004', empresaId: 'u_emp4', estado: 'publicado', categoria: 'operaciones',
        titulo: 'Ordenar el inventario de la ferretería y controlar quiebres de stock',
        problema: 'Llevamos el stock en cuadernos. No sabemos qué se vende más ni cuándo reponer, y cada semana perdemos ventas porque algo se acabó sin que nos diéramos cuenta. Tenemos más de 900 productos.',
        resultado: 'Un sistema simple en Excel o Google Sheets con catálogo codificado, control de entradas y salidas, y alertas de reposición.',
        entregables: ['Catálogo codificado de productos', 'Archivo de control de inventario con alertas', 'Procedimiento de conteo semanal', 'Capacitación a 3 trabajadores'],
        habilidadesRequeridas: [{ skill: 'inventarios', peso: 3, nivelMin: 2 }, { skill: 'excel', peso: 3, nivelMin: 3 },
                                { skill: 'procesos', peso: 2, nivelMin: 2 }],
        habilidadesDeseables: ['logistica', 'powerbi'],
        semanas: 4, horasSemana: 12, tamanoEquipo: 2, modalidad: 'presencial',
        fechaLimitePostulacion: d(12), creado: iso(-6), publicado: iso(-5)
      }),
      reto({
        id: 'r5', codigo: 'RET-2026-0005', empresaId: 'u_emp1', estado: 'publicado', categoria: 'negocios',
        titulo: 'Calcular el costo real de nuestros productos y fijar precios',
        problema: 'Ponemos los precios mirando a la competencia. No sabemos cuánto nos cuesta realmente cada producto ni cuál nos deja más ganancia. Sospechamos que algunos los vendemos casi al costo.',
        resultado: 'Una estructura de costos por producto y una propuesta de precios sustentada.',
        entregables: ['Hoja de costeo por producto', 'Análisis de margen de los 15 productos principales', 'Propuesta de lista de precios', 'Explicación al equipo'],
        habilidadesRequeridas: [{ skill: 'costos', peso: 3, nivelMin: 2 }, { skill: 'excel', peso: 3, nivelMin: 2 },
                                { skill: 'finanzas', peso: 2, nivelMin: 2 }],
        habilidadesDeseables: ['powerbi'],
        semanas: 2, horasSemana: 8, tamanoEquipo: 1, modalidad: 'remoto',
        fechaLimitePostulacion: d(6), creado: iso(-4), publicado: iso(-3)
      }),
      reto({
        id: 'r6', codigo: 'RET-2026-0006', empresaId: 'u_emp3', estado: 'en_seleccion', categoria: 'datos',
        titulo: 'Tablero de ventas para saber qué modelos rotan más',
        problema: 'Registramos las ventas en un Excel largo que nadie mira. Queremos ver de un vistazo qué modelos y talles se venden, en qué meses y a qué tipo de cliente, para decidir qué producir.',
        resultado: 'Un tablero visual actualizable que responda esas preguntas sin que tengamos que armar el reporte a mano.',
        entregables: ['Limpieza y estructura de la base de ventas', 'Tablero en Power BI o Looker Studio', 'Manual de actualización mensual', 'Sesión de lectura del tablero'],
        habilidadesRequeridas: [{ skill: 'powerbi', peso: 3, nivelMin: 2 }, { skill: 'excel', peso: 3, nivelMin: 2 },
                                { skill: 'analitica', peso: 2, nivelMin: 2 }],
        habilidadesDeseables: ['sql'],
        semanas: 3, horasSemana: 10, tamanoEquipo: 2, modalidad: 'remoto',
        fechaLimitePostulacion: d(-1), creado: iso(-16), publicado: iso(-14)
      }),
      reto({
        id: 'r7', codigo: 'RET-2026-0007', empresaId: 'u_emp5', estado: 'en_revision', categoria: 'marketing',
        titulo: 'Conseguir los primeros clientes de oficinas por internet',
        problema: 'Todos nuestros clientes llegan por recomendación. No tenemos presencia en internet y cuando alguien busca "servicio de limpieza Trujillo" no aparecemos por ningún lado.',
        resultado: 'Presencia básica en internet que genere consultas: ficha de Google, perfil profesional y un mensaje de venta claro.',
        entregables: ['Ficha de Google Empresa optimizada', 'Perfil de Instagram y Facebook con 8 publicaciones', 'Guion de venta por WhatsApp', 'Lista de 30 empresas objetivo'],
        habilidadesRequeridas: [{ skill: 'seo', peso: 3, nivelMin: 1 }, { skill: 'community', peso: 2, nivelMin: 2 },
                                { skill: 'copy', peso: 2, nivelMin: 2 }],
        habilidadesDeseables: ['ventas', 'canva'],
        semanas: 3, horasSemana: 8, tamanoEquipo: 1, modalidad: 'hibrido',
        fechaLimitePostulacion: d(15), creado: iso(-2)
      }),
      reto({
        id: 'r8', codigo: 'RET-2026-0008', empresaId: 'u_emp2', estado: 'borrador', categoria: 'comunicacion',
        titulo: 'Campaña de contenido educativo sobre cuidado de mascotas',
        problema: 'Los clientes llegan con dudas repetidas sobre vacunas y alimentación. Queremos educarlos y de paso mostrar que sabemos del tema.',
        resultado: 'Una serie de contenidos cortos que respondan las 10 dudas más frecuentes.',
        entregables: ['10 piezas de contenido', 'Calendario de publicación', '3 videos cortos'],
        habilidadesRequeridas: [{ skill: 'contenido', peso: 3, nivelMin: 2 }, { skill: 'video', peso: 2, nivelMin: 2 }],
        habilidadesDeseables: ['copy', 'canva'],
        semanas: 3, horasSemana: 8, tamanoEquipo: 2, modalidad: 'remoto',
        fechaLimitePostulacion: d(20), creado: iso(-1)
      }),
      reto({
        id: 'r9', codigo: 'RET-2026-0009', empresaId: 'u_emp3', estado: 'en_ejecucion', categoria: 'comunicacion',
        titulo: 'Catálogo digital para vender a tiendas mayoristas',
        problema: 'Cuando una tienda de Lima nos pide precios les mandamos fotos sueltas por WhatsApp y una lista en Word. Se ve improvisado y varias veces nos han dicho que no entienden qué modelos y talles tenemos.',
        resultado: 'Un catálogo en PDF ordenado, con fotos, códigos, talles y precios mayoristas, que podamos enviar por correo o WhatsApp.',
        entregables: ['Catálogo en PDF de 20 páginas', 'Fichas de 40 productos con código', 'Plantilla editable para actualizarlo', 'Guion de presentación para vendedoras'],
        habilidadesRequeridas: [{ skill: 'contenido', peso: 3, nivelMin: 2 }, { skill: 'canva', peso: 3, nivelMin: 2 },
                                { skill: 'fotografia', peso: 2, nivelMin: 2 }, { skill: 'copy', peso: 2, nivelMin: 2 }],
        habilidadesDeseables: ['branding', 'ventas'],
        semanas: 3, horasSemana: 10, tamanoEquipo: 2, modalidad: 'remoto',
        fechaLimitePostulacion: d(-24), creado: iso(-40), publicado: iso(-38)
      }),
      reto({
        id: 'r10', codigo: 'RET-2026-0010', empresaId: 'u_emp4', estado: 'en_ejecucion', categoria: 'negocios',
        titulo: 'Revisar precios y márgenes de los productos más vendidos',
        problema: 'Tenemos más de 900 productos y ponemos los precios por costumbre. Sospechamos que en algunos de los que más vendemos casi no ganamos, pero nunca lo hemos calculado.',
        resultado: 'Saber cuánto deja realmente cada producto de los que más rotan y tener una propuesta de precios sustentada.',
        entregables: ['Análisis de margen de los 40 productos más vendidos', 'Propuesta de nueva lista de precios', 'Hoja de cálculo para mantenerlo'],
        habilidadesRequeridas: [{ skill: 'costos', peso: 3, nivelMin: 2 }, { skill: 'excel', peso: 3, nivelMin: 2 },
                                { skill: 'ventas', peso: 2, nivelMin: 2 }],
        habilidadesDeseables: ['finanzas', 'atencion'],
        semanas: 2, horasSemana: 8, tamanoEquipo: 1, modalidad: 'hibrido',
        fechaLimitePostulacion: d(-30), creado: iso(-46), publicado: iso(-44)
      })
    ];

    retos.forEach(function (r) {
      r.historial = [{ estado: r.estado, at: r.creado, por: r.empresaId, nota: '' }];
    });

    /* ---------------- Postulaciones ---------------- */
    function post(o) { return Object.assign({ id: U.uid('post'), estado: 'postulada', creado: iso(-3) }, o); }
    var postulaciones = [
      /* r1 (finalizado) */
      post({ id: 'p1', retoId: 'r1', estudianteId: 'u_est1', estado: 'seleccionada', creado: iso(-74),
        motivacion: 'Trabajo redes de dos emprendimientos familiares y quiero aplicarlo en una panadería con historia. Puedo ir al local a tomar las fotos.' }),
      post({ id: 'p2', retoId: 'r1', estudianteId: 'u_est6', estado: 'seleccionada', creado: iso(-74),
        motivacion: 'Me interesa darle una imagen consistente a una marca de barrio. Puedo encargarme de las piezas gráficas y las fotos.' }),
      post({ id: 'p3', retoId: 'r1', estudianteId: 'u_est2', estado: 'no_seleccionada', creado: iso(-73),
        motivacion: 'Puedo aportar en video y fotografía de producto.' }),
      /* r2 (en ejecución) */
      post({ id: 'p4', retoId: 'r2', estudianteId: 'u_est3', estado: 'seleccionada', creado: iso(-20),
        motivacion: 'He montado cuatro sitios en WordPress y puedo dejar el formulario conectado a una hoja de cálculo con notificación por correo.' }),
      post({ id: 'p5', retoId: 'r2', estudianteId: 'u_est8', estado: 'seleccionada', creado: iso(-20),
        motivacion: 'Puedo encargarme de la automatización de las reservas y de dejar medición instalada para ver cuántas citas entran.' }),
      /* r6 (en selección) — el coordinador puede armar el equipo ahora mismo */
      post({ id: 'p6', retoId: 'r6', estudianteId: 'u_est5', creado: iso(-10),
        motivacion: 'Tengo la certificación de Excel de Microsoft y estoy terminando un curso de Power BI. Vivo en Cajamarca, así que puedo ir al taller a levantar la información.' }),
      post({ id: 'p7', retoId: 'r6', estudianteId: 'u_est8', creado: iso(-9),
        motivacion: 'Armo tableros desde hace dos años. Puedo limpiar la base de ventas y dejar el tablero actualizable sin depender de mí.' }),
      post({ id: 'p8', retoId: 'r6', estudianteId: 'u_est4', creado: iso(-8),
        motivacion: 'Tengo Excel a nivel avanzado certificado y experiencia en análisis de rotación. Me interesa el cruce entre producción y ventas.' }),
      post({ id: 'p9', retoId: 'r6', estudianteId: 'u_est7', creado: iso(-7),
        motivacion: 'Quiero aprender análisis de datos aplicado a ventas y puedo apoyar en el levantamiento con las vendedoras.' }),
      /* r3 y r4 con postulantes */
      post({ id: 'p10', retoId: 'r3', estudianteId: 'u_est6', creado: iso(-5),
        motivacion: 'Es exactamente el tipo de proyecto que quiero en mi portafolio: identidad visual completa para una marca con producto real.' }),
      post({ id: 'p11', retoId: 'r3', estudianteId: 'u_est2', creado: iso(-4),
        motivacion: 'Puedo apoyar en la fotografía de producto y en la redacción de la marca.' }),
      post({ id: 'p12', retoId: 'r4', estudianteId: 'u_est4', creado: iso(-3),
        motivacion: 'He hecho control de inventarios en el almacén donde trabajé el verano pasado. Vivo en Trujillo pero puedo coordinar visitas.' })
    ];

    /* ---------------- Proyectos ---------------- */
    function hitos(retoSemanas, inicio, plan) {
      return CFG.PLANTILLA_HITOS[retoSemanas].map(function (h, i) {
        return {
          id: U.uid('hito'), semana: i + 1, titulo: h.titulo, descripcion: h.descripcion,
          fechaLimite: U.sumarDias(inicio, (i + 1) * 7),
          estado: plan[i] ? plan[i].estado : 'pendiente',
          evidencia: plan[i] ? (plan[i].evidencia || '') : '',
          nota: plan[i] ? (plan[i].nota || '') : '',
          feedback: plan[i] ? (plan[i].feedback || '') : '',
          entregadoAt: plan[i] && plan[i].estado !== 'pendiente' ? plan[i].at : null,
          revisadoAt: plan[i] && (plan[i].estado === 'aprobado' || plan[i].estado === 'observado') ? plan[i].at : null
        };
      });
    }

    var inicio1 = d(-63), fin1 = d(-35);
    var pr1 = {
      id: 'pr1', codigo: 'PRY-2026-0001', retoId: 'r1', empresaId: 'u_emp1', mentorId: 'u_men1',
      estudianteIds: ['u_est1', 'u_est6'], liderId: 'u_est1', coordinadorId: 'u_coord1',
      inicio: inicio1, fin: fin1, semanas: 4, estado: 'cerrado', creado: iso(-64),
      hitos: hitos(4, inicio1, [
        { estado: 'aprobado', at: iso(-57), evidencia: 'https://drive.google.com/diagnostico-delicia', feedback: 'Buen diagnóstico. Sumen el dato de horas pico de venta.' },
        { estado: 'aprobado', at: iso(-50), evidencia: 'https://drive.google.com/plan-contenido-delicia', feedback: 'Plan aprobado. Cuiden que el tono sea cercano, no corporativo.' },
        { estado: 'aprobado', at: iso(-43), evidencia: 'https://drive.google.com/banco-fotos-delicia', feedback: 'Las fotos quedaron muy bien. Excelente uso de luz natural.' },
        { estado: 'aprobado', at: iso(-36), evidencia: 'https://drive.google.com/entrega-final-delicia', feedback: 'Entrega completa y bien documentada.' }
      ]),
      bitacora: [
        { id: U.uid('b'), autorId: 'u_est1', tipo: 'reunion', semana: 1, horas: 2, at: iso(-62), visibleEmpresa: true,
          texto: 'Reunión de arranque con la señora Rosa en el local. Nos mostró los productos estrella: pan de yema, empanadas y la torta de tres leches. Vende más entre 6 y 9 de la mañana.' },
        { id: U.uid('b'), autorId: 'u_est6', tipo: 'avance', semana: 2, horas: 6, at: iso(-52), visibleEmpresa: true,
          texto: 'Sesión de fotos en el local aprovechando la luz de la mañana. 42 tomas, seleccionamos 30. Usamos una tabla de madera y un mantel del local como fondo, sin comprar nada.' },
        { id: U.uid('b'), autorId: 'u_men1', tipo: 'decision', semana: 2, horas: 1, at: iso(-51), visibleEmpresa: true,
          texto: 'Acordamos priorizar Instagram sobre Facebook para el contenido nuevo, y usar Facebook solo para replicar. El público de pedidos por WhatsApp está más en Instagram.' },
        { id: U.uid('b'), autorId: 'u_est1', tipo: 'bloqueo', semana: 3, horas: 1, at: iso(-45), visibleEmpresa: false,
          texto: 'La panadería no tenía acceso al correo con el que crearon el Facebook. Lo resolvimos recuperando la cuenta con el número del local.' },
        { id: U.uid('b'), autorId: 'u_est1', tipo: 'entrega', semana: 4, horas: 4, at: iso(-36), visibleEmpresa: true,
          texto: 'Capacitación final de 90 minutos con Rosa y su sobrina, que quedará a cargo de publicar. Les dejamos la guía impresa y las plantillas en Canva compartidas.' }
      ],
      entregaFinal: {
        titulo: 'Redes reactivadas + banco de contenido de 4 semanas',
        resumen: 'Se reactivaron Instagram y Facebook con identidad consistente, se produjo un banco de 30 fotos propias y 12 publicaciones programadas. Se instaló el botón de WhatsApp y se capacitó a dos personas del negocio para mantener la operación.',
        enlaces: [
          { label: 'Carpeta de entregables', url: 'https://drive.google.com/carpeta-delicia-nortena' },
          { label: 'Plan de contenido', url: 'https://docs.google.com/plan-contenido-delicia' },
          { label: 'Instagram del negocio', url: 'https://instagram.com/delicianortena' }
        ],
        at: iso(-36), porId: 'u_est1'
      },
      evaluaciones: [
        { id: U.uid('ev'), rol: 'mentor', evaluadorId: 'u_men1', at: iso(-35), decision: 'aprobado',
          criterios: { cumplimiento: 5, calidad: 5, comunicacion: 4, autonomia: 4, impacto: 5 },
          comentario: 'Equipo muy ordenado. Camila lideró bien la relación con la empresa y Mateo elevó mucho el nivel visual. Cumplieron todos los hitos en fecha.' },
        { id: U.uid('ev'), rol: 'empresa', evaluadorId: 'u_emp1', at: iso(-34), decision: 'aprobado',
          criterios: { cumplimiento: 5, calidad: 5, comunicacion: 5, autonomia: 4, impacto: 4 },
          comentario: 'Quedamos muy contentas. Las fotos son hermosas y ahora sí sabemos qué publicar. En dos semanas ya nos llegaron pedidos por WhatsApp de gente que nos vio en Instagram.' }
      ]
    };

    var inicio2 = d(-10), fin2 = d(18);
    var pr2 = {
      id: 'pr2', codigo: 'PRY-2026-0002', retoId: 'r2', empresaId: 'u_emp2', mentorId: 'u_men3',
      estudianteIds: ['u_est3', 'u_est8'], liderId: 'u_est3', coordinadorId: 'u_coord1',
      inicio: inicio2, fin: fin2, semanas: 4, estado: 'en_curso', creado: iso(-11),
      hitos: hitos(4, inicio2, [
        { estado: 'aprobado', at: iso(-4), evidencia: 'https://docs.google.com/diagnostico-patasana',
          feedback: 'Buen levantamiento. Incluyan el flujo actual de WhatsApp como línea base para comparar al final.' },
        { estado: 'entregado', at: iso(-1), evidencia: 'https://figma.com/patasana-propuesta',
          nota: 'Subimos el prototipo de las 4 secciones y el flujo del formulario de reserva. Esperamos su revisión para pasar a producción.' },
        { estado: 'pendiente' },
        { estado: 'pendiente' }
      ]),
      bitacora: [
        { id: U.uid('b'), autorId: 'u_est3', tipo: 'reunion', semana: 1, horas: 2, at: iso(-9), visibleEmpresa: true,
          texto: 'Reunión de arranque con Diego. Definimos las 4 secciones: servicios, precios, reserva de citas y ubicación de las dos sedes. Nos pasó la lista de precios actualizada.' },
        { id: U.uid('b'), autorId: 'u_est8', tipo: 'avance', semana: 1, horas: 5, at: iso(-7), visibleEmpresa: true,
          texto: 'Revisé el flujo actual: reciben en promedio 40 mensajes diarios por WhatsApp y el 60% son preguntas de precios. Eso justifica la sección de precios visible sin tener que escribir.' },
        { id: U.uid('b'), autorId: 'u_men3', tipo: 'decision', semana: 2, horas: 1, at: iso(-5), visibleEmpresa: true,
          texto: 'Acordamos usar WordPress con un formulario que escriba en Google Sheets y envíe correo, en vez de un sistema de citas de pago. Es mantenible por la propia veterinaria.' },
        { id: U.uid('b'), autorId: 'u_est3', tipo: 'avance', semana: 2, horas: 6, at: iso(-1), visibleEmpresa: true,
          texto: 'Prototipo listo en Figma con las cuatro secciones. Falta que validemos los textos de servicios con la veterinaria antes de maquetar.' }
      ],
      entregaFinal: null,
      evaluaciones: []
    };

    /* pr3: la entrega final ya llegó y está esperando las dos evaluaciones.
       Permite probar "evaluar" desde la empresa y desde el mentor sin pasos previos. */
    var inicio3 = d(-24), fin3 = d(-3);
    var pr3 = {
      id: 'pr3', codigo: 'PRY-2026-0003', retoId: 'r9', empresaId: 'u_emp3', mentorId: 'u_men2',
      estudianteIds: ['u_est6', 'u_est2'], liderId: 'u_est6', coordinadorId: 'u_coord1',
      inicio: inicio3, fin: fin3, semanas: 3, estado: 'en_validacion', creado: iso(-25),
      hitos: hitos(3, inicio3, [
        { estado: 'aprobado', at: iso(-17), evidencia: 'https://drive.google.com/kuntur-diagnostico',
          feedback: 'Buen inventario de modelos. Ordenen los talles con el mismo criterio en todas las fichas.' },
        { estado: 'aprobado', at: iso(-10), evidencia: 'https://figma.com/kuntur-catalogo-propuesta',
          feedback: 'La diagramación quedó clara y la marca se lee bien. Aprobado.' },
        { estado: 'aprobado', at: iso(-3), evidencia: 'https://drive.google.com/kuntur-catalogo-final',
          feedback: 'Entrega completa. Buen trabajo con las fotos sobre fondo neutro.' }
      ]),
      bitacora: [
        { id: U.uid('b'), autorId: 'u_est6', tipo: 'reunion', semana: 1, horas: 2, at: iso(-23), visibleEmpresa: true,
          texto: 'Reunión de arranque con Elena. Definimos que el catálogo va dirigido a tiendas mayoristas de Lima, no a clientes finales, así que los precios que van son los de por mayor.' },
        { id: U.uid('b'), autorId: 'u_est2', tipo: 'avance', semana: 2, horas: 7, at: iso(-14), visibleEmpresa: true,
          texto: 'Sesión de fotos de 40 prendas sobre fondo neutro. Usamos luz natural junto a la ventana del taller y una tabla de madera prestada. 118 tomas, 40 seleccionadas.' },
        { id: U.uid('b'), autorId: 'u_est6', tipo: 'decision', semana: 2, horas: 3, at: iso(-12), visibleEmpresa: true,
          texto: 'Acordamos codificar los productos por línea y talla (KUN-CH-01) para que la ficha coincida con lo que ya usan en el cuaderno de producción.' },
        { id: U.uid('b'), autorId: 'u_est6', tipo: 'entrega', semana: 3, horas: 4, at: iso(-3), visibleEmpresa: true,
          texto: 'Entregamos el catálogo en PDF, las 40 fichas y la plantilla editable. Capacitamos a las dos vendedoras en cómo actualizarlo cuando salga un modelo nuevo.' }
      ],
      entregaFinal: {
        titulo: 'Catálogo mayorista + fichas de 40 productos',
        resumen: 'Se produjo un catálogo de 20 páginas con fotografía propia, códigos por línea y talla, y precios mayoristas. Se entregó además la plantilla editable y se capacitó a las vendedoras para mantenerlo actualizado sin depender del equipo.',
        enlaces: [
          { label: 'Catálogo en PDF', url: 'https://drive.google.com/kuntur-catalogo-final' },
          { label: 'Fichas de producto', url: 'https://drive.google.com/kuntur-fichas' },
          { label: 'Plantilla editable', url: 'https://canva.com/kuntur-plantilla' }
        ],
        at: iso(-3), porId: 'u_est6'
      },
      evaluaciones: []
    };

    /* pr4: mentor y empresa ya aprobaron. Solo falta que la coordinación
       emita las constancias, que es el último paso del ciclo. */
    var inicio4 = d(-30), fin4 = d(-16);
    var pr4 = {
      id: 'pr4', codigo: 'PRY-2026-0004', retoId: 'r10', empresaId: 'u_emp4', mentorId: 'u_men1',
      estudianteIds: ['u_est7'], liderId: 'u_est7', coordinadorId: 'u_coord1',
      inicio: inicio4, fin: fin4, semanas: 2, estado: 'aprobado', creado: iso(-31),
      hitos: hitos(2, inicio4, [
        { estado: 'aprobado', at: iso(-23), evidencia: 'https://docs.google.com/ferretero-diagnostico',
          feedback: 'Buen levantamiento de costos. Confirmen con Óscar el flete que no estaba considerado.' },
        { estado: 'aprobado', at: iso(-16), evidencia: 'https://docs.google.com/ferretero-precios',
          feedback: 'Análisis sólido y bien explicado para alguien sin formación contable.' }
      ]),
      bitacora: [
        { id: U.uid('b'), autorId: 'u_est7', tipo: 'reunion', semana: 1, horas: 3, at: iso(-29), visibleEmpresa: true,
          texto: 'Visita a la tienda de San Juan de Lurigancho. Óscar me pasó las facturas de compra de los últimos tres meses y la lista de los productos que más salen.' },
        { id: U.uid('b'), autorId: 'u_est7', tipo: 'bloqueo', semana: 1, horas: 2, at: iso(-26), visibleEmpresa: false,
          texto: 'Las facturas no incluían el flete, que se paga aparte. Sin eso el margen salía inflado. Lo resolvimos estimándolo por viaje según el volumen.' },
        { id: U.uid('b'), autorId: 'u_est7', tipo: 'entrega', semana: 2, horas: 5, at: iso(-16), visibleEmpresa: true,
          texto: 'Entregué el análisis de los 40 productos que más rotan. Cuatro de ellos se estaban vendiendo por debajo del costo real una vez incluido el flete.' }
      ],
      entregaFinal: {
        titulo: 'Análisis de márgenes y propuesta de precios',
        resumen: 'Se calculó el costo real de los 40 productos de mayor rotación incluyendo el flete, que no se estaba considerando. Se detectaron cuatro productos vendidos por debajo del costo y se entregó una propuesta de precios con la hoja de cálculo para mantenerla.',
        enlaces: [
          { label: 'Análisis de márgenes', url: 'https://docs.google.com/ferretero-precios' },
          { label: 'Propuesta de lista de precios', url: 'https://docs.google.com/ferretero-lista' }
        ],
        at: iso(-16), porId: 'u_est7'
      },
      evaluaciones: [
        { id: U.uid('ev'), rol: 'mentor', evaluadorId: 'u_men1', at: iso(-15), decision: 'aprobado',
          criterios: { cumplimiento: 5, calidad: 4, comunicacion: 5, autonomia: 5, impacto: 5 },
          comentario: 'Lucía trabajó con mucha autonomía y supo explicarle los números al dueño en su lenguaje, que es lo más difícil de este tipo de encargos.' },
        { id: U.uid('ev'), rol: 'empresa', evaluadorId: 'u_emp4', at: iso(-14), decision: 'aprobado',
          criterios: { cumplimiento: 5, calidad: 5, comunicacion: 4, autonomia: 5, impacto: 5 },
          comentario: 'No sabíamos que había productos que vendíamos perdiendo plata. Ya subimos esos cuatro precios y nadie se quejó. Muy útil.' }
      ]
    };

    var proyectos = [pr1, pr2, pr3, pr4];

    /* ---------------- Constancias ---------------- */
    function constancia(o) { return o; }
    var constancias = [
      constancia({
        id: 'c1', codigo: 'UTL-2026-9F4K-2QMD', proyectoId: 'pr1', estudianteId: 'u_est1',
        emitidaAt: d(-33), emitidaPorId: 'u_coord1', estado: 'vigente',
        snapshot: {
          estudiante: 'Camila Rojas Peña', codigoUPN: 'N00218745', carrera: 'Administración y Marketing',
          reto: 'Reactivar las redes sociales de la panadería', empresa: 'Panadería Delicia Norteña E.I.R.L.',
          mentor: 'Luis Fernando Chávez', coordinador: 'Mariana Salazar Ríos',
          rol: 'Líder de equipo', inicio: inicio1, fin: fin1, semanas: 4, horas: 40,
          puntaje: 94, categoria: 'marketing',
          habilidades: ['Community management', 'Creación de contenido', 'Canva / piezas gráficas', 'Fotografía de producto'],
          logro: 'Reactivó las redes sociales del negocio, produjo un banco de 30 fotos propias y dejó instalado un flujo de pedidos por WhatsApp.'
        }
      }),
      constancia({
        id: 'c2', codigo: 'UTL-2026-7HTX-5RBN', proyectoId: 'pr1', estudianteId: 'u_est6',
        emitidaAt: d(-33), emitidaPorId: 'u_coord1', estado: 'vigente',
        snapshot: {
          estudiante: 'Mateo Ibáñez Cruz', codigoUPN: 'N00247781', carrera: 'Diseño Gráfico',
          reto: 'Reactivar las redes sociales de la panadería', empresa: 'Panadería Delicia Norteña E.I.R.L.',
          mentor: 'Luis Fernando Chávez', coordinador: 'Mariana Salazar Ríos',
          rol: 'Integrante', inicio: inicio1, fin: fin1, semanas: 4, horas: 40,
          puntaje: 92, categoria: 'marketing',
          habilidades: ['Canva / piezas gráficas', 'Fotografía de producto', 'Identidad de marca'],
          logro: 'Diseñó las 12 piezas gráficas de la campaña y dirigió la sesión fotográfica de productos del negocio.'
        }
      })
    ];

    /* ---------------- Portafolio ---------------- */
    users.forEach(function (u) {
      if (u.rol !== 'estudiante') return;
      u.portafolio = constancias.filter(function (c) { return c.estudianteId === u.id; }).map(function (c) {
        return {
          id: U.uid('pf'), constanciaId: c.id, proyectoId: c.proyectoId,
          titulo: c.snapshot.reto, empresa: c.snapshot.empresa, rol: c.snapshot.rol,
          relato: c.snapshot.logro, habilidades: c.snapshot.habilidades, visible: true,
          enlaces: [{ label: 'Verificar constancia', url: '#/verificar/' + c.codigo }]
        };
      });
    });

    /* ---------------- Pruebas prácticas ---------------- */
    var pruebas = [{
      id: 'pru1', estudianteId: 'u_est5', skill: 'powerbi', retoId: 'r6',
      nivelPretendido: 2, encargo: CFG.PRUEBAS_POR_HABILIDAD.powerbi,
      estado: 'solicitada', evidenciaUrl: '', comentario: '', revisorId: null,
      solicitadaAt: iso(-10), entregadaAt: null, revisadaAt: null
    }];

    /* ---------------- Notificaciones ---------------- */
    var notificaciones = [
      { id: U.uid('n'), userId: 'u_coord1', tipo: 'reto', titulo: 'Nuevo reto para revisar', cuerpo: 'EcoLimpio Servicios envió “Conseguir los primeros clientes de oficinas por internet”.', link: '#/reto/r7', leida: false, at: iso(-2) },
      { id: U.uid('n'), userId: 'u_coord1', tipo: 'seleccion', titulo: '4 postulaciones esperando selección', cuerpo: 'El reto “Tablero de ventas” cerró postulaciones. Falta conformar el equipo.', link: '#/matching/r6', leida: false, at: iso(-1) },
      { id: U.uid('n'), userId: 'u_est5', tipo: 'prueba', titulo: 'Te pedimos una prueba corta', cuerpo: 'Declaraste Intermedio en Power BI, que ese reto pide como indispensable, y aún no tiene respaldo.', link: '#/postulaciones', leida: false, at: iso(-10) },
      { id: U.uid('n'), userId: 'u_men3', tipo: 'hito', titulo: 'Hito entregado para revisión', cuerpo: 'Valeria Quispe entregó “Propuesta” del proyecto PRY-2026-0002.', link: '#/proyecto/pr2?tab=hitos', leida: false, at: iso(-1) },
      { id: U.uid('n'), userId: 'u_est3', tipo: 'hito', titulo: 'Hito 1 aprobado', cuerpo: 'Tu mentor aprobó el hito “Diagnóstico”.', link: '#/proyecto/pr2?tab=hitos', leida: true, at: iso(-4) },
      { id: U.uid('n'), userId: 'u_est8', tipo: 'hito', titulo: 'Hito 1 aprobado', cuerpo: 'Tu mentor aprobó el hito “Diagnóstico”.', link: '#/proyecto/pr2?tab=hitos', leida: true, at: iso(-4) },
      { id: U.uid('n'), userId: 'u_emp2', tipo: 'proyecto', titulo: 'Tu proyecto avanza', cuerpo: 'El equipo entregó el hito “Propuesta”. Puedes revisar el avance.', link: '#/proyecto/pr2', leida: false, at: iso(-1) },
      { id: U.uid('n'), userId: 'u_est1', tipo: 'constancia', titulo: 'Constancia emitida', cuerpo: 'Ya puedes descargar tu constancia del proyecto con Panadería Delicia Norteña.', link: '#/constancia/UTL-2026-9F4K-2QMD', leida: false, at: iso(-33) },
      { id: U.uid('n'), userId: 'u_est6', tipo: 'constancia', titulo: 'Constancia emitida', cuerpo: 'Ya puedes descargar tu constancia del proyecto con Panadería Delicia Norteña.', link: '#/constancia/UTL-2026-7HTX-5RBN', leida: false, at: iso(-33) },
      { id: U.uid('n'), userId: 'u_emp1', tipo: 'evaluacion', titulo: 'Proyecto cerrado', cuerpo: 'El microproyecto de redes sociales fue cerrado y las constancias fueron emitidas.', link: '#/proyecto/pr1', leida: true, at: iso(-33) }
    ];

    return {
      meta: { schema: CFG.SCHEMA, creada: new Date().toISOString(), contadores: { reto: 10, proyecto: 4, constancia: 2 } },
      users: users, retos: retos, postulaciones: postulaciones, proyectos: proyectos,
      constancias: constancias, pruebas: pruebas, notificaciones: notificaciones, auditoria: []
    };
  }

  return { construir: construir };
})();
