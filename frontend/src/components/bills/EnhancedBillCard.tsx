import { Link } from 'react-router-dom';
import { FiArrowLeft, FiEye, FiMessageCircle } from 'react-icons/fi';
import type { Bill } from '../../types';
import { BILL_STAGE_LABELS } from '../../types';

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
};

function getGradient(categories: string[]): string {
  for (const cat of categories) {
    if (CATEGORY_GRADIENTS[cat]) return CATEGORY_GRADIENTS[cat];
  }
  return 'from-knesset-blue to-indigo-800';
}

function extractSummarySnippet(summaryHe: string | null, titleHe: string): string {
  if (summaryHe) {
    // Remove markdown headers and get plain text
    const clean = summaryHe
      .replace(/##?\s*.+/g, '')
      .replace(/[-*]/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    return clean.length > 150 ? clean.substring(0, 150) + '...' : clean;
  }
  // Demo fallback
  return `הצעת חוק זו עוסקת ב${titleHe.includes('תיקון') ? 'תיקון חקיקה קיימת' : 'הסדרת נושא חדש'} שמשפיע על חיי היומיום של אזרחי ישראל. לחצו לקרוא הסבר מלא.`;
}

export default function EnhancedBillCard({ bill }: { bill: Bill }) {
  const gradient = getGradient(bill.categories);
  const snippet = extractSummarySnippet(bill.summaryHe, bill.titleHe);
  const stageLabel = BILL_STAGE_LABELS[bill.currentStage] || bill.currentStage;

  return (
    <Link
      to={`/bill/${bill.id}/explore`}
      className="block group"
    >
      <div className={`bg-gradient-to-bl ${gradient} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}>
        <div className="p-6 md:p-8">
          {/* Top row: stage + AI badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
              {stageLabel}
            </span>
            <span className="bg-white/10 backdrop-blur-sm text-white/80 text-[10px] md:text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
              🤖 הוסבר ע"י בינה מלאכותית
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight line-clamp-2">
            {bill.titleHe}
          </h3>

          {/* Proposer */}
          {bill.proposerName && (
            <p className="text-white/60 text-sm mb-4">
              {bill.proposerName.split(',')[0].trim()}
              {bill.proposerParty && <span className="text-white/40"> • {bill.proposerParty.substring(0, 25)}</span>}
            </p>
          )}

          {/* AI Summary snippet */}
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
            {snippet}
          </p>

          {/* Bottom row: stats + CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white/50 text-xs">
              <span className="flex items-center gap-1"><FiEye size={12} /> {bill.viewCount}</span>
              <span className="flex items-center gap-1"><FiMessageCircle size={12} /> {bill.commentCount}</span>
              {bill.categories[0] && (
                <span className="bg-white/10 px-2 py-0.5 rounded-full">{bill.categories[0]}</span>
              )}
            </div>
            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold group-hover:bg-white/30 transition-colors flex items-center gap-1">
              קרא הסבר מלא
              <FiArrowLeft size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
