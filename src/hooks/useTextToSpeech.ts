declare global {
  interface Window {
    responsiveVoice: {
      speak: (text: string, voice?: string, options?: any) => void;
      cancel: () => void;
      isPlaying: () => boolean;
    };
  }
}

import { useEffect, useState } from 'react';
import { useAccessibility } from '../shared/context/AccessibilityContext';

export function useTextToSpeech() {
  const { settings } = useAccessibility();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string) => {
    if (settings.textToSpeech === 0 || !window.responsiveVoice) return;

    console.log('Speaking:', text);
    setIsSpeaking(true);

    try {
      window.responsiveVoice.speak(text, 'Spanish Female', {
        onend: () => {
          setIsSpeaking(false);
          console.log('Speech ended');
        },
        onerror: () => {
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  const stop = () => {
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
      setIsSpeaking(false);
    }
  };

  return { speak, stop, isSpeaking };
}
