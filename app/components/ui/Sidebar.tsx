"use client";

import { useUser } from "@/app/context/UserContext";
import Link from "next/link";

const menuItems = {
  admin: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Usuarios", href: "/dashboard/usuarios" },
    { label: "Configuración", href: "/dashboard/config" },
    { label: "Reportes", href: "/dashboard/reportes" },
  ],
  user: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Mi Perfil", href: "/dashboard/perfil" },
    { label: "Mis Reportes", href: "/dashboard/reportes" },
  ],
  guest: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Ver Demo", href: "/dashboard/demo" },
  ],
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { currentUser, isLoading } = useUser();

  if (isLoading || !currentUser) {
    return <aside className="hidden md:block w-56 h-full bg-gray-50 border-r" />;
  }

  const items = menuItems[currentUser.role];

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] w-56 bg-gray-50 border-r
          flex flex-col py-6 px-4 gap-1 transition-transform duration-200
          md:static md:translate-x-0 md:z-auto md:h-full
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="text-sm px-3 py-2 rounded-md hover:bg-gray-200 transition-colors text-gray-700"
          >
            {item.label}
          </Link>
        ))}
      </aside>
    </>
  );
}