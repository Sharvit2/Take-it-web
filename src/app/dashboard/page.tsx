'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MyOpenedCallsList from './MyOpenedCallsList'; // Import the new component
import OpenCallsForProviders from './OpenCallsForProviders'; // Import the new component
import CallsIHandledList from './CallsIHandledList'; // Import the new component

interface ServiceCall {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'closed';
  description: string;
  created_at: string;
  category: string;
  image_url: string | null;
  price: number; // Price is now mandatory
  location: string | null; // Changed from city to location
}

type ActiveView = 'callsInMyArea' | 'myOpenedCalls' | 'callsIHandled' | 'newRequestForm';

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [showMenu, setShowMenu] = useState(false); // State for the main dropdown menu
  const [showPersonalDetailsModal, setShowPersonalDetailsModal] = useState(false); // State for personal details modal
  const [fullName, setFullName] = useState<string>(''); // State for user's full name
  const [gender, setGender] = useState<string>('');
  const [city, setCity] = useState<string>(''); // User's city for location filtering
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('callsInMyArea'); // Default view

  // States for the new service request form
  const [requestTitle, setRequestTitle] = useState('');
  const [requestCategory, setRequestCategory] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestImage, setRequestImage] = useState<File | null>(null);
  const [requestPrice, setRequestPrice] = useState<number | ''>('');
  const [requestCity, setRequestCity] = useState('');
  const [requestNeighborhood, setRequestNeighborhood] = useState('');
  const [editingRequest, setEditingRequest] = useState<ServiceCall | null>(null);

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
          .select('full_name, gender, city') // Only fetch these fields, role is no longer relevant here
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setProfileError(error.message);
        } else if (data) {
          setFullName(data.full_name || '');
          setGender(data.gender || '');
          setCity(data.city || '');
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
      setProfileError('פרטים אישיים עודכנו בהצלחה!');
      setTimeout(() => setProfileError(null), 3000);
    }
    setLoadingProfile(false);
  };

  const handleNewRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setProfileError('User not logged in.');
      setTimeout(() => setProfileError(null), 3000);
      return;
    }

    if (!requestTitle || !requestCategory || !requestDescription || !requestPrice || !requestCity) {
      setProfileError('Please fill in all required fields.');
      setTimeout(() => setProfileError(null), 3000);
      return;
    }

    setLoadingProfile(true);
    setProfileError(null);

    let imageUrl = null;
    if (requestImage) {
      const fileExtension = requestImage.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExtension}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('requests-images')
        .upload(filePath, requestImage);

      if (uploadError) {
        console.error('Error uploading image:', uploadError.message);
        setProfileError('Failed to upload image.');
        setLoadingProfile(false);
        return;
      }
      imageUrl = uploadData.path;
    }

    let error;
    if (editingRequest) {
      // Update existing request
      const { error: updateError } = await supabase
        .from('requests')
        .update({
          title: requestTitle,
          category: requestCategory,
          description: requestDescription,
          image_url: imageUrl,
          price: requestPrice,
          location: requestNeighborhood ? `${requestCity}, ${requestNeighborhood}` : requestCity,
        })
        .eq('id', editingRequest.id);
      error = updateError;
    } else {
      // Insert new request
      const { error: insertError } = await supabase
        .from('requests')
        .insert({
          seeker_id: user.id,
          title: requestTitle,
          category: requestCategory,
          description: requestDescription,
          image_url: imageUrl,
          status: 'open',
          created_at: new Date().toISOString(),
          price: requestPrice,
          location: requestNeighborhood ? `${requestCity}, ${requestNeighborhood}` : requestCity,
        });
      error = insertError;
    }

    if (error) {
      console.error('Error submitting request:', error.message);
      setProfileError('Failed to submit request.');
    } else {
      setProfileError(editingRequest ? 'פנייה עודכנה בהצלחה!' : 'פנייה חדשה נשלחה בהצלחה!');
      setTimeout(() => setProfileError(null), 3000);
      setActiveView('myOpenedCalls'); // Go back to the opened calls list after submission
      setEditingRequest(null);
      setRequestTitle('');
      setRequestCategory('');
      setRequestDescription('');
      setRequestImage(null);
      setRequestPrice('');
      setRequestCity('');
      setRequestNeighborhood('');
    }
    setLoadingProfile(false);
  };

  const handleEditRequest = (call: ServiceCall) => {
    setEditingRequest(call);
    setRequestTitle(call.title);
    setRequestCategory(call.category);
    setRequestDescription(call.description);
    setRequestPrice(call.price || '');

    if (call.location) {
      const parts = call.location.split(', ');
      setRequestCity(parts[0] || '');
      setRequestNeighborhood(parts[1] || '');
    } else {
      setRequestCity('');
      setRequestNeighborhood('');
    }

    setRequestImage(null);
    setActiveView('newRequestForm'); // Show the form
  };

  const handleCancelEdit = () => {
    setEditingRequest(null);
    setActiveView('myOpenedCalls'); // Go back to the opened calls list
    setRequestTitle('');
    setRequestCategory('');
    setRequestDescription('');
    setRequestImage(null);
    setRequestPrice('');
    setRequestCity('');
    setRequestNeighborhood('');
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
                  {/* Removed old links: הקריאות שפתחתי and הקריאות שטיפלתי */}
                  <Link href="#" onClick={() => setShowMenu(false)}>צ'אטים</Link>
                  <Link href="#" onClick={() => setShowMenu(false)}>שאלות ותשובות</Link>
              </div>
          </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row p-4 md:p-8 gap-6 mobile-stack-gap">
          {/* Right Sidebar (for RTL) - New Navigation Buttons */}
          <aside className="w-full md:w-72 bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => setActiveView('callsInMyArea')}
                  className={`w-full font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105
                    ${activeView === 'callsInMyArea' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-teal-100'}`}
                >
                  קריאות באזורי
                </button>
                <button
                  onClick={() => setActiveView('myOpenedCalls')}
                  className={`w-full font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105
                    ${activeView === 'myOpenedCalls' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-100'}`}
                >
                  קריאות שלי
                </button>
                <button
                  onClick={() => setActiveView('callsIHandled')}
                  className={`w-full font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105
                    ${activeView === 'callsIHandled' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-purple-100'}`}
                >
                  קריאות שטיפלתי
                </button>
                <button
                  onClick={() => {
                    setActiveView('newRequestForm');
                    setEditingRequest(null); // Ensure new request form is clean
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                >
                  פתח פנייה חדשה
                </button>
              </div>

              {profileError && (
                <div className={`text-center mt-4 p-2 rounded-md text-sm ${profileError.includes('שגיאה') || profileError.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {profileError}
                </div>
              )}
              
          </aside>

          {/* Main Content (Calls/Requests) */}
          <main className="flex-1 bg-white rounded-2xl shadow-lg p-6">
              {activeView === 'callsInMyArea' && (
                <OpenCallsForProviders providerCity={city} currentUserId={user?.id} />
              )}
              {activeView === 'myOpenedCalls' && (
                <MyOpenedCallsList onEdit={handleEditRequest} />
              )}
              {activeView === 'callsIHandled' && (
                <CallsIHandledList currentUserId={user?.id} />
              )}
              {activeView === 'newRequestForm' && (
                  <div className="relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-inner border border-blue-200">
                    <button
                      onClick={() => editingRequest ? handleCancelEdit() : setActiveView('myOpenedCalls')}
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold p-1 rounded-full hover:bg-gray-200 transition duration-200"
                    >
                      &times;
                    </button>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">{editingRequest ? 'ערוך פנייה' : 'פתח פנייה חדשה'}</h2>
                    
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
                        <label htmlFor="requestPrice" className="block text-sm font-medium text-gray-700 mb-1">מחיר מוצע:</label>
                        <input
                          type="number"
                          id="requestPrice"
                          value={requestPrice}
                          onChange={(e) => setRequestPrice(parseFloat(e.target.value) || '')}
                          className="mt-1 block w-full px-4 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                          placeholder="הכנס מחיר מוצע"
                          step="0.01" // Allow decimal values
                          required // Price is mandatory
                        />
                      </div>

                      <div>
                        <label htmlFor="requestCity" className="block text-sm font-medium text-gray-700 mb-1">עיר:</label>
                        <input
                          type="text"
                          id="requestCity"
                          value={requestCity}
                          onChange={(e) => setRequestCity(e.target.value)}
                          className="mt-1 block w-full px-4 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                          placeholder="הכנס עיר..."
                          required // City is mandatory
                        />
                      </div>

                      <div>
                        <label htmlFor="requestNeighborhood" className="block text-sm font-medium text-gray-700 mb-1">שכונה (אופציונלי):</label>
                        <input
                          type="text"
                          id="requestNeighborhood"
                          value={requestNeighborhood}
                          onChange={(e) => setRequestNeighborhood(e.target.value)}
                          className="mt-1 block w-full px-4 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                          placeholder="הכנס שכונה..."
                        />
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
                        {editingRequest?.image_url && !requestImage && (
                          <p className="text-gray-500 text-sm mt-2">קיימת תמונה: <a href={`https://tnhbfrdczpizyeffsmtr.supabase.co/storage/v1/object/public/requests-images/${editingRequest.image_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">צפה בתמונה</a></p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                      >
                        {editingRequest ? 'עדכן פנייה' : 'שלח פנייה'}
                      </button>
                      {editingRequest && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105 mt-2"
                        >
                          ביטול
                        </button>
                      )}
                    </form>
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