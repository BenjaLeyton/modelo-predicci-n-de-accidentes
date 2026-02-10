"use client";

import { useState, useRef, useCallback } from "react";
import { uploadFile } from "@/lib/api";
import type { ModelInfo } from "@/lib/api";

interface UploadData {
  filas: number;
  fecha_min: string;
  fecha_max: string;
  fecha_carga: string;
}

interface Props {
  modelInfo: ModelInfo | null;
  modelLoading: boolean;
}

export default function UploadSection({ modelInfo, modelLoading }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadOk, setUploadOk] = useState(false);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.name.endsWith(".xlsx") || dropped.name.endsWith(".xls"))) {
      setFile(dropped);
      setUploadMsg(null);
      setUploadOk(false);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadMsg(null);
    setUploadOk(false);
    setUploadData(null);
    try {
      const res = await uploadFile(file);
      setUploadMsg(res.mensaje);
      setUploadOk(true);
      if (res.filas) {
        setUploadData({
          filas: res.filas,
          fecha_min: res.fecha_min || "N/A",
          fecha_max: res.fecha_max || "N/A",
          fecha_carga: new Date().toLocaleString("es-CL", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          }),
        });
      }
    } catch (e: unknown) {
      setUploadMsg(e instanceof Error ? e.message : "Error al subir archivo");
      setUploadOk(false);
    } finally {
      setUploading(false);
    }
  };

  // Data already loaded from server (on page load)
  const hasServerData = !modelLoading && modelInfo && modelInfo.existe && modelInfo.total_registros_entrenamiento;
  // Data just uploaded in this session
  const hasJustUploaded = uploadOk && uploadData;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Cargar Datos</h2>
            <p className="text-xs text-blue-100">Sube tu archivo Excel con la nómina de accidentes para habilitar el análisis y pronóstico</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Data status card - shown when server has data or just uploaded */}
        {(hasServerData || hasJustUploaded) && (
          <div className="mb-4 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl border border-emerald-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
              <span className="text-sm font-bold text-emerald-700">Datos Cargados</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Registros</p>
                <p className="text-lg font-bold text-gray-800 tabular-nums">
                  {hasJustUploaded
                    ? uploadData!.filas.toLocaleString()
                    : modelInfo!.total_registros_entrenamiento!.toLocaleString()
                  }
                </p>
                <p className="text-[10px] text-gray-400">accidentes</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Datos desde</p>
                <p className="text-sm font-bold text-gray-800 tabular-nums">
                  {hasJustUploaded ? uploadData!.fecha_min : (modelInfo!.datos_desde || "—")}
                </p>
                <p className="text-[10px] text-gray-400">fecha más antigua</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Datos hasta</p>
                <p className="text-sm font-bold text-gray-800 tabular-nums">
                  {hasJustUploaded ? uploadData!.fecha_max : (modelInfo!.datos_hasta || "—")}
                </p>
                <p className="text-[10px] text-gray-400">fecha más reciente</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Última actualización</p>
                <p className="text-sm font-bold text-gray-800 tabular-nums">
                  {hasJustUploaded
                    ? uploadData!.fecha_carga
                    : modelInfo!.fecha_entrenamiento
                      ? new Date(modelInfo!.fecha_entrenamiento).toLocaleString("es-CL", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })
                      : "—"
                  }
                </p>
                <p className="text-[10px] text-gray-400">datos subidos al sistema</p>
              </div>
            </div>
            <p className="text-[11px] text-emerald-600 mt-3 leading-relaxed">
              Los modelos de pronóstico se entrenan automáticamente cada vez que presionas &quot;Pronosticar&quot;.
              Para actualizar los datos, sube un nuevo archivo abajo.
            </p>
          </div>
        )}

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? "border-blue-400 bg-blue-50 scale-[1.01]"
              : file
              ? "border-emerald-300 bg-emerald-50/50"
              : "border-gray-200 bg-gray-50/50 hover:border-blue-300 hover:bg-blue-50/30"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setUploadMsg(null);
              setUploadOk(false);
            }}
            className="hidden"
          />

          {file ? (
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB — Listo para subir</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setUploadMsg(null); setUploadOk(false); }}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600">
                {hasServerData || hasJustUploaded
                  ? <>Arrastra un <strong>nuevo archivo</strong> para actualizar los datos</>
                  : <>Arrastra tu archivo aquí o <span className="text-blue-600 font-semibold">haz clic para seleccionar</span></>
                }
              </p>
              <p className="text-xs text-gray-400 mt-1">Formatos aceptados: .xlsx, .xls</p>
            </>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-500/20"
        >
          {uploading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Subiendo archivo...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {hasServerData || hasJustUploaded ? "Actualizar Datos" : "Subir Archivo"}
            </>
          )}
        </button>

        {uploadMsg && (
          <div className={`mt-2 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 ${
            uploadOk ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          }`}>
            {uploadOk ? (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {uploadMsg}
          </div>
        )}
      </div>
    </div>
  );
}
