#!/usr/bin/env python3
"""
Modelo financiero de la agencia — cálculos reproducibles.

Uso:
  python3 finanzas/modelo.py                 # informe completo de cada idea en IDEAS
  python3 finanzas/modelo.py --comparar      # tabla comparativa (mismo método para todas)
  python3 finanzas/modelo.py --xlsx          # regenera finanzas/modelo.xlsx con fórmulas
  python3 finanzas/modelo.py --json          # resultados en JSON (para otros informes)
  python3 finanzas/modelo.py --idea "Nombre" # solo una idea

Reglas (ver CLAUDE.md y .claude/agents/analista-financiero.md):
  * Nadie hace aritmética "de memoria": toda cifra de un informe sale de este script.
  * Cada entrada lleva `origen`: "VERIFICADO: fuente, fecha" | "ESTIMADO: método"
    | "SUPUESTO: por validar" | "DESCONOCIDO". El valor "EJEMPLO" solo es válido
    mientras ES_EJEMPLO = True.
  * Los valores de abajo son DE EJEMPLO. Antes del análisis real: borrar las ideas de
    ejemplo, cargar las reales con su origen y poner ES_EJEMPLO = False. El script se
    niega a correr con ES_EJEMPLO = False si queda alguna entrada con origen EJEMPLO.
  * Las proyecciones son escenarios, no predicciones. La sección de sensibilidad dice
    qué entrada mueve más el resultado.
Montos en soles (S/). Meses: 12.
"""
from __future__ import annotations

import argparse
import json
import math
import sys
from dataclasses import dataclass, field, asdict

MESES = 12
ETIQUETAS_VALIDAS = ("VERIFICADO", "ESTIMADO", "SUPUESTO", "DESCONOCIDO")

# =============================================================================
# 1. ESTRUCTURAS
# =============================================================================


@dataclass
class Entrada:
    """Una cifra de entrada con su etiqueta de origen."""

    valor: float
    origen: str
    nota: str = ""

    def etiqueta(self) -> str:
        return self.origen.split(":")[0].strip().upper()


@dataclass
class Escenario:
    nombre: str
    unidades_mes1: Entrada  # unidades vendidas en el mes 1
    crecimiento_mensual: Entrada  # fracción, ej. 0.10 = +10 % por mes
    factor_precio: Entrada  # 1.0 = precio de lista; 0.9 = 10 % de descuento efectivo


@dataclass
class Idea:
    nombre: str
    unidad: str  # qué es "una unidad": una suscripción mensual, un kit, un servicio
    precio_venta: Entrada  # precio al cliente, con IGV incluido si igv_aplica
    igv_aplica: bool
    tasa_igv: Entrada
    tasa_pasarela: Entrada  # comisión % de la pasarela sobre el monto cobrado
    fijo_pasarela: Entrada  # S/ fijo por transacción
    tasa_impuesto_renta: Entrada  # % sobre ingreso neto (según régimen que indique legal)
    inversion_inicial: dict[str, Entrada]
    costos_fijos_mensuales: dict[str, Entrada]
    costo_variable_unitario: dict[str, Entrada]  # insumos, envío, IA/tokens, servidor por unidad
    escenarios: dict[str, Escenario]
    horas_semana_requeridas: Entrada  # para el encaje con las horas reales
    notas: str = ""

    def entradas(self):
        """Itera (ruta, Entrada) para validación."""
        for k in ("precio_venta", "tasa_igv", "tasa_pasarela", "fijo_pasarela",
                  "tasa_impuesto_renta", "horas_semana_requeridas"):
            yield k, getattr(self, k)
        for grupo in ("inversion_inicial", "costos_fijos_mensuales", "costo_variable_unitario"):
            for k, e in getattr(self, grupo).items():
                yield f"{grupo}.{k}", e
        for nombre, esc in self.escenarios.items():
            yield f"escenarios.{nombre}.unidades_mes1", esc.unidades_mes1
            yield f"escenarios.{nombre}.crecimiento_mensual", esc.crecimiento_mensual
            yield f"escenarios.{nombre}.factor_precio", esc.factor_precio


def E(valor: float, origen: str = "EJEMPLO", nota: str = "") -> Entrada:
    return Entrada(valor, origen, nota)


def escenarios_estandar(pes: tuple, base: tuple, opt: tuple, origen: str = "EJEMPLO") -> dict[str, Escenario]:
    """Cada tupla: (unidades_mes1, crecimiento_mensual, factor_precio)."""
    out = {}
    for nombre, (u, g, f) in (("pesimista", pes), ("base", base), ("optimista", opt)):
        out[nombre] = Escenario(nombre, E(u, origen), E(g, origen), E(f, origen))
    return out


# =============================================================================
# 2. ENTRADAS  —  VALORES DE EJEMPLO. BORRAR ANTES DEL ANÁLISIS REAL.
# =============================================================================
ES_EJEMPLO = True  # <- poner False cuando las ideas de abajo sean reales y con origen

