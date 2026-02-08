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

/* ── Metric config ── */
const METRIC_INFO: Record<string, { label: string; description: string; whatMeans: string; icon: string }> = {
  accuracy: {
    label: "Accuracy (Exactitud)",
    description: "De cada 100 predicciones, cuántas acertó correctamente el modelo.",
    whatMeans: "Si es 71.5%, significa que de cada 100 accidentes, el modelo clasifica correctamente la causa raíz en ~72 de ellos.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  f1_weighted: {
    label: "F1 Weighted (F1 Ponderado)",
    description: "Mide el equilibrio entre encontrar todos los casos (sensibilidad) y no equivocarse (precisión), dando más importancia a las clases con más datos.",
    whatMeans: "Es la métrica más representativa del rendimiento real. Un valor alto indica que el modelo es bueno tanto en detectar como en no confundir categorías frecuentes.",
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
  },
  f1_macro: {
    label: "F1 Macro (F1 Promedio)",
    description: "Promedia el F1 de cada clase por igual, sin importar cuántos datos tenga cada una. Revela si el modelo funciona bien incluso para causas poco frecuentes.",
    whatMeans: "Si es más bajo que el F1 Weighted, significa que las clases con pocos datos (causas raras) son más difíciles de predecir. Esto es normal en datos desbalanceados.",
    icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4",
  },
  roc_auc: {
    label: "ROC AUC (Área Bajo la Curva)",
    description: "Mide la capacidad del modelo para distinguir entre las diferentes categorías de causa raíz. Va de 0% a 100%.",
    whatMeans: "Un valor cercano a 90% es excelente. Significa que el modelo tiene una alta capacidad para separar y distinguir las distintas causas raíz, incluso cuando no está 100% seguro.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
};

function getMetricColor(key: string, value: number): string {
  if (key === "roc_auc") {
    if (value >= 0.85) return "emerald";
    if (value >= 0.7) return "amber";
    return "red";
  }
  if (value >= 0.7) return "emerald";
  if (value >= 0.5) return "amber";
  return "red";
}

function getMetricLevel(key: string, value: number): string {
  if (key === "roc_auc") {
    if (value >= 0.9) return "Excelente";
    if (value >= 0.8) return "Muy bueno";
    if (value >= 0.7) return "Bueno";
    return "Mejorable";
  }
  if (value >= 0.8) return "Excelente";
  if (value >= 0.7) return "Bueno";
  if (value >= 0.5) return "Moderado";
  return "Mejorable";
}

const colorMap: Record<string, { bg: string; fill: string; text: string; light: string }> = {
  emerald: { bg: "bg-emerald-50", fill: "bg-emerald-500", text: "text-emerald-700", light: "bg-emerald-100" },
  amber: { bg: "bg-amber-50", fill: "bg-amber-500", text: "text-amber-700", light: "bg-amber-100" },
  red: { bg: "bg-red-50", fill: "bg-red-500", text: "text-red-700", light: "bg-red-100" },
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

          {/* How does prediction work internally - VISUAL */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-100 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h4 className="text-sm font-bold text-violet-800">¿Cómo predice internamente el modelo?</h4>
            </div>
            <p className="text-xs text-violet-700/80 leading-relaxed mb-5">
              Veamos paso a paso qué ocurre cuando el modelo recibe un accidente nuevo:
            </p>

            {/* ── STEP 1: Input data visualization ── */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <h5 className="text-xs font-bold text-violet-800">Los datos crudos se transforman en números</h5>
              </div>
              <div className="bg-white/70 rounded-xl p-4 border border-violet-100/50">
                <p className="text-[11px] text-violet-600/70 mb-3">El modelo solo entiende números. Cada dato se convierte así:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <DataTransform id="tfidf" raw="Descripción: &quot;Caída de roca...&quot;" transformed="→ TF-IDF[caída] = 0.82" explanation="Puntaje de relevancia de cada palabra" />
                  <DataTransform id="edad" raw="Edad: 38 años" transformed="→ Edad_norm = -0.23" explanation="Normalizada: (38 - promedio) / desviación" />
                  <DataTransform id="turno" raw="Turno: &quot;Noche&quot;" transformed="→ Turno = 2" explanation="Día=0, Tarde=1, Noche=2" />
                  <DataTransform id="gcia" raw="Gcia: &quot;GMIN&quot;" transformed="→ Gcia = 4" explanation="Cada gerencia tiene un código" />
                  <DataTransform id="fecha" raw="Fecha: 15-Mar-2024" transformed="→ DiaSemana=4, Mes=3" explanation="Se extraen variables temporales" />
                  <DataTransform id="cargo" raw="Cargo: &quot;Operador&quot;" transformed="→ Cargo = 15" explanation="Se asigna un número a cada cargo" />
                </div>
              </div>
            </div>

            {/* Arrow connecting step 1 to step 2 */}
            <div className="flex justify-center my-2">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-violet-400 font-semibold bg-violet-100/50 px-3 py-1 rounded-full">Estos números entran al árbol como variables</span>
                <svg className="w-5 h-5 text-violet-300 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* ── STEP 2: Decision tree with numerical values ── */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <h5 className="text-xs font-bold text-violet-800">Cada árbol pregunta sobre esos números (ejemplo de 1 de los 500)</h5>
              </div>
              <div className="bg-white/70 rounded-xl p-4 border border-violet-100/50 overflow-x-auto">
                <p className="text-[11px] text-violet-600/70 mb-4">Cada nodo muestra la pregunta humana y cómo la máquina la evalúa con números. Sigue el camino <strong className="text-emerald-600">verde</strong>:</p>

                {/* Tree diagram with dual perspective */}
                <div className="min-w-[680px]">
                  {/* Root node */}
                  <div className="flex justify-center mb-1">
                    <DualTreeNode
                      humanQ="¿La descripción habla de &quot;caída&quot; o &quot;golpe&quot;?"
                      machineQ="TF-IDF[caída] > 0.5?"
                      machineVal="Valor actual: 0.82"
                      active
                    />
                  </div>
                  {/* Branch lines level 1 */}
                  <div className="flex justify-center mb-1">
                    <div className="flex items-start" style={{ width: 540 }}>
                      <div className="w-1/2 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">SÍ → 0.82 &gt; 0.5 ✓</span>
                        <div className="w-[2px] h-4 bg-emerald-400" />
                      </div>
                      <div className="w-1/2 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-gray-300 px-2 py-0.5">NO</span>
                        <div className="w-[2px] h-4 bg-gray-200" />
                      </div>
                    </div>
                  </div>
                  {/* Level 2 nodes */}
                  <div className="flex justify-center mb-1">
                    <div className="flex gap-4" style={{ width: 580 }}>
                      <div className="flex-1 flex justify-center">
                        <DualTreeNode
                          humanQ="¿El trabajador es mayor de 45 años?"
                          machineQ="Edad_norm > 0.5?"
                          machineVal="Valor actual: -0.23 (38 años)"
                          active
                        />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <DualTreeNode
                          humanQ="¿Fue en turno noche?"
                          machineQ="Turno = 2?"
                          machineVal="(no se evalúa)"
                          dimmed
                        />
                      </div>
                    </div>
                  </div>
                  {/* Branch lines level 2 */}
                  <div className="flex justify-center mb-1">
                    <div className="flex gap-4" style={{ width: 580 }}>
                      <div className="flex-1 flex items-start">
                        <div className="w-1/2 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-gray-300">SÍ</span>
                          <div className="w-[2px] h-4 bg-gray-200" />
                        </div>
                        <div className="w-1/2 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">NO → -0.23 &lt; 0.5 ✓</span>
                          <div className="w-[2px] h-4 bg-emerald-400" />
                        </div>
                      </div>
                      <div className="flex-1 flex items-start">
                        <div className="w-1/2 flex flex-col items-center">
                          <div className="w-[2px] h-4 bg-gray-100" />
                        </div>
                        <div className="w-1/2 flex flex-col items-center">
                          <div className="w-[2px] h-4 bg-gray-100" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Leaf nodes */}
                  <div className="flex justify-center">
                    <div className="flex gap-3" style={{ width: 600 }}>
                      <TreeNode text="RC 05" type="leaf" />
                      <TreeNode text="RC 03" type="leaf" highlight />
                      <TreeNode text="RC 13" type="leaf" dimmed />
                      <TreeNode text="RC 06" type="leaf" dimmed />
                    </div>
                  </div>
                </div>

                {/* Trace explanation */}
                <div className="mt-4 bg-emerald-50/80 rounded-lg p-3 border border-emerald-200/50">
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    <strong>Recorrido:</strong> &quot;¿Habla de caída?&quot; → la máquina ve que TF-IDF[caída] = 0.82 &gt; 0.5 → <strong className="text-emerald-800">SÍ</strong>
                    → &quot;¿Es mayor de 45?&quot; → la máquina ve Edad_norm = -0.23 (38 años), no es &gt; 0.5 → <strong className="text-emerald-800">NO</strong>
                    → Hoja: <strong className="text-emerald-800">RC 03</strong> (Falta de procedimientos).
                    Este es el voto de <strong>1 solo árbol</strong>. Los otros 499 hacen lo mismo con distintas preguntas.
                  </p>
                </div>

                <p className="text-[10px] text-violet-500/60 mt-3 text-center italic">
                  Ejemplo simplificado. En realidad cada árbol tiene hasta 8 niveles y usa distintas combinaciones de variables.
                </p>
              </div>
            </div>

            {/* ── STEP 3: 500 trees vote ── */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <h5 className="text-xs font-bold text-violet-800">Los 500 árboles votan y se suman sus resultados</h5>
              </div>
              <div className="bg-white/70 rounded-xl p-4 border border-violet-100/50">
                <p className="text-[11px] text-violet-600/70 mb-4">
                  Cada árbol da su &quot;voto&quot; (un puntaje) para cada causa raíz. Los votos se suman y se convierten en probabilidades con Softmax:
                </p>
                {/* Visual voting */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {[1, 2, 3, "...", 500].map((n, i) => (
                    <div key={i} className={`rounded-lg p-2 text-center border ${
                      n === "..." ? "border-dashed border-violet-200 bg-transparent" : "bg-violet-50 border-violet-200"
                    }`}>
                      <div className="text-[10px] font-bold text-violet-500 mb-1">
                        {n === "..." ? "..." : `Árbol ${n}`}
                      </div>
                      {n !== "..." && (
                        <div className="text-[9px] text-violet-400 leading-tight">
                          {i === 0 && "RC 05 ✓"}
                          {i === 1 && "RC 03 ✓"}
                          {i === 2 && "RC 05 ✓"}
                          {i === 4 && "RC 05 ✓"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Arrow */}
                <div className="flex justify-center my-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-violet-400 font-semibold mb-1">Se suman puntajes → Softmax → Probabilidades</span>
                    <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>
                {/* Probability bars */}
                <div className="space-y-2">
                  <ProbabilityBar label="RC 05" sublabel="Condiciones del entorno" value={45} isWinner />
                  <ProbabilityBar label="RC 03" sublabel="Falta de procedimientos" value={25} />
                  <ProbabilityBar label="RC 13" sublabel="Factores personales" value={15} />
                  <ProbabilityBar label="RC 06" sublabel="Falla de equipos" value={8} />
                  <ProbabilityBar label="Otras" sublabel="7 clases restantes" value={7} />
                </div>
                {/* Result */}
                <div className="mt-4 bg-emerald-50 rounded-lg p-3 border border-emerald-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-800">
                      Predicción final: RC 05 — Condiciones del entorno (45% de confianza)
                    </p>
                    <p className="text-[11px] text-emerald-600">
                      El modelo elige la clase con mayor probabilidad. Un 45% en 12 clases posibles es una señal fuerte.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What does the dashboard show */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h4 className="text-sm font-bold text-amber-800">¿Qué muestran los gráficos de abajo?</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white/60 rounded-lg p-3 border border-amber-100/50">
                <h5 className="text-xs font-bold text-amber-700 mb-1">Análisis histórico (no predicción)</h5>
                <p className="text-[11px] text-amber-600/80 leading-relaxed">
                  Los gráficos muestran <strong>estadísticas reales</strong> de los accidentes que ya ocurrieron en el periodo seleccionado.
                  No son predicciones a futuro, sino un análisis de los datos históricos para identificar patrones.
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-3 border border-amber-100/50">
                <h5 className="text-xs font-bold text-amber-700 mb-1">¿Para qué sirve esto?</h5>
                <p className="text-[11px] text-amber-600/80 leading-relaxed">
                  Al ver que ciertos turnos, gerencias o cargos tienen más accidentes, se pueden tomar <strong>medidas preventivas</strong> focalizadas.
                  Combinado con la clasificación del modelo, permite anticipar y prevenir accidentes según sus causas raíz.
                </p>
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

        {/* ── Metrics - Always visible with explanations ── */}
        {info.metricas && (
          <div className="px-6 py-5 border-b border-gray-100">
            <h4 className="text-sm font-bold text-gray-700 mb-1">Rendimiento del Modelo</h4>
            <p className="text-xs text-gray-400 mb-4">
              Estas métricas se calculan con datos que el modelo <strong>nunca vio durante el entrenamiento</strong> (20% reservado para prueba),
              lo que garantiza una evaluación honesta y sin trampa.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["accuracy", "f1_weighted", "f1_macro", "roc_auc"] as const).map((key) => {
                const val = info.metricas![key];
                if (val == null) return null;
                const metricInfo = METRIC_INFO[key];
                const color = getMetricColor(key, val);
                const level = getMetricLevel(key, val);
                const colors = colorMap[color];

                return (
                  <div key={key} className={`rounded-xl border p-4 ${colors.bg} border-gray-200/60`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={metricInfo.icon} />
                        </svg>
                        <span className="text-xs font-semibold text-gray-700">{metricInfo.label}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.light} ${colors.text}`}>
                        {level}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-2.5 bg-white/70 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${colors.fill} transition-all duration-700`}
                          style={{ width: `${Math.min(val * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-gray-800 tabular-nums min-w-[4rem] text-right">
                        {(val * 100).toFixed(1)}%
                      </span>
                    </div>

                    {/* Always-visible explanation */}
                    <div className="space-y-1.5">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <strong>Qué mide:</strong> {metricInfo.description}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed italic">
                        <strong className="not-italic">Interpretación:</strong> {metricInfo.whatMeans}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── How to improve metrics ── */}
            <div className="mt-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-5 border border-teal-100">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h4 className="text-sm font-bold text-teal-800">¿Cómo mejorar estos indicadores?</h4>
              </div>
              <p className="text-xs text-teal-700/70 leading-relaxed mb-4">
                El rendimiento del modelo depende directamente de la <strong className="text-teal-800">calidad y cantidad de datos</strong> en el archivo Excel
                (<code className="bg-teal-100/50 px-1.5 py-0.5 rounded text-teal-700 text-[11px]">NominaAT.xlsx</code>).
                Aquí te explicamos qué mejorar en el archivo para subir cada indicador:
              </p>

              <div className="space-y-3">
                {/* Accuracy & F1 Weighted */}
                <ImprovementCard
                  metric="Accuracy y F1 Weighted"
                  currentIssue="El modelo acierta ~71% de las veces"
                  icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  color="blue"
                  actions={[
                    {
                      title: "Más registros históricos",
                      description: "Mientras más accidentes tenga el archivo, más patrones puede aprender el modelo. Idealmente más de 10.000 registros.",
                      fileAction: "Agregar filas con accidentes antiguos que no estén en el archivo",
                    },
                    {
                      title: "Descripciones más detalladas",
                      description: "La descripción del accidente es la variable más importante. Textos vagos como \"accidente en faena\" dan poca información al modelo.",
                      fileAction: "En la columna \"Descripción\", escribir qué pasó, dónde, con qué equipo y cómo ocurrió",
                    },
                    {
                      title: "Clasificación RC correcta",
                      description: "Si un accidente tiene la causa raíz mal asignada, el modelo aprende patrones incorrectos.",
                      fileAction: "Revisar que la columna \"RC\" tenga la causa raíz correcta en cada registro",
                    },
                  ]}
                />

                {/* F1 Macro */}
                <ImprovementCard
                  metric="F1 Macro (el más bajo)"
                  currentIssue="Las causas raíz poco frecuentes son difíciles de predecir"
                  icon="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  color="amber"
                  actions={[
                    {
                      title: "Más datos de clases minoritarias",
                      description: "Si RC 25 tiene solo 60 registros y RC 05 tiene 1.500, el modelo nunca aprenderá bien RC 25. Necesita al menos 100-200 registros por clase.",
                      fileAction: "Asegurar que cada RC tenga suficientes registros. Si una RC tiene muy pocos, buscar datos históricos faltantes",
                    },
                    {
                      title: "No agrupar demasiado en \"OTROS\"",
                      description: "Las clases con menos de 50 muestras se agrupan en \"OTROS\". Si hay RCs importantes ahí, se pierde precisión.",
                      fileAction: "Si hay una RC importante con pocas muestras, conseguir más datos de esa categoría específica",
                    },
                  ]}
                />

                {/* ROC AUC */}
                <ImprovementCard
                  metric="ROC AUC"
                  currentIssue="Ya está en ~90% (muy bueno), pero se puede optimizar"
                  icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  color="emerald"
                  actions={[
                    {
                      title: "Datos completos sin vacíos",
                      description: "Los campos vacíos se imputan con valores genéricos que pierden información. Mientras menos vacíos, mejor.",
                      fileAction: "Completar campos vacíos en: Edad, Turno, Cargo, Empresa, Gerencia, Sexo",
                    },
                    {
                      title: "Nombres consistentes",
                      description: "Si una gerencia aparece como \"GMIN\", \"G.MIN\" y \"Gcia Mina\", el modelo las trata como 3 cosas distintas.",
                      fileAction: "Unificar nombres en las columnas: Empresa, Cargo, Gcia. Usar siempre el mismo formato",
                    },
                  ]}
                />
              </div>

              {/* ── Per-field standardization guide ── */}
              <div className="mt-4 bg-white/60 rounded-xl p-5 border border-teal-100/50">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h5 className="text-sm font-bold text-teal-800">Guía de estandarización por columna del Excel</h5>
                </div>
                <p className="text-xs text-teal-600/70 mb-4 ml-7">
                  El modelo aprende patrones de los datos. Si un mismo concepto aparece escrito de formas distintas,
                  el modelo lo interpreta como cosas diferentes y pierde capacidad de predicción.
                </p>

                <div className="space-y-3">
                  {/* Descripción - most important */}
                  <FieldGuide
                    field="Descripción"
                    type="Texto → TF-IDF"
                    importance="alta"
                    why="Es la variable más influyente. El modelo extrae las 100 palabras/frases más relevantes (TF-IDF). Si las descripciones son vagas o inconsistentes, pierde mucho poder predictivo."
                    goodExamples={[
                      "Trabajador sufre caída de mismo nivel al tropezar con tubería en galería nivel 15, resultando en esguince de tobillo derecho",
                      "Proyección de roca fragmentada impacta en brazo izquierdo durante tronadura en sector norte, causando contusión",
                    ]}
                    badExamples={[
                      "accidente en faena",
                      "Se golpeó",
                      "Lesión en el trabajo",
                    ]}
                    tips={[
                      "Describir QUÉ pasó (caída, golpe, atrapamiento, proyección...)",
                      "Describir DÓNDE ocurrió (galería, taller, rajo, planta...)",
                      "Describir CON QUÉ (herramienta, equipo, material involucrado)",
                      "Describir la LESIÓN resultante (fractura, esguince, contusión...)",
                      "Usar mínimo 15 palabras por descripción",
                      "Usar vocabulario consistente: siempre \"caída\" (no mezclar con \"se cayó\", \"cayéndose\")",
                    ]}
                  />

                  {/* Cargo */}
                  <FieldGuide
                    field="Cargo"
                    type="Categórica"
                    importance="alta"
                    why="Ciertos cargos tienen mayor exposición a riesgos específicos. Si un mismo cargo aparece con nombres distintos, el modelo no puede aprender ese patrón."
                    goodExamples={[
                      "Operador de Pala",
                      "Mecánico Mantención",
                      "Supervisor Mina",
                    ]}
                    badExamples={[
                      "Op. Pala / OPERADOR PALA / Operador de pala hidráulica → 3 versiones del mismo cargo",
                      "Mec. / Mecanico / MECÁNICO MANTENCION → inconsistente",
                    ]}
                    tips={[
                      "Definir una lista maestra de cargos y usar siempre los mismos nombres",
                      "Elegir un formato: \"Operador de Pala\" (no abreviar ni usar mayúsculas completas)",
                      "Si hay cargos muy similares, unificarlos (ej: \"Ayudante Mina\" y \"Ayudante de Mina\" → uno solo)",
                    ]}
                  />

                  {/* Empresa */}
                  <FieldGuide
                    field="Empresa"
                    type="Categórica"
                    importance="media"
                    why="Cada empresa contratista puede tener distintos estándares de seguridad. Nombres inconsistentes diluyen este patrón."
                    goodExamples={[
                      "ENAEX",
                      "Finning Chile",
                      "Komatsu",
                    ]}
                    badExamples={[
                      "ENAEX / Enaex S.A. / ENAEX SA → son la misma empresa",
                      "Finning / FINNING CHILE / Finning Chile S.A.",
                    ]}
                    tips={[
                      "Usar siempre el nombre corto oficial de cada empresa",
                      "No incluir sufijos legales (S.A., Ltda., SpA) a menos que diferencien empresas",
                      "Mantener una lista cerrada de empresas aprobadas",
                    ]}
                  />

                  {/* Gerencia */}
                  <FieldGuide
                    field="Gerencia (Gcia.)"
                    type="Categórica"
                    importance="media"
                    why="La gerencia indica el área operacional. Cada área tiene riesgos distintos. Abreviaturas inconsistentes confunden al modelo."
                    goodExamples={[
                      "GMIN",
                      "GPROC",
                      "GRS",
                    ]}
                    badExamples={[
                      "GMIN / G.MIN / Gcia Mina / Gerencia de Mina → 4 nombres para lo mismo",
                      "GDR / GRS → si se renombró, actualizar todos los registros",
                    ]}
                    tips={[
                      "Usar siempre la abreviatura oficial (GMIN, GPROC, GRS, etc.)",
                      "Si una gerencia cambió de nombre, unificar todos los registros bajo el nombre actual",
                      "No mezclar abreviaturas con nombres completos",
                    ]}
                  />

                  {/* Turno */}
                  <FieldGuide
                    field="Turno"
                    type="Categórica"
                    importance="media"
                    why="El turno influye en la fatiga y visibilidad. Solo debería haber 2-3 valores posibles, pero la inconsistencia crea más."
                    goodExamples={[
                      "Día",
                      "Noche",
                      "Tarde",
                    ]}
                    badExamples={[
                      "DIA / Día / DIURNO / dia / Diurno → 5 versiones",
                      "NOCHE / Noche / noche / Nocturno",
                    ]}
                    tips={[
                      "Definir valores exactos: \"Día\", \"Noche\", \"Tarde\" (máx. 3 opciones)",
                      "Usar validación de datos en Excel (lista desplegable) para evitar errores de tipeo",
                      "No dejar en blanco: si no se sabe, poner el turno más probable según la hora del accidente",
                    ]}
                  />

                  {/* Fecha */}
                  <FieldGuide
                    field="Fecha"
                    type="Temporal"
                    importance="media"
                    why="De la fecha se extraen: año, mes, día de semana, trimestre y estacionalidad (ciclos sin/cos). Fechas incorrectas o faltantes generan variables temporales erróneas."
                    goodExamples={[
                      "15-03-2024 (DD-MM-AAAA consistente)",
                      "2024-03-15 (AAAA-MM-DD también válido si es siempre igual)",
                    ]}
                    badExamples={[
                      "Mezclar 15/03/2024 con 2024-03-15 con 15-Mar-24",
                      "Fechas como texto en vez de formato fecha de Excel",
                    ]}
                    tips={[
                      "Usar formato fecha nativo de Excel (no texto)",
                      "Verificar que no haya fechas futuras o imposibles (ej: 30 de febrero)",
                      "No dejar fechas en blanco: cada accidente debe tener fecha exacta",
                      "Idealmente incluir también la hora para mayor precisión",
                    ]}
                  />

                  {/* Edad */}
                  <FieldGuide
                    field="Edad"
                    type="Numérica"
                    importance="baja"
                    why="La edad se normaliza matemáticamente (se resta el promedio y divide por la desviación). Valores atípicos o faltantes distorsionan esta normalización para todos los registros."
                    goodExamples={[
                      "38",
                      "52",
                      "25",
                    ]}
                    badExamples={[
                      "\"treinta y ocho\" (texto en vez de número)",
                      "0 o 999 (valores placeholder)",
                      "Celda vacía",
                    ]}
                    tips={[
                      "Siempre usar número entero (no texto, no decimales)",
                      "Rango esperado: 18-70 años. Valores fuera de rango indican error",
                      "No usar 0 como placeholder si no se conoce: es mejor dejarlo vacío (el modelo lo imputa)",
                    ]}
                  />

                  {/* Sexo */}
                  <FieldGuide
                    field="Sexo"
                    type="Categórica"
                    importance="baja"
                    why="Solo debería tener 2 valores. Más variantes crean categorías artificiales que confunden al modelo."
                    goodExamples={[
                      "M",
                      "F",
                    ]}
                    badExamples={[
                      "M / Masculino / MASCULINO / Hombre / H → 5 versiones para lo mismo",
                      "F / Femenino / FEMENINO / Mujer",
                    ]}
                    tips={[
                      "Usar solo 2 valores: \"M\" y \"F\"",
                      "Aplicar validación de datos en Excel (lista desplegable con solo M y F)",
                      "No dejar en blanco si se conoce el dato",
                    ]}
                  />
                </div>
              </div>

              {/* Summary checklist */}
              <div className="mt-4 bg-white/60 rounded-lg p-4 border border-teal-100/50">
                <h5 className="text-xs font-bold text-teal-800 mb-2">Checklist rápido para mejorar el archivo Excel:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                  {[
                    "Más de 5.000 registros (ideal: 10.000+)",
                    "Descripciones detalladas (mín. 15 palabras c/u)",
                    "RC correctamente clasificada en cada fila",
                    "Mín. 100 registros por cada categoría RC",
                    "Sin campos vacíos en Edad, Turno, Cargo",
                    "Nombres unificados (empresa, gerencia, cargo)",
                    "Sin filas duplicadas",
                    "Fechas en formato consistente (formato fecha Excel)",
                    "Turno estandarizado: solo Día / Noche / Tarde",
                    "Sexo estandarizado: solo M / F",
                    "Cargos con lista maestra definida",
                    "Descripciones con qué, dónde, con qué y lesión",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded border-2 border-teal-300 shrink-0 mt-0.5 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-sm bg-teal-200" />
                      </div>
                      <span className="text-[11px] text-teal-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* ── Prediction / Forecast Guide ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-gray-700">¿Cómo funciona el Pronóstico de Accidentes?</h4>
          </div>
          <p className="text-xs text-gray-400 mb-5 ml-10">
            El pronóstico usa <strong className="text-gray-500">XGBRegressor</strong> (la versión regresora de XGBoost)
            para predecir <em>cuántos</em> accidentes ocurrirán en meses futuros. Es un proceso distinto al clasificador de Causa Raíz, pero usa el mismo motor de Machine Learning.
          </p>

          {/* ── STEP 1: Aggregation ── */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <h5 className="text-xs font-bold text-emerald-800">Los datos se agrupan por mes</h5>
            </div>
            <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50">
              <p className="text-[11px] text-gray-500 mb-3">
                En vez de ver cada accidente individual, el sistema cuenta <strong>cuántos accidentes hubo cada mes</strong>.
                Esto convierte miles de filas en una serie temporal simple:
              </p>
              <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100/30 overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-emerald-700 font-bold">
                      <td className="pr-4 py-1">Periodo</td>
                      <td className="pr-4 py-1">Ene 2023</td>
                      <td className="pr-4 py-1">Feb 2023</td>
                      <td className="pr-4 py-1">Mar 2023</td>
                      <td className="pr-4 py-1">Abr 2023</td>
                      <td className="pr-4 py-1">...</td>
                      <td className="pr-4 py-1">Dic 2024</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-gray-600">
                      <td className="pr-4 py-1 font-semibold text-gray-700">Accidentes</td>
                      <td className="pr-4 py-1">42</td>
                      <td className="pr-4 py-1">38</td>
                      <td className="pr-4 py-1">51</td>
                      <td className="pr-4 py-1">35</td>
                      <td className="pr-4 py-1">...</td>
                      <td className="pr-4 py-1">29</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                La serie se construye desde el primer al último mes con datos. Periodos sin accidentes se cuentan como 0.
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center my-2">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-100/50 px-3 py-1 rounded-full">De cada mes se extraen variables (features) temporales</span>
              <svg className="w-5 h-5 text-emerald-300 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* ── STEP 2: Feature Engineering ── */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <h5 className="text-xs font-bold text-emerald-800">Se crean features temporales para XGBoost</h5>
            </div>
            <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50">
              <p className="text-[11px] text-gray-500 mb-3">
                XGBoost no entiende &ldquo;marzo 2024&rdquo;. Cada mes se convierte en <strong>variables numéricas</strong> que capturan distintos patrones:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ForecastFeatureItem
                  name="mes_cal"
                  example="3.0"
                  explanation="Mes del año (1-12). Captura patrones como 'más accidentes en invierno'."
                />
                <ForecastFeatureItem
                  name="anio"
                  example="2024.0"
                  explanation="Año numérico. Detecta si hay tendencia creciente o decreciente a lo largo de los años."
                />
                <ForecastFeatureItem
                  name="mes_sin / mes_cos"
                  example="0.50 / -0.87"
                  explanation="Estacionalidad cíclica: sin(2π·mes/12) y cos(2π·mes/12). Hace que diciembre y enero estén 'cerca' matemáticamente."
                />
                <ForecastFeatureItem
                  name="t (tendencia)"
                  example="23.0"
                  explanation="Índice secuencial (0, 1, 2...). Captura la tendencia lineal: si los accidentes aumentan o disminuyen con el tiempo."
                />
                <ForecastFeatureItem
                  name="lag_1, lag_2, lag_3"
                  example="29, 35, 31"
                  explanation="Accidentes de los 3 meses anteriores. Si el mes pasado fue alto, el siguiente podría serlo también."
                />
                <ForecastFeatureItem
                  name="rolling_mean_3"
                  example="31.7"
                  explanation="Promedio móvil de los últimos 3 meses. Suaviza fluctuaciones y muestra la tendencia reciente."
                />
              </div>
              <div className="mt-3 bg-teal-50/50 rounded-lg p-3 border border-teal-100/30">
                <p className="text-[10px] text-teal-700 leading-relaxed">
                  <strong>Nota:</strong> Con menos de 6 meses de datos, solo se usan las features base (mes, año, estacionalidad, tendencia).
                  Los lags y media móvil se activan automáticamente cuando hay suficiente historia.
                </p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center my-2">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-100/50 px-3 py-1 rounded-full">Estas features alimentan a XGBRegressor</span>
              <svg className="w-5 h-5 text-emerald-300 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* ── STEP 3: XGBRegressor training ── */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <h5 className="text-xs font-bold text-emerald-800">Se entrena un XGBRegressor sobre la serie mensual</h5>
            </div>
            <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50">
              <p className="text-[11px] text-gray-500 mb-3">
                A diferencia del clasificador (que predice una <em>categoría</em> RC), el regresor predice un <strong>número continuo</strong>: la cantidad de accidentes.
              </p>

              {/* Visual comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50/60 rounded-lg p-3 border border-blue-100/50">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">Clasificador (RC)</span>
                  </div>
                  <p className="text-[11px] text-blue-600/80">Entrada: datos de 1 accidente</p>
                  <p className="text-[11px] text-blue-600/80">Salida: <strong>&ldquo;RC 05&rdquo;</strong> (categoría)</p>
                  <p className="text-[10px] text-blue-500/60 mt-1">XGBClassifier — 500 árboles</p>
                </div>
                <div className="bg-emerald-50/60 rounded-lg p-3 border border-emerald-100/50">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Regresor (Pronóstico)</span>
                  </div>
                  <p className="text-[11px] text-emerald-600/80">Entrada: features del mes</p>
                  <p className="text-[11px] text-emerald-600/80">Salida: <strong>&ldquo;37.2&rdquo;</strong> (cantidad)</p>
                  <p className="text-[10px] text-emerald-500/60 mt-1">XGBRegressor — 20 a 100 árboles (ajustado según datos)</p>
                </div>
              </div>

              {/* Hyperparameters info */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-[11px] text-gray-600 mb-2"><strong>¿Cómo se ajusta el modelo?</strong></p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Los hiperparámetros se adaptan automáticamente al tamaño de los datos para evitar <strong>sobreajuste</strong> (memorizar los datos en vez de aprender patrones):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  <div className="text-center bg-white rounded-lg p-2 border border-gray-100">
                    <p className="text-[10px] text-gray-400">Árboles</p>
                    <p className="text-xs font-bold text-gray-700">20–100</p>
                    <p className="text-[9px] text-gray-400">según N datos</p>
                  </div>
                  <div className="text-center bg-white rounded-lg p-2 border border-gray-100">
                    <p className="text-[10px] text-gray-400">Profundidad</p>
                    <p className="text-xs font-bold text-gray-700">2–3</p>
                    <p className="text-[9px] text-gray-400">árboles simples</p>
                  </div>
                  <div className="text-center bg-white rounded-lg p-2 border border-gray-100">
                    <p className="text-[10px] text-gray-400">Learning rate</p>
                    <p className="text-xs font-bold text-gray-700">0.1</p>
                    <p className="text-[9px] text-gray-400">paso conservador</p>
                  </div>
                  <div className="text-center bg-white rounded-lg p-2 border border-gray-100">
                    <p className="text-[10px] text-gray-400">Regularización</p>
                    <p className="text-xs font-bold text-gray-700">L1 + L2</p>
                    <p className="text-[9px] text-gray-400">anti-sobreajuste</p>
                  </div>
                </div>
              </div>

              {/* Sigma / residuals */}
              <div className="mt-3 bg-amber-50/50 rounded-lg p-3 border border-amber-100/30">
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  <strong>Cálculo de incertidumbre (σ):</strong> Después de entrenar, el modelo predice los mismos datos históricos.
                  La <strong>desviación estándar de los errores</strong> (residuos = real - predicho) es σ.
                  Esto mide qué tan inexacto es el modelo y se usa para construir el intervalo de confianza.
                </p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center my-2">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-100/50 px-3 py-1 rounded-full">El modelo entrenado predice mes a mes iterativamente</span>
              <svg className="w-5 h-5 text-emerald-300 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* ── STEP 4: Iterative prediction ── */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <h5 className="text-xs font-bold text-emerald-800">Predicción iterativa: cada mes alimenta al siguiente</h5>
            </div>
            <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50">
              <p className="text-[11px] text-gray-500 mb-3">
                El modelo no predice todos los meses de golpe. Predice <strong>uno por uno</strong>, y la predicción de un mes se usa como input (lag) del siguiente:
              </p>

              {/* Visual iterative process */}
              <div className="space-y-2 mb-4">
                <ForecastIterStep
                  month="Mar 2025"
                  lags="lag₁ = 29 (real), lag₂ = 35 (real), lag₃ = 31 (real)"
                  result="→ Predicción: 33.4"
                  isFirst
                />
                <ForecastIterStep
                  month="Abr 2025"
                  lags="lag₁ = 33.4 (pred), lag₂ = 29 (real), lag₃ = 35 (real)"
                  result="→ Predicción: 30.8"
                />
                <ForecastIterStep
                  month="May 2025"
                  lags="lag₁ = 30.8 (pred), lag₂ = 33.4 (pred), lag₃ = 29 (real)"
                  result="→ Predicción: 35.1"
                />
                <div className="flex items-center gap-2 px-4">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-100" />
                  </div>
                  <span className="text-[10px] text-gray-400 italic">continúa mes a mes hasta el final del periodo solicitado</span>
                </div>
              </div>

              <div className="bg-violet-50/50 rounded-lg p-3 border border-violet-100/30">
                <p className="text-[11px] text-violet-700 leading-relaxed">
                  <strong>¿Por qué es iterativo?</strong> Porque los lags (meses anteriores) son la señal más fuerte.
                  Si el mes 1 predice un valor alto, el mes 2 lo &ldquo;verá&rdquo; como lag₁ y reaccionará.
                  Esto mantiene coherencia entre los pronósticos: no son independientes, sino que forman una cadena lógica.
                </p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center my-2">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-100/50 px-3 py-1 rounded-full">Se agrega incertidumbre creciente</span>
              <svg className="w-5 h-5 text-emerald-300 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* ── STEP 5: Confidence interval ── */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">5</span>
              </div>
              <h5 className="text-xs font-bold text-emerald-800">Intervalo de confianza al 95% (banda sombreada)</h5>
            </div>
            <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50">
              <p className="text-[11px] text-gray-500 mb-3">
                Ningún pronóstico es exacto. El sistema calcula un <strong>rango de incertidumbre</strong> alrededor de cada predicción:
              </p>

              {/* Formula visualization */}
              <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100/30 mb-3">
                <p className="text-xs font-mono text-center text-amber-800 mb-2">
                  Límite = predicción ± 1.96 × σ × √(1 + meses_adelante / N)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
                  <div className="bg-white/70 rounded-lg p-2 border border-amber-100/30 text-center">
                    <p className="font-bold text-amber-700">1.96</p>
                    <p className="text-amber-600/70">Factor para 95% de confianza (distribución normal)</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-2 border border-amber-100/30 text-center">
                    <p className="font-bold text-amber-700">σ (sigma)</p>
                    <p className="text-amber-600/70">Error típico del modelo calculado sobre datos históricos</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-2 border border-amber-100/30 text-center">
                    <p className="font-bold text-amber-700">√(1 + m/N)</p>
                    <p className="text-amber-600/70">Factor de expansión: más lejos en el futuro = más incertidumbre</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  <strong>En la práctica:</strong> El primer mes pronosticado tiene una banda estrecha (el modelo tiene información reciente).
                  El mes 12 tiene una banda ~2× más ancha. El mes 24 es aún más ancha.
                  Esto refleja la realidad: <strong>predecir el mes siguiente es más fácil que predecir dentro de 2 años</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center my-2">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-100/50 px-3 py-1 rounded-full">Se repite el proceso para cada Causa Raíz por separado</span>
              <svg className="w-5 h-5 text-emerald-300 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* ── STEP 6: Per-RC prediction ── */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">6</span>
              </div>
              <h5 className="text-xs font-bold text-emerald-800">Distribución de Causa Raíz: un modelo XGBoost por cada RC</h5>
            </div>
            <div className="bg-white/70 rounded-xl p-4 border border-emerald-100/50">
              <p className="text-[11px] text-gray-500 mb-3">
                No basta saber <em>cuántos</em> accidentes habrá. También se predice <strong>cómo se distribuirán</strong> entre las causas raíz:
              </p>

              {/* Visual per-RC models */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {["RC 03", "RC 05", "RC 06", "RC 09", "RC 13", "OTROS"].map((rc) => (
                  <div key={rc} className="bg-purple-50/60 rounded-lg p-2.5 border border-purple-100/50 text-center">
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold inline-block mb-1">{rc}</span>
                    <p className="text-[10px] text-purple-600/70">
                      XGBRegressor propio
                    </p>
                    <p className="text-[9px] text-purple-400">
                      serie mensual independiente
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100/30">
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    <strong>RC con 6+ meses de datos:</strong> Se entrena un XGBRegressor dedicado con el mismo proceso de features temporales.
                    Cada RC tiene su propia tendencia y estacionalidad — por ejemplo, RC 05 (entorno) puede subir en invierno mientras RC 13 (fatiga) sube en turnos nocturnos de verano.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    <strong>RC con pocos datos (&lt;6 meses):</strong> No hay suficiente historia para que XGBoost aprenda.
                    Se usa la proporción histórica de los últimos 12 meses como fallback (ej: si RC 25 fue el 5% del total, se le asigna 5% del pronóstico).
                  </p>
                </div>
                <div className="bg-violet-50/50 rounded-lg p-3 border border-violet-100/30">
                  <p className="text-[11px] text-violet-700 leading-relaxed">
                    <strong>Normalización final:</strong> Las predicciones individuales de cada RC se normalizan para que sumen exactamente el total pronosticado.
                    Esto garantiza consistencia: si el total es 37, las RC sumadas también dan 37.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-sm font-bold text-emerald-800">Resumen del Proceso de Pronóstico</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/60 rounded-lg p-3 border border-emerald-100/50">
                <h5 className="text-xs font-bold text-emerald-700 mb-1">Entrada</h5>
                <p className="text-[11px] text-emerald-600/80 leading-relaxed">
                  Los mismos datos del Excel que alimentan el clasificador. Se agrupan por mes para obtener la serie temporal de conteos.
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-3 border border-emerald-100/50">
                <h5 className="text-xs font-bold text-emerald-700 mb-1">Proceso</h5>
                <p className="text-[11px] text-emerald-600/80 leading-relaxed">
                  XGBRegressor aprende patrones temporales (tendencia, estacionalidad, lags). Predice mes a mes encadenando predicciones anteriores.
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-3 border border-emerald-100/50">
                <h5 className="text-xs font-bold text-emerald-700 mb-1">Salida</h5>
                <p className="text-[11px] text-emerald-600/80 leading-relaxed">
                  Cantidad estimada por mes con intervalo de confianza al 95%, más distribución de RC con modelos independientes por categoría.
                </p>
              </div>
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

function FieldGuide({ field, type, importance, why, goodExamples, badExamples, tips }: {
  field: string;
  type: string;
  importance: "alta" | "media" | "baja";
  why: string;
  goodExamples: string[];
  badExamples: string[];
  tips: string[];
}) {
  const impColors = {
    alta: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Impacto alto" },
    media: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Impacto medio" },
    baja: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", label: "Impacto bajo" },
  };
  const imp = impColors[importance];

  return (
    <div className="rounded-xl border border-teal-200/40 bg-teal-50/20 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-bold text-teal-800">{field}</span>
        <span className="text-[10px] text-teal-500 bg-teal-100/50 px-2 py-0.5 rounded-full font-mono">{type}</span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${imp.bg} ${imp.text} border ${imp.border}`}>
          {imp.label}
        </span>
      </div>

      {/* Why it matters */}
      <p className="text-[11px] text-gray-600 leading-relaxed mb-3">{why}</p>

      {/* Good vs Bad examples */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        <div className="bg-emerald-50/60 rounded-lg p-2.5 border border-emerald-100/50">
          <div className="flex items-center gap-1 mb-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Correcto</span>
          </div>
          {goodExamples.map((ex) => (
            <p key={ex} className="text-[10px] text-emerald-700 font-mono leading-relaxed py-0.5">• {ex}</p>
          ))}
        </div>
        <div className="bg-red-50/60 rounded-lg p-2.5 border border-red-100/50">
          <div className="flex items-center gap-1 mb-1.5">
            <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">Evitar</span>
          </div>
          {badExamples.map((ex) => (
            <p key={ex} className="text-[10px] text-red-700 font-mono leading-relaxed py-0.5">• {ex}</p>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white/50 rounded-lg p-2.5 border border-teal-100/30">
        <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide block mb-1">Recomendaciones:</span>
        {tips.map((tip) => (
          <div key={tip} className="flex items-start gap-1.5 py-0.5">
            <span className="text-teal-400 text-[10px] mt-0.5 shrink-0">→</span>
            <span className="text-[11px] text-teal-700 leading-relaxed">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImprovementCard({ metric, currentIssue, icon, color, actions }: {
  metric: string;
  currentIssue: string;
  icon: string;
  color: string;
  actions: { title: string; description: string; fileAction: string }[];
}) {
  const colorStyles: Record<string, { border: string; bg: string; text: string; iconBg: string; actionBg: string }> = {
    blue: { border: "border-blue-200/50", bg: "bg-blue-50/30", text: "text-blue-800", iconBg: "bg-blue-100", actionBg: "bg-blue-50/50" },
    amber: { border: "border-amber-200/50", bg: "bg-amber-50/30", text: "text-amber-800", iconBg: "bg-amber-100", actionBg: "bg-amber-50/50" },
    emerald: { border: "border-emerald-200/50", bg: "bg-emerald-50/30", text: "text-emerald-800", iconBg: "bg-emerald-100", actionBg: "bg-emerald-50/50" },
  };
  const c = colorStyles[color] || colorStyles.blue;

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-6 h-6 rounded-lg ${c.iconBg} flex items-center justify-center shrink-0`}>
          <svg className={`w-3.5 h-3.5 ${c.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
        <h5 className={`text-xs font-bold ${c.text}`}>Mejorar {metric}</h5>
      </div>
      <p className="text-[11px] text-gray-500 mb-3 ml-8 italic">{currentIssue}</p>
      <div className="space-y-2 ml-8">
        {actions.map((a) => (
          <div key={a.title} className={`rounded-lg p-3 ${c.actionBg} border ${c.border}`}>
            <p className="text-[11px] font-bold text-gray-700 mb-0.5">{a.title}</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">{a.description}</p>
            <div className="flex items-start gap-1.5 mt-1.5 bg-white/70 rounded-md px-2.5 py-1.5 border border-gray-100">
              <svg className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[10px] text-teal-700"><strong>En el Excel:</strong> {a.fileAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

function TreeNode({ text, question, detail, type, highlight, active, dimmed }: {
  text?: string;
  question?: string;
  detail?: string;
  type: "question" | "leaf";
  highlight?: boolean;
  active?: boolean;
  dimmed?: boolean;
}) {
  if (type === "question") {
    return (
      <div className={`rounded-xl px-4 py-2.5 text-center shadow-sm border-2 ${
        dimmed
          ? "bg-gray-50 border-gray-200 opacity-40"
          : active
          ? "bg-violet-100 border-violet-400 ring-2 ring-violet-300/30"
          : "bg-violet-100 border-violet-300"
      }`}>
        <span className="text-[11px] font-semibold text-violet-800 block">{question || text}</span>
        {detail && (
          <span className={`text-[10px] block mt-0.5 ${dimmed ? "text-gray-400" : "text-violet-500 font-mono"}`}>{detail}</span>
        )}
      </div>
    );
  }
  return (
    <div className={`flex-1 rounded-xl px-3 py-2.5 text-center border-2 shadow-sm ${
      highlight
        ? "bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300/50"
        : dimmed
        ? "bg-gray-50 border-gray-100 opacity-30"
        : "bg-gray-50 border-gray-200"
    }`}>
      <span className={`text-xs font-bold ${highlight ? "text-emerald-700" : "text-gray-500"}`}>{text}</span>
      {highlight && <span className="text-[9px] text-emerald-500 block mt-0.5">← Llega aquí</span>}
    </div>
  );
}

function ProbabilityBar({ label, sublabel, value, isWinner }: { label: string; sublabel: string; value: number; isWinner?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-16 shrink-0 text-right">
        <span className={`text-xs font-bold ${isWinner ? "text-emerald-700" : "text-gray-600"}`}>{label}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isWinner ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-violet-200 to-violet-300"
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className={`text-xs font-bold tabular-nums min-w-[3rem] ${isWinner ? "text-emerald-700" : "text-gray-500"}`}>
            {value}%
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">{sublabel}</p>
      </div>
      {isWinner && (
        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">PREDICCIÓN</span>
      )}
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

function ForecastFeatureItem({ name, example, explanation }: { name: string; example: string; explanation: string }) {
  return (
    <div className="bg-teal-50/40 rounded-lg px-3 py-2 border border-teal-100/30">
      <div className="flex items-center gap-2 mb-0.5">
        <code className="text-[11px] font-mono font-bold text-teal-700">{name}</code>
        <span className="text-[10px] text-teal-500 font-mono">= {example}</span>
      </div>
      <p className="text-[10px] text-gray-500 leading-relaxed">{explanation}</p>
    </div>
  );
}

function ForecastIterStep({ month, lags, result, isFirst }: { month: string; lags: string; result: string; isFirst?: boolean }) {
  return (
    <div className={`flex items-start gap-3 rounded-lg px-4 py-2.5 border ${isFirst ? "bg-emerald-50/50 border-emerald-200/50" : "bg-gray-50 border-gray-100"}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${isFirst ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-gray-700">{month}</p>
        <p className="text-[10px] text-gray-400 font-mono">{lags}</p>
        <p className={`text-[11px] font-semibold mt-0.5 ${isFirst ? "text-emerald-700" : "text-gray-600"}`}>{result}</p>
      </div>
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
