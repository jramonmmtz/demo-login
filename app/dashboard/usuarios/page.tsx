"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import Modal from "@/app/components/ui/Modal";
import UserForm from "@/app/components/ui/UserForm";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  user: "bg-blue-100 text-blue-700",
  guest: "bg-gray-100 text-gray-600",
};

export default function UsuariosPage() {
  const { currentUser, isLoading } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("todos");

  async function fetchUsers() {
    setLoadingUsers(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
    setLoadingUsers(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleCreate(form: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setShowCreate(false);
    fetchUsers();
  }

  async function handleEdit(form: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    if (!editUser) return;
    const res = await fetch(`/api/users/${editUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setEditUser(null);
    fetchUsers();
  }

  async function handleDelete() {
    if (!deleteUser) return;
    setDeleting(true);
    await fetch(`/api/users/${deleteUser.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteUser(null);
    fetchUsers();
  }

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (currentUser.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <span className="text-5xl">🔒</span>
        <h2 className="text-xl font-bold text-gray-700">Acceso restringido</h2>
        <p className="text-gray-400 text-sm">
          Solo los administradores pueden ver esta página.
        </p>
      </div>
    );
  }

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "todos" || user.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
            <p className="text-gray-500 text-sm mt-1">
              Gestiona todos los usuarios del sistema.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo
          </button>
        </div>

        {/* Búsqueda y filtros */}
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-40"
          >
            <option value="todos">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>
        </div>

        {/* Contador de resultados */}
        <p className="text-xs text-gray-400">
          {filteredUsers.length} de {users.length} usuarios
        </p>
      </div>

      {/* Tabla */}
      <div className="hidden md:block rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Usuario</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Rol</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Creado</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Cargando usuarios...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, i) => (
                <tr key={user.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-700">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("es-MX")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditUser(user)}
                        className="text-xs px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteUser(user)}
                        className="text-xs px-2 py-1 rounded-md border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}

      <div className="md:hidden flex flex-col gap-3">
        {loadingUsers ? (
          <p className="text-center text-gray-400 text-sm py-8">Cargando usuarios...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">
            No se encontraron usuarios.
          </p>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="rounded-xl border p-4 bg-white flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                  {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full capitalize ${roleColors[user.role]}`}>
                  {user.role}
                </span>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditUser(user)}
                  className="text-xs px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => setDeleteUser(user)}
                  className="text-xs px-3 py-1.5 rounded-md border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Crear */}
      {showCreate && (
        <Modal title="Nuevo usuario" onClose={() => setShowCreate(false)}>
          <UserForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
          />
        </Modal>
      )}

      {/* Modal Editar */}
      {editUser && (
        <Modal title="Editar usuario" onClose={() => setEditUser(null)}>
          <UserForm
            initial={editUser}
            onSubmit={handleEdit}
            onCancel={() => setEditUser(null)}
            isEdit
          />
        </Modal>
      )}

      {/* Modal Eliminar */}
      {deleteUser && (
        <Modal title="Eliminar usuario" onClose={() => setDeleteUser(null)}>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              ¿Estás seguro que deseas eliminar a{" "}
              <span className="font-semibold">{deleteUser.name}</span>? Esta
              acción no se puede deshacer.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteUser(null)}
                className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}