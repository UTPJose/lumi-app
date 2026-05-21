import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AccessibilityProvider } from '../shared/context/AccessibilityContext';
import { AccessibilityButton } from '../shared/components/accessibility/AccessibilityButton';
import { VoiceAssistantManager } from '../shared/components/accessibility/VoiceAssistantManager';
// import { useAutoPageReader } from '../hooks/useAutoPageReader';

function AppContent() {
  // useAutoPageReader();

  return (
    <>
      <VoiceAssistantManager />
      <RouterProvider router={router} />
      <AccessibilityButton />
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