IDEAS: list[Idea] = [
    Idea(
        nombre="EJEMPLO A — app por suscripción",
        unidad="una suscripción mensual",
        precio_venta=E(29.90, "EJEMPLO", "precio mensual con IGV incluido"),
        igv_aplica=True,
        tasa_igv=E(0.18, "EJEMPLO", "confirmar con asesor-legal-tributario-peru"),
        tasa_pasarela=E(0.0399, "EJEMPLO", "comisión % de la pasarela; verificar tarifa real"),
        fijo_pasarela=E(1.00, "EJEMPLO", "S/ fijo por transacción; verificar tarifa real"),
        tasa_impuesto_renta=E(0.015, "EJEMPLO", "p. ej. RER 1,5 % del ingreso neto; lo define legal"),
        inversion_inicial={
            "diseño y marca": E(800, "EJEMPLO"),
            "cuenta de desarrollador / tienda de apps": E(400, "EJEMPLO"),
            "formalización (RUC, registro de marca)": E(600, "EJEMPLO"),
        },
        costos_fijos_mensuales={
            "servidor y dominio": E(120, "EJEMPLO"),
            "herramientas (correo, analítica)": E(60, "EJEMPLO"),
            "contador": E(150, "EJEMPLO"),
        },
        costo_variable_unitario={
            "IA / tokens por suscriptor": E(2.50, "EJEMPLO"),
            "soporte y almacenamiento por suscriptor": E(0.80, "EJEMPLO"),
        },
        escenarios=escenarios_estandar(
            pes=(20, 0.05, 1.0),
            base=(40, 0.12, 1.0),
            opt=(70, 0.20, 1.0),
        ),
        horas_semana_requeridas=E(10, "EJEMPLO"),
        notas="Idea ficticia para probar el script. No describe ningún negocio real.",
    ),
    Idea(
        nombre="EJEMPLO B — producto físico",
        unidad="un kit vendido",
        precio_venta=E(79.00, "EJEMPLO", "precio con IGV incluido"),
        igv_aplica=True,
        tasa_igv=E(0.18, "EJEMPLO"),
        tasa_pasarela=E(0.0399, "EJEMPLO"),
        fijo_pasarela=E(1.00, "EJEMPLO"),
        tasa_impuesto_renta=E(0.015, "EJEMPLO"),
        inversion_inicial={
            "stock inicial": E(3000, "EJEMPLO"),
            "empaque y etiquetas": E(500, "EJEMPLO"),
            "fotos y web": E(700, "EJEMPLO"),
            "formalización": E(600, "EJEMPLO"),
        },
        costos_fijos_mensuales={
            "web y herramientas": E(90, "EJEMPLO"),
            "contador": E(150, "EJEMPLO"),
            "publicidad base": E(300, "EJEMPLO"),
        },
        costo_variable_unitario={
            "costo del producto": E(32.00, "EJEMPLO"),
            "empaque": E(3.00, "EJEMPLO"),
            "envío en Lima": E(10.00, "EJEMPLO"),
        },
        escenarios=escenarios_estandar(
            pes=(25, 0.03, 0.9),
            base=(45, 0.08, 1.0),
            opt=(80, 0.12, 1.0),
        ),
        horas_semana_requeridas=E(14, "EJEMPLO"),
        notas="Idea ficticia para probar el script. No describe ningún negocio real.",
    ),
]


# =============================================================================
# 3. VALIDACIÓN
# =============================================================================


def validar(ideas: list[Idea]) -> list[str]:
    errores = []
    for idea in ideas:
        for ruta, e in idea.entradas():
            etq = e.etiqueta()
            if etq == "EJEMPLO":
                if not ES_EJEMPLO:
                    errores.append(f"[{idea.nombre}] {ruta}: origen EJEMPLO con ES_EJEMPLO = False")
            elif etq not in ETIQUETAS_VALIDAS:
                errores.append(f"[{idea.nombre}] {ruta}: origen inválido '{e.origen}' "
                               f"(usar VERIFICADO/ESTIMADO/SUPUESTO/DESCONOCIDO)")
        if set(idea.escenarios) != {"pesimista", "base", "optimista"}:
            errores.append(f"[{idea.nombre}] los escenarios deben ser pesimista, base y optimista")
    return errores


# =============================================================================
# 4. CÁLCULOS
# =============================================================================


def economia_unitaria(idea: Idea, factor_precio: float = 1.0) -> dict:
    precio = idea.precio_venta.valor * factor_precio
    ingreso_neto = precio / (1 + idea.tasa_igv.valor) if idea.igv_aplica else precio
    comision = precio * idea.tasa_pasarela.valor + idea.fijo_pasarela.valor
    impuesto = ingreso_neto * idea.tasa_impuesto_renta.valor
    cv_directo = sum(e.valor for e in idea.costo_variable_unitario.values())
    cv_total = cv_directo + comision + impuesto
    margen = ingreso_neto - cv_total
    fijos = sum(e.valor for e in idea.costos_fijos_mensuales.values())
    pe_unid = fijos / margen if margen > 0 else math.inf
    return {
        "precio": precio,
        "ingreso_neto_unitario": ingreso_neto,
        "comision_pasarela": comision,
        "impuesto_renta_unitario": impuesto,
        "costo_variable_directo": cv_directo,
        "costo_variable_total": cv_total,
        "margen_unitario": margen,
        "margen_pct_sobre_ingreso_neto": (margen / ingreso_neto) if ingreso_neto else 0.0,
        "costos_fijos_mensuales": fijos,
        "punto_equilibrio_unidades_mes": pe_unid,
        "punto_equilibrio_soles_mes": pe_unid * precio if math.isfinite(pe_unid) else math.inf,
    }


