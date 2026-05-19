import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles } from 'lucide-react';
import { useRoutines } from '@/hooks/useRoutines';
import { CARD_STYLES } from '@/styles/tailwind-constants';
import { Routine } from '@/types';

export function GeneratingPage() {
  const navigate = useNavigate();
  const { routines, addRoutine } = useRoutines();

  useEffect(() => {
    const timer = setTimeout(() => {
      const newRoutine: Routine = {
        id: Date.now().toString(),
        title: 'Mi rutina personalizada',
        date: new Date().toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        activities: [
          {
            id: '1',
            time: '8:00 AM',
            title: 'Despertar y estiramientos',
            description: 'Ejercicios suaves para comenzar el día con energía',
            completed: false,
          },
          {
            id: '2',
            time: '9:00 AM',
            title: 'Desayuno saludable',
            description: 'Prepara tu desayuno favorito con calma',
            completed: false,
          },
          {
            id: '3',
            time: '10:00 AM',
            title: 'Lectura',
            description: 'Dedica 30 minutos a leer algo que disfrutes',
            completed: false,
          },
          {
            id: '4',
            time: '12:00 PM',
            title: 'Preparar el almuerzo',
            description: 'Cocina una receta que te guste',
            completed: false,
          },
          {
            id: '5',
            time: '4:00 PM',
            title: 'Caminata',
            description: 'Sal a caminar 20-30 minutos al aire libre',
            completed: false,
          },
          {
            id: '6',
            time: '6:00 PM',
            title: 'Tiempo social',
            description: 'Llama a un amigo o familiar para conversar',
            completed: false,
          },
        ],
      };

      addRoutine(newRoutine);
      navigate(`/routine/${newRoutine.id}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, addRoutine]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Sparkles className="w-16 h-16 text-primary-foreground" aria-hidden="true" />
        </div>

        <div>
          <h1 className="mb-4">Creando tu rutina...</h1>
          <p className="text-muted-foreground text-xl">
            Estamos personalizando las mejores actividades para ti.
          </p>
        </div>

        <div className={`${CARD_STYLES.white} p-6 rounded-2xl`}>
          <p className="text-lg">✨ Solo tomará unos segundos</p>
        </div>
      </div>
    </div>
  );
}
