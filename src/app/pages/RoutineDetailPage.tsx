import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Heart, Share2, ArrowLeft } from 'lucide-react';
import { ActivityCard } from '../components/ActivityCard';
import { AccessibleButton } from '../components/AccessibleButton';
import { PageLayout } from '../components/layouts/PageLayout';
import { useRoutines } from '@/hooks/useRoutines';
import { CARD_STYLES } from '@/styles/tailwind-constants';

export function RoutineDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getRoutineById, toggleActivityCompleted, getCompletedActivitiesCount } = useRoutines();

  const routine = id ? getRoutineById(id) : null;

  if (!routine) {
    return (
      <PageLayout showNavigation={false}>
        <div className="text-center py-12">
          <h2 className="mb-4">Rutina no encontrada</h2>
          <AccessibleButton onClick={() => navigate('/library')} variant="primary">
            Volver a mis rutinas
          </AccessibleButton>
        </div>
      </PageLayout>
    );
  }

  const completedCount = getCompletedActivitiesCount(id!);
  const progress = (completedCount / routine.activities.length) * 100;

  return (
    <PageLayout showNavigation={false}>
      <div>
        <button
          onClick={() => navigate('/library')}
          className="flex items-center gap-2 text-primary mb-4 -ml-2 p-2 hover:bg-primary/10 rounded-xl transition-colors"
          aria-label="Volver a mis rutinas"
        >
          <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          <span>Volver</span>
        </button>

        <h1 className="mb-2">{routine.title}</h1>
        <p className="text-muted-foreground">{routine.date}</p>
      </div>

      <div className={`${CARD_STYLES.white} p-6`}>
        <div className="flex items-center justify-between mb-3">
          <h4>Progreso del día</h4>
          <span className="text-primary">
            {completedCount} / {routine.activities.length}
          </span>
        </div>
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso de actividades completadas"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4">Actividades</h3>
        <div className="space-y-4">
          {routine.activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              time={activity.time}
              title={activity.title}
              description={activity.description}
              completed={activity.completed}
              onToggleComplete={() => toggleActivityCompleted(id!, activity.id)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AccessibleButton onClick={() => navigate('/share')} variant="outline" icon={Share2}>
          Compartir
        </AccessibleButton>
        <AccessibleButton onClick={() => {}} variant="secondary" icon={Heart}>
          Guardar
        </AccessibleButton>
      </div>

      {progress === 100 && (
        <div className={`${CARD_STYLES.accent} p-6 text-center`}>
          <h3 className="mb-2">🎉 ¡Felicitaciones!</h3>
          <p className="text-muted-foreground">Completaste todas las actividades del día. ¡Excelente trabajo!</p>
        </div>
      )}
    </PageLayout>
  );
}
