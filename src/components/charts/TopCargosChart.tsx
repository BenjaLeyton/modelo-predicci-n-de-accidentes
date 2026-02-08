"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface Props {
  data: { name: string; value: number }[];
  title: string;
  color?: string;
}

export default function TopCargosChart({ data, title, color = "#f97316" }: Props) {
  if (!data || data.length === 0) return null;
  const gradientId = `grad-${color.replace("#", "")}`;

  return (
    <div className="chart-card">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-5 rounded-full" style={{ background: `linear-gradient(to bottom, ${color}, ${color}99)` }} />
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 120, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" tick={{ fill: "#94a3b8" }} fontSize={12} />
          <YAxis dataKey="name" type="category" fontSize={11} width={110} tick={{ fill: "#64748b" }} />
          <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)" }} />
          <Bar dataKey="value" fill={`url(#${gradientId})`} radius={[0, 6, 6, 0]} />
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity={0.7} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
