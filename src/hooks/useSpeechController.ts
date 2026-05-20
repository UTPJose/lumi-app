import { useCallback } from 'react';
import { useAccessibility } from '../shared/context/AccessibilityContext';
import { useResponsiveVoice } from './useResponsiveVoice';

export function useSpeechController() {
  const { settings } = useAccessibility();
  const { speak, isSpeaking } = useResponsiveVoice();

  const playCurrentHeading = useCallback(() => {
    if (settings.textToSpeech === 0) {
      console.log('Text-to-speech is disabled');
      return;
    }

    const heading = document.querySelector('h1');
    const text = heading?.textContent?.trim();

    if (text) {
      console.log('Playing manually:', text);
      speak(text);
    }
  }, [settings.textToSpeech, speak]);

  return {
    playCurrentHeading,
    isSpeaking,
    isEnabled: settings.textToSpeech === 1,
  };
}

