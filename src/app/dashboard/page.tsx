'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    if ((session as any).user.role === 'student') {
      router.push('/dashboard/student')
    } else if ((session as any).user.role === 'teacher') {
      router.push('/dashboard/teacher')
    }
  }, [session, status, router])

  return <div>Redirecting...</div>
}