import { useEffect, useState } from 'react';
import { useAccessibility } from '../shared/context/AccessibilityContext';

export function useSpeechSynthesis() {
  const { settings } = useAccessibility();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    setIsSupported(supported);

    if (!supported) {
      console.warn('❌ Speech Synthesis not supported in this browser');
      return;
    }

    // Load available voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      console.log('✅ Voices loaded:', voices.length);
      voices.forEach(v => console.log(`  - ${v.name} (${v.lang})`));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (text: string) => {
    if (settings.textToSpeech === 0) {
      console.log('🔇 Text-to-speech disabled');
      return;
    }

    if (!isSupported) {
      console.error('❌ Speech Synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to find Spanish voice
    const spanishVoice = availableVoices.find(v => v.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
      console.log('🎤 Using voice:', spanishVoice.name);
    } else if (availableVoices.length > 0) {
      utterance.voice = availableVoices[0];
      console.log('🎤 Spanish voice not found, using:', availableVoices[0].name);
    } else {
      console.warn('⚠️ No voices available');
    }

    utterance.onstart = () => {
      console.log('▶️ Speaking:', text);
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('⏹️ Speech ended');
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('❌ Speech error:', event.error);
      setIsSpeaking(false);
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('❌ Failed to speak:', error);
      setIsSpeaking(false);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { speak, stop, isSpeaking, isSupported, voicesCount: availableVoices.length };
}
