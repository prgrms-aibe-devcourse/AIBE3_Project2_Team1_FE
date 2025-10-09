import Home from '../pages/Home';
import ClientProposalPage from '../pages/ClientProposal';
import FreelancerProposalPage from '../pages/FreelancerProposal';
import ReviewWritePage from '@/features/review/ReviewWritePage';
import ProjectList from '../pages/ProjectList';
import ProfilePage from '@/features/profile';
import OverviewPage from '@/pages/OverviewPage';
import Matching from '@/pages/MatchingPage';
import MatchDetailPage from '@/features/dashboard/pages/MatchDetailPage';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/client-proposal', element: <ClientProposalPage /> },
  { path: '/freelancer-proposal', element: <FreelancerProposalPage /> },
  { path: '/review/write', element: <ReviewWritePage /> },
  { path: '/projects/:groupId', element: <ProjectList /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/overview', element: <OverviewPage /> },
  { path: '/matching', element: <Matching /> },
  { path: '/match/:id', element: <MatchDetailPage /> },
];
