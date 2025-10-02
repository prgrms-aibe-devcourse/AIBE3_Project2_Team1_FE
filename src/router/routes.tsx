import Home from '../pages/Home';
import ClientProposalPage from '../pages/ClientProposal';
import FreelancerProposalPage from '../pages/FreelancerProposal';
import ReviewWritePage from '@/features/review/ReviewWritePage';
import ProjectList from '../pages/ProjectList';
import ProjectDetail from '../pages/ProjectDetail';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/client-proposal', element: <ClientProposalPage /> },
  { path: '/freelancer-proposal', element: <FreelancerProposalPage /> },
  { path: '/review/write', element: <ReviewWritePage /> },
  { path: '/projects/:groupId', element: <ProjectList /> },
  { path: '/projects/:groupId/:categoryId', element: <ProjectList /> },
  { path: '/project/:projectId', element: <ProjectDetail /> },
];
