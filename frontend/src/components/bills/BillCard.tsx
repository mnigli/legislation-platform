import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiEdit3 } from 'react-icons/fi';
import RatingStars from './RatingStars';
import type { Bill } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { extractBillHeadline, extractBillSubtitle } from '../../lib/billDisplay';

interface Props {
  bill: Bill;
}

export default function BillCard({ bill }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Attractive headline + explanatory subtitle
  const headline = extractBillHeadline(bill.titleHe, bill.summaryHe);
  const subtitle = extractBillSubtitle(bill.titleHe, bill.summaryHe);

  // Get a clean summary text for the expanded view
  const rawSummary = bill.summaryHe
    ? bill.summaryHe.replace(/^##\s.*$/gm, '').replace(/^-\s/gm, '').replace(/\*\*/g, '').trim()
    : '';

  const fullSummary = rawSummary;

  const suggestionMutation = useMutation({
    mutationFn: (content: string) => api.createSuggestion(bill.id, content),
    onSuccess: () => {
      toast.success('ההצעה לשיפור נשלחה בהצלחה!');
      setSuggestionText('');
    },
    onError: () => {
      toast.error('שגיאה בשליחת ההצעה');
    },
  });

  const handleSubmitSuggestion = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (suggestionText.trim().length < 10) {
      toast.error('ההצעה חייבת להכיל לפחות 10 תווים');
      return;
    }
    suggestionMutation.mutate(suggestionText.trim());
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Main card - always visible */}
      <div
        className="p-4 md:p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Attractive headline */}
            <h3 className="text-gray-900 font-bold text-sm md:text-base mb-1 leading-snug">
              {headline}
            </h3>
            {/* Explanatory subtitle */}
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2">
              {subtitle}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            <RatingStars
              billId={bill.id}
              averageRating={bill.starCount > 0 ? 4.0 : 0}
              ratingCount={bill.starCount}
              userRating={bill.isStarred ? 4 : null}
              size="sm"
            />
          </div>
        </div>

        {/* Expand indicator */}
        <div className="flex items-center justify-center mt-3 text-gray-400 text-sm gap-1">
          {expanded ? (
            <>
              <FiChevronUp size={16} />
              <span>סגור</span>
            </>
          ) : (
            <>
              <FiChevronDown size={16} />
              <span>לחצו להעמקה</span>
            </>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4 md:p-5">
          {/* Full summary if long */}
          {rawSummary.length > 200 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">תקציר מלא</h4>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{fullSummary}</p>
            </div>
          )}

          {/* Bill info */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
            {bill.proposerName && (
              <span>מגיש: <strong>{bill.proposerName}</strong>{bill.proposerParty && ` (${bill.proposerParty})`}</span>
            )}
            {bill.submissionDate && (
              <span>הוגשה: {new Date(bill.submissionDate).toLocaleDateString('he-IL')}</span>
            )}
          </div>

          {/* Rating - full size */}
          <div className="mb-5 flex justify-center" onClick={(e) => e.stopPropagation()}>
            <RatingStars
              billId={bill.id}
              averageRating={bill.starCount > 0 ? 4.0 : 0}
              ratingCount={bill.starCount}
              userRating={bill.isStarred ? 4 : null}
              size="lg"
            />
          </div>

          {/* Suggestion form */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <FiEdit3 className="text-primary-600" size={16} />
              <h4 className="font-semibold text-gray-800 text-sm">הצעה לשיפור</h4>
            </div>
            <textarea
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              placeholder="יש לכם רעיון איך לשפר את ההצעה? כתבו כאן..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300 min-h-[80px]"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleSubmitSuggestion(); }}
                disabled={suggestionMutation.isPending || suggestionText.trim().length < 10}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestionMutation.isPending ? 'שולח...' : 'שלח הצעה'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
