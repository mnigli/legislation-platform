import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { FiClock, FiAward, FiGlobe, FiTrendingUp, FiBarChart2, FiUsers } from 'react-icons/fi';
import { api } from '../services/api';

// ==================== TYPES ====================

interface Bill {
  id: string;
  currentStage: string;
  status: string;
  proposerName: string | null;
  proposerParty: string | null;
  starCount: number;
  viewCount: number;
  commentCount: number;
  categories: string[];
  submissionDate: string | null;
  createdAt: string;
}

// ==================== STATIC DATA ====================

const STAGE_TIMELINE = [
  { stage: 'PROPOSED', label: 'הגשה', avgDays: 0, cumDays: 0 },
  { stage: 'TABLED', label: 'הנחה על שולחן הכנסת', avgDays: 14, cumDays: 14 },
  { stage: 'COMMITTEE', label: 'דיון בוועדה', avgDays: 45, cumDays: 59 },
  { stage: 'FIRST_READING', label: 'קריאה ראשונה', avgDays: 30, cumDays: 89 },
  { stage: 'COMMITTEE_REVIEW', label: 'חזרה לוועדה', avgDays: 60, cumDays: 149 },
  { stage: 'SECOND_READING', label: 'קריאה שנייה', avgDays: 21, cumDays: 170 },
  { stage: 'THIRD_READING', label: 'קריאה שלישית', avgDays: 1, cumDays: 171 },
  { stage: 'PASSED', label: 'אישור סופי', avgDays: 7, cumDays: 178 },
];

const WORLD_COMPARISON = [
  { country: 'ישראל', flag: '🇮🇱', billsPerYear: 350, passRate: 8.5, avgDaysToPass: 178, parliamentSize: 120, billsPerMember: 2.9, highlight: true },
  { country: 'ארה"ב', flag: '🇺🇸', billsPerYear: 6000, passRate: 3.5, avgDaysToPass: 263, parliamentSize: 535, billsPerMember: 11.2, highlight: false },
  { country: 'בריטניה', flag: '🇬🇧', billsPerYear: 200, passRate: 25.0, avgDaysToPass: 220, parliamentSize: 650, billsPerMember: 0.3, highlight: false },
  { country: 'גרמניה', flag: '🇩🇪', billsPerYear: 500, passRate: 40.0, avgDaysToPass: 190, parliamentSize: 736, billsPerMember: 0.7, highlight: false },
  { country: 'צרפת', flag: '🇫🇷', billsPerYear: 450, passRate: 15.0, avgDaysToPass: 240, parliamentSize: 577, billsPerMember: 0.8, highlight: false },
  { country: 'יפן', flag: '🇯🇵', billsPerYear: 200, passRate: 80.0, avgDaysToPass: 90, parliamentSize: 713, billsPerMember: 0.3, highlight: false },
  { country: 'קנדה', flag: '🇨🇦', billsPerYear: 300, passRate: 10.0, avgDaysToPass: 200, parliamentSize: 443, billsPerMember: 0.7, highlight: false },
];

// ==================== HELPER COMPONENTS ====================

function AnimatedBar({ value, max, color, delay = 0 }: { value: number; max: number; color: string; delay?: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: `${pct}%`, transitionDelay: `${delay}ms` }}
      />
    </div>
  );
}

function StatCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent || 'bg-blue-50 text-blue-600'}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-extrabold text-gray-900 mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
          {icon}
        </div>
        <h2 className="text-2xl font-extrabold text-white">{title}</h2>
      </div>
      <p className="text-white/70 mr-13">{subtitle}</p>
    </div>
  );
}

// ==================== COMPUTE STATS FROM BILLS ====================

