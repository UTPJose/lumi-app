import { createBrowserRouter } from 'react-router';
import { WelcomePage } from './pages/WelcomePage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { InterestsPage } from './pages/InterestsPage';
import { HomePage } from './pages/HomePage';
import { CreateRoutinePage } from './pages/CreateRoutinePage';
import { QuestionsPage } from './pages/QuestionsPage';
import { VoiceInputPage } from './pages/VoiceInputPage';
import { GeneratingPage } from './pages/GeneratingPage';
import { RoutineDetailPage } from './pages/RoutineDetailPage';
import { LibraryPage } from './pages/LibraryPage';
import { RemindersPage } from './pages/RemindersPage';
import { SharePage } from './pages/SharePage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

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