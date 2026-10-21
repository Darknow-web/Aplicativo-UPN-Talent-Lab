# Opciones de negocio — lista corta y comparación (Fase 3)

**Fecha:** 2026-10-21 · **Autor:** Director de Cuenta · **Insumos:** `expediente/informes/2026-10-21-analista-mercado.md`, `2026-10-21-analista-financiero.md`, `2026-10-21-abogado-del-diablo.md`, `2026-10-21-explorador-de-oportunidades.md`, `finanzas/modelo.py` (`python3 finanzas/modelo.py --comparar`). Matriz reproducible: `python3 finanzas/matriz_fase3.py`.

## Resumen
Ninguna de las cinco ideas reemplaza un sueldo de S/ 2 000 en el escenario base a 12 meses, y la fecha de independencia de julio de 2027 no es alcanzable en base con ninguna [ESTIMADO: modelo.py, sueldo S/ 2 000 por socio como supuesto S-26]. Con los pesos fijados en la Fase 1, el ranking es: chatbot de WhatsApp (73), cliente incógnito (72), taller de apps con IA (70), sorpresas y detalles (63), decoración para eventos (43). Las tres primeras están a 3 puntos y cambian de orden con cualquier movimiento de pesos; las dos últimas no suben al primer lugar con ningún peso razonable. Finalistas recomendadas: **chatbot de WhatsApp con panel** y **cliente incógnito + micro-capacitación**, que comparten cliente y se validan con las mismas conversaciones. De las ideas propias de los socios, solo el chatbot queda arriba; detalles y decoración no.

## 1. Filtros y pesos (fijados en la Fase 1, `expediente/decisiones.md`)
Filtros F1–F6. Pesos: demanda comprobable 20 · tiempo hasta la primera venta 15 · ventaja de los socios 15 · inversión y riesgo 15 · encaje con horas y horarios 10 · margen por venta 10 · potencial de reemplazar un sueldo 10 · interés de ambos socios 5.

## 2. Descartadas antes de la comparación (Fase 2)
01 Sastra, 02 app de gimnasio, 03 Life Quest: no pasan F6 (primera venta después de 90 días). Fuera de la lista corta por decisión de los socios con la agencia: 04 Ruta y Mesa (sin audiencia, Carlos ya no la quiere), 07 agencia de contenido (mercado saturado, sin ventaja), 11 academias y 12 kits escolares (dependen de un solo contacto y caen en el límite de F6).

## 3. Datos base por idea (mismo método)
| Idea | Demanda (mercado) | Precios reales en Lima (mercado) | Precio de lista modelado | Inversión | Margen/u | PE u/mes | Resultado 12 m pes / base / opt | h/sem pico (base) | Riesgo principal (abogado del diablo) |
|---|---|---|---|---|---|---|---|---|---|
| 1 Chatbot WhatsApp + panel | Media en categoría; desconocida en negocios de 1–10 personas [VERIFICADO/DESCONOCIDO] | Proveedores de Lima S/ 200–1 500/mes; DIY S/ 57–185/mes | S/ 150/mes (80–200) [SUPUESTO S-34] | S/ 170 | S/ 92 (72 %) | 0,8 | −405 / 6 284 / 13 974 | 18,9 (solo Carlos construye) | Construir 4–6 semanas sin cliente; API no oficial |
| 2 Cliente incógnito + micro-cap. | Problema evidenciado; pago desconocido [DESCONOCIDO] | Agencias ≥ US$ 1 000/estudio; locales pequeños sin precio | S/ 180/servicio (120–250) [SUPUESTO S-34] | S/ 105 | S/ 100 (66 %) | 0,4 | 167 / 5 230 / 11 319 | 15,9 | Disposición a pagar ≥ S/ 100 sin validar (S-09) |
| 3 Taller apps con IA | Interés medio; pago desconocido | PUCP S/ 277/12 h; resto sin precio público | S/ 40/asiento (30–50) [SUPUESTO S-34] | S/ 100 | S/ 30 (90 %) | 4,1 | −1 081 / 4 913 / 16 457 | 11,8 (solo Carlos) | Primer taller con amigos, segundo vacío; pesimista supera pérdida tolerable de Carlos |
| 4 Sorpresas y detalles | Alta, categoría madura [VERIFICADO] | S/ 69–260 por caja/desayuno; sin alimentos [DESCONOCIDO] | S/ 80 con envío (55–105) [SUPUESTO S-34] | S/ 180 | S/ 22 (32 %) | 2,3 | −236 / 2 946 / 8 695 | 12,9 | Sin diferenciación; a S/ 55 el margen es S/ 0,91 |
| 5 Decoración eventos | Oferta y precios sí; demanda en hogares no | Básico S/ 150–420; DIY S/ 20–35 | S/ 250/evento (150–400) [SUPUESTO S-34] | S/ 345 | S/ 89 (42 %) | 0,5 | −262 / 2 968 / 5 596 | 17,2 (fines de semana) | Quema S/ 345 de S/ 400 antes de vender; a S/ 150 margen S/ 5 |

