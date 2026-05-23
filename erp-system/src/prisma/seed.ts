import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const tenant = await prisma.tenant.create({
    data: {
      business_name: "Demo ERP",
      email: "admin@erp.com",
    },
  });

  await prisma.user.create({
    data: {
      tenant_id: tenant.id,
      name: "Admin",
      email: "admin@erp.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });