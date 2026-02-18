import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  FiAward, FiFileText, FiMessageCircle, FiUsers, FiStar,
  FiClock, FiShare2, FiThumbsUp, FiThumbsDown, FiCheckCircle,
  FiBarChart2, FiArrowLeft
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import PortalHero from '../../components/portals/PortalHero';
import PortalCard from '../../components/portals/PortalCard';
import DemoBadge from '../../components/portals/DemoBadge';
import {
  DEMO_MK_BILLS,
  DEMO_MK_FEEDBACK_SUMMARY,
  DEMO_MK_TOP_COMMENTS,
  DEMO_MK_AUDIENCE_STATS,
} from '../../data/portalDemoData';
import type { Bill } from '../../types';
import { BILL_STAGE_LABELS } from '../../types';

// ==================== ZONE 1: MY BILLS ====================

function MyBillsZone({ bills }: { bills: Bill[] }) {
  return (
    <div className="space-y-3">
      {DEMO_MK_BILLS.map((demo, i) => {
        const bill = bills[demo.billIndex];
        if (!bill) return null;
        const stageLabel = BILL_STAGE_LABELS[bill.currentStage as keyof typeof BILL_STAGE_LABELS] || bill.currentStage;

        return (
          <div key={i} className="border-r-4 border-amber-400 bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{stageLabel}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <FiUsers size={10} /> {demo.followers} עוקבים
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <FiMessageCircle size={10} /> {demo.feedbackCount} משוב
                  </span>
                </div>
                <Link to={`/mk/bill/${bill.id}`} className="block">
                  <h3 className="text-base font-black text-gray-900 line-clamp-2 hover:text-amber-700 transition-colors">
                    {bill.titleHe}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <FiClock size={11} />
                  <span>השלב הבא: <strong className="text-gray-700">{demo.nextStep}</strong></span>
                  <span className="text-gray-300 mx-1">•</span>
                  <span>{new Date(demo.nextStepDate).toLocaleDateString('he-IL')}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://hukit.vercel.app/bill/${bill.id}`);
                  toast.success('קישור הועתק!');
                }}
                className="bg-amber-50 text-amber-700 p-2 rounded-lg hover:bg-amber-100 transition-colors flex-shrink-0"
              >
                <FiShare2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==================== ZONE 2: FILTERED FEEDBACK ====================

function FilteredFeedbackZone() {
  return (
    <div className="space-y-6">
      {/* Per-clause summary */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3">סיכום משוב לפי סעיף</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DEMO_MK_FEEDBACK_SUMMARY.map((item, i) => {
            const sentimentColor = item.sentiment > 30 ? 'bg-green-400' : item.sentiment < -30 ? 'bg-red-400' : 'bg-amber-400';
            const sentimentLabel = item.sentiment > 30 ? 'חיובי' : item.sentiment < -30 ? 'שלילי' : 'מעורב';

            return (
              <div key={i} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-800">{item.clauseNum}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">{item.totalComments} תגובות</span>
                    <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${sentimentColor}`}>
                      {sentimentLabel}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${sentimentColor}`}
                    style={{ width: `${Math.abs(item.sentiment)}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.topThemes.map((theme, j) => (
                    <span key={j} className="bg-gray-50 text-gray-500 text-[10px] px-2 py-0.5 rounded">{theme}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 10 quality comments */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3">10 תגובות איכותיות מובילות</h4>
        <div className="space-y-2">
          {DEMO_MK_TOP_COMMENTS.slice(0, 5).map((comment, i) => {
            const roleColors = {
              expert: 'bg-purple-100 text-purple-700',
              org: 'bg-blue-100 text-blue-700',
              citizen: 'bg-gray-100 text-gray-600',
            };
            const roleLabels = { expert: 'מומחה', org: 'ארגון', citizen: 'אזרח' };

            return (
              <div key={i} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColors[comment.role]}`}>
                      {roleLabels[comment.role]}
                    </span>
                    <span className="text-xs font-bold text-gray-800">{comment.author}</span>
                    {comment.isVerified && <FiCheckCircle size={12} className="text-blue-500" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">איכות: {comment.qualityScore}/100</span>
                    <span className="text-xs text-gray-400 flex items-center gap-0.5">
                      <FiThumbsUp size={10} /> {comment.upvotes}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{comment.content}</p>
                <span className="text-[10px] text-gray-300 mt-1 block">{comment.clause}</span>
              </div>
            );
          })}
          <p className="text-xs text-gray-400 text-center">+ עוד {DEMO_MK_TOP_COMMENTS.length - 5} תגובות איכותיות</p>
        </div>
      </div>
    </div>
  );
}

// ==================== ZONE 3: AUDIENCE ====================

function AudienceZone() {
  const stats = DEMO_MK_AUDIENCE_STATS;
  const maxTopic = Math.max(...Object.values(stats.topicInterestMap));

  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-amber-700">{stats.followers.toLocaleString()}</p>
          <p className="text-xs text-amber-500 flex items-center justify-center gap-1"><FiUsers size={11} /> עוקבים</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-blue-700">{stats.reads.toLocaleString()}</p>
          <p className="text-xs text-blue-500 flex items-center justify-center gap-1"><FiFileText size={11} /> קריאות תקציר</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-green-700">{stats.amendments}</p>
          <p className="text-xs text-green-500 flex items-center justify-center gap-1"><FiStar size={11} /> הצעות שיפור</p>
        </div>
      </div>

      {/* Topic interest map */}
      <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <FiBarChart2 size={14} />
        מפת עניין לפי נושאים
      </h4>
      <div className="space-y-2">
        {Object.entries(stats.topicInterestMap)
          .sort((a, b) => b[1] - a[1])
          .map(([topic, count]) => (
            <div key={topic} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-20 text-left flex-shrink-0">{topic}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${(count / maxTopic) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-gray-500 w-8">{count}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

// ==================== MAIN PAGE ====================

export default function MkHomePage() {
  const { data: billsRes, isLoading } = useQuery({
    queryKey: ['bills', 'mk-portal'],
    queryFn: () => api.getBills({ limit: '50', sort: 'newest' }),
    staleTime: 5 * 60 * 1000,
  });

  const bills: Bill[] = billsRes?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-gray-200 rounded-3xl" />
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PortalHero
        title="חברי כנסת"
        subtitle="לשתף ציבור בצורה מסודרת, לקבל פידבק איכותי, ולתרגם אותו לשיפורים בלי להיחנק מספאם."
        gradient="from-amber-600 via-yellow-600 to-orange-700"
        icon={<FiAward size={28} />}
      />

      {/* Zone 1: My Bills */}
      <PortalCard
        icon={<FiFileText size={20} />}
        title="ההצעות שלי"
        subtitle="סטטוס, תזכורות, וקישורי שיתוף"
        gradient="from-amber-500 to-orange-600"
      >
        <MyBillsZone bills={bills} />
        <DemoBadge />
      </PortalCard>

      {/* Zone 2: Filtered Feedback */}
      <PortalCard
        icon={<FiMessageCircle size={20} />}
        title="משוב מסונן"
        subtitle="סיכום תגובות לפי סעיף, תגובות איכותיות, הצעות תיקון מוכנות"
        gradient="from-orange-500 to-red-600"
      >
        <FilteredFeedbackZone />
        <DemoBadge />
      </PortalCard>

      {/* Zone 3: Audience */}
      <PortalCard
        icon={<FiUsers size={20} />}
        title="קהל ועוקבים"
        subtitle="כמה עקבו, כמה קראו, מפת עניין"
        gradient="from-yellow-500 to-amber-600"
      >
        <AudienceZone />
        <DemoBadge />
      </PortalCard>
    </div>
  );
}
