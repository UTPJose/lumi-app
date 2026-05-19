import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';

interface RoutineCardProps {
  id: string;
  title: string;
  date: string;
  activities: number;
}

export function RoutineCard({ id, title, date, activities }: RoutineCardProps) {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(`/routine/${id}`)}
      className="w-full min-h-[140px] p-6 bg-white rounded-2xl border-2 border-border hover:border-primary/50 transition-all active:scale-98 text-left"
      aria-label={`Abrir rutina ${title}`}
    >
      <h3 className="mb-3">{title}</h3>
      <div className="flex flex-col gap-2 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6" aria-hidden="true" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6" aria-hidden="true" />
          <span>{activities} actividades</span>
        </div>
      </div>
    </button>
  );
}
