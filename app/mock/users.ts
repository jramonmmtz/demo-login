export type Role = "admin" | "user" | "guest";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Admin Juan",
    email: "admin@demo.com",
    role: "admin",
    avatar: "AJ",
  },
  {
    id: 2,
    name: "Ramon Martinez",
    email: "ramon@demo.com",
    role: "user",
    avatar: "RM",
  },
  {
    id: 3,
    name: "Invitado",
    email: "guest@demo.com",
    role: "guest",
    avatar: "GU",
  },
];