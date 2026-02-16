import { BILL_STAGES_ORDER, BILL_STAGE_LABELS, type BillStage } from '../../types';
import { FiCheck } from 'react-icons/fi';

interface Props {
  currentStage: BillStage;
}

export default function BillStageTracker({ currentStage }: Props) {
  const currentIndex = BILL_STAGES_ORDER.indexOf(currentStage);
  const isRejected = currentStage === 'REJECTED';

  return (
    <div className="card">
      <h3 className="font-bold text-lg mb-4">מעקב שלבי חקיקה</h3>
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-4 right-4 left-4 h-0.5 bg-gray-200" />
        <div
          className="absolute top-4 right-4 h-0.5 bg-primary-500 transition-all duration-500"
          style={{ width: `${(currentIndex / (BILL_STAGES_ORDER.length - 1)) * 100}%` }}
        />

        {/* Stage dots */}
        <div className="relative flex justify-between">
          {BILL_STAGES_ORDER.map((stage, i) => {
            const isPassed = i < currentIndex;
            const isCurrent = i === currentIndex;

            return (
              <div key={stage} className="flex flex-col items-center" style={{ width: '12.5%' }}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                    ${isPassed ? 'bg-primary-500 border-primary-500 text-white' :
                      isCurrent ? 'bg-white border-primary-500 text-primary-500 ring-4 ring-primary-100' :
                      'bg-white border-gray-300 text-gray-400'}`}
                >
                  {isPassed ? <FiCheck size={14} /> : i + 1}
                </div>
                <span className={`text-xs mt-2 text-center leading-tight
                  ${isCurrent ? 'text-primary-600 font-bold' : isPassed ? 'text-primary-500' : 'text-gray-400'}`}>
                  {BILL_STAGE_LABELS[stage]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {isRejected && (
        <div className="mt-4 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm text-center font-medium">
          הצעת החוק נדחתה
        </div>
      )}
    </div>
  );
}
