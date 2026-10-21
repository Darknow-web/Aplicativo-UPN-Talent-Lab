# Informe — Estratega de lanzamiento (Fase 4 de /explorar: plan de validación)
**Fecha:** 2026-10-21 · **Para:** Director de Cuenta · **Entregable:** `entregables/plan-de-validacion.md` · **Insumos:** perfil, decisiones, supuestos, `opciones-de-negocio.md`, informes del 2026-10-21 de mercado, finanzas y abogado del diablo, fichas 06, 08, 09, 10, 14, `finanzas/modelo.py`.

## Resumen
Nueve experimentos entre el martes 2026-10-27 y el domingo 2026-11-22, S/ 100–130 en total (S/ 145 si se cobra un piloto), 29,5 h de Carlos y 32 h de Indira, sin superar 10 h/semana por socio. El chatbot (A) se valida vendiendo un piloto de 30 días a S/ 100 por adelantado con una demo, antes de construir nada. Sorpresas y detalles (B) se valida con una caja costeada de verdad, dos motorizados cotizados y ≥ 6 pedidos pagados por adelantado. El desempate usa una sola regla fijada antes: margen real por hora sobre lo efectivamente cobrado; en empate (< 20 %) gana la recurrencia. Cada entrevista de A incluye la pregunta del cliente incógnito (S-09), como está registrado.

## Hallazgos
1. **La demo del chatbot no exige construir el producto.** Meta ofrece un número de prueba gratuito de la Cloud API con hasta 5 destinatarios verificados [VERIFICADO: developers.facebook.com, guía "Get started", consultada 2026-10-21; sin fecha visible en la página]. Con eso Carlos puede mostrar 10 respuestas reales en el celular del dueño en ≤ 6 h de trabajo [ESTIMADO: Carlos con Claude Code; se cronometra] en lugar de 80–120 h [ESTIMADO: ficha 08]. Si Meta exigiera verificación previa, la demo se hace simulada en pantalla (S-40).
2. **El precio de B solo cierra si el costo por pedido es ≤ la mitad del precio.** Con precio S/ 80 con envío y costo variable S/ 45, el modelo da S/ 21,78 de margen (32 %) y ningún escenario cubre un sueldo [ESTIMADO: `modelo.py`, informe financiero 2026-10-21]. Despejando la economía unitaria bajo RER, margen ≥ 40 % del ingreso neto equivale a costo ≤ 0,496 × precio con IGV [ESTIMADO: fórmula de `modelo.py`]. Por eso B1 fija el umbral en S/ 40 a S/ 80 y escala a S/ 95 si el costo real sale entre S/ 41 y S/ 50.
3. **Los umbrales de pedidos salen del modelo, no se inventan.** Base: 8 pedidos en el mes 1 → 6 en dos semanas de preventa; pesimista: 3 [ESTIMADO: `modelo.py`, escenarios de la idea 4]. Para A, 1 pago = pesimista modelado (S/ 100), 2 pagos = base.
4. **Las horas caben, pero W4 de Carlos llega al tope** (10 h) solo si A2 y B2 pasan a la vez: 7 h de construcción del piloto + 2 h de entregas + 1 h de desempate [ESTIMADO: suma del plan]. Semanas de exámenes de la UPN y campaña de SuperPet en noviembre: [DESCONOCIDO] (S-39); el plan prevé mover el arranque del piloto al 7-dic si hace falta, avisando al cliente antes de cobrar.
5. **La competencia de B ya está verificada y es fuerte.** SorprendeLima: S/ 80–360, 761 reseñas, envío a todo Lima, siempre con repostería o flores [VERIFICADO: capturas de los socios, 2026-10-21]. El precio de una caja sin alimentos preparados sigue [DESCONOCIDO]; B1 lo levanta con 5 cuentas de Instagram.
6. **F4 y F5 se respetan en los nueve experimentos.** Solo contactos registrados, locales que ya frecuentan como clientes, redes propias y un anuncio con métrica; sin alimentos preparados en casa; galletas de la amiga solo con registro sanitario (S-41) [VERIFICADO: perfil y decisiones, 2026-10-21].
7. **El desempate está abierto de verdad.** Con cifras del modelo, A con 1 piloto rinde ≈ S/ 6 por hora a 3 meses; A con 2 pilotos y B con 6 pedidos, ≈ S/ 10 por hora [ESTIMADO: aritmética ilustrativa del plan; el cálculo oficial debe entrar en `modelo.py`]. Ni la matriz ni la preferencia de los socios deciden: decide lo cobrado.

