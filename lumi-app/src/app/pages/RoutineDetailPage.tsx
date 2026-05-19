import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Heart, Share2, Edit, ArrowLeft } from 'lucide-react';
import { ActivityCard } from '../components/ActivityCard';
import { AccessibleButton } from '../components/AccessibleButton';

interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  completed: boolean;
}

interface Routine {
  id: string;
  title: string;
  date: string;
  activities: Activity[];
}

export function RoutineDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [routine, setRoutine] = useState<Routine | null>(null);
  
  useEffect(() => {
    const routines = JSON.parse(localStorage.getItem('routines') || '[]');
    const found = routines.find((r: Routine) => r.id === id);
    setRoutine(found || null);
  }, [id]);
  
  const handleToggleActivity = (activityId: string) => {
    if (!routine) return;
    
    const updatedActivities = routine.activities.map(activity =>
      activity.id === activityId 
        ? { ...activity, completed: !activity.completed }
        : activity
    );
    
    const updatedRoutine = { ...routine, activities: updatedActivities };
    setRoutine(updatedRoutine);
    
    // Actualizar en localStorage
    const routines = JSON.parse(localStorage.getItem('routines') || '[]');
    const updatedRoutines = routines.map((r: Routine) => 
      r.id === id ? updatedRoutine : r
    );
    localStorage.setItem('routines', JSON.stringify(updatedRoutines));
  };
  
  const handleShare = () => {
    navigate('/share');
  };
  
  if (!routine) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="mb-4">Rutina no encontrada</h2>
          <AccessibleButton onClick={() => navigate('/library')} variant="primary">
            Volver a mis rutinas
          </AccessibleButton>
        </div>
      </div>
    );
  }
  
  const completedCount = routine.activities.filter(a => a.completed).length;
  const progress = (completedCount / routine.activities.length) * 100;
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-6 py-8 space-y-8">
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
        
        <div className="bg-white p-6 rounded-2xl border-2 border-border">
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
                onToggleComplete={() => handleToggleActivity(activity.id)}
              />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <AccessibleButton
            onClick={handleShare}
            variant="outline"
            icon={Share2}
          >
            Compartir
          </AccessibleButton>
          <AccessibleButton
            onClick={() => {}}
            variant="secondary"
            icon={Heart}
          >
            Guardar
          </AccessibleButton>
        </div>
        
        {progress === 100 && (
          <div className="bg-accent/20 p-6 rounded-2xl border-2 border-accent text-center">
            <h3 className="mb-2">🎉 ¡Felicitaciones!</h3>
            <p className="text-muted-foreground">
              Completaste todas las actividades del día. ¡Excelente trabajo!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
