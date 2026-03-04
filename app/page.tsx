import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-gray-800">Login y Registro Demo</h1>
        <p className="text-gray-500 text-lg max-w-md">
          Demo de reutilización de páginas y componentes con Next.js, roles y autenticación real.
        </p>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Registrarse
          </Link>
        </div>
        <div className="text-sm text-gray-400 flex flex-col gap-1">
          <p>Usuarios de prueba:</p>
          <p>admin@demo.com / password123</p>
          <p>user@demo.com / password123</p>
          <p>guest@demo.com / password123</p>
        </div>
      </div>
    </div>
  );
}