'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface CallCardProps {
  title: string;
  timePosted: string;
  price: string;
  description: string;
  category: string;
  area: string;
}

const CallCard: React.FC<CallCardProps> = ({
  title,
  timePosted,
  price,
  description,
  category,
  area,
}) => {
  const categoryColors: { [key: string]: string } = {
    'אינסטלציה': 'bg-blue-500',
    'ניקיון': 'bg-green-500',
    'בייביסיטר': 'bg-purple-500',
    'הובלות קטנות': 'bg-red-500',
    'שיעורים פרטיים': 'bg-yellow-500',
    'יופי וטיפוח': 'bg-pink-500',
    'אחר': 'bg-gray-500',
  };

  const categoryBgClass = categoryColors[category] || 'bg-gray-500';

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{timePosted}</span>
      </div>
      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{price}</p>
      <p className="text-gray-700 dark:text-gray-300 mb-3">{description}</p>
      <div className="flex justify-between items-center text-sm mb-2">
        <span className={`${categoryBgClass} text-white px-3 py-1 rounded-full text-xs`}>
          {category}
        </span>
        <span className="text-gray-600 dark:text-gray-400">{area}</span>
      </div>
      <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200">
        קח את המשימה
      </button>
    </div>
  );
};

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState<string>("");
  const [userMode, setUserMode] = useState<'client' | 'therapist'>('client');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Mock data for call cards
  const mockCalls: CallCardProps[] = [
    {
      title: 'תיקון נזילה בכיור',
      timePosted: 'פורסם לפני 10 דקות',
      price: '₪150',
      description: 'דרוש אינסטלטור לתיקון נזילה קלה בכיור המטבח. עבודה דחופה.',
      category: 'אינסטלציה',
      area: 'אזור: תל אביב - מרכז',
    },
    {
      title: 'ניקיון דירה קטנה',
      timePosted: 'פורסם לפני שעה',
      price: '₪300',
      description: 'דרושה עוזרת לניקיון יסודי של דירת 2 חדרים. גמישות בשעות.',
      category: 'ניקיון',
      area: 'אזור: רעננה - דרום',
    },
    {
      title: 'שיעור גיטרה למתחילים',
      timePosted: 'פורסם לפני 3 שעות',
      price: '₪100',
      description: 'מחפש מורה לגיטרה קלאסית, שיעורים פרטיים בבית התלמיד.',
      category: 'שיעורים פרטיים',
      area: 'אזור: ירושלים - שכונה ב',
    },
    {
      title: 'הובלת מקרר קטן',
      timePosted: 'פורסם לפני יום',
      price: '₪200',
      description: 'צריך עזרה בהובלת מקרר קטן מדירה לדירה באותה עיר.',
      category: 'הובלות קטנות',
      area: 'אזור: חיפה - כרמל',
    },
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        if (data && data.full_name) {
          setFullName(data.full_name);
        } else {
          setFullName('');
        }
      }
    };
    fetchProfile();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
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

  const sortOptions = [
    { value: 'newest', label: 'החדש ביותר' },
    { value: 'price-high-low', label: 'מחיר (גבוה לנמוך)' },
    { value: 'price-low-high', label: 'מחיר (נמוך לגבוה)' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col lg:flex-row" dir="rtl">
      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center lg:hidden">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">TAKE IT</div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-gray-700 dark:text-gray-300">שלום{fullName ? `, ${fullName}` : ""}!</span>
          <button
            onClick={signOut}
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-200"
          >
            התנתק
          </button>
        </div>
      </header>

      {/* Right Sidebar */}
      <aside className="w-full lg:w-64 bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col justify-between rounded-lg m-4 lg:m-0">
        <div>
          <div className="hidden lg:flex items-center justify-center mb-6">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">TAKE IT</div>
          </div>
          <div className="text-center mb-6 hidden lg:block">
            <span className="text-gray-700 dark:text-gray-300">שלום{fullName ? `, ${fullName}` : ""}!</span>
          </div>

          {/* Options Section */}
          <nav className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">אפשרויות</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 112 2h2a2 2 0 11-2 2v1m-4 0h-2.586a1 1 0 00-.707.293L3.293 14.707A1 1 0 003 15.414V17m7-10h4m0 0H9m-9 0H3m-1 0H.5M0 0h24v24H0z"></path></svg>
                  פרטים אישיים
                </Link>
              </li>
              <li>
                <div className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                  סטטוס:
                </div>
                <select
                  value={userMode}
                  onChange={(e) => setUserMode(e.target.value as 'client' | 'therapist')}
                  className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="client">לקוח</option>
                  <option value="therapist">נותן שירות</option>
                </select>
              </li>
              <li>
                <Link href="#" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  קריאות באזור שלי
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.827 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.827 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.827-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.827-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  שינוי אזור
                </Link>
              </li>
            </ul>
          </nav>

          {/* Categories Section */}
          <nav>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">קטגוריות</h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout button for desktop */}
        <div className="hidden lg:block mt-8">
          <button
            onClick={signOut}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200 shadow-md"
          >
            התנתק
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-4 lg:p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">קריאות פתוחות באזורך</h2>

        {/* Filter/Sort Options */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
          <input
            type="text"
            placeholder="חפש קריאה..."
            className="flex-1 p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">סנן לפי קטגוריה</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Call/Request List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCalls.map((call, index) => (
            <CallCard key={index} {...call} />
          ))}
        </div>
      </div>
    </div>
  );
}