import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString:  process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Admin",
        email: "admin@demo.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Usuario Regular",
        email: "user@demo.com",
        password: hashedPassword,
        role: "user",
      },
      {
        name: "Invitado Demo",
        email: "guest@demo.com",
        password: hashedPassword,
        role: "guest",
      },
    ],
  });

  console.log("✅ Usuarios creados:");
  console.log("  admin@demo.com / password123 (admin)");
  console.log("  user@demo.com / password123 (user)");
  console.log("  guest@demo.com / password123 (guest)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });