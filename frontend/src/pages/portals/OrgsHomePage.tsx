import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiAlertCircle, FiFolder, FiUsers, FiBell, FiChevronDown, FiChevronUp, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import PortalHero from '../../components/portals/PortalHero';
import PortalCard from '../../components/portals/PortalCard';
import DemoBadge from '../../components/portals/DemoBadge';
import ActionBillCard from '../../components/portals/orgs/ActionBillCard';
import {
  DEMO_ORG_ACTION_BILLS,
  DEMO_ORG_TOPIC_FOLDERS,
  DEMO_ORG_COLLABORATIONS,
} from '../../data/portalDemoData';
import type { Bill } from '../../types';
import { BILL_STAGE_LABELS } from '../../types';

// ==================== ZONE 2: Topic Folders ====================

function TopicFoldersZone({ bills }: { bills: Bill[] }) {
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {DEMO_ORG_TOPIC_FOLDERS.map((folder) => {
        const isExpanded = expandedFolder === folder.name;
        const folderBills = bills.filter(b => b.categories.includes(folder.searchCategory)).slice(0, 4);

        return (
          <div key={folder.name} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <button
              onClick={() => setExpandedFolder(isExpanded ? null : folder.name)}
              className="w-full p-4 flex items-center justify-between text-right"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{folder.icon}</span>
                <div>
                  <h4 className="text-base font-bold text-gray-900">{folder.name}</h4>
                  <p className="text-xs text-gray-400">{folder.trackedBillCount} חוקים במעקב • {folder.lastActivity}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{folder.risks} סיכונים</span>
                  <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{folder.opportunities} הזדמנויות</span>
                </div>
                {isExpanded ? <FiChevronUp size={16} className="text-gray-400" /> : <FiChevronDown size={16} className="text-gray-400" />}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-2">
                {folderBills.length > 0 ? folderBills.map(bill => (
                  <Link
                    key={bill.id}
                    to={`/orgs/bill/${bill.id}`}
                    className="block bg-white rounded-lg p-3 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-gray-800 line-clamp-1">{bill.titleHe}</h5>
                      <span className="bg-gray-100 text-gray-500 text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 mr-2">
                        {BILL_STAGE_LABELS[bill.currentStage as keyof typeof BILL_STAGE_LABELS] || bill.currentStage}
                      </span>
                    </div>
                  </Link>
                )) : (
                  <p className="text-sm text-gray-400 text-center py-2">אין חוקים בקטגוריה זו כרגע</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ==================== ZONE 3: Collaborations ====================

function CollaborationsZone({ bills }: { bills: Bill[] }) {
  return (
    <div className="space-y-3">
      {DEMO_ORG_COLLABORATIONS.map((collab, i) => {
        const bill = bills[collab.billIndex];
        const stanceColors = {
          for: 'bg-green-50 text-green-700',
          against: 'bg-red-50 text-red-700',
          mixed: 'bg-amber-50 text-amber-700',
        };
        const stanceLabels = { for: 'בעד', against: 'נגד', mixed: 'עמדה מעורבת' };

        return (
          <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{collab.orgIcon}</span>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{collab.orgName}</h4>
                {bill && (
                  <Link to={`/orgs/bill/${bill.id}`} className="text-xs text-gray-400 hover:text-teal-600 line-clamp-1">
                    {bill.titleHe}
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stanceColors[collab.stance]}`}>
                {stanceLabels[collab.stance]}
              </span>
              <span className="text-xs text-gray-400">{collab.members} חברים</span>
              {collab.coalitionOpen ? (
                <button
                  onClick={() => toast('הצטרפות לקואליציה — בקרוב!', { icon: '🤝' })}
                  className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors"
                >
                  הצטרף
                </button>
              ) : (
                <span className="text-xs text-gray-300">סגורה</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==================== MAIN PAGE ====================

export default function OrgsHomePage() {
  const { data: billsRes, isLoading } = useQuery({
    queryKey: ['bills', 'orgs-portal'],
    queryFn: () => api.getBills({ limit: '50', sort: 'newest' }),
    staleTime: 5 * 60 * 1000,
  });

  const bills: Bill[] = billsRes?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-gray-200 rounded-3xl" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PortalHero
        title="עמותות וארגונים"
        subtitle="לזהות חקיקה רלוונטית מוקדם, להתכונן לדיונים, לגייס שותפים, ולהגיש עמדה איכותית בזמן."
        gradient="from-teal-700 via-emerald-800 to-green-900"
        icon={<FiBriefcase size={28} />}
      />

      {/* Zone 1: Action Bills */}
      <PortalCard
        icon={<FiAlertCircle size={20} />}
        title="חוקים שדורשים פעולה השבוע"
        subtitle="הצעות חוק עם דדליין קרוב לוועדה או הצבעה"
        gradient="from-teal-600 to-emerald-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_ORG_ACTION_BILLS.map((demo, i) => {
            const bill = bills[demo.billIndex];
            if (!bill) return null;
            return <ActionBillCard key={i} bill={bill} demo={demo} />;
          })}
        </div>
        <DemoBadge />
      </PortalCard>

      {/* Zone 2: Topic Folders */}
      <PortalCard
        icon={<FiFolder size={20} />}
        title="תיקיות נושא של הארגון"
        subtitle="חוקים מקובצים לפי תחומי הפעילות שלכם"
        gradient="from-emerald-600 to-teal-700"
      >
        <TopicFoldersZone bills={bills} />
        <DemoBadge />
      </PortalCard>

      {/* Zone 3: Collaborations */}
      <PortalCard
        icon={<FiUsers size={20} />}
        title="שיתופי פעולה"
        subtitle="ארגונים נוספים שעוקבים אחרי אותם חוקים"
        gradient="from-green-600 to-teal-700"
      >
        <CollaborationsZone bills={bills} />
        <DemoBadge />
      </PortalCard>

      {/* Smart Alerts */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <FiBell className="text-teal-700" size={16} />
          </div>
          <h3 className="text-lg font-bold text-teal-900">התראות חכמות</h3>
          <span className="bg-teal-200 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">3 חדשות</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-teal-700">
            <span>🔔</span> חוק חדש נכנס לדיון בוועדת הבריאות בעוד 7 ימים
          </div>
          <div className="flex items-center gap-2 text-sm text-teal-700">
            <span>📋</span> 2 ארגונים חדשים הצטרפו לקואליציה בנושא דיור ציבורי
          </div>
          <div className="flex items-center gap-2 text-sm text-teal-700">
            <span>⚠️</span> גרסה חדשה פורסמה להצעת חוק זכויות עובדים
          </div>
        </div>
        <DemoBadge text="דמו — בגרסה הבאה: התראות בזמן אמת" />
      </div>
    </div>
  );
}