Cifras financieras: `python3 finanzas/modelo.py --comparar`, régimen uniforme RER [SUPUESTO S-27], cobro sin comisión [SUPUESTO S-28]. Horas: fijas + por unidad [SUPUESTO S-33].

## 4. Matriz ponderada (puntaje 1–5 por criterio)
| Criterio (peso) | 1 Chatbot | 2 Incógnito | 3 Taller | 4 Detalles | 5 Decoración |
|---|---|---|---|---|---|
| Demanda comprobable (20) | 3 — categoría con evidencia, segmento sin precio | 2 — la más desconocida de las cinco | 3 — interés sí, pago no | 5 — categoría madura con precios | 3 — oferta sí, demanda en hogares no |
| Tiempo hasta 1.ª venta (15) | 2 — 80–120 h de construcción antes de cobrar; banda 31 ene | 4 — nada que construir; banda dic | 4 — preventa posible en dic | 5 — única en banda 1 dic | 3 — dic posible, pero exige kit antes |
| Ventaja de los socios (15) | 5 — bot ya construido por Carlos; Indira lee paneles | 4 — es el trabajo de Carlos, en retail no gastronomía | 4 — casos reales; S-18 pendiente | 1 — sin ventaja | 1 — sin ventaja |
| Inversión y riesgo (15) | 4 — S/ 170; pesimista −405 | 5 — S/ 105; única positiva en pesimista | 3 — S/ 100; pesimista −1 081 > pérdida tolerable de Carlos | 3 — S/ 180; precio bajo anula margen | 1 — S/ 345 de 400 antes de vender |
| Encaje con horas (10) | 2 — construcción indivisible sobre Carlos en nov–dic | 4 — 15,9 h; visitas en fines de semana | 3 — 11,8 h, todas de Carlos en exámenes | 3 — 12,9 h; 1 sueldo exigiría 37,6 h | 2 — solo fines de semana; 1 sueldo exigiría 57 h |
| Margen por venta (10) | 5 — S/ 92, 72 % | 4 — S/ 100, 66 % | 5 — 90 % pero S/ 30 por asiento | 2 — S/ 22, 32 % | 3 — S/ 89 a S/ 250; S/ 5 a S/ 150 |
| Reemplazar un sueldo (10) | 5 — única que cubre 2 sueldos dentro de F2 (44 clientes, 32 h) | 3 — 1 sueldo cabe (31 h); 2 no | 3 — 70 asientos/mes sin audiencia | 1 — nunca en ningún escenario | 1 — nunca en ningún escenario |
| Interés de ambos (5) | 4 — idea de los socios; Indira sin registrar | 3 — idea de la agencia | 3 — idea de la agencia | 4 — idea de los socios | 4 — idea de los socios |
| **Puntaje (0–100)** | **73** | **72** | **70** | **63** | **43** |

## 5. Sensibilidad de los pesos (`finanzas/matriz_fase3.py`)
- Mover cualquier peso ±5 puntos intercambia el primer y segundo lugar entre chatbot e incógnito; el taller queda tercero en todos los casos salvo si se elimina "inversión y riesgo" (empata segundo) o "sueldo" (sube a segundo).
- Si se elimina "demanda comprobable": incógnito 80, chatbot 76, taller 73. Si se elimina "ventaja de los socios": incógnito y detalles empatan primeros (70,6), chatbot 68.
- Detalles solo llega a primer lugar eliminando por completo el criterio de ventaja; decoración queda última en los 25 escenarios probados.
- Si Indira prefiere fuertemente detalles y rechaza las ideas de la agencia (interés 5 vs. 2): chatbot 73, incógnito 71, taller 69, detalles 64. El criterio de interés (5 puntos) no alcanza para cambiar el orden; si los socios quieren que su preferencia pese más, deben cambiar el peso en `decisiones.md` antes de la validación, no después.

