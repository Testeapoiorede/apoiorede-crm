const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const request = await prisma.request.create({
    data: {
      patientName: "Maria Silva",
      procedure: "Avaliação odontológica",
      status: "PENDENTE",
    },
  });

  console.log(request);
}

main();