def inversion_total(idea: Idea) -> float:
    return sum(e.valor for e in idea.inversion_inicial.values())


def flujo_12_meses(idea: Idea, esc: Escenario) -> dict:
    eu = economia_unitaria(idea, esc.factor_precio.valor)
    inv = inversion_total(idea)
    u1, g = esc.unidades_mes1.valor, esc.crecimiento_mensual.valor
    meses, acum, recuperacion = [], -inv, None
    for m in range(1, MESES + 1):
        u = u1 * (1 + g) ** (m - 1)
        ingresos = u * eu["ingreso_neto_unitario"]
        variables = u * eu["costo_variable_total"]
        neto = ingresos - variables - eu["costos_fijos_mensuales"]
        acum += neto
        if recuperacion is None and acum >= 0:
            recuperacion = m
        meses.append({"mes": m, "unidades": u, "ingresos_netos": ingresos,
                      "costos_variables": variables, "costos_fijos": eu["costos_fijos_mensuales"],
                      "flujo_neto": neto, "acumulado": acum})
    return {
        "escenario": esc.nombre,
        "economia_unitaria": eu,
        "inversion_inicial": inv,
        "meses": meses,
        "unidades_12m": sum(x["unidades"] for x in meses),
        "ingresos_netos_12m": sum(x["ingresos_netos"] for x in meses),
        "resultado_12m_tras_inversion": acum,
        "mes_recuperacion": recuperacion,  # None = no se recupera en 12 meses
        "peor_acumulado": min(x["acumulado"] for x in meses + [{"acumulado": -inv}]),
    }


def resultado_12m(idea: Idea, esc: Escenario, **override) -> float:
    """Resultado acumulado a 12 meses (tras inversión) con entradas sobreescritas.
    Claves de override: precio, cv_directo, fijos, inversion, unidades_mes1, crecimiento,
    tasa_pasarela, tasa_impuesto_renta. Se usa para la sensibilidad."""
    precio = override.get("precio", idea.precio_venta.valor) * esc.factor_precio.valor
    ingreso_neto = precio / (1 + idea.tasa_igv.valor) if idea.igv_aplica else precio
    comision = precio * override.get("tasa_pasarela", idea.tasa_pasarela.valor) + idea.fijo_pasarela.valor
    impuesto = ingreso_neto * override.get("tasa_impuesto_renta", idea.tasa_impuesto_renta.valor)
    cv_directo = override.get("cv_directo", sum(e.valor for e in idea.costo_variable_unitario.values()))
    margen = ingreso_neto - (cv_directo + comision + impuesto)
    fijos = override.get("fijos", sum(e.valor for e in idea.costos_fijos_mensuales.values()))
    inv = override.get("inversion", inversion_total(idea))
    u1 = override.get("unidades_mes1", esc.unidades_mes1.valor)
    g = override.get("crecimiento", esc.crecimiento_mensual.valor)
    unidades = MESES * u1 if g == 0 else u1 * ((1 + g) ** MESES - 1) / g
    return unidades * margen - MESES * fijos - inv


def sensibilidad(idea: Idea, variacion: float = 0.20) -> list[dict]:
    """Una variable a la vez, ±variacion, sobre el escenario base. Ordenada por impacto."""
    esc = idea.escenarios["base"]
    base = resultado_12m(idea, esc)
    variables = {
        "precio": idea.precio_venta.valor,
        "unidades_mes1": esc.unidades_mes1.valor,
        "crecimiento": esc.crecimiento_mensual.valor,
        "cv_directo": sum(e.valor for e in idea.costo_variable_unitario.values()),
        "fijos": sum(e.valor for e in idea.costos_fijos_mensuales.values()),
        "inversion": inversion_total(idea),
        "tasa_pasarela": idea.tasa_pasarela.valor,
        "tasa_impuesto_renta": idea.tasa_impuesto_renta.valor,
    }
    filas = []
    for k, v in variables.items():
        menos = resultado_12m(idea, esc, **{k: v * (1 - variacion)})
        mas = resultado_12m(idea, esc, **{k: v * (1 + variacion)})
        filas.append({"variable": k, "valor_base": v, "resultado_base": base,
                      f"resultado_-{int(variacion*100)}%": menos,
                      f"resultado_+{int(variacion*100)}%": mas,
                      "rango": abs(mas - menos)})
    filas.sort(key=lambda f: f["rango"], reverse=True)
    return filas


