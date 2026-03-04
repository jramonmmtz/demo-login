"use client";

import { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  avatar: string;
}

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const currentUser: User | null = session?.user
    ? {
        id: (session.user as any).id,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        role: (session.user as any).role ?? "guest",
        avatar: session.user.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase() ?? "?",
      }
    : null;

  return (
    <UserContext.Provider value={{ currentUser, isLoading: status === "loading" }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}