import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTarget } from 'react-icons/fi';
import QuizStep from './QuizStep';
import {
  QUIZ_QUESTIONS,
  saveQuizAnswers,
  loadQuizAnswers,
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
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const navigate = useNavigate();

  // Check if quiz was already completed — if so, show a "see results" link
  useEffect(() => {
    const saved = loadQuizAnswers();
    if (saved) {
      setAlreadyCompleted(true);
    }
  }, []);

  const question = QUIZ_QUESTIONS[currentStep];
  const isSingleSelect = question?.maxSelect === 1;

  const completeQuiz = useCallback((finalAnswers: QuizAnswers) => {
    saveQuizAnswers(finalAnswers);
    navigate('/results');
  }, [navigate]);

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
          completeQuiz(newAnswers);
        }
      }, 300);
    }
  }, [question, answers, currentStep, isSingleSelect, completeQuiz]);

  const handleNext = useCallback(() => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeQuiz(answers);
    }
  }, [currentStep, answers, completeQuiz]);

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

  // If already completed, show a link to results instead of the quiz
  if (alreadyCompleted) {
    return (
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-knesset-blue rounded-xl flex items-center justify-center">
              <FiTarget className="text-white" size={20} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              כבר ענית על השאלון!
            </h2>
          </div>
          <p className="text-base text-gray-500 max-w-2xl mx-auto mb-6">
            מצאנו לך הצעות חוק לפי ההעדפות שלך.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/results')}
              className="bg-knesset-blue text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors"
            >
              צפו בתוצאות
            </button>
            <button
              onClick={() => setAlreadyCompleted(false)}
              className="border border-gray-300 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              ענו שוב
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 bg-knesset-blue rounded-xl flex items-center justify-center">
            <FiTarget className="text-white" size={20} />
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-gray-900">
            בואו נמצא את החקיקה שבאמת נוגעת אליך
          </h2>
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          6 קליקים וזה הכל
        </p>
      </div>

      {/* Quiz */}
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
    </section>
  );
}