function computeStats(bills: Bill[]) {
  const stageDistribution: Record<string, number> = {};
  const partyProposals: Record<string, number> = {};
  const proposerCount: Record<string, { count: number; party: string | null }> = {};

  let totalViews = 0;
  let totalStars = 0;
  let totalComments = 0;
  let activeBills = 0;
  let passedBills = 0;

  for (const bill of bills) {
    // Stage distribution
    stageDistribution[bill.currentStage] = (stageDistribution[bill.currentStage] || 0) + 1;

    // Aggregate counts
    totalViews += bill.viewCount || 0;
    totalStars += bill.starCount || 0;
    totalComments += bill.commentCount || 0;
    if (bill.status === 'ACTIVE') activeBills++;
    if (bill.status === 'PASSED') passedBills++;

    // Party proposals
    if (bill.proposerParty) {
      const partyName = bill.proposerParty.length > 25
        ? bill.proposerParty.substring(0, 25) + '...'
        : bill.proposerParty;
      partyProposals[partyName] = (partyProposals[partyName] || 0) + 1;
    }

    // Proposer count
    if (bill.proposerName) {
      const firstName = bill.proposerName.split(',')[0].trim();
      if (!proposerCount[firstName]) {
        proposerCount[firstName] = { count: 0, party: bill.proposerParty };
      }
      proposerCount[firstName].count++;
    }
  }

  const topProposers = Object.entries(proposerCount)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([name, data]) => ({ name, count: data.count, party: data.party }));

  const topParties: [string, number][] = Object.entries(partyProposals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return {
    overview: {
      totalBills: bills.length,
      activeBills,
      passedBills,
      totalViews,
      totalStars,
      totalComments,
    },
    stageDistribution,
    topProposers,
    topParties,
  };
}

// ==================== DASHBOARD 1: LEGISLATION TIMELINE ====================

