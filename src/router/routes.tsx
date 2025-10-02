import LoginPage from '@/features/auth/LoginPage';
import ProfilePage from '@/features/profile';
import ReviewWritePage from '@/features/review/ReviewWritePage';
import SignUpPage from '@/features/user/SignUpPage';
import ClientProposalPage from '../pages/ClientProposal';
import FreelancerProposalPage from '../pages/FreelancerProposal';
import Home from '../pages/Home';
import ProjectList from '../pages/ProjectList';
import OverviewPage from '@/pages/OverviewPage';
import FreelancerNotifications from '@/features/message/FreelancerNotificationsPage';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/client-proposal', element: <ClientProposalPage /> },
  { path: '/freelancer-proposal', element: <FreelancerProposalPage /> },
  { path: '/review/write', element: <ReviewWritePage /> },
  { path: '/projects/:groupId', element: <ProjectList /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/overview', element: <OverviewPage /> },
  {
    path: '/messages/notifications',
    element: <FreelancerNotifications />,
  },
];
