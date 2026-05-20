import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AccessibilityProvider } from '../shared/context/AccessibilityContext';
import { AccessibilityButton } from '../shared/components/accessibility/AccessibilityButton';
import { VoiceAssistantManager } from '../shared/components/accessibility/VoiceAssistantManager';

export default function App() {
  return (
    <AccessibilityProvider>
      <VoiceAssistantManager />
      <RouterProvider router={router} />
      <AccessibilityButton />
    </AccessibilityProvider>
  );
}