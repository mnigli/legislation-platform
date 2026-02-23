import { useMemo, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  FiRefreshCw, FiStar, FiClock, FiTrendingUp, FiEdit2,
  FiArrowLeft, FiMessageCircle, FiEye
} from 'react-icons/fi';
import { api } from '../../services/api';
import type { QuizAnswers } from '../../lib/demographicMapping';
import {
  buildBillQueries, buildTrendingQuery, buildUpcomingQuery,
  getWhyHereReason, INTEREST_LABELS, LIFE_LABELS,
} from '../../lib/demographicMapping';
import { BILL_STAGE_LABELS } from '../../types';
import type { Bill } from '../../types';

// ==================== TYPES ====================

interface QuizResultsProps {
  answers: QuizAnswers;
  onRetake: () => void;
}

// ==================== CATEGORY GRADIENTS ====================

const CATEGORY_GRADIENTS: Record<string, string> = {
  'חינוך': 'from-blue-600 to-indigo-700',
  'בריאות': 'from-rose-600 to-pink-700',
  'כלכלה': 'from-emerald-600 to-teal-700',
  'סביבה': 'from-green-600 to-lime-700',
  'דיור': 'from-amber-600 to-orange-700',
  'ביטחון': 'from-slate-600 to-gray-700',
  'צרכנות': 'from-purple-600 to-violet-700',
  'טכנולוגיה': 'from-cyan-600 to-blue-700',
  'רווחה': 'from-pink-600 to-fuchsia-700',
  'תעשייה': 'from-stone-600 to-zinc-700',
  'תחבורה': 'from-sky-600 to-blue-700',
};

function getGradient(categories: string[]): string {
  for (const cat of categories) {
    if (CATEGORY_GRADIENTS[cat]) return CATEGORY_GRADIENTS[cat];
  }
  return 'from-knesset-blue to-indigo-800';
}

