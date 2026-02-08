"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import type { PredictionDataPoint } from "@/lib/api";

interface Props {
  historico: PredictionDataPoint[];
  pronostico: PredictionDataPoint[];
}

interface ChartRow {
  periodo: string;
  historico: number | null;
  pronostico: number | null;
  ci_lower: number | null;
  ci_upper: number | null;
  ci_range: [number, number] | null;
}

export default function PredictionTrendChart({ historico, pronostico }: Props) {
  if ((!historico || historico.length === 0) && (!pronostico || pronostico.length === 0)) return null;

  // Build unified dataset
  const data: ChartRow[] = [];

  historico.forEach((p) => {
    data.push({
      periodo: p.periodo,
      historico: p.cantidad_estimada,
      pronostico: null,
      ci_lower: null,
      ci_upper: null,
      ci_range: null,
    });
  });

  // Bridge point: last historical point also starts the forecast
  if (historico.length > 0 && pronostico.length > 0) {
    const last = historico[historico.length - 1];
    data[data.length - 1] = {
      ...data[data.length - 1],
      pronostico: last.cantidad_estimada,
    };
  }

  pronostico.forEach((p) => {
    data.push({
      periodo: p.periodo,
      historico: null,
      pronostico: p.cantidad_estimada,
      ci_lower: p.limite_inferior,
      ci_upper: p.limite_superior,
      ci_range: [p.limite_inferior, p.limite_superior],
    });
  });

  // "Hoy" reference line at the boundary
  const todayLabel = historico.length > 0 ? historico[historico.length - 1].periodo : "";

  return (
    <div className="chart-card">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
        Tendencia y Pronóstico Mensual
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
          <defs>
            <linearGradient id="ciBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="periodo" angle={-45} textAnchor="end" fontSize={11} tick={{ fill: "#94a3b8" }} />
          <YAxis tick={{ fill: "#94a3b8" }} fontSize={12} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                historico: "Histórico",
                pronostico: "Pronóstico",
                ci_range: "Intervalo 95%",
              };
              if (name === "ci_range") {
                return ["", ""];
              }
              return [Math.round(value), labels[name] ?? name];
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value: string) => {
              const labels: Record<string, string> = {
                historico: "Histórico",
                pronostico: "Pronóstico",
                ci_range: "Intervalo 95%",
              };
              return labels[value] ?? value;
            }}
          />

          {/* CI band */}
          <Area
            type="monotone"
            dataKey="ci_range"
            fill="url(#ciBand)"
            stroke="none"
            connectNulls={false}
            legendType="square"
          />

          {/* Historical line */}
          <Line
            type="monotone"
            dataKey="historico"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
            connectNulls={false}
          />

          {/* Forecast line (dashed) */}
          <Line
            type="monotone"
            dataKey="pronostico"
            stroke="#10b981"
            strokeWidth={2.5}
            strokeDasharray="8 4"
            dot={{ r: 3, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
            connectNulls={false}
          />

          {/* "Hoy" vertical reference */}
          {todayLabel && (
            <ReferenceLine
              x={todayLabel}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{
                value: "Último dato",
                position: "top",
                fill: "#64748b",
                fontSize: 11,
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
