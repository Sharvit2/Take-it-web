'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('client'); // State for role switch
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [showPersonalDetailsMenu, setShowPersonalDetailsMenu] = useState(false); // New state for personal details menu

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">טוען...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center z-10 sticky top-0 w-full">
          <div className="text-xl sm:text-2xl font-bold text-teal-600">TAKE IT</div>
          <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
              {/* New Personal Details Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowPersonalDetailsMenu(!showPersonalDetailsMenu)}
                  className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md py-1.5 px-3 transition duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  פרטים אישיים
                </button>
                {showPersonalDetailsMenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <Link href="#"
                      onClick={() => setShowPersonalDetailsMenu(false)} // Close menu on click
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-200"
                    >
                      פרופיל שלי
                    </Link>
                    {/* Add more menu items here if needed */}
                  </div>
                )}
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-700 truncate max-w-[120px] sm:max-w-none">שלום, {user?.email || 'אורח'}!</span>
              <button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-full transition duration-300"
              >
                  התנתק
              </button>
          </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row p-4 md:p-8 gap-6 mobile-stack-gap">
          {/* Right Sidebar (for RTL) */}
          <aside className="w-full md:w-72 bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 border-b-2 border-teal-400 pb-2">
                  אפשרויות
              </h2>
              <nav className="space-y-4">
                  <Link href="#" className="flex items-center py-3 px-4 rounded-xl text-base sm:text-lg font-medium text-gray-700 hover:bg-gray-100 transition duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 ml-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      פרטים אישיים
                  </Link>
                  <div className="py-3 px-4 rounded-xl text-base sm:text-lg font-medium text-gray-700 bg-teal-50 border border-teal-200">
                      <label htmlFor="role-switch" className="block mb-2">סטטוס:</label>
                      <select
                        id="role-switch"
                        className="w-full p-2 rounded-lg border border-gray-300 bg-white text-sm sm:text-base focus:ring-blue-500 focus:border-blue-500"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                          <option value="client">לקוח</option>
                          <option value="provider">נותן שירות</option>
                      </select>
                  </div>
                  <Link href="#" className="flex items-center py-3 px-4 rounded-xl text-base sm:text-lg font-medium text-gray-700 hover:bg-gray-100 transition duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 ml-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      קריאות באזור שלי
                  </Link>
                  <Link href="#" className="flex items-center py-3 px-4 rounded-xl text-base sm:text-lg font-medium text-gray-700 hover:bg-gray-100 transition duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 ml-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      שינוי אזור
                  </Link>
              </nav>

              <div className="mt-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                      קטגוריות
                  </h3>
                  <ul className="space-y-2">
                      <li><Link href="#" className="block py-2 px-3 rounded-lg text-sm sm:text-base text-gray-600 hover:bg-gray-100 transition duration-200">אינסטלציה</Link></li>
                      <li><Link href="#" className="block py-2 px-3 rounded-lg text-sm sm:text-base text-gray-600 hover:bg-gray-100 transition duration-200">ניקיון</Link></li>
                      <li><Link href="#" className="block py-2 px-3 rounded-lg text-sm sm:text-base text-gray-600 hover:bg-gray-100 transition duration-200">בייביסיטר</Link></li>
                      <li><Link href="#" className="block py-2 px-3 rounded-lg text-sm sm:text-base text-gray-600 hover:bg-gray-100 transition duration-200">הובלות קטנות</Link></li>
                      <li><Link href="#" className="block py-2 px-3 rounded-lg text-sm sm:text-base text-gray-600 hover:bg-gray-100 transition duration-200">שיעורים פרטיים</Link></li>
                      <li><Link href="#" className="block py-2 px-3 rounded-lg text-sm sm:text-base text-gray-600 hover:bg-gray-100 transition duration-200">יופי וטיפוח</Link></li>
                      <li><Link href="#" className="block py-2 px-3 rounded-lg text-sm sm:text-base text-gray-600 hover:bg-gray-100 transition duration-200">אחר</Link></li>
                  </ul>
              </div>
          </aside>

          {/* Main Content (Calls/Requests) */}
          <main className="flex-1 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 border-b-2 border-teal-400 pb-2">
                  קריאות פתוחות באזורך
              </h2>

              {/* Filter/Sort Options */}
              <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <input
                    type="text"
                    placeholder="חפש קריאה..."
                    className="p-2 sm:p-3 border border-gray-300 rounded-xl w-full sm:w-auto flex-grow text-sm sm:text-base focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="p-2 sm:p-3 border border-gray-300 rounded-xl bg-white w-full sm:w-auto text-sm sm:text-base focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                      <option value="">סנן לפי קטגוריה</option>
                      <option value="plumbing">אינסטלציה</option>
                      <option value="cleaning">ניקיון</option>
                      {/* More categories */}
                  </select>
                  <select
                    className="p-2 sm:p-3 border border-gray-300 rounded-xl bg-white w-full sm:w-auto text-sm sm:text-base focus:ring-blue-500 focus:border-blue-500"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                      <option value="">מיין לפי</option>
                      <option value="newest">החדש ביותר</option>
                      <option value="price-high">מחיר (גבוה לנמוך)</option>
                      <option value="price-low">מחיר (נמוך לגבוה)</option>
                  </select>
              </div>

              {/* Calls/Requests List */}
              <div className="space-y-6">
                  {/* Example Call Card 1 */}
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
                      <div className="flex justify-between items-start mb-3 flex-wrap">
                          <div className="flex-grow">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">תיקון נזילה בכיור</h3>
                              <p className="text-gray-600 text-xs sm:text-sm">פורסם לפני 10 דקות</p>
                          </div>
                          <span className="text-xl sm:text-2xl font-bold text-green-600 mt-2 sm:mt-0 mr-auto sm:mr-0">₪150</span>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base mb-4">
                          דרוש אינסטלטור לתיקון נזילה קלה בכיור המטבח. עדיפות לזמינות מיידית.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-gray-500 gap-2 sm:gap-0">
                          <span className="bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">אינסטלציה</span>
                          <span>אזור: תל אביב - מרכז</span>
                      </div>
                      <div className="mt-4 text-left">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 w-full sm:w-auto">
                              קח את המשימה
                          </button>
                      </div>
                  </div>

                  {/* Example Call Card 2 */}
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
                      <div className="flex justify-between items-start mb-3 flex-wrap">
                          <div className="flex-grow">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">ניקיון דירה קטנה לפני מעבר</h3>
                              <p className="text-gray-600 text-xs sm:text-sm">פורסם לפני שעה</p>
                          </div>
                          <span className="text-xl sm:text-2xl font-bold text-green-600 mt-2 sm:mt-0 mr-auto sm:mr-0">₪300</span>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base mb-4">
                          ניקיון יסודי לדירת 2 חדרים (50 מ"ר) כולל חלונות ומטבח. נדרש ליום ראשון הקרוב.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-gray-500 gap-2 sm:gap-0">
                          <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">ניקיון</span>
                          <span>אזור: ירושלים - רחביה</span>
                      </div>
                      <div className="mt-4 text-left">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 w-full sm:w-auto">
                              קח את המשימה
                          </button>
                      </div>
                  </div>

                  {/* Example Call Card 3 */}
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
                      <div className="flex justify-between items-start mb-3 flex-wrap">
                          <div className="flex-grow">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">בייביסיטר לילד בן 4</h3>
                              <p className="text-gray-600 text-xs sm:text-sm">פורסם לפני 3 שעות</p>
                          </div>
                          <span className="text-xl sm:text-2xl font-bold text-green-600 mt-2 sm:mt-0 mr-auto sm:mr-0">₪80</span>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base mb-4">
                          מחפשת בייביסיטר אחראית ליום חמישי בערב (18:00-21:00).
                      </p>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-gray-500 gap-2 sm:gap-0">
                          <span className="bg-pink-100 text-pink-800 px-2.5 py-0.5 rounded-full">בייביסיטר</span>
                          <span>אזור: חיפה - כרמל</span>
                      </div>
                      <div className="mt-4 text-left">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 w-full sm:w-auto">
                              קח את המשימה
                          </button>
                      </div>
                  </div>

                  {/* Add more call cards as needed */}
              </div>
          </main>
      </div>
    </div>
  );
}