"use client";

import type { ModelInfo } from "@/lib/api";

interface Props {
  info: ModelInfo | null;
  loading: boolean;
}

/* ── RC class descriptions ── */
const RC_DESCRIPTIONS: Record<string, string> = {
  "RC 03": "Incumplimiento o falta de procedimientos de trabajo",
  "RC 04": "Falta de competencia, capacitación o entrenamiento",
  "RC 05": "Condiciones del entorno o infraestructura deficiente",
  "RC 06": "Falla, defecto o mal estado de equipos y herramientas",
  "RC 09": "Supervisión deficiente o ausente",
  "RC 10": "Uso incorrecto o falta de Equipos de Protección Personal",
  "RC 12": "Deficiencia en la comunicación o coordinación",
  "RC 13": "Factores personales: fatiga, distracción o estrés",
  "RC 18": "Factores organizacionales o de gestión",
  "RC 25": "Condiciones del terreno o entorno geológico",
  "SIN RC": "Accidente sin causa raíz identificada aún",
  "OTROS": "Causas minoritarias agrupadas por el modelo",
};

export default function ModelStatus({ info, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse shadow-sm">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-gray-100 rounded-xl" />
          <div className="h-24 bg-gray-100 rounded-xl" />
          <div className="h-24 bg-gray-100 rounded-xl" />
          <div className="h-24 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-800">No se pudo conectar con el servidor</p>
          <p className="text-xs text-amber-600 mt-0.5">Verifica que el backend esté activo en Hugging Face Spaces</p>
        </div>
      </div>
    );
  }

  if (!info.existe) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <span className="text-sm text-gray-500 font-semibold">Sin modelo entrenado</span>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-700">
            <strong>Paso 1:</strong> Sube un archivo Excel con la nómina de accidentes usando el formulario de arriba.
          </p>
          <p className="text-sm text-blue-700 mt-1">
            <strong>Paso 2:</strong> Presiona &quot;Entrenar Modelo&quot; para que el sistema aprenda a pronosticar accidentes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ══════════════════════ MAIN MODEL CARD ══════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className={`px-6 py-4 flex flex-wrap items-center justify-between gap-3 ${
          info.necesita_actualizacion ? "bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100" : "bg-gradient-to-r from-emerald-50 to-cyan-50 border-b border-emerald-100"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
            <span className="text-sm font-bold text-emerald-700">Modelo Activo</span>
            {info.necesita_actualizacion && (
              <span className="bg-orange-200 text-orange-800 px-2.5 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {info.razon_actualizacion || "Reentrenar recomendado"}
              </span>
            )}
          </div>
        </div>

        {/* ── What is this model + Why XGBoost ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-1">Modelo de Pronóstico de Accidentes (XGBoost)</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Este es un modelo de <strong className="text-gray-700">inteligencia artificial</strong> que analiza los datos históricos de accidentes
                y <strong className="text-gray-700">pronostica cuántos accidentes ocurrirán cada mes</strong> y qué tipo de
                <strong className="text-gray-700"> Causa Raíz (RC)</strong> tendrán. Utiliza el algoritmo <strong className="text-gray-700">XGBoost (XGBRegressor)</strong>,
                uno de los más potentes para predicción con datos tabulares.
              </p>
            </div>
          </div>

          {/* Why XGBoost */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h4 className="text-sm font-bold text-blue-800">¿Por qué se eligió XGBoost?</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <WhyItem
                title="Alto rendimiento con datos tabulares"
                text="XGBoost es el algoritmo líder en competencias de machine learning para datos en formato tabla (como Excel). Supera consistentemente a redes neuronales en este tipo de datos."
              />
              <WhyItem
                title="Manejo de series con pocos datos"
                text="Aunque haya pocos meses de historia, XGBoost puede aprender patrones estacionales y de tendencia. Además, entrena un modelo por cada Causa Raíz para capturar dinámicas individuales."
              />
              <WhyItem
                title="Robusto ante datos imperfectos"
                text="Los datos reales contienen valores faltantes, categorías inconsistentes y ruido. XGBoost maneja nativamente estos problemas sin perder rendimiento."
              />
              <WhyItem
                title="Combina múltiples señales temporales"
                text="Integra estacionalidad (mes_sin, mes_cos), tendencia (t), inercia (lags) y promedio móvil (rolling_mean) en un solo modelo que captura múltiples patrones simultáneamente."
              />
            </div>
          </div>

          {/* How does the forecast work internally - 4 PHASES */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h4 className="text-sm font-bold text-emerald-800">¿Cómo funciona el pronóstico de accidentes? — Ejemplo completo</h4>
            </div>
            <p className="text-xs text-emerald-700/80 leading-relaxed mb-5">
              El sistema usa <strong>XGBRegressor</strong> (XGBoost para regresión) para predecir <em>cuántos</em> accidentes habrá cada mes
              y <em>qué tipo de Causa Raíz</em> tendrán. El proceso completo tiene 4 fases:
            </p>

            {/* ═══════════ FASE 1: DATOS ═══════════ */}
            <div className="mb-4 bg-blue-50/50 rounded-xl p-4 border border-blue-200/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-blue-800">Fase 1: Recolección de datos</h5>
                  <p className="text-[10px] text-blue-500">¿Qué datos se toman y cómo se organizan?</p>
                </div>
              </div>

              <p className="text-[11px] text-gray-600 mb-3 leading-relaxed">
                El Excel de accidentes tiene miles de filas. Cada fila es un accidente con fecha, turno, empresa, cargo, etc.
                Para el pronóstico, <strong>solo importa cuántos accidentes hubo cada mes</strong>. Se cuentan las filas por mes:
              </p>

              <div className="overflow-x-auto mb-3">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-blue-100/50 text-blue-700">
                      <th className="px-3 py-2 text-left font-bold border border-blue-100">Datos en el Excel</th>
                      <th className="px-3 py-2 text-center font-bold border border-blue-100">→</th>
                      <th className="px-3 py-2 text-center font-bold border border-blue-100">Serie temporal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { raw: "152 filas con fecha entre 01/01/2024 y 31/01/2024", mes: "Ene 2024", val: 42 },
                      { raw: "128 filas con fecha entre 01/02/2024 y 29/02/2024", mes: "Feb 2024", val: 38 },
                      { raw: "167 filas con fecha entre 01/03/2024 y 31/03/2024", mes: "Mar 2024", val: 51 },
                      { raw: "...", mes: "...", val: "..." },
                      { raw: "98 filas con fecha entre 01/12/2024 y 31/12/2024", mes: "Dic 2024", val: 29 },
                    ].map((r, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                        <td className="px-3 py-2 text-gray-500 border border-gray-100">{r.raw}</td>
                        <td className="px-3 py-2 text-center text-gray-400 border border-gray-100">→</td>
                        <td className="px-3 py-2 text-center border border-gray-100">
                          <span className="text-gray-600">{r.mes}:</span>{" "}
                          <strong className="text-blue-700">{r.val}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-blue-500 italic">
                Resultado: una serie temporal — un solo número (cantidad de accidentes) por cada mes histórico.
              </p>
            </div>

            {/* ═══════════ FASE 2: TRANSFORMACIÓN ═══════════ */}
            <div className="mb-4 bg-teal-50/50 rounded-xl p-4 border border-teal-200/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-teal-800">Fase 2: Transformación de datos</h5>
                  <p className="text-[10px] text-teal-500">¿Cómo se convierten las fechas en números que el modelo entienda?</p>
                </div>
              </div>
              <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50">
                <p className="text-[11px] text-emerald-600/70 mb-3">
                  XGBoost no entiende &ldquo;marzo 2024&rdquo;. Necesita <strong>números</strong> que le permitan detectar patrones.
                  Veamos un ejemplo completo con <strong>Marzo 2024</strong> (mes #24 de la serie, con 51 accidentes):
                </p>

                {/* Example table */}
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-teal-50 text-teal-700">
                        <th className="px-3 py-2 text-left font-bold border border-teal-100">Variable</th>
                        <th className="px-3 py-2 text-left font-bold border border-teal-100">Dato original</th>
                        <th className="px-3 py-2 text-center font-bold border border-teal-100">Operación</th>
                        <th className="px-3 py-2 text-center font-bold border border-teal-100">Valor</th>
                        <th className="px-3 py-2 text-left font-bold border border-teal-100">¿Para qué sirve?</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="px-3 py-2 font-mono font-bold text-teal-700 border border-gray-100">mes_cal</td>
                        <td className="px-3 py-2 text-gray-600 border border-gray-100">Marzo → mes 3</td>
                        <td className="px-3 py-2 text-center text-gray-400 border border-gray-100">Número del mes</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-800 border border-gray-100">3.0</td>
                        <td className="px-3 py-2 text-gray-500 border border-gray-100">Permite al modelo aprender que ciertos meses tienen más accidentes (ej: invierno vs verano)</td>
                      </tr>
                      <tr className="bg-gray-50/50">
                        <td className="px-3 py-2 font-mono font-bold text-teal-700 border border-gray-100">anio</td>
                        <td className="px-3 py-2 text-gray-600 border border-gray-100">Año 2024</td>
                        <td className="px-3 py-2 text-center text-gray-400 border border-gray-100">Número del año</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-800 border border-gray-100">2024.0</td>
                        <td className="px-3 py-2 text-gray-500 border border-gray-100">Captura si los accidentes suben o bajan con los años (tendencia a largo plazo)</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-3 py-2 font-mono font-bold text-teal-700 border border-gray-100">mes_sin</td>
                        <td className="px-3 py-2 text-gray-600 border border-gray-100">Mes 3 de 12</td>
                        <td className="px-3 py-2 text-center font-mono text-gray-400 border border-gray-100">sin(2π&middot;3/12) = sin(π/2)</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-800 border border-gray-100">1.0</td>
                        <td className="px-3 py-2 text-gray-500 border border-gray-100" rowSpan={2}>
                          Juntas forman un &ldquo;reloj circular&rdquo;: diciembre (12) queda cerca de enero (1), no lejos.
                          Sin esto, el modelo pensaría que dic y ene son meses muy distintos
                        </td>
                      </tr>
                      <tr className="bg-gray-50/50">
                        <td className="px-3 py-2 font-mono font-bold text-teal-700 border border-gray-100">mes_cos</td>
                        <td className="px-3 py-2 text-gray-600 border border-gray-100">Mes 3 de 12</td>
                        <td className="px-3 py-2 text-center font-mono text-gray-400 border border-gray-100">cos(2π&middot;3/12) = cos(π/2)</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-800 border border-gray-100">0.0</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-3 py-2 font-mono font-bold text-teal-700 border border-gray-100">t</td>
                        <td className="px-3 py-2 text-gray-600 border border-gray-100">Es el mes #24 desde el inicio</td>
                        <td className="px-3 py-2 text-center text-gray-400 border border-gray-100">Posición en la serie (base 0)</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-800 border border-gray-100">23.0</td>
                        <td className="px-3 py-2 text-gray-500 border border-gray-100">Índice lineal de tendencia: si t sube y accidentes suben, hay tendencia creciente</td>
                      </tr>
                      <tr className="bg-gray-50/50">
                        <td className="px-3 py-2 font-mono font-bold text-teal-700 border border-gray-100">lag_1</td>
                        <td className="px-3 py-2 text-gray-600 border border-gray-100">Feb 2024: 38 accidentes</td>
                        <td className="px-3 py-2 text-center text-gray-400 border border-gray-100">Cantidad del mes anterior</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-800 border border-gray-100">38.0</td>
                        <td className="px-3 py-2 text-gray-500 border border-gray-100" rowSpan={3}>
                          Los 3 meses anteriores le dicen al modelo &ldquo;lo que vino pasando&rdquo;.
                          Si los 3 lags son altos → probablemente el siguiente también sea alto
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-3 py-2 font-mono font-bold text-teal-700 border border-gray-100">lag_2</td>
                        <td className="px-3 py-2 text-gray-600 border border-gray-100">Ene 2024: 42 accidentes</td>
                        <td className="px-3 py-2 text-center text-gray-400 border border-gray-100">Cantidad de hace 2 meses</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-800 border border-gray-100">42.0</td>
                      </tr>
                      <tr className="bg-gray-50/50">
                        <td className="px-3 py-2 font-mono font-bold text-teal-700 border border-gray-100">lag_3</td>
                        <td className="px-3 py-2 text-gray-600 border border-gray-100">Dic 2023: 29 accidentes</td>
                        <td className="px-3 py-2 text-center text-gray-400 border border-gray-100">Cantidad de hace 3 meses</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-800 border border-gray-100">29.0</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-3 py-2 font-mono font-bold text-teal-700 border border-gray-100">rolling_mean_3</td>
                        <td className="px-3 py-2 text-gray-600 border border-gray-100">Promedio: (29+42+38)/3</td>
                        <td className="px-3 py-2 text-center font-mono text-gray-400 border border-gray-100">(lag₃+lag₂+lag₁) / 3</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-800 border border-gray-100">36.3</td>
                        <td className="px-3 py-2 text-gray-500 border border-gray-100">Suaviza picos: en vez de un mes raro, da la &ldquo;velocidad crucero&rdquo; reciente</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Final row vector */}
                <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
                  <p className="text-[10px] font-bold text-teal-700 mb-1.5">Fila final que recibe XGBoost para Marzo 2024:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { k: "mes_cal", v: "3.0" }, { k: "anio", v: "2024" }, { k: "mes_sin", v: "1.0" },
                      { k: "mes_cos", v: "0.0" }, { k: "t", v: "23" }, { k: "lag_1", v: "38" },
                      { k: "lag_2", v: "42" }, { k: "lag_3", v: "29" }, { k: "rolling", v: "36.3" },
                    ].map((f) => (
                      <span key={f.k} className="bg-white border border-teal-200 rounded-md px-2 py-1 text-[10px] font-mono">
                        <strong className="text-teal-700">{f.k}</strong><span className="text-gray-400">=</span><span className="text-gray-700">{f.v}</span>
                      </span>
                    ))}
                    <span className="text-[10px] text-teal-600 font-bold self-center ml-1">→ XGBoost predice: <span className="text-emerald-700">~51 accidentes</span></span>
                  </div>
                  <p className="text-[10px] text-teal-600 mt-2">
                    El modelo recibe <strong>exactamente esta fila de 9 números</strong> y devuelve un solo número: la cantidad estimada de accidentes.
                    Se repite para cada mes histórico durante el entrenamiento, y para cada mes futuro durante el pronóstico.
                  </p>
                </div>

                <div className="mt-2 bg-teal-50/50 rounded-lg p-2.5 border border-teal-100/30">
                  <p className="text-[10px] text-teal-700">
                    <strong>Adaptación automática:</strong> Con menos de 6 meses solo se usan las features base (mes_cal, anio, mes_sin, mes_cos, t). Los lags y rolling_mean_3 se activan cuando hay suficiente historia.
                  </p>
                </div>
              </div>
            </div>

            {/* ═══════════ FASE 3: ENTRENAMIENTO ═══════════ */}
            <div className="mb-4 bg-amber-50/50 rounded-xl p-4 border border-amber-200/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-amber-800">Fase 3: Entrenamiento del modelo</h5>
                  <p className="text-[10px] text-amber-500">¿Cómo aprende XGBoost de los datos históricos?</p>
                </div>
              </div>

              <div className="bg-white/70 rounded-xl p-4 border border-amber-100/50 mb-4">
                <h6 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Tabla de entrenamiento
                </h6>
                <p className="text-[11px] text-gray-600 mb-3">
                  La Fase 2 se repite para <strong>cada mes histórico</strong>. Esto genera una tabla donde cada fila es un mes
                  con sus features (X) y la cantidad real de accidentes (y). El modelo aprende la relación <strong>X → y</strong>:
                </p>

                {/* Training table */}
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-[10px] border-collapse">
                    <thead>
                      <tr className="bg-cyan-50 text-cyan-700">
                        <th className="px-2 py-1.5 text-left font-bold border border-cyan-100">Mes</th>
                        <th className="px-2 py-1.5 text-center font-bold border border-cyan-100">mes_cal</th>
                        <th className="px-2 py-1.5 text-center font-bold border border-cyan-100">anio</th>
                        <th className="px-2 py-1.5 text-center font-bold border border-cyan-100">sin</th>
                        <th className="px-2 py-1.5 text-center font-bold border border-cyan-100">cos</th>
                        <th className="px-2 py-1.5 text-center font-bold border border-cyan-100">t</th>
                        <th className="px-2 py-1.5 text-center font-bold border border-cyan-100">lag₁</th>
                        <th className="px-2 py-1.5 text-center font-bold border border-cyan-100">lag₂</th>
                        <th className="px-2 py-1.5 text-center font-bold border border-cyan-100">lag₃</th>
                        <th className="px-2 py-1.5 text-center font-bold border border-cyan-100">roll₃</th>
                        <th className="px-2 py-1.5 text-center font-bold border border-cyan-100 bg-emerald-100 text-emerald-700">y (real)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { mes: "Abr 2022", mc: 4, a: 2022, s: "0.87", c: "-0.5", t: 3, l1: 51, l2: 38, l3: 42, r: "43.7", y: 35 },
                        { mes: "May 2022", mc: 5, a: 2022, s: "0.5", c: "-0.87", t: 4, l1: 35, l2: 51, l3: 38, r: "41.3", y: 40 },
                        { mes: "...", mc: "...", a: "...", s: "...", c: "...", t: "...", l1: "...", l2: "...", l3: "...", r: "...", y: "..." },
                        { mes: "Feb 2024", mc: 2, a: 2024, s: "0.87", c: "0.5", t: 25, l1: 42, l2: 29, l3: 35, r: "35.3", y: 38 },
                        { mes: "Mar 2024", mc: 3, a: 2024, s: "1.0", c: "0.0", t: 26, l1: 38, l2: 42, l3: 29, r: "36.3", y: 51 },
                      ].map((r, i) => (
                        <tr key={i} className={r.mes === "..." ? "bg-gray-50/50" : i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}>
                          <td className="px-2 py-1.5 font-medium text-gray-700 border border-gray-100">{r.mes}</td>
                          <td className="px-2 py-1.5 text-center text-gray-600 border border-gray-100 font-mono">{r.mc}</td>
                          <td className="px-2 py-1.5 text-center text-gray-600 border border-gray-100 font-mono">{r.a}</td>
                          <td className="px-2 py-1.5 text-center text-gray-600 border border-gray-100 font-mono">{r.s}</td>
                          <td className="px-2 py-1.5 text-center text-gray-600 border border-gray-100 font-mono">{r.c}</td>
                          <td className="px-2 py-1.5 text-center text-gray-600 border border-gray-100 font-mono">{r.t}</td>
                          <td className="px-2 py-1.5 text-center text-gray-600 border border-gray-100 font-mono">{r.l1}</td>
                          <td className="px-2 py-1.5 text-center text-gray-600 border border-gray-100 font-mono">{r.l2}</td>
                          <td className="px-2 py-1.5 text-center text-gray-600 border border-gray-100 font-mono">{r.l3}</td>
                          <td className="px-2 py-1.5 text-center text-gray-600 border border-gray-100 font-mono">{r.r}</td>
                          <td className="px-2 py-1.5 text-center font-bold text-emerald-700 border border-gray-100 bg-emerald-50">{r.y}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-100 mb-3">
                  <p className="text-[11px] text-cyan-800 leading-relaxed">
                    <strong>¿Qué hace XGBoost con esta tabla?</strong> Busca reglas como:
                    &ldquo;cuando <code className="bg-white px-1 rounded text-[10px]">lag₁ &gt; 40</code> y <code className="bg-white px-1 rounded text-[10px]">mes_cal = 3</code>,
                    la cantidad tiende a ser alta (~50)&rdquo;. Construye <strong>~60 árboles de decisión</strong> donde cada uno
                    corrige los errores del anterior. Después de ver todos los meses históricos, el modelo
                    ha &ldquo;memorizado&rdquo; patrones: estacionalidad (más accidentes en ciertos meses),
                    tendencia (sube o baja con los años), e inercia (si el mes anterior fue alto, el siguiente también tiende a serlo).
                  </p>
                </div>

                <div className="bg-white/60 rounded-lg p-3 border border-emerald-100/30">
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    <strong>Entrenamiento vs. predicción:</strong> Durante el entrenamiento, el modelo conoce la columna
                    <strong className="text-emerald-700"> y (real)</strong> y ajusta sus árboles para acercarse a esos valores.
                    Durante la predicción (meses futuros), <strong>no existe la columna y</strong> — el modelo solo recibe
                    las features X y devuelve su mejor estimación.
                  </p>
                </div>
              </div>

              <div className="bg-white/70 rounded-xl p-4 border border-amber-100/50 mb-4 overflow-x-auto">
                <h6 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  ¿Cómo funciona cada árbol de decisión?
                </h6>
                <p className="text-[11px] text-gray-600 mb-2">
                  El modelo arranca con una <strong>estimación base</strong>: el promedio histórico de accidentes (ej: <strong>35.0/mes</strong>).
                  Pero 35 no es exacto para todos los meses — algunos tienen más, otros menos.
                  Cada árbol <strong>agrupa meses con características similares</strong> para calcular cuánto corregir.
                </p>
                <p className="text-[11px] text-gray-500 mb-4">
                  Veamos cómo el Árbol 1 decide la corrección para un mes con <code className="bg-amber-50 px-1 rounded text-amber-700">lag₁ = 29</code> y <code className="bg-amber-50 px-1 rounded text-amber-700">rolling_mean = 31.7</code>.
                  Sigue el camino <strong className="text-emerald-600">verde</strong>:
                </p>

                {/* Regressor tree diagram */}
                <div className="min-w-[680px]">
                  {/* Root node */}
                  <div className="flex justify-center mb-1">
                    <DualTreeNode
                      humanQ="¿El mes anterior tuvo muchos accidentes?"
                      machineQ="lag_1 > 40?"
                      machineVal="Valor actual: 29.0"
                      active
                    />
                  </div>
                  {/* Branch lines level 1 */}
                  <div className="flex justify-center mb-1">
                    <div className="flex items-start" style={{ width: 540 }}>
                      <div className="w-1/2 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-gray-300 px-2 py-0.5">SÍ</span>
                        <div className="w-[2px] h-4 bg-gray-200" />
                      </div>
                      <div className="w-1/2 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">NO → 29 &lt; 40 ✓</span>
                        <div className="w-[2px] h-4 bg-emerald-400" />
                      </div>
                    </div>
                  </div>
                  {/* Level 2 nodes */}
                  <div className="flex justify-center mb-1">
                    <div className="flex gap-4" style={{ width: 580 }}>
                      <div className="flex-1 flex justify-center">
                        <DualTreeNode
                          humanQ="¿Es temporada de invierno?"
                          machineQ="mes_sin > 0.5?"
                          machineVal="(no se evalúa)"
                          dimmed
                        />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <DualTreeNode
                          humanQ="¿La tendencia viene subiendo?"
                          machineQ="rolling_mean_3 > 33?"
                          machineVal="Valor actual: 31.7"
                          active
                        />
                      </div>
                    </div>
                  </div>
                  {/* Branch lines level 2 */}
                  <div className="flex justify-center mb-1">
                    <div className="flex gap-4" style={{ width: 580 }}>
                      <div className="flex-1 flex items-start">
                        <div className="w-1/2 flex flex-col items-center">
                          <div className="w-[2px] h-4 bg-gray-100" />
                        </div>
                        <div className="w-1/2 flex flex-col items-center">
                          <div className="w-[2px] h-4 bg-gray-100" />
                        </div>
                      </div>
                      <div className="flex-1 flex items-start">
                        <div className="w-1/2 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-gray-300">SÍ</span>
                          <div className="w-[2px] h-4 bg-gray-200" />
                        </div>
                        <div className="w-1/2 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">NO → 31.7 &lt; 33 ✓</span>
                          <div className="w-[2px] h-4 bg-emerald-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Leaf nodes — numbers instead of categories */}
                  <div className="flex justify-center">
                    <div className="flex gap-3" style={{ width: 600 }}>
                      <div className="flex-1 rounded-xl px-3 py-2.5 text-center border-2 shadow-sm bg-gray-50 border-gray-100 opacity-30">
                        <span className="text-xs font-bold text-gray-500">+2.1</span>
                      </div>
                      <div className="flex-1 rounded-xl px-3 py-2.5 text-center border-2 shadow-sm bg-gray-50 border-gray-100 opacity-30">
                        <span className="text-xs font-bold text-gray-500">+0.8</span>
                      </div>
                      <div className="flex-1 rounded-xl px-3 py-2.5 text-center border-2 shadow-sm bg-gray-50 border-gray-200">
                        <span className="text-xs font-bold text-gray-500">+1.5</span>
                      </div>
                      <div className="flex-1 rounded-xl px-3 py-2.5 text-center border-2 shadow-sm bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300/50">
                        <span className="text-xs font-bold text-emerald-700">-0.3</span>
                        <span className="text-[9px] text-emerald-500 block mt-0.5">← Llega aquí</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WHERE DOES -0.3 COME FROM */}
                <div className="mt-4 bg-amber-50/80 rounded-lg p-4 border border-amber-200/50">
                  <p className="text-[11px] font-bold text-amber-800 mb-2">¿De dónde sale el -0.3?</p>
                  <p className="text-[11px] text-amber-700/80 leading-relaxed mb-3">
                    Durante el <strong>entrenamiento</strong>, el modelo empieza prediciendo 35.0 para todos los meses (el promedio).
                    Luego mira los meses que cayeron en esta hoja (lag₁ ≤ 40 y rolling_mean ≤ 33) y calcula sus errores:
                  </p>
                  <div className="overflow-x-auto mb-3">
                    <table className="w-full text-[10px] border-collapse">
                      <thead>
                        <tr className="bg-amber-100/50 text-amber-700">
                          <th className="px-2 py-1.5 text-left font-bold border border-amber-100">Mes (en esta hoja)</th>
                          <th className="px-2 py-1.5 text-center font-bold border border-amber-100">Real</th>
                          <th className="px-2 py-1.5 text-center font-bold border border-amber-100">Base</th>
                          <th className="px-2 py-1.5 text-center font-bold border border-amber-100">Error (real − base)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { mes: "Mar 2023", real: 33, base: 35, err: "-2.0" },
                          { mes: "Jul 2023", real: 36, base: 35, err: "+1.0" },
                          { mes: "Oct 2023", real: 34, base: 35, err: "-1.0" },
                          { mes: "Dic 2023", real: 35, base: 35, err: "0.0" },
                        ].map((r, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                            <td className="px-2 py-1.5 text-gray-600 border border-gray-100">{r.mes}</td>
                            <td className="px-2 py-1.5 text-center font-bold text-gray-700 border border-gray-100">{r.real}</td>
                            <td className="px-2 py-1.5 text-center text-gray-500 border border-gray-100">{r.base}</td>
                            <td className="px-2 py-1.5 text-center font-mono font-bold text-amber-700 border border-gray-100">{r.err}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      <strong>Promedio de errores</strong> = (-2 + 1 - 1 + 0) / 4 = <strong>-0.5</strong><br />
                      <strong>× learning rate (0.1)</strong> → corrección lenta para no sobreajustar<br />
                      Pero con más meses el cálculo da aproximadamente → <strong className="text-emerald-700 text-sm">-0.3</strong>
                    </p>
                    <p className="text-[10px] text-amber-600 mt-2">
                      En resumen: <strong>-0.3 significa que los meses con estas características (lag bajo, tendencia plana) históricamente tuvieron ligeramente menos accidentes que el promedio.</strong>
                    </p>
                  </div>
                </div>

                {/* WHAT ARE THE QUESTIONS FOR */}
                <div className="mt-3 bg-blue-50/50 rounded-lg p-3 border border-blue-100/50">
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    <strong>¿Para qué sirven las preguntas?</strong> Agrupan meses con características similares.
                    No todos los meses se corrigen igual: los meses con lag alto (+2.1) se corrigen distinto a los de tendencia baja (-0.3).
                    Las preguntas separan estos grupos para que cada uno reciba la corrección que le corresponde.
                  </p>
                </div>
              </div>

              <div className="bg-white/70 rounded-xl p-4 border border-amber-100/50">
                <h6 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  ¿Por qué se suman los árboles? — Corrección progresiva
                </h6>
                <p className="text-[11px] text-gray-600 mb-3">
                  Un solo árbol no es suficiente. Cada árbol <strong>corrige los errores que dejó el anterior</strong>. Es como afinar un instrumento: cada ajuste te acerca más a la nota correcta.
                </p>

                {/* Step by step correction */}
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-[10px] border-collapse">
                    <thead>
                      <tr className="bg-emerald-50 text-emerald-700">
                        <th className="px-2 py-1.5 text-left font-bold border border-emerald-100">Paso</th>
                        <th className="px-2 py-1.5 text-left font-bold border border-emerald-100">¿Qué mira el árbol?</th>
                        <th className="px-2 py-1.5 text-center font-bold border border-emerald-100">Corrección</th>
                        <th className="px-2 py-1.5 text-center font-bold border border-emerald-100">Predicción acumulada</th>
                        <th className="px-2 py-1.5 text-center font-bold border border-emerald-100 bg-emerald-100 text-emerald-800">Error restante</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { paso: "Base", mira: "Promedio de todos los meses", corr: "—", pred: "35.0", err: "35 vs 33.4 real → 1.6" },
                        { paso: "Árbol 1", mira: "lag₁ bajo, tendencia plana → bajar", corr: "-0.3", pred: "34.7", err: "1.3" },
                        { paso: "Árbol 2", mira: "Es mes de otoño → subir un poco", corr: "+0.5", pred: "35.2", err: "1.8" },
                        { paso: "Árbol 3", mira: "rolling_mean bajo → bajar", corr: "-0.8", pred: "34.4", err: "1.0" },
                        { paso: "...", mira: "cada árbol corrige el error restante", corr: "...", pred: "...", err: "cada vez menor" },
                        { paso: "Árbol 60", mira: "ajuste fino residual", corr: "-0.2", pred: "33.4", err: "≈ 0" },
                      ].map((r, i) => (
                        <tr key={i} className={r.paso === "..." ? "bg-gray-50/50" : r.paso === "Base" ? "bg-amber-50/30" : i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}>
                          <td className="px-2 py-1.5 font-bold text-gray-700 border border-gray-100">{r.paso}</td>
                          <td className="px-2 py-1.5 text-gray-600 border border-gray-100">{r.mira}</td>
                          <td className="px-2 py-1.5 text-center font-mono font-bold text-emerald-700 border border-gray-100">{r.corr}</td>
                          <td className="px-2 py-1.5 text-center font-bold text-gray-700 border border-gray-100">{r.pred}</td>
                          <td className="px-2 py-1.5 text-center text-amber-600 border border-gray-100 bg-amber-50/30">{r.err}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Final result */}
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
                    <div className="text-center bg-white rounded-lg px-3 py-2 border border-gray-200">
                      <p className="text-[10px] text-gray-400">Base (promedio)</p>
                      <p className="text-sm font-bold text-gray-700">35.0</p>
                    </div>
                    <span className="text-lg font-bold text-gray-400">+</span>
                    <div className="text-center bg-white rounded-lg px-3 py-2 border border-emerald-200">
                      <p className="text-[10px] text-emerald-500">Σ 60 correcciones</p>
                      <p className="text-sm font-bold text-emerald-700">-1.6</p>
                    </div>
                    <span className="text-lg font-bold text-gray-400">=</span>
                    <div className="text-center bg-emerald-500 rounded-lg px-4 py-2 shadow-md shadow-emerald-500/20">
                      <p className="text-[10px] text-emerald-100">Pronóstico</p>
                      <p className="text-lg font-bold text-white">33.4</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed text-center">
                    <strong>Cada árbol reduce un poco el error.</strong> Después de ~60 árboles, la suma de todas las correcciones
                    (-0.3 + 0.5 - 0.8 + ... - 0.2 = -1.6) ajusta la base de 35.0 hasta llegar a <strong>33.4 accidentes estimados</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* ═══════════ FASE 4: PREDICCIÓN ═══════════ */}
            <div className="mb-4 bg-violet-50/50 rounded-xl p-4 border border-violet-200/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-violet-800">Fase 4: Generación de predicciones</h5>
                  <p className="text-[10px] text-violet-500">¿Cómo predice el modelo meses futuros y distribuye por Causa Raíz?</p>
                </div>
              </div>

              {/* KEY INSIGHT: how can we predict without real data? */}
              <div className="bg-white/70 rounded-xl p-4 border border-violet-100/50 mb-4">
                <h6 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                  ¿Cómo predice meses que aún no ocurren?
                </h6>
                <p className="text-[11px] text-gray-600 mb-3">
                  El modelo necesita <strong>9 features</strong> para predecir un mes (ver Fase 2). Para meses futuros, algunos se pueden calcular y otros no:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-emerald-50/60 rounded-lg p-3 border border-emerald-100/50">
                    <p className="text-[10px] font-bold text-emerald-700 mb-1.5">Se calculan directo de la fecha</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["mes_cal", "anio", "mes_sin", "mes_cos", "t"].map((f) => (
                        <span key={f} className="bg-white border border-emerald-200 rounded px-1.5 py-0.5 text-[10px] font-mono text-emerald-700">{f}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-emerald-600 mt-1.5">
                      Solo dependen del calendario. Para Marzo 2025: mes_cal=3, anio=2025, mes_sin=1.0, etc.
                      Se pueden calcular para <strong>cualquier fecha futura</strong>.
                    </p>
                  </div>
                  <div className="bg-amber-50/60 rounded-lg p-3 border border-amber-100/50">
                    <p className="text-[10px] font-bold text-amber-700 mb-1.5">Dependen de datos que aún no existen</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["lag_1", "lag_2", "lag_3", "rolling_mean_3"].map((f) => (
                        <span key={f} className="bg-white border border-amber-200 rounded px-1.5 py-0.5 text-[10px] font-mono text-amber-700">{f}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-amber-600 mt-1.5">
                      Necesitan saber cuántos accidentes hubo en los meses anteriores.
                      Para el <strong>primer</strong> mes futuro se usan los últimos datos reales.
                      Para los siguientes, <strong>se usan las predicciones anteriores como si fueran reales</strong>.
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-gray-600 mb-4">
                  Por eso el modelo predice <strong>un mes a la vez</strong>: cada predicción se convierte en el lag del siguiente mes. Veamos cómo funciona:
                </p>

                {/* Iterative chain visualization */}
                <div className="space-y-0">
                  {/* Month 1 */}
                  <div className="flex items-start gap-3 rounded-t-xl px-4 py-3 bg-emerald-50/50 border border-emerald-200/50 border-b-0">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-emerald-800">Mar 2025</p>
                      <p className="text-[10px] text-gray-400 font-mono">lag₁ = <strong className="text-emerald-600">29</strong> (real), lag₂ = <strong className="text-emerald-600">35</strong> (real), lag₃ = <strong className="text-emerald-600">31</strong> (real) + mes_sin, mes_cos, t...</p>
                      <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">→ XGBRegressor predice: <strong>33.4</strong> accidentes</p>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="flex items-center px-7 py-0.5 bg-white border-x border-emerald-200/50">
                    <svg className="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className="text-[9px] text-emerald-400 ml-1">la predicción 33.4 se convierte en lag₁ del siguiente mes</span>
                  </div>
                  {/* Month 2 */}
                  <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 border border-emerald-200/50 border-b-0 border-t-0">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-gray-700">Abr 2025</p>
                      <p className="text-[10px] text-gray-400 font-mono">lag₁ = <strong className="text-amber-600">33.4</strong> (pred), lag₂ = <strong className="text-emerald-600">29</strong> (real), lag₃ = <strong className="text-emerald-600">35</strong> (real)</p>
                      <p className="text-[11px] font-semibold text-gray-600 mt-0.5">→ XGBRegressor predice: <strong>30.8</strong> accidentes</p>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="flex items-center px-7 py-0.5 bg-white border-x border-emerald-200/50">
                    <svg className="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className="text-[9px] text-emerald-400 ml-1">la predicción 30.8 se convierte en lag₁ del siguiente mes</span>
                  </div>
                  {/* Month 3 */}
                  <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 border border-emerald-200/50 border-t-0">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-gray-700">May 2025</p>
                      <p className="text-[10px] text-gray-400 font-mono">lag₁ = <strong className="text-amber-600">30.8</strong> (pred), lag₂ = <strong className="text-amber-600">33.4</strong> (pred), lag₃ = <strong className="text-emerald-600">29</strong> (real)</p>
                      <p className="text-[11px] font-semibold text-gray-600 mt-0.5">→ XGBRegressor predice: <strong>35.1</strong> accidentes</p>
                    </div>
                  </div>
                  {/* Dots */}
                  <div className="flex items-center gap-2 px-7 py-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-100" />
                    </div>
                    <span className="text-[10px] text-gray-400 italic">continúa mes a mes hasta el final del periodo solicitado (máx. 24 meses)</span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-3 bg-violet-50/50 rounded-lg p-3 border border-violet-100/30">
                  <p className="text-[11px] text-violet-700 leading-relaxed">
                    <strong>¿Por qué importa el orden?</strong> Porque los lags son la señal más fuerte. Si el mes 1 predice un valor alto,
                    el mes 2 lo &ldquo;verá&rdquo; como lag₁ y reaccionará. Esto mantiene coherencia: los pronósticos forman una cadena lógica, no son independientes.
                    Nota: los valores en <strong className="text-amber-600">naranja</strong> son predicciones previas (no datos reales), por eso la incertidumbre crece.
                  </p>
                </div>
              </div>

              <div className="bg-white/70 rounded-xl p-4 border border-violet-100/50 mb-4">
                <h6 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                  Intervalo de confianza al 95% — ¿Qué tan seguro es el pronóstico?
                </h6>
                <p className="text-[11px] text-gray-600 mb-3">
                  El modelo nunca va a acertar el número exacto. Por eso, además del pronóstico, entrega un <strong>rango</strong>:
                  un valor mínimo y máximo entre los que probablemente caerá el resultado real.
                </p>

                {/* Practical example */}
                <div className="bg-violet-50/50 rounded-lg p-4 border border-violet-100/30 mb-4">
                  <p className="text-[11px] text-violet-800 font-bold mb-2">Ejemplo concreto:</p>
                  <p className="text-[11px] text-violet-700 leading-relaxed mb-3">
                    Si el modelo dice <strong>&ldquo;33 accidentes ± 8&rdquo;</strong>, significa que con 95% de probabilidad
                    el número real estará entre <strong>25 y 41</strong>. Es como decir: &ldquo;estoy bastante seguro de que habrá entre 25 y 41 accidentes este mes&rdquo;.
                  </p>
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <div className="text-center bg-white rounded-lg px-3 py-2 border border-violet-200">
                      <p className="text-[9px] text-gray-400">Mínimo</p>
                      <p className="text-sm font-bold text-violet-600">25</p>
                    </div>
                    <div className="flex-1 max-w-[200px] relative h-6">
                      <div className="absolute inset-y-0 left-0 right-0 bg-violet-100 rounded-full" />
                      <div className="absolute inset-y-1 left-[40%] w-3 h-4 bg-violet-500 rounded-sm" />
                      <p className="absolute -bottom-4 left-[40%] -translate-x-1/2 text-[9px] font-bold text-violet-700">33</p>
                    </div>
                    <div className="text-center bg-white rounded-lg px-3 py-2 border border-violet-200">
                      <p className="text-[9px] text-gray-400">Máximo</p>
                      <p className="text-sm font-bold text-violet-600">41</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-violet-500 text-center mt-5">
                    La zona sombreada es el rango donde probablemente caerá el valor real. El punto es la predicción central.
                  </p>
                </div>

                {/* Why does uncertainty grow? */}
                <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100/30 mb-4">
                  <p className="text-[11px] text-amber-800 font-bold mb-2">¿Por qué la incertidumbre crece con el tiempo?</p>
                  <p className="text-[11px] text-amber-700/80 leading-relaxed mb-3">
                    Recuerda que los meses futuros usan <strong>predicciones anteriores como lags</strong> (valores en <strong className="text-amber-600">naranja</strong>).
                    Si el mes 1 se equivoca un poco, el mes 2 hereda ese error, y así se va acumulando.
                    Es como un &ldquo;teléfono descompuesto&rdquo;: mientras más lejos, menos confiable.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-center">
                      <p className="text-[10px] text-gray-500 mb-1">Mes siguiente</p>
                      <p className="text-sm font-bold text-emerald-700">33 ± 8</p>
                      <p className="text-[10px] text-emerald-600 mt-1">Lags son datos <strong>reales</strong></p>
                      <div className="mt-1.5 h-1.5 bg-emerald-100 rounded-full mx-2"><div className="h-full bg-emerald-400 rounded-full" style={{ width: "85%" }} /></div>
                      <p className="text-[9px] text-emerald-500 mt-1">alta confianza</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 text-center">
                      <p className="text-[10px] text-gray-500 mb-1">En 1 año</p>
                      <p className="text-sm font-bold text-amber-700">29 ± 14</p>
                      <p className="text-[10px] text-amber-600 mt-1">Lags son <strong>predicciones</strong></p>
                      <div className="mt-1.5 h-1.5 bg-amber-100 rounded-full mx-2"><div className="h-full bg-amber-400 rounded-full" style={{ width: "55%" }} /></div>
                      <p className="text-[9px] text-amber-500 mt-1">confianza media</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 border border-red-100 text-center">
                      <p className="text-[10px] text-gray-500 mb-1">En 2 años</p>
                      <p className="text-sm font-bold text-red-700">25 ± 20</p>
                      <p className="text-[10px] text-red-600 mt-1">Muchos errores <strong>acumulados</strong></p>
                      <div className="mt-1.5 h-1.5 bg-red-100 rounded-full mx-2"><div className="h-full bg-red-400 rounded-full" style={{ width: "30%" }} /></div>
                      <p className="text-[9px] text-red-500 mt-1">baja confianza</p>
                    </div>
                  </div>
                </div>

                {/* What is this in the dashboard */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-[11px] text-gray-700 font-bold mb-1">¿Dónde veo esto en el dashboard?</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    En el gráfico de pronóstico, la <strong>línea</strong> es la predicción central y la <strong>banda sombreada</strong> alrededor
                    es el intervalo de confianza. Si la banda es muy ancha, el pronóstico es menos confiable —
                    esto significa que el modelo necesita <strong>más meses de datos históricos</strong> para mejorar.
                  </p>
                </div>
              </div>

              <div className="bg-white/70 rounded-xl p-4 border border-violet-100/50 mb-4">
                <h6 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                  Distribución por Causa Raíz (RC)
                </h6>

                {/* ¿Para qué sirve? */}
                <div className="bg-violet-50/50 rounded-lg p-3 border border-violet-100/50 mb-4">
                  <p className="text-[11px] font-bold text-violet-800 mb-1">¿Para qué sirve esto?</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Saber que habrá <strong>33 accidentes</strong> el próximo mes es útil, pero no suficiente para actuar.
                    Necesitas saber <strong>de qué tipo serán</strong>: ¿serán por falta de procedimientos (RC 03)?
                    ¿Por falta de capacitación (RC 04)? ¿Por fallas en equipos (RC 06)?
                    Conocer la distribución permite <strong>enfocar los recursos de prevención</strong> donde más se necesitan.
                  </p>
                </div>

                {/* ¿Cómo funciona? - Ejemplo detallado con RC 03 */}
                <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
                  <p className="text-[11px] font-bold text-gray-700 mb-2">¿Cómo funciona? — Ejemplo completo con RC 03</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                    Es <strong>exactamente el mismo proceso</strong> que se explicó arriba para el total de accidentes, pero
                    usando <strong>solo los datos de una causa raíz</strong>. Veámoslo paso a paso con RC 03 (&quot;Falta de procedimientos&quot;):
                  </p>

                  {/* Paso 1: Datos propios de RC 03 */}
                  <div className="bg-purple-50/30 rounded-lg p-3 border border-purple-100/30 mb-3">
                    <p className="text-[11px] font-bold text-purple-800 mb-2">Paso 1: Se arma la serie temporal solo de RC 03</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-2">
                      Del total de accidentes, se filtran <strong>solo los que tienen causa raíz RC 03</strong> y se cuentan por mes:
                    </p>
                    <div className="overflow-x-auto mb-2">
                      <table className="w-full text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-purple-100/50 text-purple-700">
                            <th className="px-2 py-1.5 text-left font-bold border border-purple-100">Mes</th>
                            <th className="px-2 py-1.5 text-center font-bold border border-purple-100">Ene</th>
                            <th className="px-2 py-1.5 text-center font-bold border border-purple-100">Feb</th>
                            <th className="px-2 py-1.5 text-center font-bold border border-purple-100">Mar</th>
                            <th className="px-2 py-1.5 text-center font-bold border border-purple-100">Abr</th>
                            <th className="px-2 py-1.5 text-center font-bold border border-purple-100">May</th>
                            <th className="px-2 py-1.5 text-center font-bold border border-purple-100">Jun</th>
                            <th className="px-2 py-1.5 text-center font-bold border border-purple-100">...</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            <td className="px-2 py-1.5 font-bold text-gray-600 border border-gray-100">Acc. RC 03</td>
                            <td className="px-2 py-1.5 text-center font-bold text-purple-700 border border-gray-100">12</td>
                            <td className="px-2 py-1.5 text-center font-bold text-purple-700 border border-gray-100">8</td>
                            <td className="px-2 py-1.5 text-center font-bold text-purple-700 border border-gray-100">15</td>
                            <td className="px-2 py-1.5 text-center font-bold text-purple-700 border border-gray-100">10</td>
                            <td className="px-2 py-1.5 text-center font-bold text-purple-700 border border-gray-100">9</td>
                            <td className="px-2 py-1.5 text-center font-bold text-purple-700 border border-gray-100">14</td>
                            <td className="px-2 py-1.5 text-center text-gray-400 border border-gray-100">...</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Estos son los mismos 9 features del total (lag₁, lag₂, lag₃, rolling_mean, mes_sin, mes_cos, etc.) pero calculados <strong>solo con los datos de RC 03</strong>.
                    </p>
                  </div>

                  {/* Paso 2: Base y árbol */}
                  <div className="bg-purple-50/30 rounded-lg p-3 border border-purple-100/30 mb-3">
                    <p className="text-[11px] font-bold text-purple-800 mb-2">Paso 2: Se entrena el XGBoost solo para RC 03</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-2">
                      El promedio histórico de RC 03 es <strong>11.0 accidentes/mes</strong>. Este es su punto de partida (base).
                      Luego, los árboles de decisión corrigen ese promedio según las características del mes a predecir.
                    </p>

                    {/* Mini tree for RC 03 */}
                    <div className="bg-white rounded-lg p-3 border border-purple-100 mb-3 overflow-x-auto">
                      <p className="text-[10px] font-bold text-gray-500 mb-3 text-center">Árbol 1 del modelo RC 03 (ejemplo simplificado)</p>
                      <div className="min-w-[500px]">
                        {/* Root */}
                        <div className="flex justify-center mb-1">
                          <div className="bg-purple-50 rounded-xl px-4 py-2 border-2 border-purple-200 text-center max-w-[260px]">
                            <p className="text-[10px] text-gray-500">¿El mes pasado hubo muchos RC 03?</p>
                            <p className="text-[10px] font-mono text-purple-600 font-bold">lag₁ &gt; 13?</p>
                          </div>
                        </div>
                        {/* Branches level 1 */}
                        <div className="flex justify-center mb-1">
                          <div className="flex items-start" style={{ width: 400 }}>
                            <div className="w-1/2 flex flex-col items-center">
                              <span className="text-[10px] font-bold text-gray-300 px-2 py-0.5">SÍ</span>
                              <div className="w-[2px] h-3 bg-gray-200" />
                            </div>
                            <div className="w-1/2 flex flex-col items-center">
                              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">NO → 10 &lt; 13 ✓</span>
                              <div className="w-[2px] h-3 bg-purple-400" />
                            </div>
                          </div>
                        </div>
                        {/* Level 2 nodes */}
                        <div className="flex justify-center mb-1">
                          <div className="flex gap-4" style={{ width: 420 }}>
                            <div className="flex-1 flex justify-center">
                              <div className="bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100 text-center opacity-40">
                                <p className="text-[10px] text-gray-500">¿Invierno?</p>
                                <p className="text-[10px] font-mono text-gray-400">mes_sin &gt; 0.5?</p>
                              </div>
                            </div>
                            <div className="flex-1 flex justify-center">
                              <div className="bg-purple-50 rounded-lg px-3 py-1.5 border-2 border-purple-200 text-center">
                                <p className="text-[10px] text-gray-500">¿Tendencia RC 03 subiendo?</p>
                                <p className="text-[10px] font-mono text-purple-600 font-bold">rolling_mean &gt; 11?</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Branches level 2 */}
                        <div className="flex justify-center mb-1">
                          <div className="flex gap-4" style={{ width: 420 }}>
                            <div className="flex-1 flex items-start">
                              <div className="w-1/2 flex flex-col items-center">
                                <div className="w-[2px] h-3 bg-gray-100" />
                              </div>
                              <div className="w-1/2 flex flex-col items-center">
                                <div className="w-[2px] h-3 bg-gray-100" />
                              </div>
                            </div>
                            <div className="flex-1 flex items-start">
                              <div className="w-1/2 flex flex-col items-center">
                                <span className="text-[10px] font-bold text-gray-300">SÍ</span>
                                <div className="w-[2px] h-3 bg-gray-200" />
                              </div>
                              <div className="w-1/2 flex flex-col items-center">
                                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">NO ✓</span>
                                <div className="w-[2px] h-3 bg-purple-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Leaves */}
                        <div className="flex justify-center">
                          <div className="flex gap-2" style={{ width: 440 }}>
                            <div className="flex-1 rounded-lg px-2 py-2 text-center border bg-gray-50 border-gray-100 opacity-30">
                              <span className="text-[10px] font-bold text-gray-500">+1.5</span>
                            </div>
                            <div className="flex-1 rounded-lg px-2 py-2 text-center border bg-gray-50 border-gray-100 opacity-30">
                              <span className="text-[10px] font-bold text-gray-500">+0.6</span>
                            </div>
                            <div className="flex-1 rounded-lg px-2 py-2 text-center border bg-gray-50 border-gray-200 opacity-40">
                              <span className="text-[10px] font-bold text-gray-500">+0.8</span>
                            </div>
                            <div className="flex-1 rounded-lg px-2 py-2 text-center border-2 bg-purple-100 border-purple-400 ring-2 ring-purple-300/50">
                              <span className="text-[10px] font-bold text-purple-700">-0.4</span>
                              <span className="text-[9px] text-purple-500 block">← Llega aquí</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/70 rounded-lg p-2.5 border border-purple-100">
                      <p className="text-[10px] text-purple-800 leading-relaxed">
                        <strong>Misma lógica que el total:</strong> las preguntas son sobre los features de RC 03 (su lag₁, su rolling_mean).
                        El -0.4 sale de los meses en que RC 03 tuvo lag bajo y tendencia estable → históricamente fueron ligeramente menores al promedio de RC 03.
                      </p>
                    </div>
                  </div>

                  {/* Paso 3: Corrección progresiva */}
                  <div className="bg-purple-50/30 rounded-lg p-3 border border-purple-100/30 mb-3">
                    <p className="text-[11px] font-bold text-purple-800 mb-2">Paso 3: Los árboles corrigen progresivamente (igual que el total)</p>
                    <div className="overflow-x-auto mb-3">
                      <table className="w-full text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-purple-50 text-purple-700">
                            <th className="px-2 py-1.5 text-left font-bold border border-purple-100">Paso</th>
                            <th className="px-2 py-1.5 text-left font-bold border border-purple-100">¿Qué mira?</th>
                            <th className="px-2 py-1.5 text-center font-bold border border-purple-100">Corrección</th>
                            <th className="px-2 py-1.5 text-center font-bold border border-purple-100">Predicción RC 03</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { paso: "Base", mira: "Promedio de RC 03 en todos los meses", corr: "—", pred: "11.0" },
                            { paso: "Árbol 1", mira: "lag₁ de RC 03 bajo, tendencia estable → bajar", corr: "-0.4", pred: "10.6" },
                            { paso: "Árbol 2", mira: "Es otoño, RC 03 sube en otoño → subir", corr: "+0.3", pred: "10.9" },
                            { paso: "Árbol 3", mira: "rolling_mean RC 03 bajo → bajar", corr: "-0.5", pred: "10.4" },
                            { paso: "...", mira: "cada árbol corrige el error de RC 03", corr: "...", pred: "..." },
                            { paso: "Árbol 40", mira: "ajuste fino residual", corr: "+0.1", pred: "10.7" },
                          ].map((r, i) => (
                            <tr key={i} className={r.paso === "..." ? "bg-gray-50/50" : r.paso === "Base" ? "bg-purple-50/30" : i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}>
                              <td className="px-2 py-1.5 font-bold text-gray-700 border border-gray-100">{r.paso}</td>
                              <td className="px-2 py-1.5 text-gray-600 border border-gray-100">{r.mira}</td>
                              <td className="px-2 py-1.5 text-center font-mono font-bold text-purple-700 border border-gray-100">{r.corr}</td>
                              <td className="px-2 py-1.5 text-center font-bold text-gray-700 border border-gray-100">{r.pred}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Final result for RC 03 */}
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                        <div className="text-center bg-white rounded-lg px-3 py-1.5 border border-gray-200">
                          <p className="text-[9px] text-gray-400">Base RC 03</p>
                          <p className="text-sm font-bold text-gray-700">11.0</p>
                        </div>
                        <span className="text-base font-bold text-gray-400">+</span>
                        <div className="text-center bg-white rounded-lg px-3 py-1.5 border border-purple-200">
                          <p className="text-[9px] text-purple-500">Σ correcciones</p>
                          <p className="text-sm font-bold text-purple-700">-0.3</p>
                        </div>
                        <span className="text-base font-bold text-gray-400">=</span>
                        <div className="text-center bg-purple-500 rounded-lg px-4 py-1.5 shadow-md shadow-purple-500/20">
                          <p className="text-[9px] text-purple-100">Predicción RC 03</p>
                          <p className="text-lg font-bold text-white">10.7</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Esto se repite para cada RC */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-3">
                    <p className="text-[11px] font-bold text-gray-700 mb-2">Esto se repite para cada Causa Raíz</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-2">
                      El mismo proceso ocurre en paralelo para <strong>cada RC que tenga suficientes datos</strong> (6+ meses):
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { rc: "RC 03", desc: "Falta de procedimientos", base: "11.0", result: "10.7", color: "purple" },
                        { rc: "RC 05", desc: "Condiciones de infraestructura", base: "9.5", result: "9.8", color: "blue" },
                        { rc: "RC 06", desc: "Falla de equipos", base: "5.5", result: "5.1", color: "emerald" },
                        { rc: "RC 13", desc: "Fatiga o estrés", base: "4.0", result: "3.9", color: "amber" },
                      ].map((item) => {
                        const bgMap: Record<string, string> = { purple: "bg-purple-50/50 border-purple-100/50", blue: "bg-blue-50/50 border-blue-100/50", emerald: "bg-emerald-50/50 border-emerald-100/50", amber: "bg-amber-50/50 border-amber-100/50" };
                        const badgeMap: Record<string, string> = { purple: "bg-purple-100 text-purple-700", blue: "bg-blue-100 text-blue-700", emerald: "bg-emerald-100 text-emerald-700", amber: "bg-amber-100 text-amber-700" };
                        const valMap: Record<string, string> = { purple: "text-purple-700", blue: "text-blue-700", emerald: "text-emerald-700", amber: "text-amber-700" };
                        return (
                          <div key={item.rc} className={`flex items-center gap-3 rounded-lg px-3 py-2 border ${bgMap[item.color]}`}>
                            <span className={`${badgeMap[item.color]} px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 min-w-[3rem] text-center`}>{item.rc}</span>
                            <p className="text-[10px] text-gray-500 flex-1 min-w-0">{item.desc}</p>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] text-gray-400">base {item.base}</span>
                              <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              <span className={`text-sm font-bold ${valMap[item.color]}`}>{item.result}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ¿Qué pasa con causas raras? */}
                <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100/50 mb-4">
                  <p className="text-[11px] font-bold text-amber-800 mb-2">¿Y las causas que ocurren poco?</p>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-3 flex-1 bg-white/70 rounded-lg px-3 py-2 border border-amber-100/50">
                      <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 min-w-[3.5rem] text-center">RC 25</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-400">Ene: 1 → Feb: 0 → Mar: 2 → Abr: 0 → ...</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed mt-2">
                    Si una causa tiene <strong>menos de 6 meses con datos</strong>, no hay suficiente historial para que el modelo aprenda patrones.
                    En ese caso se usa un método más simple: se calcula <strong>qué porcentaje del total representó esa causa</strong> en el último año
                    y se aplica ese mismo porcentaje al pronóstico. Es como decir: &quot;si RC 25 fue el 4% el año pasado,
                    será aproximadamente el 4% el mes que viene&quot;.
                  </p>
                </div>

                {/* El ajuste final */}
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <p className="text-[11px] font-bold text-emerald-800 mb-2">El ajuste final: que todo cuadre</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                    Cada modelo predice por separado, así que las sumas no calzan exactamente con el total pronosticado.
                    Por ejemplo, si los modelos individuales predicen <strong>35.1</strong> en total pero el pronóstico general dice <strong>33.4</strong>,
                    se ajustan proporcionalmente:
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-emerald-100">
                    <div className="grid grid-cols-3 gap-2 text-center mb-2">
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1">Antes del ajuste</p>
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="bg-purple-50 rounded px-1.5 py-0.5 border border-purple-100">
                            <p className="text-[9px] text-gray-400">RC 03</p>
                            <p className="text-[11px] font-bold text-gray-600">11.2</p>
                          </div>
                          <div className="bg-blue-50 rounded px-1.5 py-0.5 border border-blue-100">
                            <p className="text-[9px] text-gray-400">RC 05</p>
                            <p className="text-[11px] font-bold text-gray-600">9.8</p>
                          </div>
                          <div className="bg-emerald-50 rounded px-1.5 py-0.5 border border-emerald-100">
                            <p className="text-[9px] text-gray-400">...</p>
                            <p className="text-[11px] font-bold text-gray-600">14.1</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Suma = <strong className="text-gray-600">35.1</strong></p>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1">Después del ajuste</p>
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="bg-purple-50 rounded px-1.5 py-0.5 border border-purple-100">
                            <p className="text-[9px] text-gray-400">RC 03</p>
                            <p className="text-[11px] font-bold text-purple-700">10.7</p>
                          </div>
                          <div className="bg-blue-50 rounded px-1.5 py-0.5 border border-blue-100">
                            <p className="text-[9px] text-gray-400">RC 05</p>
                            <p className="text-[11px] font-bold text-blue-700">9.3</p>
                          </div>
                          <div className="bg-emerald-50 rounded px-1.5 py-0.5 border border-emerald-100">
                            <p className="text-[9px] text-gray-400">...</p>
                            <p className="text-[11px] font-bold text-emerald-700">13.4</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-emerald-600 mt-1 font-semibold">Suma = <strong>33.4</strong></p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                      Se multiplica cada RC por el mismo factor (33.4 / 35.1 = 0.95) para que sumen exactamente el total.
                      Así la <strong>proporción entre causas se mantiene</strong> pero el total cuadra.
                    </p>
                  </div>
                </div>

                {/* ¿Dónde veo esto? */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 mt-4">
                  <p className="text-[11px] text-gray-700 font-bold mb-1">¿Dónde veo esto en el dashboard?</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    En la sección de pronóstico aparecen dos cosas: el <strong>gráfico de barras</strong> que muestra cuántos accidentes
                    se esperan por cada causa raíz, y la <strong>tabla &quot;Distribución por Causa Raíz&quot;</strong> con el número exacto,
                    porcentaje y barra de proporción de cada RC.
                  </p>
                </div>
              </div>

              {/* ── Result summary ── */}
              <div className="mt-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-5 border border-emerald-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-emerald-800">Resultado final del pronóstico</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white/70 rounded-lg p-3 border border-emerald-200/50">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <h5 className="text-xs font-bold text-emerald-700">¿Cuántos accidentes habrá?</h5>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Un <strong>número por cada mes futuro</strong> con banda de confianza al 95%.
                    El gráfico de tendencia muestra la línea histórica y la proyección con su banda.
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg p-3 border border-emerald-200/50">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <h5 className="text-xs font-bold text-purple-700">¿Qué tipo de Causa Raíz tendrán?</h5>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    La <strong>distribución estimada por RC</strong>: cuántos serán RC 03, cuántos RC 05, etc.
                    El gráfico de barras muestra la proporción predicha de cada categoría.
                  </p>
                </div>
              </div>
            </div>

            {/* ── ¿Qué pasa al presionar Pronosticar? ── */}
            <div className="mt-4 bg-white/70 rounded-xl p-5 border border-blue-100/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-blue-800">¿Qué pasa cuando presionas &quot;Pronosticar&quot;?</h4>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                Todo lo explicado arriba (Fases 1 a 4) ocurre <strong>automáticamente</strong> cada vez que presionas el botón.
                El sistema ejecuta esta secuencia completa en el servidor:
              </p>

              {/* Timeline visual */}
              <div className="space-y-0">
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-white text-[10px] font-bold">1</span>
                    </div>
                    <div className="w-[2px] flex-1 bg-blue-200" />
                  </div>
                  <div className="pb-3">
                    <p className="text-[11px] font-bold text-gray-700">Cuenta los accidentes totales por mes</p>
                    <p className="text-[10px] text-gray-500">
                      Con los datos que subiste, agrupa todos los accidentes por mes: Ene: 77, Feb: 65, Mar: 82...
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-white text-[10px] font-bold">2</span>
                    </div>
                    <div className="w-[2px] flex-1 bg-blue-200" />
                  </div>
                  <div className="pb-3">
                    <p className="text-[11px] font-bold text-gray-700">Entrena el modelo del total</p>
                    <p className="text-[10px] text-gray-500">
                      Calcula los 9 features (lags, rolling_mean, mes_sin, etc.) y entrena un XGBRegressor
                      para predecir cuántos accidentes habrá en total cada mes futuro.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-white text-[10px] font-bold">3</span>
                    </div>
                    <div className="w-[2px] flex-1 bg-blue-200" />
                  </div>
                  <div className="pb-3">
                    <p className="text-[11px] font-bold text-gray-700">Predice el total mes a mes</p>
                    <p className="text-[10px] text-gray-500">
                      Genera la predicción iterativa: mes 1 → mes 2 → ... usando cada predicción como lag del siguiente.
                      Ya tiene el total estimado (ej: 33 para marzo).
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-white text-[10px] font-bold">4</span>
                    </div>
                    <div className="w-[2px] flex-1 bg-purple-200" />
                  </div>
                  <div className="pb-3">
                    <p className="text-[11px] font-bold text-gray-700">Para cada RC, arma su serie temporal propia</p>
                    <p className="text-[10px] text-gray-500">
                      Recorre cada causa raíz (RC 03, RC 05, RC 06...) y filtra solo los accidentes de ese tipo.
                      Si RC 03 tuvo Ene:12, Feb:8, Mar:15... esos son sus datos.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-white text-[10px] font-bold">5</span>
                    </div>
                    <div className="w-[2px] flex-1 bg-purple-200" />
                  </div>
                  <div className="pb-3">
                    <p className="text-[11px] font-bold text-gray-700">Entrena un XGBRegressor por cada RC (si tiene 6+ meses)</p>
                    <p className="text-[10px] text-gray-500">
                      Calcula los mismos 9 features pero con los datos de esa RC y entrena un modelo independiente.
                      Si la RC tiene menos de 6 meses con datos, no entrena modelo y usa proporción histórica.
                    </p>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-white text-[10px] font-bold">6</span>
                    </div>
                    <div className="w-[2px] flex-1 bg-purple-200" />
                  </div>
                  <div className="pb-3">
                    <p className="text-[11px] font-bold text-gray-700">Predice cada RC mes a mes</p>
                    <p className="text-[10px] text-gray-500">
                      Cada modelo de RC predice iterativamente (igual que el total) cuántos accidentes de su tipo habrá.
                    </p>
                  </div>
                </div>

                {/* Step 7 */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-white text-[10px] font-bold">7</span>
                    </div>
                  </div>
                  <div className="pb-1">
                    <p className="text-[11px] font-bold text-gray-700">Normaliza para que las RC sumen el total</p>
                    <p className="text-[10px] text-gray-500">
                      Ajusta proporcionalmente cada RC para que la suma cuadre con el total pronosticado en el paso 3.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/70 rounded-lg p-2.5 border border-blue-100 mt-3">
                <p className="text-[10px] text-blue-700 leading-relaxed">
                  <strong>Todo esto ocurre en segundos.</strong> Si tienes 8 causas raíz con datos suficientes, el sistema entrena
                  <strong> 9 modelos</strong> (1 del total + 8 de RC). Por eso puede tardar un poco — no es un solo modelo, son varios trabajando en paralelo.
                </p>
              </div>
            </div>

            </div>
          </div>

        </div>


        {/* ── Regressor Metrics Guide ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-gray-700">Métricas del Modelo de Pronóstico (XGBRegressor)</h4>
          </div>
          <p className="text-xs text-gray-400 mb-4 ml-10">
            Estas métricas evalúan qué tan bien el <strong className="text-gray-500">XGBRegressor</strong> ajusta los datos históricos.
            Se calculan cada vez que generas un pronóstico y aparecen sobre los gráficos.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-bold">MAE</span>
                <span className="text-xs font-semibold text-gray-600">Error Absoluto Medio</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Promedio de las diferencias absolutas entre lo predicho y lo real.
                <strong className="text-gray-600"> Ejemplo:</strong> MAE = 2.5 significa que, en promedio,
                el modelo se equivoca por 2.5 accidentes al mes. Menor es mejor.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-bold">RMSE</span>
                <span className="text-xs font-semibold text-gray-600">Error Cuadrático Medio</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Similar al MAE, pero penaliza más los errores grandes (los eleva al cuadrado).
                <strong className="text-gray-600"> Útil para detectar</strong> si el modelo tiene meses con errores muy altos.
                Menor es mejor.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-bold">R²</span>
                <span className="text-xs font-semibold text-gray-600">Coeficiente de Determinación</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Proporción de variabilidad explicada por el modelo, de 0 a 1.
                <strong className="text-gray-600"> R² = 0.85</strong> significa que el modelo explica el 85% de la variación mensual.
                Mayor es mejor; sobre 0.7 es bueno.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-bold">&sigma;</span>
                <span className="text-xs font-semibold text-gray-600">Desviación Estándar Residual</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Dispersión típica de los errores del modelo. Se usa para calcular el
                <strong className="text-gray-600"> intervalo de confianza al 95%</strong> (la banda sombreada en el gráfico).
                Menor es mejor; indica predicciones más estables.
              </p>
            </div>
          </div>
        </div>

        {/* ── Pipeline - Always visible ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-gray-700">¿Cómo funciona? — Pipeline de Machine Learning</h4>
          </div>
          <p className="text-xs text-gray-400 mb-4 ml-10">
            El modelo sigue un proceso de 4 pasos para aprender a pronosticar accidentes. Cada paso es esencial:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
            <PipelineStep
              number={1}
              title="Carga de Datos"
              description="Se lee el archivo Excel con la nómina de accidentes. Cada fila es un accidente con: fecha, turno, cargo, empresa, gerencia, edad, descripción y la causa raíz (RC)."
              color="blue"
            />
            <PipelineStep
              number={2}
              title="Limpieza"
              description="Se eliminan duplicados, se unifican nombres (ej: 'GDR'→'GRS'), se remueven categorías inválidas y se imputan datos faltantes para asegurar consistencia."
              color="cyan"
            />
            <PipelineStep
              number={3}
              title="Ingeniería de Features"
              description="Se crean variables útiles: del texto se extraen palabras clave (TF-IDF), de la fecha se obtiene día, mes, estacionalidad. Las categorías se codifican numéricamente."
              color="violet"
            />
            <PipelineStep
              number={4}
              title="Entrenamiento XGBoost"
              description="El algoritmo construye cientos de árboles de decisión que aprenden patrones. Se reserva 20% de datos para evaluar. El modelo final se guarda para predecir."
              color="emerald"
            />
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h5 className="text-xs font-bold text-gray-600 mb-2">Variables que usa el modelo para predecir:</h5>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Fecha", desc: "Temporal", tip: "Se extraen: año, mes, día de semana, trimestre, estacionalidad" },
                { name: "Turno", desc: "Categórica", tip: "Turno en que ocurrió el accidente (día, noche, etc.)" },
                { name: "Cargo", desc: "Categórica", tip: "Cargo o puesto de trabajo del accidentado" },
                { name: "Empresa", desc: "Categórica", tip: "Empresa contratista o propia donde trabaja" },
                { name: "Gerencia", desc: "Categórica", tip: "Gerencia o área de la operación minera" },
                { name: "Edad", desc: "Numérica", tip: "Edad del trabajador al momento del accidente" },
                { name: "Sexo", desc: "Categórica", tip: "Sexo biológico del trabajador" },
                { name: "Descripción", desc: "Texto → TF-IDF", tip: "Se extraen las 100 palabras/frases más relevantes del texto" },
              ].map((f) => (
                <div key={f.name} className="group relative">
                  <span className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs inline-block cursor-default">
                    <strong className="text-gray-700">{f.name}</strong>
                    <span className="text-gray-400 ml-1">({f.desc})</span>
                  </span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-gray-800 text-white text-[11px] rounded-lg p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none leading-relaxed shadow-xl text-center">
                    {f.tip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 -mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* ── Classes - Always visible with descriptions ── */}
        {info.clases && info.clases.length > 0 && (
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-gray-700">
                Clases del Modelo ({info.clases.length}) — Causas Raíz (RC)
              </h4>
            </div>
            <p className="text-xs text-gray-400 mb-4 ml-10">
              La <strong className="text-gray-500">Causa Raíz (RC)</strong> es la razón fundamental por la que ocurrió un accidente.
              Identificarla correctamente permite tomar acciones preventivas específicas.
              El modelo predice entre estas {info.clases.length} categorías:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {info.clases.map((cls) => (
                <div key={cls} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 min-w-[4.5rem] text-center">
                    {cls}
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {RC_DESCRIPTIONS[cls] || "Categoría de causa raíz del accidente"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Expected File Format ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-gray-700">Formato esperado de la Nómina AT</h4>
          </div>
          <p className="text-xs text-gray-400 mb-4 ml-10">
            El archivo Excel debe contener una hoja llamada <strong className="text-gray-500">&quot;Nomina AT&quot;</strong> con las siguientes 12 columnas
          </p>

          {/* Column table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                  <th className="text-left px-3 py-2.5 font-semibold rounded-tl-xl">Columna</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-emerald-300">Correcto</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-red-300">Incorrecto</th>
                  <th className="text-left px-3 py-2.5 font-semibold rounded-tr-xl">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-blue-50/40">
                  <td className="px-3 py-2.5">
                    <code className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold text-[10px]">Fecha</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">15-03-2024</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">marzo 2024</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">(vacío)</code>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">Fecha exacta del accidente. Formato fecha de Excel o DD-MM-AAAA.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5">
                    <code className="bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded font-bold text-[10px]">RC</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">RC 03</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">RC03</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">rc 03</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">3</code>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500"><strong className="text-violet-600">Variable objetivo.</strong> &quot;RC&quot; + espacio + dos dígitos.</td>
                </tr>
                <tr className="bg-blue-50/40">
                  <td className="px-3 py-2.5">
                    <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold text-[10px]">Turno</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">A</code>{" "}
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">B</code>{" "}
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">C</code>{" "}
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">D</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">Turno A</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">noche</code>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">Turno del accidente. Una sola letra en mayúscula.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5">
                    <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold text-[10px]">Gcia.</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">GRS</code>{" "}
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">GMIN</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">Gerencia Recursos</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">grs</code>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">Sigla de la gerencia en mayúsculas según nomenclatura interna.</td>
                </tr>
                <tr className="bg-blue-50/40">
                  <td className="px-3 py-2.5">
                    <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold text-[10px]">Empresa</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">Aramark</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">ARAMARK</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">aramark ltda.</code>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">Nombre de la empresa. Usar siempre el mismo nombre para la misma empresa.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5">
                    <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold text-[10px]">Cargo</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">Operador</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">op.</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">OPERADOR MINA</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">(vacío)</code>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">Cargo del trabajador. Usar nombre completo y consistente.</td>
                </tr>
                <tr className="bg-blue-50/40">
                  <td className="px-3 py-2.5">
                    <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold text-[10px]">CATEGORIA</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">CTP</code>{" "}
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">STP</code>{" "}
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">SPP</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">COMUN</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">N/A</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">Duplicado</code>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">Categoría válida del accidente. Los valores incorrectos se descartan automáticamente.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5">
                    <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold text-[10px]">Tipo</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">AT</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">TY</code>
                    <span className="text-[9px] text-gray-400 ml-1">(se excluye)</span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">AT = accidente del trabajo. Los de trayecto (TY) se filtran automáticamente.</td>
                </tr>
                <tr className="bg-blue-50/40">
                  <td className="px-3 py-2.5">
                    <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold text-[10px]">Edad</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">35</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">treinta y cinco</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">-1</code>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">Edad en años como número entero. Si falta, se estima por el cargo.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5">
                    <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold text-[10px]">Sexo</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">M</code>{" "}
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">F</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">Masculino</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">-</code>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">Una letra: M (masculino) o F (femenino).</td>
                </tr>
                <tr className="bg-blue-50/40">
                  <td className="px-3 py-2.5">
                    <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold text-[10px]">Lugar</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-emerald-50 text-emerald-700 px-1 rounded text-[9px]">Rajo Inca</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">(vacío)</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">-</code>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">Lugar del accidente. Registros sin lugar se descartan.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5">
                    <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold text-[10px]">Descripción</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[9px] text-emerald-700 italic">Trabajador sufre corte en mano al manipular...</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">accidente</code>{" "}
                    <code className="bg-red-50 text-red-500 px-1 rounded text-[9px] line-through">(vacío)</code>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">Relato detallado del accidente. A más detalle, mejor análisis de texto.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="mt-3 space-y-2">
            <div className="flex items-start gap-2 bg-amber-50/60 rounded-lg px-3 py-2.5 border border-amber-100">
              <svg className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-[10px] text-amber-700 leading-relaxed">
                <strong>Nombre de hoja:</strong> el archivo debe tener una hoja llamada exactamente <code className="bg-amber-100 px-1 rounded text-[9px]">Nomina AT</code>.
                Si la hoja tiene otro nombre, el sistema no podrá leer los datos.
              </p>
            </div>
            <div className="flex items-start gap-2 bg-amber-50/60 rounded-lg px-3 py-2.5 border border-amber-100">
              <svg className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-[10px] text-amber-700 leading-relaxed">
                <strong>Nombres exactos:</strong> los nombres de las columnas deben coincidir tal cual (mayúsculas, tildes, puntos).
                Por ejemplo, <code className="bg-amber-100 px-1 rounded text-[9px]">Gcia.</code> con punto final.
              </p>
            </div>
            <div className="flex items-start gap-2 bg-blue-50/60 rounded-lg px-3 py-2.5 border border-blue-100">
              <svg className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[10px] text-blue-700 leading-relaxed">
                <strong>Valores que se filtran automáticamente:</strong> registros con Tipo <code className="bg-blue-100 px-1 rounded text-[9px]">TY</code> (trayecto),
                categorías como <code className="bg-blue-100 px-1 rounded text-[9px]">COMUN</code>, <code className="bg-blue-100 px-1 rounded text-[9px]">IOP</code>, <code className="bg-blue-100 px-1 rounded text-[9px]">Duplicado</code>,
                y filas sin Lugar o sin Gerencia son descartados durante la limpieza.
              </p>
            </div>
          </div>
        </div>

        {/* ── How to Improve the Model ── */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-gray-700">Cómo mejorar la calidad del pronóstico</h4>
          </div>
          <p className="text-xs text-gray-400 mb-4 ml-10">
            La precisión del modelo depende directamente de la nómina AT que se suba al sistema
          </p>

          <div className="space-y-2.5">
            {/* Item 1 */}
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <span className="text-white text-[10px] font-bold">1</span>
                </span>
                <div>
                  <p className="text-xs font-semibold text-emerald-800">Subir al menos 12 meses continuos de datos</p>
                  <p className="text-[11px] text-emerald-600/80 mt-1 leading-relaxed">
                    El modelo necesita ver al menos un ciclo anual completo para distinguir patrones estacionales
                    reales (ej. más accidentes en invierno) de variaciones aleatorias.
                    Con menos de 6 meses los pronósticos son muy inciertos.
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="text-[10px] text-gray-500">&lt;6 meses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-[10px] text-gray-500">6-11 meses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-gray-500">12+ meses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <span className="text-white text-[10px] font-bold">2</span>
                </span>
                <div>
                  <p className="text-xs font-semibold text-emerald-800">Mantener la nómina actualizada</p>
                  <p className="text-[11px] text-emerald-600/80 mt-1 leading-relaxed">
                    Cada vez que se registren nuevos accidentes, subir la nómina actualizada.
                    El modelo se re-entrena automáticamente con cada pronóstico, así que datos más
                    recientes significan predicciones más alineadas con la realidad actual.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <span className="text-white text-[10px] font-bold">3</span>
                </span>
                <div>
                  <p className="text-xs font-semibold text-emerald-800">Completar todas las columnas</p>
                  <p className="text-[11px] text-emerald-600/80 mt-1 leading-relaxed">
                    Verificar que cada registro tenga <strong>fecha</strong>, <strong>Causa Raíz (RC)</strong>, <strong>gerencia</strong>,
                    {" "}<strong>turno</strong> y <strong>edad</strong> correctamente llenados.
                    Filas con datos vacíos o inconsistentes se descartan y reducen la cantidad de información
                    disponible para entrenar.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 4 */}
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <span className="text-white text-[10px] font-bold">4</span>
                </span>
                <div>
                  <p className="text-xs font-semibold text-emerald-800">Usar códigos de RC consistentes</p>
                  <p className="text-[11px] text-emerald-600/80 mt-1 leading-relaxed">
                    Si una misma causa aparece escrita de formas distintas (ej. &quot;RC 03&quot; vs &quot;RC03&quot; vs &quot;rc 03&quot;),
                    el modelo las trata como categorías separadas y pierde capacidad de predicción.
                    Mantener una nomenclatura uniforme es clave.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 5 */}
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <span className="text-white text-[10px] font-bold">5</span>
                </span>
                <div>
                  <p className="text-xs font-semibold text-emerald-800">No dejar meses sin registrar</p>
                  <p className="text-[11px] text-emerald-600/80 mt-1 leading-relaxed">
                    Si en un mes hubo 0 accidentes, es importante que ese mes exista en la nómina
                    (aunque sea sin registros). Un &quot;hueco&quot; en la línea de tiempo hace que el modelo
                    interprete mal la tendencia y puede inflar o subestimar el pronóstico.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 6 */}
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <span className="text-white text-[10px] font-bold">6</span>
                </span>
                <div>
                  <p className="text-xs font-semibold text-emerald-800">Verificar las fechas</p>
                  <p className="text-[11px] text-emerald-600/80 mt-1 leading-relaxed">
                    Fechas en formato incorrecto, fuera de rango o duplicadas generan ruido.
                    Asegurar que cada accidente tenga una fecha válida y que no haya registros
                    duplicados del mismo evento.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">En resumen</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Una nómina AT <strong className="text-gray-600">completa, consistente y actualizada</strong> es
                  lo que más impacta en la calidad de los pronósticos. El modelo aprende
                  exclusivamente de los datos que recibe: mientras mejores sean, mejores serán las predicciones.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


/* ── Helper Components ── */

function DualTreeNode({ humanQ, machineQ, machineVal, active, dimmed }: {
  humanQ: string;
  machineQ: string;
  machineVal: string;
  active?: boolean;
  dimmed?: boolean;
}) {
  return (
    <div className={`rounded-xl border-2 overflow-hidden shadow-sm max-w-[280px] w-full ${
      dimmed
        ? "border-gray-200 opacity-35"
        : active
        ? "border-violet-400 ring-2 ring-violet-300/30"
        : "border-violet-300"
    }`}>
      {/* Human perspective */}
      <div className={`px-3 py-2 ${dimmed ? "bg-gray-50" : "bg-violet-50"}`}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <svg className="w-3 h-3 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[9px] font-semibold text-violet-400 uppercase tracking-wide">Persona pregunta</span>
        </div>
        <p className="text-[11px] font-semibold text-violet-800 leading-snug">{humanQ}</p>
      </div>
      {/* Machine perspective */}
      <div className={`px-3 py-2 border-t ${dimmed ? "bg-gray-50/50 border-gray-100" : "bg-blue-50/50 border-violet-200/50"}`}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <svg className="w-3 h-3 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-[9px] font-semibold text-blue-400 uppercase tracking-wide">Máquina evalúa</span>
        </div>
        <p className="text-[11px] font-mono font-semibold text-blue-700">{machineQ}</p>
        <p className={`text-[10px] mt-0.5 font-mono ${dimmed ? "text-gray-400" : "text-blue-500"}`}>{machineVal}</p>
      </div>
    </div>
  );
}

function DataTransform({ id, raw, transformed, explanation }: { id: string; raw: string; transformed: string; explanation: string }) {
  return (
    <div className="flex items-center gap-2 bg-violet-50/50 rounded-lg px-3 py-2 border border-violet-100/30" data-id={id}>
      <code className="text-[11px] font-mono text-violet-700 shrink-0">{raw}</code>
      <span className="text-violet-500 font-bold text-sm shrink-0">{transformed}</span>
      <span className="text-[10px] text-violet-400 italic hidden sm:inline">({explanation})</span>
    </div>
  );
}



function WhyItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white/60 rounded-lg p-3 border border-blue-100/50">
      <h5 className="text-xs font-bold text-blue-700 mb-1">{title}</h5>
      <p className="text-[11px] text-blue-600/80 leading-relaxed">{text}</p>
    </div>
  );
}

function PipelineStep({ number, title, description, color }: { number: number; title: string; description: string; color: string }) {
  const colorStyles: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    cyan: "from-cyan-500 to-cyan-600",
    violet: "from-violet-500 to-violet-600",
    emerald: "from-emerald-500 to-emerald-600",
  };

  return (
    <div className="relative bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorStyles[color]} flex items-center justify-center mb-3 shadow-sm`}>
        <span className="text-white text-sm font-bold">{number}</span>
      </div>
      <h5 className="text-xs font-bold text-gray-700 mb-1">{title}</h5>
      <p className="text-[11px] text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

