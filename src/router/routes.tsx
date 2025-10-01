import Home from '../pages/Home';
import ProposalPage from '../pages/proposal';
import ProfilePage from '../pages/profile';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/proposal', element: <ProposalPage /> },
  { path: '/profile', element: <ProfilePage /> },
];
