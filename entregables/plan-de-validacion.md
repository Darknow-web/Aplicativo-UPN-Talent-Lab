# Plan de validación barata — Fase 4 de /explorar

**Fecha:** 2026-10-21 (miércoles) · **Autor:** estratega de lanzamiento · **Para:** Director de Cuenta · **Ejecutan:** Carlos e Indira; la agencia no ejecuta nada.
**Insumos:** `expediente/00-perfil-socios.md`, `decisiones.md` (filtros F1–F6; finalistas elegidas por los socios), `supuestos.md`, `entregables/opciones-de-negocio.md`, informes del 2026-10-21 de mercado, finanzas y abogado del diablo, fichas 06, 08, 09, 10 y 14, `finanzas/modelo.py`.

## Resumen
Dos finalistas, cuatro semanas (martes 2026-10-27 a domingo 2026-11-22), **S/ 100–130 en total** (S/ 145 si se cobra un piloto del chatbot y se compra el chip) y **máximo 10 h por semana por socio**. Finalista A (chatbot de WhatsApp con panel) se valida **vendiendo el piloto antes de construirlo**: entrevistas a 5–6 dueños conocidos, demo simulada de 10 minutos y preventa de un piloto de 30 días a S/ 100 cobrados por adelantado. Finalista B (sorpresas y detalles) se valida **con margen real y pedidos pagados**, no con interés: una caja costeada de verdad, dos motorizados cotizados, comparación con SorprendeLima y una preventa de 2 semanas con pago 100 % adelantado por Yape. Un experimento de desempate (D) compara A y B con la misma regla: **margen real por hora invertida sobre lo efectivamente cobrado**, fijada aquí antes de ejecutar. La condición registrada en `decisiones.md` se cumple: cada entrevista de A lleva una pregunta sobre el cliente incógnito (S-09).

## Marco común
- **Calendario real.** W1: mar 27-oct a dom 1-nov · W2: lun 2-nov a dom 8-nov · W3: lun 9-nov a dom 15-nov · W4: lun 16-nov a dom 22-nov. Ventanas en común: lunes, miércoles y viernes desde las 20:00, sábado, domingo tarde [VERIFICADO: perfil, 2026-10-21]. Semanas de exámenes de la UPN y campaña de SuperPet en noviembre: [DESCONOCIDO]; por eso el tope de validación es 10 h/semana por socio (ver supuesto nuevo S-39).
- **Dinero.** Tope del plan: S/ 150 (F1: gasto mensual ≤ S/ 150 hasta la primera venta). Se propone que salga del aporte de noviembre (S/ 350) y que cada gasto se anote con quién lo pagó; la pérdida tolerable de Carlos es S/ 100 [VERIFICADO: perfil]. Los insumos de los pedidos vendidos en B se compran **después** de recibir el adelanto: no consumen capital.
- **Canales permitidos (F4).** Solo contactos registrados (academia de marinera, librería de la mamá de Indira, amigas con agencia de contenido, amiga de las galletas), locales de Lima Norte que los socios ya frecuentan como clientes, redes y grupos propios (UPN) y un anuncio pagado con métrica. Nada de puerta a puerta ni mensajes en frío.
- **Qué no se hace.** No se construye el chatbot completo (80–120 h, ficha 08) antes de que alguien pague. No se preparan alimentos en casa (F5): en la caja solo entran dulces envasados de marca; las galletas de la amiga entran únicamente si tienen registro sanitario o marca formal [DESCONOCIDO, supuesto nuevo S-41].
- **Registro.** Cada socio anota horas reales por experimento (10 min/día) y dinero gastado. Sin ese registro, el desempate D no se puede calcular.

---

## Finalista A — Chatbot de WhatsApp con panel (fichas 08+09+14)

