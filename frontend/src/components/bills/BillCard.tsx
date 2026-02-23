import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiEdit3, FiUser, FiCalendar } from 'react-icons/fi';
import RatingStars from './RatingStars';
import type { Bill } from '../../types';
import { BILL_STAGE_LABELS } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { extractBillHeadline, extractBillSubtitle, detectBillTopic } from '../../lib/billDisplay';

interface Props {
  bill: Bill;
}

export default function BillCard({ bill }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Smart display
  const headline = extractBillHeadline(bill.titleHe, bill.summaryHe);
  const subtitle = extractBillSubtitle(bill.titleHe, bill.summaryHe);
  const topic = detectBillTopic(bill.titleHe);

  // Full summary for expanded view
  const rawSummary = bill.summaryHe
    ? bill.summaryHe.replace(/^##\s.*$/gm, '').replace(/^-\s/gm, '').replace(/\*\*/g, '').trim()
    : '';

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
    <div className={`
      group relative bg-white rounded-2xl border border-gray-100 overflow-hidden
      transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50
      ${expanded ? 'shadow-md ring-1 ring-gray-200' : ''}
    `}>
      {/* Colored accent bar on the right side */}
      <div className={`absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b ${topic.gradient} rounded-r-2xl`} />

      {/* Main card - always visible */}
      <div
        className="p-4 md:p-5 pr-5 md:pr-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Top row: topic badge + stage */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${topic.color} ${topic.textColor}`}>
            <span>{topic.icon}</span>
            {topic.label}
          </span>
          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
            {BILL_STAGE_LABELS[bill.currentStage] || bill.currentStage}
          </span>
        </div>

        {/* Headline */}
        <h3 className="text-gray-900 font-bold text-base md:text-lg leading-snug mb-2 group-hover:text-primary-700 transition-colors">
          {headline}
        </h3>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">
          {subtitle}
        </p>

        {/* Bottom row: proposer + stars */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {bill.proposerName && (
              <span className="flex items-center gap-1">
                <FiUser size={12} />
                {bill.proposerName.split(',')[0]}
              </span>
            )}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
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
        <div className="flex items-center justify-center mt-3 pt-2 border-t border-gray-50">
          <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-600 transition-colors">
            {expanded ? (
              <>
                <FiChevronUp size={14} />
                <span>סגור</span>
              </>
            ) : (
              <>
                <FiChevronDown size={14} />
                <span>לחצו להעמקה</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
          {/* Full summary */}
          {rawSummary && rawSummary.length > 20 && (
            <div className="mb-5 bg-white rounded-xl border border-gray-100 p-4">
              <h4 className="font-bold text-gray-800 mb-2 text-sm flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full inline-block" />
                תקציר מלא
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{rawSummary}</p>
            </div>
          )}

          {/* Bill metadata */}
          <div className="flex flex-wrap gap-2 mb-5">
            {bill.proposerName && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-gray-100 rounded-lg px-3 py-1.5 text-xs text-gray-600">
                <FiUser size={12} className="text-gray-400" />
                <strong>{bill.proposerName}</strong>
                {bill.proposerParty && <span className="text-gray-400">({bill.proposerParty})</span>}
              </span>
            )}
            {bill.submissionDate && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-gray-100 rounded-lg px-3 py-1.5 text-xs text-gray-600">
                <FiCalendar size={12} className="text-gray-400" />
                {new Date(bill.submissionDate).toLocaleDateString('he-IL')}
              </span>
            )}
          </div>

          {/* Rating - centered, bigger */}
          <div className="mb-5 flex flex-col items-center gap-2 bg-white rounded-xl border border-gray-100 py-4" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs text-gray-500 font-medium">מה דעתכם?</span>
            <RatingStars
              billId={bill.id}
              averageRating={bill.starCount > 0 ? 4.0 : 0}
              ratingCount={bill.starCount}
              userRating={bill.isStarred ? 4 : null}
              size="lg"
            />
          </div>

          {/* Suggestion form */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
                <FiEdit3 className="text-primary-600" size={14} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">הצעה לשיפור</h4>
                <p className="text-[11px] text-gray-400">איך הייתם משפרים את ההצעה הזו?</p>
              </div>
            </div>
            <textarea
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              placeholder="כתבו כאן את הרעיון שלכם..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 min-h-[80px] bg-gray-50 transition-all"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleSubmitSuggestion(); }}
                disabled={suggestionMutation.isPending || suggestionText.trim().length < 10}
                className="bg-gradient-to-l from-primary-600 to-primary-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:shadow-md hover:shadow-primary-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {suggestionMutation.isPending ? 'שולח...' : 'שלח הצעה ✨'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
