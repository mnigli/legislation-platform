import { Link } from 'react-router-dom';
import { FiClock, FiFileText, FiShare2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import type { Bill } from '../../../types';
import { BILL_STAGE_LABELS } from '../../../types';
import type { DemoActionBill } from '../../../data/portalDemoData';

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function getUrgencyColor(urgency: string): string {
  if (urgency === 'high') return 'bg-red-100 text-red-700 border-red-200';
  if (urgency === 'medium') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-green-100 text-green-700 border-green-200';
}

function getActionLabel(actionType: string): string {
  if (actionType === 'committee_hearing') return '🏛️ דיון בוועדה';
  if (actionType === 'prepare_position') return '📝 הכנת עמדה';
  return '🗳️ הצבעה';
}

export default function ActionBillCard({ bill, demo }: { bill: Bill; demo: DemoActionBill }) {
  const daysLeft = getDaysUntil(demo.deadline);
  const stageLabel = BILL_STAGE_LABELS[bill.currentStage as keyof typeof BILL_STAGE_LABELS] || bill.currentStage;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getUrgencyColor(demo.urgency)}`}>
            {demo.urgency === 'high' ? '🔴 דחוף' : demo.urgency === 'medium' ? '🟡 בינוני' : '🟢 רגיל'}
          </span>
          <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full">{stageLabel}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
          <FiClock size={12} />
          <span className={`font-bold ${daysLeft <= 2 ? 'text-red-600' : daysLeft <= 5 ? 'text-amber-600' : 'text-gray-500'}`}>
            {daysLeft === 0 ? 'היום!' : `עוד ${daysLeft} ימים`}
          </span>
        </div>
      </div>

      <Link to={`/orgs/bill/${bill.id}`} className="block mb-2">
        <h3 className="text-base font-black text-gray-900 line-clamp-2 hover:text-teal-700 transition-colors">
          {bill.titleHe}
        </h3>
      </Link>

      <p className="text-xs text-gray-400 mb-3">{demo.committee} • {getActionLabel(demo.actionType)}</p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => toast('הכנת עמדה — בקרוב!', { icon: '📝' })}
          className="flex-1 bg-teal-50 text-teal-700 text-xs font-bold py-2 px-3 rounded-lg hover:bg-teal-100 transition-colors flex items-center justify-center gap-1"
        >
          <FiFileText size={12} /> הכן עמדה
        </button>
        <button
          onClick={() => toast('שיתוף עם הצוות — בקרוב!', { icon: '📤' })}
          className="flex-1 bg-gray-50 text-gray-600 text-xs font-bold py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
        >
          <FiShare2 size={12} /> שתף לצוות
        </button>
      </div>
    </div>
  );
}
