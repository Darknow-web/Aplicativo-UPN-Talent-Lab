# Agencia de Creación de Negocios

Sistema multiagente en Claude Code que asesora a Carlos e Indira para **elegir** y luego **evaluar, direccionar y proyectar** su primer negocio en Lima, Perú. Este repositorio es la carpeta `agencia-negocios/` descrita en el encargo.

- `CLAUDE.md` — instrucciones del Director de Cuenta (sesión principal).
- `.claude/agents/` — 8 especialistas: explorador-de-oportunidades, analista-mercado, estratega-producto, analista-financiero, estratega-lanzamiento, asesor-legal-tributario-peru, coach-de-socios, abogado-del-diablo.
- `.claude/commands/` — `/explorar` (Etapa 1, fases 0-4), `/diagnostico` (Etapa 2, fases 5-10; exige decisión registrada), `/consulta <pregunta>`, `/actualizar <dato nuevo>`.
- `expediente/` — perfil, negocio, fichas de opciones, supuestos, decisiones e informes.
- `finanzas/modelo.py` y `modelo.xlsx` — modelo financiero reproducible (`python3 finanzas/modelo.py --xlsx` regenera la hoja). Trae valores de ejemplo que se borran antes del análisis real.
- `entregables/` — opciones de negocio, plan de validación, veredicto, plan de lanzamiento, plan con fechas y roles.

Cómo empezar: abre Claude Code en esta carpeta y ejecuta `/explorar`.
