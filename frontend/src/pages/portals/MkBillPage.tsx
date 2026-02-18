import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiArrowRight, FiFileText, FiShare2, FiInbox, FiCheckCircle,
  FiXCircle, FiFilter, FiThumbsUp, FiDownload, FiShield,
  FiBarChart2, FiClock, FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { BILL_STAGE_LABELS } from '../../types';
import DemoBadge from '../../components/portals/DemoBadge';
import ShareModal from '../../components/portals/mk/ShareModal';
import {
  DEMO_MK_INBOX,
  DEMO_MK_DECISIONS,
  DEMO_MK_TOP_COMMENTS,
} from '../../data/portalDemoData';

type Tab = 'summary' | 'inbox' | 'decisions';

// ==================== TAB: INBOX ====================

function InboxTab() {
  const [filter, setFilter] = useState<'all' | 'expert' | 'org' | 'quality'>('all');

  const filtered = DEMO_MK_INBOX.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'expert') return item.senderType === 'expert';
    if (filter === 'org') return item.senderType === 'org';
    if (filter === 'quality') return item.qualityScore >= 85;
    return true;
  });

  const filterButtons: { id: typeof filter; label: string; count: number }[] = [
    { id: 'all', label: 'הכל', count: DEMO_MK_INBOX.length },
    { id: 'expert', label: 'מומחים', count: DEMO_MK_INBOX.filter(i => i.senderType === 'expert').length },
    { id: 'org', label: 'ארגונים', count: DEMO_MK_INBOX.filter(i => i.senderType === 'org').length },
    { id: 'quality', label: 'איכות גבוהה', count: DEMO_MK_INBOX.filter(i => i.qualityScore >= 85).length },
  ];

  const roleColors: Record<string, string> = {
    expert: 'bg-purple-100 text-purple-700',
    org: 'bg-blue-100 text-blue-700',
    citizen: 'bg-gray-100 text-gray-600',
  };
  const roleLabels: Record<string, string> = { expert: 'מומחה', org: 'ארגון', citizen: 'אזרח' };

  return (
    <div className="space-y-4">
      {/* AI Summary */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
          🤖 סיכום AI של הנושאים המרכזיים
        </h4>
        <p className="text-sm text-amber-700 leading-relaxed">
          רוב הפידבק מתמקד ב-3 נושאים: (1) הארכת תקופת היישום מ-30 ל-90 ימים, (2) הוספת מנגנון בקרה עצמאי,
          (3) הגנה מיוחדת לאוכלוסיות מוחלשות. מומחים ואזרחים מסכימים על הנקודות העיקריות.
        </p>
        <DemoBadge text="דמו — סיכום AI אמיתי בגרסה הבאה" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <FiFilter size={14} className="text-gray-400" />
        {filterButtons.map(btn => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
              filter === btn.id
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {btn.label} ({btn.count})
          </button>
        ))}
      </div>

      {/* Anti-flood info */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
        <FiShield size={14} className="text-gray-400" />
        <span className="text-[10px] text-gray-400">הגנה מפני הצפה פעילה: דירוג איכות, הגבלת תדירות, דרישת נימוק</span>
      </div>

      {/* Inbox items */}
      <div className="space-y-3">
        {filtered.map(item => (
          <InboxItem key={item.id} item={item} roleColors={roleColors} roleLabels={roleLabels} />
        ))}
      </div>
      <DemoBadge />
    </div>
  );
}

