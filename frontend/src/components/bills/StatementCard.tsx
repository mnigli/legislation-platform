import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

interface Statement {
  id: string;
  content: string;
  agreeCount: number;
  neutralCount: number;
  disagreeCount: number;
  userVote: number | null; // 1, 0, -1 or null
}

interface StatementCardProps {
  statement: Statement;
  billId: string;
}

const VOTE_OPTIONS = [
  { value: 1,  label: 'מסכים', emoji: '✓', color: 'green' },
  { value: 0,  label: 'ניטרלי', emoji: '–', color: 'gray' },
  { value: -1, label: 'לא מסכים', emoji: '✗', color: 'red' },
] as const;

const COLOR_CLASSES = {
  green: {
    active: 'bg-green-600 text-white border-green-600',
    hover: 'hover:bg-green-50 hover:border-green-400 text-green-700 border-gray-200',
    bar: 'bg-green-500',
  },
  gray: {
    active: 'bg-gray-500 text-white border-gray-500',
    hover: 'hover:bg-gray-50 hover:border-gray-400 text-gray-600 border-gray-200',
    bar: 'bg-gray-400',
  },
  red: {
    active: 'bg-red-500 text-white border-red-500',
    hover: 'hover:bg-red-50 hover:border-red-400 text-red-600 border-gray-200',
    bar: 'bg-red-400',
  },
};

export default function StatementCard({ statement, billId }: StatementCardProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [localVote, setLocalVote] = useState<number | null>(statement.userVote);
  const [localCounts, setLocalCounts] = useState({
    agree: statement.agreeCount,
    neutral: statement.neutralCount,
    disagree: statement.disagreeCount,
  });

  const total = localCounts.agree + localCounts.neutral + localCounts.disagree;
  const hasVoted = localVote !== null;

  const voteMutation = useMutation({
    mutationFn: (value: number) => api.voteStatement(statement.id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statements', billId] });
    },
  });

  const handleVote = (value: number) => {
    if (!user) {
      // Could trigger login modal
      return;
    }

    const prev = localVote;
    if (prev === value) return; // already voted this

    // Optimistic update
    setLocalVote(value);
    setLocalCounts((c) => {
      const next = { ...c };
      if (prev === 1) next.agree--;
      else if (prev === 0) next.neutral--;
      else if (prev === -1) next.disagree--;
      if (value === 1) next.agree++;
      else if (value === 0) next.neutral++;
      else if (value === -1) next.disagree++;
      return next;
    });

    voteMutation.mutate(value);
  };

  const countFor = (v: number) => {
    if (v === 1) return localCounts.agree;
    if (v === 0) return localCounts.neutral;
    return localCounts.disagree;
  };

  const pct = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Question */}
      <p className="text-base font-semibold text-gray-800 mb-4 leading-relaxed text-right">
        {statement.content}
      </p>

      {/* Vote buttons */}
      <div className="flex gap-2 justify-end mb-4" dir="rtl">
        {VOTE_OPTIONS.map(({ value, label, emoji, color }) => {
          const isActive = localVote === value;
          const cls = COLOR_CLASSES[color];
          return (
            <button
              key={value}
              onClick={() => handleVote(value)}
              disabled={!user}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-sm font-bold
                transition-all duration-150
                ${isActive ? cls.active : cls.hover}
                ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              title={!user ? 'יש להתחבר כדי להצביע' : label}
            >
              <span className="text-base">{emoji}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Results — shown after voting or always */}
      {(hasVoted || total > 0) && (
        <div className="space-y-2 mt-3 pt-3 border-t border-gray-50">
          {VOTE_OPTIONS.map(({ value, label, color }) => {
            const count = countFor(value);
            const p = pct(count);
            const cls = COLOR_CLASSES[color];
            const isActive = localVote === value;
            return (
              <div key={value} className="flex items-center gap-2 text-xs" dir="rtl">
                <span className={`w-16 text-right font-medium ${isActive ? 'font-bold' : 'text-gray-500'}`}>
                  {label}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cls.bar}`}
                    style={{ width: `${p}%` }}
                  />
                </div>
                <span className="w-8 text-left text-gray-500">{p}%</span>
              </div>
            );
          })}
          <p className="text-[10px] text-gray-400 text-right mt-1">{total} מצביעים</p>
        </div>
      )}

      {!user && (
        <p className="text-xs text-gray-400 text-right mt-2">
          <a href="/login" className="text-teal-600 hover:underline font-medium">התחבר</a> כדי להצביע
        </p>
      )}
    </div>
  );
}
