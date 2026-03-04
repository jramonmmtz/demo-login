"use client";

import { useState } from "react";
import { useUser } from "@/app/context/UserContext";
import UserSwitcher from "./UserSwitcher";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { currentUser, isLoading } = useUser();

  const roleColors = {
    admin: "bg-purple-600",
    user: "bg-blue-600",
    guest: "bg-gray-500",
  };

  return (
    <nav className="w-full h-14 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Botón hamburguesa solo en mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-lg">MyApp</span>
      </div>

      <UserSwitcher />

      {!isLoading && currentUser && (
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${roleColors[currentUser.role]}`}
          >
            {currentUser.avatar}
          </div>
          <div className="text-sm hidden md:block">
            <p className="font-medium">{currentUser.name}</p>
            <p className="text-gray-400 text-xs capitalize">{currentUser.role}</p>
          </div>
        </div>
      )}
    </nav>
  );
}