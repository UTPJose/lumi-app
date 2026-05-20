import { useEffect, useRef } from 'react';
import { useAccessibility } from '../shared/context/AccessibilityContext';
import { useSpeech } from './useSpeech';

export function useSpeechManager() {
  const { settings } = useAccessibility();
  const { speak, stop, isSpeaking } = useSpeech();
  const lastReadElementRef = useRef<Element | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Function to read heading
  const readHeading = () => {
    if (settings.textToSpeech === 0) return;

    const heading = document.querySelector('h1');
    if (heading && heading !== lastReadElementRef.current) {
      lastReadElementRef.current = heading;
      const text = heading.textContent?.trim();
      if (text) {
        console.log('Reading:', text);
        stop();
        speak(text, {
          rate: 0.9,
          pitch: 1,
          volume: 1,
          lang: 'es-ES',
        });
      }
    }
  };

  // Read initial heading when component mounts
  useEffect(() => {
    if (settings.textToSpeech === 1) {
      // Small delay to ensure DOM is ready
      setTimeout(readHeading, 500);
    }
  }, [settings.textToSpeech]);

  // Listen for page navigation changes
  useEffect(() => {
    if (settings.textToSpeech === 0) {
      stop();
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    const observer = new MutationObserver(() => {
      readHeading();
    });

    observerRef.current = observer;
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [settings.textToSpeech, speak, stop]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stop();
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [stop]);

  return {
    isSpeaking,
    speak,
  };
}

