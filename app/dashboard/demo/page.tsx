"use client";

import { useUser } from "@/app/context/UserContext";

export default function DemoPage() {
  const { currentUser, isLoading } = useUser();

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (currentUser.role !== "guest") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <span className="text-5xl">ℹ️</span>
        <h2 className="text-xl font-bold text-gray-700">Esta página es solo para invitados</h2>
        <p className="text-gray-400 text-sm">
          Cambia a rol Guest para ver esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Vista Demo</h1>
        <p className="text-gray-500 text-sm mt-1">
          Bienvenido a la demo gratuita de MyApp.
        </p>
      </div>

      <div className="rounded-xl border p-6 bg-gray-50 flex flex-col gap-4">
        <h2 className="font-semibold text-gray-700">¿Qué puedes hacer como invitado?</h2>
        <ul className="text-sm text-gray-500 flex flex-col gap-2">
          {[
            "✅ Ver el dashboard general",
            "✅ Explorar la interfaz",
            "❌ Ver reportes",
            "❌ Gestionar usuarios",
            "❌ Acceder a configuración",
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border p-6 bg-blue-50 border-blue-200">
        <h2 className="font-semibold text-blue-700 mb-2">¿Quieres acceso completo?</h2>
        <p className="text-sm text-blue-600">
          Regístrate para obtener una cuenta y acceder a todas las funcionalidades.
        </p>
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Crear cuenta
        </button>
      </div>
    </div>
  );
}