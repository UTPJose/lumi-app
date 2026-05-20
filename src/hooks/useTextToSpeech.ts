import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '../shared/context/AccessibilityContext';

export function useTextToSpeech() {
  const { settings } = useAccessibility();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
  }, []);

  const speak = async (text: string) => {
    if (settings.textToSpeech === 0 || !text.trim()) return;

    const synth = synthRef.current;
    if (!synth) return;

    try {
      // Cancel any ongoing speech
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = 'es-ES';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('🎤 Speaking:', text.substring(0, 50));
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('✅ Speech ended');
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        console.error('Speech error:', event.error);
      };

      utteranceRef.current = utterance;
      synth.speak(utterance);
    } catch (error) {
      setIsSpeaking(false);
      console.error('TTS error:', error);
    }
  };

  const stop = () => {
    const synth = synthRef.current;
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return { speak, stop, isSpeaking };
}
