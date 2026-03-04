import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    const { name, email, role, password } = await req.json();

    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "El email ya está en uso." },
        { status: 400 }
      );
    }

    const data: any = { name, email, role };
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar usuario." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Usuario eliminado." });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar usuario." },
      { status: 500 }
    );
  }
}