import { Link } from 'react-router-dom';
import { FiEye, FiMessageSquare } from 'react-icons/fi';
import StarButton from './StarButton';
import { BILL_STAGE_LABELS, type Bill } from '../../types';

interface Props {
  bill: Bill;
}

const stageColors: Record<string, string> = {
  PROPOSED: 'bg-gray-100 text-gray-700',
  TABLED: 'bg-blue-100 text-blue-700',
  COMMITTEE: 'bg-purple-100 text-purple-700',
  FIRST_READING: 'bg-indigo-100 text-indigo-700',
  COMMITTEE_REVIEW: 'bg-purple-100 text-purple-700',
  SECOND_READING: 'bg-orange-100 text-orange-700',
  THIRD_READING: 'bg-amber-100 text-amber-700',
  PASSED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function BillCard({ bill }: Props) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`stage-badge ${stageColors[bill.currentStage] || 'bg-gray-100 text-gray-700'}`}>
              {BILL_STAGE_LABELS[bill.currentStage]}
            </span>
            {bill.categories.map((cat: string) => (
              <span key={cat} className="tag text-xs">{cat}</span>
            ))}
          </div>

          <Link to={`/bill/${bill.id}`} className="block">
            <h3 className="font-bold text-lg text-gray-900 hover:text-primary-600 transition-colors mb-2">
              {bill.titleHe}
            </h3>
          </Link>

          {bill.proposerName && (
            <p className="text-sm text-gray-500 mb-2">
              מגיש: {bill.proposerName}
              {bill.proposerParty && ` (${bill.proposerParty})`}
            </p>
          )}

          {bill.summaryHe && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {bill.summaryHe.replace(/^##\s.*$/gm, '').replace(/^-\s/gm, '').trim().slice(0, 200)}...
            </p>
          )}
        </div>

        <StarButton
          billId={bill.id}
          starCount={bill.starCount}
          isStarred={bill.isStarred || false}
        />
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          <FiEye size={14} /> {bill.viewCount.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <FiMessageSquare size={14} /> {bill.commentCount}
        </span>
        {bill.submissionDate && (
          <span>{new Date(bill.submissionDate).toLocaleDateString('he-IL')}</span>
        )}
      </div>
    </div>
  );
}
