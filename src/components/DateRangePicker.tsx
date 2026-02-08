"use client";

interface Props {
  startDate: string;
  endDate: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onSearch,
  loading,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-wrap items-center gap-5">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-gray-700">Periodo de análisis</span>
      </div>

      <div className="h-8 w-px bg-gray-200 hidden sm:block" />

      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-400 font-medium">Desde</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-400 font-medium">Hasta</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
        />
      </div>

      <button
        onClick={onSearch}
        disabled={loading}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-7 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-500/20"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Cargando...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar
          </>
        )}
      </button>
    </div>
  );
}
