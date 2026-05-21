import React, { useState } from 'react';
import { PersonStanding } from 'lucide-react';
import { AccessibilityPanel } from './AccessibilityPanel';

export function AccessibilityButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Abrir panel de accesibilidad"
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center"
      >
        <PersonStanding size={36} />
      </button>

      {/* Accessibility panel */}
      <AccessibilityPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
