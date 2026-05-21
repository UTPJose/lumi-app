import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router';
import { useAccessibility } from '../shared/context/AccessibilityContext';
import { useTextToSpeech } from './useTextToSpeech';

const INACTIVITY_TIMEOUT = 15000; // 15 seconds

export function useAutoPageReader() {
  const { settings } = useAccessibility();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const location = useLocation();
  const lastReadContentRef = useRef<string>('');
  const lastReadTimeRef = useRef<number>(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Extract all readable text from the page
  const extractPageContent = useCallback(() => {
    const textParts: string[] = [];

    // Get main heading (h1 or h2)
    const heading = document.querySelector('h1, h2');
    if (heading?.textContent?.trim()) {
      textParts.push(heading.textContent.trim());
    }

    // Get all visible text content from main content area
    // Exclude navigation, buttons, and accessibility panel
    const mainContent = document.body;
    const walker = document.createTreeWalker(
      mainContent,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node: Node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          // Exclude hidden elements
          const style = window.getComputedStyle(parent);
          if (style.display === 'none' || style.visibility === 'hidden') {
            return NodeFilter.FILTER_REJECT;
          }

          // Exclude accessibility panel and similar modals
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

    // Also get aria-label and title attributes from interactive elements
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

    // Join with pauses (periods indicate where to pause)
    return textParts.filter((p) => p && p.length > 0).join('. ');
  }, []);

  // Read the page content
  const readPage = useCallback(() => {
    if (settings.textToSpeech === 0) return;

    const content = extractPageContent();
    if (!content) return;

    // Avoid reading the same content twice in a row
    if (content === lastReadContentRef.current) return;

    lastReadContentRef.current = content;
    lastReadTimeRef.current = Date.now();

    console.log('🎤 Auto-reading page content');
    stop();
    setTimeout(() => {
      speak(content);
    }, 150);
  }, [settings.textToSpeech, extractPageContent, speak, stop]);

  // Reset inactivity timer on user interaction
  const resetInactivityTimer = useCallback(() => {
    if (settings.textToSpeech === 0) return;

    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Set new timer for 15 seconds
    inactivityTimerRef.current = setTimeout(() => {
      console.log('⏱️ 15 seconds of inactivity detected, re-reading page');
      readPage();
    }, INACTIVITY_TIMEOUT);
  }, [settings.textToSpeech, readPage]);

  // Add event listeners for user interaction
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

  // Read page on mount and on page/location change
  useEffect(() => {
    if (settings.textToSpeech === 0) {
      stop();
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      return;
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Limpiamos el último texto leído para forzar que lea la nueva página
      lastReadContentRef.current = '';
      readPage();
      resetInactivityTimer();
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname, settings.textToSpeech]);

  // Listen for DOM mutations (for dynamic content within same page)
  useEffect(() => {
    if (settings.textToSpeech === 0) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    const observer = new MutationObserver(() => {
      // Only read if content has changed and more than 2 seconds have passed
      const now = Date.now();
      if (now - lastReadTimeRef.current > 2000) {
        const currentContent = extractPageContent();
        if (currentContent !== lastReadContentRef.current) {
          readPage();
          resetInactivityTimer();
        }
      }
    });

    observerRef.current = observer;
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false,
    });

    return () => {
      observer.disconnect();
    };
  }, [settings.textToSpeech, extractPageContent, readPage, resetInactivityTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [stop]);
}
