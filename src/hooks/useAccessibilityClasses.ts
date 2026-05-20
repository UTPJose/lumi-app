import { useAccessibility } from '../context/AccessibilityContext';

export function useAccessibilityClasses() {
  const { settings } = useAccessibility();

  const getButtonClasses = () => {
    const paddings = ['px-6 py-3', 'px-8 py-4', 'px-10 py-5'];
    return paddings[settings.buttonSize];
  };

  const getTextSizeMultiplier = () => {
    const multipliers = [1, 1.25, 1.5, 1.75];
    return multipliers[settings.textSize];
  };

  return {
    buttonPadding: getButtonClasses(),
    textMultiplier: getTextSizeMultiplier(),
  };
}