def evaluar(idea: Idea) -> dict:
    return {
        "nombre": idea.nombre,
        "unidad": idea.unidad,
        "inversion_inicial": inversion_total(idea),
        "economia_unitaria": economia_unitaria(idea),
        "escenarios": {n: flujo_12_meses(idea, esc) for n, esc in idea.escenarios.items()},
        "sensibilidad": sensibilidad(idea),
        "horas_semana_requeridas": idea.horas_semana_requeridas.valor,
    }


# =============================================================================
# 5. SALIDA EN TEXTO
# =============================================================================


def s(x: float) -> str:
    if x is None:
        return "—"
    if isinstance(x, float) and not math.isfinite(x):
        return "no alcanzable"
    return f"S/ {x:,.0f}" if abs(x) >= 100 else f"S/ {x:,.2f}"


def banner() -> str:
    if ES_EJEMPLO:
        return ("\n" + "!" * 78 + "\n!!  VALORES DE EJEMPLO. No describen ningún negocio real.\n"
                "!!  Borrar las ideas de ejemplo y poner ES_EJEMPLO = False antes del análisis real.\n"
                + "!" * 78 + "\n")
    return ""


def imprimir_idea(idea: Idea, r: dict) -> None:
    eu = r["economia_unitaria"]
    print(f"\n=== {idea.nombre} ===")
    print(f"Unidad: {idea.unidad}. Horas/semana requeridas: {r['horas_semana_requeridas']:.0f} "
          f"[{idea.horas_semana_requeridas.origen}]")
    print("\nEntradas (valor · origen):")
    for ruta, e in idea.entradas():
        print(f"  {ruta:<55} {e.valor:>12,.4g}  [{e.origen}]")
    print("\nEconomía unitaria (precio de lista):")
    print(f"  Precio al cliente              {s(eu['precio'])}")
    print(f"  Ingreso neto (sin IGV)         {s(eu['ingreso_neto_unitario'])}")
    print(f"  Comisión pasarela              {s(eu['comision_pasarela'])}")
    print(f"  Impuesto a la renta            {s(eu['impuesto_renta_unitario'])}")
    print(f"  Costo variable directo         {s(eu['costo_variable_directo'])}")
    print(f"  Costo variable total           {s(eu['costo_variable_total'])}")
    print(f"  Margen por unidad              {s(eu['margen_unitario'])}  "
          f"({eu['margen_pct_sobre_ingreso_neto']*100:.1f} % del ingreso neto)")
    print(f"  Costos fijos mensuales         {s(eu['costos_fijos_mensuales'])}")
    pe = eu["punto_equilibrio_unidades_mes"]
    print(f"  Punto de equilibrio            {pe:.1f} unidades/mes" if math.isfinite(pe)
          else "  Punto de equilibrio            no alcanzable (margen <= 0)")
    print(f"  Inversión inicial              {s(r['inversion_inicial'])}")
    print("\nFlujo de caja a 12 meses (escenarios, no predicciones):")
    print(f"  {'escenario':<10} {'unid. 12m':>10} {'ingresos 12m':>14} {'resultado 12m':>15} "
          f"{'recupera en':>12} {'peor caja':>12}")
    for n, f in r["escenarios"].items():
        rec = f"mes {f['mes_recuperacion']}" if f["mes_recuperacion"] else "no en 12 m"
        print(f"  {n:<10} {f['unidades_12m']:>10,.0f} {s(f['ingresos_netos_12m']):>14} "
              f"{s(f['resultado_12m_tras_inversion']):>15} {rec:>12} {s(f['peor_acumulado']):>12}")
    print("\nFlujo mensual — escenario base:")
    print(f"  {'mes':>3} {'unid.':>8} {'ingresos':>12} {'variables':>12} {'fijos':>10} {'neto':>12} {'acum.':>12}")
    for m in r["escenarios"]["base"]["meses"]:
        print(f"  {m['mes']:>3} {m['unidades']:>8,.1f} {s(m['ingresos_netos']):>12} "
              f"{s(m['costos_variables']):>12} {s(m['costos_fijos']):>10} {s(m['flujo_neto']):>12} "
              f"{s(m['acumulado']):>12}")
    print("\nSensibilidad (escenario base, ±20 % una variable a la vez, ordenada por impacto):")
    for f in r["sensibilidad"]:
        print(f"  {f['variable']:<20} base {s(f['resultado_base']):>12}   "
              f"-20 % → {s(f['resultado_-20%']):>12}   +20 % → {s(f['resultado_+20%']):>12}   "
              f"rango {s(f['rango'])}")
    print(f"  → La entrada que más mueve el resultado es: {r['sensibilidad'][0]['variable']}")


