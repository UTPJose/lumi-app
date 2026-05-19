import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface ActivityCardProps {
  time: string;
  title: string;
  description: string;
  completed: boolean;
  onToggleComplete: () => void;
}

export function ActivityCard({ time, title, description, completed, onToggleComplete }: ActivityCardProps) {
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
      </div>
    </button>
  );
}
