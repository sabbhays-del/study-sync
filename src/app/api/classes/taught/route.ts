import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session as any).user.role !== 'teacher') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const classes = await prisma.class.findMany({
    where: {
      teacherId: (session as any).user.id,
    },
    include: {
      students: {
        include: {
          student: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  return NextResponse.json(classes)
}