import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router';
import { useAccessibility } from '../shared/context/AccessibilityContext';
import { useTextToSpeech } from './useTextToSpeech';

// 1. Cambiamos el tiempo de espera a 40 segundos (40,000 milisegundos)
const INACTIVITY_TIMEOUT = 25000; 

export function useAutoPageReader() {
  const { settings } = useAccessibility();
  const { speak, stop } = useTextToSpeech();
  const location = useLocation();
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Extrae el texto limpio de la página
  const extractPageContent = useCallback(() => {
    const textParts: string[] = [];

    // ❌ Se eliminó la captura manual del H1/H2 que causaba la doble lectura.
    // Ahora solo usamos el TreeWalker que respeta el orden natural de la página.

    const mainContent = document.body;
    const walker = document.createTreeWalker(
      mainContent,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node: Node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          // Ignorar elementos ocultos
          const style = window.getComputedStyle(parent);
          if (style.display === 'none' || style.visibility === 'hidden') {
            return NodeFilter.FILTER_REJECT;
          }

          // Ignorar el propio panel de accesibilidad o ventanas emergentes
          if (
            parent.closest('[role="dialog"]') ||
            parent.closest('.z-50') ||
            parent.classList.contains('accessibility-panel')
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          const text = node.textContent?.trim();
          return text && text.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        },
      },
      false
    );

    const textNodes = new Set<string>();
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      const text = currentNode.textContent?.trim();
      if (text && text.length > 1 && !textNodes.has(text)) {
        textNodes.add(text);
        textParts.push(text);
      }
    }

    // Obtener etiquetas ocultas (aria-label) de botones/inputs solo si no están ya leídas
    const interactiveElements = document.querySelectorAll(
      'button, [role="button"], input, select, textarea, a'
    );
    interactiveElements.forEach((elem) => {
      const ariaLabel = elem.getAttribute('aria-label');
      const title = elem.getAttribute('title');
      const label = ariaLabel || title;
      if (label && !textParts.includes(label)) {
        textParts.push(label);
      }
    });

    return textParts.filter((p) => p && p.length > 0).join('. ');
  }, []);

  // Función principal que manda a hablar
  const readPage = useCallback(() => {
    if (settings.textToSpeech === 0) return;

    const content = extractPageContent();
    if (!content) return;

    console.log('🎤 Auto-reading page content');
    stop();
    setTimeout(() => {
      speak(content);
    }, 150);
  }, [settings.textToSpeech, extractPageContent, speak, stop]);

  // Reinicia el reloj de 40 segundos
  const resetInactivityTimer = useCallback(() => {
    if (settings.textToSpeech === 0) return;

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      console.log('⏱️ 25 seconds of inactivity detected, re-reading page');
      readPage();
    }, INACTIVITY_TIMEOUT);
  }, [settings.textToSpeech, readPage]);

  // Escuchar interacciones SOLO para reiniciar el reloj de 40s (sin volver a leer al instante)
  useEffect(() => {
    if (settings.textToSpeech === 0) return;

    const interactionEvents = ['click', 'keydown', 'scroll', 'touchstart', 'wheel'];
    const handleInteraction = () => {
      resetInactivityTimer();
    };

    interactionEvents.forEach((event) => {
      document.addEventListener(event, handleInteraction);
    });

    return () => {
      interactionEvents.forEach((event) => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [settings.textToSpeech, resetInactivityTimer]);

  // Disparador principal: Cuando cambias de página o ENCIENDES el interruptor
  useEffect(() => {
    if (settings.textToSpeech === 0) {
      // Si se apaga, detiene la voz inmediatamente
      stop();
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      return;
    }

    // Le da un pequeñísimo respiro de medio segundo al navegador y lee
    const timer = setTimeout(() => {
      readPage();
      resetInactivityTimer();
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname, settings.textToSpeech]); 

  // Limpieza de seguridad al cerrar el componente
  useEffect(() => {
    return () => {
      stop();
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [stop]);
}
