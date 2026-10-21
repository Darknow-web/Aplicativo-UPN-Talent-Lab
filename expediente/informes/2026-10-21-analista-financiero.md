# Informe — Analista financiero (Fase 3 de /explorar: comparativo con el mismo método)
> Nota del Director (2026-10-21): los supuestos nuevos de este informe se renumeraron de S-19..S-27 a S-26..S-34 porque el analista de mercado ya había usado S-19..S-25 el mismo día.
**Fecha:** 2026-10-21 · **Para:** Director de Cuenta · **Fuente de todas las cifras:** `python3 finanzas/modelo.py` y `python3 finanzas/modelo.py --comparar` (hoja con fórmulas: `python3 finanzas/modelo.py --xlsx` → `finanzas/modelo.xlsx`, recalculada en LibreOffice y verificada contra el script sin diferencias). Las proyecciones son **escenarios, no predicciones**.

## Resumen
Las cinco ideas caben en F1 (inversión ≤ S/ 400, fijos ≤ S/ 150/mes) y en el capital real (S/ 400 + S/ 350/mes) en los tres escenarios. **Ninguna reemplaza un sueldo (S/ 2 000/mes por socio, supuesto) en 12 meses en el escenario base**; solo en el optimista lo hacen el taller (mes 10), el chatbot (mes 11) y el cliente incógnito (mes 12); detalles y decoración no lo logran en ningún escenario. Julio de 2027 (mes 8 si la primera venta es en diciembre de 2026) no es alcanzable como fecha de independencia con ninguna. El **precio** es el supuesto más frágil en las cinco y en todas es un `[SUPUESTO]` con rango; en detalles y decoración el extremo bajo del rango deja margen casi nulo. Por margen por hora y encaje con F2, el chatbot y el cliente incógnito son las dos mejores; el cliente incógnito es la única con resultado positivo incluso en el pesimista.

## Hallazgos
**Tabla comparativa (régimen uniforme SUPUESTO: RER, IGV 18 % + renta 1,5 %; cobro por Yape/transferencia sin comisión; precio de lista):**

| Idea | Inversión | Margen/u (y %) | PE (u/mes) | Recupera (base) | Resultado 12 m pes / base / opt | h/sem (pico base) | Supuesto más frágil (2.º) |
|---|---|---|---|---|---|---|---|
| 1. Chatbot WhatsApp + panel | S/ 170 | S/ 92,14 (72,5 %) | 0,8 | mes 2 | S/ −405 / S/ 6 284 / S/ 13 974 | 18,9 | precio (crecimiento) |
| 2. Cliente incógnito + micro-capacitación | S/ 105 | S/ 100 (65,7 %) | 0,4 | mes 1 | S/ 167 / S/ 5 230 / S/ 11 319 | 15,9 | precio (unidades mes 1) |
| 3. Taller "construye tu app con IA" | S/ 100 | S/ 30,39 (89,6 %) | 4,1 | mes 1 | S/ −1 081 / S/ 4 913 / S/ 16 457 | 11,8 | precio (unidades mes 1) |
| 4. Sorpresas y detalles | S/ 180 | S/ 21,78 (32,1 %) | 2,3 | mes 2 | S/ −236 / S/ 2 946 / S/ 8 695 | 12,9 | precio (costo variable) |
| 5. Decoración para eventos | S/ 345 | S/ 88,69 (41,9 %) | 0,5 | mes 3 | S/ −262 / S/ 2 968 / S/ 5 596 | 17,2 | precio (costo variable) |

Unidad: 1 = mensualidad de un cliente; 2 = servicio (visita + informe + sesión); 3 = asiento; 4 = pedido con envío; 5 = evento. Escenarios (unidades mes 1 / crecimiento mensual neto / factor de precio): 1 → pes 1 / 0 % / S/ 100, base 2 / +20 %, opt 3 / +25 %; 2 → pes 1 / 0 % / −25 %, base 2 / +15 %, opt 3 / +20 %; 3 → pes 4 / −15 % / −25 %, base 10 / +10 %, opt 15 / +20 %; 4 → pes 3 / 0 % / −10 %, base 8 / +10 %, opt 15 / +15 %; 5 → pes 1 / 0 % / −20 %, base 2 / +10 %, opt 3 / +12 %. Todos `[SUPUESTO: por validar]`, justificados en `finanzas/modelo.py`. Cada pesimista es "solo conocidos, sin referidos" porque es la primera venta en la vida de los socios (S-08).

