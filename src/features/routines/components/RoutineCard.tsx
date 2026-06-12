import React from 'react';
import { Clock, Calendar, Heart, CheckCircle2, Trash2, Check } from 'lucide-react';
import { useNavigate } from 'react-router';

interface RoutineCardProps {
  id: string;
  title: string;
  date: string;
  activities: number;
  completedActivities?: number;
  saved?: boolean;
  isSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onDelete?: () => void;
}

export function RoutineCard({
  id,
  title,
  date,
  activities,
  completedActivities = 0,
  saved = false,
  isSelectMode = false,
  isSelected = false,
  onToggleSelect,
  onDelete,
}: RoutineCardProps) {
  const navigate = useNavigate();
  const progress = activities > 0 ? (completedActivities / activities) * 100 : 0;
  const isCompleted = progress === 100 && activities > 0;

  if (isSelectMode) {
    return (
      <div
        className={`w-full min-h-[140px] p-6 rounded-2xl border-2 transition-all text-left ${
          isSelected
            ? 'bg-primary/5 border-primary'
            : 'bg-white border-border'
        }`}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={onToggleSelect}
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all mt-1 ${
              isSelected
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border hover:border-primary/50'
            }`}
            aria-label={`Seleccionar ${title}`}
            aria-pressed={isSelected}
          >
            {isSelected && <Check className="w-4 h-4" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="flex-1 truncate">{title}</h3>
              {saved && (
                <Heart className="w-5 h-5 text-accent fill-accent flex-shrink-0" aria-label="Guardada como favorita" />
              )}
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span className="truncate">{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>{activities} actividad{activities !== 1 ? 'es' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={() => navigate(`/routine/${id}`)}
        className="w-full min-h-[140px] p-6 bg-white rounded-2xl border-2 border-border hover:border-primary/50 transition-all active:scale-98 text-left"
        aria-label={`Abrir rutina ${title}`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="flex-1 truncate">{title}</h3>
          {saved && (
            <Heart className="w-5 h-5 text-accent fill-accent flex-shrink-0" aria-label="Guardada como favorita" />
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span className="truncate">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>{activities} actividad{activities !== 1 ? 'es' : ''}</span>
            {completedActivities > 0 && (
              <span className="text-primary">
                · {completedActivities}/{activities}
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {activities > 0 && (
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isCompleted ? 'bg-accent' : 'bg-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {isCompleted && (
          <div className="flex items-center gap-2 mt-3 text-sm text-accent font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Completada</span>
          </div>
        )}
      </button>

      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          aria-label={`Eliminar ${title}`}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
