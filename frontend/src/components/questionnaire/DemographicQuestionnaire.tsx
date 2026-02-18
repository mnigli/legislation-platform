import { useState, useEffect, useCallback } from 'react';
import { FiTarget } from 'react-icons/fi';
import QuizStep from './QuizStep';
import QuizResults from './QuizResults';
import {
  QUIZ_QUESTIONS,
  saveQuizAnswers,
  loadQuizAnswers,
  clearQuizAnswers,
} from '../../lib/demographicMapping';
import type { QuizAnswers } from '../../lib/demographicMapping';

const EMPTY_ANSWERS: QuizAnswers = {
  interests: [],
  lifeSituation: [],
  readingStyle: '',
};

export default function DemographicQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({ ...EMPTY_ANSWERS });
  const [isComplete, setIsComplete] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState<QuizAnswers | null>(null);

  // Load saved answers on mount
  useEffect(() => {
    const saved = loadQuizAnswers();
    if (saved) {
      setSavedAnswers(saved);
      setIsComplete(true);
    }
  }, []);

  const question = QUIZ_QUESTIONS[currentStep];
  const isSingleSelect = question?.maxSelect === 1;

  const handleAnswer = useCallback((value: string[] | string) => {
    const qId = question.id;
    const newAnswers = { ...answers };

    if (qId === 'interests') {
      newAnswers.interests = value as string[];
    } else if (qId === 'lifeSituation') {
      newAnswers.lifeSituation = value as string[];
    } else if (qId === 'readingStyle') {
      newAnswers.readingStyle = value as string;
    }

    setAnswers(newAnswers);

    // Auto-advance for single-select questions
    if (isSingleSelect && typeof value === 'string') {
      setTimeout(() => {
        if (currentStep < QUIZ_QUESTIONS.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          // Last question — complete
          saveQuizAnswers(newAnswers);
          setSavedAnswers(newAnswers);
          setIsComplete(true);
        }
      }, 300);
    }
  }, [question, answers, currentStep, isSingleSelect]);

  const handleNext = useCallback(() => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last question — complete
      saveQuizAnswers(answers);
      setSavedAnswers(answers);
      setIsComplete(true);
    }
  }, [currentStep, answers]);

  const handleRetake = useCallback(() => {
    clearQuizAnswers();
    setSavedAnswers(null);
    setIsComplete(false);
    setCurrentStep(0);
    setAnswers({ ...EMPTY_ANSWERS });
  }, []);

  // Current answer for the step
  const currentValue = question
    ? question.id === 'interests'
      ? answers.interests
      : question.id === 'lifeSituation'
      ? answers.lifeSituation
      : answers.readingStyle
    : '';

  // Check if current step has a valid selection
  const canAdvance = question
    ? question.id === 'interests'
      ? answers.interests.length > 0
      : question.id === 'lifeSituation'
      ? answers.lifeSituation.length > 0
      : !!answers.readingStyle
    : false;

  const displayAnswers = savedAnswers || answers;

  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 bg-knesset-blue rounded-xl flex items-center justify-center">
            <FiTarget className="text-white" size={20} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            {isComplete ? 'הצעות חוק בשבילך' : 'בואו נמצא את החקיקה שבאמת נוגעת אליך'}
          </h2>
        </div>
        {!isComplete && (
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            6 קליקים וזה הכל
          </p>
        )}
        {isComplete && (
          <p className="text-base text-gray-400 max-w-2xl mx-auto">
            נבחר לפי תחומי העניין ומצב החיים שסימנת. תמיד אפשר לשנות.
          </p>
        )}
      </div>

      {/* Content */}
      {isComplete ? (
        <QuizResults answers={displayAnswers} onRetake={handleRetake} />
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 md:p-12">
            <QuizStep
              question={question}
              value={currentValue}
              onChange={handleAnswer}
              stepNumber={currentStep + 1}
              totalSteps={QUIZ_QUESTIONS.length}
            />

            {/* Next button for multi-select questions */}
            {!isSingleSelect && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleNext}
                  disabled={!canAdvance}
                  className={`
                    px-8 py-3 rounded-2xl font-bold text-lg transition-all duration-200
                    ${canAdvance
                      ? 'bg-knesset-blue text-white hover:bg-blue-800 shadow-lg shadow-blue-200 hover:scale-105'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {currentStep === QUIZ_QUESTIONS.length - 1 ? 'הצג לי הצעות חוק שמתאימות לי' : 'המשך'}
                </button>
              </div>
            )}

            {/* Trust line */}
            <p className="text-center text-xs text-gray-400 mt-6">
              🔒 אפשר לשנות העדפות בכל רגע. ההצעות מוצגות לפי תחומי עניין שבחרת בלבד.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
