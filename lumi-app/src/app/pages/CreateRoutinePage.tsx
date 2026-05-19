import React from 'react';
import { useNavigate } from 'react-router';
import { MessageSquare, Mic } from 'lucide-react';
import { AccessibleButton } from '../components/AccessibleButton';
import { BottomNavigation } from '../components/BottomNavigation';

export function CreateRoutinePage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="mb-3">Nueva rutina</h1>
          <p className="text-muted-foreground">
            Elige cómo te gustaría crear tu rutina personalizada.
          </p>
        </div>
        
        <div className="space-y-6">
          <button
            onClick={() => navigate('/create/questions')}
            className="w-full min-h-[160px] p-8 bg-white border-3 border-border rounded-2xl hover:border-primary transition-all active:scale-98"
            aria-label="Crear rutina respondiendo preguntas"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-11 h-11 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="mb-2">Responder preguntas</h3>
                <p className="text-muted-foreground">
                  Te haremos algunas preguntas sencillas para conocer tus preferencias
                </p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/create/voice')}
            className="w-full min-h-[160px] p-8 bg-white border-3 border-border rounded-2xl hover:border-primary transition-all active:scale-98"
            aria-label="Crear rutina por voz"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 bg-accent/20 rounded-2xl flex items-center justify-center">
                <Mic className="w-11 h-11 text-accent" aria-hidden="true" />
              </div>
              <div>
                <h3 className="mb-2">Usar mi voz</h3>
                <p className="text-muted-foreground">
                  Cuéntanos con tus propias palabras qué actividades te gustaría hacer
                </p>
              </div>
            </div>
          </button>
        </div>
        
        <div className="bg-secondary p-6 rounded-2xl">
          <p className="text-sm">
            💡 No te preocupes, podrás revisar y editar tu rutina antes de guardarla.
          </p>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
