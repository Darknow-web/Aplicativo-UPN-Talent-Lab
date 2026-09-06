# UPN Talent Lab

Aplicativo web del programa que conecta a estudiantes de la **Universidad Privada del Norte** con
**pequeñas y medianas empresas** a través de microproyectos de **2 a 4 semanas** con acompañamiento
de un docente mentor. Al cerrar el proyecto, la empresa recibe el resultado y el estudiante obtiene
una **constancia con código verificable** y una entrada en su portafolio.

No es una maqueta: el ciclo completo funciona de punta a punta.

---

## Cómo verlo

**En el celular y en la PC (recomendado):** una vez publicado en GitHub Pages, abre la URL del
repositorio. La interfaz se adapta sola — barra lateral en escritorio, barra inferior en móvil.

**Sin publicar nada:**

- Abre `index.html` con doble clic. Funciona directamente desde el disco, sin servidor.
- O sirve la carpeta: `python3 -m http.server 8000` y entra a `http://localhost:8000`.

**En un solo archivo:** `dist/upn-talent-lab.html` contiene la aplicación completa (HTML, CSS y JS
fusionados). Se puede enviar por correo o WhatsApp y abrir en cualquier equipo, sin conexión. Para
regenerarlo tras cambiar el código:

```
node tools/empaquetar.js
```

## Cuentas de demostración

En la pantalla de ingreso hay botones de acceso rápido (un clic, sin escribir nada).
Si prefieres escribir el correo, la contraseña de todas es `demo1234`.

| Rol | Correo | Qué puedes ver desde ahí |
|---|---|---|
| Estudiante | `camila.rojas@upn.demo` | Proyecto terminado, constancia y portafolio |
| Estudiante | `valeria.quispe@upn.demo` | Proyecto en ejecución con hitos por entregar |
| Empresa | `diego@patasana.demo` | Proyecto activo y seguimiento del avance |
| Empresa | `karina@ecolimpio.demo` | Reto esperando revisión de la universidad |
| Docente / mentor | `jorge.melendez@upn.demo` | Hito entregado esperando revisión |
| Coordinación UPN | `coordinacion@upn.demo` | Revisar retos, armar equipos, emitir constancias |

Para probar el verificador público sin iniciar sesión, usa el código `UTL-2026-9F4K-2QMD`
en **Verificar constancia**.

## El recorrido completo

1. **Empresa** describe su necesidad y la envía a revisión.
2. **Coordinación UPN** la revisa: publica, devuelve con observaciones o rechaza.
3. **Estudiantes** ven su porcentaje de compatibilidad y postulan.
4. **Coordinación** cierra postulaciones, revisa el ranking de compatibilidad, arma el equipo
   (maximizando la cobertura de habilidades) y asigna un docente mentor.
5. Se crea el proyecto con **hitos semanales** generados automáticamente.
6. **Estudiantes** entregan hitos y registran su bitácora; el **mentor** aprueba u observa.
7. El equipo envía la **entrega final**.
8. **Mentor y empresa** evalúan con la misma rúbrica de 5 criterios. Con ambas aprobaciones el
   proyecto queda listo.
9. **Coordinación** emite las **constancias** con código único; el proyecto se cierra y el
   portafolio del estudiante se actualiza.
10. Cualquier persona puede **verificar la constancia** por su código, sin iniciar sesión.

## Cómo elige el sistema a los estudiantes

`assets/js/06-matching.js` calcula un puntaje de 0 a 100 y **explica cada punto**:

| Factor | Peso |
|---|---|
| Cobertura de habilidades requeridas | 40 |
| Profundidad del nivel declarado | 15 |
| Disponibilidad horaria | 12 |
| Afinidad de carrera e intereses | 10 |
| Desempeño en proyectos previos | 7 |
| Ciclo académico | 6 |
| Modalidad de trabajo | 5 |
| Habilidades deseables | 5 |

Antes de puntuar hay **filtros duros**: no cumplir una habilidad indispensable, no tener las horas
mínimas o una modalidad incompatible descartan al candidato con un motivo visible. Después se
aplican ajustes de equidad (+4 a quien nunca ha participado, −8 a quien ya lleva dos microproyectos).

Para armar el equipo no se toman los mejores puntajes sin más: tras elegir al primero, cada
siguiente integrante se escoge combinando su puntaje con **cuánta cobertura nueva aporta**, para que
el equipo no repita perfiles y cubra todas las habilidades del reto.

## Estructura del proyecto

```
index.html                 Shell: barra lateral, topbar, contenido, barra inferior, modal, toasts
assets/css/styles.css      Sistema de diseño completo (paleta UPN, responsive, oscuro, impresión)
assets/js/
  00-config.js             Roles, estados, transiciones, habilidades, rúbrica y pesos del matching
  01-utils.js              Plantillas html`` con escape automático (barrera anti-XSS), fechas, helpers
  02-store.js              Persistencia en localStorage con transacciones y migración de esquema
  03-seed.js               Datos de demostración (fechas relativas a hoy)
  04-auth.js               Sesión, registro y tabla de permisos (Auth.can)
  05-models.js             Reglas del ciclo: retos, postulaciones, proyectos, evaluación, constancias
  06-matching.js           Compatibilidad, armado de equipo y sugerencia de mentor
  07-ui.js  08-components.js   Toasts, modal, tema · piezas visuales reutilizables
  09-router.js             Router por hash con guards por rol
  10..17-views-*.js        Pantallas por rol
  18-actions.js            Registro de acciones + delegación de eventos
  19-app.js                Arranque y tabla de rutas
tools/empaquetar.js        Fusiona todo en un archivo HTML autocontenido
dist/upn-talent-lab.html   Resultado: la app completa en un solo archivo
```

### Decisiones técnicas

- **Sin build ni dependencias.** HTML, CSS y JavaScript clásico. Nada que instalar, nada que se rompa.
- **Routing por hash** (`#/proyecto/pr2?tab=hitos`): funciona en GitHub Pages sin configuración y
  también con `file://`. El estado de la vista (pestaña activa, filtros, selección de equipo) vive
  en la URL, así que sobrevive a recargar y se puede compartir.
- **Todo el texto de usuario se escapa.** Las vistas se escriben con el tagged template `` html`` ``
  de `01-utils.js`, que escapa cada interpolación; solo lo envuelto en `U.raw()` pasa sin escapar, y
  `U.safeUrl()` neutraliza enlaces `javascript:`.
- **Un solo flujo de datos:** evento → acción → modelo → `Store` → `Router.refresh()` → vista.
  Nunca se toca el DOM a mano para reflejar un cambio de datos.
- **La constancia guarda una copia congelada** de los datos del momento de emisión, así no cambia si
  después se edita el reto o el perfil.

## Publicar en GitHub Pages

El workflow `.github/workflows/pages.yml` publica el sitio en cada push. Solo hay que activarlo
una vez:

1. En GitHub, entra a **Settings → Pages**.
2. En **Source**, elige **GitHub Actions**.
3. Listo. Cada push vuelve a publicar y la URL queda disponible para abrirla desde el celular.

## Notas

- Los datos se guardan en el **navegador de cada dispositivo** (`localStorage`), no en un servidor.
  Cada persona que abra el enlace parte de los mismos datos de demostración y sus cambios son suyos.
- En **Ajustes** se puede descargar una copia en JSON o restaurar los datos de demostración.
- Prototipo académico: las contraseñas demo están a la vista a propósito y no hay datos reales de
  personas.
