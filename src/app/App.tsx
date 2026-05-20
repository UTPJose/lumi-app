import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AccessibilityProvider } from '../shared/context/AccessibilityContext';
import { AccessibilityButton } from '../shared/components/accessibility/AccessibilityButton';

export default function App() {
  return (
    <AccessibilityProvider>
      <RouterProvider router={router} />
      <AccessibilityButton />
    </AccessibilityProvider>
  );
}