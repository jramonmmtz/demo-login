"use client";

import { useUser } from "@/app/context/UserContext";

const reportesData = {
  admin: {
    title: "Reportes del Sistema",
    description: "Vista completa de todos los reportes.",
    reportes: [
      { id: 1, nombre: "Reporte de ventas Q1", estado: "Completado", fecha: "2024-01-15", autor: "Ramon Martinez" },
      { id: 2, nombre: "Reporte de usuarios activos", estado: "En progreso", fecha: "2024-02-01", autor: "Admin Juan" },
      { id: 3, nombre: "Reporte de errores", estado: "Pendiente", fecha: "2024-02-10", autor: "Ramon Martinez" },
      { id: 4, nombre: "Reporte financiero Q4", estado: "Completado", fecha: "2024-01-30", autor: "Admin Juan" },
    ],
  },
  user: {
    title: "Mis Reportes",
    description: "Solo tus reportes asignados.",
    reportes: [
      { id: 1, nombre: "Reporte de ventas Q1", estado: "Completado", fecha: "2024-01-15", autor: "Ramon Martinez" },
      { id: 3, nombre: "Reporte de errores", estado: "Pendiente", fecha: "2024-02-10", autor: "Ramon Martinez" },
    ],
  },
};

const estadoColors: Record<string, string> = {
  Completado: "bg-green-100 text-green-700",
  "En progreso": "bg-yellow-100 text-yellow-700",
  Pendiente: "bg-red-100 text-red-700",
};

export default function ReportesPage() {
  const { currentUser, isLoading } = useUser();

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (currentUser.role === "guest") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <span className="text-5xl">🔒</span>
        <h2 className="text-xl font-bold text-gray-700">Acceso restringido</h2>
        <p className="text-gray-400 text-sm">Los invitados no pueden ver reportes.</p>
      </div>
    );
  }

  const data = reportesData[currentUser.role as keyof typeof reportesData];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{data.title}</h1>
        <p className="text-gray-500 text-sm mt-1">{data.description}</p>
      </div>

      {/* Tabla desktop */}
      <div className="hidden md:block rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Autor</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Fecha</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.reportes.map((reporte, i) => (
              <tr key={reporte.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-medium text-gray-700">{reporte.nombre}</td>
                <td className="px-4 py-3 text-gray-500">{reporte.autor}</td>
                <td className="px-4 py-3 text-gray-500">{reporte.fecha}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${estadoColors[reporte.estado]}`}>
                    {reporte.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <div className="md:hidden flex flex-col gap-3">
        {data.reportes.map((reporte) => (
          <div key={reporte.id} className="rounded-xl border p-4 bg-white flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-gray-800 text-sm">{reporte.nombre}</p>
              <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${estadoColors[reporte.estado]}`}>
                {reporte.estado}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{reporte.autor}</span>
              <span>{reporte.fecha}</span>
            </div>
          </div>
        ))}
      </div>

      {currentUser.role === "admin" && (
        <div className="rounded-xl border p-4 bg-purple-50 border-purple-200">
          <p className="text-sm text-purple-700 font-medium">
            👆 Como Admin ves todos los reportes. Un User solo ve los suyos.
          </p>
        </div>
      )}
    </div>
  );
}