1. **Ninguna idea cubre un sueldo en el escenario base dentro de 12 meses.** Flujo neto del mes 12 en base: chatbot S/ 1 299, incógnito S/ 893, taller S/ 743, detalles S/ 447, decoración S/ 466 `[ESTIMADO: modelo.py, escenario base]`. El sueldo de referencia es S/ 2 000/mes por socio `[SUPUESTO: los sueldos reales no están registrados — DESCONOCIDO; piso RMV S/ 1 130 VERIFICADO: D.S. 006-2024-TR, no verificado si subió en 2026]`. Dos sueldos (S/ 4 000) no se alcanzan en ningún escenario ni idea.
2. **Qué idea podría reemplazar un sueldo y a qué costo en horas** `[ESTIMADO: (fijos + sueldo) ÷ margen; horas = fijas + por unidad × unidades ÷ 4,33]`: chatbot **22,5 mensualidades/mes ≈ 22,4 h/semana** (cabe en F2; dos sueldos: 44,2 clientes ≈ 32,4 h, también cabe); incógnito 20,3 servicios/mes ≈ 31,2 h (cabe; dos sueldos 58,8 h, no cabe); taller 69,9 asientos/mes ≈ 17,4 h (cabe, pero exige casi 70 asientos al mes en cohortes de ~12 personas, sin audiencia hoy); detalles 94,1 pedidos/mes ≈ 37,6 h (**no cabe en F2**); decoración 23 eventos/mes ≈ 57,1 h (**no cabe**: solo fines de semana). Conclusión: solo el chatbot escala a dos sueldos con las horas registradas; el cliente incógnito llega a uno.
3. **El precio mueve más el resultado en las cinco** (±20 % sobre el base: chatbot ±S/ 3 965 de rango, detalles ±S/ 4 570) `[ESTIMADO: sensibilidad modelo.py]`. Y las cinco tienen precio supuesto. Extremos del rango (base, 12 m): chatbot S/ 80 → S/ 1 658, S/ 200 → S/ 9 588; incógnito S/ 120 → S/ 2 325, S/ 250 → S/ 8 619; taller S/ 30 → S/ 3 128, S/ 50 → S/ 6 698; **detalles S/ 55 → margen S/ 0,91 y resultado S/ −624; decoración S/ 150 → margen S/ 5,21 y resultado S/ −602.** Detalles y decoración solo funcionan si el mercado paga la mitad alta del rango (S-17).
4. **Riesgo a la baja (pesimista):** taller S/ −1 081 (fijos de S/ 124/mes sin asientos: Zoom Pro S/ 55 + plan de IA S/ 69 `[ESTIMADO: US$ 15,99 y US$ 20 × TC 3,44 VERIFICADO: open.er-api.com, 2026-10-21]`), chatbot S/ −405, decoración S/ −262, detalles S/ −236, incógnito **+S/ 167** (recupera en el mes 5 incluso en pesimista). Todo cabe en los S/ 400 + S/ 350/mes, pero el pesimista del taller supera la pérdida tolerable de Carlos (S/ 100) y solo cabe en la de Indira (S/ 1 200).
5. **Chatbot: el flujo no incluye las 80–120 h de construcción previas al mes 1** `[ESTIMADO: ficha 08, 4–6 semanas × 20 h]` ni bajas de clientes (el +20 %/mes es neto; segundo supuesto más frágil, rango S/ 3 694). Costo variable por cliente S/ 33,07 `[ESTIMADO: 100 plantillas × US$ 0,038 VERIFICADO: ficha 08/SleekFlow 2025 × TC + IA S/ 15 + servidor S/ 5]`: con API no oficial baja, pero aplica S-11.
6. **Régimen tributario:** sin informe legal, se usó RER para las cinco `[SUPUESTO]`. Si el asesor legal confirma Nuevo RUS (cuota S/ 20/mes, sin IGV, solo boletas) `[VERIFICADO: D. Leg. 937/1270, no verificado hoy]`, el margen sube: chatbot S/ 117, incógnito S/ 130, taller S/ 37, detalles S/ 35, decoración S/ 130. Con 4.ª categoría (8 %, solo 2 y 3): incógnito S/ 116, taller S/ 33,80. Con pasarela Culqi (3,44 % + US$ 0,20 `[VERIFICADO: culqi.com/precios, 2026-10-21]`) baja: detalles S/ 18,34, chatbot S/ 86,29. El ranking no cambia con ninguna variante.
7. **F1 y capital:** todas pasan. Decoración consume S/ 345 de los S/ 400 antes de la primera venta y es la única con peor caja igual a toda la inversión en los tres escenarios (S/ −345); recupera en el mes 3 en base.

