import { useEffect, useRef, useState, useCallback } from 'react';
import { useAccessibility } from '../shared/context/AccessibilityContext';

let globalUtterance: SpeechSynthesisUtterance | null = null;

export function useTextToSpeech() {
  const { settings } = useAccessibility();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (settings.textToSpeech === 0 || !text.trim()) return;

    const synth = window.speechSynthesis;
    if (!synth) return;

    try {
      // Nota: Eliminamos el synth.cancel() que estaba aquí, ya que causaba un choque.
      // Ya estamos cancelando la voz correctamente con un retraso en useAutoPageReader.

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = 'es-ES';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('🎤 Speaking:', text.substring(0, 50) + '...');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('✅ Speech ended cleanly');
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        // Filtramos el molesto error "interrupted" para que no ensucie la consola
        // ya que nosotros mismos la interrumpimos al cambiar de página
        if (event.error !== 'interrupted') {
          console.error('Speech error:', event.error);
        }
      };

      // 2. Guardamos la locución en la variable global
      globalUtterance = utterance;
      
      synth.speak(utterance);
    } catch (error) {
      setIsSpeaking(false);
      console.error('TTS error:', error);
    }
  }, [settings.textToSpeech]);

  const stop = useCallback(() => {
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // 3. Eliminamos el useEffect que desmontaba (hacía stop) al salir.
  // Ahora useAutoPageReader es el único jefe que decide cuándo detener la voz,
  // evitando que React la corte por error.

  return { speak, stop, isSpeaking };
}








// const synthRef = useRef<SpeechSynthesis | null>(null);
// const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

//   useEffect(() => {
//     synthRef.current = window.speechSynthesis;
//   }, []);

//   const speak = async (text: string) => {
//     if (settings.textToSpeech === 0 || !text.trim()) return;

//     const synth = synthRef.current;
//     if (!synth) return;

//     try {
//       // Cancel any ongoing speech
//       synth.cancel();

//       const utterance = new SpeechSynthesisUtterance(text);

//       utterance.lang = 'es-ES';
//       utterance.rate = 1;
//       utterance.pitch = 1;
//       utterance.volume = 1;

//       utterance.onstart = () => {
//         setIsSpeaking(true);
//         console.log('🎤 Speaking:', text.substring(0, 50));
//       };

//       utterance.onend = () => {
//         setIsSpeaking(false);
//         console.log('✅ Speech ended');
//       };

//       utterance.onerror = (event) => {
//         setIsSpeaking(false);
//         console.error('Speech error:', event.error);
//       };

//       utteranceRef.current = utterance;
//       synth.speak(utterance);
//     } catch (error) {
//       setIsSpeaking(false);
//       console.error('TTS error:', error);
//     }
//   };

//   const stop = () => {
//     const synth = synthRef.current;
//     if (synth) {
//       synth.cancel();
//       setIsSpeaking(false);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       stop();
//     };
//   }, []);

//   return { speak, stop, isSpeaking };
// }
