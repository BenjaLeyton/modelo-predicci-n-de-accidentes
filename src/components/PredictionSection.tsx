"use client";

import { useState, useMemo } from "react";
import { getPrediction } from "@/lib/api";
import type { PredictionData } from "@/lib/api";
import PredictionTrendChart from "./charts/PredictionTrendChart";
import PredictionRCChart from "./charts/PredictionRCChart";

/** Add N months to a YYYY-MM-DD string, clamped to last day of resulting month */
function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setMonth(d.getMonth() + months);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const lastDay = new Date(y, d.getMonth() + 1, 0).getDate();
  const day = String(Math.min(lastDay, new Date(dateStr + "T00:00:00").getDate())).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Count months between two YYYY-MM-DD strings */
function monthsBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return (db.getFullYear() - da.getFullYear()) * 12 + (db.getMonth() - da.getMonth());
}

export default function PredictionSection() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
    ).padStart(2, "0")}`;
  });

  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Date validation ──
  const dateValidation = useMemo(() => {
    if (!startDate || !endDate) return { valid: false, error: "Selecciona ambas fechas." };
    const diff = monthsBetween(startDate, endDate);
    if (diff < 1) return { valid: false, error: "La fecha de fin debe ser al menos 1 mes después del inicio." };
    if (diff > 24) return { valid: false, error: `El pronóstico no puede exceder 24 meses (seleccionaste ${diff}).` };
    return { valid: true, error: null, months: diff };
  }, [startDate, endDate]);

  // Min for end date: at least 1 month after start
  const endDateMin = useMemo(() => startDate ? addMonths(startDate, 1) : "", [startDate]);
  // Max for end date: 24 months after start
  const endDateMax = useMemo(() => startDate ? addMonths(startDate, 24) : "", [startDate]);

  const handleStartChange = (val: string) => {
    setStartDate(val);
    // If current end is now invalid, auto-adjust it
    if (val && endDate) {
      const diff = monthsBetween(val, endDate);
      if (diff < 1) setEndDate(addMonths(val, 1));
      else if (diff > 24) setEndDate(addMonths(val, 24));
    }
  };

  const handlePredict = async () => {
    if (!startDate || !endDate || !dateValidation.valid) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPrediction(startDate, endDate);
      setPrediction(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al generar pronóstico");
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      {/* Separator */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-emerald-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-emerald-700">
              Pronóstico de Accidentes
            </span>
          </span>
        </div>
      </div>

      {/* Explainer banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/80 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="font-semibold text-emerald-800 mb-1">Pronóstico con XGBoost (Extreme Gradient Boosting)</p>
            <p className="text-gray-500">
              Este pronóstico usa <strong>XGBoost</strong>, el mismo algoritmo de Machine Learning explicado arriba,
              pero aplicado a <strong>series de tiempo</strong>: entrena un modelo XGBRegressor sobre los conteos mensuales
              de accidentes para predecir <em>cuántos</em> ocurrirán en los meses futuros. Además, entrena un
              modelo XGBoost <strong>independiente por cada Causa Raíz (RC)</strong> para proyectar cómo se distribuirán.
              Solo requiere que haya datos subidos.
            </p>
          </div>
        </div>
      </div>

      {/* Date picker + button */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Inicio pronóstico</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Fin pronóstico</label>
            <input
              type="date"
              value={endDate}
              min={endDateMin}
              max={endDateMax}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
          </div>
          <button
            onClick={handlePredict}
            disabled={loading || !dateValidation.valid}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Calculando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Pronosticar
              </>
            )}
          </button>
        </div>

        {/* Date range info & validation */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-[11px] text-gray-400">
            Rango permitido: <strong className="text-gray-500">1 a 24 meses</strong> entre inicio y fin
          </span>
          {dateValidation.valid && dateValidation.months != null && (
            <span className="text-[11px] text-emerald-600 font-medium">
              {dateValidation.months} {dateValidation.months === 1 ? "mes" : "meses"} seleccionados
            </span>
          )}
          {!dateValidation.valid && dateValidation.error && (
            <span className="text-[11px] text-red-500 font-medium">
              {dateValidation.error}
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-sm text-red-600 flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          {error}
        </div>
      )}

      {prediction && (
        <>
          {/* Warnings */}
          {prediction.advertencias.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold mb-1">Advertencia sobre confiabilidad</p>
                  {prediction.advertencias.map((w, i) => (
                    <p key={i} className="text-amber-700">{w}</p>
                  ))}
                  <p className="text-amber-600 mt-2 text-xs leading-relaxed">
                    <strong>¿Por qué importa?</strong> XGBoost necesita suficientes datos mensuales para aprender patrones de tendencia,
                    y los features estacionales (variaciones por época del año) requieren al menos 12 meses
                    para capturar ciclos anuales reales. Con pocos datos, el modelo puede sobreajustar
                    a fluctuaciones aleatorias en vez de patrones reales.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
              <p className="text-xs text-gray-500 mb-1">Total Estimado</p>
              <p className="text-2xl font-bold text-emerald-700">
                {Math.round(prediction.total_estimado)}
              </p>
              <p className="text-xs text-gray-400 mt-1">accidentes proyectados</p>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
              <p className="text-xs text-gray-500 mb-1">Meses Pronosticados</p>
              <p className="text-2xl font-bold text-teal-700">
                {prediction.meses_pronosticados}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {prediction.periodo_solicitado.inicio} a {prediction.periodo_solicitado.fin}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
              <p className="text-xs text-gray-500 mb-1">Datos Históricos</p>
              <p className="text-2xl font-bold text-slate-700">
                {prediction.datos_historicos_usados}
              </p>
              <p className="text-xs text-gray-400 mt-1">meses utilizados</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PredictionTrendChart
              historico={prediction.tendencia_historica}
              pronostico={prediction.pronostico}
            />
            <PredictionRCChart data={prediction.distribucion_rc_predicha} />
          </div>

          {/* Methodology note - XGBoost */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 text-sm text-gray-600 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-emerald-800 mb-2">¿Cómo funciona este pronóstico con XGBoost?</p>
                <p className="text-gray-500 leading-relaxed mb-3">
                  Se entrena un modelo <strong>XGBRegressor</strong> (la versión regresora de XGBoost)
                  sobre la serie temporal de conteos mensuales de accidentes.
                  Es el mismo algoritmo de Machine Learning usado para clasificar RC, pero aquí aprende a
                  predecir <em>cuántos</em> accidentes ocurrirán cada mes.
                </p>
              </div>
            </div>

            <div className="ml-11 space-y-3 text-gray-500">
              <div>
                <p className="font-medium text-gray-700">1. Features temporales para XGBoost</p>
                <p className="leading-relaxed">
                  Se cuentan los accidentes por mes y se crean variables que XGBoost usa para aprender patrones:
                  mes del año, año, estacionalidad cíclica (sin/cos), índice de tendencia,
                  valores de los 3 meses anteriores (lags) y media móvil.
                  XGBoost detecta automáticamente relaciones no lineales entre estas variables.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">2. Predicción iterativa mes a mes</p>
                <p className="leading-relaxed">
                  Para cada mes futuro, XGBoost predice usando sus features temporales.
                  La predicción de un mes se alimenta como input (lag) del siguiente,
                  permitiendo que el modelo encadene pronósticos que son coherentes entre sí.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">3. Intervalo de confianza (banda sombreada)</p>
                <p className="leading-relaxed">
                  La banda verde indica el rango donde se espera que caiga el valor real con un 95% de confianza.
                  Se calcula a partir de los residuos (errores) del modelo en datos históricos y
                  se ensancha a medida que el pronóstico se aleja del último dato conocido.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">4. Distribución de Causa Raíz con XGBoost por RC</p>
                <p className="leading-relaxed">
                  Se entrena un modelo XGBoost <strong>independiente para cada categoría RC</strong> sobre
                  sus conteos mensuales propios. Así, cada RC tiene su propia predicción que refleja
                  su tendencia y estacionalidad particular. Las categorías con pocos datos usan proporciones históricas.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {!prediction && !loading && !error && (
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm py-14 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-gray-600 text-base font-medium">
            Selecciona un rango de fechas futuro y presiona &quot;Pronosticar&quot;
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Se proyectarán accidentes estimados con intervalo de confianza al 95%
          </p>
        </div>
      )}
    </section>
  );
}
