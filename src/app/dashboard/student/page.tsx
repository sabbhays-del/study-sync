'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Class {
  id: string
  name: string
  description: string
  teacher: {
    name: string
  }
}

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const [classes, setClasses] = useState<Class[]>([])
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    if (session.user.role !== 'student') {
      router.push('/dashboard/teacher')
      return
    }
    fetchClasses()
  }, [session, status, router])

  const fetchClasses = async () => {
    const res = await fetch('/api/classes/enrolled')
    if (res.ok) {
      const data = await res.json()
      setClasses(data)
    }
  }

  if (status === 'loading') return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">{cls.name}</h3>
              <p className="text-gray-600 mt-2">{cls.description}</p>
              <p className="text-sm text-gray-500 mt-2">Teacher: {cls.teacher.name}</p>
            </div>
          ))}
        </div>
        {classes.length === 0 && (
          <p className="text-gray-500">You are not enrolled in any classes yet.</p>
        )}
      </div>
    </div>
  )
}