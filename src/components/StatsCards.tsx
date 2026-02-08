"use client";

interface Props {
  total: number | null;
  edadPromedio: number | null;
  periodo: { inicio: string; fin: string } | null;
}

function Card({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${gradient}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function StatsCards({ total, edadPromedio, periodo }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <Card
        title="Total Accidentes"
        value={total != null ? total.toLocaleString() : "—"}
        gradient="bg-gradient-to-br from-red-500 to-orange-500 shadow-sm shadow-red-500/20"
        icon={
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        }
      />
      <Card
        title="Edad Promedio"
        value={edadPromedio != null ? edadPromedio.toFixed(1) + " años" : "—"}
        gradient="bg-gradient-to-br from-blue-500 to-cyan-500 shadow-sm shadow-blue-500/20"
        icon={
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />
      <Card
        title="Periodo Analizado"
        value={periodo ? `${periodo.inicio} → ${periodo.fin}` : "—"}
        gradient="bg-gradient-to-br from-violet-500 to-purple-500 shadow-sm shadow-violet-500/20"
        icon={
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      />
    </div>
  );
}
