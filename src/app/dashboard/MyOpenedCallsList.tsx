import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceCall {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'closed'; // Changed status type
  description: string;
  created_at: string;
  category: string; // Added category
  image_url: string | null; // Added image_url
  price: number; // Price is now mandatory
  location: string | null; // Changed from city to location
}

interface MyOpenedCallsListProps {
  onEdit: (call: ServiceCall) => void;
}

const MyOpenedCallsList: React.FC<MyOpenedCallsListProps> = ({ onEdit }) => {
  const [calls, setCalls] = useState<ServiceCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCalls = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('requests') // Changed from service_calls to requests
      .select('id, title, status, description, created_at, category, image_url, price, location') // Select new columns including location
      .eq('seeker_id', user.id); // Changed from user_id to seeker_id

    if (fetchError) {
      console.error('Error fetching service calls:', fetchError.message);
      setError(fetchError.message);
    } else if (data) {
      setCalls(data as ServiceCall[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCalls();
  }, [user]);

  const handleDelete = async (id: string) => {
    // Replaced window.confirm with direct deletion and inline feedback
    setError(null); // Clear previous errors
    const { error: deleteError } = await supabase
      .from('requests')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting request:', deleteError.message);
      setError('Failed to delete request: ' + deleteError.message);
    } else {
      setCalls(calls.filter((call) => call.id !== id));
      setError('Request deleted successfully!');
      setTimeout(() => setError(null), 3000); // Clear success message after 3 seconds
    }
  };

  if (loading) {
    return <div className="text-center py-8">טוען את הקריאות שלך...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">שגיאה: {error}</div>;
  }

  if (calls.length === 0) {
    return <div className="text-center py-8 text-gray-500">לא נמצאו קריאות שפתחת.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {calls.map((call) => (
        <div key={call.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">{call.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-1">סטטוס: {call.status}</p>
          {call.price !== null && <p className="text-gray-600 dark:text-gray-400 mb-1">מחיר: ₪{call.price}</p>}
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{call.description}</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mb-4">נפתח: {new Date(call.created_at).toLocaleString()}</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mb-4">קטגוריה: {call.category}</p>
          {call.location && <p className="text-gray-500 dark:text-gray-500 text-xs mb-4">אזור: {call.location}</p>}

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onEdit(call)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              ערוך
            </button>
            <button
              onClick={() => handleDelete(call.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              מחק
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOpenedCallsList; 