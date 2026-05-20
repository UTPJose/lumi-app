import { useEffect, useRef } from 'react';
import { useAriaLiveAnnounce } from '../../context/AriaLiveContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export function PageAnnouncementManager() {
  const { announce } = useAriaLiveAnnounce();
  const { settings } = useAccessibility();
  const lastHeadingRef = useRef<string>('');

  useEffect(() => {
    if (settings.textToSpeech === 0) return;

    const announcePageContent = () => {
      const heading = document.querySelector('h1, h2');
      if (heading?.textContent) {
        const text = heading.textContent.trim();

        // Solo anunciar si el contenido cambió
        if (text !== lastHeadingRef.current) {
          lastHeadingRef.current = text;
          announce(text, 'polite');
        }
      }
    };

    // Announce on initial load
    setTimeout(announcePageContent, 500);

    // Watch for page changes (pero sin loop infinito)
    const observer = new MutationObserver(announcePageContent);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [settings.textToSpeech, announce]);

  return null;
}

