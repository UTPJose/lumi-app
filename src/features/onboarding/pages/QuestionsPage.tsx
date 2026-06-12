import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { AccessibleButton } from '../../../shared/components/buttons/AccessibleButton';
import { PageLayout } from '../../../shared/components/layouts/PageLayout';
import { storage } from '@/lib/storage';
import { CARD_STYLES } from '@/styles/tailwind-constants';

const QUESTIONS = [
  {
    id: 'time',
    question: '¿A qué hora prefieres comenzar tu día?',
    options: [
      { value: 'early', label: 'Temprano (6-8 AM)' },
      { value: 'mid', label: 'Media mañana (8-10 AM)' },
      { value: 'late', label: 'Más tarde (10-12 AM)' },
    ],
  },
  {
    id: 'energy',
    question: '¿Cómo describirías tu nivel de energía?',
    options: [
      { value: 'high', label: 'Alta energía' },
      { value: 'moderate', label: 'Energía moderada' },
      { value: 'low', label: 'Prefiero actividades tranquilas' },
    ],
  },
  {
    id: 'social',
    question: '¿Prefieres actividades...?',
    options: [
      { value: 'alone', label: 'Solo/a' },
      { value: 'mixed', label: 'Mixtas' },
      { value: 'social', label: 'Con otras personas' },
    ],
  },
];

export function QuestionsPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = QUESTIONS[currentQuestion];
  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      storage.set('routineAnswers', newAnswers);
      navigate('/create/generating');
    } else {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
      }, 300);
    }
  };

  return (
    <PageLayout>
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
              role="progressbar"
              aria-valuenow={(currentQuestion + 1 / QUESTIONS.length) * 100}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progreso de preguntas"
            />
          </div>
          <span className="text-muted-foreground">
            {currentQuestion + 1} / {QUESTIONS.length}
          </span>
        </div>

        <h1 className="mb-4">{question.question}</h1>
        <p className="text-muted-foreground">Selecciona la opción que mejor te describa.</p>
      </div>

      <div className="space-y-4">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className={`w-full min-h-[80px] p-6 rounded-2xl border-2 transition-all active:scale-98 flex items-center justify-between ${
              answers[question.id] === option.value
                ? 'bg-primary text-primary-foreground border-primary'
                : `${CARD_STYLES.white}`
            }`}
            aria-label={option.label}
          >
            <span className="text-left">{option.label}</span>
            <ChevronRight className="w-7 h-7 flex-shrink-0 ml-3" aria-hidden="true" />
          </button>
        ))}
      </div>

      {currentQuestion > 0 && (
        <AccessibleButton
          onClick={() => setCurrentQuestion((prev) => prev - 1)}
          variant="outline"
          fullWidth
        >
          Regresar
        </AccessibleButton>
      )}
    </PageLayout>
  );
}
