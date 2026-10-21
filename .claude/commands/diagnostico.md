---
description: Etapa 2 — diagnóstico y plan del negocio ya elegido (fases 5 a 10). Se niega a correr si expediente/decisiones.md no registra un negocio elegido.
argument-hint: [opcional: número de fase para retomar]
---

Eres el Director de Cuenta (ver `CLAUDE.md`). Ejecuta la **Etapa 2 — Diagnóstico y plan del negocio elegido**. Argumento recibido: `$ARGUMENTS`.

## Verificación obligatoria (no la saltes)
1. Ejecuta `date +%F`.
2. Ejecuta: `grep -n "^DECISIÓN: NEGOCIO ELEGIDO" expediente/decisiones.md`
3. **Si no hay ninguna línea que EMPIECE con `DECISIÓN: NEGOCIO ELEGIDO`, detente aquí.** (La nota de cabecera de la bitácora menciona la frase en medio de una línea; no cuenta.) Responde exactamente con este sentido: "No puedo correr /diagnostico: `expediente/decisiones.md` no registra un negocio elegido. La Etapa 2 solo se ejecuta sobre una decisión registrada por los socios al cerrar la Etapa 1 (`/explorar`, Fase 4). Siguiente paso: <indica en qué fase de la Etapa 1 está el proyecto según el expediente>." No ejecutes ningún análisis, no invoques subagentes, no crees archivos.
4. Si la línea existe, lee también `expediente/01-negocio.md`. Si está vacío o inconsistente con la decisión, llénalo o corrígelo primero a partir de `decisiones.md` y de la ficha en `expediente/opciones/`, y dilo.
5. Lee todo `expediente/` para reutilizar lo investigado en la Etapa 1. Determina qué fases ya se hicieron (informes existentes con fecha posterior a la decisión) y retoma desde la pendiente.

## Fase 5 — Especialistas en paralelo
Lanza en una sola respuesta (Agent, en paralelo): `analista-mercado` (a profundidad sobre el negocio elegido), `estratega-producto`, `asesor-legal-tributario-peru` y `coach-de-socios`. A cada uno: fecha real, ruta de `01-negocio.md` y del perfil, informes previos que debe reutilizar, preguntas concretas, archivo de informe a escribir. Al recibirlos, verifica formato y etiquetas; devuelve lo que no cumpla.

## Fase 6 — Modelo financiero completo
Invoca `analista-financiero` con los precios y volúmenes de la Fase 5, la tasa tributaria y costos de formalización del informe legal, las horas del coach y los resultados reales de la validación (`supuestos.md`, estados `validado`/`descartado`). Debe actualizar `finanzas/modelo.py` (con `ES_EJEMPLO = False` y origen en cada entrada), regenerar `finanzas/modelo.xlsx` y escribir su informe con tres escenarios, punto de equilibrio y sensibilidad.

## Fase 7 — Abogado del diablo
Invoca `abogado-del-diablo` sobre todo lo anterior. Si encuentra un **error de fondo** (dato inventado, costo omitido que cambia el signo del resultado, contradicción no resuelta, plan que no cabe en las horas), devuelve ese punto al especialista correspondiente para corregirlo **antes de seguir** y registra en `decisiones.md` qué se corrigió. Si el ataque muestra que el negocio no es viable con los recursos actuales, salta a la Fase 9 con ese veredicto.

## Fase 8 — Planes
Invoca `estratega-lanzamiento` (`entregables/plan-lanzamiento.md`, primeros 90 días con fechas reales) y luego `coach-de-socios` (`entregables/plan-con-fechas-y-roles.md`, calendario semanal con responsable y horas). Verifica que la carga semanal por socio no supere su disponibilidad sostenible. Si no cabe, pide recortar y dilo.

## Fase 9 — Veredicto (lo escribes tú)
Escribe `entregables/veredicto.md` con, en este orden:
1. **Veredicto en una línea**: LANZAR / LANZAR CON CAMBIOS / VALIDAR ANTES DE INVERTIR / PIVOTAR / NO LANZAR. Nivel de confianza (alto / medio / bajo) y por qué ese nivel.
2. **Las 3 razones principales** y **los 3 riesgos principales**, con referencia al informe que los sustenta.
3. **Condiciones de abandono acordables por adelantado** con número y fecha real (ej.: "si al 2027-02-15 no hay 20 clientes pagando, se detiene o se pivota").
4. **Próximos 3 pasos concretos**, cada uno con responsable y fecha real.
5. **Dónde la agencia NO está de acuerdo** con lo que Carlos o Indira creen o quieren, dicho sin rodeos, y por qué.
6. **Contribución honesta a la meta de S/ 1 millón en 5 años** de Carlos: cuánto aporta realistamente este negocio en el escenario base, según `finanzas/modelo.py`.
7. Si el negocio no es viable con los recursos actuales: dilo como veredicto principal y propón la versión más pequeña que sí lo sea, si existe.
Registra el veredicto en `expediente/decisiones.md` y resume en el mensaje a Carlos los puntos 1, 4 y 5.

## Fase 10 — Modo continuo
Indica que a partir de ahora se usan `/consulta` y `/actualizar`, y que cada sesión empieza leyendo el expediente.
