import React from 'react';
import { RoutineCard } from '../../routines/components/RoutineCard';
import { PageLayout } from '../../../shared/components/layouts/PageLayout';
import { Plus, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AccessibleButton } from '../../../shared/components/buttons/AccessibleButton';
import { useRoutines } from '@/hooks/useRoutines';

export function SavedRoutinesPage() {
  const navigate = useNavigate();
  const { getSavedRoutines } = useRoutines();
  const savedRoutines = getSavedRoutines();

  return (
    <PageLayout>
      <div>
        <h1 className="mb-2">Rutinas guardadas</h1>
        <p className="text-muted-foreground">Tus rutinas favoritas marcadas para acceso rápido.</p>
      </div>

      {savedRoutines.length === 0 ? (
        <div className="text-center py-12 space-y-6">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Bookmark className="w-12 h-12 text-muted-foreground" aria-hidden="true" />
          </div>
          <div>
            <h3 className="mb-2">No hay rutinas guardadas</h3>
            <p className="text-muted-foreground">Guarda tus rutinas favoritas para accederlas rápidamente.</p>
          </div>
          <AccessibleButton
            onClick={() => navigate('/library')}
            variant="primary"
            icon={Bookmark}
          >
            Ver todas mis rutinas
          </AccessibleButton>
        </div>
      ) : (
        <div className="space-y-4">
          {savedRoutines.map((routine) => (
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
    </PageLayout>
  );
}
