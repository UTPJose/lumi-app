import React from 'react';
import { CheckCircle2, Circle, Pencil, Trash2, Check } from 'lucide-react';

interface ActivityCardProps {
  time: string;
  title: string;
  description: string;
  completed: boolean;
  onToggleComplete: () => void;
  isSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ActivityCard({
  time,
  title,
  description,
  completed,
  onToggleComplete,
  isSelectMode = false,
  isSelected = false,
  onToggleSelect,
  onEdit,
  onDelete,
}: ActivityCardProps) {
  if (isSelectMode) {
    return (
      <div
        className={`w-full min-h-[80px] p-5 rounded-2xl border-2 transition-all text-left ${
          isSelected
            ? 'bg-primary/5 border-primary'
            : 'bg-white border-border'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSelect}
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
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
            <div className="text-sm text-muted-foreground">{time}</div>
            <h4 className="truncate">{title}</h4>
          </div>

          <CheckCircle2
            className={`w-6 h-6 flex-shrink-0 ${completed ? 'text-accent' : 'text-muted-foreground'}`}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onToggleComplete}
      className={`
        w-full min-h-[120px] p-6 rounded-2xl border-2 transition-all active:scale-98 text-left
        ${completed
          ? 'bg-accent/20 border-accent'
          : 'bg-white border-border hover:border-primary/30'
        }
      `}
      aria-label={`${completed ? 'Marcar como pendiente' : 'Marcar como completada'} ${title}`}
      aria-pressed={completed}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 pt-1">
          {completed ? (
            <CheckCircle2 className="w-8 h-8 text-accent" aria-hidden="true" />
          ) : (
            <Circle className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-1">{time}</div>
          <h4 className={completed ? 'line-through opacity-70' : ''}>{title}</h4>
          <p className={`mt-2 ${completed ? 'line-through opacity-70' : ''}`}>{description}</p>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
              aria-label={`Editar ${title}`}
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
              aria-label={`Eliminar ${title}`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </button>
  );
}