def imprimir_comparacion(ideas: list[Idea], resultados: list[dict]) -> None:
    print("\nComparación con el mismo método (escenario base):")
    print(f"  {'idea':<36} {'inversión':>10} {'margen/u':>10} {'margen %':>9} {'PE u/mes':>9} "
          f"{'recupera':>10} {'result. 12m':>13} {'h/sem':>6}")
    for idea, r in zip(ideas, resultados):
        eu, b = r["economia_unitaria"], r["escenarios"]["base"]
        pe = eu["punto_equilibrio_unidades_mes"]
        rec = f"mes {b['mes_recuperacion']}" if b["mes_recuperacion"] else "no en 12m"
        print(f"  {idea.nombre[:36]:<36} {s(r['inversion_inicial']):>10} {s(eu['margen_unitario']):>10} "
              f"{eu['margen_pct_sobre_ingreso_neto']*100:>8.1f}% "
              f"{(f'{pe:.0f}' if math.isfinite(pe) else 'n/a'):>9} {rec:>10} "
              f"{s(b['resultado_12m_tras_inversion']):>13} {r['horas_semana_requeridas']:>6.0f}")
    print("  Supuesto más frágil por idea (mayor sensibilidad):")
    for idea, r in zip(ideas, resultados):
        print(f"    {idea.nombre[:36]:<36} {r['sensibilidad'][0]['variable']}")


# =============================================================================
# 6. HOJA DE CÁLCULO CON FÓRMULAS
# =============================================================================


