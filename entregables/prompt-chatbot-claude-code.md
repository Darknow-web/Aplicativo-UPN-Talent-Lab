# Asistente de WhatsApp para negocios pequeños de Lima — demo y piloto

> Prompt para Claude Code, redactado por el Director el 2026-10-22 para los pasos A2 (demo) y A3 (piloto) del plan de validación. Se pega en una carpeta NUEVA y vacía (no en agencia-negocios). La Fase 2 está bloqueada hasta que un cliente pague.

```
# Asistente de WhatsApp para negocios pequeños de Lima — demo y piloto

## Objetivo
Construir en DOS fases un asistente de WhatsApp para negocios pequeños de Lima (academias, librerías, cafeterías, tiendas) que responde sus 10 preguntas más frecuentes a toda hora, deriva al dueño lo que no sabe y genera un reporte semanal con 5 indicadores. Lo vendemos Carlos (construye) e Indira (define indicadores, carga preguntas, atiende al cliente) como servicio: piloto de 30 días a S/ 100 y luego S/ 150 al mes.

- FASE 1 — DEMO: máximo 6 horas de trabajo. Sirve para mostrar a dueños de negocio y vender el piloto. No es el producto.
- FASE 2 — PILOTO: máximo 30 horas. BLOQUEADA. Solo empieza cuando yo escriba en este chat la frase exacta "PAGO RECIBIDO: <nombre del negocio>, inicio <fecha>". Si te pido avanzar a la Fase 2 sin esa frase, recuérdame la regla y no avances.

## Contexto del proyecto
- Carpeta de trabajo: esta carpeta, vacía al empezar. No toques nada fuera de ella.
- Stack: Python 3.11+, FastAPI, SQLite (archivo local), httpx. Sin frameworks pesados ni colas. Un solo proceso.
- WhatsApp: SOLO la API oficial de Meta (WhatsApp Business Platform, Cloud API). Nunca librerías no oficiales que automatizan la app de WhatsApp (riesgo de bloqueo del número del cliente).
- IA: API de Anthropic con el modelo más barato disponible (claude-haiku-5-5) y temperatura 0, usada ÚNICAMENTE para elegir cuál de las 10 preguntas frecuentes coincide con el mensaje del cliente y redactar la respuesta a partir de la respuesta oficial cargada. Si no hay coincidencia clara, deriva. Nunca inventa precios, horarios, direcciones ni promociones.
- Credenciales: siempre en un archivo .env (META_TOKEN, META_PHONE_NUMBER_ID, META_VERIFY_TOKEN, ANTHROPIC_API_KEY, DUENO_WHATSAPP). Crea .env.example con los nombres y sin valores. Nunca escribas ni muestres una credencial real en el código, en logs ni en el chat.
- Datos de los clientes finales (Ley 29733 de protección de datos personales, Perú): guarda solo número de WhatsApp, fecha-hora y texto de la conversación; nada más. El primer mensaje del asistente incluye una línea corta de aviso de que es un asistente automático y que sus mensajes se guardan para atenderlo mejor. Incluye un comando "BORRAR" que elimina el historial de ese número.
- Presupuesto operativo por cliente: máximo S/ 35 al mes entre mensajes de Meta, IA y servidor. Desde el 1 de octubre de 2026 Meta cobra por mensaje después de 1 000 mensajes de servicio gratuitos por número al mes: el sistema debe contar mensajes enviados por mes y avisar al dueño por WhatsApp al llegar a 900.

## FASE 1 — DEMO (ahora; tope 6 horas)
Qué debe poder hacer:
1. Un archivo preguntas.json con 10 entradas {pregunta, variantes[], respuesta} para una academia de marinera en Lima. Pon textos de EJEMPLO claramente marcados "EJEMPLO" en horarios, precios y dirección; Indira los reemplaza antes de mostrar la demo.
   Además un archivo cliente.json (ficha de alta): nombre del negocio, rubro, número del dueño, horario de atención, horario de derivación y tono de respuesta. Todo lo que cambia de un negocio a otro vive en estos dos archivos; nada del negocio queda en el código.
2. Un servidor FastAPI con: GET /webhook (verificación de Meta con META_VERIFY_TOKEN) y POST /webhook (recibe mensajes, responde con la lógica de FAQ + IA, guarda en SQLite).
3. Modo "número de prueba": funciona con el número de prueba gratuito de la Cloud API de Meta (hasta 5 destinatarios verificados). Documenta en README.md los pasos exactos para: crear la app en developers.facebook.com, obtener token temporal y phone_number_id, registrar un destinatario de prueba, exponer el webhook en local con un túnel (ngrok o cloudflared, el que no cueste) y verificarlo.
4. Modo "simulado": si Meta no deja enviar (verificación pendiente, token caído), un archivo demo.html que se abre en el navegador, con apariencia de chat de WhatsApp, donde se escribe una pregunta y responde la misma lógica por HTTP local. La demo nunca debe quedar sin funcionar por culpa de Meta.
5. panel.html estático con 5 indicadores, con cifras de EJEMPLO marcadas: consultas recibidas, respondidas por el asistente, derivadas al dueño, tiempo promedio de respuesta, consultas que terminaron en matrícula o pedido.
6. Un script run_demo.sh que levanta todo con un comando, y un archivo CRONOMETRO.md donde yo anoto las horas reales de construcción (tú me recuerdas anotarlas al terminar cada bloque).

Criterio de éxito de la Fase 1: desde cero, con el README, levanto la demo en menos de 15 minutos; escribo "¿cuánto cuesta la mensualidad?" y responde con la respuesta del JSON; escribo "¿tienen clases de cajón?" (no está en las 10) y responde que deriva al dueño y le avisa a DUENO_WHATSAPP; panel.html abre y muestra los 5 indicadores. Todo en menos de 6 horas de trabajo mío.

## FASE 2 — PILOTO (bloqueada; tope 30 horas; un solo cliente)
Qué debe poder hacer, además de lo anterior:
1. Número dedicado del cliente (chip nuevo) registrado en la Cloud API; el token permanente va al .env del servidor, nunca al repositorio.
2. Despliegue en el hosting más barato que corra un proceso Python 24/7 (compara al menos dos opciones con plan gratuito o de hasta S/ 20 al mes y dime cuál elegiste y por qué antes de desplegar). SQLite persistente en disco.
3. Derivación real: cuando el asistente no sabe, envía al dueño por WhatsApp el número del cliente y su pregunta, y le responde al cliente que el dueño le escribirá. Horario de derivación configurable.
4. Carga de preguntas sin tocar código: preguntas.json y cliente.json editables por Indira; un comando valida los JSON y recarga sin reiniciar. Estructura clientes/<nombre>/ con esos dos archivos, y el servidor atiende varios números a la vez leyendo esas carpetas (un phone_number_id por cliente), para que el segundo cliente no exija rehacer nada.
5. Reporte semanal: un comando que exporta a CSV las 5 métricas de la semana y el detalle de conversaciones derivadas; Indira lo pega en Google Sheets y lo manda al dueño. No construyas un panel web con usuarios y contraseñas: no cabe en 30 horas.
6. Contador de costos: tabla con mensajes enviados por mes, tokens de IA usados y costo estimado en soles con un tipo de cambio configurable en .env. Un comando muestra el costo acumulado del mes. Si supera S/ 35, me avisa.
7. Pruebas mínimas con pytest: coincidencia de FAQ, derivación cuando no hay coincidencia, comando BORRAR, contador de mensajes. Deben pasar antes de cada despliegue.

Criterio de éxito de la Fase 2: el asistente responde en el número del cliente las 10 preguntas cargadas por Indira; una pregunta fuera de lista llega al dueño en menos de 1 minuto; el CSV semanal sale con un comando; el costo medido del primer mes es S/ 35 o menos; horas reales anotadas en CRONOMETRO.md, 30 o menos.

## Restricciones y qué NO debes hacer
- No construyas nada de la Fase 2 sin la frase "PAGO RECIBIDO: ...". Si tienes tiempo de sobra en la Fase 1, mejora el README, no el producto.
- No envíes mensajes a ningún número que no sea el mío, el de Indira o, en la Fase 2, el del cliente que pagó. Antes de cualquier envío a un número nuevo, pregúntame.
- No gastes dinero ni crees cuentas por tu cuenta: cuando haga falta una cuenta, token o pago, dame los pasos y espera.
- No uses WhatsApp Web, Baileys, whatsapp-web.js ni ninguna automatización no oficial, aunque sea "para probar".
- No respondas con datos que no estén en preguntas.json. Si la IA no encuentra coincidencia con confianza alta, deriva. Prefiere derivar de más a inventar.
- No reutilices código de proyectos anteriores míos ni de mi empleador: todo se escribe desde cero en esta carpeta.
- No instales dependencias de pago. Mantén requirements.txt corto; justifica cada paquete en una línea.
- Si falta un dato (token, número, texto de una respuesta), pregúntame en vez de suponer.

## Casos límite
- Meta devuelve error al enviar: reintenta 2 veces con espera, registra el error, y si sigue fallando avisa al dueño por el canal que sí funcione (en demo: consola y demo.html).
- El cliente escribe audio, imagen o sticker: responde que solo atiende texto y ofrece derivar.
- Mensaje vacío, muy largo (más de 1 000 caracteres) o en otro idioma: responde con cortesía, no llama a la IA, deriva si insiste.
- La API de Anthropic falla o tarda más de 10 segundos: responde con la coincidencia por palabras clave si existe; si no, deriva. El asistente nunca se queda callado.
- Dos mensajes seguidos del mismo número en menos de 5 segundos: responde una sola vez.
- El dueño escribe al número del asistente: trátalo como administrador solo si su número es DUENO_WHATSAPP; comandos: "PAUSA", "REANUDAR", "REPORTE".

## Cómo trabajar conmigo
- Antes de escribir código, dame el plan de archivos y el orden de construcción en 10 líneas y espera mi "ok".
- Avanza por bloques de máximo 1 hora de mi tiempo; al cerrar cada bloque dime qué quedó funcionando, cómo lo pruebo y recuérdame anotar las horas en CRONOMETRO.md.
- Español, directo, sin relleno. Términos técnicos en inglés cuando sean el nombre real de la cosa.
- Cuando termines la Fase 1, dime literalmente: "Fase 1 lista. La Fase 2 queda bloqueada hasta PAGO RECIBIDO."
```

