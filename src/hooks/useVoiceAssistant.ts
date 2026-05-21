declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '../shared/context/AccessibilityContext';
import { extractVoiceCommands, findBestMatch } from '../utils/voiceCommandExtractor';

export function useVoiceAssistant() {
  const { settings } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const interimTranscriptRef = useRef('');

  useEffect(() => {
    if (!settings.voiceAssistant) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    recognition.onstart = () => {
      console.log('🎤 Voice Assistant: Listening...');
      setIsListening(true);
      interimTranscriptRef.current = '';
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          handleVoiceCommand(transcript);
          setTranscript(transcript);
        } else {
          interim += transcript;
        }
      }
      interimTranscriptRef.current = interim;
    };

    recognition.onerror = (event: any) => {
      console.error('🎤 Voice error:', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (settings.voiceAssistant) {
        setTimeout(() => recognition.start(), 1000);
      }
    };

    recognition.start();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [settings.voiceAssistant]);

  const handleVoiceCommand = (command: string) => {
    console.log('🎤 Voice transcript:', command);

    const pageCommands = extractVoiceCommands();
    const match = findBestMatch(command, pageCommands);

    if (match && match.confidence > 0.6) {
      console.log(`✅ Matched command with confidence ${(match.confidence * 100).toFixed(1)}%:`, match.command.keywords[0]);
      match.command.action();
      return;
    }

    handleFallbackCommands(command);
  };

  const handleFallbackCommands = (command: string) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('siguiente') || lowerCommand.includes('next')) {
      focusNextElement();
    } else if (lowerCommand.includes('anterior') || lowerCommand.includes('previous')) {
      focusPrevElement();
    } else if (
      lowerCommand.includes('click') ||
      lowerCommand.includes('seleccionar') ||
      lowerCommand.includes('activar')
    ) {
      const focused = document.activeElement as HTMLElement;
      if (focused) focused.click();
    } else if (lowerCommand.includes('cerrar')) {
      const closeButton = document.querySelector('[aria-label*="Cerrar"]') as HTMLElement;
      if (closeButton) closeButton.click();
    } else {
      console.log('❌ No matching command found');
    }
  };

  const focusNextElement = () => {
    const focusableElements = Array.from(
      document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
  };

  const focusPrevElement = () => {
    const focusableElements = Array.from(
      document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    const prevIndex = currentIndex - 1 < 0 ? focusableElements.length - 1 : currentIndex - 1;
    focusableElements[prevIndex]?.focus();
  };

  return { isListening, transcript };
}
