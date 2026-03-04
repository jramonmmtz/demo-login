"use client";

import { useUser } from "@/app/context/UserContext";
import { useState } from "react";

export default function ConfigPage() {
  const { currentUser, isLoading } = useUser();
  const [saved, setSaved] = useState(false);

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (currentUser.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <span className="text-5xl">🔒</span>
        <h2 className="text-xl font-bold text-gray-700">Acceso restringido</h2>
        <p className="text-gray-400 text-sm">
          Solo administradores pueden acceder a la configuración.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
        <p className="text-gray-500 text-sm mt-1">Ajustes generales del sistema.</p>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="bg-gray-50 border-b px-4 py-3">
          <h3 className="font-medium text-gray-700">General</h3>
        </div>
        <div className="divide-y">
          {[
            { label: "Nombre de la app", value: "MyApp" },
            { label: "Versión", value: "1.0.0" },
            { label: "Modo mantenimiento", value: "Desactivado" },
            { label: "Máx. usuarios activos", value: "500" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className="text-sm font-medium text-gray-700">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="bg-gray-50 border-b px-4 py-3">
          <h3 className="font-medium text-gray-700">Notificaciones</h3>
        </div>
        <div className="divide-y">
          {[
            { label: "Alertas por email", enabled: true },
            { label: "Reportes automáticos", enabled: true },
            { label: "Notificaciones push", enabled: false },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-gray-500">{item.label}</span>
              <div className={`w-10 h-5 rounded-full flex items-center px-1 ${item.enabled ? "bg-purple-500" : "bg-gray-300"}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-all ${item.enabled ? "ml-5" : "ml-0"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        className="self-start px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
      >
        {saved ? "✅ Guardado!" : "Guardar cambios"}
      </button>
    </div>
  );
}