## 6. Contradicciones entre informes y cómo se resolvieron
- **Precio de decoración:** finanzas modeló S/ 250 (150–400); mercado encontró paquetes básicos de S/ 150–420 y sugiere entrada S/ 150–250. Le doy la razón a mercado: a S/ 150–200 el margen cae a S/ 5–45 y el resultado base se acerca a cero. El puntaje de margen (3) refleja esto.
- **Precio del chatbot:** finanzas usó S/ 150/mes, el tope del rango de entrada de mercado (S/ 80–150). Con S/ 80 el resultado base baja a S/ 1 658. Se mantiene S/ 150 como lista solo para el piloto cobrado; la validación lo prueba.
- **Horas del chatbot:** finanzas excluye del flujo las 80–120 h de construcción previas; el abogado del diablo lo objeta y tiene razón. Por eso "tiempo hasta la primera venta" puntúa 2 y "encaje con horas" 2, pese a que el flujo mensual cabe.
- **S-06 (contratos):** marcado validado por declaración y devuelto a pendiente por objeción del abogado del diablo. Afecta a 1, 2 y 3.
- **SorprendeLima:** enlace entregado, pero el sitio devolvió error 429 en 5 intentos. Sigue [DESCONOCIDO]; se pide a los socios 5 capturas con precio.

## 7. Recomendación: finalistas
**Finalistas: (1) chatbot de WhatsApp con panel y (2) cliente incógnito + micro-capacitación.** Motivos: son las dos primeras con los pesos fijados y se intercambian con cualquier ajuste, así que ninguna domina; venden al mismo cliente (cafeterías y tiendas pequeñas de Lima), por lo que las 5 conversaciones con dueños que exige la validación sirven para las dos a la vez; una es de los socios y la otra de la agencia; y son las únicas dos que, según el modelo, podrían cubrir al menos un sueldo dentro de las horas disponibles. **Reserva:** el taller (3) entra si las dos finalistas fallan la validación; no se valida ahora porque toda su carga cae sobre Carlos en semanas de exámenes y su pesimista supera la pérdida tolerable de Carlos.

**Lo que no queda arriba, dicho sin rodeos:** de las cinco ideas nuevas que los socios trajeron, solo el chatbot llega a finalista. Sorpresas y detalles tiene la mejor demanda y la venta más rápida, pero sin ventaja y con margen de S/ 22 nunca cubre un sueldo. Decoración queda última en todos los escenarios: gasta S/ 345 de los S/ 400 antes de la primera venta.

**Lo que ninguna logra:** reemplazar un sueldo en 12 meses en el escenario base. Julio de 2027 solo aparece en el escenario optimista del taller (mes 10) y del chatbot (mes 11), con crecimientos de 20 % mensual que nadie ha comprobado. Los socios deben decidir sabiendo esto.

## 8. Decisión de los socios (2026-10-21, posterior a la recomendación)
Carlos e Indira eligieron como finalistas **chatbot de WhatsApp con panel** y **sorpresas y detalles por pedido en fechas especiales**. Con el interés declarado (5 para ambas, 2 para incógnito y taller) la matriz da: chatbot 74, incógnito 71, taller 69, detalles 64, decoración 42. La agencia mantiene su desacuerdo parcial (ver `expediente/decisiones.md`) y respeta la decisión: la validación de detalles mide margen real y pedidos pagados. Capturas de SorprendeLima aportadas por los socios: precios S/ 80–360, 761 reseñas, envío a todo Lima [VERIFICADO: capturas, 2026-10-21].

## 9. Pendientes que siguen abiertos
- Lectura de la cláusula de exclusividad de cada contrato (S-06): los socios no la tienen a mano y aceptan el riesgo.
- Precio de cajas de detalle sin alimentos ni flores (S-23): SorprendeLima no lo resuelve.
