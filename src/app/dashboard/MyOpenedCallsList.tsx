import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceCall {
  id: string;
  title: string;
  status: string;
  price: number;
  description: string;
  created_at: string;
}

const MyOpenedCallsList: React.FC = () => {
  const [calls, setCalls] = useState<ServiceCall[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCalls = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('service_calls')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching service calls:', error.message);
      } else if (data) {
        setCalls(data as ServiceCall[]);
      }
      setLoading(false);
    };

    fetchCalls();
  }, [user]);

  if (loading) {
    return <div>Loading your calls...</div>;
  }

  if (calls.length === 0) {
    return <div>No opened calls found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {calls.map((call) => (
        <div key={call.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">{call.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-1">Status: {call.status}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-1">Price: ${call.price}</p>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{call.description}</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mb-4">Opened: {new Date(call.created_at).toLocaleString()}</p>
          <div className="flex justify-end space-x-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              ערוך
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
              מחק
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOpenedCallsList; 