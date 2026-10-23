from datetime import date
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.comments import Comment

F = "Arial"
fn = Font(name=F, size=10); fb = Font(name=F, size=10, bold=True); ft = Font(name=F, size=14, bold=True)
fh = Font(name=F, size=10, bold=True, color="FFFFFF")
fill_h = PatternFill("solid", fgColor="1F4E78"); fill_in = PatternFill("solid", fgColor="FFFF00")
fill_a = PatternFill("solid", fgColor="DDEBF7"); fill_b = PatternFill("solid", fgColor="FCE4D6"); fill_g = PatternFill("solid", fgColor="EDEDED")
thin = Side(style="thin", color="BFBFBF"); border = Border(left=thin, right=thin, top=thin, bottom=thin)
wrap = Alignment(wrap_text=True, vertical="top")
D = lambda m, d: date(2026, m, d)
DATEFMT = "ddd dd-mmm"

wb = Workbook()

def header(ws, row, cols, widths=None):
    for i, c in enumerate(cols, 1):
        cell = ws.cell(row=row, column=i, value=c); cell.font = fh; cell.fill = fill_h; cell.alignment = wrap; cell.border = border
    if widths:
        for i, w in enumerate(widths, 1): ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = ws.cell(row=row + 1, column=1)

def style_row(ws, row, ncols, fill=None):
    for c in range(1, ncols + 1):
        cell = ws.cell(row=row, column=c); cell.font = fn; cell.alignment = wrap; cell.border = border
        if fill: cell.fill = fill

