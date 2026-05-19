import React, { useState, useEffect } from 'react';
import { RoutineCard } from '../components/RoutineCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AccessibleButton } from '../components/AccessibleButton';

interface Routine {
  id: string;
  title: string;
  date: string;
  activities: any[];
}

export function LibraryPage() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Routine[]>([]);
  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('routines') || '[]');
    setRoutines(stored);
  }, []);
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="mb-2">Mis rutinas</h1>
          <p className="text-muted-foreground">
            Todas tus rutinas guardadas en un solo lugar.
          </p>
        </div>
        
        {routines.length === 0 ? (
          <div className="text-center py-12 space-y-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Plus className="w-12 h-12 text-muted-foreground" aria-hidden="true" />
            </div>
            <div>
              <h3 className="mb-2">No hay rutinas guardadas</h3>
              <p className="text-muted-foreground">
                Crea tu primera rutina para comenzar.
              </p>
            </div>
            <AccessibleButton
              onClick={() => navigate('/create')}
              variant="primary"
              icon={Plus}
            >
              Crear rutina
            </AccessibleButton>
          </div>
        ) : (
          <div className="space-y-4">
            {routines.map((routine) => (
              <RoutineCard
                key={routine.id}
                id={routine.id}
                title={routine.title}
                date={routine.date}
                activities={routine.activities.length}
              />
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}
