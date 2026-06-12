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

  // Función mejorada para inyectar texto (ahora soporta sobreescribir completamente)
  const injectTextToInput = (
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
  };

  // NUEVA FUNCIÓN: Analiza si la frase es una orden de rellenado directo
  const handleDirectInputFilling = (command: string): boolean => {
    // 1. Patrón para NOMBRE (Ej: "Mi nombre es Pablo", "Me llamo Juan", "Introducir nombre Carlos")
    const nameMatch = command.match(/(?:mi nombre es|me llamo|introducir nombre)\s+(.+)/i);
    if (nameMatch) {
      const nameValue = nameMatch[1].trim();
      
      // Busca de forma inteligente un input que se parezca a "nombre"
      const nameInput = document.querySelector(
        'input[placeholder*="nombre" i], input[aria-label*="nombre" i], input[id*="name" i], input[type="text"]'
      ) as HTMLInputElement;

      if (nameInput) {
        nameInput.focus(); // Lo enfocamos para dar feedback visual
        injectTextToInput(nameInput, nameValue, true); // true para sobreescribir lo que haya
        console.log(`✅ Rellenado campo nombre con: ${nameValue}`);
        return true; // Comando procesado con éxito
      }
    }

    // 2. Patrón para EDAD (Ej: "Mi edad es 25", "Tengo 30 años", "Introducir edad 18")
    const ageMatch = command.match(/(?:mi edad es|tengo|introducir edad)\s+(\d+)/i);
    if (ageMatch) {
      const ageValue = ageMatch[1].trim();

      // Busca de forma inteligente un input que se parezca a "edad" o que sea numérico
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

    return false; // No coincidió con ningún patrón de llenado directo
  };

  const handleVoiceCommand = (command: string) => {
    console.log('🎤 Voice transcript:', command);
    const cleanCommand = command.trim();
    const lowerCommand = cleanCommand.toLowerCase();

    // PASO 1: Intentar rellenado inteligente directo
    if (handleDirectInputFilling(cleanCommand)) {
      // TRUCO: Quitamos el foco de la caja (blur) para que el cursor no 
      // se quede atrapado adentro y el siguiente comando no se confunda con dictado.
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      return;
    }

    // PASO 2: ¡Prioridad a los botones! (Antes del dictado)
    // Si el usuario dice "Continuar", queremos presionar el botón, no escribirlo en un input.
    const pageCommands = extractVoiceCommands();
    const match = findBestMatch(cleanCommand, pageCommands);

    // Revisamos si es un comando global fuerte
    const isGlobalCommand = ['siguiente', 'next', 'anterior', 'previous', 'cerrar'].some(cmd => lowerCommand.includes(cmd));

    // Si coincide con un botón (confianza > 0.7) o es un comando global...
    if ((match && match.confidence > 0.7) || isGlobalCommand) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur(); // Salimos de cualquier input por seguridad
      }

      if (match && match.confidence > 0.7) {
        console.log(`✅ Ejecutando botón por voz:`, match.command.keywords[0]);
        match.command.action();
      } else {
        handleFallbackCommands(cleanCommand);
      }
      return;
    }

    // PASO 3: Si no fue una orden inteligente ni un botón, verificamos si 
    // el usuario dio clic manualmente en un input para hacer dictado libre.
    const focused = document.activeElement as HTMLElement;
    const isTextInput =
      focused &&
      (focused.tagName === 'TEXTAREA' ||
        (focused.tagName === 'INPUT' &&
          ['text', 'number', 'email', 'search', 'tel', 'url'].includes((focused as HTMLInputElement).type)));

    if (isTextInput) {
      // Seguro anti-crasheo: Evitamos meter letras en inputs numéricos
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

    // PASO 4: Fallback final (si no encajó en nada)
    handleFallbackCommands(cleanCommand);
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