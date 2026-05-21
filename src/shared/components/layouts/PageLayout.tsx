import React from 'react';
import { BottomNavigation } from '../navigation/BottomNavigation';
import { PAGE_LAYOUT } from '@/styles/tailwind-constants';
import { useAutoPageReader } from '../../../hooks/useAutoPageReader'; 
import { useInteractiveReader } from '../../../hooks/useInteractiveReader';


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
  // 2. Mantenemos el lector general
  useAutoPageReader();
  // 3. Añadimos el nuevo lector interactivo
  useInteractiveReader();
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
