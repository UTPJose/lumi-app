import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InterestCardProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export function InterestCard({ icon: Icon, label, selected, onToggle }: InterestCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        min-h-[120px] p-6 rounded-2xl border-3 flex flex-col items-center justify-center gap-3
        transition-all active:scale-95
        ${selected 
          ? 'bg-primary text-primary-foreground border-primary' 
          : 'bg-white text-foreground border-border hover:border-primary/50'
        }
      `}
      aria-pressed={selected}
      aria-label={`${selected ? 'Deseleccionar' : 'Seleccionar'} ${label}`}
    >
      <Icon className="w-12 h-12" aria-hidden="true" />
      <span className="text-center">{label}</span>
    </button>
  );
}