### A0. Lectura de términos de Meta y prueba del número de prueba
- **Qué prueba:** S-11 (API no oficial = riesgo de bloqueo; la oficial exige requisitos y cobra por mensaje) y S-40 (nuevo: el número de prueba gratuito de la Cloud API sirve para una demo real sin verificación de negocio).
- **Qué se hace:** Carlos crea una app de desarrollador en Meta, activa el número de prueba de WhatsApp, registra su número y el de Indira como destinatarios y envía la plantilla `hello_world`. Lee la página de precios de WhatsApp para Perú y anota: costo por mensaje de servicio/utilidad/marketing desde 2026-10-01, cuota gratuita, requisitos de verificación de negocio y si un número puede estar a la vez en la app WhatsApp Business y en la API. Meta documenta un número de prueba con hasta 5 destinatarios verificados y mensajes de prueba gratuitos [VERIFICADO: developers.facebook.com, guía "Get started" de Cloud API, consultada 2026-10-21; la página no muestra fecha de actualización]. Desde 2026-10-01, 1 000 mensajes de servicio gratuitos por número al mes y ~S/ 0,10 por mensaje adicional [VERIFICADO: informe de mercado 2026-10-21, vía Gestión/Mercado Negro y pibot.pe].
- **Costo:** S/ 0. **Horas:** Carlos 2 h (W1); Indira 0.
- **Fechas:** mar 2026-10-27 a jue 2026-10-29. **Responsable:** Carlos.
- **Criterio de éxito (fijado antes):** Carlos recibe un mensaje real en su WhatsApp desde el número de prueba, y entrega una nota de 1 página con los 4 datos anteriores con enlace y fecha.
- **Qué se decide:** **pasa** → la demo de A2 se hace con mensajes reales desde el número de prueba y el piloto se vende con API oficial (S-11 se marca validado: "no oficial no se usa"). **No pasa** (no logra enviar en 2 h o Meta exige verificación previa) → la demo de A2 se hace en una conversación simulada en pantalla y S-40 se descarta; A2 sigue. No hay "repetir": es una comprobación, no un experimento de mercado.

### A1. Entrevistas estructuradas a 5–6 dueños de negocio
- **Qué prueba:** S-07 (los contactos aceptan hablar), S-10 y S-34 (pagarían S/ 80–200/mes; precio de lista S/ 150), S-20 (≤ 1 000 mensajes/mes), S-14 (la academia acepta ser piloto con fecha), S-08 (venta posible antes del 1-dic), S-09 y S-21 (incógnito: pagarían ≥ S/ 100 por evaluación; hoy no compran nada), S-28 (si piden factura).
- **Quiénes:** (1) dueño de la academia de marinera — Carlos; (2) mamá de Indira, librería — Indira; (3) amiga de las galletas — Carlos, por videollamada; (4) amigas con agencia de contenido — Indira (como clientes potenciales y como fuente de referidos: tienen clientes que atienden WhatsApp); (5) dueño o encargado de una cafetería de Lima Norte que Carlos frecuenta — Carlos, en el local, como cliente habitual; (6) dueño de una tienda o cafetería que Indira frecuenta — Indira. Mínimo 5 entrevistas completas.
- **Guion (4 preguntas, en este orden, sin sugerir respuestas; se anota textual):**
  1. "¿Cuántos mensajes de clientes recibe por WhatsApp en una semana normal y quién los responde?" (S-20; anotar número y quién)
  2. "¿Cuáles son las 3 preguntas que más se repiten, y cuántas ventas o matrículas cree que pierde al mes por responder tarde o fuera de horario?" (problema; anotar cifra aunque sea aproximada)
  3. "Si un asistente automático respondiera esas preguntas las 24 horas, derivara a usted lo que no sabe y le enviara cada semana cuántas consultas terminaron en venta, ¿cuánto pagaría al mes? Elija: nada / S/ 50 / S/ 100 / S/ 150 / S/ 200." (S-10, S-34)
  4. "¿Aceptaría probarlo 30 días en un número nuevo del negocio pagando S/ 100 por adelantado, y qué fecha le vendría bien para empezar?" (S-08, S-14; anotar sí/no y fecha)
  - **Pregunta obligatoria sobre el incógnito (condición de `decisiones.md`):** 5. "Aparte de eso: ¿pagaría S/ 100 a S/ 150 por una visita de cliente incógnito a su local, un informe de 2 páginas y 45 minutos de capacitación a su personal? ¿Cuánto?" (S-09, S-21; anotar monto y si hoy compra algo parecido)
  - Cierre: si respondió sí en 4, preguntar si necesita factura o le basta boleta/Yape (S-28).
