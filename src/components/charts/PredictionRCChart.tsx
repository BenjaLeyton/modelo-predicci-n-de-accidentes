"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { PredictedRC } from "@/lib/api";

interface Props {
  data: PredictedRC[];
}

export default function PredictionRCChart({ data }: Props) {
  if (!data || data.length === 0) return null;

  const chartData = data.map((d) => ({
    name: d.categoria,
    value: d.cantidad_estimada,
    porcentaje: d.porcentaje,
  }));

  return (
    <div className="chart-card">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full" />
        Distribución RC Proyectada
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 120, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" tick={{ fill: "#94a3b8" }} fontSize={12} />
          <YAxis dataKey="name" type="category" fontSize={11} width={110} tick={{ fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number, _name: string, item: { payload?: { porcentaje?: number } }) => [
              `${Math.round(value)} (${item.payload?.porcentaje ?? 0}%)`,
              "Estimado",
            ]}
          />
          <Bar dataKey="value" fill="url(#greenGradient)" radius={[0, 6, 6, 0]} />
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
