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
            XGBoost
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
          Modelo de <strong className="text-gray-700">clasificación y pronóstico</strong> entrenado con{" "}
          <strong className="text-gray-700">{info.total_registros_entrenamiento?.toLocaleString() || "—"} registros</strong>.
          Clasifica la causa raíz (RC) de accidentes y pronostica conteos futuros con XGBRegressor.
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
