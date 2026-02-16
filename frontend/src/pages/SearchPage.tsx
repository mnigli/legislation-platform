import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiSearch } from 'react-icons/fi';
import { api } from '../services/api';
import BillCard from '../components/bills/BillCard';
import type { Bill } from '../types';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => api.searchBills(q),
    enabled: q.length >= 2,
  });

  const bills: Bill[] = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <FiSearch className="text-gray-400" size={24} />
        <h1 className="text-2xl font-bold">תוצאות חיפוש: "{q}"</h1>
      </div>

      {q.length < 2 ? (
        <div className="card text-center py-12 text-gray-400">
          הקלידו לפחות 2 תווים לחיפוש
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : bills.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          <p className="text-lg mb-2">לא נמצאו תוצאות עבור "{q}"</p>
          <p className="text-sm">נסו מילות חיפוש אחרות</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{bills.length} תוצאות</p>
          {bills.map((bill) => (
            <BillCard key={bill.id} bill={bill} />
          ))}
        </div>
      )}
    </div>
  );
}
