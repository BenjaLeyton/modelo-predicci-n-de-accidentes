"use client";

import type { ModelInfo } from "@/lib/api";

interface Props {
  info: ModelInfo | null;
  loading: boolean;
}

/* ── RC class descriptions (short, for tooltips) ── */
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

/* ── Metric config (labels only) ── */
const METRIC_INFO: Record<string, { label: string; icon: string }> = {
  accuracy: {
    label: "Accuracy",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  f1_weighted: {
    label: "F1 Weighted",
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
  },
  f1_macro: {
    label: "F1 Macro",
    icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4",
  },
  roc_auc: {
    label: "ROC AUC",
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

export default function ModelStatusCompact({ info, loading }: Props) {
  /* ── Loading ── */
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

  /* ── No connection ── */
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

  /* ── No model trained ── */
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

  /* ── Active model (compact) ── */
  const fechaStr = info.fecha_entrenamiento
    ? new Date(info.fecha_entrenamiento).toLocaleString("es-CL", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className={`px-6 py-4 flex flex-wrap items-center justify-between gap-3 ${
        info.necesita_actualizacion
          ? "bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100"
          : "bg-gradient-to-r from-emerald-50 to-cyan-50 border-b border-emerald-100"
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
          <span className="text-sm font-bold text-emerald-700">Modelo Activo</span>
          <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            XGBoost Classifier
          </span>
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

      {/* Brief description */}
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-sm text-gray-500 leading-relaxed">
          Modelo de <strong className="text-gray-700">clasificación de Causa Raíz</strong> entrenado con{" "}
          <strong className="text-gray-700">{info.total_registros_entrenamiento?.toLocaleString() || "—"} registros</strong>.
          Analiza datos de cada accidente y predice automáticamente la causa raíz (RC) más probable.
        </p>
      </div>

      {/* Training Info Grid */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <InfoItem
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            label="Entrenado"
            value={fechaStr || "—"}
          />
          <InfoItem
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 4H8L9 3z" /></svg>}
            label="Registros"
            value={info.total_registros_entrenamiento?.toLocaleString() || "—"}
          />
          <InfoItem
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            label="Datos desde"
            value={info.datos_desde || "—"}
          />
          <InfoItem
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            label="Datos hasta"
            value={info.datos_hasta || "—"}
          />
        </div>
      </div>

      {/* Compact Metrics */}
      {info.metricas && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h4 className="text-xs font-bold text-gray-600 mb-3">Rendimiento</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(["accuracy", "f1_weighted", "f1_macro", "roc_auc"] as const).map((key) => {
              const val = info.metricas![key];
              if (val == null) return null;
              const metricInfo = METRIC_INFO[key];
              const color = getMetricColor(key, val);
              const level = getMetricLevel(key, val);
              const colors = colorMap[color];

              return (
                <div key={key} className="flex items-center gap-3">
                  <svg className={`w-4 h-4 ${colors.text} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={metricInfo.icon} />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-gray-600">{metricInfo.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors.light} ${colors.text}`}>
                          {level}
                        </span>
                        <span className="text-xs font-bold text-gray-800 tabular-nums">
                          {(val * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors.fill} transition-all duration-700`}
                        style={{ width: `${Math.min(val * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Compact Classes as tags */}
      {info.clases && info.clases.length > 0 && (
        <div className="px-6 py-4">
          <h4 className="text-xs font-bold text-gray-600 mb-2">
            Clases ({info.clases.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {info.clases.map((cls) => (
              <div key={cls} className="group relative">
                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-default">
                  {cls}
                </span>
                {RC_DESCRIPTIONS[cls] && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-[11px] rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none leading-relaxed shadow-xl text-center">
                    {RC_DESCRIPTIONS[cls]}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 -mt-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Helper ── */
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 text-gray-400 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-gray-400 font-medium">{label}</p>
        <p className="text-sm text-gray-700 font-semibold">{value}</p>
      </div>
    </div>
  );
}
