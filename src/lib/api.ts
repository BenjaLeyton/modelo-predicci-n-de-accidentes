const API = process.env.NEXT_PUBLIC_API_URL || "https://benjaleyton-accidentes-api.hf.space";

/* ── Model Info ── */

export interface ModelInfo {
  existe: boolean;
  fecha_entrenamiento: string | null;
  datos_desde: string | null;
  datos_hasta: string | null;
  total_registros_entrenamiento: number | null;
  clases: string[] | null;
  metricas: Record<string, number> | null;
  necesita_actualizacion: boolean;
  razon_actualizacion: string | null;
}

/* ── Analysis ── */

interface RawDistribution {
  categoria: string;
  cantidad: number;
  porcentaje: number;
}

interface RawTendencia {
  periodo: string;
  cantidad: number;
}

interface RawAnalysis {
  periodo: Record<string, string>;
  total_accidentes: number;
  distribucion_rc: RawDistribution[];
  distribucion_turno: RawDistribution[];
  distribucion_gcia: RawDistribution[];
  distribucion_empresa: RawDistribution[];
  distribucion_dia_semana: RawDistribution[];
  tendencia_mensual: RawTendencia[];
  estadisticas_edad: { promedio: number; minima: number; maxima: number; mediana: number } | null;
  top_cargos: RawDistribution[];
  distribucion_categoria: RawDistribution[] | null;
}

export interface AnalysisData {
  total_accidentes: number;
  edad_promedio: number | null;
  periodo: { inicio: string; fin: string };
  rc_distribution: { name: string; value: number }[];
  turno_distribution: { name: string; value: number }[];
  gerencia_distribution: { name: string; value: number }[];
  empresa_distribution: { name: string; value: number }[];
  dia_semana_distribution: { name: string; value: number }[];
  tendencia_mensual: { mes: string; cantidad: number }[];
  top_cargos: { name: string; value: number }[];
  categoria_distribution: { name: string; value: number }[];
}

function mapDist(arr: RawDistribution[] | null | undefined): { name: string; value: number }[] {
  if (!arr) return [];
  return arr.map((d) => ({ name: d.categoria, value: d.cantidad }));
}

function mapAnalysis(raw: RawAnalysis): AnalysisData {
  return {
    total_accidentes: raw.total_accidentes,
    edad_promedio: raw.estadisticas_edad?.promedio ?? null,
    periodo: {
      inicio: raw.periodo?.inicio ?? raw.periodo?.start ?? "",
      fin: raw.periodo?.fin ?? raw.periodo?.end ?? "",
    },
    rc_distribution: mapDist(raw.distribucion_rc),
    turno_distribution: mapDist(raw.distribucion_turno),
    gerencia_distribution: mapDist(raw.distribucion_gcia),
    empresa_distribution: mapDist(raw.distribucion_empresa),
    dia_semana_distribution: mapDist(raw.distribucion_dia_semana),
    tendencia_mensual: (raw.tendencia_mensual ?? []).map((t) => ({ mes: t.periodo, cantidad: t.cantidad })),
    top_cargos: mapDist(raw.top_cargos),
    categoria_distribution: mapDist(raw.distribucion_categoria),
  };
}

/* ── Prediction ── */

export interface PredictionDataPoint {
  periodo: string;
  cantidad_estimada: number;
  limite_inferior: number;
  limite_superior: number;
  es_historico: boolean;
}

export interface PredictedRC {
  categoria: string;
  cantidad_estimada: number;
  porcentaje: number;
}

export interface PredictionData {
  periodo_solicitado: { inicio: string; fin: string };
  meses_pronosticados: number;
  total_estimado: number;
  tendencia_historica: PredictionDataPoint[];
  pronostico: PredictionDataPoint[];
  distribucion_rc_predicha: PredictedRC[];
  metodologia: string;
  datos_historicos_usados: number;
  advertencias: string[];
}

/* ── Fetch functions ── */

export async function getModelInfo(): Promise<ModelInfo> {
  const res = await fetch(`${API}/model`);
  if (!res.ok) throw new Error("Error al obtener info del modelo");
  return res.json();
}

export async function getAnalysis(start: string, end: string): Promise<AnalysisData> {
  const res = await fetch(`${API}/analysis?start=${start}&end=${end}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? "Error al obtener análisis");
  }
  const raw: RawAnalysis = await res.json();
  return mapAnalysis(raw);
}

export async function uploadFile(file: File): Promise<{ success: boolean; mensaje: string; filas?: number }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API}/upload`, { method: "POST", body: form });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? "Error al subir archivo");
  }
  return res.json();
}

export async function trainModel(): Promise<{ success: boolean; mensaje: string; metricas?: Record<string, number> }> {
  const res = await fetch(`${API}/train`, { method: "POST" });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? "Error al entrenar modelo");
  }
  return res.json();
}

export async function getPrediction(start: string, end: string): Promise<PredictionData> {
  const res = await fetch(`${API}/predict?start=${start}&end=${end}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? "Error al obtener pronóstico");
  }
  return res.json();
}