def exportar_xlsx(ideas: list[Idea], ruta: str) -> None:
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment
    from openpyxl.utils import get_column_letter

    wb = Workbook()
    negrita = Font(bold=True)
    gris = PatternFill("solid", fgColor="EEEEEE")
    amarillo = PatternFill("solid", fgColor="FFF2CC")

    # --- LEEME -------------------------------------------------------------
    ws = wb.active
    ws.title = "LEEME"
    filas = [
        ["Modelo financiero — agencia de creación de negocios"],
        ["Generado por finanzas/modelo.py --xlsx. Las celdas amarillas son entradas; el resto son fórmulas."],
        ["Para cambiar un supuesto, edite la celda amarilla en la hoja 'Supuestos' de la idea; todo se recalcula."],
        ["Etiquetas de origen: VERIFICADO: fuente, fecha · ESTIMADO: método · SUPUESTO: por validar · DESCONOCIDO."],
        ["Si cambia un valor aquí, replíquelo en modelo.py (o al revés) para que ambos coincidan."],
        [""],
    ]
    if ES_EJEMPLO:
        filas.insert(0, ["¡¡ VALORES DE EJEMPLO !! No describen ningún negocio real. Borrar antes del análisis real."])
    for f in filas:
        ws.append(f)
    ws["A1"].font = Font(bold=True, size=13, color="C00000" if ES_EJEMPLO else "000000")
    ws.column_dimensions["A"].width = 110

    comp_refs = []
    for idx, idea in enumerate(ideas, start=1):
        p = f"I{idx}"  # prefijo corto de hoja
        # --- Supuestos -----------------------------------------------------
        wsS = wb.create_sheet(f"{p} Supuestos")
        wsS.append([f"Idea: {idea.nombre}"]); wsS["A1"].font = negrita
        wsS.append([f"Unidad: {idea.unidad}"])
        wsS.append(["Concepto", "Valor", "Origen", "Nota"]); wsS["A3"].font = negrita
        ref: dict[str, str] = {}

        def fila(clave, concepto, valor, origen, nota=""):
            wsS.append([concepto, valor, origen, nota])
            r_ = wsS.max_row
            wsS[f"B{r_}"].fill = amarillo
            ref[clave] = f"'{p} Supuestos'!$B${r_}"

        fila("precio", "Precio de venta al cliente (S/)", idea.precio_venta.valor, idea.precio_venta.origen, idea.precio_venta.nota)
        fila("igv_aplica", "¿Precio incluye IGV? (1 = sí, 0 = no)", 1 if idea.igv_aplica else 0, "regla", "")
        fila("tasa_igv", "Tasa IGV", idea.tasa_igv.valor, idea.tasa_igv.origen, idea.tasa_igv.nota)
        fila("tasa_pasarela", "Comisión pasarela (%)", idea.tasa_pasarela.valor, idea.tasa_pasarela.origen, idea.tasa_pasarela.nota)
        fila("fijo_pasarela", "Comisión pasarela fija por transacción (S/)", idea.fijo_pasarela.valor, idea.fijo_pasarela.origen, idea.fijo_pasarela.nota)
        fila("tasa_renta", "Impuesto a la renta (% sobre ingreso neto)", idea.tasa_impuesto_renta.valor, idea.tasa_impuesto_renta.origen, idea.tasa_impuesto_renta.nota)
        fila("horas", "Horas por semana requeridas", idea.horas_semana_requeridas.valor, idea.horas_semana_requeridas.origen, "")

        def grupo(clave, titulo, items):
            wsS.append([]); wsS.append([titulo]); wsS[f"A{wsS.max_row}"].font = negrita
            inicio = wsS.max_row + 1
            for k, e in items.items():
                wsS.append([k, e.valor, e.origen, e.nota]); wsS[f"B{wsS.max_row}"].fill = amarillo
            fin = wsS.max_row
            wsS.append([f"TOTAL {titulo.lower()}", f"=SUM(B{inicio}:B{fin})", "fórmula", ""])
            wsS[f"A{wsS.max_row}"].font = negrita
            ref[clave] = f"'{p} Supuestos'!$B${wsS.max_row}"

        grupo("inversion", "Inversión inicial (S/)", idea.inversion_inicial)
        grupo("fijos", "Costos fijos mensuales (S/)", idea.costos_fijos_mensuales)
        grupo("cv_directo", "Costo variable directo por unidad (S/)", idea.costo_variable_unitario)

        wsS.append([]); wsS.append(["Escenarios"]); wsS[f"A{wsS.max_row}"].font = negrita
        wsS.append(["Escenario", "Unidades mes 1", "Crecimiento mensual", "Factor precio", "Origen"])
        for n, esc in idea.escenarios.items():
            wsS.append([n, esc.unidades_mes1.valor, esc.crecimiento_mensual.valor, esc.factor_precio.valor,
                        esc.unidades_mes1.origen])
            r_ = wsS.max_row
            for c in "BCD":
                wsS[f"{c}{r_}"].fill = amarillo
            ref[f"{n}.u1"] = f"'{p} Supuestos'!$B${r_}"
            ref[f"{n}.g"] = f"'{p} Supuestos'!$C${r_}"
            ref[f"{n}.f"] = f"'{p} Supuestos'!$D${r_}"
        for col, w in (("A", 48), ("B", 14), ("C", 36), ("D", 40), ("E", 14)):
            wsS.column_dimensions[col].width = w

        # --- Unitario (precio de lista) -------------------------------------
        wsU = wb.create_sheet(f"{p} Unitario")
        wsU.append([f"Economía unitaria — {idea.nombre} (precio de lista)"]); wsU["A1"].font = negrita
        wsU.append(["Concepto", "S/", "Fórmula"])
        u = {}

        def ufila(clave, concepto, formula):
            wsU.append([concepto, formula, formula]); u[clave] = f"'{p} Unitario'!$B${wsU.max_row}"

        ufila("precio", "Precio al cliente", f"={ref['precio']}")
        ufila("ingreso_neto", "Ingreso neto (sin IGV)", f"=IF({ref['igv_aplica']}=1,{u['precio']}/(1+{ref['tasa_igv']}),{u['precio']})")
        ufila("comision", "Comisión pasarela", f"={u['precio']}*{ref['tasa_pasarela']}+{ref['fijo_pasarela']}")
        ufila("impuesto", "Impuesto a la renta", f"={u['ingreso_neto']}*{ref['tasa_renta']}")
        ufila("cv_directo", "Costo variable directo", f"={ref['cv_directo']}")
        ufila("cv_total", "Costo variable total", f"={u['cv_directo']}+{u['comision']}+{u['impuesto']}")
        ufila("margen", "Margen por unidad", f"={u['ingreso_neto']}-{u['cv_total']}")
        ufila("margen_pct", "Margen % sobre ingreso neto", f"=IF({u['ingreso_neto']}=0,0,{u['margen']}/{u['ingreso_neto']})")
        ufila("fijos", "Costos fijos mensuales", f"={ref['fijos']}")
        ufila("pe_u", "Punto de equilibrio (unidades/mes)", f"=IF({u['margen']}>0,{u['fijos']}/{u['margen']},\"no alcanzable\")")
        ufila("pe_s", "Punto de equilibrio (S/ ventas/mes)", f"=IF(ISNUMBER({u['pe_u']}),{u['pe_u']}*{u['precio']},\"no alcanzable\")")
        ufila("inversion", "Inversión inicial", f"={ref['inversion']}")
        wsU.column_dimensions["A"].width = 38; wsU.column_dimensions["B"].width = 16; wsU.column_dimensions["C"].width = 70
        for r_ in range(3, wsU.max_row + 1):
            wsU[f"C{r_}"] = wsU[f"B{r_}"].value  # muestra la fórmula como texto
            wsU[f"C{r_}"].value = "'" + str(wsU[f"B{r_}"].value)

        # --- Flujo 12 meses ------------------------------------------------
        wsF = wb.create_sheet(f"{p} Flujo")
        wsF.append([f"Flujo de caja a 12 meses — {idea.nombre}. Escenarios, no predicciones."]); wsF["A1"].font = negrita
        flujo_refs = {}
        for n in ("pesimista", "base", "optimista"):
            wsF.append([]); wsF.append([f"Escenario {n}"]); wsF[f"A{wsF.max_row}"].font = negrita
            # economía unitaria del escenario (con factor de precio)
            r0 = wsF.max_row + 1
            wsF.append(["Precio escenario", f"={ref['precio']}*{ref[n + '.f']}"])
            wsF.append(["Ingreso neto unitario", f"=IF({ref['igv_aplica']}=1,B{r0}/(1+{ref['tasa_igv']}),B{r0})"])
            wsF.append(["Costo variable total unitario", f"={ref['cv_directo']}+B{r0}*{ref['tasa_pasarela']}+{ref['fijo_pasarela']}+B{r0+1}*{ref['tasa_renta']}"])
            wsF.append(["Costos fijos mensuales", f"={ref['fijos']}"])
            wsF.append(["Inversión inicial", f"={ref['inversion']}"])
            rp, rin, rcv, rfj, rinv = r0, r0 + 1, r0 + 2, r0 + 3, r0 + 4
            cab = wsF.max_row + 1
            wsF.append(["Mes"] + list(range(1, MESES + 1)) + ["Total 12 m"])
            for c in range(1, MESES + 3):
                wsF.cell(row=cab, column=c).font = negrita; wsF.cell(row=cab, column=c).fill = gris
            ru, ri, rv, rf, rn, ra, rr = cab + 1, cab + 2, cab + 3, cab + 4, cab + 5, cab + 6, cab + 7
            wsF.append(["Unidades"]); wsF.append(["Ingresos netos"]); wsF.append(["Costos variables"])
            wsF.append(["Costos fijos"]); wsF.append(["Flujo neto"]); wsF.append(["Acumulado (tras inversión)"])
            wsF.append(["Mes en que acumulado ≥ 0"])
            for m in range(1, MESES + 1):
                col = get_column_letter(m + 1)
                prev = get_column_letter(m)
                wsF[f"{col}{ru}"] = f"={ref[n + '.u1']}*(1+{ref[n + '.g']})^({m}-1)"
                wsF[f"{col}{ri}"] = f"={col}{ru}*$B${rin}"
                wsF[f"{col}{rv}"] = f"={col}{ru}*$B${rcv}"
                wsF[f"{col}{rf}"] = f"=$B${rfj}"
                wsF[f"{col}{rn}"] = f"={col}{ri}-{col}{rv}-{col}{rf}"
                wsF[f"{col}{ra}"] = f"=-$B${rinv}+{col}{rn}" if m == 1 else f"={prev}{ra}+{col}{rn}"
                wsF[f"{col}{rr}"] = f"=IF({col}{ra}>=0,{m},\"\")"
            tot = get_column_letter(MESES + 2)
            for r_ in (ru, ri, rv, rf, rn):
                wsF[f"{tot}{r_}"] = f"=SUM(B{r_}:{get_column_letter(MESES + 1)}{r_})"
            wsF[f"{tot}{ra}"] = f"={get_column_letter(MESES + 1)}{ra}"
            wsF[f"{tot}{rr}"] = f"=IF(COUNT(B{rr}:{get_column_letter(MESES + 1)}{rr})=0,\"no en 12 meses\",MIN(B{rr}:{get_column_letter(MESES + 1)}{rr}))"
            wsF[f"{tot}{ra}"].font = negrita; wsF[f"{tot}{rr}"].font = negrita
            flujo_refs[n] = {"resultado": f"'{p} Flujo'!${tot}${ra}", "recupera": f"'{p} Flujo'!${tot}${rr}",
                             "unidades": f"'{p} Flujo'!${tot}${ru}"}
        wsF.column_dimensions["A"].width = 30
        for c in range(2, MESES + 3):
            wsF.column_dimensions[get_column_letter(c)].width = 12

        # --- Sensibilidad (fórmula cerrada sobre el escenario base) --------
        wsX = wb.create_sheet(f"{p} Sensibilidad")
        wsX.append([f"Sensibilidad — {idea.nombre} — escenario base, ±20 % una variable a la vez"]); wsX["A1"].font = negrita
        wsX.append(["Resultado 12 m = Σ unidades × margen unitario − 12 × fijos − inversión; Σ unidades = u1·((1+g)^12−1)/g"])
        wsX.append(["Variación", 0.2]); wsX["B3"].fill = amarillo
        var = "$B$3"
        wsX.append(["Variable", "Valor base", "Resultado base", "Resultado −var", "Resultado +var", "Rango (abs)"])
        for c in "ABCDEF":
            wsX[f"{c}4"].font = negrita; wsX[f"{c}4"].fill = gris

        def R(precio=None, cv=None, fijos=None, inv=None, u1=None, g=None, tp=None, tr=None) -> str:
            precio = precio or f"({ref['precio']}*{ref['base.f']})"
            cv = cv or ref["cv_directo"]; fijos = fijos or ref["fijos"]; inv = inv or ref["inversion"]
            u1 = u1 or ref["base.u1"]; g = g or ref["base.g"]
            tp = tp or ref["tasa_pasarela"]; tr = tr or ref["tasa_renta"]
            ingreso = f"IF({ref['igv_aplica']}=1,{precio}/(1+{ref['tasa_igv']}),{precio})"
            margen = f"({ingreso}-({cv}+{precio}*{tp}+{ref['fijo_pasarela']}+{ingreso}*{tr}))"
            unidades = f"IF({g}=0,{MESES}*{u1},{u1}*((1+{g})^{MESES}-1)/{g})"
            return f"{unidades}*{margen}-{MESES}*{fijos}-{inv}"

        variables = [
            ("precio", f"{ref['precio']}", "precio"),
            ("unidades_mes1", ref["base.u1"], "u1"),
            ("crecimiento", ref["base.g"], "g"),
            ("cv_directo", ref["cv_directo"], "cv"),
            ("fijos", ref["fijos"], "fijos"),
            ("inversion", ref["inversion"], "inv"),
            ("tasa_pasarela", ref["tasa_pasarela"], "tp"),
            ("tasa_impuesto_renta", ref["tasa_renta"], "tr"),
        ]
        for nombre, celda, arg in variables:
            menos = f"({celda}*(1-{var}))"; mas = f"({celda}*(1+{var}))"
            if arg == "precio":
                menos = f"({menos}*{ref['base.f']})"; mas = f"({mas}*{ref['base.f']})"
            wsX.append([nombre, f"={celda}", f"={R()}", f"={R(**{arg: menos})}", f"={R(**{arg: mas})}", None])
            r_ = wsX.max_row
            wsX[f"F{r_}"] = f"=ABS(E{r_}-D{r_})"
        wsX.append([]); wsX.append(["La variable con mayor 'Rango' es la que más mueve el resultado."])
        for col, w in (("A", 22), ("B", 14), ("C", 16), ("D", 16), ("E", 16), ("F", 14)):
            wsX.column_dimensions[col].width = w

        comp_refs.append((idea, ref, u, flujo_refs))

    # --- Comparación ---------------------------------------------------------
    wsC = wb.create_sheet("Comparacion", 1)
    wsC.append(["Comparación con el mismo método — escenario base"]); wsC["A1"].font = negrita
    wsC.append(["Idea", "Inversión inicial", "Margen por unidad", "Margen %", "Punto de equilibrio (u/mes)",
                "Recupera (mes)", "Resultado 12 m (base)", "Resultado 12 m (pesimista)",
                "Resultado 12 m (optimista)", "Horas/semana"])
    for c in range(1, 11):
        wsC.cell(row=2, column=c).font = negrita; wsC.cell(row=2, column=c).fill = gris
    for idea, ref, u, fr in comp_refs:
        wsC.append([idea.nombre, f"={u['inversion']}", f"={u['margen']}", f"={u['margen_pct']}", f"={u['pe_u']}",
                    f"={fr['base']['recupera']}", f"={fr['base']['resultado']}", f"={fr['pesimista']['resultado']}",
                    f"={fr['optimista']['resultado']}", f"={ref['horas']}"])
    wsC.column_dimensions["A"].width = 40
    for c in range(2, 11):
        wsC.column_dimensions[get_column_letter(c)].width = 20
    for row in wsC.iter_rows(min_row=3, max_row=wsC.max_row):
        for cell in row:
            cell.alignment = Alignment(horizontal="right")

    wb.save(ruta)


