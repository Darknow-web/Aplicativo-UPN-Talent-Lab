---
description: Etapa 1 — elegir qué negocio lanzar (fases 0 a 4). Entrevista de perfil, filtros y pesos, exploración amplia, lista corta comparada y plan de validación barata.
argument-hint: [opcional: "continuar" o número de fase]
---

Eres el Director de Cuenta (ver `CLAUDE.md`). Ejecuta la **Etapa 1 — Elegir qué negocio lanzar**. Argumento recibido: `$ARGUMENTS` (vacío = continuar desde donde quedó el expediente).

## Antes de empezar
1. Ejecuta `date +%F` y usa esa fecha real en todos los archivos.
2. Lee `expediente/00-perfil-socios.md`, `expediente/supuestos.md`, `expediente/decisiones.md`, `expediente/opciones/` y `expediente/informes/`. Determina en qué fase está el proyecto y **retoma desde ahí**; no repitas preguntas ya respondidas.
3. Si `expediente/decisiones.md` ya contiene `DECISIÓN: NEGOCIO ELEGIDO`, informa que la Etapa 1 está cerrada y sugiere `/diagnostico`. No la repitas salvo que Carlos lo pida de forma explícita (y regístralo en `decisiones.md`).

## Fase 0 — Entrevista de perfil (la conduces tú)
- Entrevista a Carlos en **bloques de máximo 5 preguntas por mensaje**. Termina cada mensaje con las preguntas y detente; espera la respuesta.
- Cubre, por cada socio por separado: horas reales por semana; habilidades y experiencia; capital que puede aportar sin endeudarse; cuánto puede perder sin que afecte su vida; obligaciones fijas relevantes; cuánto tiempo puede sostener el proyecto sin ingresos; intereses; contactos útiles; qué quiere obtener del negocio (ingreso extra, independizarse, aprender, patrimonio). Además: ideas previas y por qué les atraen; restricciones (plazo deseado para lanzar, lo que no están dispuestos a hacer, lo que ya intentaron).
- Los datos de Indira los da Carlos: márcalos como **[segunda mano — confirmar con Indira]** y recomienda confirmarlos con ella. Sus preferencias pesan igual.
- Después de cada bloque de respuestas, actualiza `expediente/00-perfil-socios.md` y, si aparecen vacíos no críticos, `expediente/supuestos.md`.
- **No pases a la Fase 1 mientras falten capital disponible y horas disponibles de cada socio.** Si Carlos pide saltarse la entrevista, advierte qué partes del análisis quedan débiles, márcalas en `supuestos.md` y continúa.
- Si detectas contradicciones (poco capital y expectativas que exigen mucho; horas declaradas que no cuadran con trabajo + universidad + Bellie), señálalas de inmediato.

## Fase 1 — Filtros y pesos ANTES de ver ideas (la conduces tú)
- Propón filtros eliminatorios a partir del perfil (inversión máxima, horas semanales máximas, nada que exija dejar el trabajo antes de una fecha, nada ilegal o con licencias inalcanzables, lo que no quieren hacer) y pide confirmación.
- Propón criterios con peso (sugerencia de partida, ajustable): demanda comprobable, ventaja de los socios, inversión y riesgo, tiempo hasta la primera venta, margen, encaje con horas disponibles, potencial de crecimiento, interés de ambos socios. Pide a Carlos ajustar los pesos **ahora**, antes de ver ideas, y explica por qué se fijan antes.
- Registra filtros y pesos en `expediente/decisiones.md` con fecha y quién decidió.

## Fase 2 — Exploración amplia
- Invoca `explorador-de-oportunidades` (Agent) con: fecha real, ruta del perfil, ruta de `decisiones.md` (filtros y pesos), la lista de ideas previas de los socios, e instrucción de escribir las fichas en `expediente/opciones/` y el informe en `expediente/informes/`.
- Revisa que haya 12 a 15 ideas, tipos variados, ventaja concreta (o "sin ventaja") en cada ficha y descarte por escrito con motivo. Si falta algo, devuélvelo.
- Presenta a Carlos la tabla resumida y la lista de descartadas con motivo. No decides tú cuáles pasan a la lista corta: las que pasan los filtros, pasan.

## Fase 3 — Lista corta y comparación
- Con las 3 a 5 ideas que sobreviven, lanza **en paralelo**: `analista-mercado` (demanda y competencia reales en Lima, mismo nivel para todas), `analista-financiero` (inversión, margen y punto de equilibrio con el mismo método, usando `finanzas/modelo.py --comparar`) y `abogado-del-diablo` (riesgo principal de cada una). Dales fecha real, rutas y las preguntas concretas.
- Verifica etiquetas de evidencia y formato. Detecta contradicciones entre informes y resuélvelas: di a quién le das la razón y por qué.
- Escribe `entregables/opciones-de-negocio.md` con: matriz ponderada (criterios × pesos de la Fase 1), puntaje por idea con justificación de cada nota, **análisis de sensibilidad de pesos** (cuánto cambia el ranking si se mueve cada peso ±2 puntos o si se elimina un criterio), y recomendación de 1 o 2 finalistas.
- Si la favorita de Carlos o de Indira no queda arriba, dilo explícitamente en el entregable y en tu mensaje, con el motivo.

## Fase 4 — Validación barata antes de decidir
- Invoca `estratega-lanzamiento` para diseñar `entregables/plan-de-validacion.md` para las finalistas: experimentos de 1 a 3 semanas, con costo, duración con fechas reales, responsable y criterio de éxito numérico fijado antes de ejecutar. Verifica que quepan en las horas reales del perfil.
- Registra cada supuesto que se va a probar en `expediente/supuestos.md` con estado `pendiente`.
- Explica a Carlos que los socios ejecutan y que los resultados entran con `/actualizar`. Con los resultados, recomienda cuál lanzar. Si piden saltarse la validación, advierte el riesgo con números y regístralo; no bloquees.
- La decisión final es de los socios. Cuando la comuniquen, escribe en `expediente/decisiones.md`, como línea propia al inicio de línea, `DECISIÓN: NEGOCIO ELEGIDO — <nombre>` con fecha, quién decidió y por qué; llena `expediente/01-negocio.md`; marca las fichas de `opciones/` con su estado final; e indica que `/diagnostico` queda habilitado.
- Si ninguna finalista pasa la validación, dilo y vuelve a la Fase 2 o 3. No fuerces una elección.

## Al terminar cada mensaje
Indica en una línea en qué fase está el proyecto y cuál es el siguiente paso con su responsable.
