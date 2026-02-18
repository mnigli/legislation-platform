import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiRefreshCw, FiArrowLeft } from 'react-icons/fi';
import { api } from '../../services/api';
import BillCard from '../bills/BillCard';
import type { QuizAnswers } from '../../lib/demographicMapping';
import { buildBillQueries } from '../../lib/demographicMapping';
import type { Bill } from '../../types';

interface QuizResultsProps {
  answers: QuizAnswers;
  onRetake: () => void;
}

export default function QuizResults({ answers, onRetake }: QuizResultsProps) {
  const queries = useMemo(() => buildBillQueries(answers), [answers]);

  const results = useQueries({
    queries: queries.map((params) => ({
      queryKey: ['bills', 'quiz', params],
      queryFn: () => api.getBills(params),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = results.some(r => r.isLoading);

  const displayBills = useMemo(() => {
    const allBills: Bill[] = [];
    const seenIds = new Set<string>();
    for (const result of results) {
      for (const bill of (result.data?.data || [])) {
        if (!seenIds.has(bill.id)) {
          seenIds.add(bill.id);
          allBills.push(bill);
        }
      }
    }
    return allBills.slice(0, 5);
  }, [results]);

  return (
    <div>
      {/* Profile summary */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <span className="bg-blue-50 text-knesset-blue px-3 py-1 rounded-full text-sm font-bold">
          גיל {answers.age}
        </span>
        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
          {answers.gender}
        </span>
        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
          {answers.city}
        </span>
        <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">
          {answers.religiosity}
        </span>
      </div>

      {/* Bills */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3, 4, 5].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))
        ) : displayBills.length > 0 ? (
          displayBills.map((bill: Bill) => (
            <BillCard key={bill.id} bill={bill} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">לא נמצאו הצעות חוק ספציפיות לפרופיל שלך</p>
            <Link to="/bills" className="text-knesset-blue font-bold hover:underline">
              צפו בכל הצעות החוק
            </Link>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Link
          to="/bills"
          className="bg-knesset-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors flex items-center gap-2"
        >
          כל הצעות החוק
          <FiArrowLeft size={16} />
        </Link>
        <button
          onClick={onRetake}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <FiRefreshCw size={16} />
          שאלון מחדש
        </button>
      </div>
    </div>
  );
}
