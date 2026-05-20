import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { useAriaLive } from '../../hooks/useAriaLive';

interface AriaLiveContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AriaLiveContext = createContext<AriaLiveContextType | undefined>(undefined);

export function AriaLiveProvider({ children }: { children: ReactNode }) {
  const { announce, regionRef } = useAriaLive();

  return (
    <AriaLiveContext.Provider value={{ announce }}>
      {children}
      <div
        ref={regionRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      />
    </AriaLiveContext.Provider>
  );
}

export function useAriaLiveAnnounce() {
  const context = useContext(AriaLiveContext);
  if (!context) {
    throw new Error('useAriaLiveAnnounce must be used within AriaLiveProvider');
  }
  return context;
}
