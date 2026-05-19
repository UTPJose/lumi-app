import { createBrowserRouter } from 'react-router';
import { WelcomePage } from '../features/auth/pages/WelcomePage';
import { ProfileSetupPage } from '../features/auth/pages/ProfileSetupPage';
import { InterestsPage } from '../features/profile/pages/InterestsPage';
import { HomePage } from '../features/routines/pages/HomePage';
import { CreateRoutinePage } from '../features/routines/pages/CreateRoutinePage';
import { QuestionsPage } from '../features/onboarding/pages/QuestionsPage';
import { VoiceInputPage } from '../features/onboarding/pages/VoiceInputPage';
import { GeneratingPage } from '../features/routines/pages/GeneratingPage';
import { RoutineDetailPage } from '../features/routines/pages/RoutineDetailPage';
import { LibraryPage } from '../features/routines/pages/LibraryPage';
import { RemindersPage } from '../features/reminders/pages/RemindersPage';
import { SharePage } from '../features/sharing/pages/SharePage';
import { ProfilePage } from '../features/profile/pages/ProfilePage';
import { NotFoundPage } from '../features/auth/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />,
  },
  {
    path: '/profile-setup',
    element: <ProfileSetupPage />,
  },
  {
    path: '/interests',
    element: <InterestsPage />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/create',
    element: <CreateRoutinePage />,
  },
  {
    path: '/create/questions',
    element: <QuestionsPage />,
  },
  {
    path: '/create/voice',
    element: <VoiceInputPage />,
  },
  {
    path: '/create/generating',
    element: <GeneratingPage />,
  },
  {
    path: '/routine/:id',
    element: <RoutineDetailPage />,
  },
  {
    path: '/library',
    element: <LibraryPage />,
  },
  {
    path: '/reminders',
    element: <RemindersPage />,
  },
  {
    path: '/share',
    element: <SharePage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);