- **Costo:** S/ 30 (consumo en 2 locales × S/ 15 [ESTIMADO: ficha 10, S/ 15–30 por visita]). Videollamadas y reuniones con conocidos: S/ 0.
- **Horas:** Carlos 5 h (W1 2,5: preparación conjunta 1 h + academia 1,5; W2 2,5: galletas 1 + cafetería 1,5). Indira 6 h (W1 3,5: preparación 1 + librería 1,5 + agencia 1; W2 2,5: local 1,5 + consolidación de respuestas en una tabla 1).
- **Fechas:** preparación mié 2026-10-28 (20:00, juntos); entrevistas del jue 2026-10-29 al sáb 2026-11-07; tabla consolidada dom 2026-11-08. **Responsable:** Carlos (entrevistas 1, 3, 5); Indira (2, 4, 6 y la tabla).
- **Criterio de éxito (fijado antes):** **pasa** si ≥ 3 de 5 eligen ≥ S/ 80/mes en la pregunta 3 **y** ≥ 1 da fecha en la pregunta 4. Además se registra: ≥ 4 de 5 reciben < 1 000 mensajes/mes (S-20; si no, el costo variable del modelo S-29 se recalcula, no invalida A). **Incógnito (S-09):** ≥ 2 de 5 dicen que pagarían ≥ S/ 100 en la pregunta 5.
- **Qué se decide:** **pasa** → A2 se ejecuta con los que dijeron sí en 3 o 4. **Repetir con cambio** → exactamente 2 nombran precio pero ≤ S/ 50: en A2 se ofrece solo el módulo de preguntas frecuentes a S/ 50 el primer mes y S/ 80 después (extremo bajo del rango S-34; el modelo da S/ 1 658 a 12 meses con S/ 80 [ESTIMADO: informe financiero]). **No pasa** → ≤ 1 nombra precio: A2 no se ejecuta, A pasa a la banda 2027-01-31 y el Director activa la reserva (incógnito si S-09 pasa; taller si no). S-09: ≥ 2 de 5 → el incógnito sigue vivo en reserva; ≤ 1 → se archiva con ese dato.

### A2. Demo de 10 minutos y preventa del piloto (vender antes de construir)
- **Qué prueba:** S-35 (nuevo: un dueño paga S/ 100 por adelantado por un piloto de 30 días viendo solo una demo), S-08, S-10, S-34 (precio S/ 150 desde el mes 2), S-14, S-05 (producto construido por Carlos vendible a terceros).
- **Qué se hace:** Carlos arma en ≤ 6 h con Claude Code una **demo**, no el producto: (a) si A0 pasó, un flujo de 10 preguntas frecuentes reales de la academia respondidas desde el número de prueba de Meta al celular del dueño; si no, una conversación simulada en una página web con apariencia de WhatsApp; (b) una pantalla estática del panel con los 5 indicadores que define Indira (consultas recibidas, respondidas por el bot, derivadas, tiempo de respuesta, consultas que terminaron en pedido/matrícula). Luego cada socio muestra la demo en persona o por videollamada a los dueños que respondieron sí en A1 (mínimo: academia, librería, galletas; más los locales que dijeron sí) y hace **la oferta exacta**:
  > "Piloto de 30 días: un asistente en un número nuevo de WhatsApp de su negocio que responde sus 10 preguntas más frecuentes a toda hora, le deriva lo que no sabe y le manda un reporte semanal con 5 indicadores. Precio del piloto: **S/ 100, pagados por adelantado por Yape o Plin**. Si sigue, **S/ 150 al mes** desde el segundo mes; si no, se apaga sin costo. Instalación en 14 días desde el pago; arranque a más tardar el lunes 30 de noviembre."
  Se cobra solo si hay fecha de inicio. Con el dinero del primer pago se compra el chip del número dedicado (S/ 15 [ESTIMADO: ficha 08, S/ 10–20]).
- **Costo:** S/ 0 durante la validación; S/ 15 (chip) solo si alguien paga, cubierto por el cobro.
- **Horas:** Carlos 9 h (W2: demo 6 h, mar 3-nov a dom 8-nov; W3: 2 demos presenciales 2 h + seguimiento 1 h). Indira 4,5 h (W2: definir los 5 indicadores y el texto de la oferta 1,5 h, mié 4-nov; W3: 2 demos 2 h + seguimiento 1 h). Se cronometra la construcción de la demo (S-33).
- **Fechas:** lun 2026-11-02 a dom 2026-11-15 (demos entre el lun 9-nov y el sáb 14-nov; cierre de cobros dom 15-nov 23:59). **Responsable:** Carlos (demo y oferta a academia y galletas); Indira (indicadores y oferta a librería y locales).
- **Criterio de éxito (fijado antes):** **pasa** si ≥ 1 dueño paga S/ 100 por adelantado antes del 2026-11-15 con fecha de inicio ≤ 2026-11-30. Dos pagos = escenario base del modelo (2 clientes en el mes 1 [ESTIMADO: modelo.py]). Un pago = escenario pesimista ya modelado (1 cliente a S/ 100).
- **Qué se decide:** **pasa** → A3 (construir el piloto mínimo solo para ese cliente); la primera venta pagada queda antes del 2026-12-01 y S-08 pasa a validado para A. **Repetir con cambio** → 0 pagos pero ≥ 2 dueños dicen "sí, cuando lo vea funcionando": a **uno** de ellos se le ofrece, por escrito por WhatsApp, 14 días gratis con cobro de S/ 100 el día 15 si no pide apagarlo; plazo hasta el dom 2026-11-22; si no acepta ese compromiso, es "no pasa". **No pasa** → 0 pagos y 0 compromisos: no se construye nada; A se repuntúa con banda 2027-01-31; se detiene todo gasto en A.

