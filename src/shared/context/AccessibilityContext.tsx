import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface AccessibilitySettings {
  textSize: number; // 0-3 (4 levels)
  contrast: number; // 0-2 (3 levels)
  dyslexiaFriendly: number; // 0-2 (3 levels)
  lineHeight: number; // 0-2 (3 levels)
  buttonSize: number; // 0-2 (3 levels)
  textToSpeech: number; // 0-1 (disabled/enabled)
  voiceAssistant: number; // 0-1 (disabled/enabled)
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
  voiceAssistantMuted: boolean;
  muteVoiceAssistant: () => void;
  unmuteVoiceAssistant: () => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSize: 0,
  contrast: 0,
  dyslexiaFriendly: 0,
  lineHeight: 0,
  buttonSize: 0,
  textToSpeech: 0,
  voiceAssistant: 0,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [isInitialized, setIsInitialized] = useState(false);
  const [voiceAssistantMuted, setVoiceAssistantMuted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Apply settings to document
  useEffect(() => {
    if (!isInitialized) return;

    // Text size multipliers
    const textSizeMultipliers = [1, 1.25, 1.5, 1.75];
    const baseSize = 18;
    const multiplier = textSizeMultipliers[settings.textSize];
    document.documentElement.style.setProperty('--font-size', `${baseSize * multiplier}px`);

    // Line height
    const lineHeights = [1.6, 2, 2.5];
    document.documentElement.style.setProperty(
      '--line-height',
      lineHeights[settings.lineHeight].toString()
    );

    // Button padding (for button size)
    const buttonPaddings = ['px-6 py-3', 'px-8 py-4', 'px-10 py-5'];
    document.documentElement.setAttribute('data-button-size', buttonPaddings[settings.buttonSize]);

    // Also set CSS variable for button scale
    const buttonScales = [1, 1.15, 1.3];
    document.documentElement.style.setProperty('--button-scale', buttonScales[settings.buttonSize].toString());

    // Dyslexia friendly (letter spacing)
    const letterSpacings = ['0em', '0.05em', '0.1em'];
    document.documentElement.style.setProperty('--letter-spacing', letterSpacings[settings.dyslexiaFriendly]);

    // Contrast modes
    if (settings.contrast === 1) {
      document.documentElement.classList.add('inverted-colors');
    } else {
      document.documentElement.classList.remove('inverted-colors');
    }

    if (settings.contrast === 2) {
      document.documentElement.classList.add('grayscale-mode');
    } else {
      document.documentElement.classList.remove('grayscale-mode');
    }

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings, isInitialized]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const muteVoiceAssistant = () => setVoiceAssistantMuted(true);
  const unmuteVoiceAssistant = () => setVoiceAssistantMuted(false);

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSetting,
      resetSettings,
      voiceAssistantMuted,
      muteVoiceAssistant,
      unmuteVoiceAssistant,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}
