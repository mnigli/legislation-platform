import { useState, useMemo } from 'react';
import type { QuizQuestion } from '../../lib/demographicMapping';
import { ISRAELI_CITIES } from '../../lib/demographicMapping';

interface QuizStepProps {
  question: QuizQuestion;
  value: string;
  onChange: (value: string) => void;
  stepNumber: number;
  totalSteps: number;
}

export default function QuizStep({ question, value, onChange, stepNumber, totalSteps }: QuizStepProps) {
  const [cityInput, setCityInput] = useState(value || '');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCities = useMemo(() => {
    if (!cityInput || cityInput.length < 1) return ISRAELI_CITIES.slice(0, 8);
    return ISRAELI_CITIES.filter(c => c.includes(cityInput)).slice(0, 8);
  }, [cityInput]);

  const progressPct = (stepNumber / totalSteps) * 100;

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
      <div className="text-center mb-8">
        <span className="text-4xl mb-3 block">{question.icon}</span>
        <h3 className="text-2xl font-black text-gray-900">{question.label}</h3>
      </div>

      {/* Answer options */}
      {question.type === 'buttons' && question.options && (
        <div className={`grid gap-3 ${question.options.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`
                px-6 py-4 rounded-2xl text-lg font-bold transition-all duration-200 border-2
                ${value === opt.value
                  ? 'bg-knesset-blue text-white border-knesset-blue shadow-lg shadow-blue-200 scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-knesset-blue hover:bg-blue-50 hover:scale-102'
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {question.type === 'autocomplete' && (
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={cityInput}
            placeholder={question.placeholder}
            onChange={(e) => {
              setCityInput(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full px-6 py-4 rounded-2xl text-lg font-medium border-2 border-gray-200 focus:border-knesset-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all text-center"
          />
          {showDropdown && filteredCities.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setCityInput(city);
                    setShowDropdown(false);
                    onChange(city);
                  }}
                  className="w-full px-6 py-3 text-right hover:bg-blue-50 text-gray-700 font-medium transition-colors border-b border-gray-50 last:border-0"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
