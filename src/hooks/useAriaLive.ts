import { useEffect, useRef } from 'react';
import { useAccessibility } from '../shared/context/AccessibilityContext';

export function useAriaLive() {
  const { settings } = useAccessibility();
  const regionRef = useRef<HTMLDivElement>(null);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (settings.textToSpeech === 0 || !regionRef.current) return;

    console.log(`📢 Announcing: ${message}`);

    // Clear and set new message
    regionRef.current.textContent = '';
    setTimeout(() => {
      if (regionRef.current) {
        regionRef.current.textContent = message;
      }
    }, 100);
  };

  return { announce, regionRef };
}
