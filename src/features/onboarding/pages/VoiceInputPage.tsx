import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mic, StopCircle } from 'lucide-react';
import { AccessibleButton } from '../../../shared/components/buttons/AccessibleButton';
import { PageLayout } from '../../../shared/components/layouts/PageLayout';
import { storage } from '@/lib/storage';
import { CARD_STYLES } from '@/styles/tailwind-constants';

export function VoiceInputPage() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setTranscript(
          'Me gustaría hacer ejercicios suaves por la mañana, leer un poco después del desayuno, y salir a caminar por la tarde.'
        );
      }, 3000);
    }
  };

  const handleContinue = () => {
    if (transcript) {
      storage.set('voiceInput', transcript);
      navigate('/create/generating');
    }
  };

  return (
    <PageLayout showNavigation={false}>
      <div>
        <h1 className="mb-3">Cuéntanos con tu voz</h1>
        <p className="text-muted-foreground">
          Describe qué actividades te gustaría incluir en tu rutina. Habla de forma natural y clara.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 space-y-8">
        <button
          onClick={handleToggleRecording}
          className={`w-40 h-40 rounded-full flex items-center justify-center transition-all ${
            isRecording ? 'bg-destructive animate-pulse' : 'bg-primary hover:opacity-90'
          }`}
          aria-label={isRecording ? 'Detener grabación' : 'Comenzar grabación'}
          aria-pressed={isRecording}
        >
          {isRecording ? (
            <StopCircle className="w-20 h-20 text-white" aria-hidden="true" />
          ) : (
            <Mic className="w-20 h-20 text-white" aria-hidden="true" />
          )}
        </button>

        <div className="text-center">
          <h3 className={isRecording ? 'text-destructive' : 'text-muted-foreground'}>
            {isRecording ? 'Grabando...' : 'Toca para comenzar'}
          </h3>
        </div>
      </div>

      {transcript && (
        <div className="bg-secondary p-6 rounded-2xl">
          <h4 className="mb-3">Escuchamos:</h4>
          <p className="text-foreground leading-relaxed">"{transcript}"</p>
        </div>
      )}

      <div className="space-y-4">
        <div className={`${CARD_STYLES.white} p-6 rounded-2xl border-2`}>
          <h4 className="mb-2">💡 Consejos:</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Habla en un lugar tranquilo</li>
            <li>• Menciona horarios si los tienes en mente</li>
            <li>• Incluye cualquier preferencia especial</li>
          </ul>
        </div>

        {transcript && (
          <AccessibleButton onClick={handleContinue} variant="primary" fullWidth>
            Generar rutina
          </AccessibleButton>
        )}

        <AccessibleButton
          onClick={() => navigate('/create')}
          variant="outline"
          fullWidth
        >
          Volver
        </AccessibleButton>
      </div>
    </PageLayout>
  );
}
