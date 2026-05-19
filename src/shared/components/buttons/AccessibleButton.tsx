import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  icon?: LucideIcon;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  'aria-label'?: string;
}

export function AccessibleButton({
  children,
  onClick,
  variant = 'primary',
  icon: Icon,
  fullWidth = false,
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel,
}: AccessibleButtonProps) {
  const baseClasses = 'min-h-[60px] px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90 active:scale-98',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-98',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 active:scale-98',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90 active:scale-98',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      {Icon && <Icon className="w-7 h-7" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}