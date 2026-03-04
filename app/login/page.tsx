"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Email o contraseña incorrectos.");
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl border p-8 w-full max-w-md flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">MyApp</h1>
                    <p className="text-gray-500 text-sm mt-1">Inicia sesión para continuar</p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@demo.com"
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password123"
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </button>
                </div>

                <div className="border-t pt-4">
                    <p className="text-xs text-gray-400 font-medium mb-2">Usuarios de prueba:</p>
                    <div className="flex flex-col gap-1">
                        {[
                            { email: "admin@demo.com", role: "Admin" },
                            { email: "ramon@demo.com", role: "User" },
                            { email: "guest@demo.com", role: "Guest" },
                        ].map((u) => (
                            <button
                                key={u.email}
                                onClick={() => { setEmail(u.email); setPassword("password123"); }}
                                className="text-left text-xs text-blue-500 hover:underline"
                            >
                                {u.role} → {u.email}
                            </button>
                        ))}
                        <div className="border-t pt-4 text-center">
                            <p className="text-sm text-gray-500">
                                ¿No tienes cuenta?{" "}
                                <Link href="/register" className="text-blue-600 hover:underline">
                                    Regístrate
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}