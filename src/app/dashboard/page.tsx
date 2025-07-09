'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [fullName, setFullName] = useState<string>("")
  const [sidebarOpen, setSidebarOpen] = useState(false) // State for sidebar visibility

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Fetch user's full name from Supabase profile
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        if (data && data.full_name) {
          setFullName(data.full_name)
        } else {
          setFullName('')
        }
      }
    }
    fetchProfile()
  }, [user])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">טוען...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <div className="flex items-center">
              <button
                onClick={signOut}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 mr-4"
              >
                התנתק
              </button>
              {/* Sidebar toggle button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow rounded-lg p-8 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold mb-2 dark:text-white">
                שלום{fullName ? `, ${fullName}` : ""}!
              </h2>
              <p className="text-gray-700 mb-6 dark:text-gray-300">אימייל: {user.email}</p>
              <div className="space-x-4">
                <Link href="/profile" className="text-blue-600 hover:underline dark:text-blue-400">
                  My Profile
                </Link>
                <Link href="/settings" className="text-blue-600 hover:underline dark:text-blue-400">
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Collapsible right sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform ease-in-out duration-300
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">פרטי משתמש</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            <p className="mb-2"><strong>שם מלא:</strong> {fullName || 'לא הוזן'}</p>
            <p className="mb-2"><strong>אימייל:</strong> {user.email}</p>
            {/* Add more user details here as needed */}
            <div className="mt-6">
              <Link href="/profile" className="block text-blue-600 hover:underline dark:text-blue-400 mb-2">
                ערוך פרופיל
              </Link>
              <button
                onClick={signOut}
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              >
                התנתק
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}