# ---------------------------------------------------------------- INICIO
ws = wb.active; ws.title = "Inicio"
ws.column_dimensions["A"].width = 28; ws.column_dimensions["B"].width = 95
rows = [
 ("Plan de validación — Chatbot de WhatsApp (A) y Sorpresas y detalles (B)", None),
 ("Ventana", "Martes 27 de octubre a domingo 22 de noviembre de 2026. Primera venta deseada: 1 de diciembre."),
 ("Quién ejecuta", "Carlos e Indira. La agencia no ejecuta nada: diseñó el plan y calcula el desempate con los registros de ustedes."),
 ("Qué paga cada uno", "Carlos: gastos del chatbot (S/ 30 de consumo en A1; chip S/ 15 solo si se vende el piloto, se paga con el cobro). Indira: gastos de las cajas (S/ 40–60 en B1; S/ 30–40 en B3 solo si B1 pasa). Total del plan: S/ 100–130."),
 ("Tope de horas", "10 horas por semana por persona. La hoja Calendario lo verifica automáticamente."),
 ("Cómo usar este archivo", "1) Lean 'A Chatbot' y 'B Detalles': cada fila es un paso con fecha, responsable, horas y qué hacer exactamente. 2) Cada día que trabajen, anoten horas reales y gasto real en las celdas amarillas y cambien el Estado. 3) Cuando tengan datos (entrevistas, pagos, costos), llénenlos en 'Registro de resultados': las celdas de criterio dicen solas PASA / REPETIR / NO PASA. 4) El 20 de noviembre, con todo lleno, la hoja 'Desempate' calcula el margen por hora de cada negocio. 5) Me traen los resultados con /actualizar."),
 ("Leyenda", "Celdas AMARILLAS = las llenan ustedes. Celdas blancas = fijas (plan) o fórmulas: no las editen. Azul claro = chatbot. Naranja claro = cajas."),
 ("Reglas que no se negocian", "No construir el chatbot completo antes de que alguien pague. No preparar alimentos en casa: solo dulces envasados de marca. No escribir a desconocidos en privado ni puerta a puerta. No gastar más de lo presupuestado por experimento aunque 'falte poco'."),
 ("Los criterios de éxito", "Se fijaron antes de empezar y salen del modelo financiero. Si un experimento no pasa, no se fuerza: se sigue la regla escrita en su fila ('Qué se decide')."),
 ("Piloto técnico en la librería", "Decisión de Carlos del 2026-10-23: antes de prometer instalación a un cliente, se monta el bot completo en la librería de la mamá de Indira (filas A3t). Es trabajo EXTRA de Carlos (hasta 20 h) fuera del tope de validación; cuesta S/ 15 de chip. La librería NO cuenta como cliente pagado para el criterio A2: es familia y es el piloto técnico."),
 ("Si ninguna pasa", "Se vuelve a la Fase 3: cliente incógnito si en las entrevistas 2 dueños dijeron que pagarían una evaluación; si no, el taller de apps con IA."),
]
for i, (a, b) in enumerate(rows, 1):
    ws.cell(row=i, column=1, value=a).font = ft if i == 1 else fb
    if b: c = ws.cell(row=i, column=2, value=b); c.font = fn; c.alignment = wrap
    ws.row_dimensions[i].height = 15 if i == 1 else max(15, 15 * (len(b) // 95 + 1)) if b else 15
r = len(rows) + 2
ws.cell(row=r, column=1, value="Estados posibles").font = fb
ws.cell(row=r, column=2, value="Pendiente · En curso · Hecho · Pasó · Repetir con cambio · No pasó · No aplica").font = fn
r += 2
ws.cell(row=r, column=1, value="Ejemplo de fila llena").font = fb
ws.cell(row=r, column=2, value="Paso A0-2, Estado 'Hecho', Horas reales 0,5, Resultado: 'Recibí el hello_world a las 21:10; captura guardada'. Así de corto basta.").font = fn
ws.cell(row=r, column=2).alignment = wrap

# ---------------------------------------------------------------- PASOS
cols = ["Paso", "Experimento", "Qué hacer exactamente", "Inicio", "Fin", "Responsable", "Horas plan Carlos", "Horas plan Indira",
        "S/ plan", "Quién paga", "Criterio de éxito / qué se decide", "Estado", "Horas reales Carlos", "Horas reales Indira", "S/ real", "Resultado / notas"]
widths = [8, 22, 60, 12, 12, 13, 9, 9, 8, 10, 50, 14, 9, 9, 8, 40]
dv = DataValidation(type="list", formula1='"Pendiente,En curso,Hecho,Pasó,Repetir con cambio,No pasó,No aplica"', allow_blank=True)

A = [
 ("A0-1","A0 Términos de Meta y número de prueba","Crear cuenta de desarrollador en developers.facebook.com, crear una app y activar el producto WhatsApp. Anotar el número de prueba que Meta asigna.",D(10,27),D(10,27),"Carlos",1,0,0,"—","Hecho cuando la app existe y muestra el número de prueba."),
 ("A0-2","A0","Registrar los celulares de Carlos e Indira como destinatarios de prueba y enviar la plantilla hello_world. Guardar captura del mensaje recibido.",D(10,28),D(10,28),"Carlos",0.5,0,0,"—","PASA si Carlos recibe el mensaje real en su WhatsApp. Si Meta exige verificación previa y no se logra en 2 h: la demo de A2 se hace simulada en pantalla (S-40 descartado); A2 sigue igual."),
 ("A0-3","A0","Leer la página de precios de WhatsApp Business Platform para Perú y escribir una nota de 1 página con 4 datos: costo por mensaje (servicio/utilidad/marketing) desde el 1-oct-2026, cuota gratuita mensual, requisitos de verificación del negocio, y si un número puede estar a la vez en la app WhatsApp Business y en la API. Con enlace y fecha.",D(10,29),D(10,29),"Carlos",0.5,0,0,"—","Hecho cuando la nota tiene los 4 datos con enlace. Sirve para la oferta de A2 y para el costo variable del modelo (S-29)."),
 ("A1-1","A1 Entrevistas a 5–6 dueños","Reunión de los dos (miércoles 20:00): imprimir el guion de la hoja 'Guiones y ofertas', repartir contactos (Carlos: academia, galletas, cafetería; Indira: librería, agencia, su local), agendar cada entrevista por WhatsApp o en persona.",D(10,28),D(10,28),"Ambos",1,1,0,"—","Hecho cuando las 6 entrevistas tienen fecha."),
 ("A1-2","A1","Entrevista al dueño de la academia de marinera (amigo de Carlos). Guion de 5 preguntas, respuestas textuales en la hoja 'Registro de resultados'.",D(10,29),D(11,1),"Carlos",1.5,0,0,"—","Registrar las 5 respuestas. Si en la P4 dice sí, anotar la fecha."),
 ("A1-3","A1","Entrevista a la mamá de Indira (librería). Mismo guion.",D(10,29),D(11,1),"Indira",1.5,0,0,"—","Registrar las 5 respuestas."),
 ("A1-4","A1","Entrevista a las amigas de la agencia de contenido (como clientes potenciales y como fuente de referidos: sus clientes atienden WhatsApp). Mismo guion.",D(10,30),D(11,4),"Indira",0,1,0,"—","Registrar las 5 respuestas y cuántos clientes suyos atienden WhatsApp."),
 ("A1-5","A1","Videollamada con la amiga de las galletas. Mismo guion. Preguntar además si vende con registro sanitario o marca formal (dato para B, S-41).",D(11,2),D(11,5),"Carlos",1,0,0,"—","Registrar las 5 respuestas + registro sanitario sí/no."),
 ("A1-6","A1","Cafetería de Lima Norte que Carlos frecuenta: ir como cliente, consumir (S/ 15) y conversar con el dueño o encargado con el guion. No es venta: es conversación.",D(11,3),D(11,7),"Carlos",1.5,0,15,"Carlos","Registrar las 5 respuestas."),
 ("A1-7","A1","Tienda o cafetería que Indira frecuenta: igual que A1-6.",D(11,3),D(11,7),"Indira",0,1.5,15,"Carlos","Registrar las 5 respuestas."),
 ("A1-8","A1","Consolidar las respuestas en la tabla A1 de 'Registro de resultados'. La celda de criterio calcula sola si A1 pasó.",D(11,8),D(11,8),"Indira",0,1,0,"—","PASA si ≥ 3 de 5 eligen S/ 80 o más en la P3 y ≥ 1 da fecha en la P4. REPETIR si solo 2 nombran precio y es ≤ S/ 50 (en A2 se ofrece el módulo básico a S/ 50 → S/ 80). NO PASA si ≤ 1 nombra precio: A2 no se hace y el chatbot pasa a la banda 31-ene. Incógnito: ≥ 2 de 5 pagarían ≥ S/ 100 → sigue en reserva."),
 ("A2-1","A2 Demo y preventa del piloto","Indira define los 5 indicadores del panel (consultas recibidas, respondidas por el bot, derivadas, tiempo de respuesta, consultas que terminaron en venta o matrícula) y revisa el texto de la oferta (hoja 'Guiones y ofertas').",D(11,4),D(11,4),"Indira",0,1.5,0,"—","Hecho cuando los 5 indicadores están escritos y la oferta tiene precio y fechas."),
 ("A2-2","A2","Carlos construye la DEMO con Claude Code en máximo 6 horas cronometradas: (a) si A0 pasó, 10 preguntas frecuentes reales de la academia respondidas desde el número de prueba al celular del dueño; si no, una conversación simulada en una página web con apariencia de WhatsApp; (b) una pantalla estática del panel con los 5 indicadores. NO es el producto.",D(11,3),D(11,8),"Carlos",6,0,0,"—","Hecho cuando la demo corre de principio a fin en 10 minutos. Anotar las horas reales (S-33)."),
 ("A2-3","A2","Mostrar la demo y hacer la oferta exacta (ver hoja 'Guiones y ofertas') a los que dijeron sí en A1. Carlos: academia y galletas. Indira: librería y locales. En persona o videollamada.",D(11,9),D(11,14),"Ambos",2,2,0,"—","Se cobra S/ 100 por Yape o Plin SOLO si hay fecha de inicio ≤ 30-nov. Registrar cada pago en la tabla A2."),
 ("A2-4","A2","Seguimiento por WhatsApp a quienes pidieron pensarlo. Cierre de cobros: domingo 15 de noviembre, 23:59.",D(11,9),D(11,15),"Ambos",1,1,0,"—","PASA si ≥ 1 dueño QUE NO SEA FAMILIA pagó S/ 100 antes del 15-nov con inicio ≤ 30-nov (2 pagos = escenario base). La librería no cuenta para este criterio aunque pague: es el piloto técnico y es familia. REPETIR si 0 pagos pero ≥ 2 dicen 'sí cuando lo vea funcionando': a UNO se le ofrece por escrito 14 días gratis con cobro de S/ 100 el día 15 si no pide apagarlo, plazo 22-nov. NO PASA si 0 pagos y 0 compromisos: no se construye nada."),
 ("A3t-1","A3t Piloto técnico en la librería (decisión de Carlos, 2026-10-23)","Crear el portafolio de Meta y la cuenta de WhatsApp Business A NOMBRE DE LA LIBRERÍA (la mamá de Indira como administradora; Carlos con rol de administrador en el negocio y en la app). Aceptar los términos de la Cloud API. Comprar un chip nuevo que nunca haya estado en WhatsApp (S/ 15). Registrar el número (nombre visible + PIN). Si los mensajes reales no llegan al webhook, pasar la app a modo Live (página de política de privacidad generada por Claude Code). Anotar CADA traba y los minutos de cada paso en una lista: es el checklist de alta que se repetirá con cada cliente.",D(10,27),D(10,31),"Carlos",4,1,15,"Carlos","PASA si el número real de la librería recibe y responde un mensaje de prueba. Cada traba anotada con cuánto tardó en resolverse. Si una traba no se resuelve en 4 h, se detiene y se me avisa con /actualizar antes de seguir."),
 ("A3t-2","A3t Piloto técnico","Sobre la demo, construir el bot mínimo multi-cliente: carpeta clientes/libreria con cliente.json y preguntas.json, derivación real al número de la mamá de Indira, registro en SQLite, contador de mensajes. Indira carga las 10 preguntas REALES de la librería con su mamá.",D(11,2),D(11,8),"Ambos",8,1.5,0,"—","Hecho cuando las 10 preguntas responden en el número de la librería y una pregunta fuera de lista llega a la mamá de Indira en menos de 1 minuto. Cronometrar (S-36)."),
 ("A3t-3","A3t Piloto técnico","Desplegar en el hosting gratuito elegido para que corra 24/7. Dejarlo 3 días recibiendo mensajes de clientes reales de la librería. Exportar el primer reporte CSV y revisarlo con la mamá de Indira. Medir mensajes enviados y costo.",D(11,9),D(11,15),"Ambos",6,1,0,"—","PASA si está operativo ≤ 15-nov con ≤ 20 h totales de Carlos en A3t y el checklist de alta completo con tiempos. Resultado: la oferta puede prometer 'instalación en X días' con X = días reales medidos. NO PASA si hay una traba estructural de Meta: A2 se vende con la demo pero SIN comprometer fecha de instalación, y la traba se registra con /actualizar."),
 ("A3-1","A3 Entrega del piloto (solo si A2 pasó)","Comprar el chip del número dedicado (S/ 15, se paga con el cobro). Crear el número en la Cloud API de Meta.",D(11,16),D(11,17),"Carlos",0.5,0,15,"Carlos (del cobro)","Hecho cuando el número nuevo recibe mensajes."),
 ("A3-2","A3","Indira carga con el dueño las 10 preguntas frecuentes y sus respuestas exactas; arma la plantilla del reporte semanal en Google Sheets.",D(11,16),D(11,20),"Indira",0,1,0,"—","Hecho cuando las 10 respuestas están aprobadas por el dueño."),
 ("A3-3","A3","Replicar para el cliente que pagó el alta ya probada en la librería (A3t): carpeta clientes/<cliente>, cuenta y número a nombre del cliente, despliegue en el mismo servidor. Cronometrar. Si A3t pasó, esto debería tomar mucho menos de 30 h.",D(11,16),D(12,6),"Carlos",4,0,0,"—","PASA si el bot está operativo en el número del cliente ≤ 30-nov, con ≤ 30 h cronometradas y costo variable ≤ S/ 35 en los primeros 30 días. Si supera 30 h o S/ 35, no se descarta: la Etapa 2 recalcula con la cifra real."),
 ("D-A","D Desempate","Consolidar los registros del chatbot (horas reales, S/ cobrados, costos) en la hoja 'Desempate'. Viernes 20-nov, 20:00, juntos.",D(11,20),D(11,20),"Ambos",1,0,0,"—","La hoja calcula el margen por hora. El Director lo registra en decisiones.md."),
]
B = [
 ("B1-1","B1 Costeo de una caja real","Carlos pide por WhatsApp 2 cotizaciones a motorizados conocidos (o que atienden a la librería) y 1 en una app de envíos, para dos rutas: Independencia → Los Olivos e Independencia → Miraflores. Es compra de un servicio, no prospección.",D(10,28),D(10,28),"Carlos",1,0,0,"—","Anotar los 3 precios por ruta en la tabla B1."),
 ("B1-2","B1","Carlos lista 5 cuentas de Instagram de 'detalles Lima' con el precio de una caja comparable SIN alimentos preparados (anotar cuenta, producto, precio, fecha). Referencia ya verificada: SorprendeLima S/ 80–360, siempre con repostería o flores.",D(10,30),D(10,30),"Carlos",0,0,0,"—","Anotar las 5 en la tabla B1. (La hora de Carlos va en B1-1: 1 h total para B1-1 y B1-2 juntas, repartida 1 + 1 según el plan.)"),
 ("B1-3","B1","Indira compra los insumos de UNA caja con la composición exacta que se venderá: caja rígida decorada, 3–4 dulces envasados de marca (con registro sanitario del fabricante), 1 peluche pequeño o 1 flor, tarjeta, globo sencillo, papel y cinta. Guardar boleta o foto de cada precio.",D(10,31),D(10,31),"Indira",0,2,50,"Indira","Gasto máximo S/ 60. Anotar cada precio en la tabla B1 (la suma se calcula sola)."),
 ("B1-4","B1","Indira arma la caja cronometrada y toma 5 fotos con buena luz (serán las fotos de la oferta).",D(10,31),D(10,31),"Indira",0,1.5,0,"—","Anotar los minutos de armado en la tabla B1."),
 ("B1-5","B1","Indira completa la tabla de costeo en 'Registro de resultados'. La celda de criterio dice sola si B1 pasó.",D(11,1),D(11,1),"Indira",0,0.5,0,"—","PASA si insumos + empaque + motorizado Lima Norte ≤ S/ 40 (con precio S/ 80 con envío), ≥ 3 de 5 competidores entre S/ 60 y S/ 100, y armado ≤ 1 h. REPETIR si costo S/ 41–50: la preventa sale a S/ 95 / S/ 110 y se verifica que ≥ 3 competidores estén en ese rango. NO PASA si costo > S/ 50 o motorizado > S/ 20 en Lima Norte: B2 y B3 no se hacen; B se descarta por escrito."),
 ("B2-1","B2 Preventa pagada (2 semanas)","Publicar la oferta exacta (hoja 'Guiones y ofertas') con las fotos de B1 en: estados de WhatsApp de ambos, Instagram de Indira (o cuenta nueva del negocio que ella crea), grupos de WhatsApp de la UPN de cada uno. Pedir a las amigas de la agencia que compartan (sin pago). NO escribir en privado a nadie que no haya preguntado.",D(11,2),D(11,2),"Ambos",0.5,1,0,"—","Hecho cuando está publicada en los 4 canales."),
 ("B2-2","B2","Indira responde consultas y registra cada pedido en la tabla B2: fecha, cliente, zona, precio, pagó adelantado sí/no, si es de fuera del círculo cercano, si pidió descuento, fecha de entrega elegida (16 a 29 nov).",D(11,2),D(11,8),"Indira",0,2.5,0,"—","Solo cuenta un pedido cuando el Yape o Plin está recibido."),
 ("B2-3","B2","Semana 2 de preventa: seguir respondiendo y registrando. Cierre: domingo 15 de noviembre, 23:59. Carlos cuadra los cobros recibidos contra la tabla.",D(11,9),D(11,15),"Ambos",0.5,3,0,"—","PASA si ≥ 6 pedidos pagados (≥ S/ 480), ≥ 2 de personas fuera del círculo cercano y ≥ 3 de cada 5 sin pedir descuento. REPETIR si 4–5 pedidos: se extiende hasta el 22-nov con segunda foto y una variante (p. ej., 'para él'); el umbral sigue en 6 acumulados. NO PASA si ≤ 3 pedidos o 0 de fuera del círculo: B se descarta por escrito; lo cobrado se entrega igual."),
 ("B3-1","B3 Anuncio mínimo (solo si B1 pasó)","Indira impulsa la publicación de la oferta con botón a WhatsApp. Público: Lima Norte, 20–35 años, 5–6 días. Presupuesto total S/ 30–40. A cada consulta preguntar '¿cómo nos encontraste?' y anotarlo.",D(11,11),D(11,11),"Indira",0,1,35,"Indira","Registrar en la tabla B3: consultas atribuibles al anuncio, gasto real, pedidos pagados de desconocidos."),
 ("B3-2","B3","Responder las consultas del anuncio. Viernes 13-nov: Carlos e Indira revisan juntos las métricas del anuncio.",D(11,12),D(11,15),"Ambos",0.5,1,0,"—","PASA si ≥ 5 consultas por WhatsApp atribuibles, ≤ S/ 8 por consulta y ≥ 1 pedido pagado de un desconocido. NO PASA: aunque B2 pase, B queda como 'demanda solo de conocidos' y su crecimiento en el modelo baja a 0 %. No se repite con más dinero."),
 ("B4-1","B4 Entrega (solo si B2 pasó)","Comprar los insumos de todos los pedidos con los adelantos recibidos (≈ S/ 40 por pedido).",D(11,16),D(11,18),"Indira",0,2,0,"Adelantos","Anotar el costo real por pedido en la tabla B2."),
 ("B4-2","B4","Sábado 21-nov: armar las cajas por lotes, cronometrando. Coordinar motorizados por fecha de entrega; enviar foto de la entrega a cada cliente.",D(11,21),D(11,29),"Ambos",2,5,0,"Adelantos","PASA si costo real promedio ≤ S/ 40 por pedido y ≤ 1,5 h por pedido entre armado y coordinación. Si se supera, la Etapa 2 recalcula con las cifras reales."),
 ("D-B","D Desempate","Consolidar los registros de las cajas (horas reales, S/ cobrados, costos) en la hoja 'Desempate'. Viernes 20-nov, 20:00, juntos.",D(11,20),D(11,20),"Ambos",0,1,0,"—","La hoja calcula el margen por hora."),
]

def pasos_sheet(name, data, fill):
    ws = wb.create_sheet(name)
    ws.cell(row=1, column=1, value=f"{name} — pasos en orden. Amarillo = ustedes llenan. Fechas de 2026.").font = fb
    header(ws, 2, cols, widths); ws.add_data_validation(dv)
    for i, row in enumerate(data, 3):
        for j, v in enumerate(row, 1):
            ws.cell(row=i, column=j, value=v)
        style_row(ws, i, len(cols), fill)
        for c in (4, 5): ws.cell(row=i, column=c).number_format = DATEFMT
        for c in (12, 13, 14, 15, 16): ws.cell(row=i, column=c).fill = fill_in
        ws.cell(row=i, column=12, value="Pendiente"); dv.add(ws.cell(row=i, column=12))
        ws.row_dimensions[i].height = 15 * max(len(str(row[2])) // 58 + 1, len(str(row[10])) // 48 + 1)
    last = 2 + len(data); tot = last + 1
    ws.cell(row=tot, column=3, value="TOTAL").font = fb
    for c in (7, 8, 9, 13, 14, 15):
        L = get_column_letter(c); ws.cell(row=tot, column=c, value=f"=SUM({L}3:{L}{last})").font = fb
    return ws, last, tot

wsA, lastA, totA = pasos_sheet("A Chatbot", A, fill_a)
wsB, lastB, totB = pasos_sheet("B Detalles", B, fill_b)

# ---------------------------------------------------------------- CALENDARIO (fórmulas SUMIFS sobre los pasos por semana)
ws = wb.create_sheet("Calendario", 1)
ws.cell(row=1, column=1, value="Horas planificadas por semana y por persona (se calculan desde las hojas de pasos). Tope: 10 h/semana/persona.").font = fb
header(ws, 2, ["Semana", "Inicio", "Fin", "Carlos chatbot (validación)", "Carlos cajas", "Carlos validación", "¿Carlos ≤ 10?", "Indira chatbot (validación)", "Indira cajas", "Indira validación", "¿Indira ≤ 10?", "S/ chatbot", "S/ cajas", "S/ total", "Carlos piloto técnico (extra)", "Carlos TOTAL", "¿Carlos ≤ 20?", "Indira piloto técnico (extra)", "Indira TOTAL", "¿Indira ≤ 20?"],
       [16, 11, 11, 13, 12, 12, 13, 13, 12, 12, 13, 10, 10, 10, 14, 12, 13, 14, 12, 13])
semanas = [("W1", D(10,27), D(11,1)), ("W2", D(11,2), D(11,8)), ("W3", D(11,9), D(11,15)), ("W4", D(11,16), D(11,22))]
for i, (w, a, b) in enumerate(semanas, 3):
    ws.cell(row=i, column=1, value=w); ws.cell(row=i, column=2, value=a); ws.cell(row=i, column=3, value=b)
    ws.cell(row=i, column=2).number_format = DATEFMT; ws.cell(row=i, column=3).number_format = DATEFMT
    # una tarea cuenta en la semana de su fecha de INICIO (los pasos largos ya traen las horas de esa semana)
    def sumifs(sheet, col):  # col letter of hours/money
        return f"SUMIFS('{sheet}'!{col}$3:{col}${lastA if sheet=='A Chatbot' else lastB},'{sheet}'!$D$3:$D${lastA if sheet=='A Chatbot' else lastB},\">=\"&$B{i},'{sheet}'!$D$3:$D${lastA if sheet=='A Chatbot' else lastB},\"<=\"&$C{i})"
    def sum_a3t(col):
        refs = [f"'A Chatbot'!{col}{3+k}" for k, row in enumerate(A) if row[0].startswith("A3t") and a <= row[3] <= b]
        return "=" + ("+".join(refs) if refs else "0")
    ws.cell(row=i, column=15, value=sum_a3t("G")); ws.cell(row=i, column=18, value=sum_a3t("H"))
    ws.cell(row=i, column=4, value="=" + sumifs("A Chatbot", "G") + f"-O{i}"); ws.cell(row=i, column=5, value="=" + sumifs("B Detalles", "G"))
    ws.cell(row=i, column=6, value=f"=D{i}+E{i}"); ws.cell(row=i, column=7, value=f'=IF(F{i}<=10,"Sí","NO: recortar")')
    ws.cell(row=i, column=8, value="=" + sumifs("A Chatbot", "H") + f"-R{i}"); ws.cell(row=i, column=9, value="=" + sumifs("B Detalles", "H"))
    ws.cell(row=i, column=16, value=f"=F{i}+O{i}"); ws.cell(row=i, column=17, value=f'=IF(P{i}<=20,"Sí","NO: recortar")')
    ws.cell(row=i, column=19, value=f"=J{i}+R{i}"); ws.cell(row=i, column=20, value=f'=IF(S{i}<=20,"Sí","NO: recortar")')
    ws.cell(row=i, column=10, value=f"=H{i}+I{i}"); ws.cell(row=i, column=11, value=f'=IF(J{i}<=10,"Sí","NO: recortar")')
    ws.cell(row=i, column=12, value="=" + sumifs("A Chatbot", "I")); ws.cell(row=i, column=13, value="=" + sumifs("B Detalles", "I"))
    ws.cell(row=i, column=14, value=f"=L{i}+M{i}")
    style_row(ws, i, 20)
ws.cell(row=7, column=1, value="TOTAL").font = fb
for c in (4, 5, 6, 8, 9, 10, 12, 13, 14, 15, 16, 18, 19):
    L = get_column_letter(c); ws.cell(row=7, column=c, value=f"=SUM({L}3:{L}6)").font = fb
ws.cell(row=11, column=1, value="Piloto técnico (A3t, decisión de Carlos del 2026-10-23): horas EXTRA fuera del tope de 10 h de validación; se controlan contra las 20 h semanales de cada socio. Si una semana marca NO, se recorta el piloto técnico, no la validación.").font = fn
ws.cell(row=9, column=1, value="Nota: la fila A3-3 (construcción del piloto) cuenta solo sus 7 h de la semana 4; del 23-nov al 6-dic son hasta 10 h/semana adicionales, fuera de esta ventana. La fila B4-2 cuenta en la semana 4 aunque las entregas sigan hasta el 29-nov.").font = fn
ws.cell(row=10, column=1, value="Ventanas libres en común: lunes, miércoles y viernes desde las 20:00; sábado; domingo tarde. Indira estudia martes y jueves 19:30–22:40 y domingos 10:00–14:00.").font = fn

# ---------------------------------------------------------------- GUIONES Y OFERTAS
ws = wb.create_sheet("Guiones y ofertas")
ws.column_dimensions["A"].width = 26; ws.column_dimensions["B"].width = 110
g = [
 ("GUION A1 — entrevista (5 preguntas, en este orden, sin sugerir respuestas; anotar textual)", ""),
 ("P1 (S-20)", "¿Cuántos mensajes de clientes recibe por WhatsApp en una semana normal y quién los responde? → anotar número y quién."),
 ("P2 (problema)", "¿Cuáles son las 3 preguntas que más se repiten, y cuántas ventas o matrículas cree que pierde al mes por responder tarde o fuera de horario? → anotar cifra aunque sea aproximada."),
 ("P3 (S-10, S-34)", "Si un asistente automático respondiera esas preguntas las 24 horas, derivara a usted lo que no sabe y le enviara cada semana cuántas consultas terminaron en venta, ¿cuánto pagaría al mes? Elija: nada / S/ 50 / S/ 100 / S/ 150 / S/ 200."),
 ("P4 (S-08, S-14)", "¿Aceptaría probarlo 30 días en un número nuevo del negocio pagando S/ 100 por adelantado, y qué fecha le vendría bien para empezar? → sí/no y fecha."),
 ("P5 (incógnito, S-09)", "Aparte de eso: ¿pagaría S/ 100 a S/ 150 por una visita de cliente incógnito a su local, un informe de 2 páginas y 45 minutos de capacitación a su personal? ¿Cuánto? → monto y si hoy compra algo parecido."),
 ("Cierre (S-28)", "Si respondió sí en la P4: ¿necesita factura o le basta boleta / Yape?"),
 ("", ""),
 ("OFERTA A2 — texto exacto del piloto", "\"Piloto de 30 días: un asistente en un número nuevo de WhatsApp de su negocio que responde sus 10 preguntas más frecuentes a toda hora, le deriva lo que no sabe y le manda un reporte semanal con 5 indicadores. Precio del piloto: S/ 100, pagados por adelantado por Yape o Plin. Si sigue, S/ 150 al mes desde el segundo mes; si no, se apaga sin costo. Instalación en 14 días desde el pago; arranque a más tardar el lunes 30 de noviembre.\""),
 ("Regla de cobro", "Se cobra SOLO si hay fecha de inicio ≤ 30-nov. Sin fecha no hay cobro. No se regala el primer mes."),
 ("", ""),
 ("OFERTA B2 — texto exacto de la Caja Detalle", "\"Caja Detalle — para cumpleaños, aniversario o 'me acordé de ti'. Caja decorada, 3 dulces de marca, peluche pequeño o flor, tarjeta con tu mensaje y globo. S/ 80 con envío incluido en Independencia, Los Olivos, San Martín de Porres y Comas; S/ 95 en el resto de Lima. Pago por Yape o Plin al hacer el pedido. Elige la fecha de entrega entre el lunes 16 y el domingo 29 de noviembre; te mandamos foto de la entrega. Pedidos hasta el domingo 15 de noviembre.\""),
 ("Si B1 terminó en REPETIR", "Los precios pasan a S/ 95 (Lima Norte) / S/ 110 (resto de Lima). Todo lo demás igual."),
 ("Canales permitidos", "Estados de WhatsApp de ambos · Instagram de Indira o cuenta nueva del negocio · grupos de WhatsApp de la UPN · amigas de la agencia compartiendo sin pago · anuncio B3 con métrica. Prohibido: mensajes en frío, puerta a puerta."),
 ("", ""),
 ("CONTACTOS", ""),
 ("Academia de marinera", "Dueño, amigo cercano de Carlos → entrevista A1-2 (Carlos), demo A2-3 (Carlos). Candidato a piloto del chatbot."),
 ("Librería", "Mamá de Indira → entrevista A1-3 (Indira), demo A2-3 (Indira). También: motorizado que atiende a la librería (B1-1)."),
 ("Agencia de contenido", "Amigas de la UPN, recién iniciada → entrevista A1-4 (Indira). Difusoras de la oferta B2 sin pago."),
 ("Galletas", "Amiga que vende por redes → entrevista A1-5 (Carlos, videollamada). Preguntar registro sanitario (S-41)."),
 ("Cafetería / tienda de Lima Norte", "Una que frecuenta Carlos (A1-6) y una que frecuenta Indira (A1-7). Ir como clientes."),
 ("", ""),
 ("AJUSTE 2026-10-22 — META (verificado en fuentes oficiales)", ""),
 ("A0: dónde entrar", "developers.facebook.com → App Dashboard → tu app → WhatsApp → API Setup. Ahí Meta asigna un número de prueba sin verificación ni tarjeta (Carlos lo confirmó el 22-oct: funciona, máximo 5 destinatarios). NO entrar por Business Suite / WhatsApp Manager: ahí aparece el flujo de verificación con documentos."),
 ("A2: pregunta adicional (S-47)", "\"La cuenta de WhatsApp Business y el número quedan a nombre de su negocio; usted registra su tarjeta en Meta solo para el excedente sobre los 1 000 mensajes gratuitos al mes. ¿Está de acuerdo?\" → anotar sí/no."),
 ("A3 / A3t: cómo se instala", "Cuenta y número a nombre del cliente (chip nuevo, nunca registrado en WhatsApp); Carlos con rol de administrador en su negocio y en la app. Sin verificar el negocio: un bot que solo responde dentro de la ventana de 24 h no toca el límite de 250. Aceptar los términos de la Cloud API antes de enviar. Verificación con RUC: Etapa 2."),
 ("Webhook (paso 2 del panel)", "URL = dirección https del túnel terminada en /webhook; token = META_VERIFY_TOKEN del .env; luego suscribirse al campo 'messages'. No registrar el celular personal (Meta lo sacaría de WhatsApp). Si los mensajes reales no llegan con la app sin publicar, pasar la app a modo Live (política de privacidad)."),
]
for i, (a, b) in enumerate(g, 1):
    ca = ws.cell(row=i, column=1, value=a); cb = ws.cell(row=i, column=2, value=b)
    ca.font = fb if (a.isupper() or a.startswith(("GUION", "OFERTA", "CONTACTOS"))) else fn; cb.font = fn; ca.alignment = wrap; cb.alignment = wrap
    ws.row_dimensions[i].height = max(15, 15 * (len(b) // 105 + 1))

# ---------------------------------------------------------------- REGISTRO DE RESULTADOS
ws = wb.create_sheet("Registro de resultados")
widths_r = [26, 14, 12, 14, 30, 14, 14, 12, 12, 14, 12]
for i, w in enumerate(widths_r, 1): ws.column_dimensions[get_column_letter(i)].width = w
ws.cell(row=1, column=1, value="Registro de resultados — llenen las celdas amarillas. Las celdas 'Criterio' se calculan solas.").font = fb
sino = DataValidation(type="list", formula1='"Sí,No"', allow_blank=True); ws.add_data_validation(sino)
precio_dv = DataValidation(type="list", formula1='"0,50,100,150,200"', allow_blank=True); ws.add_data_validation(precio_dv)

# --- A1
r = 3
ws.cell(row=r, column=1, value="A1 — Entrevistas (una fila por entrevista)").font = fb; r += 1
hA1 = ["Contacto", "Entrevistador", "Fecha", "P1 mensajes/semana", "P2 preguntas repetidas y ventas perdidas/mes", "P3 pagaría S/ al mes", "P4 acepta piloto", "P4 fecha inicio", "P5 incógnito S/", "Cierre: factura", "Notas"]
for j, h in enumerate(hA1, 1):
    c = ws.cell(row=r, column=j, value=h); c.font = fh; c.fill = fill_h; c.alignment = wrap; c.border = border
a1_first = r + 1
contactos = ["Academia de marinera", "Librería (mamá de Indira)", "Agencia de contenido", "Galletas", "Cafetería de Carlos", "Local de Indira"]
for k, ctt in enumerate(contactos):
    rr = a1_first + k; ws.cell(row=rr, column=1, value=ctt)
    for j in range(2, 12):
        c = ws.cell(row=rr, column=j); c.fill = fill_in; c.border = border; c.font = fn
    ws.cell(row=rr, column=3).number_format = DATEFMT
    precio_dv.add(ws.cell(row=rr, column=6)); sino.add(ws.cell(row=rr, column=7)); sino.add(ws.cell(row=rr, column=10))
    ws.cell(row=rr, column=8).number_format = DATEFMT
a1_last = a1_first + len(contactos) - 1
r = a1_last + 1
P3 = f"F{a1_first}:F{a1_last}"; P4 = f"G{a1_first}:G{a1_last}"; P5 = f"I{a1_first}:I{a1_last}"; P1 = f"D{a1_first}:D{a1_last}"
res = [
 ("Entrevistas completas", f'=COUNTA({P3})'),
 ("Eligen ≥ S/ 80 al mes (P3)", f'=COUNTIF({P3},">=80")'),
 ("Dan fecha de piloto (P4 = Sí)", f'=COUNTIF({P4},"Sí")'),
 ("Nombran algún precio > 0 (P3)", f'=COUNTIF({P3},">0")'),
 ("Reciben < 1 000 mensajes/mes (P1 < 231/semana)", f'=COUNTIF({P1},"<231")'),
 ("Incógnito: pagarían ≥ S/ 100 (P5)", f'=COUNTIF({P5},">=100")'),
]
a1_res_first = r
for k, (lab, f) in enumerate(res):
    ws.cell(row=r + k, column=1, value=lab).font = fn; ws.cell(row=r + k, column=2, value=f).font = fb
rE80, rFecha, rPrecio, rMsg, rInc = r + 1, r + 2, r + 3, r + 4, r + 5
r += len(res)
ws.cell(row=r, column=1, value="CRITERIO A1").font = fb
ws.cell(row=r, column=2, value=f'=IF(B{a1_res_first}<5,"Faltan entrevistas (mínimo 5)",IF(AND(B{rE80}>=3,B{rFecha}>=1),"PASA → hacer A2",IF(B{rPrecio}=2,"REPETIR CON CAMBIO → A2 con módulo básico a S/ 50 → S/ 80","NO PASA → A2 no se hace; chatbot a banda 31-ene")))').font = fb
ws.cell(row=r, column=2).fill = fill_g; A1_CRIT = f"'Registro de resultados'!B{r}"
r += 1
ws.cell(row=r, column=1, value="Incógnito (reserva)").font = fn
ws.cell(row=r, column=2, value=f'=IF(B{a1_res_first}<5,"Pendiente",IF(B{rInc}>=2,"Sigue vivo en reserva","Se archiva"))').font = fb
r += 1
ws.cell(row=r, column=1, value="Costo variable del modelo (S-29)").font = fn
ws.cell(row=r, column=2, value=f'=IF(B{a1_res_first}<5,"Pendiente",IF(B{rMsg}>=4,"Se mantiene S/ 33,07","Recalcular S-29 con el volumen real"))').font = fb
r += 2

# --- A2
ws.cell(row=r, column=1, value="A2 — Pagos del piloto (una fila por cliente)").font = fb; r += 1
hA2 = ["Cliente", "Resultado de la demo", "Fecha de pago", "Monto pagado S/", "Fecha de inicio acordada", "Confirma mes 2 (S/ 150)", "Mensualidad acordada S/", "Notas", "Es familiar (no cuenta)"]
for j, h in enumerate(hA2, 1):
    c = ws.cell(row=r, column=j, value=h); c.font = fh; c.fill = fill_h; c.alignment = wrap; c.border = border
demo_dv = DataValidation(type="list", formula1='"Pagó,Sí cuando lo vea funcionando,No,Pendiente"', allow_blank=True); ws.add_data_validation(demo_dv)
a2_first = r + 1
for k in range(6):
    rr = a2_first + k
    for j in range(1, 10):
        c = ws.cell(row=rr, column=j); c.fill = fill_in; c.border = border; c.font = fn
    demo_dv.add(ws.cell(row=rr, column=2)); ws.cell(row=rr, column=3).number_format = DATEFMT; ws.cell(row=rr, column=5).number_format = DATEFMT
    sino.add(ws.cell(row=rr, column=6)); sino.add(ws.cell(row=rr, column=9))
a2_last = a2_first + 5; r = a2_last + 1
ws.cell(row=r, column=1, value="Pagos recibidos de no familiares").font = fn; ws.cell(row=r, column=2, value=f'=COUNTIFS(D{a2_first}:D{a2_last},">0",I{a2_first}:I{a2_last},"<>Sí")').font = fb; rPag = r; r += 1
ws.cell(row=r, column=1, value="S/ cobrados por adelantado").font = fn; ws.cell(row=r, column=2, value=f'=SUM(D{a2_first}:D{a2_last})').font = fb; rCobA = r; r += 1
ws.cell(row=r, column=1, value="Compromisos 'sí cuando lo vea'").font = fn; ws.cell(row=r, column=2, value=f'=COUNTIF(B{a2_first}:B{a2_last},"Sí cuando lo vea funcionando")').font = fb; rComp = r; r += 1
ws.cell(row=r, column=1, value="Clientes que confirman mes 2").font = fn; ws.cell(row=r, column=2, value=f'=COUNTIF(F{a2_first}:F{a2_last},"Sí")').font = fb; rM2 = r; r += 1
ws.cell(row=r, column=1, value="CRITERIO A2").font = fb
ws.cell(row=r, column=2, value=f'=IF(COUNTA(B{a2_first}:B{a2_last})=0,"Pendiente",IF(B{rPag}>=2,"PASA (escenario base) → A3",IF(B{rPag}=1,"PASA (escenario pesimista) → A3",IF(B{rComp}>=2,"REPETIR CON CAMBIO → ofrecer 14 días gratis a UNO, plazo 22-nov","NO PASA → no se construye nada"))))').font = fb
ws.cell(row=r, column=2).fill = fill_g; A2_CRIT = f"'Registro de resultados'!B{r}"; r += 2

# --- B1
ws.cell(row=r, column=1, value="B1 — Costeo de la caja real").font = fb; r += 1
for j, h in enumerate(["Ítem", "S/ real", "Dónde se compró / nota"], 1):
    c = ws.cell(row=r, column=j, value=h); c.font = fh; c.fill = fill_h; c.border = border
items = ["Caja rígida decorada", "Dulce envasado 1", "Dulce envasado 2", "Dulce envasado 3", "Dulce envasado 4 (opcional)", "Peluche pequeño o flor", "Tarjeta", "Globo", "Papel y cinta", "Motorizado Lima Norte (menor de 3 cotizaciones)"]
b1_first = r + 1
for k, it in enumerate(items):
    rr = b1_first + k; ws.cell(row=rr, column=1, value=it).font = fn
    for j in (2, 3):
        c = ws.cell(row=rr, column=j); c.fill = fill_in; c.border = border; c.font = fn
b1_last = b1_first + len(items) - 1; r = b1_last + 1
ws.cell(row=r, column=1, value="COSTO TOTAL POR PEDIDO").font = fb; ws.cell(row=r, column=2, value=f"=SUM(B{b1_first}:B{b1_last})").font = fb; rCostB1 = r; r += 1
ws.cell(row=r, column=1, value="Motorizado Lima Norte (S/)").font = fn; ws.cell(row=r, column=2, value=f"=B{b1_last}").font = fb; rMoto = r; r += 1
ws.cell(row=r, column=1, value="Motorizado Lima centro-sur (S/)").font = fn; c = ws.cell(row=r, column=2); c.fill = fill_in; c.border = border; r += 1
ws.cell(row=r, column=1, value="Minutos de armado").font = fn; c = ws.cell(row=r, column=2); c.fill = fill_in; c.border = border; rMin = r; r += 1
ws.cell(row=r, column=1, value="Competidores en Instagram (5): cuenta → precio S/").font = fb; r += 1
comp_first = r
for k in range(5):
    rr = comp_first + k; ws.cell(row=rr, column=1, value=f"Cuenta {k+1}").font = fn
    for j in (2, 3):
        c = ws.cell(row=rr, column=j); c.fill = fill_in; c.border = border; c.font = fn
ws.cell(row=comp_first - 1, column=2, value="Precio S/").font = fb; ws.cell(row=comp_first - 1, column=3, value="Cuenta y producto").font = fb
comp_last = comp_first + 4; r = comp_last + 1
ws.cell(row=r, column=1, value="Competidores entre S/ 60 y S/ 100").font = fn; ws.cell(row=r, column=2, value=f'=COUNTIFS(B{comp_first}:B{comp_last},">=60",B{comp_first}:B{comp_last},"<=100")').font = fb; rComp60 = r; r += 1
ws.cell(row=r, column=1, value="CRITERIO B1").font = fb
ws.cell(row=r, column=2, value=f'=IF(B{rCostB1}=0,"Pendiente",IF(AND(B{rCostB1}<=40,B{rComp60}>=3,B{rMin}<=60,B{rMoto}<=20),"PASA → preventa a S/ 80 / S/ 95",IF(AND(B{rCostB1}>40,B{rCostB1}<=50,B{rMoto}<=20),"REPETIR CON CAMBIO → preventa a S/ 95 / S/ 110 (verificar ≥ 3 competidores en ese rango)","NO PASA → B2 y B3 no se hacen; B se descarta")))').font = fb
ws.cell(row=r, column=2).fill = fill_g; B1_CRIT = f"'Registro de resultados'!B{r}"; r += 2

# --- B2
ws.cell(row=r, column=1, value="B2 — Pedidos de la preventa (una fila por pedido; solo cuenta con Yape/Plin recibido)").font = fb; r += 1
hB2 = ["Cliente", "Fecha pedido", "Zona (LN / resto)", "Precio cobrado S/", "Pagó adelantado", "Fuera del círculo cercano", "Pidió descuento", "Fecha de entrega", "Costo real S/", "Minutos armado+coordinación", "Notas"]
for j, h in enumerate(hB2, 1):
    c = ws.cell(row=r, column=j, value=h); c.font = fh; c.fill = fill_h; c.alignment = wrap; c.border = border
b2_first = r + 1
for k in range(12):
    rr = b2_first + k
    for j in range(1, 12):
        c = ws.cell(row=rr, column=j); c.fill = fill_in; c.border = border; c.font = fn
    ws.cell(row=rr, column=2).number_format = DATEFMT; ws.cell(row=rr, column=8).number_format = DATEFMT
    for j in (5, 6, 7): sino.add(ws.cell(row=rr, column=j))
b2_last = b2_first + 11; r = b2_last + 1
ws.cell(row=r, column=1, value="Pedidos pagados").font = fn; ws.cell(row=r, column=2, value=f'=COUNTIF(E{b2_first}:E{b2_last},"Sí")').font = fb; rPed = r; r += 1
ws.cell(row=r, column=1, value="S/ cobrados").font = fn; ws.cell(row=r, column=2, value=f'=SUMIF(E{b2_first}:E{b2_last},"Sí",D{b2_first}:D{b2_last})').font = fb; rCobB = r; r += 1
ws.cell(row=r, column=1, value="Pedidos de fuera del círculo cercano").font = fn; ws.cell(row=r, column=2, value=f'=COUNTIFS(E{b2_first}:E{b2_last},"Sí",F{b2_first}:F{b2_last},"Sí")').font = fb; rFuera = r; r += 1
ws.cell(row=r, column=1, value="Pagaron sin pedir descuento").font = fn; ws.cell(row=r, column=2, value=f'=COUNTIFS(E{b2_first}:E{b2_last},"Sí",G{b2_first}:G{b2_last},"No")').font = fb; rSinD = r; r += 1
ws.cell(row=r, column=1, value="Costo real total (S/)").font = fn; ws.cell(row=r, column=2, value=f'=SUMIF(E{b2_first}:E{b2_last},"Sí",I{b2_first}:I{b2_last})').font = fb; rCostB = r; r += 1
ws.cell(row=r, column=1, value="Costo real promedio por pedido (S/)").font = fn; ws.cell(row=r, column=2, value=f'=IF(B{rPed}=0,0,B{rCostB}/B{rPed})').font = fb; r += 1
ws.cell(row=r, column=1, value="Minutos promedio por pedido").font = fn; ws.cell(row=r, column=2, value=f'=IF(B{rPed}=0,0,SUMIF(E{b2_first}:E{b2_last},"Sí",J{b2_first}:J{b2_last})/B{rPed})').font = fb; r += 1
ws.cell(row=r, column=1, value="CRITERIO B2").font = fb
ws.cell(row=r, column=2, value=f'=IF(B{rPed}=0,"Pendiente",IF(AND(B{rPed}>=6,B{rFuera}>=2,B{rSinD}/B{rPed}>=0.6),"PASA → B4 y desempate",IF(B{rPed}>=4,"REPETIR CON CAMBIO → extender al 22-nov con segunda foto y variante","NO PASA → B se descarta; lo cobrado se entrega igual")))').font = fb
ws.cell(row=r, column=2).fill = fill_g; B2_CRIT = f"'Registro de resultados'!B{r}"; r += 2

# --- B3
ws.cell(row=r, column=1, value="B3 — Anuncio mínimo").font = fb; r += 1
for lab in ["Consultas por WhatsApp atribuibles al anuncio", "Gasto real del anuncio (S/)", "Pedidos pagados de desconocidos por el anuncio"]:
    ws.cell(row=r, column=1, value=lab).font = fn; c = ws.cell(row=r, column=2); c.fill = fill_in; c.border = border; r += 1
rCons, rGasto, rPedAn = r - 3, r - 2, r - 1
ws.cell(row=r, column=1, value="Costo por consulta (S/)").font = fn; ws.cell(row=r, column=2, value=f"=IF(B{rCons}=0,0,B{rGasto}/B{rCons})").font = fb; rCPC = r; r += 1
ws.cell(row=r, column=1, value="CRITERIO B3").font = fb
ws.cell(row=r, column=2, value=f'=IF(B{rGasto}=0,"Pendiente o no aplica",IF(AND(B{rCons}>=5,B{rCPC}<=8,B{rPedAn}>=1),"PASA → B puede crecer fuera del círculo","NO PASA → B queda como demanda solo de conocidos; crecimiento 0 % en Etapa 2"))').font = fb
ws.cell(row=r, column=2).fill = fill_g; B3_CRIT = f"'Registro de resultados'!B{r}"
REG = "'Registro de resultados'"

# ---------------------------------------------------------------- DESEMPATE
ws = wb.create_sheet("Desempate")
ws.column_dimensions["A"].width = 58; ws.column_dimensions["B"].width = 18; ws.column_dimensions["C"].width = 60
ws.cell(row=1, column=1, value="Desempate — margen real por hora a 3 meses (MRH). Regla fijada el 2026-10-21, aceptada por los socios el 2026-10-22.").font = fb
ws.cell(row=2, column=1, value="Las celdas amarillas se llenan el viernes 20-nov con los registros reales. Lo demás se calcula. La versión oficial del cálculo vive en finanzas/modelo.py (--desempate); esta hoja debe dar lo mismo.").font = fn
rows_d = [
 ("A — CHATBOT", None, None),
 ("S/ cobrados por adelantado (de Registro A2)", f"={REG}!B{rCobA}", "fórmula"),
 ("Costos directos reales del piloto: chip + Meta + IA + hosting (S/)", None, "llenar"),
 ("Clientes que confirman seguir el mes 2 (de Registro A2)", f"={REG}!B{rM2}", "fórmula"),
 ("Mensualidad acordada por escrito (S/)", 150, "llenar si cambió; plan: 150"),
 ("Costo variable modelado por cliente al mes (S-29)", 33.07, "fijo del modelo"),
 ("Horas reales A0 + A1 + A2 (de 'A Chatbot', pasos A0-1 a A2-4, Carlos + Indira)", f"=SUM('A Chatbot'!M3:N{3+15-1})", "fórmula"),
 ("Horas reales de construcción: piloto técnico A3t + réplica A3 (si no terminó: 30)", None, "llenar"),
 ("Horas de operación: 2 h × clientes × 2 meses", None, "fórmula"),
 ("Margen A a 3 meses (S/)", None, "fórmula"),
 ("Horas A", None, "fórmula"),
 ("MRH A (S/ por hora)", None, "fórmula"),
 ("", None, None),
 ("B — DETALLES", None, None),
 ("S/ cobrados por adelantado (de Registro B2)", f"={REG}!B{rCobB}", "fórmula"),
 ("Costos reales de insumos, empaque y motorizado de esos pedidos (de Registro B2)", f"={REG}!B{rCostB}", "fórmula"),
 ("Horas reales B1 + B2 + B3 + B4 (de 'B Detalles', Carlos + Indira)", f"=SUM('B Detalles'!M3:N{3+12-1})", "fórmula"),
 ("Margen B (S/)", None, "fórmula"),
 ("MRH B (S/ por hora)", None, "fórmula"),
 ("", None, None),
 ("RESULTADO", None, None),
 ("¿A pasó A2?", f"={A2_CRIT}", "fórmula"),
 ("¿B pasó B2?", f"={B2_CRIT}", "fórmula"),
 ("Recomendación de la agencia", None, "fórmula"),
 ("Secundaria: % de soles de B cobrados fuera del círculo cercano", None, "se reporta, no decide"),
]
for i, (a, b, c) in enumerate(rows_d, 4):
    ca = ws.cell(row=i, column=1, value=a); ca.font = fb if (a.isupper() or a.startswith(("A —", "B —"))) else fn
    cb = ws.cell(row=i, column=2, value=b); cb.font = fn; cb.border = border
    if c == "llenar" or (c and c.startswith("llenar")): cb.fill = fill_in
    cc = ws.cell(row=i, column=3, value=c); cc.font = fn
# índices de filas
base = 4
R = {lab: base + k for k, (lab, _, _) in enumerate(rows_d)}
rA_cob = R["S/ cobrados por adelantado (de Registro A2)"]; rA_cost = R["Costos directos reales del piloto: chip + Meta + IA + hosting (S/)"]
rA_m2 = R["Clientes que confirman seguir el mes 2 (de Registro A2)"]; rA_mens = R["Mensualidad acordada por escrito (S/)"]; rA_cv = R["Costo variable modelado por cliente al mes (S-29)"]
rA_h012 = R["Horas reales A0 + A1 + A2 (de 'A Chatbot', pasos A0-1 a A2-4, Carlos + Indira)"]; rA_h3 = R["Horas reales de construcción: piloto técnico A3t + réplica A3 (si no terminó: 30)"]
rA_hop = R["Horas de operación: 2 h × clientes × 2 meses"]; rA_marg = R["Margen A a 3 meses (S/)"]; rA_h = R["Horas A"]; rA_mrh = R["MRH A (S/ por hora)"]
rB_cob = R["S/ cobrados por adelantado (de Registro B2)"]; rB_cost = R["Costos reales de insumos, empaque y motorizado de esos pedidos (de Registro B2)"]
rB_h = R["Horas reales B1 + B2 + B3 + B4 (de 'B Detalles', Carlos + Indira)"]; rB_marg = R["Margen B (S/)"]; rB_mrh = R["MRH B (S/ por hora)"]
rPA = R["¿A pasó A2?"]; rPB = R["¿B pasó B2?"]; rRec = R["Recomendación de la agencia"]; rSec = R["Secundaria: % de soles de B cobrados fuera del círculo cercano"]
ws.cell(row=rA_hop, column=2, value=f"=2*B{rA_m2}*2")
ws.cell(row=rA_marg, column=2, value=f"=B{rA_cob}-B{rA_cost}+2*(B{rA_mens}-B{rA_cv})*B{rA_m2}")
ws.cell(row=rA_h, column=2, value=f"=B{rA_h012}+IF(B{rA_h3}=\"\",30,B{rA_h3})+B{rA_hop}")
ws.cell(row=rA_mrh, column=2, value=f"=IF(B{rA_h}=0,0,B{rA_marg}/B{rA_h})")
ws.cell(row=rB_marg, column=2, value=f"=B{rB_cob}-B{rB_cost}")
ws.cell(row=rB_mrh, column=2, value=f"=IF(B{rB_h}=0,0,B{rB_marg}/B{rB_h})")
ws.cell(row=rRec, column=2, value=f'=IF(OR(B{rPA}="Pendiente",B{rPB}="Pendiente"),"Pendiente: faltan resultados",IF(AND(LEFT(B{rPA},4)="PASA",LEFT(B{rPB},4)="PASA"),IF(ABS(B{rA_mrh}-B{rB_mrh})<0.2*MAX(B{rA_mrh},B{rB_mrh}),"A (chatbot): diferencia < 20 %, gana la recurrencia",IF(B{rA_mrh}>B{rB_mrh},"A (chatbot): mayor margen por hora","B (detalles): mayor margen por hora")),IF(LEFT(B{rPA},4)="PASA","A (chatbot): la única que pasó",IF(LEFT(B{rPB},4)="PASA","B (detalles): la única que pasó","Ninguna pasó → volver a Fase 3 (incógnito o taller)"))))')
ws.cell(row=rRec, column=2).font = fb; ws.cell(row=rRec, column=2).fill = fill_g
ws.cell(row=rSec, column=2, value=f'=IF({REG}!B{rCobB}=0,0,SUMIFS({REG}!D{b2_first}:D{b2_last},{REG}!E{b2_first}:E{b2_last},"Sí",{REG}!F{b2_first}:F{b2_last},"Sí")/{REG}!B{rCobB})')
ws.cell(row=rSec, column=2).number_format = "0%"
for rr in (rA_mrh, rB_mrh, rA_marg, rB_marg): ws.cell(row=rr, column=2).number_format = '"S/ "#,##0.00'
ws.cell(row=rRec + 3, column=1, value="Ilustración del plan (solo escala, no es dato): A con 1 piloto y 30 h ≈ S/ 6/h; A con 2 pilotos ≈ S/ 10/h; B con 6 pedidos a costo S/ 40 ≈ S/ 10/h. El desempate está abierto.").font = fn

# fuente Arial en todo
for sh in wb.worksheets:
    for row in sh.iter_rows():
        for c in row:
            if c.value is not None and (c.font is None or c.font.name != F):
                c.font = Font(name=F, size=c.font.size or 10, bold=c.font.bold, color=c.font.color)
wb.move_sheet("Calendario", offset=0)
wb.save("entregables/plan-de-validacion.xlsx")  # ejecutar desde la raíz del repositorio
print("ok", [s.title for s in wb.worksheets])
