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
            <strong>Paso 2:</strong> Presiona &quot;Entrenar Modelo&quot; para que el sistema aprenda a clasificar las causas raíz.
          </p>
        </div>
      </div>
    );
  }

  const fechaStr = info.fecha_entrenamiento
    ? new Date(info.fecha_entrenamiento).toLocaleString("es-CL", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

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
              <h3 className="text-base font-bold text-gray-800 mb-1">Modelo de Clasificación de Causa Raíz (XGBoost)</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Este es un modelo de <strong className="text-gray-700">inteligencia artificial</strong> que analiza los datos de cada accidente
                (fecha, turno, cargo, empresa, gerencia, edad, descripción) y <strong className="text-gray-700">predice automáticamente
                la causa raíz (RC)</strong> más probable. Utiliza el algoritmo <strong className="text-gray-700">XGBoost</strong>,
                uno de los más potentes para clasificación, que aprende patrones de los accidentes históricos.
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
                title="Manejo de clases desbalanceadas"
                text="En accidentes laborales, algunas causas raíz son mucho más frecuentes que otras. XGBoost permite asignar pesos diferenciados a cada clase para manejar este desbalance."
              />
              <WhyItem
                title="Robusto ante datos imperfectos"
                text="Los datos reales contienen valores faltantes, categorías inconsistentes y ruido. XGBoost maneja nativamente estos problemas sin perder rendimiento."
              />
              <WhyItem
                title="Combina múltiples señales"
                text="Integra variables numéricas (edad), categóricas (turno, empresa), temporales (fecha) y de texto (descripción via TF-IDF) en un solo modelo coherente."
              />
            </div>
          </div>

          {/* How does the forecast work internally - VISUAL */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h4 className="text-sm font-bold text-emerald-800">¿Cómo calcula el pronóstico de accidentes?</h4>
            </div>
            <p className="text-xs text-emerald-700/80 leading-relaxed mb-5">
              El pronóstico usa <strong>XGBRegressor</strong> (versión regresora de XGBoost) para predecir <em>cuántos</em> accidentes habrá cada mes. Veamos paso a paso:
            </p>

            {/* ── STEP 1: Monthly aggregation ── */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <h5 className="text-xs font-bold text-emerald-800">Los accidentes se agrupan por mes</h5>
              </div>
              <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50">
                <p className="text-[11px] text-emerald-600/70 mb-3">En vez de analizar cada accidente individual, el sistema cuenta cuántos ocurrieron cada mes:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <DataTransform id="agg-ene" raw="Enero 2024: 42 accidentes" transformed="→ cantidad = 42.0" explanation="Conteo simple del mes" />
                  <DataTransform id="agg-feb" raw="Febrero 2024: 38 accidentes" transformed="→ cantidad = 38.0" explanation="Conteo simple del mes" />
                  <DataTransform id="agg-mar" raw="Marzo 2024: 51 accidentes" transformed="→ cantidad = 51.0" explanation="Mes con más accidentes" />
                  <DataTransform id="agg-abr" raw="Abril 2024: 35 accidentes" transformed="→ cantidad = 35.0" explanation="Conteo simple del mes" />
                  <DataTransform id="agg-etc" raw="..." transformed="..." explanation="Un valor por cada mes histórico" />
                  <DataTransform id="agg-dic" raw="Dic 2024: 29 accidentes" transformed="→ cantidad = 29.0" explanation="Último dato conocido" />
                </div>
                <p className="text-[10px] text-emerald-500/60 mt-2 italic">
                  Esto convierte miles de filas del Excel en una serie temporal simple: un número por mes.
                </p>
              </div>
            </div>

            {/* Arrow 1→2 */}
            <div className="flex justify-center my-2">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-100/50 px-3 py-1 rounded-full">De cada mes se extraen variables numéricas (features)</span>
                <svg className="w-5 h-5 text-emerald-300 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* ── STEP 2: Feature engineering ── */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <h5 className="text-xs font-bold text-emerald-800">Cada mes se convierte en variables temporales</h5>
              </div>
              <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50">
                <p className="text-[11px] text-emerald-600/70 mb-3">XGBoost no entiende &ldquo;marzo 2024&rdquo;. Se crean números que capturan patrones temporales:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <DataTransform id="fc-mes" raw="Marzo 2024" transformed="→ mes_cal = 3.0" explanation="Mes del año (1-12)" />
                  <DataTransform id="fc-anio" raw="Marzo 2024" transformed="→ anio = 2024.0" explanation="Detecta tendencia entre años" />
                  <DataTransform id="fc-sin" raw="Marzo (mes 3)" transformed="→ mes_sin = 1.0, mes_cos = 0.0" explanation="Estacionalidad: sin/cos(2π·3/12)" />
                  <DataTransform id="fc-t" raw="Mes #24 de la serie" transformed="→ t = 23.0" explanation="Índice de tendencia (0, 1, 2...)" />
                  <DataTransform id="fc-lag" raw="Meses anteriores: 29, 35, 31" transformed="→ lag₁=29, lag₂=35, lag₃=31" explanation="Accidentes de los 3 meses previos" />
                  <DataTransform id="fc-roll" raw="Promedio últimos 3 meses" transformed="→ rolling_mean_3 = 31.7" explanation="Suaviza fluctuaciones recientes" />
                </div>
                <div className="mt-2 bg-teal-50/50 rounded-lg p-2.5 border border-teal-100/30">
                  <p className="text-[10px] text-teal-700">
                    <strong>Adaptación automática:</strong> Con menos de 6 meses solo se usan las features base (mes, año, sin/cos, t). Los lags y media móvil se activan con más historia.
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow 2→3 */}
            <div className="flex justify-center my-2">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-100/50 px-3 py-1 rounded-full">Estas features alimentan un árbol regresor (ejemplo de 1 de ~60)</span>
                <svg className="w-5 h-5 text-emerald-300 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* ── STEP 3: Regressor tree visual ── */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <h5 className="text-xs font-bold text-emerald-800">Cada árbol pregunta sobre esos números y predice una cantidad</h5>
              </div>
              <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50 overflow-x-auto">
                <p className="text-[11px] text-emerald-600/70 mb-4">
                  A diferencia del clasificador (que devuelve una categoría RC), aquí cada hoja devuelve un <strong className="text-emerald-700">número</strong>. Sigue el camino <strong className="text-emerald-600">verde</strong>:
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

                {/* Trace explanation */}
                <div className="mt-4 bg-emerald-50/80 rounded-lg p-3 border border-emerald-200/50">
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    <strong>Recorrido:</strong> &quot;¿Mes anterior &gt; 40?&quot; → lag₁ = 29, no es &gt; 40 → <strong className="text-emerald-800">NO</strong>
                    → &quot;¿Tendencia subiendo?&quot; → rolling_mean = 31.7, no es &gt; 33 → <strong className="text-emerald-800">NO</strong>
                    → Hoja: <strong className="text-emerald-800">-0.3</strong>.
                    Esto es la <strong>corrección</strong> de este árbol. Los otros ~59 árboles aportan sus propias correcciones.
                  </p>
                </div>

                <div className="bg-white/60 rounded-lg p-3 border border-emerald-100/30 mt-3">
                  <p className="text-[11px] text-emerald-700 mb-2"><strong>Configuración del XGBRegressor</strong></p>
                  <p className="text-[10px] text-emerald-600/80 leading-relaxed mb-2">
                    Los hiperparámetros se adaptan automáticamente al tamaño de los datos para evitar <strong>sobreajuste</strong> (memorizar en vez de aprender patrones):
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="text-center bg-white/70 rounded-lg p-2 border border-emerald-100/30">
                      <p className="text-[10px] text-emerald-500">Árboles</p>
                      <p className="text-xs font-bold text-emerald-800">20–100</p>
                      <p className="text-[9px] text-emerald-400">según N datos</p>
                    </div>
                    <div className="text-center bg-white/70 rounded-lg p-2 border border-emerald-100/30">
                      <p className="text-[10px] text-emerald-500">Profundidad</p>
                      <p className="text-xs font-bold text-emerald-800">2–3</p>
                      <p className="text-[9px] text-emerald-400">árboles simples</p>
                    </div>
                    <div className="text-center bg-white/70 rounded-lg p-2 border border-emerald-100/30">
                      <p className="text-[10px] text-emerald-500">Learning rate</p>
                      <p className="text-xs font-bold text-emerald-800">0.1</p>
                      <p className="text-[9px] text-emerald-400">paso conservador</p>
                    </div>
                    <div className="text-center bg-white/70 rounded-lg p-2 border border-emerald-100/30">
                      <p className="text-[10px] text-emerald-500">Regularización</p>
                      <p className="text-xs font-bold text-emerald-800">L1 + L2</p>
                      <p className="text-[9px] text-emerald-400">anti-sobreajuste</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── STEP 4: Trees sum to prediction ── */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <h5 className="text-xs font-bold text-emerald-800">Los árboles suman sus correcciones para dar el pronóstico</h5>
              </div>
              <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50">
                <p className="text-[11px] text-emerald-600/70 mb-4">
                  Cada árbol aporta una corrección pequeña. Se suman todas para obtener la predicción final:
                </p>
                {/* Visual tree corrections */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {[
                    { n: 1, val: "-0.3" },
                    { n: 2, val: "+1.2" },
                    { n: 3, val: "-0.5" },
                    { n: "...", val: "" },
                    { n: 60, val: "+0.8" },
                  ].map((item, i) => (
                    <div key={i} className={`rounded-lg p-2 text-center border ${
                      item.n === "..." ? "border-dashed border-emerald-200 bg-transparent" : "bg-emerald-50 border-emerald-200"
                    }`}>
                      <div className="text-[10px] font-bold text-emerald-500 mb-1">
                        {item.n === "..." ? "..." : `Árbol ${item.n}`}
                      </div>
                      {item.val && (
                        <div className="text-[11px] font-mono font-bold text-emerald-700">{item.val}</div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Arrow */}
                <div className="flex justify-center my-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-emerald-400 font-semibold mb-1">Base (promedio) + suma de correcciones = Predicción</span>
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>
                {/* Result */}
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
                    <div className="text-center bg-white rounded-lg px-3 py-2 border border-gray-200">
                      <p className="text-[10px] text-gray-400">Base</p>
                      <p className="text-sm font-bold text-gray-700">35.0</p>
                    </div>
                    <span className="text-lg font-bold text-gray-400">+</span>
                    <div className="text-center bg-white rounded-lg px-3 py-2 border border-emerald-200">
                      <p className="text-[10px] text-emerald-500">Σ correcciones</p>
                      <p className="text-sm font-bold text-emerald-700">-1.6</p>
                    </div>
                    <span className="text-lg font-bold text-gray-400">=</span>
                    <div className="text-center bg-emerald-500 rounded-lg px-4 py-2 shadow-md shadow-emerald-500/20">
                      <p className="text-[10px] text-emerald-100">Pronóstico</p>
                      <p className="text-lg font-bold text-white">33.4</p>
                    </div>
                    <span className="text-[11px] text-gray-500">accidentes estimados para el mes</span>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                      <strong>¿Por qué sumas y no votos?</strong> El clasificador vota por categorías (RC 03, RC 05...).
                      El regresor predice un <strong>número continuo</strong>: cada árbol aporta una corrección numérica (+1.2, -0.3...)
                      que se suma a una base. El resultado es la cantidad estimada de accidentes para ese mes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── STEP 5: Iterative month by month ── */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">5</span>
                </div>
                <h5 className="text-xs font-bold text-emerald-800">Se repite mes a mes: cada predicción alimenta al siguiente</h5>
              </div>
              <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50">
                <p className="text-[11px] text-emerald-600/70 mb-4">
                  El modelo no predice todos los meses de golpe. Predice <strong>uno por uno</strong>, y cada resultado se usa como lag del siguiente:
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
            </div>

            {/* Arrow 5→6 */}
            <div className="flex justify-center my-2">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-100/50 px-3 py-1 rounded-full">Se agrega incertidumbre creciente a cada mes</span>
                <svg className="w-5 h-5 text-emerald-300 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* ── STEP 6: Confidence interval ── */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">6</span>
                </div>
                <h5 className="text-xs font-bold text-emerald-800">Intervalo de confianza al 95% (la banda sombreada del gráfico)</h5>
              </div>
              <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50">
                <p className="text-[11px] text-gray-500 mb-3">
                  Ningún pronóstico es exacto. El sistema calcula un <strong>rango de incertidumbre</strong> alrededor de cada predicción:
                </p>
                <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100/30 mb-3">
                  <p className="text-xs font-mono text-center text-amber-800 mb-3">
                    Límite = predicción ± 1.96 × σ × √(1 + meses_adelante / N)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
                    <div className="bg-white/70 rounded-lg p-2.5 border border-amber-100/30 text-center">
                      <p className="font-bold text-amber-700 text-xs mb-0.5">1.96</p>
                      <p className="text-amber-600/70">Factor para 95% de confianza</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-2.5 border border-amber-100/30 text-center">
                      <p className="font-bold text-amber-700 text-xs mb-0.5">σ (sigma)</p>
                      <p className="text-amber-600/70">Desviación estándar de los errores del modelo en datos históricos</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-2.5 border border-amber-100/30 text-center">
                      <p className="font-bold text-amber-700 text-xs mb-0.5">√(1 + m/N)</p>
                      <p className="text-amber-600/70">Más lejos en el futuro = banda más ancha</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Mes 1</p>
                    <p className="text-sm font-bold text-emerald-700">33.4</p>
                    <p className="text-[10px] text-gray-400">± 8.2</p>
                    <div className="mt-1 h-1.5 bg-emerald-100 rounded-full mx-2"><div className="h-full bg-emerald-400 rounded-full" style={{ width: "85%" }} /></div>
                    <p className="text-[9px] text-emerald-500 mt-1">banda estrecha</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Mes 12</p>
                    <p className="text-sm font-bold text-amber-700">28.7</p>
                    <p className="text-[10px] text-gray-400">± 14.1</p>
                    <div className="mt-1 h-1.5 bg-amber-100 rounded-full mx-2"><div className="h-full bg-amber-400 rounded-full" style={{ width: "55%" }} /></div>
                    <p className="text-[9px] text-amber-500 mt-1">banda media</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 border border-red-100 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Mes 24</p>
                    <p className="text-sm font-bold text-red-700">25.3</p>
                    <p className="text-[10px] text-gray-400">± 19.8</p>
                    <div className="mt-1 h-1.5 bg-red-100 rounded-full mx-2"><div className="h-full bg-red-400 rounded-full" style={{ width: "30%" }} /></div>
                    <p className="text-[9px] text-red-500 mt-1">banda ancha</p>
                  </div>
                </div>
                <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100/30 mb-3">
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    <strong>¿De dónde sale σ (sigma)?</strong> Después de entrenar, el modelo predice los mismos datos históricos.
                    La <strong>desviación estándar de los errores</strong> (residuos = real − predicho) es σ.
                    Esto mide qué tan inexacto es el modelo y se usa para calcular el ancho de la banda.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    <strong>En la práctica:</strong> Predecir el mes siguiente es más confiable que predecir dentro de 2 años.
                    Si la banda es muy ancha, el modelo necesita <strong>más datos históricos</strong> para reducir σ.
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow 6→7 */}
            <div className="flex justify-center my-2">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-100/50 px-3 py-1 rounded-full">Ahora se predice el tipo de Causa Raíz de esos accidentes</span>
                <svg className="w-5 h-5 text-emerald-300 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* ── STEP 7: Per-RC prediction ── */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">7</span>
                </div>
                <h5 className="text-xs font-bold text-emerald-800">Se predice la distribución de Causa Raíz: un modelo por cada RC</h5>
              </div>
              <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50">
                <p className="text-[11px] text-gray-500 mb-3">
                  No basta saber <em>cuántos</em> accidentes habrá. También se predice <strong>qué tipo de causa raíz tendrán</strong>.
                  Se entrena un <strong>XGBRegressor independiente por cada categoría RC</strong>:
                </p>

                <div className="bg-purple-50/30 rounded-xl p-4 border border-purple-100/30 mb-4">
                  <p className="text-[11px] text-purple-700 font-semibold mb-3">Cada RC tiene su propia serie temporal y su propio modelo:</p>
                  <div className="space-y-2">
                    {[
                      { rc: "RC 03", data: "Ene:12, Feb:8, Mar:15, Abr:10...", result: "→ XGBRegressor → 11.2 estimados", ok: true },
                      { rc: "RC 05", data: "Ene:18, Feb:14, Mar:22, Abr:13...", result: "→ XGBRegressor → 9.8 estimados", ok: true },
                      { rc: "RC 06", data: "Ene:5, Feb:7, Mar:4, Abr:6...", result: "→ XGBRegressor → 5.1 estimados", ok: true },
                      { rc: "RC 13", data: "Ene:3, Feb:5, Mar:6, Abr:2...", result: "→ XGBRegressor → 3.9 estimados", ok: true },
                    ].map((item) => (
                      <div key={item.rc} className="flex items-center gap-3 bg-white/70 rounded-lg px-3 py-2 border border-purple-100/30">
                        <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 min-w-[3.5rem] text-center">{item.rc}</span>
                        <code className="text-[10px] text-gray-400 font-mono flex-1 min-w-0 truncate">{item.data}</code>
                        <span className="text-[11px] font-semibold text-purple-700 shrink-0">{item.result}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 bg-gray-50/70 rounded-lg px-3 py-2 border border-gray-200 border-dashed">
                      <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 min-w-[3.5rem] text-center">RC 25</span>
                      <code className="text-[10px] text-gray-400 font-mono flex-1 min-w-0 truncate">Ene:1, Feb:0, Mar:2, Abr:0... (pocos datos)</code>
                      <span className="text-[11px] font-semibold text-gray-500 shrink-0">→ Proporción histórica: 1.4</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-emerald-50/60 rounded-lg p-3 border border-emerald-100/50">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">RC con 6+ meses de datos</span>
                    </div>
                    <p className="text-[11px] text-emerald-600/80 leading-relaxed">
                      XGBRegressor dedicado con features temporales propios. Cada RC captura su tendencia y estacionalidad.
                    </p>
                  </div>
                  <div className="bg-gray-50/60 rounded-lg p-3 border border-gray-200/50">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-5 h-5 rounded bg-gray-400 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">RC con pocos datos (&lt;6 meses)</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Se usa la proporción histórica de los últimos 12 meses como fallback.
                    </p>
                  </div>
                </div>

                {/* Normalization visual */}
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <p className="text-[11px] text-emerald-700 font-semibold mb-2">Normalización final: las RC deben sumar el total pronosticado</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
                    {[
                      { rc: "RC 03", val: "11.2" },
                      { rc: "RC 05", val: "9.8" },
                      { rc: "RC 06", val: "5.1" },
                      { rc: "...", val: "" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1">
                        {i > 0 && <span className="text-gray-400 font-bold">+</span>}
                        {item.rc === "..." ? (
                          <span className="text-gray-400 text-xs">...</span>
                        ) : (
                          <div className="rounded-lg px-2 py-1 bg-white border border-emerald-100 text-center">
                            <p className="text-[9px] text-gray-400">{item.rc}</p>
                            <p className="text-[11px] font-bold text-emerald-700">{item.val}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    <span className="text-gray-400 font-bold">=</span>
                    <div className="rounded-lg px-3 py-1 bg-emerald-500 text-center shadow-md shadow-emerald-500/20">
                      <p className="text-[9px] text-emerald-100">Total</p>
                      <p className="text-sm font-bold text-white">33.4</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-emerald-600 leading-relaxed text-center">
                    Se escalan proporcionalmente para que la suma de todas las RC sea exactamente igual al total pronosticado del paso 4.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Result summary ── */}
            <div className="mt-5 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-5 border border-emerald-200">
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
          </div>

        </div>

        {/* ── Training Info Grid ── */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InfoItem
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              label="Fecha de entrenamiento"
              value={fechaStr || "—"}
              tooltip="Momento en que el modelo fue entrenado por última vez con los datos disponibles"
            />
            <InfoItem
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 4H8L9 3z" /></svg>}
              label="Registros de entrenamiento"
              value={info.total_registros_entrenamiento?.toLocaleString() || "—"}
              tooltip="Cantidad total de accidentes históricos que el modelo usó para aprender patrones"
            />
            <InfoItem
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              label="Datos desde"
              value={info.datos_desde || "—"}
              tooltip="Fecha del accidente más antiguo en los datos de entrenamiento"
            />
            <InfoItem
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              label="Datos hasta"
              value={info.datos_hasta || "—"}
              tooltip="Fecha del accidente más reciente en los datos de entrenamiento"
            />
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
            El modelo sigue un proceso de 4 pasos para aprender a clasificar accidentes. Cada paso es esencial:
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

function InfoItem({ icon, label, value, tooltip }: { icon: React.ReactNode; label: string; value: string; tooltip: string }) {
  return (
    <div className="flex items-start gap-2.5 group relative">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 text-gray-400 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
          {label}
          <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </p>
        <p className="text-sm text-gray-700 font-semibold">{value}</p>
        <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-800 text-white text-[11px] rounded-lg p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none leading-relaxed shadow-xl">
          {tooltip}
          <div className="absolute top-full left-6 w-2 h-2 bg-gray-800 rotate-45 -mt-1" />
        </div>
      </div>
    </div>
  );
}
