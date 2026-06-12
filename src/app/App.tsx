import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AccessibilityProvider } from '../shared/context/AccessibilityContext';
import { VoiceAssistantManager } from '../shared/components/accessibility/VoiceAssistantManager';

function AppContent() {
  return (
    <>
      <VoiceAssistantManager />
      <RouterProvider router={router} />
    </>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}
