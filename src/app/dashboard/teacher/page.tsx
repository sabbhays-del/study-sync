'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Class {
  id: string
  name: string
  description: string
  students: { student: { name: string; email: string } }[]
}

export default function TeacherDashboard() {
  const { data: session, status } = useSession()
  const [classes, setClasses] = useState<Class[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newClass, setNewClass] = useState({ name: '', description: '' })
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    if (session.user.role !== 'teacher') {
      router.push('/dashboard/student')
      return
    }
    fetchClasses()
  }, [session, status, router])

  const fetchClasses = async () => {
    const res = await fetch('/api/classes/taught')
    if (res.ok) {
      const data = await res.json()
      setClasses(data)
    }
  }

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClass),
    })
    if (res.ok) {
      setNewClass({ name: '', description: '' })
      setShowCreateForm(false)
      fetchClasses()
    }
  }

  if (status === 'loading') return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {showCreateForm ? 'Cancel' : 'Create New Class'}
        </button>
        {showCreateForm && (
          <form onSubmit={handleCreateClass} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Class Name</label>
              <input
                type="text"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                value={newClass.description}
                onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Create Class
            </button>
          </form>
        )}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Classes</h2>
        <div className="space-y-6">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">{cls.name}</h3>
              <p className="text-gray-600 mt-2">{cls.description}</p>
              <h4 className="text-lg font-medium text-gray-800 mt-4">Enrolled Students:</h4>
              <ul className="list-disc list-inside mt-2">
                {cls.students.map((enrollment, index) => (
                  <li key={index} className="text-gray-700">
                    {enrollment.student.name} ({enrollment.student.email})
                  </li>
                ))}
              </ul>
              {cls.students.length === 0 && <p className="text-gray-500 mt-2">No students enrolled yet.</p>}
            </div>
          ))}
        </div>
        {classes.length === 0 && (
          <p className="text-gray-500">You haven't created any classes yet.</p>
        )}
      </div>
    </div>
  )
}