### A3. Entrega del piloto vendido (condicional a A2)
- **Qué prueba:** S-36 (nuevo: un bot mínimo para un cliente —10 respuestas, derivación, reporte semanal armado a mano por Indira desde los registros— se construye en ≤ 30 h de Carlos), S-29 (costo variable ≤ S/ 35/cliente/mes, medido 30 días), S-33 (horas por mensualidad).
- **Qué se hace:** Carlos construye con la Cloud API sobre el número nuevo; Indira carga las 10 preguntas con el dueño y arma el reporte semanal en Google Sheets. Se cronometra todo.
- **Costo:** S/ 15 (chip, ya cubierto por el cobro). Hosting e IA durante la construcción: S/ 0–35 [ESTIMADO: modelo.py, S/ 35/mes cada uno; usar planes gratuitos el primer mes si existen — DESCONOCIDO].
- **Horas:** Carlos 7 h en W4 (lun 16-nov a dom 22-nov) y hasta 10 h/semana del 23-nov al 6-dic (fuera de este plan; se registra en `/actualizar`). Indira 1 h en W4 (carga de preguntas con el dueño).
- **Fechas:** lun 2026-11-16 a dom 2026-12-06. **Responsable:** Carlos.
- **Criterio de éxito:** bot operativo en el número del cliente ≤ 2026-11-30; ≤ 30 h cronometradas; costo variable medido ≤ S/ 35 en los primeros 30 días.
- **Qué se decide:** cumple las tres → S-36, S-29 y S-33 validados y el chatbot pasa a Etapa 2 con cifras reales. Supera 30 h o S/ 35 → la Etapa 2 recalcula el modelo con la cifra real antes del veredicto; no es motivo de descarte por sí solo.

---

## Finalista B — Sorpresas y detalles por pedido en fechas especiales (ficha 06)

### B1. Costeo de una caja real, dos motorizados y comparación con la competencia
- **Qué prueba:** S-17 (margen ≥ 40 % tras el motorizado), S-23 (caja sin alimentos preparados se vende a S/ 60–90), S-25 (motorizado S/ 15–20), S-33 (1,5 h por pedido), S-34 (precio S/ 80 con envío), S-41 (galletas de la amiga con registro).
- **Qué se hace:** Indira compra y arma **una** caja real con la composición que se venderá: caja rígida decorada, 3–4 dulces envasados de marca (con registro sanitario del fabricante), 1 peluche pequeño o 1 flor, tarjeta personalizada, globo sencillo, papel y cinta. Anota cada precio con boleta o foto, cronometra el armado y toma 5 fotos para la oferta. Carlos pide por WhatsApp **2 cotizaciones a motorizados independientes** que ya conozcan o que atiendan a la librería (no es prospección: es compra de un servicio) **y 1 cotización en una app de envíos**, para una entrega dentro de Lima Norte (Independencia → Los Olivos) y otra a Lima centro-sur (Independencia → Miraflores); y lista 5 cuentas de Instagram de "detalles Lima" con precio de una caja sin alimentos preparados. Referencia ya verificada: SorprendeLima S/ 80–360, siempre con repostería o flores, 761 reseñas, envío a todo Lima [VERIFICADO: capturas de los socios, 2026-10-21].
- **Costo:** S/ 40–60 (una caja de muestra [ESTIMADO: modelo.py S/ 30 de insumos y empaque; el abogado del diablo estima S/ 60–100 por muestra; se toma el rango bajo porque es una sola unidad]). Cotizaciones: S/ 0.
- **Horas:** Indira 4 h (sáb 31-oct 10:00: compra 2 h; armado cronometrado y fotos 1,5 h; tabla de costeo 0,5 h). Carlos 2 h (cotizaciones 1 h, cuentas de Instagram 1 h; mié 28-oct y vie 30-oct por la noche).
- **Fechas:** mar 2026-10-27 a dom 2026-11-01. **Responsable:** Indira (caja y tabla); Carlos (motorizados e Instagram).
- **Criterio de éxito (fijado antes):** **pasa** si el costo real por pedido (insumos + empaque + motorizado dentro de Lima Norte) es **≤ S/ 40 con precio de venta de S/ 80 con envío incluido**, es decir, ≤ 50 % del precio con IGV. Esa regla equivale a margen ≥ 40 % del ingreso neto bajo RER [ESTIMADO: despejado de la economía unitaria de `modelo.py`: margen = ingreso neto × 0,985 − costo variable; con costo ≤ 0,496 × precio se cumple el 40 %]. Y además: ≥ 3 de las 5 cuentas de Instagram venden una caja comparable entre S/ 60 y S/ 100 (S-23) y el armado toma ≤ 1 h (S-33).
- **Qué se decide:** **pasa** → B2 sale a S/ 80 (Lima Norte) / S/ 95 (resto de Lima). **Repetir con cambio** → costo real S/ 41–50: B2 sale a **S/ 95 / S/ 110** y se verifica que ≥ 3 de 5 competidores estén en ese rango; si no lo están, es "no pasa". **No pasa** → costo real > S/ 50 o motorizado > S/ 20 dentro de Lima Norte: el margen por pedido queda por debajo del S/ 22 ya modelado (que no cubre un sueldo en ningún escenario [ESTIMADO: informe financiero]); B2 y B3 no se ejecutan y B se descarta por escrito.

