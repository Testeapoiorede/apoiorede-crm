const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const clinic = await prisma.clinic.create({
    data: {
      name: "Clínica Sorriso",
      city: "São Paulo",
      state: "SP",
      whatsapp: "11999999999",
    },
  });

  console.log(clinic);
}

main();