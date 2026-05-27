const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Daniela',
      email: 'admin@apoio.com',
      password: '123456',
      role: 'ADMIN'
    }
  })

  console.log('Usuário criado:')
  console.log(user)
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })