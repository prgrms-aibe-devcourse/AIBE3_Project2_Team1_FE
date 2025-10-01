import Home from '../pages/Home';
import ProposalPage from '../pages/proposal';
import ProfilePage from '@/features/profile/profilePage';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/proposal', element: <ProposalPage /> },
  { path: '/profile', element: <ProfilePage /> },
];
