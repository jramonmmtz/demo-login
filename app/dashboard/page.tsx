"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";

interface DashboardData {
  totalUsers: number;
  totalAdmins: number;
  totalRegularUsers: number;
  totalGuests: number;
  latestUsers: {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
}

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  user: "bg-blue-100 text-blue-700",
  guest: "bg-gray-100 text-gray-600",
};

const contentByRole = {
  admin: {
    title: "Panel de Administrador",
    description: "Vista completa del sistema.",
    color: "purple",
  },
  user: {
    title: "Mi Dashboard",
    description: "Bienvenido de nuevo.",
    color: "blue",
  },
  guest: {
    title: "Vista de Invitado",
    description: "Estás viendo una demo limitada.",
    color: "gray",
  },
};

const badgeColors: Record<string, string> = {
  purple: "bg-purple-100 text-purple-700",
  blue: "bg-blue-100 text-blue-700",
  gray: "bg-gray-100 text-gray-700",
};

const statColors: Record<string, string> = {
  purple: "border-purple-200 bg-purple-50 text-purple-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  gray: "border-gray-200 bg-gray-50 text-gray-700",
};

export default function DashboardPage() {
  const { currentUser, isLoading } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
      setLoadingData(false);
    }
    fetchData();
  }, []);

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  const content = contentByRole[currentUser.role];
  const badge = badgeColors[content.color];
  const stat = statColors[content.color];

  // Stats según rol
  const stats =
    currentUser.role === "admin"
      ? [
          { label: "Total usuarios", value: data?.totalUsers ?? "..." },
          { label: "Administradores", value: data?.totalAdmins ?? "..." },
          { label: "Usuarios", value: data?.totalRegularUsers ?? "..." },
          { label: "Invitados", value: data?.totalGuests ?? "..." },
        ]
      : currentUser.role === "user"
      ? [
          { label: "Total usuarios", value: data?.totalUsers ?? "..." },
          { label: "Usuarios activos", value: data?.totalRegularUsers ?? "..." },
        ]
      : [
          { label: "Usuarios registrados", value: data?.totalUsers ?? "..." },
        ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{content.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{content.description}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${badge}`}>
          {currentUser.role}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 flex flex-col gap-1 ${stat}`}>
            <span className="text-xs text-gray-500">{s.label}</span>
            <span className="text-2xl font-bold">
              {loadingData ? "..." : s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Últimos usuarios — solo admin */}
      {currentUser.role === "admin" && (
        <div className="rounded-xl border overflow-hidden">
          <div className="bg-gray-50 border-b px-4 py-3">
            <h3 className="font-medium text-gray-700">Últimos usuarios registrados</h3>
          </div>
          {loadingData ? (
            <p className="text-center text-gray-400 text-sm py-6">Cargando...</p>
          ) : (
            <>
              {/* Tabla desktop */}
              <table className="hidden md:table w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Usuario</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Rol</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.latestUsers.map((user, i) => (
                    <tr key={user.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 font-medium text-gray-700">{user.name}</td>
                      <td className="px-4 py-3 text-gray-500">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("es-MX")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Cards mobile */}
              <div className="md:hidden flex flex-col divide-y">
                {data?.latestUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                      {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full capitalize ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Info card */}
      <div className="rounded-xl border p-5 bg-gray-50">
        <h2 className="font-semibold text-gray-700 mb-2">¿Cómo funciona esto?</h2>
        <p className="text-sm text-gray-500">
          Esta es la misma página{" "}
          <code className="bg-gray-200 px-1 rounded">/dashboard</code> para
          todos los usuarios. El contenido cambia dinámicamente según el rol
          usando <strong>Context API</strong> y datos reales de la base de datos.
        </p>
      </div>
    </div>
  );
}