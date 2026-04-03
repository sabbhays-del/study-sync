import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session as any).user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const enrollments = await prisma.classStudent.findMany({
    where: {
      studentId: (session as any).user.id,
    },
    include: {
      class: {
        include: {
          teacher: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  const classes = enrollments.map((enrollment) => enrollment.class)

  return NextResponse.json(classes)
}