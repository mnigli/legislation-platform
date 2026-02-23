import { useMemo, useState, useEffect } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiStar, FiClock, FiTrendingUp, FiEdit2,
  FiArrowLeft, FiMessageCircle, FiEye, FiChevronDown, FiChevronUp, FiEdit3
} from 'react-icons/fi';
import { api } from '../services/api';
import {
  buildBillQueries, buildTrendingQuery, buildUpcomingQuery,
  getWhyHereReason, loadQuizAnswers, clearQuizAnswers,
} from '../lib/demographicMapping';
import type { QuizAnswers } from '../lib/demographicMapping';
import { BILL_STAGE_LABELS } from '../types';
import type { Bill } from '../types';
import RatingStars from '../components/bills/RatingStars';
import { useAuthStore } from '../stores/authStore';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// ==================== Helper ====================

function extractSnippet(summaryHe: string | null, titleHe: string): string {
  if (summaryHe) {
    const clean = summaryHe
      .replace(/##?\s*.+/g, '')
      .replace(/[-*]/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    return clean.length > 180 ? clean.substring(0, 180) + '...' : clean;
  }
  return `הצעת חוק זו עוסקת ב${titleHe.includes('תיקון') ? 'תיקון חקיקה' : 'הסדרה חדשה'} שמשפיעה על חיי היומיום שלנו.`;
}

// ==================== Bill Result Card ====================

function BillResultCard({ bill, answers, badge }: { bill: Bill; answers: QuizAnswers; badge?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const whyHere = getWhyHereReason(bill.categories, answers);
  const snippet = extractSnippet(bill.summaryHe, bill.titleHe);

  // Full cleaned summary
  const fullSummary = bill.summaryHe
    ? bill.summaryHe.replace(/^##\s.*$/gm, '').replace(/^-\s/gm, '').replace(/\*\*/g, '').trim()
    : '';

  const suggestionMutation = useMutation({
    mutationFn: (content: string) => api.createSuggestion(bill.id, content),
    onSuccess: () => {
      toast.success('ההצעה לשיפור נשלחה!');
      setSuggestionText('');
    },
    onError: () => toast.error('שגיאה בשליחת ההצעה'),
  });

  const handleSubmitSuggestion = () => {
    if (!user) { navigate('/login'); return; }
    if (suggestionText.trim().length < 10) { toast.error('לפחות 10 תווים'); return; }
    suggestionMutation.mutate(suggestionText.trim());
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-4 md:p-5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {badge && (
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              badge === 'trending' ? 'bg-orange-100 text-orange-700' :
              badge === 'upcoming' ? 'bg-amber-100 text-amber-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {badge === 'trending' ? '🔥 מדובר' : badge === 'upcoming' ? '⏰ בדיון קרוב' : '⭐ בשבילך'}
            </span>
          )}
          {whyHere && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              💡 {whyHere}
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Summary as the main content - not the Knesset title */}
            <p className="text-gray-800 text-sm md:text-base leading-relaxed mb-2">
              {snippet}
            </p>
            {/* Small Knesset title */}
            <p className="text-xs text-gray-400 line-clamp-1">
              {bill.titleHe}
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
        <div className="flex items-center justify-center mt-3 text-gray-400 text-xs gap-1">
          {expanded ? <><FiChevronUp size={14} /><span>סגור</span></> : <><FiChevronDown size={14} /><span>לחצו להעמקה</span></>}
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4 md:p-5">
          {fullSummary && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">תקציר מלא</h4>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{fullSummary}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
            {bill.proposerName && (
              <span>מגיש: <strong>{bill.proposerName}</strong>{bill.proposerParty && ` (${bill.proposerParty})`}</span>
            )}
            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
              {BILL_STAGE_LABELS[bill.currentStage] || bill.currentStage}
            </span>
          </div>

          <div className="mb-5 flex justify-center" onClick={(e) => e.stopPropagation()}>
            <RatingStars
              billId={bill.id}
              averageRating={bill.starCount > 0 ? 4.0 : 0}
              ratingCount={bill.starCount}
              userRating={bill.isStarred ? 4 : null}
              size="lg"
            />
          </div>

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

// ==================== Main Page ====================

export default function QuizResultsPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);

  useEffect(() => {
    const saved = loadQuizAnswers();
    if (!saved) {
      navigate('/');
      return;
    }
    setAnswers(saved);
  }, [navigate]);

  const queries = useMemo(() => answers ? buildBillQueries(answers) : [], [answers]);
  const trendingQuery = useMemo(() => buildTrendingQuery(), []);
  const upcomingQuery = useMemo(() => buildUpcomingQuery(), []);

  const results = useQueries({
    queries: queries.map((params) => ({
      queryKey: ['bills', 'quiz', params],
      queryFn: () => api.getBills(params),
      staleTime: 5 * 60 * 1000,
      enabled: !!answers,
    })),
  });

  const { data: trendingRes } = useQuery({
    queryKey: ['bills', 'trending-quiz', trendingQuery],
    queryFn: () => api.getBills(trendingQuery),
    staleTime: 5 * 60 * 1000,
    enabled: !!answers,
  });

  const { data: upcomingRes } = useQuery({
    queryKey: ['bills', 'upcoming-quiz', upcomingQuery],
    queryFn: () => api.getBills(upcomingQuery),
    staleTime: 5 * 60 * 1000,
    enabled: !!answers,
  });

  const isLoading = results.some(r => r.isLoading);

  const personalBills = useMemo(() => {
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

  const trendingBills = useMemo(() => {
    const personalIds = new Set(personalBills.map(b => b.id));
    return (trendingRes?.data || []).filter((b: Bill) => !personalIds.has(b.id)).slice(0, 3);
  }, [trendingRes, personalBills]);

  const upcomingBill = useMemo(() => {
    const usedIds = new Set([
      ...personalBills.map(b => b.id),
      ...trendingBills.map((b: Bill) => b.id),
    ]);
    return (upcomingRes?.data || []).find((b: Bill) => !usedIds.has(b.id)) || null;
  }, [upcomingRes, personalBills, trendingBills]);

  if (!answers) return null;

  const handleRetake = () => {
    clearQuizAnswers();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
          📋 הצעות חוק בשבילך
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          נבחרו לפי תחומי העניין שסימנת. קראו, דרגו והציעו שיפורים.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">

          {/* Personal Bills */}
          {personalBills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FiStar className="text-blue-600" size={16} />
                <h2 className="font-bold text-gray-900 text-base">בשבילך עכשיו</h2>
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{personalBills.length}</span>
              </div>
              <div className="space-y-3">
                {personalBills.map((bill) => (
                  <BillResultCard key={bill.id} bill={bill} answers={answers} badge="personal" />
                ))}
              </div>
            </div>
          )}

          {/* Trending */}
          {trendingBills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FiTrendingUp className="text-orange-600" size={16} />
                <h2 className="font-bold text-gray-900 text-base">הכי מדוברים</h2>
              </div>
              <div className="space-y-3">
                {trendingBills.map((bill: Bill) => (
                  <BillResultCard key={bill.id} bill={bill} answers={answers} badge="trending" />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcomingBill && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FiClock className="text-amber-600" size={16} />
                <h2 className="font-bold text-gray-900 text-base">בדיון קרוב</h2>
              </div>
              <div className="space-y-3">
                <BillResultCard bill={upcomingBill} answers={answers} badge="upcoming" />
              </div>
            </div>
          )}

        </div>
      )}

      {/* Bottom actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 pt-6 border-t border-gray-200">
        <Link
          to="/bills"
          className="w-full sm:w-auto bg-knesset-blue text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          כל הצעות החוק
          <FiArrowLeft size={14} />
        </Link>
        <Link
          to="/arena"
          className="w-full sm:w-auto border-2 border-knesset-blue text-knesset-blue px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          🏟️ זירת דיונים
          <FiArrowLeft size={14} />
        </Link>
        <button
          onClick={handleRetake}
          className="w-full sm:w-auto bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <FiEdit2 size={14} />
          שאלון מחדש
        </button>
      </div>
    </div>
  );
}
