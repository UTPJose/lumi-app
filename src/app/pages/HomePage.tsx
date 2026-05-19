import React from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, Calendar, Plus } from 'lucide-react';
import { AccessibleButton } from '../components/AccessibleButton';
import { BottomNavigation } from '../components/BottomNavigation';

export function HomePage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'amigo';
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="mb-2">Hola, {userName} 👋</h1>
          <p className="text-muted-foreground">
            ¿Qué te gustaría hacer hoy?
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/create')}
            className="w-full min-h-[140px] p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl hover:opacity-90 transition-all active:scale-98"
            aria-label="Crear nueva rutina"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-9 h-9" aria-hidden="true" />
              </div>
              <div className="text-left flex-1">
                <h3 className="mb-2 text-white">Crear rutina nueva</h3>
                <p className="text-white/90">Genera una rutina personalizada con inteligencia artificial</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/library')}
            className="w-full min-h-[140px] p-6 bg-white border-2 border-border rounded-2xl hover:border-primary/50 transition-all active:scale-98"
            aria-label="Ver mis rutinas guardadas"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-9 h-9 text-primary" aria-hidden="true" />
              </div>
              <div className="text-left flex-1">
                <h3 className="mb-2">Mis rutinas</h3>
                <p className="text-muted-foreground">Revisa y gestiona tus rutinas guardadas</p>
              </div>
            </div>
          </button>
        </div>
        
        <div className="bg-accent/20 p-6 rounded-2xl border-2 border-accent">
          <h4 className="mb-2">💡 Consejo del día</h4>
          <p className="text-muted-foreground">
            Comienza con actividades pequeñas y poco a poco aumenta la dificultad. ¡Lo importante es disfrutar el proceso!
          </p>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
