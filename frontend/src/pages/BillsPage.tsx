import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import { api } from '../services/api';
import BillCard from '../components/bills/BillCard';
import { BILL_STAGE_LABELS, type Bill, type BillStage } from '../types';

const CATEGORIES = ['חינוך', 'בריאות', 'כלכלה', 'סביבה', 'דיור', 'ביטחון', 'צרכנות', 'טכנולוגיה', 'רווחה', 'תעשייה'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'חדש ביותר' },
  { value: 'oldest', label: 'ישן ביותר' },
  { value: 'stars', label: 'הכי מדורג' },
  { value: 'views', label: 'הכי נצפה' },
  { value: 'comments', label: 'הכי מדובר' },
];

export default function BillsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const stage = searchParams.get('stage') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const params: Record<string, string> = { page: String(page), limit: '20', sort };
  if (category) params.category = category;
  if (stage) params.stage = stage;

  const { data, isLoading } = useQuery({
    queryKey: ['bills', params],
    queryFn: () => api.getBills(params),
  });

  const bills: Bill[] = data?.data || [];
  const pagination = data?.meta?.pagination;

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = category || stage;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">הצעות חוק</h1>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden btn-secondary flex items-center gap-2"
        >
          <FiFilter /> סינון
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`${filtersOpen ? 'fixed inset-0 z-40 bg-white p-6 overflow-auto' : 'hidden'} md:block md:static md:bg-transparent md:p-0 w-full md:w-64 shrink-0`}>
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="text-xl font-bold">סינון</h2>
            <button onClick={() => setFiltersOpen(false)}><FiX size={24} /></button>
          </div>

          <div className="card space-y-6">
            {/* Sort */}
            <div>
              <h3 className="font-medium text-sm text-gray-500 mb-2">מיון</h3>
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <h3 className="font-medium text-sm text-gray-500 mb-2">נושא</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', category === cat ? '' : cat)}
                    className={`text-sm px-3 py-1 rounded-full transition-colors
                      ${category === cat ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Stage */}
            <div>
              <h3 className="font-medium text-sm text-gray-500 mb-2">שלב חקיקה</h3>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(BILL_STAGE_LABELS) as [BillStage, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => updateFilter('stage', stage === key ? '' : key)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors
                      ${stage === key ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                <FiX size={14} /> נקה סינונים
              </button>
            )}
          </div>
        </aside>

        {/* Bill List */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : bills.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">
              <p className="text-lg mb-2">לא נמצאו הצעות חוק</p>
              {hasFilters && <p className="text-sm">נסו לשנות את הסינון</p>}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {bills.map((bill) => (
                  <BillCard key={bill.id} bill={bill} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateFilter('page', String(p))}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors
                        ${p === page ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