### B2. Preventa pagada por adelantado (2 semanas)
- **Qué prueba:** S-08 (venta antes del 1-dic), S-34 (precio aceptado sin descuento), S-38 (nuevo: ≥ 1 de cada 3 pedidos viene de fuera del círculo cercano), S-28 (pago por Yape/Plin), S-33.
- **Oferta exacta (texto a publicar, con las fotos de B1):**
  > "Caja Detalle — para cumpleaños, aniversario o 'me acordé de ti'. Caja decorada, 3 dulces de marca, peluche pequeño o flor, tarjeta con tu mensaje y globo. **S/ 80 con envío incluido en Independencia, Los Olivos, San Martín de Porres y Comas; S/ 95 en el resto de Lima.** Pago por Yape o Plin al hacer el pedido. Elige la fecha de entrega entre el lunes 16 y el domingo 29 de noviembre; te mandamos foto de la entrega. Pedidos hasta el domingo 15 de noviembre."
  Si B1 terminó en "repetir con cambio", los precios son S/ 95 / S/ 110.
- **Dónde:** estados de WhatsApp de ambos, Instagram personal de Indira (o cuenta nueva del negocio creada por ella), grupos de WhatsApp de la UPN de cada uno, y las amigas de la agencia como difusoras (pedirles que compartan, sin pago). No se escribe a nadie en privado que no haya preguntado.
- **Costo:** S/ 0. Los insumos de cada pedido (≈ S/ 40 [ESTIMADO: criterio B1]) se compran con el adelanto recibido.
- **Horas:** Indira 6,5 h (W2: publicar y responder 3,5 h; W3: responder y registrar 3 h). Carlos 1 h (W2 0,5: publicar en sus grupos; W3 0,5: registro de pagos).
- **Fechas:** lun 2026-11-02 a dom 2026-11-15 23:59. **Responsable:** Indira (oferta, atención, registro); Carlos (difusión y cuadre de cobros).
- **Criterio de éxito (fijado antes):** **pasa** si hay **≥ 6 pedidos pagados por adelantado (≥ S/ 480 cobrados)** al 2026-11-15, **≥ 2 de ellos de personas que no son familia ni amigos cercanos** de los socios, y ≥ 3 de cada 5 compradores pagan el precio publicado sin pedir descuento. Por qué 6: el escenario base del modelo supone 8 pedidos en el mes 1; dos semanas de preventa equivalen a ~5,5 → 6 [ESTIMADO: 8 × 2/4,33 semanas, modelo.py]. El pesimista supone 3.
- **Qué se decide:** **pasa** → B4 entrega los pedidos y B entra al desempate D. **Repetir con cambio** → 4–5 pedidos: se extiende una semana (hasta el dom 22-nov) con una segunda foto y una variante (p. ej., caja "para él"); se cuenta el total acumulado contra el mismo umbral de 6. **No pasa** → ≤ 3 pedidos (el pesimista: resultado a 12 meses S/ −236 [ESTIMADO: modelo.py]) o 0 pedidos fuera del círculo cercano: B se descarta por escrito; lo cobrado se entrega igual.

