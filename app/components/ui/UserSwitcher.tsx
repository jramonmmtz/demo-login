"use client";

import { signOut } from "next-auth/react";

export default function UserSwitcher() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm border rounded-md px-3 py-1 text-red-500 border-red-300 hover:bg-red-50 transition-colors"
    >
      Cerrar sesión
    </button>
  );
}