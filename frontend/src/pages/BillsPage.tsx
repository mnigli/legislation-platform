import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import BillCard from '../components/bills/BillCard';
import type { Bill } from '../types';

export default function BillsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');

  const params: Record<string, string> = { page: String(page), limit: '20', sort: 'newest' };

  const { data, isLoading } = useQuery({
    queryKey: ['bills', params],
    queryFn: () => api.getBills(params),
  });

  const bills: Bill[] = data?.data || [];
  const pagination = data?.meta?.pagination;

  const goToPage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
          📋 הצעות חוק
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          קראו את התקצירים, דרגו ושלחו הצעות לשיפור
        </p>
      </div>

      {/* Bills list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : bills.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 text-center py-16 text-gray-400">
          <p className="text-lg mb-2">לא נמצאו הצעות חוק</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {bills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {page > 1 && (
                <button
                  onClick={() => goToPage(page - 1)}
                  className="w-10 h-10 rounded-lg bg-white text-gray-600 border hover:bg-gray-50 font-medium"
                >
                  ›
                </button>
              )}
              {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                // Show pages around current page
                let p: number;
                if (pagination.totalPages <= 7) {
                  p = i + 1;
                } else if (page <= 4) {
                  p = i + 1;
                } else if (page >= pagination.totalPages - 3) {
                  p = pagination.totalPages - 6 + i;
                } else {
                  p = page - 3 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors text-sm
                      ${p === page ? 'bg-knesset-blue text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                );
              })}
              {page < pagination.totalPages && (
                <button
                  onClick={() => goToPage(page + 1)}
                  className="w-10 h-10 rounded-lg bg-white text-gray-600 border hover:bg-gray-50 font-medium"
                >
                  ‹
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
