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
  const [phone, setPhone] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [gender, setGender] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string>("")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showPersonalDetailsForm, setShowPersonalDetailsForm] = useState(false) // State for personal details form visibility
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false) // State for left sidebar visibility
  const [menuOpen, setMenuOpen] = useState(false) // State for unified menu visibility

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
          .select('full_name, phone, city, gender')
          .eq('id', user.id)
          .single()
        if (data) {
          setFullName(data.full_name || '')
          setPhone(data.phone || '')
          setCity(data.city || '')
          setGender(data.gender || '')
        } else if (error) {
          console.error('Error fetching profile:', error)
        }
      }
    }
    fetchProfile()
  }, [user])

  const handleSaveProfile = async () => {
    setSaving(true)
    setSaveError('')
    setSaveSuccess(false)

    if (!user) {
      setSaveError('User not logged in.')
      setSaving(false)
      return
    }

    const updates = {
      id: user.id,
      full_name: fullName,
      phone,
      city,
      gender,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      setSaveError('שגיאה בשמירת פרטים: ' + error.message)
    } else {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000) // Hide success message after 3 seconds
      setShowPersonalDetailsForm(false) // Close the form after successful save
    }
    setSaving(false)
  }

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
            <div className="flex items-center relative">
              <button
                onClick={signOut}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 mr-4"
              >
                התנתק
              </button>
              {/* Unified Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-20">
                  <button
                    onClick={() => {
                      setSidebarOpen(true)
                      setLeftSidebarOpen(false)
                      setMenuOpen(false)
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-right"
                  >
                    פרטים אישיים
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow rounded-lg p-8 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold mb-2 dark:text-white">
                שלום{fullName ? `, ${fullName}` : ""}!
              </h2>
            </div>
          </div>
        </main>
      </div>

      {/* Collapsible left sidebar for editing */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform ease-in-out duration-300 z-50
          ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ערוך פרטים אישיים</h3>
            <button
              onClick={() => setLeftSidebarOpen(false)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>
            {saveError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-300 dark:border-red-700">
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 dark:bg-green-900 dark:text-green-300 dark:border-green-700">
                פרטים נשמרו בהצלחה!
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">שם מלא</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">טלפון</label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">עיר</label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">מגדר</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">בחר</option>
                  <option value="Male">זכר</option>
                  <option value="Female">נקבה</option>
                  <option value="Other">אחר</option>
                </select>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? 'שומר...' : 'שמור שינויים'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible right sidebar for user details */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform ease-in-out duration-300 z-50
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
            <div className="mt-6">
              <button
                onClick={() => {
                  setLeftSidebarOpen(true)
                  setSidebarOpen(false)
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 mb-2"
              >
                ערוך פרטים
              </button>
              <Link href="/profile" className="block text-blue-600 hover:underline dark:text-blue-400 mb-2">
                My Profile
              </Link>
              <Link href="/settings" className="block text-blue-600 hover:underline dark:text-blue-400 mb-2">
                Settings
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