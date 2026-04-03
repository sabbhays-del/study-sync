import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create teacher
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@test.com' },
    update: { password: 'password123' },
    create: {
      email: 'teacher@test.com',
      name: 'Test Teacher',
      password: 'password123',
      role: 'teacher',
    },
  })

  // Create student
  const student = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: { password: 'password123' },
    create: {
      email: 'student@test.com',
      name: 'Test Student',
      password: 'password123',
      role: 'student',
    },
  })

  // Create a class
  const existingClass = await prisma.class.findFirst({
    where: { name: 'Math 101', teacherId: teacher.id },
  })

  let cls
  if (!existingClass) {
    cls = await prisma.class.create({
      data: {
        name: 'Math 101',
        description: 'Introduction to Mathematics',
        teacherId: teacher.id,
      },
    })
  } else {
    cls = existingClass
  }

  // Enroll student
  const existingEnrollment = await prisma.classStudent.findFirst({
    where: { classId: cls.id, studentId: student.id },
  })

  if (!existingEnrollment) {
    await prisma.classStudent.create({
      data: {
        classId: cls.id,
        studentId: student.id,
      },
    })
  }

  console.log('Seeded test data')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })