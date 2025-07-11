'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MyOpenedCallsList from './MyOpenedCallsList'; // Import the new component

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('client'); // State for role switch (not used with new toggle)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [showMenu, setShowMenu] = useState(false); // State for the main dropdown menu
  const [showPersonalDetailsModal, setShowPersonalDetailsModal] = useState(false); // State for personal details modal
  const [fullName, setFullName] = useState<string>(''); // State for user's full name
  const [gender, setGender] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'client' | 'provider'>('client'); // State for user's role (client/provider)
  const [updatingRole, setUpdatingRole] = useState(false);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false); // New state for showing the new request form
  const [showMyOpenedCalls, setShowMyOpenedCalls] = useState(false); // New state for showing My Opened Calls list

  // States for the new service request form
  const [requestTitle, setRequestTitle] = useState('');
  const [requestCategory, setRequestCategory] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestImage, setRequestImage] = useState<File | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoadingProfile(true);
        setProfileError(null);
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, gender, city, role') // Fetch role as well
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setProfileError(error.message);
        } else if (data) {
          setFullName(data.full_name || '');
          setGender(data.gender || '');
          setCity(data.city || '');
          setUserRole(data.role || 'client'); // Set initial role from Supabase
        }
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoadingProfile(true);
    setProfileError(null);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        gender: gender,
        city: city,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating profile:', error);
      setProfileError(error.message);
    } else {
      setShowPersonalDetailsModal(false);
      alert('פרטים אישיים עודכנו בהצלחה!');
    }
    setLoadingProfile(false);
  };

  const handleToggleRole = async () => {
    if (!user) return;

    setUpdatingRole(true);
    const newRole = userRole === 'client' ? 'provider' : 'client';

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating role:', error);
    } else {
      setUserRole(newRole);
    }
    setUpdatingRole(false);
  };

  const handleNewRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the request data to Supabase or an API
    console.log({
      requestTitle,
      requestCategory,
      requestDescription,
      requestImage,
    });
    alert('פנייה חדשה נשלחה!'); // Temporary alert for demonstration
    setShowNewRequestForm(false); // Close form after submission (for now)
    // Reset form fields
    setRequestTitle('');
    setRequestCategory('');
    setRequestDescription('');
    setRequestImage(null);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">טוען...</div>
      </div>
    );
  }

  const categories = [
    'אינסטלציה',
    'ניקיון',
    'בייביסיטר',
    'הובלות קטנות',
    'שיעורים פרטיים',
    'יופי וטיפוח',
    'אחר',
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center z-10 sticky top-0 w-full">
          {/* Right side: TAKE IT logo */}
          <div className="text-xl sm:text-2xl font-bold text-teal-600">TAKE IT</div>

          {/* Center: User Name */}
          <div className="flex-grow text-center">
              <span className="text-base sm:text-lg font-semibold text-gray-700 truncate max-w-[150px] sm:max-w-none inline-block">שלום, {fullName || 'אורח'}!</span>
          </div>

          {/* Left side: Menu Button */}
          <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-full transition duration-300 flex items-center"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="mr-2">תפריט</span>
              </button>

              {/* Dropdown Menu */}
              <div className={`dropdown-menu ${showMenu ? 'show' : ''}`}>
                  <Link href="#" onClick={() => setShowMenu(false)}>הגדרות</Link>
                  <Link href="#"
                    onClick={() => {
                      setShowMenu(false);
                      setShowPersonalDetailsModal(true);
                    }}
                  >
                    פרטים אישיים
                  </Link>
                  <Link href="#"
                    onClick={() => {
                      setShowMenu(false);
                      setShowMyOpenedCalls(true);
                      setShowNewRequestForm(false);
                    }}
                  >הקריאות שפתחתי</Link>
                  <Link href="#" onClick={() => setShowMenu(false)}>הקריאות שטיפלתי</Link>
                  <Link href="#" onClick={() => setShowMenu(false)}>צ'אטים</Link>
                  <Link href="#" onClick={() => setShowMenu(false)}>שאלות ותשובות</Link>
              </div>
          </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row p-4 md:p-8 gap-6 mobile-stack-gap">
          {/* Right Sidebar (for RTL) */}
          <aside className="w-full md:w-72 bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handleToggleRole}
                  disabled={updatingRole}
                  className={`font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ${updatingRole ? 'opacity-50 cursor-not-allowed' : ''}
                    ${userRole === 'client'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105'
                      : 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105'
                    }`}
                >
                  {updatingRole ? 'מעדכן...' : (userRole === 'client' ? 'הפוך לנותן שירות' : 'הפוך ללקוח')}
                </button>
                <span className={`text-lg font-semibold px-3 py-1 rounded-full ${userRole === 'client' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                  סטטוס: {userRole === 'client' ? 'לקוח' : 'נותן שירות'}
                </span>
              </div>
              
              {/* Removed conditional buttons for 'פתח קריאת שירות חדשה' and 'צפה בקריאות פתוחות' */}

          </aside>

          {/* Main Content (Calls/Requests) */}
          <main className="flex-1 bg-white rounded-2xl shadow-lg p-6">
              {userRole === 'client' ? (
                showMyOpenedCalls ? (
                  <MyOpenedCallsList />
                ) : showNewRequestForm ? (
                  <div className="relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-inner border border-blue-200">
                    <button
                      onClick={() => setShowNewRequestForm(false)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold p-1 rounded-full hover:bg-gray-200 transition duration-200"
                    >
                      &times;
                    </button>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">פתח פנייה חדשה</h2>
                    
                    <form onSubmit={handleNewRequestSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="requestTitle" className="block text-sm font-medium text-gray-700 mb-1">כותרת:</label>
                        <input
                          type="text"
                          id="requestTitle"
                          value={requestTitle}
                          onChange={(e) => setRequestTitle(e.target.value)}
                          className="mt-1 block w-full px-4 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                          placeholder="הכנס כותרת לפנייה..."
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="requestCategory" className="block text-sm font-medium text-gray-700 mb-1">קטגוריה:</label>
                        <select
                          id="requestCategory"
                          value={requestCategory}
                          onChange={(e) => setRequestCategory(e.target.value)}
                          className="mt-1 block w-full px-4 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                          required
                        >
                          <option value="">בחר קטגוריה</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="requestDescription" className="block text-sm font-medium text-gray-700 mb-1">תיאור:</label>
                        <textarea
                          id="requestDescription"
                          value={requestDescription}
                          onChange={(e) => setRequestDescription(e.target.value)}
                          rows={4}
                          className="mt-1 block w-full px-4 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                          placeholder="פרט את הפנייה..."
                          required
                        ></textarea>
                      </div>

                      <div>
                        <label htmlFor="requestImage" className="block text-sm font-medium text-gray-700 mb-1">תמונה (אופציונלי):</label>
                        <input
                          type="file"
                          id="requestImage"
                          accept="image/*"
                          onChange={(e) => setRequestImage(e.target.files ? e.target.files[0] : null)}
                          className="mt-1 block w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                      >
                        שלח פנייה
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">ברוך הבא ללוח המחוונים של הלקוח!</h2>
                    <p className="text-lg text-gray-600 mb-8 text-center">כאן תוכל לנהל את קריאות השירות שלך.</p>
                    <button
                      onClick={() => setShowNewRequestForm(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
                    >
                      פתח פנייה חדשה
                    </button>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">ברוך הבא ללוח המחוונים של נותן השירות!</h2>
                  <p className="text-lg text-gray-600 mb-8 text-center">כאן תוכל לצפות ולנהל קריאות שירות באזורך.</p>
                  {/* Add content specific to service providers here */}
                </div>
              )}
          </main>
      </div>

      {/* Personal Details Modal */}
      {showPersonalDetailsModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto relative">
            <button
              onClick={() => setShowPersonalDetailsModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">פרטים אישיים</h2>
            
            {loadingProfile && <p className="text-center text-blue-600">טוען פרטי פרופיל...</p>}
            {profileError && <p className="text-center text-red-600">שגיאה: {profileError}</p>}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">שם מלא</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">מין</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                  required
                >
                  <option value="">בחר מין</option>
                  <option value="Male">זכר</option>
                  <option value="Female">נקבה</option>
                  <option value="Other">אחר</option>
                </select>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">עיר</label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loadingProfile}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-300 disabled:opacity-50"
              >
                {loadingProfile ? 'שומר...' : 'שמור שינויים'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}