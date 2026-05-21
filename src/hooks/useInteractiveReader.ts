import { useEffect, useRef, useCallback } from 'react';
import { useAccessibility } from '../shared/context/AccessibilityContext';
import { useTextToSpeech } from './useTextToSpeech';

export function useInteractiveReader() {
  const { settings } = useAccessibility();
  const { speak, stop } = useTextToSpeech();
  
  // Guardamos el último elemento tocado para no repetir si toca el mismo dos veces
  const lastElementRef = useRef<HTMLElement | null>(null);
  // Temporizador para el recordatorio
  const reminderTimerRef = useRef<NodeJS.Timeout | null>(null);

  const announceElement = useCallback((element: HTMLElement) => {
    if (settings.textToSpeech === 0) return;

    let announcement = '';
    let reminderText = '';
    let reminderTime = 10000; // 10 segundos por defecto

    // Limpiamos el temporizador anterior
    if (reminderTimerRef.current) {
      clearTimeout(reminderTimerRef.current);
    }

    // 1. Identificar qué tipo de elemento es
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const type = element.getAttribute('type');
    
    // Extraer el texto o etiqueta del elemento
    const label = 
      element.getAttribute('aria-label') || 
      element.getAttribute('title') || 
      (element.labels && element.labels.length > 0 ? element.labels[0].textContent : null) || // Para inputs con <label>
      element.textContent?.trim();

    if (!label) return; // Si no tiene texto, no decimos nada

    // 2. Construir el mensaje según el tipo
    if (tagName === 'input' && (type === 'text' || type === 'number' || type === 'email')) {
      announcement = `Campo de texto: ${label}.`;
      reminderText = `Recuerde, está en el campo ${label}. Puede escribir su respuesta ahora.`;
      reminderTime = 15000; // Damos más tiempo para escribir (15s)
      
    } else if (tagName === 'button' || role === 'button') {
      announcement = `Botón: ${label}. Ha sido seleccionado`;
      // Los botones no suelen necesitar recordatorio a menos que sean muy complejos, 
      // pero podríamos poner uno de 10s.
      reminderText = `Aún tiene seleccionado el botón ${label}.`;
      
    } else if (tagName === 'select' || role === 'combobox') {
      announcement = `Lista de opciones: ${label}. Deslice para seleccionar.`;
      reminderText = `Puede elegir una opción para ${label}.`;
      reminderTime = 12000;
      
    } else if (tagName === 'a' || role === 'link') {
      announcement = `Enlace: ${label}.`;
      reminderText = `¿Desea ir a ${label}? Toque dos veces.`;
    } else {
       // Si es un contenedor genérico o texto interactivo
       announcement = label;
    }

    // 3. Hablar
    if (announcement) {
      stop(); // Detenemos cualquier lectura actual
      console.log('🗣️ Interacción:', announcement);
      
      // Pequeño delay para asegurar que el foco se asentó
      setTimeout(() => {
        speak(announcement);
      }, 100);

      // 4. Configurar el recordatorio si se queda quieto
      if (reminderText) {
        reminderTimerRef.current = setTimeout(() => {
          console.log('⏰ Recordatorio:', reminderText);
          speak(reminderText);
        }, reminderTime);
      }
    }

  }, [settings.textToSpeech, speak, stop]);

  // Event Listener para capturar cuando el usuario enfoca/toca un elemento
  useEffect(() => {
    if (settings.textToSpeech === 0) {
       if (reminderTimerRef.current) clearTimeout(reminderTimerRef.current);
       return;
    }

    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      
      // Evitar repetir si se dispara el foco en el mismo elemento
      if (target === lastElementRef.current) return;
      lastElementRef.current = target;

      announceElement(target);
    };

    const handleBlur = () => {
      // Si quita el dedo o el foco, limpiamos el temporizador
      if (reminderTimerRef.current) clearTimeout(reminderTimerRef.current);
      lastElementRef.current = null;
    };

    // Usamos 'focusin' en lugar de 'focus' porque 'focusin' burbujea (bubble) 
    // y podemos capturarlo en el document
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      if (reminderTimerRef.current) clearTimeout(reminderTimerRef.current);
    };
  }, [settings.textToSpeech, announceElement]);
}