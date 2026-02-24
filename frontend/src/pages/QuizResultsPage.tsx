import { useMemo, useState, useEffect } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiStar, FiClock, FiTrendingUp, FiEdit2,
  FiArrowLeft, FiChevronDown, FiChevronUp, FiEdit3, FiUser, FiCalendar
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
import { extractBillHeadline, extractBillSubtitle, detectBillTopic } from '../lib/billDisplay';

// ==================== Bill Result Card ====================

function BillResultCard({ bill, answers, badge }: { bill: Bill; answers: QuizAnswers; badge?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const whyHere = getWhyHereReason(bill.categories, answers);
  const headline = extractBillHeadline(bill.titleHe, bill.summaryHe);
  const subtitle = extractBillSubtitle(bill.titleHe, bill.summaryHe);
  const topic = detectBillTopic(bill.titleHe);

  const rawSummary = bill.summaryHe
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
    <div className={`
      group relative bg-white rounded-2xl border border-gray-100 overflow-hidden
      transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50
      ${expanded ? 'shadow-md ring-1 ring-gray-200' : ''}
    `}>
      {/* Colored accent bar */}
      <div className={`absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b ${topic.gradient} rounded-r-2xl`} />

      <div className="p-4 md:p-5 pr-5 md:pr-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        {/* Top row: badges */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${topic.color} ${topic.textColor}`}>
              <span>{topic.icon}</span>
              {topic.label}
            </span>
            {badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                badge === 'trending' ? 'bg-orange-100 text-orange-700' :
                badge === 'upcoming' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-50 text-blue-600'
              }`}>
                {badge === 'trending' ? '🔥 מדובר' : badge === 'upcoming' ? '⏰ בדיון קרוב' : '⭐ בשבילך'}
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
            {BILL_STAGE_LABELS[bill.currentStage] || bill.currentStage}
          </span>
        </div>

        {/* Why here */}
        {whyHere && (
          <p className="text-[11px] text-primary-600 bg-primary-50 rounded-lg px-3 py-1 mb-2 inline-block font-medium">
            💡 {whyHere}
          </p>
        )}

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
            {expanded ? <><FiChevronUp size={14} /><span>סגור</span></> : <><FiChevronDown size={14} /><span>לחצו להעמקה</span></>}
          </button>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
          {rawSummary && rawSummary.length > 20 && (
            <div className="mb-5 bg-white rounded-xl border border-gray-100 p-4">
              <h4 className="font-bold text-gray-800 mb-2 text-sm flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full inline-block" />
                תקציר מלא
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{rawSummary}</p>
            </div>
          )}

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
          הצעות חוק בשבילך
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          נבחרו לפי תחומי העניין שסימנת. קראו, דרגו והציעו שיפורים.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
              </div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-full mb-2" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">

          {/* Personal Bills */}
          {personalBills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FiStar className="text-blue-600" size={16} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">בשבילך עכשיו</h2>
                  <p className="text-[11px] text-gray-400">{personalBills.length} הצעות שמתאימות לך</p>
                </div>
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
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                  <FiTrendingUp className="text-orange-600" size={16} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">הכי מדוברים</h2>
                  <p className="text-[11px] text-gray-400">ההצעות שכולם מדברים עליהן</p>
                </div>
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
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                  <FiClock className="text-amber-600" size={16} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">בדיון קרוב</h2>
                  <p className="text-[11px] text-gray-400">עומדת להגיע להצבעה</p>
                </div>
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
          className="w-full sm:w-auto bg-gradient-to-l from-knesset-blue to-blue-800 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 text-sm"
        >
          כל הצעות החוק
          <FiArrowLeft size={14} />
        </Link>
        <Link
          to="/arena"
          className="w-full sm:w-auto border-2 border-knesset-blue text-knesset-blue px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          ✒️ קֶסֶת
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
