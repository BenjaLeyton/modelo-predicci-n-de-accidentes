"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Props {
  data: { name: string; value: number }[];
}

const COLORS = ["#3b82f6", "#f97316", "#10b981", "#8b5cf6", "#06b6d4", "#f43f5e"];

export default function TurnoChart({ data }: Props) {
  if (!data || data.length === 0) return null;
  return (
    <div className="chart-card">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
        Distribución por Turno
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={105}
            innerRadius={50}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            fontSize={11}
            strokeWidth={3}
            stroke="#fff"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)" }} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
