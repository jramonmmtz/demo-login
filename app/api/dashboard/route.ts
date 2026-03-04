import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalUsers, totalAdmins, totalRegularUsers, totalGuests, latestUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "admin" } }),
        prisma.user.count({ where: { role: "user" } }),
        prisma.user.count({ where: { role: "guest" } }),
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, email: true, role: true, createdAt: true },
        }),
      ]);

    return NextResponse.json({
      totalUsers,
      totalAdmins,
      totalRegularUsers,
      totalGuests,
      latestUsers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener datos del dashboard." },
      { status: 500 }
    );
  }
}