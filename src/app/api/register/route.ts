import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json()
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (role !== 'student' && role !== 'teacher') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
        role
      }
    })
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}