### B3. Anuncio con presupuesto mínimo (condicional a que B1 pase)
- **Qué prueba:** S-32 (S/ 40–50/mes de promoción generan demanda sin prospección) y S-37 (nuevo: un anuncio de S/ 30–40 trae ≥ 5 consultas por WhatsApp en Lima Norte, ≤ S/ 8 por consulta).
- **Qué se hace:** Indira impulsa desde su cuenta la publicación de la oferta de B2 con botón a WhatsApp, público: Lima Norte, 20–35 años, durante 5–6 días. Presupuesto total **S/ 30–40** [SUPUESTO: por validar — Meta permite presupuestos diarios mínimos del orden de S/ 5–7; alcance y costo por consulta en Lima Norte: DESCONOCIDO, es justamente lo que se mide]. Se registra cada consulta que llega por el anuncio (preguntar "¿cómo nos encontraste?").
- **Costo:** S/ 30–40. **Horas:** Indira 2 h (configurar 1 h, mié 11-nov 20:00; responder consultas 1 h adicional). Carlos 0,5 h (revisar métricas del anuncio con Indira, vie 13-nov).
- **Fechas:** mar 2026-11-10 a dom 2026-11-15. **Responsable:** Indira.
- **Criterio de éxito (fijado antes):** **pasa** si ≥ 5 consultas por WhatsApp atribuibles al anuncio, costo por consulta ≤ S/ 8, y ≥ 1 pedido pagado de un desconocido.
- **Qué se decide:** **pasa** → S-32 validado para B; B puede crecer fuera del círculo cercano. **No pasa** → aunque B2 pase, B se registra como "pasa con límite: demanda solo de conocidos" y el crecimiento del modelo (+10 %/mes, S-30) baja a 0 % en la Etapa 2. No se repite con más dinero: la regla del plan es no gastar sin métrica, y la métrica ya habló.

### B4. Entrega de lo vendido (condicional a B2)
- **Qué prueba:** S-33 (1,5 h por pedido), S-25 (motorizado real), S-17 con costos reales de varios pedidos.
- **Qué se hace:** compra de insumos con los adelantos, armado por lotes el sábado 21-nov, coordinación de motorizados, foto de entrega al cliente, registro de costo real por pedido y minutos por pedido.
- **Costo:** cubierto por los adelantos (≈ S/ 40 por pedido). **Horas:** Indira 7 h; Carlos 2 h (W4; si hay entregas entre el 23 y el 29-nov, se registran en `/actualizar`).
- **Fechas:** lun 2026-11-16 a dom 2026-11-29. **Responsable:** Indira (armado); Carlos (motorizados y cuadre).
- **Criterio:** costo real promedio ≤ S/ 40 por pedido y ≤ 1,5 h por pedido entre armado y coordinación. Si se superan, el margen y las horas de la Etapa 2 se recalculan con las cifras reales.

---

## D. Desempate entre A y B (misma regla para ambas, fijada antes de ejecutar)
- **Qué prueba:** cuál de las dos finalistas convierte mejor las horas de los socios en dinero real cobrado, con lo efectivamente vendido al 2026-11-15, sin opiniones.
- **Métrica única — margen real por hora a 3 meses (MRH), en S/ por hora:**
  - **A:** [adelantos cobrados − costos directos reales del piloto (chip, Meta, IA, hosting) + 2 × (mensualidad acordada por escrito − S/ 33,07 de costo variable modelado, S-29) × clientes que confirmen por WhatsApp seguir el mes 2] ÷ [horas de A0 + A1 + A2 + horas de construcción cronometradas en A3 (o 30 h si aún no termina) + 2 h por cliente por mes × 2 meses].
  - **B:** [adelantos cobrados − costos reales de insumos, empaque y motorizado de esos pedidos] ÷ [horas de B1 + B2 + B3 + horas reales de B4]. B no suma meses 2 y 3 porque cada pedido exige volver a vender; si en la preventa un cliente deja un segundo pedido pagado para diciembre, se suma como dato real.
  - **Secundarias (se reportan, no deciden):** porcentaje de soles cobrados a personas fuera del círculo cercano; soles cobrados por cada hora de validación (sin entrega).
