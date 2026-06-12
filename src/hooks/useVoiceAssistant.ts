import { useEffect, useRef, useState, useCallback } from 'react';
import { useAccessibility } from '../shared/context/AccessibilityContext';
import { extractVoiceCommands, findBestMatch } from '../utils/voiceCommandExtractor';
import { acquire, release } from '../services/speechRecognitionManager';

export function useVoiceAssistant() {
  const { settings } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const interimTranscriptRef = useRef('');
  const shouldRestartRef = useRef(false);

  // Keep a ref to handleVoiceCommand so the manager callback is always current
  const handleVoiceCommandRef = useRef<(text: string) => void>(() => {});

  const injectTextToInput = useCallback((
    input: HTMLInputElement | HTMLTextAreaElement,
    text: string,
    overwrite = false
  ) => {
    let targetText = '';

    if (overwrite) {
      targetText = text.trim();
    } else {
      const lowerText = text.toLowerCase().trim();
      if (lowerText === 'borrar' || lowerText === 'borrar todo' || lowerText === 'limpiar') {
        targetText = '';
      } else {
        targetText = input.value ? `${input.value} ${text.trim()}` : text.trim();
      }
    }

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;

    if (input.tagName === 'INPUT' && nativeInputValueSetter) {
      nativeInputValueSetter.call(input, targetText);
    } else if (input.tagName === 'TEXTAREA' && nativeTextAreaValueSetter) {
      nativeTextAreaValueSetter.call(input, targetText);
    } else {
      input.value = targetText;
    }

    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, []);

  const handleDirectInputFilling = useCallback((command: string): boolean => {
    const nameMatch = command.match(/(?:mi nombre es|me llamo|introducir nombre)\s+(.+)/i);
    if (nameMatch) {
      const nameValue = nameMatch[1].trim();
      const nameInput = document.querySelector(
        'input[placeholder*="nombre" i], input[aria-label*="nombre" i], input[id*="name" i], input[type="text"]'
      ) as HTMLInputElement;

      if (nameInput) {
        nameInput.focus();
        injectTextToInput(nameInput, nameValue, true);
        console.log(`✅ Rellenado campo nombre con: ${nameValue}`);
        return true;
      }
    }

    const ageMatch = command.match(/(?:mi edad es|tengo|introducir edad)\s+(\d+)/i);
    if (ageMatch) {
      const ageValue = ageMatch[1].trim();
      const ageInput = document.querySelector(
        'input[placeholder*="edad" i], input[aria-label*="edad" i], input[type="number"], input[id*="age" i]'
      ) as HTMLInputElement;

      if (ageInput) {
        ageInput.focus();
        injectTextToInput(ageInput, ageValue, true);
        console.log(`✅ Rellenado campo edad con: ${ageValue}`);
        return true;
      }
    }

    return false;
  }, [injectTextToInput]);

  const focusNextElement = useCallback(() => {
    const focusableElements = Array.from(
      document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ) as HTMLElement[];
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
  }, []);

  const focusPrevElement = useCallback(() => {
    const focusableElements = Array.from(
      document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ) as HTMLElement[];
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    const prevIndex = currentIndex - 1 < 0 ? focusableElements.length - 1 : currentIndex - 1;
    focusableElements[prevIndex]?.focus();
  }, []);

  const handleFallbackCommands = useCallback((command: string) => {
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
  }, [focusNextElement, focusPrevElement]);

  const handleVoiceCommand = useCallback((command: string) => {
    console.log('🎤 Voice transcript:', command);
    const cleanCommand = command.trim();
    const lowerCommand = cleanCommand.toLowerCase();

    if (handleDirectInputFilling(cleanCommand)) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      return;
    }

    const pageCommands = extractVoiceCommands();
    const match = findBestMatch(cleanCommand, pageCommands);
    const isGlobalCommand = ['siguiente', 'next', 'anterior', 'previous', 'cerrar'].some(cmd => lowerCommand.includes(cmd));

    if ((match && match.confidence > 0.7) || isGlobalCommand) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      if (match && match.confidence > 0.7) {
        console.log(`✅ Ejecutando botón por voz:`, match.command.keywords[0]);
        match.command.action();
      } else {
        handleFallbackCommands(cleanCommand);
      }
      return;
    }

    const focused = document.activeElement as HTMLElement;
    const isTextInput =
      focused &&
      (focused.tagName === 'TEXTAREA' ||
        (focused.tagName === 'INPUT' &&
          ['text', 'number', 'email', 'search', 'tel', 'url'].includes((focused as HTMLInputElement).type)));

    if (isTextInput) {
      if ((focused as HTMLInputElement).type === 'number') {
        const isNumber = !isNaN(Number(cleanCommand));
        const isBorrar = ['borrar', 'borrar todo', 'limpiar'].includes(lowerCommand);
        if (!isNumber && !isBorrar) {
          console.log('⚠️ Ignorando dictado: Se intentó ingresar texto en un campo numérico.');
          return;
        }
      }
      injectTextToInput(focused as HTMLInputElement | HTMLTextAreaElement, cleanCommand, false);
      return;
    }

    handleFallbackCommands(cleanCommand);
  }, [handleDirectInputFilling, injectTextToInput, handleFallbackCommands]);

  // Keep ref updated
  handleVoiceCommandRef.current = handleVoiceCommand;

  useEffect(() => {
    if (!settings.voiceAssistant) {
      shouldRestartRef.current = false;
      release('assistant');
      setIsListening(false);
      return;
    }

    shouldRestartRef.current = true;

    const tryAcquire = () => {
      if (!shouldRestartRef.current || !settings.voiceAssistant) return;

      acquire('assistant', {
        onResult: (text, isFinal) => {
          if (isFinal) {
            handleVoiceCommandRef.current(text);
            setTranscript(text);
          }
        },
        onEnd: () => {
          setIsListening(false);
          if (shouldRestartRef.current) {
            setTimeout(tryAcquire, 500);
          }
        },
        onError: (error) => {
          console.error('🎤 Voice error:', error);
        },
      });

      setIsListening(true);
    };

    tryAcquire();

    return () => {
      shouldRestartRef.current = false;
      release('assistant');
    };
  }, [settings.voiceAssistant]);

  return { isListening, transcript };
}
