"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface Props {
  data: { mes: string; cantidad: number }[];
}

export default function TrendChart({ data }: Props) {
  if (!data || data.length === 0) return null;
  return (
    <div className="chart-card">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full" />
        Tendencia Mensual
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="mes" angle={-45} textAnchor="end" fontSize={11} tick={{ fill: "#94a3b8" }} />
          <YAxis tick={{ fill: "#94a3b8" }} fontSize={12} />
          <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)" }} />
          <Area
            type="monotone"
            dataKey="cantidad"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            fill="url(#trendFill)"
            dot={{ r: 4, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
