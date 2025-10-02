import Home from '../pages/Home';
import ClientProposalPage from '../pages/ClientProposal';
import FreelancerProposalPage from '../pages/FreelancerProposal';
import ReviewWritePage from '@/features/review/ReviewWritePage';
import ProjectList from '../pages/ProjectList';
import OverviewPage from '@/pages/OverviewPage';
import FreelancerNotifications from '@/features/message/FreelancerNotificationsPage.tsx';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/client-proposal', element: <ClientProposalPage /> },
  { path: '/freelancer-proposal', element: <FreelancerProposalPage /> },
  { path: '/review/write', element: <ReviewWritePage /> },
  { path: '/projects/:groupId', element: <ProjectList /> },
  { path: '/overview', element: <OverviewPage /> },
  {
    path: '/messages/notifications',
    element: <FreelancerNotifications />,
  },
];
