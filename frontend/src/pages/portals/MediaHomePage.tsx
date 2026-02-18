import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiRadio, FiTrendingUp, FiTrendingDown, FiAlertTriangle, FiClock, FiGrid, FiBarChart2 } from 'react-icons/fi';
import { api } from '../../services/api';
import PortalHero from '../../components/portals/PortalHero';
import PortalCard from '../../components/portals/PortalCard';
import DemoBadge from '../../components/portals/DemoBadge';
import ChangelogDiff from '../../components/portals/media/ChangelogDiff';
import {
  DEMO_HOT_BILL_METRICS,
  DEMO_CONTROVERSIAL_BILLS,
  DEMO_WEEKLY_CHANGES,
  DEMO_CONNECTION_MAP,
} from '../../data/portalDemoData';
import type { Bill } from '../../types';
import { BILL_STAGE_LABELS } from '../../types';

// ==================== ANIMATED BAR ====================

function AnimatedBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ==================== DASHBOARD 1: HOT BILLS ====================

function HotBillsDashboard({ bills }: { bills: Bill[] }) {
  const hotBills = useMemo(() => {
    return bills
      .map((bill, _idx) => ({
        bill,
        publicInterest: (bill.starCount * 3) + (bill.commentCount * 2) + (bill.viewCount * 0.1),
      }))
      .sort((a, b) => b.publicInterest - a.publicInterest)
      .slice(0, 5)
      .map((item, i) => ({
        ...item,
        demo: DEMO_HOT_BILL_METRICS[i] || { weeklyGrowthPct: 0, shareCount: 0, commentRate: 0 },
      }));
  }, [bills]);

  const maxInterest = hotBills[0]?.publicInterest || 1;

  return (
    <div className="space-y-3">
      {hotBills.map(({ bill, publicInterest, demo }, i) => (
        <div key={bill.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
          <span className="text-2xl font-black text-gray-200 w-8 text-center">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <Link to={`/media/bill/${bill.id}`} className="text-sm font-bold text-gray-900 line-clamp-1 hover:text-purple-700 transition-colors">
              {bill.titleHe}
            </Link>
            <div className="mt-1">
              <AnimatedBar value={publicInterest} max={maxInterest} color="bg-purple-500" />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center">
              <p className="text-xs text-gray-400">⭐ {bill.starCount}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">💬 {bill.commentCount}</p>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold ${demo.weeklyGrowthPct > 100 ? 'text-green-600' : 'text-gray-400'}`}>
              {demo.weeklyGrowthPct > 0 ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
              <span>{demo.weeklyGrowthPct}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== DASHBOARD 2: CONTROVERSIAL ====================

function ControversialDashboard({ bills }: { bills: Bill[] }) {
  return (
    <div className="space-y-4">
      {DEMO_CONTROVERSIAL_BILLS.map((demo, i) => {
        const bill = bills[demo.billIndex];
        if (!bill) return null;

        return (
          <div key={i} className="border border-gray-100 rounded-xl p-4">
            <Link to={`/media/bill/${bill.id}`} className="text-sm font-bold text-gray-900 hover:text-purple-700 transition-colors">
              {bill.titleHe}
            </Link>
            {/* For/Against bar */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-green-600 font-bold w-12 text-left">{demo.forPct}%</span>
              <div className="flex-1 h-4 rounded-full overflow-hidden flex">
                <div className="bg-green-400 h-full transition-all duration-500" style={{ width: `${demo.forPct}%` }} />
                <div className="bg-red-400 h-full transition-all duration-500" style={{ width: `${demo.againstPct}%` }} />
              </div>
              <span className="text-xs text-red-600 font-bold w-12">{demo.againstPct}%</span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span>✏️ {demo.amendmentCount} הצעות תיקון</span>
              <span>⚠️ {demo.extremeComments} תגובות חריגות</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==================== DASHBOARD 3: WEEKLY CHANGES ====================

function WeeklyChangesDashboard({ bills }: { bills: Bill[] }) {
  return (
    <div className="space-y-6">
      {DEMO_WEEKLY_CHANGES.map((change, i) => {
        const bill = bills[change.billIndex];
        if (!bill) return null;

        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-3">
              <Link to={`/media/bill/${bill.id}`} className="text-sm font-bold text-gray-900 hover:text-purple-700 transition-colors">
                {bill.titleHe}
              </Link>
              <span className="bg-gray-100 text-gray-500 text-[10px] font-medium px-2 py-0.5 rounded-full">
                {BILL_STAGE_LABELS[bill.currentStage as keyof typeof BILL_STAGE_LABELS] || bill.currentStage}
              </span>
            </div>
            <div className="space-y-2">
              {change.changes.map((c, j) => (
                <ChangelogDiff key={j} clauseNum={c.clauseNum} before={c.before} after={c.after} changeType={c.changeType} />
              ))}
            </div>
            {change.officialQuote && (
              <div className="mt-2 bg-purple-50 rounded-lg px-3 py-2 flex items-start gap-2">
                <span className="text-purple-400 text-xs">💬</span>
                <div>
                  <p className="text-xs text-purple-700 italic">"{change.officialQuote}"</p>
                  <p className="text-[10px] text-purple-400 mt-0.5">— {change.quoteSource}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ==================== DASHBOARD 4: CONNECTION MAP ====================

function ConnectionMapDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {DEMO_CONNECTION_MAP.map((node, i) => (
        <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-900">{node.mkName}</h4>
            <span className="bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{node.party}</span>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-gray-400">ועדות</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {node.committees.map(c => (
                  <span key={c} className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-gray-400">משרדים</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {node.ministries.map(m => (
                  <span key={m} className="bg-amber-50 text-amber-600 text-[10px] px-2 py-0.5 rounded">{m}</span>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400">{node.billCount} הצעות חוק</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== MAIN PAGE ====================

export default function MediaHomePage() {
  const { data: billsRes, isLoading } = useQuery({
    queryKey: ['bills', 'media-portal'],
    queryFn: () => api.getBills({ limit: '50', sort: 'stars' }),
    staleTime: 5 * 60 * 1000,
  });

  const bills: Bill[] = billsRes?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-gray-200 rounded-3xl" />
          {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PortalHero
        title="תקשורת"
        subtitle="למצוא סיפורים, להבין מה השתנה, לזהות מגמות, ולעבוד מהר עם נתונים אמינים."
        gradient="from-purple-800 via-violet-800 to-indigo-900"
        icon={<FiRadio size={28} />}
      />

      {/* Dashboard 1: Hot Bills */}
      <PortalCard
        icon={<FiTrendingUp size={20} />}
        title="הצעות חוק חמות"
        subtitle="מדד עניין ציבורי משולב: כוכבים, תגובות, צפיות"
        gradient="from-purple-600 to-violet-700"
        headerExtra={
          <span className="bg-white/15 text-white/70 text-[10px] px-2 py-0.5 rounded-full">
            מדד = (⭐×3)+(💬×2)+(👁×0.1)
          </span>
        }
      >
        <HotBillsDashboard bills={bills} />
        <DemoBadge text="דמו — שיעורי צמיחה להדגמה. נתונים אמיתיים בגרסה הבאה" />
      </PortalCard>

      {/* Dashboard 2: Controversial */}
      <PortalCard
        icon={<FiAlertTriangle size={20} />}
        title="הצעות חוק שנויות במחלוקת"
        subtitle="פערים גדולים בין בעד/נגד, הרבה הצעות תיקון"
        gradient="from-amber-600 to-orange-700"
      >
        <ControversialDashboard bills={bills} />
        <DemoBadge />
      </PortalCard>

      {/* Dashboard 3: Weekly Changes */}
      <PortalCard
        icon={<FiClock size={20} />}
        title="מה השתנה השבוע"
        subtitle="שינויי גרסה, סעיפים שהשתנו, ציטוטים רשמיים"
        gradient="from-emerald-600 to-teal-700"
      >
        <WeeklyChangesDashboard bills={bills} />
        <DemoBadge />
      </PortalCard>

      {/* Dashboard 4: Connection Map */}
      <PortalCard
        icon={<FiGrid size={20} />}
        title="מפת קשרים"
        subtitle="מי יוזם, באיזו ועדה, איזה משרד ממשלתי"
        gradient="from-blue-600 to-indigo-700"
      >
        <ConnectionMapDashboard />
        <DemoBadge />
      </PortalCard>

      {/* Methodology notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center">
        <FiBarChart2 className="mx-auto text-purple-400 mb-2" size={24} />
        <h3 className="text-sm font-bold text-purple-800 mb-1">שקיפות מתודולוגית</h3>
        <p className="text-xs text-purple-600">
          כל מדד מבוסס על נתונים ציבוריים: כוכבים, תגובות, צפיות. ניתן לייצא את הנתונים הגולמיים.
        </p>
        <DemoBadge text="דמו — יצוא נתונים וממשק API בגרסה הבאה" />
      </div>
    </div>
  );
}
