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
  price: number;
  location: string | null;
  assigned_to_user_id: string | null; // Added to filter for handled calls
}

interface CallsIHandledListProps {
  currentUserId: string | undefined;
}

const CallsIHandledList: React.FC<CallsIHandledListProps> = ({ currentUserId }) => {
  const [calls, setCalls] = useState<ServiceCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHandledCalls = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('requests')
        .select('id, title, status, description, created_at, category, image_url, price, location, assigned_to_user_id')
        .eq('assigned_to_user_id', currentUserId)
        .in('status', ['in_progress', 'closed']); // Filter by 'in_progress' or 'closed' status

      if (fetchError) {
        console.error('Error fetching handled calls:', fetchError.message);
        setError(fetchError.message);
      } else if (data) {
        setCalls(data as ServiceCall[]);
      }
      setLoading(false);
    };

    fetchHandledCalls();
  }, [currentUserId]);

  if (loading) {
    return <div className="text-center py-8">טוען קריאות שטיפלת בהן...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">שגיאה: {error}</div>;
  }

  if (calls.length === 0) {
    return <div className="text-center py-8 text-gray-500">לא נמצאו קריאות שטיפלת בהן.</div>;
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
          {/* Buttons for 'Calls I Handled' can be added here, e.g., 'View Details' */}
        </div>
      ))}
    </div>
  );
};

export default CallsIHandledList; 