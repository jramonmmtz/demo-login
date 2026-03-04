import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { name, password } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es requerido." },
        { status: 400 }
      );
    }

    const data: any = { name };
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data,
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar perfil." },
      { status: 500 }
    );
  }
}