function InboxItem({ item, roleColors, roleLabels }: {
  item: typeof DEMO_MK_INBOX[0];
  roleColors: Record<string, string>;
  roleLabels: Record<string, string>;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-right hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColors[item.senderType]}`}>
              {roleLabels[item.senderType]}
            </span>
            <span className="text-sm font-bold text-gray-800">{item.senderName}</span>
            {item.isVerified && <FiCheckCircle size={12} className="text-blue-500" />}
          </div>
          <div className="flex items-center gap-2">
            {/* Quality bar */}
            <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.qualityScore >= 85 ? 'bg-green-400' : item.qualityScore >= 70 ? 'bg-amber-400' : 'bg-gray-300'}`}
                style={{ width: `${item.qualityScore}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400">{item.qualityScore}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">{item.summary}</p>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
          <span>{item.clause}</span>
          <span>{item.timestamp}</span>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <p className="text-sm text-gray-700 leading-relaxed">{item.fullContent}</p>
        </div>
      )}
    </div>
  );
}

// ==================== TAB: DECISIONS ====================

function DecisionsTab() {
  return (
    <div className="space-y-4">
      {/* Trust banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
        <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
        <div>
          <h4 className="text-sm font-bold text-green-800">שקיפות בונה אמון</h4>
          <p className="text-xs text-green-600">סימון מה התקבל ומה נדחה — עם סיבה — קריטי לבניית אמון הציבור בתהליך.</p>
        </div>
      </div>

      {/* Decision cards */}
      <div className="space-y-3">
        {DEMO_MK_DECISIONS.map((decision, i) => {
          const comment = DEMO_MK_TOP_COMMENTS[decision.commentIndex];
          if (!comment) return null;

          const statusConfig = {
            accepted: { color: 'border-green-400 bg-green-50', icon: <FiCheckCircle className="text-green-500" size={16} />, label: 'התקבל' },
            rejected: { color: 'border-red-400 bg-red-50', icon: <FiXCircle className="text-red-500" size={16} />, label: 'נדחה' },
            pending: { color: 'border-gray-300 bg-gray-50', icon: <FiClock className="text-gray-400" size={16} />, label: 'בבדיקה' },
          };

          const config = statusConfig[decision.status];

          return (
            <div key={i} className={`border-r-4 ${config.color} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {config.icon}
                  <span className="text-sm font-bold text-gray-800">{config.label}</span>
                </div>
                <span className="text-[10px] text-gray-400">{comment.clause}</span>
              </div>

              {/* Original comment */}
              <div className="bg-white rounded-lg p-3 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-700">{comment.author}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-0.5"><FiThumbsUp size={10} /> {comment.upvotes}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{comment.content}</p>
              </div>

              {/* Decision reason */}
              {decision.reason && (
                <div className="flex items-start gap-2 mt-2">
                  <FiAlertCircle size={12} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-500"><strong>סיבה:</strong> {decision.reason}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <DemoBadge />
    </div>
  );
}

// ==================== MAIN PAGE ====================

export default function MkBillPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>('summary');
  const [shareOpen, setShareOpen] = useState(false);

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
        <Link to="/mk" className="text-amber-700 font-bold mt-4 inline-block">חזרה לפורטל חכ"ים</Link>
      </div>
    );
  }

  const stageLabel = BILL_STAGE_LABELS[bill.currentStage as keyof typeof BILL_STAGE_LABELS] || bill.currentStage;
  const summaryText = bill.summaryHe?.replace(/##?\s*/g, '').replace(/[-*]/g, '').replace(/\n+/g, ' ').trim()
    || 'תקציר יוכן בקרוב באמצעות בינה מלאכותית.';

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'summary', label: 'תקציר', icon: <FiFileText size={14} /> },
    { id: 'inbox', label: 'תיבת עבודה', icon: <FiInbox size={14} /> },
    { id: 'decisions', label: 'החלטות', icon: <FiCheckCircle size={14} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/mk" className="text-amber-700 hover:underline text-sm font-medium flex items-center gap-1 mb-4">
          <FiArrowRight size={14} /> חזרה לפורטל חכ"ים
        </Link>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">{stageLabel}</span>
          {bill.categories.map((cat: string) => (
            <span key={cat} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">{cat}</span>
          ))}
          <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">🏛️ תצוגת חכ"</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{bill.titleHe}</h1>
            {bill.proposerName && (
              <p className="text-gray-500 text-sm">
                הוגשה ע"י {bill.proposerName.split(',')[0].trim()}
                {bill.proposerParty && <span className="text-gray-400"> • {bill.proposerParty.substring(0, 30)}</span>}
              </p>
            )}
          </div>
          {/* Share to Public button */}
          <button
            onClick={() => setShareOpen(true)}
            className="bg-gradient-to-l from-amber-500 to-orange-500 text-white px-5 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 flex-shrink-0"
          >
            <FiShare2 size={16} />
            שתף לציבור
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <p className="text-xl font-black text-amber-700">{bill.starCount}</p>
          <p className="text-[10px] text-amber-500">⭐ כוכבים</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-xl font-black text-blue-700">{bill.commentCount}</p>
          <p className="text-[10px] text-blue-500">💬 תגובות</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-xl font-black text-green-700">{bill.viewCount}</p>
          <p className="text-[10px] text-green-500">👁 צפיות</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <p className="text-xl font-black text-purple-700">156</p>
          <p className="text-[10px] text-purple-500">✏️ הצעות</p>
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
                ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'summary' && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">{summaryText}</p>
          </div>
          <div className="flex gap-3">
            <Link to={`/bill/${bill.id}`} className="text-amber-700 text-sm font-bold hover:underline flex items-center gap-1">
              <FiFileText size={12} /> דף הצעה מלא
            </Link>
            <Link to={`/bill/${bill.id}/explore`} className="text-amber-700 text-sm font-bold hover:underline flex items-center gap-1">
              <FiBarChart2 size={12} /> הסבר AI
            </Link>
          </div>
        </div>
      )}
      {tab === 'inbox' && <InboxTab />}
      {tab === 'decisions' && <DecisionsTab />}

      {/* Export button */}
      <div className="mt-8 border-t border-gray-100 pt-6 flex justify-center">
        <button
          onClick={() => toast('יצוא תמצית לדיון ועדה — בקרוב!', { icon: '📋' })}
          className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors flex items-center gap-2"
        >
          <FiDownload size={16} />
          יצוא תמצית לדיון ועדה
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        billId={bill.id}
        billTitle={bill.titleHe}
      />
    </div>
  );
}