- **Ilustración con cifras del modelo, solo para fijar escala** [ESTIMADO: aritmética ilustrativa con entradas de `modelo.py`; el cálculo oficial debe cargarse en `finanzas/modelo.py` (función `desempate`) por el analista financiero antes del 2026-11-15 y correrse con datos reales]: A con 1 piloto y 30 h de construcción ≈ S/ 6 por hora; A con 2 pilotos ≈ S/ 10 por hora; B con 6 pedidos a costo S/ 40 ≈ S/ 10 por hora. El desempate está genuinamente abierto: lo decide el dato.
- **Costo:** S/ 0. **Horas:** Carlos 1 h, Indira 1 h (consolidar registros, vie 2026-11-20 20:00).
- **Fechas:** lun 2026-11-16 a dom 2026-11-22. **Responsable:** ambos entregan los registros; el Director corre el cálculo y lo registra en `decisiones.md`.
- **Regla de decisión (fijada antes):**
  1. Si solo una finalista pasó su criterio (A2 para A; B2 para B) → se recomienda esa.
  2. Si pasaron ambas → se recomienda la de mayor MRH. Si la diferencia es menor al 20 %, gana la que tiene ingreso recurrente (A), porque el modelo muestra que B necesita 94 pedidos/mes y 37,6 h/semana para un sueldo y no cabe en F2 [ESTIMADO: informe financiero]. Esta regla se fija ahora para que no se ajuste después.
  3. Si no pasó ninguna → no se fuerza la elección: el Director vuelve a la Fase 3 con la reserva (incógnito si S-09 pasó en A1; taller si no), tal como manda el flujo de la agencia.
  4. Lo que los socios decidan se registra en `decisiones.md`; esta regla es la recomendación de la agencia, no un veto.

---

## Tabla resumen
| Id | Experimento | Supuestos | Fechas (2026) | Resp. | S/ | h Carlos | h Indira | Criterio de éxito (resumen) |
|---|---|---|---|---|---|---|---|---|
| A0 | Términos de Meta + número de prueba | S-11, S-40 | 27-oct → 29-oct | Carlos | 0 | 2 | 0 | Mensaje real recibido; nota de 1 página con 4 datos |
| A1 | 5–6 entrevistas (4 preguntas + 1 de incógnito) | S-07, S-08, S-09, S-10, S-14, S-20, S-21, S-28, S-34 | 28-oct → 8-nov | Carlos / Indira | 30 | 5 | 6 | ≥ 3/5 eligen ≥ S/ 80/mes y ≥ 1 da fecha; S-09: ≥ 2/5 pagarían ≥ S/ 100 |
| A2 | Demo de 10 min + preventa piloto S/ 100 adelantado | S-05, S-08, S-10, S-14, S-34, S-35 | 2-nov → 15-nov | Carlos / Indira | 0 (+15 si cobra) | 9 | 4,5 | ≥ 1 pago de S/ 100 con inicio ≤ 30-nov |
| A3 | Entrega del piloto (condicional) | S-29, S-33, S-36 | 16-nov → 6-dic | Carlos | 15 (del cobro) | 7 en W4 | 1 | ≤ 30 h; operativo ≤ 30-nov; costo variable ≤ S/ 35 |
| B1 | Caja real costeada + 2 motorizados + 5 competidores | S-17, S-23, S-25, S-33, S-34, S-41 | 27-oct → 1-nov | Indira / Carlos | 40–60 | 2 | 4 | Costo ≤ S/ 40 a precio S/ 80; ≥ 3/5 competidores en S/ 60–100; armado ≤ 1 h |
| B2 | Preventa pagada por adelantado | S-08, S-28, S-33, S-34, S-38 | 2-nov → 15-nov | Indira / Carlos | 0 | 1 | 6,5 | ≥ 6 pedidos pagados (≥ S/ 480), ≥ 2 fuera del círculo, ≥ 3/5 sin descuento |
| B3 | Anuncio mínimo (condicional a B1) | S-32, S-37 | 10-nov → 15-nov | Indira | 30–40 | 0,5 | 2 | ≥ 5 consultas, ≤ S/ 8 por consulta, ≥ 1 pedido de desconocido |
| B4 | Entrega de pedidos (condicional a B2) | S-17, S-25, S-33 | 16-nov → 29-nov | Indira / Carlos | de los adelantos | 2 en W4 | 7 | ≤ S/ 40 y ≤ 1,5 h por pedido |
| D | Desempate: margen real por hora | — | 16-nov → 22-nov | ambos + Director | 0 | 1 | 1 | Regla fijada arriba |
| | **Total** | | **27-oct → 22-nov** | | **S/ 100–130 (145 con chip)** | **29,5** | **32** | |

## Horas por semana y por socio (tope: 10 h/semana/socio)
| Semana | Carlos | Detalle Carlos | Indira | Detalle Indira |
|---|---|---|---|---|
| W1 · 27-oct → 1-nov | **6,5** | A0 2 · A1 2,5 · B1 2 | **7,5** | A1 3,5 · B1 4 |
| W2 · 2-nov → 8-nov | **9** | A1 2,5 · A2 6 · B2 0,5 | **7,5** | A1 2,5 · A2 1,5 · B2 3,5 |
| W3 · 9-nov → 15-nov | **4** | A2 3 · B2 0,5 · B3 0,5 | **8** | A2 3 · B2 3 · B3 2 |
| W4 · 16-nov → 22-nov | **10** | A3 7 · B4 2 · D 1 | **9** | A3 1 · B4 7 · D 1 |
| **Total** | **29,5** | | **32** | |

