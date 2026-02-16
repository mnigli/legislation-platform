import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiThumbsUp, FiThumbsDown, FiCheckCircle, FiClock } from 'react-icons/fi';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { BILL_STAGE_LABELS, type Suggestion } from '../../types';

interface Props {
  billId: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'ממתין לבדיקה', color: 'text-gray-500' },
  REVIEWED: { label: 'נבדק', color: 'text-blue-500' },
  ACCEPTED: { label: 'התקבל', color: 'text-green-600' },
  REJECTED: { label: 'נדחה', color: 'text-red-500' },
};

export default function SuggestionSection({ billId }: Props) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [sort, setSort] = useState('newest');

  const { data, isLoading } = useQuery({
    queryKey: ['suggestions', billId, sort],
    queryFn: () => api.getSuggestions(billId, sort),
  });

  const createMutation = useMutation({
    mutationFn: () => api.createSuggestion(billId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions', billId] });
      setContent('');
    },
  });

  const voteMutation = useMutation({
    mutationFn: ({ id, voteType }: { id: string; voteType: 'UPVOTE' | 'DOWNVOTE' }) =>
      api.voteSuggestion(id, voteType),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suggestions', billId] }),
  });

  const suggestions: Suggestion[] = data?.data || [];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">הצעות לשיפור ({suggestions.length})</h3>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none"
        >
          <option value="newest">חדש ביותר</option>
          <option value="top">מדורג ביותר</option>
        </select>
      </div>

      {user && (
        <div className="mb-6 bg-primary-50 rounded-lg p-4">
          <h4 className="font-medium text-sm text-primary-800 mb-2">יש לך רעיון לשיפור הצעת החוק?</h4>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="תאר את ההצעה שלך לשיפור..."
            rows={4}
            className="w-full border border-primary-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none bg-white"
          />
          <button
            onClick={() => createMutation.mutate()}
            disabled={content.trim().length < 10 || createMutation.isPending}
            className="btn-primary mt-2 text-sm"
          >
            שלח הצעה
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-400">טוען הצעות...</div>
      ) : suggestions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">אין הצעות לשיפור עדיין. הגש הצעה ראשונה!</div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((s) => {
            const status = statusLabels[s.status];
            return (
              <div key={s.id} className={`border rounded-lg p-4 ${s.isOfficialResponse ? 'border-knesset-gold bg-yellow-50/50' : 'border-gray-100'}`}>
                <div className="flex items-start gap-3">
                  {/* Vote column */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => voteMutation.mutate({ id: s.id, voteType: 'UPVOTE' })}
                      disabled={!user}
                      className={`p-1 rounded ${s.userVote === 'UPVOTE' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <FiThumbsUp size={16} />
                    </button>
                    <span className="text-sm font-bold text-gray-700">{s.upvotes - s.downvotes}</span>
                    <button
                      onClick={() => voteMutation.mutate({ id: s.id, voteType: 'DOWNVOTE' })}
                      disabled={!user}
                      className={`p-1 rounded ${s.userVote === 'DOWNVOTE' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <FiThumbsDown size={16} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-sm">{s.user.name}</span>
                      {s.user.role === 'MK' && (
                        <span className="text-xs bg-knesset-gold/20 text-knesset-blue px-2 py-0.5 rounded-full">ח"כ</span>
                      )}
                      {s.isOfficialResponse && (
                        <span className="text-xs bg-knesset-gold text-white px-2 py-0.5 rounded-full">תגובה רשמית</span>
                      )}
                      <span className={`text-xs flex items-center gap-1 ${status.color}`}>
                        {s.status === 'ACCEPTED' ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
                        {status.label}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{s.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{new Date(s.createdAt).toLocaleDateString('he-IL')}</span>
                      {s.stageWhenSubmitted && (
                        <span>הוגש בשלב: {BILL_STAGE_LABELS[s.stageWhenSubmitted]}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
