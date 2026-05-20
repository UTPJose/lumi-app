import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { CARD_STYLES, TEXT } from '@/styles/tailwind-constants';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Accesibilidad</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar panel de accesibilidad"
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 pb-8">
          {/* Text Size Card */}
          <AccessibilityCard
            title="Tamaño de texto"
            description="Elige un tamaño cómodo para leer"
            levels={['Normal', 'Grande', 'Muy grande', 'Máximo']}
            currentLevel={settings.textSize}
            onChange={(level) => {
              const nextLevel = (level + 1) % 4;
              updateSetting('textSize', nextLevel);
            }}
          />

          {/* Contrast Card */}
          <AccessibilityCard
            title="Contraste"
            description="Mejora la visibilidad de los elementos"
            levels={['Normal', 'Invertido', 'Escala de grises']}
            currentLevel={settings.contrast}
            onChange={(level) => {
              const nextLevel = (level + 1) % 3;
              updateSetting('contrast', nextLevel);
            }}
          />

          {/* Dyslexia Friendly Card */}
          <AccessibilityCard
            title="Fuente amigable para dislexia"
            description="Aumenta el espacio entre letras"
            levels={['Normal', 'Separado', 'Muy separado']}
            currentLevel={settings.dyslexiaFriendly}
            onChange={(level) => {
              const nextLevel = (level + 1) % 3;
              updateSetting('dyslexiaFriendly', nextLevel);
            }}
          />

          {/* Line Height Card */}
          <AccessibilityCard
            title="Interlineado"
            description="Aumenta el espacio entre líneas"
            levels={['Normal', 'Amplio', 'Muy amplio']}
            currentLevel={settings.lineHeight}
            onChange={(level) => {
              const nextLevel = (level + 1) % 3;
              updateSetting('lineHeight', nextLevel);
            }}
          />

          {/* Button Size Card */}
          <AccessibilityCard
            title="Tamaño de botones"
            description="Aumenta el tamaño de los elementos"
            levels={['Normal', 'Grande', 'Muy grande']}
            currentLevel={settings.buttonSize}
            onChange={(level) => {
              const nextLevel = (level + 1) % 3;
              updateSetting('buttonSize', nextLevel);
            }}
          />

          {/* Reset Button */}
          <button
            onClick={resetSettings}
            className={`w-full ${CARD_STYLES.base} ${CARD_STYLES.white} p-4 text-center font-semibold text-muted-foreground hover:text-foreground transition-colors`}
          >
            Restablecer configuración
          </button>
        </div>
      </div>
    </>
  );
}

interface AccessibilityCardProps {
  title: string;
  description: string;
  levels: string[];
  currentLevel: number;
  onChange: (level: number) => void;
}

function AccessibilityCard({
  title,
  description,
  levels,
  currentLevel,
  onChange,
}: AccessibilityCardProps) {
  return (
    <button
      onClick={() => onChange(currentLevel)}
      className={`w-full ${CARD_STYLES.base} ${CARD_STYLES.white} p-6 text-left transition-all hover:shadow-md active:scale-98`}
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>

      {/* Level indicator */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((currentLevel + 1) / levels.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-primary min-w-fit">
          {levels[currentLevel]}
        </span>
      </div>
    </button>
  );
}
