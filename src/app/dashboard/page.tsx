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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={signOut}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              התנתק
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-2">
            שלום{fullName ? `, ${fullName}` : ""}!
          </h2>
          <p className="text-gray-700 mb-6">אימייל: {user.email}</p>
          <div className="space-x-4">
            <Link href="/profile" className="text-blue-600 hover:underline">
              My Profile
            </Link>
            <Link href="/settings" className="text-blue-600 hover:underline">
              Settings
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}