function extractSnippet(summaryHe: string | null, titleHe: string): string {
  if (summaryHe) {
    const clean = summaryHe.replace(/##?\s*.+/g, '').replace(/[-*]/g, '').replace(/\n+/g, ' ').trim();
    return clean.length > 120 ? clean.substring(0, 120) + '...' : clean;
  }
  return `הצעת חוק זו עוסקת ב${titleHe.includes('תיקון') ? 'תיקון חקיקה' : 'הסדרה חדשה'} שמשפיעה על חיי היומיום.`;
}

// ==================== PERSONAL BILL CARD ====================

function PersonalBillCard({ bill, answers }: { bill: Bill; answers: QuizAnswers }) {
  const [isFollowed, setIsFollowed] = useState(false);
  const gradient = getGradient(bill.categories);
  const stageLabel = BILL_STAGE_LABELS[bill.currentStage] || bill.currentStage;
  const whyHere = getWhyHereReason(bill.categories, answers);
  const snippet = extractSnippet(bill.summaryHe, bill.titleHe);

  return (
    <div className={`bg-gradient-to-bl ${gradient} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group`}>
      <div className="p-5 md:p-6">
        {/* Top row: stage + follow */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
              {stageLabel}
            </span>
            {bill.categories.slice(0, 2).map(cat => (
              <span key={cat} className="bg-white/10 text-white/70 text-[10px] font-medium px-2 py-0.5 rounded-full">
                {cat}
              </span>
            ))}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFollowed(!isFollowed);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              isFollowed
                ? 'bg-white text-knesset-blue shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <FiStar size={12} className={isFollowed ? 'fill-current' : ''} />
            {isFollowed ? 'עוקב' : 'עקוב'}
          </button>
        </div>

        {/* Title */}
        <Link to={`/bill/${bill.id}/explore`}>
          <h3 className="text-lg md:text-xl font-black text-white mb-2 leading-tight line-clamp-2 hover:underline decoration-white/30 underline-offset-4">
            {bill.titleHe}
          </h3>
        </Link>

        {/* Snippet */}
        <p className="text-white/70 text-sm leading-relaxed mb-3 line-clamp-2">
          {snippet}
        </p>

        {/* Why here tag */}
        {whyHere && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 mb-3 inline-block">
            <span className="text-white/80 text-xs">💡 {whyHere}</span>
          </div>
        )}

        {/* Bottom stats + CTA */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 text-white/40 text-xs">
            <span className="flex items-center gap-1"><FiEye size={11} /> {bill.viewCount}</span>
            <span className="flex items-center gap-1"><FiMessageCircle size={11} /> {bill.commentCount}</span>
            <span className="flex items-center gap-1"><FiStar size={11} /> {bill.starCount}</span>
          </div>
          <Link
            to={`/bill/${bill.id}/explore`}
            className="bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/25 transition-colors flex items-center gap-1"
          >
            קרא עוד <FiArrowLeft size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==================== TRENDING BILL CARD (simpler) ====================

function TrendingBillCard({ bill }: { bill: Bill }) {
  const stageLabel = BILL_STAGE_LABELS[bill.currentStage] || bill.currentStage;

  return (
    <Link
      to={`/bill/${bill.id}/explore`}
      className="block bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-knesset-blue/30 transition-all duration-200 group"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <FiTrendingUp size={10} /> מדובר
        </span>
        <span className="bg-gray-100 text-gray-500 text-[10px] font-medium px-2 py-0.5 rounded-full">
          {stageLabel}
        </span>
      </div>
      <h4 className="text-base font-black text-gray-900 mb-1.5 line-clamp-2 group-hover:text-knesset-blue transition-colors">
        {bill.titleHe}
      </h4>
      <div className="flex items-center gap-3 text-gray-400 text-xs">
        <span className="flex items-center gap-1"><FiEye size={11} /> {bill.viewCount}</span>
        <span className="flex items-center gap-1"><FiMessageCircle size={11} /> {bill.commentCount}</span>
      </div>
    </Link>
  );
}

// ==================== UPCOMING BILL CARD ====================

function UpcomingBillCard({ bill }: { bill: Bill }) {
  const stageLabel = BILL_STAGE_LABELS[bill.currentStage] || bill.currentStage;
  const snippet = extractSnippet(bill.summaryHe, bill.titleHe);

  return (
    <div className="bg-gradient-to-bl from-indigo-900 via-blue-900 to-slate-900 rounded-2xl overflow-hidden shadow-lg">
      <div className="p-5 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <FiClock size={12} /> בדיון קרוב
          </span>
          <span className="bg-white/10 text-white/60 text-[10px] font-medium px-2 py-0.5 rounded-full">
            {stageLabel}
          </span>
        </div>

        <Link to={`/bill/${bill.id}/explore`}>
          <h3 className="text-lg md:text-xl font-black text-white mb-2 leading-tight hover:underline decoration-white/30 underline-offset-4">
            {bill.titleHe}
          </h3>
        </Link>

        <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">
          {snippet}
        </p>

        <div className="flex items-center gap-3">
          <Link
            to={`/bill/${bill.id}/explore`}
            className="bg-amber-400 text-gray-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-300 transition-colors flex items-center gap-1"
          >
            <FiMessageCircle size={14} />
            שלח הערה לפני הדיון
          </Link>
          <Link
            to={`/bill/${bill.id}/explore`}
            className="bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors flex items-center gap-1"
          >
            קרא עוד <FiArrowLeft size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN RESULTS COMPONENT ====================

export default function QuizResults({ answers, onRetake }: QuizResultsProps) {
  const queries = useMemo(() => buildBillQueries(answers), [answers]);

  // Personal bills
  const results = useQueries({
    queries: queries.map((params) => ({
      queryKey: ['bills', 'quiz', params],
      queryFn: () => api.getBills(params),
      staleTime: 5 * 60 * 1000,
    })),
  });

  // Trending bills
  const trendingQuery = useMemo(() => buildTrendingQuery(), []);
  const { data: trendingRes } = useQuery({
    queryKey: ['bills', 'trending-quiz', trendingQuery],
    queryFn: () => api.getBills(trendingQuery),
    staleTime: 5 * 60 * 1000,
  });

  // Upcoming/newest bills (simulate "upcoming discussion")
  const upcomingQuery = useMemo(() => buildUpcomingQuery(), []);
  const { data: upcomingRes } = useQuery({
    queryKey: ['bills', 'upcoming-quiz', upcomingQuery],
    queryFn: () => api.getBills(upcomingQuery),
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = results.some(r => r.isLoading);

  // Merge & dedup personal bills → top 3
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
    return allBills.slice(0, 3);
  }, [results]);

  // Trending → 2 bills (excluding personal)
  const trendingBills = useMemo(() => {
    const personalIds = new Set(personalBills.map(b => b.id));
    return (trendingRes?.data || []).filter((b: Bill) => !personalIds.has(b.id)).slice(0, 2);
  }, [trendingRes, personalBills]);

  // Upcoming → 1 bill (excluding personal + trending)
  const upcomingBill = useMemo(() => {
    const usedIds = new Set([
      ...personalBills.map(b => b.id),
      ...trendingBills.map((b: Bill) => b.id),
    ]);
    return (upcomingRes?.data || []).find((b: Bill) => !usedIds.has(b.id)) || null;
  }, [upcomingRes, personalBills, trendingBills]);

  // Preference tags for bottom area
  const interestTags = answers.interests.map(i => INTEREST_LABELS[i] || i);
  const lifeTags = answers.lifeSituation.map(l => LIFE_LABELS[l] || l);

  return (
    <div className="space-y-10">

      {/* =============== BLOCK 1: בשבילך עכשיו =============== */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-knesset-blue rounded-lg flex items-center justify-center">
            <FiStar className="text-white" size={16} />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-gray-900">בשבילך עכשיו</h3>
          <span className="bg-blue-50 text-knesset-blue text-xs font-bold px-2 py-0.5 rounded-full">{personalBills.length} הצעות</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-56 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : personalBills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personalBills.map((bill: Bill) => (
              <PersonalBillCard key={bill.id} bill={bill} answers={answers} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 text-lg mb-2">לא נמצאו הצעות חוק ספציפיות להעדפות שלך</p>
            <Link to="/bills" className="text-knesset-blue font-bold hover:underline">
              צפו בכל הצעות החוק
            </Link>
          </div>
        )}
      </div>

      {/* =============== BLOCK 2: הכי מדוברים בישראל =============== */}
      {trendingBills.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-white" size={16} />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-gray-900">הכי מדוברים בישראל</h3>
            <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">זהה לכל המשתמשים</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingBills.map((bill: Bill) => (
              <TrendingBillCard key={bill.id} bill={bill} />
            ))}
          </div>
        </div>
      )}

      {/* =============== BLOCK 3: בדיון קרוב =============== */}
      {upcomingBill && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FiClock className="text-white" size={16} />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-gray-900">בדיון קרוב</h3>
          </div>

          <UpcomingBillCard bill={upcomingBill} />
        </div>
      )}

      {/* =============== BOTTOM: Preferences + Actions =============== */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-700">העדפות שלך</h4>
          <button
            onClick={onRetake}
            className="flex items-center gap-1 text-knesset-blue text-sm font-bold hover:underline"
          >
            <FiEdit2 size={14} />
            ערוך העדפות
          </button>
        </div>

        <div className="space-y-3">
          {/* Interest tags */}
          {interestTags.length > 0 && (
            <div>
              <span className="text-xs text-gray-400 font-medium mb-1 block">תחומי עניין</span>
              <div className="flex flex-wrap gap-2">
                {interestTags.map(tag => (
                  <span key={tag} className="bg-blue-50 text-knesset-blue px-3 py-1 rounded-full text-sm font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Life situation tags */}
          {lifeTags.length > 0 && (
            <div>
              <span className="text-xs text-gray-400 font-medium mb-1 block">מצב חיים</span>
              <div className="flex flex-wrap gap-2">
                {lifeTags.map(tag => (
                  <span key={tag} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* CTA row */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-200">
          <Link
            to="/bills"
            className="bg-knesset-blue text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-800 transition-colors flex items-center gap-2 text-sm"
          >
            כל הצעות החוק
            <FiArrowLeft size={14} />
          </Link>
          <button
            onClick={onRetake}
            className="bg-white text-gray-600 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm border border-gray-200"
          >
            <FiRefreshCw size={14} />
            שאלון מחדש
          </button>
        </div>
      </div>
    </div>
  );
}
