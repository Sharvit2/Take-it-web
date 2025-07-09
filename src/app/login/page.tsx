'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showEmailLoginForm, setShowEmailLoginForm] = useState(false) // New state for email login form visibility
  
  const { user, loading: authLoading, signIn, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError('שגיאה בהתחברות: ' + error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const handleGoogleAuth = async () => {
    try {
      setLoading(true)
      setError('')
      await signInWithGoogle()
      // No need to redirect here as the OAuth flow will handle redirection
    } catch {
      setError('שגיאה בהתחברות עם גוגל')
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4" style={{ backgroundColor: '#004d4d' }}> {/* Deep dark turquoise background */}
      <div className="max-w-4xl w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg bg-opacity-90">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">🟣 TAKE IT – פשוט תיקח את זה.</h1>
          <p className="text-xl text-gray-300">יש מי שצריך. יש מי שיכול. והמערכת מחברת ביניהם ברגע.</p>
        </div>

        {/* Core Concept - Problem & Solution */}
        <div className="text-center mt-8">
          <p className="text-lg mb-4 text-gray-200">
            החיים עמוסים, והזמן קצר. כולנו צריכים עזרה לפעמים, ולפעמים יש לנו זמן פנוי לעזור לאחרים. אבל איך מוצאים את האנשים הנכונים בזמן הנכון? ואיך מוצאים עבודה זמינה וקלה שמתאימה ללו"ז שלך?
          </p>
          <p className="text-lg mb-4 text-gray-200">
            נשמע מוכר? מישהו מחפש אינסטלטור דחוף? צריכים ניקיון לפני שבת? מישהי צריכה צבע לדירה החדשה? מישהו מחפש בייביסיטר לכלב לשעה? חבר צריך עזרה להוריד ספה לרכב?
          </p>
          <p className="text-lg mb-4 text-gray-200">
            הם פותחים קריאה, כותבים בדיוק מה צריך, שמים תג מחיר – וזה יוצא לעולם. ואז? אתה רואה את זה. אתה בודק את הפרטים. נראה לך משתלם? פשוט תיקח את זה. תבצע את המשימה – ותקבל תשלום. בלי תיאומים, בלי המתנות, בלי כאב ראש.
          </p>
        </div>

        {/* Flexibility Feature */}
        <div className="text-center mt-8">
          <p className="text-xl font-bold text-green-400">
            🟢 וזה הקטע היפה – אתה יכול להיות גם זה שצריך עזרה, וגם זה שנותן אותה. רוצה לפתוח קריאה? תפתח. רוצה לבצע ולרוויח? תיקח. אפשר גם וגם, מתי שמתאים לך.
          </p>
        </div>

        {/* How It Works - Flow */}
        <div className="text-center mt-8">
          <h3 className="text-2xl font-bold text-white mb-4">💬 איך זה עובד בפועל?</h3>
          <p className="text-lg text-gray-200">
            הלקוח פותח פנייה – כותב מה הוא צריך, מתי, ואיפה.
          </p>
          <p className="text-lg text-gray-200">
            בוחר מחיר – כמה הוא מוכן לשלם על השירות.
          </p>
          <p className="text-lg text-gray-200">
            נותני שירות רואים את הבקשה בזמן אמת.
          </p>
          <p className="text-lg text-gray-200">
            הראשון שתופס – זה שלו.
          </p>
          <p className="text-lg text-gray-200">
            מבצע → מאשר → מקבל תשלום.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <h2 className="text-3xl font-extrabold text-white">
            כל קריאה היא הזדמנות. כל משימה היא כסף. פשוט תיקח את זה.
          </h2>
        </div>

        {/* Authentication Buttons */}
        <div className="mt-8 space-y-4">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" width="24" height="24">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            התחבר עם גוגל
          </button>
          
          <button
            type="button"
            onClick={() => setShowEmailLoginForm(!showEmailLoginForm)}
            className="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-md shadow-sm text-base font-medium text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {showEmailLoginForm ? 'סגור התחברות' : 'התחבר עם אימייל וסיסמה'}
          </button>

          {showEmailLoginForm && (
            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  אימייל
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  סיסמה
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'מתחבר...' : 'התחבר'}
                </button>
              </div>
            </form>
          )}

          <div className="text-center">
            <Link href="/signup" className="text-blue-400 hover:text-blue-300">
              אין לך חשבון? הרשם כאן
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}