## Recomendaciones
1. **Validar el precio antes de cualquier otra cosa, en las 1–2 finalistas.** Por qué: es el supuesto más frágil en las cinco. Costo: S/ 0, 2–3 h por idea (5 conversaciones o cotizaciones). Métrica: ≥ 3 de 5 aceptan un precio ≥ el de lista del modelo (S/ 150, S/ 180, S/ 40, S/ 80, S/ 250).
2. **Chatbot: cobrar el piloto, aunque sea a S/ 100** (es el caso pesimista ya modelado) y **medir el costo variable real** (mensajes de plantilla y tokens) en el primer mes. Costo: S/ 170 + 80–120 h. Métrica: 1 mensualidad cobrada antes del 2026-12-31 y costo variable medido ≤ S/ 35/cliente.
3. **Cliente incógnito: ejecutar las 3 visitas de muestra (S/ 105) ya**; es la opción con menor pérdida posible y sin construcción. Métrica: ≥ 2 de 5 dueños pagan ≥ S/ 120 (el extremo bajo todavía da S/ 2 325 a 12 meses en base).
4. **Decoración: no comprar el kit (S/ 345) hasta tener 2 eventos vendidos con adelanto del 50 %.** Por qué: S/ 345 de los S/ 400 del capital quedan inmovilizados antes de vender y el margen es S/ 5,21 en el extremo bajo del precio. Costo: S/ 0. Métrica: 2 adelantos recibidos.
5. **Detalles: solo seguir si las cotizaciones de S-17 muestran precio ≥ S/ 80 con envío.** Por qué: a S/ 55 el margen es S/ 0,91 y necesita 94 pedidos/mes (37,6 h) para un sueldo. Costo: S/ 0, 1 h en Instagram.
6. **Pedir al asesor legal (Etapa 2) el régimen real por idea** (RUS/RER/4.ª). Por qué: mueve el margen de S/ 88,69 a S/ 130 por unidad en decoración (RER vs. RUS) sin cambiar el ranking. Costo: S/ 0–200.

## Riesgos
- Los crecimientos mensuales (+10 % a +25 %) son supuestos sin dato de referidos; nunca han vendido. Si el crecimiento base del chatbot cae 20 %, el resultado baja a S/ 4 675.
- Bajas de clientes (churn) no modeladas en el chatbot; el precio B2B puede exigir factura (RER) y verificación de negocio en Meta.
- Carga concentrada en Carlos en 1 y 3 (construcción, contenido); el modelo cuenta horas-persona, no quién las pone.
- El sueldo de S/ 2 000 es supuesto: si los sueldos reales son mayores, las unidades necesarias suben proporcionalmente.
- Costos locales de detalles y decoración sin cotización (S-17): cv_directo es el segundo supuesto más frágil en ambas.

## Preguntas abiertas para los socios
1. ¿Cuál es el sueldo neto actual de cada uno? (Define "reemplazar un sueldo".)
2. ¿La academia y la librería necesitan factura para pagar un servicio mensual? (Decide RER vs. RUS.)
3. ¿Carlos ya paga un plan de IA (US$ 20/mes)? Si sí, ¿lo tratamos como costo del negocio o personal?
4. ¿Aceptan vender el chatbot a S/ 100 el primer mes como piloto pagado?
5. ¿Tienen dónde guardar un kit de decoración y quién transporta el material sin auto?

## Supuestos nuevos para `expediente/supuestos.md`
| ID propuesto | Supuesto | Origen | Cómo validarlo |
|---|---|---|---|
| S-26 | Sueldo objetivo S/ 2 000/mes por socio | modelo.py, SUELDO_OBJETIVO | Los socios declaran su sueldo neto; S/ 0, 5 min |
| S-27 | Régimen RER (IGV 18 % + 1,5 %) uniforme para las cinco; RUS o 4.ª cambian el margen pero no el ranking | modelo.py, tributos_uniformes | Informe del asesor-legal-tributario-peru en Etapa 2 |
| S-28 | Cobro por Yape/Plin/transferencia sin comisión; clientes B2B aceptan transferencia | modelo.py, tasa_pasarela | Preguntar a los 2 primeros clientes; si piden tarjeta, aplicar Culqi 3,44 % + US$ 0,20 |
| S-29 | Costo variable del chatbot S/ 33,07/cliente/mes (100 plantillas Meta + IA S/ 15 + servidor S/ 5) | modelo.py, idea 1 | Medir en el piloto durante 30 días; criterio ≤ S/ 35 |
| S-30 | Crecimiento mensual base por referidos: 20 % (1), 15 % (2), 10 % (3, 4, 5) | modelo.py, escenarios | Contar referidos reales en los 2 primeros meses; criterio ≥ 1 cliente nuevo por referido cada 2 meses |
| S-31 | El taller necesita Zoom Pro (S/ 55/mes); Meet gratuito corta a 60 min | modelo.py, idea 3 | Probar Meet con 3 personas más de 60 min; S/ 0 |
| S-32 | S/ 40–50/mes de promoción bastan para generar demanda sin prospección en frío (2, 4, 5) | modelo.py, fijos | Primer mes de publicaciones impulsadas; criterio ≥ 5 consultas/mes |
| S-33 | Horas por unidad: 2 h/mensualidad (1), 6 h/servicio (2), 0,58 h/asiento (3), 1,5 h/pedido (4), 10 h/evento (5) | modelo.py, horas_por_unidad | Cronometrar las 2 primeras unidades de cada finalista |
| S-34 | Precio de lista por idea: S/ 150, 180, 40, 80 (con envío), 250, con los rangos anotados | modelo.py, precio_venta | Ver recomendación 1 |