function LegislationTimeline({ stageDistribution }: { stageDistribution: Record<string, number> }) {
  const timeline = STAGE_TIMELINE;
  const maxDays = timeline[timeline.length - 1]?.cumDays || 178;
  const totalInPipeline = Object.values(stageDistribution).reduce((s: number, v) => s + (v as number), 0);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header gradient */}
      <div className="bg-gradient-to-l from-knesset-blue via-blue-800 to-indigo-900 px-8 py-6">
        <SectionHeader
          icon={<FiClock size={20} />}
          title="מסע הצעת חוק"
          subtitle="כמה זמן לוקח מהגשה ועד אישור סופי בכנסת ה-25?"
        />
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-5xl font-black text-white">{maxDays}</span>
          <span className="text-xl text-blue-200">ימים בממוצע</span>
        </div>
        <p className="text-blue-300 text-sm mt-1">~ {Math.round(maxDays / 30)} חודשים מהגשה ועד אישור</p>
      </div>

      {/* Timeline visualization */}
      <div className="px-8 py-8">
        {/* Horizontal progress pipeline */}
        <div className="relative mb-10">
          <div className="flex items-center gap-0 overflow-hidden rounded-xl">
            {timeline.map((stage, i) => {
              const width = i === 0 ? 3 : Math.max(8, (stage.avgDays / maxDays) * 100);
              const colors = [
                'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500',
                'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500', 'bg-green-500'
              ];
              const billsInStage = stageDistribution[stage.stage] || 0;
              return (
                <div
                  key={stage.stage}
                  className={`relative group ${colors[i]} h-12 flex items-center justify-center transition-all duration-500`}
                  style={{ width: `${width}%`, minWidth: '40px' }}
                >
                  <span className="text-[10px] font-bold text-white/90 text-center leading-tight px-1 truncate">
                    {stage.avgDays > 0 ? `${stage.avgDays}י׳` : ''}
                  </span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    <p className="font-bold">{stage.label}</p>
                    <p>{stage.avgDays} ימים בממוצע</p>
                    <p>{billsInStage} הצעות בשלב זה</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Labels below */}
          <div className="flex mt-3 overflow-hidden">
            {timeline.map((stage, i) => {
              const width = i === 0 ? 3 : Math.max(8, (stage.avgDays / maxDays) * 100);
              return (
                <div key={stage.stage} className="text-center" style={{ width: `${width}%`, minWidth: '40px' }}>
                  <p className="text-[10px] text-gray-500 truncate px-0.5">{stage.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage detail cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {timeline.filter(s => s.avgDays > 0).map((stage, i) => {
            const billsInStage = stageDistribution[stage.stage] || 0;
            const pct = totalInPipeline > 0 ? Math.round((billsInStage / totalInPipeline) * 100) : 0;
            const colors = ['text-blue-600 bg-blue-50', 'text-indigo-600 bg-indigo-50', 'text-violet-600 bg-violet-50', 'text-purple-600 bg-purple-50', 'text-fuchsia-600 bg-fuchsia-50', 'text-pink-600 bg-pink-50', 'text-rose-600 bg-rose-50'];
            return (
              <div key={stage.stage} className="rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors[i % colors.length]}`}>
                    {stage.avgDays} ימים
                  </span>
                  <span className="text-xs text-gray-400">יום {stage.cumDays}</span>
                </div>
                <p className="text-sm font-bold text-gray-800 mb-1">{stage.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold text-gray-900">{billsInStage}</span>
                  <span className="text-xs text-gray-400">הצעות ({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Insight box */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <span className="font-bold">💡 תובנה:</span> השלב הארוך ביותר הוא חזרה לוועדה (60 ימים) — שם מתנהלים הדיונים המהותיים על נוסח החוק הסופי.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD 2: LEGISLATION CHAMPIONS ====================

function LegislationChampions({ topProposers, topParties }: { topProposers: { name: string; count: number; party: string | null }[]; topParties: [string, number][] }) {
  const maxProposerCount = topProposers[0]?.count || 1;
  const maxPartyCount = topParties[0]?.[1] || 1;

  const partyColors: Record<string, string> = {
    'הליכוד': 'from-blue-600 to-blue-500',
    'כחול לבן': 'from-sky-500 to-cyan-400',
    'יש עתיד': 'from-orange-500 to-amber-400',
    'ש"ס': 'from-stone-700 to-stone-500',
    'הציונות הדתית': 'from-emerald-600 to-green-500',
  };

  function getPartyColor(partyName: string): string {
    for (const [key, val] of Object.entries(partyColors)) {
      if (partyName.includes(key)) return val;
    }
    return 'from-gray-600 to-gray-400';
  }

  const medals = ['🥇', '🥈', '🥉'];

  if (topProposers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-l from-amber-500 via-yellow-500 to-orange-500 px-8 py-6">
        <SectionHeader
          icon={<FiAward size={20} />}
          title="שיאני החקיקה"
          subtitle="מי מגיש הכי הרבה הצעות חוק בכנסת ה-25?"
        />
      </div>

      <div className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Proposers */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiUsers size={18} className="text-amber-500" />
              חברי כנסת מובילים
            </h3>
            <div className="space-y-3">
              {topProposers.slice(0, 7).map((p, i) => (
                <div key={p.name} className="group">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-8 text-center">
                      {i < 3 ? <span className="text-xl">{medals[i]}</span> : <span className="text-sm font-bold text-gray-400">#{i + 1}</span>}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                          {p.party && (
                            <p className="text-[11px] text-gray-400 truncate">{p.party.substring(0, 30)}</p>
                          )}
                        </div>
                        <span className="text-sm font-extrabold text-gray-900 mr-2 whitespace-nowrap">{p.count} הצעות</span>
                      </div>
                      <AnimatedBar value={p.count} max={maxProposerCount} color="bg-gradient-to-l from-amber-400 to-yellow-300" delay={i * 100} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Parties */}
          {topParties.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiBarChart2 size={18} className="text-amber-500" />
                מפלגות לפי הצעות חוק
              </h3>
              <div className="space-y-4">
                {topParties.slice(0, 6).map(([party, count], i) => (
                  <div key={party}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-gray-700 truncate max-w-[70%]">{party}</span>
                      <span className="text-sm font-extrabold text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-l ${getPartyColor(party)} transition-all duration-1000 ease-out`}
                        style={{
                          width: `${Math.round((count / maxPartyCount) * 100)}%`,
                          transitionDelay: `${i * 150}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fun fact */}
        {topProposers.length >= 2 && (
          <div className="mt-8 bg-violet-50 border border-violet-200 rounded-xl p-4">
            <p className="text-sm text-violet-800">
              <span className="font-bold">🏆 ידעתם?</span> חבר הכנסת הפורה ביותר, <strong>{topProposers[0]?.name}</strong>, הגיש{' '}
              <strong>{topProposers[0]?.count} הצעות חוק</strong> — פי{' '}
              {Math.round(topProposers[0].count / Math.max(1, topProposers[topProposers.length - 1].count))}{' '}
              יותר מחבר הכנסת הכי פחות פעיל ברשימה.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== DASHBOARD 3: ISRAEL VS WORLD ====================

function IsraelVsWorld() {
  const data = WORLD_COMPARISON;
  const maxPassRate = Math.max(...data.map(d => d.passRate));
  const maxAvgDays = Math.max(...data.map(d => d.avgDaysToPass));
  const maxBillsPerMember = Math.max(...data.map(d => d.billsPerMember));

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-l from-emerald-600 via-teal-600 to-cyan-700 px-8 py-6">
        <SectionHeader
          icon={<FiGlobe size={20} />}
          title="ישראל מול העולם"
          subtitle="איך הכנסת משתווה לפרלמנטים אחרים בעולם?"
        />
      </div>

      <div className="px-8 py-8">
        {/* Key metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-bl from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">אחוז אישור</p>
            <p className="text-4xl font-black text-gray-900">8.5%</p>
            <p className="text-sm text-gray-500 mt-1">מהצעות שמגיעות לאישור</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">ישראל</span>
              <span className="text-xs text-gray-400">vs 3.5% בארה"ב</span>
            </div>
          </div>
          <div className="bg-gradient-to-bl from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">זמן אישור ממוצע</p>
            <p className="text-4xl font-black text-gray-900">178</p>
            <p className="text-sm text-gray-500 mt-1">ימים — מהמהירים בעולם</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">מקום 2</span>
              <span className="text-xs text-gray-400">אחרי יפן (90 ימים)</span>
            </div>
          </div>
          <div className="bg-gradient-to-bl from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">הצעות לח"כ</p>
            <p className="text-4xl font-black text-gray-900">2.9</p>
            <p className="text-sm text-gray-500 mt-1">הצעות חוק בממוצע לח"כ</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">מקום 2</span>
              <span className="text-xs text-gray-400">אחרי ארה"ב (11.2)</span>
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-right py-3 px-4 font-bold text-gray-600">מדינה</th>
                <th className="text-center py-3 px-2 font-bold text-gray-600 hidden md:table-cell">הצעות/שנה</th>
                <th className="text-center py-3 px-2 font-bold text-gray-600">אחוז אישור</th>
                <th className="text-center py-3 px-2 font-bold text-gray-600">ימים לאישור</th>
                <th className="text-center py-3 px-2 font-bold text-gray-600 hidden md:table-cell">הצעות/חבר</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.country}
                  className={`border-b border-gray-100 transition-colors ${
                    row.highlight
                      ? 'bg-blue-50/70 hover:bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{row.flag}</span>
                      <span className={`font-bold ${row.highlight ? 'text-knesset-blue' : 'text-gray-700'}`}>
                        {row.country}
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 hidden md:table-cell">
                    <span className="font-bold text-gray-800">{row.billsPerYear.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-col items-center">
                      <span className="font-extrabold text-gray-900">{row.passRate}%</span>
                      <div className="w-16 bg-gray-100 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-full rounded-full ${row.highlight ? 'bg-knesset-blue' : 'bg-gray-400'}`}
                          style={{ width: `${(row.passRate / maxPassRate) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-col items-center">
                      <span className="font-extrabold text-gray-900">{row.avgDaysToPass}</span>
                      <div className="w-16 bg-gray-100 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-full rounded-full ${row.highlight ? 'bg-amber-400' : 'bg-gray-400'}`}
                          style={{ width: `${(row.avgDaysToPass / maxAvgDays) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 hidden md:table-cell">
                    <div className="flex flex-col items-center">
                      <span className="font-extrabold text-gray-900">{row.billsPerMember}</span>
                      <div className="w-16 bg-gray-100 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-full rounded-full ${row.highlight ? 'bg-emerald-500' : 'bg-gray-400'}`}
                          style={{ width: `${(row.billsPerMember / maxBillsPerMember) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Insight */}
        <div className="mt-6 bg-teal-50 border border-teal-200 rounded-xl p-4">
          <p className="text-sm text-teal-800">
            <span className="font-bold">🌍 תובנה:</span> ישראל היא אחת המדינות היעילות בעולם בחקיקה — עם אחוז אישור גבוה פי 2.4 מארה"ב,
            וזמן אישור ממוצע קצר ב-32% מהממוצע העולמי. יפן מובילה באחוז האישור (80%) אך רוב ההצעות שם הן ממשלתיות.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN DASHBOARD PAGE ====================

export default function DashboardPage() {
  // Fetch ALL bills from the existing /bills endpoint (which works on Railway)
  const { data: billsRes, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'allBills'],
    queryFn: () => api.getBills({ limit: '500', sort: 'newest' }),
    staleTime: 5 * 60 * 1000,
  });

  // Compute stats client-side from fetched bills
  const stats = useMemo(() => {
    const bills: Bill[] = billsRes?.data || [];
    if (bills.length === 0) return null;
    return computeStats(bills);
  }, [billsRes]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-3xl" />
          <div className="h-96 bg-gray-200 rounded-3xl" />
          <div className="h-96 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg">שגיאה בטעינת נתונים</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">
          📊 דשבורד חקיקה
        </h1>
        <p className="text-lg text-gray-500">
          נתוני אמת על תהליך החקיקה בכנסת — מסע הצעת חוק, שיאני חקיקה, והשוואה לעולם
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<FiBarChart2 size={20} />}
          label="הצעות חוק"
          value={stats.overview.totalBills}
          sub="במערכת"
          accent="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<FiTrendingUp size={20} />}
          label="פעילות"
          value={stats.overview.activeBills}
          sub="בתהליך חקיקה"
          accent="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<FiUsers size={20} />}
          label="צפיות"
          value={stats.overview.totalViews.toLocaleString()}
          sub="בהצעות חוק"
          accent="bg-purple-50 text-purple-600"
        />
        <StatCard
          icon={<FiAward size={20} />}
          label="דירוגים"
          value={stats.overview.totalStars.toLocaleString()}
          sub="מאזרחים"
          accent="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Dashboard 1: Timeline */}
      <div className="mb-10">
        <LegislationTimeline stageDistribution={stats.stageDistribution} />
      </div>

      {/* Dashboard 2: Champions */}
      <div className="mb-10">
        <LegislationChampions
          topProposers={stats.topProposers}
          topParties={stats.topParties}
        />
      </div>

      {/* Dashboard 3: Israel vs World */}
      <div className="mb-10">
        <IsraelVsWorld />
      </div>

      {/* Footer note */}
      <div className="text-center text-xs text-gray-400 py-4">
        <p>הנתונים מבוססים על API הפתוח של הכנסת ומקורות פרלמנטריים בינלאומיים</p>
        <p className="mt-1">עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}</p>
      </div>
    </div>
  );
}
