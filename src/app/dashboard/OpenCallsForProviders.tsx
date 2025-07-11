import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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
  seeker_id: string; // To avoid fetching current user's own requests
}

interface OpenCallsForProvidersProps {
  providerCity: string | null; // This will now represent the full location string if applicable
  currentUserId: string | undefined;
}

const OpenCallsForProviders: React.FC<OpenCallsForProvidersProps> = ({ providerCity, currentUserId }) => {
  const [calls, setCalls] = useState<ServiceCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpenCalls = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('requests')
        .select('id, title, status, description, created_at, category, image_url, price, location, seeker_id') // Select new columns including location
        .eq('status', 'open');
      
      if (providerCity) {
        // Filter by location field for providers, matching the city part
        query = query.ilike('location', `%${providerCity}%`); // Use ilike for partial match
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching open calls:', fetchError.message);
        setError(fetchError.message);
      } else if (data) {
        // Filter out requests opened by the current user themselves
        setCalls(data.filter(call => call.seeker_id !== currentUserId) as ServiceCall[]);
      }
      setLoading(false);
    };

    fetchOpenCalls();
  }, [providerCity, currentUserId]);

  if (loading) {
    return <div className="text-center py-8">טוען קריאות פתוחות באזורך...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">שגיאה: {error}</div>;
  }

  if (calls.length === 0) {
    return <div className="text-center py-8 text-gray-500">לא נמצאו קריאות פתוחות באזורך.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {calls.map((call) => (
        <div key={call.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">{call.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-1">סטטוס: {call.status}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-1">מחיר: ₪{call.price}</p>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{call.description}</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mb-4">נפתח: {new Date(call.created_at).toLocaleString()}</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mb-4">קטגוריה: {call.category}</p>
          {call.location && <p className="text-gray-500 dark:text-gray-500 text-xs mb-4">אזור: {call.location}</p>}

          <div className="flex justify-end space-x-2">
            {/* No edit/delete for providers, but could have 'Take Job' or 'Contact Seeker' */}
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              קח את המשימה
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OpenCallsForProviders; 