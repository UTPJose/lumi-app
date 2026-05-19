import React from 'react';
import { useNavigate } from 'react-router';
import { MessageSquare, Mic } from 'lucide-react';
import { CardButton } from '../../../shared/components/buttons/CardButton';
import { PageLayout } from '../../../shared/components/layouts/PageLayout';

export function CreateRoutinePage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div>
        <h1 className="mb-3">Nueva rutina</h1>
        <p className="text-muted-foreground">Elige cómo te gustaría crear tu rutina personalizada.</p>
      </div>

      <div className="space-y-6">
        <CardButton
          icon={MessageSquare}
          title="Responder preguntas"
          description="Te haremos algunas preguntas sencillas para conocer tus preferencias"
          onClick={() => navigate('/create/questions')}
          variant="secondary"
          ariaLabel="Crear rutina respondiendo preguntas"
        />

        <CardButton
          icon={Mic}
          title="Usar mi voz"
          description="Cuéntanos con tus propias palabras qué actividades te gustaría hacer"
          onClick={() => navigate('/create/voice')}
          variant="secondary"
          ariaLabel="Crear rutina por voz"
        />
      </div>

      <div className="bg-secondary p-6 rounded-2xl">
        <p className="text-sm">
          💡 No te preocupes, podrás revisar y editar tu rutina antes de guardarla.
        </p>
      </div>
    </PageLayout>
  );
}
