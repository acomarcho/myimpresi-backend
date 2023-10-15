import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  /**
   * Seed categories
   */
  await prisma.category.upsert({
    where: { name: "Jam" },
    update: {},
    create: {
      name: "Jam",
    },
  });
  await prisma.category.upsert({
    where: { name: "Payung" },
    update: {},
    create: {
      name: "Payung",
    },
  });
  await prisma.category.upsert({
    where: { name: "Drinkware" },
    update: {},
    create: {
      name: "Drinkware",
    },
  });
  await prisma.category.upsert({
    where: { name: "Pakaian" },
    update: {},
    create: {
      name: "Pakaian",
    },
  });
  await prisma.category.upsert({
    where: { name: "Stationary" },
    update: {},
    create: {
      name: "Stationary",
    },
  });
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
