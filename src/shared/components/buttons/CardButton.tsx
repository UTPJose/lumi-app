import React from 'react';
import { LucideIcon } from 'lucide-react';
import { CARD_STYLES, FLEX, combineClasses } from '@/styles/tailwind-constants';

interface CardButtonProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  ariaLabel?: string;
  className?: string;
}

export function CardButton({
  icon: Icon,
  title,
  description,
  onClick,
  variant = 'secondary',
  ariaLabel,
  className = '',
}: CardButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground',
    secondary: `${CARD_STYLES.white} bg-white`,
    accent: `${CARD_STYLES.accent}`,
  };

  return (
    <button
      onClick={onClick}
      className={combineClasses(
        'w-full min-h-[140px] p-6 rounded-2xl hover:opacity-90 transition-all active:scale-98',
        variantClasses[variant],
        className
      )}
      aria-label={ariaLabel}
    >
      <div className={`${FLEX.startCenter} gap-4`}>
        {Icon && (
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Icon className="w-9 h-9" aria-hidden="true" />
          </div>
        )}
        <div className="text-left flex-1">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  );
}
