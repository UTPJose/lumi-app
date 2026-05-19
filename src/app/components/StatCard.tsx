import React from 'react';
import { LucideIcon } from 'lucide-react';
import { CARD_STYLES, FLEX, TEXT } from '@/styles/tailwind-constants';

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  stat: number | string;
  label: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  iconColor,
  stat,
  label,
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`${CARD_STYLES.withPadding} ${CARD_STYLES.secondary} ${FLEX.center} flex-col text-center ${className}`}
    >
      <div className={`w-12 h-12 mb-3 ${iconColor} rounded-full ${FLEX.center}`}>
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <p className={`${TEXT.title} font-bold mb-1`}>{stat}</p>
      <p className={TEXT.caption}>{label}</p>
    </div>
  );
}
