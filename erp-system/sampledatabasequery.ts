import { prisma } from "./prisma/lib/prisma";

async function main() {
  const tenant = await prisma.tenant.create({
    data: {
      business_name: "Sample Org",
      email: "sample@prisma.io",
      updated_at: new Date(),
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io",
      password: "password123",
      tenant_id: tenant.id,
      updated_at: new Date(),
    },
  });

  console.log("Created user:", user);

  const allUsers = await prisma.user.findMany();
  console.log("All users:", JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });