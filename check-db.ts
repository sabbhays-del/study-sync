import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
  const users = await prisma.user.findMany()
  console.log('Users in database:')
  users.forEach(user => {
    console.log(`- ${user.email}: ${user.password} (${user.role})`)
  })
  await prisma.$disconnect()
}

checkUsers().catch(console.error)