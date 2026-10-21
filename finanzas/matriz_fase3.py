# Matriz ponderada Fase 3 — puntajes 1–5 por criterio (justificación en el entregable), pesos de la Fase 1.
pesos = {"demanda":20,"tiempo":15,"ventaja":15,"inversion_riesgo":15,"horas":10,"margen":10,"sueldo":10,"interes":5}
ideas = {
 "1. Chatbot WhatsApp + panel":      {"demanda":3,"tiempo":2,"ventaja":5,"inversion_riesgo":4,"horas":2,"margen":5,"sueldo":5,"interes":4},
 "2. Cliente incógnito + micro-cap.": {"demanda":2,"tiempo":4,"ventaja":4,"inversion_riesgo":5,"horas":4,"margen":4,"sueldo":3,"interes":3},
 "3. Taller construye tu app con IA":{"demanda":3,"tiempo":4,"ventaja":4,"inversion_riesgo":3,"horas":3,"margen":5,"sueldo":3,"interes":3},
 "4. Sorpresas y detalles":          {"demanda":5,"tiempo":5,"ventaja":1,"inversion_riesgo":3,"horas":3,"margen":2,"sueldo":1,"interes":4},
 "5. Decoración para eventos":       {"demanda":3,"tiempo":3,"ventaja":1,"inversion_riesgo":1,"horas":2,"margen":3,"sueldo":1,"interes":4},
}
def puntaje(p, s): return sum(s[c]*p[c] for c in p)/sum(p.values())*20  # escala 0–100
def ranking(p): return sorted(ideas, key=lambda i: -puntaje(p, ideas[i]))
base = {i: round(puntaje(pesos, s),1) for i,s in ideas.items()}
print("BASE"); [print(f"  {i:<36} {base[i]:>5}") for i in ranking(pesos)]
print("\nSENSIBILIDAD DE PESOS (ranking resultante; cambios de ±5 compensados y eliminación de un criterio)")
escenarios = {}
for c in pesos:
    for d in (+5, -5):
        p = dict(pesos); p[c] = max(0, p[c]+d)
        # compensar con el criterio de mayor peso distinto de c
        otro = "demanda" if c != "demanda" else "tiempo"; p[otro] -= d
        escenarios[f"{c} {d:+d} (compensado en {otro})"] = p
    p = dict(pesos); p[c] = 0; escenarios[f"sin {c}"] = p
for nombre, p in escenarios.items():
    r = ranking(p); sc = {i: round(puntaje(p, ideas[i]),1) for i in ideas}
    print(f"  {nombre:<40} → " + " > ".join(f"{i[:2]}({sc[i]})" for i in r))
# Interés de Indira: si prefiere fuertemente 4 (5 pts) y da 1 a las de la agencia
p = dict(pesos); alt = {k: dict(v) for k,v in ideas.items()}
alt["4. Sorpresas y detalles"]["interes"]=5; alt["2. Cliente incógnito + micro-cap."]["interes"]=2; alt["3. Taller construye tu app con IA"]["interes"]=2
print("\nSi Indira prefiere fuertemente la 4 y rechaza 2 y 3:")
for i in sorted(alt, key=lambda i: -puntaje(p, alt[i])): print(f"  {i:<36} {round(puntaje(p, alt[i]),1):>5}")
