import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiArrowRight, FiFileText, FiClock, FiBarChart2, FiTrendingUp,
  FiGitCommit, FiBookOpen, FiHash
} from 'react-icons/fi';
import { api } from '../../services/api';
import { BILL_STAGE_LABELS } from '../../types';
import DemoBadge from '../../components/portals/DemoBadge';
import ChangelogDiff from '../../components/portals/media/ChangelogDiff';
import {
  DEMO_WEEKLY_CHANGES,
  DEMO_VERSION_HISTORY,
  DEMO_SIMILAR_LAWS,
  DEMO_KEY_CONCEPTS,
  DEMO_BILL_METRICS_OVER_TIME,
  DEMO_CONNECTION_MAP,
} from '../../data/portalDemoData';

type Tab = 'whatsNew' | 'context' | 'metrics';

// ==================== TAB: WHAT'S NEW ====================

function WhatsNewTab() {
  const change = DEMO_WEEKLY_CHANGES[0];
  if (!change) return null;

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 rounded-xl p-5">
        <h3 className="text-base font-bold text-purple-900 mb-2">סיכום שינוי גרסה אחרון</h3>
        <p className="text-sm text-purple-700">גרסה חדשה פורסמה עם {change.changes.length} שינויים עיקריים</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-700">סעיפים שהשתנו</h4>
        {change.changes.map((c, i) => (
          <ChangelogDiff key={i} clauseNum={c.clauseNum} before={c.before} after={c.after} changeType={c.changeType} />
        ))}
      </div>

      {change.officialQuote && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-bold text-gray-700 mb-2">ציטוט רשמי</h4>
          <blockquote className="text-sm text-gray-600 italic border-r-4 border-purple-400 pr-4">
            "{change.officialQuote}"
            <footer className="text-xs text-gray-400 mt-1 not-italic">— {change.quoteSource}</footer>
          </blockquote>
        </div>
      )}
      <DemoBadge />
    </div>
  );
}

// ==================== TAB: CONTEXT ====================

