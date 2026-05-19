import React from 'react';
import { BottomNavigation } from '../BottomNavigation';
import { PAGE_LAYOUT } from '@/styles/tailwind-constants';

interface PageLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  containerClassName?: string;
  innerClassName?: string;
  title?: string;
}

export function PageLayout({
  children,
  showNavigation = true,
  containerClassName = '',
  innerClassName = '',
  title,
}: PageLayoutProps) {
  return (
    <div className={`${PAGE_LAYOUT.container} ${containerClassName}`}>
      <div className={`${PAGE_LAYOUT.inner} ${innerClassName}`}>
        {title && <h1 className={PAGE_LAYOUT.heading}>{title}</h1>}
        {children}
      </div>
      {showNavigation && <BottomNavigation />}
    </div>
  );
}
