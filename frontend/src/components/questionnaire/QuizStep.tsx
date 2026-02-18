import { useState, useCallback } from 'react';
import type { QuizQuestion } from '../../lib/demographicMapping';

interface QuizStepProps {
  question: QuizQuestion;
  value: string[] | string;
  onChange: (value: string[] | string) => void;
  stepNumber: number;
  totalSteps: number;
}

export default function QuizStep({ question, value, onChange, stepNumber, totalSteps }: QuizStepProps) {
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);

  const isMulti = question.maxSelect > 1;
  const selected: string[] = isMulti
    ? (Array.isArray(value) ? value : [])
    : (typeof value === 'string' && value ? [value] : []);

  const progressPct = (stepNumber / totalSteps) * 100;

  const handleToggle = useCallback((optValue: string) => {
    if (isMulti) {
      const arr = [...selected];
      const idx = arr.indexOf(optValue);
      if (idx >= 0) {
        // Deselect
        arr.splice(idx, 1);
        onChange(arr);
      } else if (arr.length < question.maxSelect) {
        // Select
        arr.push(optValue);
        onChange(arr);
      } else {
        // Max reached — shake
        setShakeIndex(question.options.findIndex(o => o.value === optValue));
        setTimeout(() => setShakeIndex(null), 500);
      }
    } else {
      // Single select — immediate
      onChange(optValue);
    }
  }, [isMulti, selected, question.maxSelect, question.options, onChange]);

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-400">שאלה {stepNumber} מתוך {totalSteps}</span>
          <span className="text-xs text-gray-400">{Math.round(progressPct)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-knesset-blue to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-2">
        <span className="text-4xl mb-3 block">{question.icon}</span>
        <h3 className="text-2xl font-black text-gray-900">{question.label}</h3>
        <p className="text-sm text-gray-400 mt-1">{question.subtitle}</p>
      </div>

      {/* Selection counter for multi-select */}
      {isMulti && (
        <div className="text-center mb-6">
          <span className={`text-sm font-bold px-3 py-1 rounded-full transition-colors ${
            selected.length === question.maxSelect
              ? 'bg-green-50 text-green-600'
              : selected.length > 0
              ? 'bg-blue-50 text-knesset-blue'
              : 'bg-gray-50 text-gray-400'
          }`}>
            {selected.length}/{question.maxSelect} נבחרו
          </span>
        </div>
      )}

      {/* Options grid */}
      <div className={`grid gap-3 ${
        question.options.length <= 3
          ? 'grid-cols-1 max-w-sm mx-auto'
          : question.options.length <= 6
          ? 'grid-cols-2'
          : 'grid-cols-2 md:grid-cols-3'
      }`}>
        {question.options.map((opt, idx) => {
          const isSelected = selected.includes(opt.value);
          const isShaking = shakeIndex === idx;

          return (
            <button
              key={opt.value}
              onClick={() => handleToggle(opt.value)}
              className={`
                px-4 py-3.5 rounded-2xl text-base font-bold transition-all duration-200 border-2
                flex items-center gap-2 justify-center
                ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}
                ${isSelected
                  ? 'bg-knesset-blue text-white border-knesset-blue shadow-lg shadow-blue-200 scale-[1.03]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-knesset-blue hover:bg-blue-50'
                }
              `}
            >
              <span className="text-lg">{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Shake animation keyframes via style tag */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}