## Recomendaciones
1. **Ejecutar A1 y B1 en la misma semana (W1) y no esperar.** Por qué: son los únicos experimentos sin dependencia y traen los dos datos más frágiles (precio de A, costo de B). Costo S/ 70–90; 6,5 h Carlos, 7,5 h Indira. Métrica: ≥ 3 de 5 dueños eligen ≥ S/ 80/mes; costo de caja ≤ S/ 40.
2. **No escribir una línea del producto hasta que alguien pague S/ 100.** Por qué: 80–120 h de construcción no caben antes de diciembre y el riesgo principal señalado por el abogado del diablo es construir sin cliente. Costo S/ 0. Métrica: 1 pago antes del 2026-11-15 con fecha de inicio ≤ 30-nov.
3. **En B, cobrar el 100 % por adelantado y comprar insumos con ese dinero.** Por qué: capital expuesto cero y el criterio mide pago, no interés. Costo S/ 0. Métrica: ≥ 6 pedidos pagados, ≥ 2 fuera del círculo cercano.
4. **Pedir al analista financiero que cargue la función `desempate` en `modelo.py` antes del 2026-11-15.** Por qué: la regla está escrita en el plan, pero la aritmética oficial no puede quedar en el texto. Costo S/ 0, ~1 h. Métrica: `python3 finanzas/modelo.py --desempate` corre con los registros reales.
5. **Cada socio registra horas y gastos a diario (10 min).** Por qué: sin registro no hay desempate ni validación de S-33. Costo S/ 0. Métrica: tabla completa de los 27 días.
6. **Anotar quién paga cada sol.** Por qué: pérdida tolerable de Carlos S/ 100 vs. S/ 1 200 de Indira [VERIFICADO: perfil]; el plan puede superar los S/ 100. Costo S/ 0. Métrica: ningún gasto sin nombre.

## Riesgos
- **Pagos solo de familia y amigos cercanos** inflan B2 sin probar demanda; por eso el criterio exige ≥ 2 pedidos de fuera del círculo y B3 mide si un anuncio trae desconocidos. Si B3 no pasa, B se registra "con límite".
- **Un piloto cobrado y no entregado a tiempo** daña la primera relación comercial de los socios. Mitigación: A3 con tope de 30 h cronometradas y fecha de arranque pactada antes de cobrar; si una semana es de exámenes, se avisa al cliente antes del pago.
- **Verificación de negocio en Meta** podría exigir documentos que los socios no tienen como personas naturales [DESCONOCIDO]; A0 lo averigua en 2 h antes de prometer nada.
- **Colisión de W4:** si A2 y B2 pasan a la vez, Carlos queda al tope y cualquier imprevisto (examen, campaña) rompe la fecha del piloto. El plan ya dice qué se mueve (A3, una semana).
- **Sesgo de cortesía en A1:** los entrevistados son amigos y familia; por eso la pregunta 3 obliga a elegir un monto y la 4 pide fecha y pago, y A2 solo cuenta dinero recibido.
- **S-06 (contratos) sigue pendiente** y el primer cliente del chatbot llegaría el 15-nov; la lectura de la cláusula (30 min, S/ 0) debería hacerse antes de cobrar, como ya recomendó el Director.

## Preguntas abiertas para los socios
1. ¿Qué semanas de noviembre son de exámenes finales en la UPN y hay campaña en SuperPet o en el empleo de Indira? (S-39; define si A3 se mueve al 7-dic.)
2. ¿Aceptan cobrar el piloto a S/ 100 el primer mes y S/ 150 desde el segundo, en ese orden, sin regalar el primer mes? (Es el pesimista ya modelado; regalarlo deja A sin dato de pago.)
3. ¿Quién de los dos paga los S/ 100–130 de este plan y se anota así? (Pérdida tolerable de Carlos: S/ 100.)
4. ¿La amiga de las galletas vende con registro sanitario o marca formal? Si no, ¿aceptan que la caja lleve solo dulces envasados de marca? (S-41, F5.)
5. ¿Indira abre una cuenta de Instagram del negocio para B2/B3 o usa la personal? (Lo crea ella; la agencia no crea cuentas.)
6. Si A2 y B2 pasan y el desempate da empate (< 20 %), ¿aceptan de antemano la regla "gana la recurrencia"? Si no, díganlo ahora, antes de los datos, y el Director la cambia en `decisiones.md`.

## Supuestos nuevos para `expediente/supuestos.md`
| ID propuesto | Supuesto | Origen | Cómo validarlo |
|---|---|---|---|
| S-35 | Un dueño conocido paga S/ 100 por adelantado por un piloto de 30 días viendo solo una demo | A2 | Preventa A2; S/ 0; ≥ 1 pago antes del 2026-11-15 |
| S-36 | Un bot mínimo para un cliente se construye en ≤ 30 h de Carlos | A3 | Cronometrar A3; ≤ 30 h |
| S-37 | Un anuncio de S/ 30–40 en Meta trae ≥ 5 consultas por WhatsApp desde Lima Norte a ≤ S/ 8 por consulta | B3 | Anuncio B3 con "¿cómo nos encontraste?" |
| S-38 | ≥ 1 de cada 3 pedidos de la preventa viene de fuera del círculo cercano | B2 | Registrar relación con cada comprador; ≥ 2 de 6 |
| S-39 | Del 27-oct al 22-nov no hay exámenes finales de la UPN ni campaña en SuperPet | Marco del plan | Los socios confirman fechas; S/ 0, 5 min |
| S-40 | El número de prueba de la Cloud API permite una demo real sin verificación de negocio | A0 | Prueba A0; mensaje recibido |
| S-41 | La amiga de las galletas vende con registro sanitario o marca formal | B1 / A1 | Preguntarle en la entrevista (Carlos); sí/no |
| S-42 | Revender dulces envasados de marca dentro de una caja no exige registro sanitario adicional (F5) | B1 | Asesor legal en la Etapa 2; mientras tanto solo productos con registro visible |