function ContextTab() {
  return (
    <div className="space-y-6">
      {/* Version History */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FiGitCommit size={16} className="text-purple-500" />
          היסטוריית גרסאות
        </h3>
        <div className="relative pr-6">
          {DEMO_VERSION_HISTORY.map((v, i) => (
            <div key={i} className="flex items-start gap-4 mb-4 relative">
              <div className="absolute right-0 top-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-white z-10" />
              {i < DEMO_VERSION_HISTORY.length - 1 && (
                <div className="absolute right-[5px] top-4 w-0.5 h-full bg-gray-200" />
              )}
              <div className="bg-gray-50 rounded-lg p-3 flex-1 mr-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-purple-700">{v.version}</span>
                  <span className="text-[10px] text-gray-400">{new Date(v.date).toLocaleDateString('he-IL')}</span>
                </div>
                <p className="text-sm text-gray-700">{v.summary}</p>
                {v.changesCount > 0 && (
                  <span className="text-[10px] text-gray-400 mt-1 block">{v.changesCount} שינויים</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Laws */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FiBookOpen size={16} className="text-blue-500" />
          חוקים דומים בעבר
        </h3>
        <div className="space-y-2">
          {DEMO_SIMILAR_LAWS.map((law, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
              <div>
                <p className="text-sm font-bold text-gray-800">{law.name}</p>
                <p className="text-xs text-gray-400">{law.year}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${law.similarity}%` }} />
                </div>
                <span className="text-xs font-bold text-gray-500">{law.similarity}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Concepts */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FiHash size={16} className="text-green-500" />
          מושגים מרכזיים
        </h3>
        <div className="space-y-2">
          {DEMO_KEY_CONCEPTS.map((concept, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3">
              <span className="text-sm font-bold text-gray-800">{concept.term}</span>
              <p className="text-xs text-gray-500 mt-0.5">{concept.definition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Relevant Players */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">שחקנים רלוונטיים</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {DEMO_CONNECTION_MAP.slice(0, 3).map((node, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm font-bold text-gray-800">{node.mkName}</p>
              <p className="text-[10px] text-gray-400">{node.party}</p>
              <p className="text-[10px] text-gray-400">{node.committees[0]}</p>
            </div>
          ))}
        </div>
      </div>
      <DemoBadge />
    </div>
  );
}

// ==================== TAB: METRICS ====================

function MetricsTab() {
  const maxStars = Math.max(...DEMO_BILL_METRICS_OVER_TIME.map(d => d.stars));
  const maxComments = Math.max(...DEMO_BILL_METRICS_OVER_TIME.map(d => d.comments));

  const topTopics = [
    { topic: 'תמיכה ברפורמה', count: 45, size: 'text-lg' },
    { topic: 'חשש מפגיעה', count: 38, size: 'text-base' },
    { topic: 'הצעות תיקון', count: 32, size: 'text-base' },
    { topic: 'דרישה לנתונים', count: 24, size: 'text-sm' },
    { topic: 'ניסיון בינלאומי', count: 18, size: 'text-sm' },
    { topic: 'עלויות', count: 15, size: 'text-xs' },
    { topic: 'לוח זמנים', count: 12, size: 'text-xs' },
  ];

  return (
    <div className="space-y-6">
      {/* Stars over time */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FiTrendingUp size={16} className="text-purple-500" />
          כוכבים לאורך זמן
        </h3>
        <div className="flex items-end gap-2 h-40">
          {DEMO_BILL_METRICS_OVER_TIME.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 mb-1">{d.stars}</span>
              <div
                className="w-full bg-purple-400 rounded-t-lg transition-all duration-500"
                style={{ height: `${(d.stars / maxStars) * 100}%` }}
              />
              <span className="text-[10px] text-gray-400 mt-1">{d.week.replace('שבוע ', '')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comments over time */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">תגובות לאורך זמן</h3>
        <div className="flex items-end gap-2 h-32">
          {DEMO_BILL_METRICS_OVER_TIME.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 mb-1">{d.comments}</span>
              <div
                className="w-full bg-indigo-400 rounded-t-lg transition-all duration-500"
                style={{ height: `${(d.comments / maxComments) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Topic cloud */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">נושאים מובילים בתגובות</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {topTopics.map((t, i) => (
            <span
              key={i}
              className={`${t.size} font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full`}
            >
              {t.topic} ({t.count})
            </span>
          ))}
        </div>
      </div>

      {/* Traffic source (demo bar) */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">מקורות תנועה</h3>
        <div className="h-6 rounded-full overflow-hidden flex">
          <div className="bg-purple-400 h-full" style={{ width: '40%' }} />
          <div className="bg-blue-400 h-full" style={{ width: '25%' }} />
          <div className="bg-green-400 h-full" style={{ width: '20%' }} />
          <div className="bg-gray-300 h-full" style={{ width: '15%' }} />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-gray-400">
          <span>🔍 חיפוש (40%)</span>
          <span>📱 רשתות חברתיות (25%)</span>
          <span>🔗 קישור ישיר (20%)</span>
          <span>📧 ניוזלטר (15%)</span>
        </div>
      </div>
      <DemoBadge />
    </div>
  );
}

// ==================== MAIN PAGE ====================

export default function MediaBillPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>('whatsNew');

  const { data: billRes, isLoading } = useQuery({
    queryKey: ['bill', id],
    queryFn: () => api.getBill(id!),
    enabled: !!id,
  });

  const bill = billRes?.data;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg">הצעת החוק לא נמצאה</p>
        <Link to="/media" className="text-purple-700 font-bold mt-4 inline-block">חזרה לפורטל תקשורת</Link>
      </div>
    );
  }

  const stageLabel = BILL_STAGE_LABELS[bill.currentStage as keyof typeof BILL_STAGE_LABELS] || bill.currentStage;
  const summaryText = bill.summaryHe?.replace(/##?\s*/g, '').replace(/[-*]/g, '').replace(/\n+/g, ' ').trim()
    || 'תקציר יוכן בקרוב.';

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'whatsNew', label: 'מה חדש', icon: <FiClock size={14} /> },
    { id: 'context', label: 'הקשר', icon: <FiBookOpen size={14} /> },
    { id: 'metrics', label: 'מדדים', icon: <FiBarChart2 size={14} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/media" className="text-purple-700 hover:underline text-sm font-medium flex items-center gap-1 mb-4">
          <FiArrowRight size={14} /> חזרה לפורטל תקשורת
        </Link>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">{stageLabel}</span>
          {bill.categories.map((cat: string) => (
            <span key={cat} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">{cat}</span>
          ))}
          <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">📰 תצוגת תקשורת</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{bill.titleHe}</h1>
        {bill.proposerName && (
          <p className="text-gray-500 text-sm">
            הוגשה ע"י {bill.proposerName.split(',')[0].trim()}
            {bill.proposerParty && <span className="text-gray-400"> • {bill.proposerParty.substring(0, 30)}</span>}
          </p>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-purple-700">{bill.starCount}</p>
          <p className="text-xs text-purple-500">⭐ כוכבים</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-blue-700">{bill.commentCount}</p>
          <p className="text-xs text-blue-500">💬 תגובות</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-indigo-700">{bill.viewCount}</p>
          <p className="text-xs text-indigo-500">👁 צפיות</p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-5 mb-6">
        <p className="text-sm text-gray-700 leading-relaxed">{summaryText}</p>
        <div className="flex gap-3 mt-3">
          <Link to={`/bill/${bill.id}`} className="text-purple-700 text-xs font-bold hover:underline flex items-center gap-1">
            <FiFileText size={11} /> דף הצעה מלא
          </Link>
          <Link to={`/bill/${bill.id}/explore`} className="text-purple-700 text-xs font-bold hover:underline flex items-center gap-1">
            <FiBarChart2 size={11} /> דף הסבר AI
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm font-bold transition-colors whitespace-nowrap ${
              tab === t.id
                ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'whatsNew' && <WhatsNewTab />}
      {tab === 'context' && <ContextTab />}
      {tab === 'metrics' && <MetricsTab />}
    </div>
  );
}
