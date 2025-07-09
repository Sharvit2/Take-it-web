'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-center rounded-b-3xl shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4">TAKE IT – פשוט קח את זה.</h1>
        <p className="text-xl font-semibold text-white">
          בין אם אתה <strong className="text-yellow-200">צריך עזרה</strong> ובין אם אתה <strong className="text-yellow-200">יכול לעזור</strong>, אנחנו פה כדי לחבר ביניכם ברגע.
        </p>
      </header>

      <main className="container mx-auto p-4 py-8 max-w-6xl flex-grow">
        {/* Introduction */}
        <section className="bg-blue-500 bg-opacity-20 p-6 md:p-8 rounded-2xl shadow-md mb-8">
          <p className="text-lg md:text-xl leading-relaxed text-gray-200">
            החיים מלאים באתגרים וזמן הוא מצרך יקר. לפעמים אנחנו זקוקים ליד עוזרת, ולפעמים יש לנו זמן פנוי לנצל אותו בחוכמה. איך מוצאים את ההתאמה המושלמת בין צורך למענה? ואיך מוצאים משימות פשוטות שמשתלבות בול בלו"ז שלך?
          </p>
        </section>

        {/* What's in it for you? */}
        <section className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6 md:mb-8">מה יוצא לך מזה?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Need Help? */}
            <div className="bg-green-500 bg-opacity-20 p-6 md:p-8 rounded-2xl shadow-md">
              <h3 className="text-2xl md:text-3xl font-bold text-green-300 mb-4">🤝 צריך עזרה?</h3>
              <ul className="list-none space-y-3 text-base md:text-lg text-gray-200 mb-6">
                <li>מחפש <strong className="text-green-200">אינסטלטור דחוף</strong>?</li>
                <li>רוצה לפתח <strong className="text-green-200">אתר לעסק</strong>?</li>
                <li>צריכה <strong className="text-green-200">לק מהרגע להרגע</strong>?</li>
                <li>הכלב צריך <strong className="text-green-200">מאלף</strong>?</li>
                <li>מחפש מישהו שייקח את <strong className="text-green-200">הספה מההורים</strong>?</li>
                <li>צריך <strong className="text-green-200">ניקוי רכב עד הבית</strong>?</li>
                <li>או אולי <strong className="text-green-200">עוגות וקינוחים בהזמנה אישית</strong>?</li>
              </ul>
              <p className="text-base md:text-lg leading-relaxed text-green-200">
                <strong className="text-green-400">🟢 כל אחד יכול לפתוח פנייה</strong> – פשוט תפרט מה אתה צריך, מתי ואיפה, וקבע את המחיר שאתה מוכן לשלם.
              </p>
            </div>

            {/* Want to Earn? */}
            <div className="bg-blue-500 bg-opacity-20 p-6 md:p-8 rounded-2xl shadow-md">
              <h3 className="text-2xl md:text-3xl font-bold text-blue-300 mb-4">💰 רוצה להרוויח?</h3>
              <ul className="list-none space-y-3 text-base md:text-lg text-gray-200 mb-6">
                <li>יודע לנגן על גיטרה ורוצה <strong className="text-blue-200">ללמד לנגן</strong>?</li>
                <li>אתה <strong className="text-blue-200">מאמן כושר אישי</strong>?</li>
                <li>אתה רואה את הבקשות בזמן אמת, בודק את הפרטים.</li>
              </ul>
              <p className="text-base md:text-lg leading-relaxed text-blue-200">
                <strong className="text-green-400">🟢 נראה לך משתלם? פשוט קח את זה!</strong> בצע את המשימה וקבל תשלום. בלי תיאומים, בלי המתנה, בלי כאב ראש.
              </p>
            </div>
          </div>
        </section>

        {/* How it Works? */}
        <section className="bg-green-500 bg-opacity-20 p-6 md:p-8 rounded-2xl shadow-md mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6 md:mb-8">איך זה עובד?</h2>
          <ul className="list-none space-y-4 text-base md:text-lg text-gray-200">
            <li><strong className="text-green-300">אתה פותח פנייה</strong> – כותב מה צריך, מתי, ואיפה.</li>
            <li><strong className="text-green-300">אתה בוחר את המחיר</strong> – כמה אתה מוכן לשלם על השירות.</li>
            <li><strong className="text-green-300">נותני שירות רואים את הבקשה בזמן אמת</strong>.</li>
            <li><strong className="text-green-300">הראשון שתופס – שלו</strong>.</li>
            <li><strong className="text-green-300">מבצע ← מאשר ← מקבל תשלום</strong>.</li>
          </ul>
        </section>

        {/* The Best Part */}
        <section className="bg-yellow-500 bg-opacity-20 p-6 md:p-8 rounded-2xl shadow-md mb-8">
          <p className="text-lg md:text-xl font-bold leading-relaxed text-yellow-200 mb-4">
            💬 <strong className="text-yellow-300">וזה החלק הכי יפה:</strong> אתה יכול להיות גם זה שצריך עזרה, וגם זה שנותן אותה. רוצה לפתוח פנייה? תפתח. רוצה לבצע ולהרוויח? קח את זה. אפשר גם וגם, מתי שמתאים לך.
          </p>
          <p className="text-lg md:text-xl font-bold leading-relaxed text-yellow-200">
            🟢 <strong className="text-yellow-300">הסכום סגור מראש.</strong>
          </p>
        </section>

        {/* Call to Action & Buttons */}
        <section className="text-center mt-8 md:mt-12">
          <p className="text-2xl md:text-3xl font-extrabold text-white mb-6">
            כל קריאה היא הזדמנות. כל משימה היא כסף.
          </p>
          <Link href="/signup" className="inline-block bg-teal-500 hover:bg-teal-600 text-white text-xl md:text-2xl font-bold py-3 px-8 md:py-4 md:px-12 rounded-full shadow-lg transition duration-300 transform hover:scale-105 mb-4">
            פשוט קח את זה!
          </Link>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
            <Link href="/signup" className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-md transition duration-300">
              הירשם
            </Link>
            <Link href="/login" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full shadow-md transition duration-300">
              התחבר
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}