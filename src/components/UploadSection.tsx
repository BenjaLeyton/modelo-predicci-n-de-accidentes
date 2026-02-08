"use client";

import { useState, useRef, useCallback } from "react";
import { uploadFile, trainModel } from "@/lib/api";
import type { ModelInfo } from "@/lib/api";

interface Props {
  onTrainComplete: () => void;
  modelInfo: ModelInfo | null;
  modelLoading: boolean;
}

export default function UploadSection({ onTrainComplete, modelInfo, modelLoading }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [training, setTraining] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [trainMsg, setTrainMsg] = useState<string | null>(null);
  const [uploadOk, setUploadOk] = useState(false);
  const [trainOk, setTrainOk] = useState(false);
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
    try {
      const res = await uploadFile(file);
      setUploadMsg(res.mensaje);
      setUploadOk(true);
    } catch (e: unknown) {
      setUploadMsg(e instanceof Error ? e.message : "Error al subir archivo");
      setUploadOk(false);
    } finally {
      setUploading(false);
    }
  };

  const handleTrain = async () => {
    setTraining(true);
    setTrainMsg(null);
    setTrainOk(false);
    try {
      const res = await trainModel();
      setTrainMsg(res.mensaje);
      setTrainOk(true);
      onTrainComplete();
    } catch (e: unknown) {
      setTrainMsg(e instanceof Error ? e.message : "Error al entrenar");
      setTrainOk(false);
    } finally {
      setTraining(false);
    }
  };

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
            <h2 className="text-base font-bold text-white">Cargar Datos y Entrenar Modelo</h2>
            <p className="text-xs text-blue-100">Sube tu archivo Excel con la nómina de accidentes para comenzar el análisis</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step 1: Upload zone */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="text-sm font-semibold text-gray-700">Subir archivo Excel (.xlsx)</h3>
            </div>

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
                    Arrastra tu archivo aquí o <span className="text-blue-600 font-semibold">haz clic para seleccionar</span>
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
                  Subir Archivo
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

          {/* Step 2: Train */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="text-sm font-semibold text-gray-700">Entrenar Modelo</h3>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-orange-50/30 rounded-xl border border-gray-100 p-5 flex-1 flex flex-col">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Entrena el modelo de predicción con todos los datos cargados. El proceso puede tomar unos minutos.
                </p>

                {!modelLoading && modelInfo && modelInfo.existe && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Modelo activo
                  </div>
                )}
              </div>

              <button
                onClick={handleTrain}
                disabled={training}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-orange-500/20"
              >
                {training ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Entrenando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Entrenar Modelo
                  </>
                )}
              </button>

              {trainMsg && (
                <div className={`mt-2 text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${
                  trainOk ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                }`}>
                  {trainOk ? (
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {trainMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
