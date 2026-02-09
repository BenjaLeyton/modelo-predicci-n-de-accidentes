"use client";

import { useState, useEffect, useCallback } from "react";
import { getModelInfo, getAnalysis } from "@/lib/api";
import type { ModelInfo, AnalysisData } from "@/lib/api";
import ModelStatus from "./ModelStatus";
import ModelStatusCompact from "./ModelStatusCompact";
import DateRangePicker from "./DateRangePicker";
import StatsCards from "./StatsCards";
import UploadSection from "./UploadSection";
import RCDistributionChart from "./charts/RCDistributionChart";
import TrendChart from "./charts/TrendChart";
import DayOfWeekChart from "./charts/DayOfWeekChart";
import TurnoChart from "./charts/TurnoChart";
import GerenciaChart from "./charts/GerenciaChart";
import CategoriaChart from "./charts/CategoriaChart";
import TopCargosChart from "./charts/TopCargosChart";
import PredictionSection from "./PredictionSection";

export default function Dashboard() {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"panel" | "guia">("panel");
  const [regressorMetrics, setRegressorMetrics] = useState<Record<string, number> | null>(null);

  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  const fetchModel = useCallback(async () => {
    setModelLoading(true);
    try {
      const info = await getModelInfo();
      setModelInfo(info);
    } catch {
      setModelInfo(null);
    } finally {
      setModelLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModel();
  }, [fetchModel]);

  const handleSearch = async () => {
    if (!startDate || !endDate) return;
    setAnalysisLoading(true);
    setError(null);
    try {
      const data = await getAnalysis(startDate, endDate);
      setAnalysis(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al cargar análisis");
      setAnalysis(null);
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══════════════════ HEADER ═══════════════════ */}
      <header className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Sistema de Seguridad Laboral
              </h1>
              <p className="text-sm text-blue-200/70">
                Codelco — Análisis y Pronóstico de Accidentes
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════ TAB BAR ═══════════════════ */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6">
          <nav className="flex gap-1 py-2">
            <button
              onClick={() => setActiveTab("panel")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "panel"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Panel Principal
            </button>
            <button
              onClick={() => setActiveTab("guia")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "guia"
                  ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md shadow-violet-500/20"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Guía del Modelo
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">

        {/* ═══════════════════ TAB 1: PANEL PRINCIPAL ═══════════════════ */}
        <div className={activeTab !== "panel" ? "hidden" : ""}>
          <div className="space-y-8">
            {/* 1. CARGA DE DATOS */}
            <UploadSection onTrainComplete={fetchModel} modelInfo={modelInfo} modelLoading={modelLoading} />

            {/* 2. MODELO (compacto) */}
            <ModelStatusCompact info={modelInfo} loading={modelLoading} regressorMetrics={regressorMetrics} />

            {/* 3. ANÁLISIS HISTÓRICO */}
            <section>
              {/* Section separator */}
              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-50 px-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-md shadow-blue-500/20">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </span>
                    <span className="text-sm font-semibold text-blue-700">
                      Análisis Histórico
                    </span>
                    <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                      Sin ML — Datos reales
                    </span>
                  </span>
                </div>
              </div>

              {/* Explainer */}
              <div className="bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/80 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    <p className="font-semibold text-blue-800 mb-1">Estadísticas de accidentes pasados</p>
                    <p className="text-gray-500">
                      Selecciona un rango de fechas para visualizar <strong>qué ocurrió</strong> en ese periodo:
                      distribución por Causa Raíz, tendencia mensual, turnos, gerencias, cargos y más.
                      Estos datos son el insumo que alimenta tanto el modelo XGBoost como el pronóstico.
                    </p>
                  </div>
                </div>
              </div>

              {/* Date Range Picker */}
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
                onSearch={handleSearch}
                loading={analysisLoading}
              />

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-sm text-red-600 flex items-center gap-3 mt-6">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  {error}
                </div>
              )}

              {/* Analysis results */}
              {analysis && (
                <div className="mt-6 space-y-6">
                  {/* Stats Cards */}
                  <StatsCards
                    total={analysis.total_accidentes}
                    edadPromedio={analysis.edad_promedio}
                    periodo={analysis.periodo}
                  />

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RCDistributionChart data={analysis.rc_distribution} />
                    <TrendChart data={analysis.tendencia_mensual} />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DayOfWeekChart data={analysis.dia_semana_distribution} />
                    <TurnoChart data={analysis.turno_distribution} />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GerenciaChart data={analysis.gerencia_distribution} />
                    <CategoriaChart data={analysis.categoria_distribution} />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TopCargosChart data={analysis.top_cargos} title="Top 10 Cargos con más Accidentes" color="#f97316" />
                    <TopCargosChart data={analysis.empresa_distribution} title="Top 10 Empresas con más Accidentes" color="#6366f1" />
                  </div>
                </div>
              )}

              {/* Empty state for analysis */}
              {!analysis && !analysisLoading && !error && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-14 text-center mt-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-base font-medium">
                    Selecciona un rango de fechas y presiona &quot;Buscar&quot;
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Se visualizarán gráficos y estadísticas del periodo seleccionado
                  </p>
                </div>
              )}
            </section>

            {/* 4. PRONÓSTICO */}
            <PredictionSection onMetrics={setRegressorMetrics} />
          </div>
        </div>

        {/* ═══════════════════ TAB 2: GUÍA DEL MODELO ═══════════════════ */}
        <div className={activeTab !== "guia" ? "hidden" : ""}>
          <ModelStatus info={modelInfo} loading={modelLoading} />
        </div>

        {/* ═══════════════════ FOOTER ═══════════════════ */}
        <footer className="text-center py-6 text-xs text-gray-400">
          Sistema de Seguridad Laboral — Codelco Chile
        </footer>
      </main>
    </div>
  );
}
