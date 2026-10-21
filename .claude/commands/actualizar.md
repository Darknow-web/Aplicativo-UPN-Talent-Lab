---
description: Registra un dato nuevo (resultado de un experimento, cambio de disponibilidad, precio real, etc.), actualiza el estado de los supuestos afectados y re-ejecuta solo los análisis que dependen de ese dato.
argument-hint: <dato nuevo>
---

Eres el Director de Cuenta (ver `CLAUDE.md`). Dato nuevo recibido de Carlos: **$ARGUMENTS**

Si viene vacío, pide el dato y detente.

## Procedimiento
1. Ejecuta `date +%F`.
2. Lee `expediente/` completo (`00-perfil-socios.md`, `01-negocio.md`, `supuestos.md`, `decisiones.md`, `opciones/`, `informes/`) y los `entregables/` existentes.
3. **Registra el dato** en el lugar que corresponde, con fecha real y etiqueta de evidencia:
   - Cambio de perfil (horas, capital, disponibilidad) → `expediente/00-perfil-socios.md`.
   - Resultado de un experimento de validación → `expediente/supuestos.md` (cambia el estado del supuesto a `validado` o `descartado`, anota el resultado numérico vs. el criterio de éxito fijado) y `entregables/plan-de-validacion.md` (marca el experimento como ejecutado).
   - Dato de mercado, precio, costo, norma → `expediente/supuestos.md` y, si cambia una cifra del modelo, pide al `analista-financiero` que actualice `finanzas/modelo.py` y regenere `modelo.xlsx`.
   - Decisión de los socios (incluida la elección del negocio) → `expediente/decisiones.md`. Si es la elección del negocio, escribe, como línea propia al inicio de línea, `DECISIÓN: NEGOCIO ELEGIDO — <nombre>` y llena `expediente/01-negocio.md`.
4. **Identifica qué supuestos cambian de estado** y lista cuáles informes, entregables o cifras dependían de ellos.
5. **Re-ejecuta solo los análisis afectados.** Invoca únicamente a los especialistas cuyos informes dependen del dato, con la instrucción de actualizar solo la parte afectada y escribir un informe nuevo con la fecha real (no sobreescribir el anterior). No repitas análisis que no cambian.
6. **Si el dato nuevo cambia el veredicto** (`entregables/veredicto.md`) o la recomendación de finalistas (`entregables/opciones-de-negocio.md`), **dilo en la primera línea de tu respuesta**, actualiza el entregable y registra el cambio en `decisiones.md` con lo que lo motivó.
7. Si el dato contradice algo registrado (por ejemplo, horas disponibles menores que las que asume el plan), señálalo de inmediato y muestra la consecuencia con números.
8. Responde con: qué se registró, qué supuestos cambiaron de estado, qué se re-evaluó, qué cambió en las conclusiones y cuál es el siguiente paso con responsable y fecha.

Si el dato es un resultado de validación y ninguna finalista pasa su criterio de éxito, dilo y propón volver a la Fase 2 o 3 de `/explorar` en vez de forzar una elección.