# =============================================================================
# 7. CLI
# =============================================================================


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--comparar", action="store_true", help="solo la tabla comparativa")
    ap.add_argument("--xlsx", nargs="?", const="finanzas/modelo.xlsx", metavar="RUTA",
                    help="regenerar la hoja de cálculo con fórmulas (por defecto finanzas/modelo.xlsx)")
    ap.add_argument("--json", action="store_true", help="resultados en JSON")
    ap.add_argument("--idea", help="evaluar solo la idea con este nombre (coincidencia parcial)")
    args = ap.parse_args(argv)

    ideas = IDEAS
    if args.idea:
        ideas = [i for i in IDEAS if args.idea.lower() in i.nombre.lower()]
        if not ideas:
            print(f"No hay ninguna idea cuyo nombre contenga '{args.idea}'.", file=sys.stderr)
            return 2
    if not ideas:
        print("IDEAS está vacío: cargue las ideas reales con su origen.", file=sys.stderr)
        return 2

    errores = validar(ideas)
    if errores:
        print("ERRORES DE VALIDACIÓN — el modelo no corre hasta corregirlos:", file=sys.stderr)
        for e in errores:
            print("  - " + e, file=sys.stderr)
        return 1

    resultados = [evaluar(i) for i in ideas]

    if args.json:
        print(json.dumps({"es_ejemplo": ES_EJEMPLO, "ideas": resultados}, ensure_ascii=False, indent=2,
                         default=lambda o: None if (isinstance(o, float) and not math.isfinite(o)) else str(o)))
        return 0

    print(banner(), end="")
    if args.comparar:
        imprimir_comparacion(ideas, resultados)
    else:
        for idea, r in zip(ideas, resultados):
            imprimir_idea(idea, r)
        if len(ideas) > 1:
            imprimir_comparacion(ideas, resultados)
    print(banner(), end="")

    if args.xlsx:
        exportar_xlsx(ideas, args.xlsx)
        print(f"\nHoja de cálculo regenerada: {args.xlsx}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
