import { useState, useEffect } from 'react';
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

export default function DemographicQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
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

  const handleAnswer = (value: string) => {
    const question = QUIZ_QUESTIONS[currentStep];
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentStep < QUIZ_QUESTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Quiz complete
        const fullAnswers = newAnswers as QuizAnswers;
        saveQuizAnswers(fullAnswers);
        setSavedAnswers(fullAnswers);
        setIsComplete(true);
      }
    }, 300);
  };

  const handleRetake = () => {
    clearQuizAnswers();
    setSavedAnswers(null);
    setIsComplete(false);
    setCurrentStep(0);
    setAnswers({});
  };

  const displayAnswers = savedAnswers || (answers as QuizAnswers);

  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 bg-knesset-blue rounded-xl flex items-center justify-center">
            <FiTarget className="text-white" size={20} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            {isComplete ? 'הצעות חוק רלוונטיות עבורך' : 'גלו איזו חקיקה רלוונטית עבורכם'}
          </h2>
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          {isComplete
            ? 'על סמך הפרופיל שלך, אלו הצעות החוק שהכי רלוונטיות עבורך'
            : 'ענו על 4 שאלות קצרות ונמצא את הצעות החוק שהכי משפיעות עליכם'
          }
        </p>
      </div>

      {/* Content */}
      {isComplete ? (
        <QuizResults answers={displayAnswers} onRetake={handleRetake} />
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 md:p-12">
            <QuizStep
              question={QUIZ_QUESTIONS[currentStep]}
              value={answers[QUIZ_QUESTIONS[currentStep].id] || ''}
              onChange={handleAnswer}
              stepNumber={currentStep + 1}
              totalSteps={QUIZ_QUESTIONS.length}
            />
          </div>
        </div>
      )}
    </section>
  );
}