## Ajuste del 2026-10-22
A pedido de Carlos, se agregó la ficha de alta por cliente (cliente.json) y la estructura multi-cliente en la Fase 2, para que el mismo programa sirva a cualquier negocio cambiando solo datos. Pendiente de A0-3: si Meta permite registrar números de varios negocios bajo la cuenta de los socios o si cada cliente debe verificar la suya [DESCONOCIDO].

## Supuestos tomados por el Director
1. Stack Python + FastAPI + SQLite: Carlos no declaró preferencia; es lo más barato de alojar y lo que menos horas consume.
2. IA con el modelo más barato de Anthropic a temperatura 0, restringida a elegir entre las 10 preguntas cargadas: evita que el asistente invente y mantiene el costo variable dentro de los S/ 35 (S-29).
3. Reporte semanal por CSV y no por panel web con usuarios: cabe en 30 horas; el panel con 5 indicadores queda como pantalla estática para la demo (lo que pide A2).

## Prompt de corrección enviado el 2026-10-22 (Claude Code ya tenía un plan; aún no ejecutaba)
Objetivo del ajuste: que el programa genere chatbots para cualquier negocio que contrate a los socios, con una carpeta por cliente (`cliente.json` + `preguntas.json`), comandos de alta y validación para Indira, demo con selector de cliente, datos separados por cliente en SQLite, y un solo proceso atendiendo varios `phone_number_id` en la Fase 2. Prioridad dentro del tope de 6 h: (a) carpetas y carga, (b) comandos de alta/validación, (c) selector en la demo; lo que no quepa va a PENDIENTES.md. Texto completo entregado a Carlos en el chat del 2026-10-22.

## Añadido del 2026-10-23 — MCP oficial de Meta
Carlos compartió https://developers.facebook.com/documentation/mcp/whatsapp-business-tools-mcp (leído por el Director el 2026-10-23). Es un servidor MCP en beta que administra la integración de WhatsApp actuando en nombre del desarrollador (números, plantillas, webhooks, envío, pagos, verificación). Sirve para configurar y depurar el piloto; no reemplaza el bot. Línea agregada al prompt: usar el MCP solo para configurar y depurar, nunca enviar a números fuera de la lista permitida, y documentar todo como pasos manuales por si el beta falla.
