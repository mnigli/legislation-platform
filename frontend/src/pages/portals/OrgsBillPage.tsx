import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiArrowRight, FiFileText, FiClipboard, FiDownload, FiCheckCircle, FiXCircle,
  FiAlertTriangle, FiClock, FiEdit, FiShare2, FiActivity
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { BILL_STAGE_LABELS } from '../../types';
import DemoBadge from '../../components/portals/DemoBadge';
import { DEMO_ORG_POSITION, DEMO_ORG_COMMITTEE_MATERIALS, DEMO_ORG_ACTIVITY_LOG } from '../../data/portalDemoData';

type Tab = 'summary' | 'position' | 'materials';

// ==================== ORG POSITION TAB ====================

function OrgPositionTab() {
  const pos = DEMO_ORG_POSITION;
  const stanceColors = { for: 'border-green-500 bg-green-50', against: 'border-red-500 bg-red-50', mixed: 'border-amber-500 bg-amber-50' };
  const stanceLabels = { for: '✅ הארגון בעד', against: '❌ הארגון נגד', mixed: '⚠️ עמדה מעורבת' };

  return (
    <div className="space-y-6">
      {/* Stance */}
      <div className={`border-r-4 ${stanceColors[pos.stance]} rounded-xl p-5`}>
        <h3 className="text-lg font-black text-gray-900 mb-1">{stanceLabels[pos.stance]}</h3>
        <p className="text-sm text-gray-500">עמדת הארגון הרשמית כפי שהוגשה לוועדה</p>
      </div>

      {/* Problematic Clauses */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FiAlertTriangle className="text-amber-500" size={16} />
          סעיפים בעייתיים
        </h3>
        <div className="space-y-2">
          {pos.problematicClauses.map((c, i) => (
            <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">סעיף {c.clauseNum}</span>
              <p className="text-sm text-gray-700 mt-1">{c.issue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Proposed Amendment */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FiEdit className="text-teal-600" size={16} />
          תיקון מוצע
        </h3>
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
          <p className="text-sm text-gray-800 leading-relaxed">{pos.proposedAmendment}</p>
        </div>
      </div>

      {/* Reasoning & Sources */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">נימוקים ומקורות</h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{pos.reasoning}</p>
        <div className="flex flex-wrap gap-2">
          {pos.sources.map((s, i) => (
            <span key={i} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{s}</span>
          ))}
        </div>
      </div>

      {/* Deadline + Publish */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 text-sm text-red-600">
          <FiClock size={14} />
          <span className="font-bold">דחוף — עד {new Date(pos.deadline).toLocaleDateString('he-IL')}</span>
        </div>
        <button
          onClick={() => toast('פרסום עמדה ציבורית — בקרוב!', { icon: '📢' })}
          className="bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-teal-700 transition-colors"
        >
          פרסם עמדה ציבורית
        </button>
      </div>
      <DemoBadge />
    </div>
  );
}

// ==================== COMMITTEE MATERIALS TAB ====================

function CommitteeMaterialsTab() {
  const mats = DEMO_ORG_COMMITTEE_MATERIALS;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('הועתק!');
  };

  return (
    <div className="space-y-6">
      {/* Documents */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FiFileText className="text-gray-500" size={16} />
          מסמכים
        </h3>
        <div className="space-y-2">
          {mats.documents.map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                  <FiFileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.size}</p>
                </div>
              </div>
              <button
                onClick={() => toast('הורדת מסמך — בקרוב!', { icon: '📥' })}
                className="text-gray-400 hover:text-teal-600 transition-colors"
              >
                <FiDownload size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Talking Points */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FiClipboard className="text-gray-500" size={16} />
          נקודות דיבור
        </h3>
        <div className="space-y-2">
          {mats.talkingPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg group">
              <span className="bg-teal-100 text-teal-700 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 flex-1">{point}</p>
              <button
                onClick={() => copyToClipboard(point)}
                className="text-gray-300 hover:text-teal-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <FiClipboard size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">שאלות לדיון</h3>
        <div className="space-y-2">
          {mats.questions.map((q, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3">
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{q.target}</span>
              <p className="text-sm text-gray-800 mt-1">{q.question}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="border-t border-gray-100 pt-4 flex justify-end">
        <button
          onClick={() => toast('יצוא ל-PDF — בקרוב!', { icon: '📄' })}
          className="bg-gray-800 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-900 transition-colors flex items-center gap-2"
        >
          <FiDownload size={14} />
          יצוא ל-PDF
        </button>
      </div>
      <DemoBadge />
    </div>
  );
}

// ==================== ACTIVITY LOG SIDEBAR ====================

function ActivityLog() {
  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
        <FiActivity size={14} /> יומן פעילות
      </h3>
      <div className="space-y-4">
        {DEMO_ORG_ACTIVITY_LOG.map((entry, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
              entry.type === 'alert' ? 'bg-red-400' :
              entry.type === 'edit' ? 'bg-teal-400' :
              entry.type === 'tag' ? 'bg-amber-400' :
              entry.type === 'share' ? 'bg-blue-400' :
              'bg-gray-300'
            }`} />
            <div>
              <p className="text-xs text-gray-800">{entry.action}</p>
              <p className="text-[10px] text-gray-400">{entry.user} • {entry.time}</p>
            </div>
          </div>
        ))}
      </div>
      <DemoBadge text="דמו — יומן פעילות מלא בגרסה הבאה" />
    </div>
  );
}

// ==================== MAIN PAGE ====================

export default function OrgsBillPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>('summary');

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
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg">הצעת החוק לא נמצאה</p>
        <Link to="/orgs" className="text-teal-700 font-bold mt-4 inline-block">חזרה לפורטל עמותות</Link>
      </div>
    );
  }

  const stageLabel = BILL_STAGE_LABELS[bill.currentStage as keyof typeof BILL_STAGE_LABELS] || bill.currentStage;
  const summaryText = bill.summaryHe?.replace(/##?\s*/g, '').replace(/[-*]/g, '').replace(/\n+/g, ' ').trim()
    || 'תקציר יוכן בקרוב באמצעות בינה מלאכותית.';

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'summary', label: 'תקציר', icon: <FiFileText size={14} /> },
    { id: 'position', label: 'עמדת ארגון', icon: <FiCheckCircle size={14} /> },
    { id: 'materials', label: 'חומרים לוועדה', icon: <FiClipboard size={14} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/orgs" className="text-teal-700 hover:underline text-sm font-medium flex items-center gap-1 mb-4">
          <FiArrowRight size={14} /> חזרה לפורטל עמותות
        </Link>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">{stageLabel}</span>
          {bill.categories.map((cat: string) => (
            <span key={cat} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">{cat}</span>
          ))}
          <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">🏛️ תצוגת ארגון</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{bill.titleHe}</h1>
        {bill.proposerName && (
          <p className="text-gray-500 text-sm">
            הוגשה ע"י {bill.proposerName.split(',')[0].trim()}
            {bill.proposerParty && <span className="text-gray-400"> • {bill.proposerParty.substring(0, 30)}</span>}
          </p>
        )}
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Main content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm font-bold transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'summary' && (
            <div className="prose prose-sm max-w-none">
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">{summaryText}</p>
              </div>
              <div className="mt-4 flex gap-3">
                <Link to={`/bill/${bill.id}`} className="text-teal-700 text-sm font-bold hover:underline flex items-center gap-1">
                  <FiFileText size={12} /> צפה בדף ההצעה המלא
                </Link>
                <Link to={`/bill/${bill.id}/explore`} className="text-teal-700 text-sm font-bold hover:underline flex items-center gap-1">
                  <FiShare2 size={12} /> דף הסבר AI
                </Link>
              </div>
            </div>
          )}
          {tab === 'position' && <OrgPositionTab />}
          {tab === 'materials' && <CommitteeMaterialsTab />}
        </div>

        {/* Sidebar — Activity Log (desktop only) */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
}