Ninguna semana supera 10 h por socio [ESTIMADO: suma de las horas asignadas arriba; se contrasta con el registro real]. W4 de Carlos llega al tope solo si A2 y B2 pasan a la vez; si una falla, baja a 3–8 h. Si una semana de noviembre resulta ser de exámenes finales (S-39), se mantiene el tope de 10 h y se mueve A3 una semana (el piloto arrancaría el 7-dic, una semana después de lo ofrecido: avisar al cliente antes de cobrar).

## Dinero
| Concepto | S/ | Etiqueta |
|---|---|---|
| Consumos en 2 locales (A1) | 30 | [ESTIMADO: ficha 10] |
| Caja de muestra (B1) | 40–60 | [ESTIMADO: modelo.py + abogado del diablo] |
| Anuncio (B3) | 30–40 | [SUPUESTO: por validar, rango] |
| Chip del piloto (A3) | 15 | [ESTIMADO: ficha 08]; solo si hay cobro, pagado con el cobro |
| **Total máximo** | **S/ 130 (145 con chip)** | ≤ S/ 150 de F1; ≤ S/ 100 si B1 descarta B y no se corre B3 |

Insumos de pedidos vendidos (B4) y hosting/IA del piloto (A3) se pagan con los adelantos cobrados, no con capital. Se recomienda que los S/ 130 salgan del aporte de noviembre (S/ 350) y que quede anotado quién pagó qué, por la asimetría de pérdida tolerable (Carlos S/ 100, Indira S/ 1 200 [VERIFICADO: perfil]).

## Qué pasa con cada combinación de resultados
| A2 | B2 | Recomendación de la agencia (se registra con `/actualizar`) |
|---|---|---|
| pasa | pasa | Desempate D por MRH; empate (< 20 %) favorece A por recurrencia |
| pasa | no pasa | Chatbot; B se descarta por escrito con sus cifras |
| no pasa | pasa | Si B3 también pasó: B con la advertencia del modelo (no cubre un sueldo en F2); si B3 no pasó: B "con límite" y la agencia recomienda reabrir la reserva antes de elegir |
| no pasa | no pasa | Volver a Fase 3: incógnito si S-09 pasó en A1; si no, taller. No se fuerza una elección |

## Supuestos nuevos para `expediente/supuestos.md`
| ID propuesto | Supuesto | Origen | Cómo validarlo |
|---|---|---|---|
| S-35 | Un dueño conocido paga S/ 100 por adelantado por un piloto de 30 días viendo solo una demo, sin producto construido | A2 | Preventa A2; S/ 0; criterio ≥ 1 pago antes del 2026-11-15 |
| S-36 | Un bot mínimo para un cliente (Cloud API, 10 respuestas, derivación, reporte semanal manual) se construye en ≤ 30 h de Carlos | A3 | Cronometrar A3; criterio ≤ 30 h |
| S-37 | Un anuncio de S/ 30–40 en Meta trae ≥ 5 consultas por WhatsApp desde Lima Norte a ≤ S/ 8 por consulta | B3 | Anuncio B3 con pregunta "¿cómo nos encontraste?" |
| S-38 | Al menos 1 de cada 3 pedidos de la preventa viene de personas fuera del círculo cercano de los socios | B2 | Registrar relación con cada comprador; criterio ≥ 2 de 6 |
| S-39 | Las semanas del 27-oct al 22-nov no incluyen exámenes finales de la UPN ni campaña en SuperPet | Marco del plan | Los socios confirman fechas de exámenes y campaña; S/ 0, 5 min |
| S-40 | El número de prueba de la Cloud API permite una demo real sin verificación de negocio | A0 | Prueba de A0; criterio: mensaje recibido |
| S-41 | La amiga de las galletas vende con registro sanitario o marca formal; si no, sus galletas no entran en la caja | B1 | Preguntarle en la entrevista A1 (Carlos); respuesta sí/no |
| S-42 | Revender dulces envasados de marca dentro de una caja no exige registro sanitario adicional para los socios (F5) | B1 | Asesor legal en la Etapa 2; mientras tanto, solo productos con registro del fabricante visible en el empaque |

## Supuestos existentes que este plan cambia de estado si se cumple
S-07, S-08, S-09, S-10, S-11, S-14, S-17, S-20, S-21, S-23, S-25, S-28, S-29 (parcial, 30 días), S-32, S-33 (A y B), S-34 (A y B). S-05 queda parcialmente cubierto por A2/A3 (uso real por un tercero que paga).
