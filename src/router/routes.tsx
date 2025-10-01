import Home from '../pages/Home';
import ClientProposalPage from '../pages/ClientProposal';
import FreelancerProposalPage from '../pages/FreelancerProposal';
import ProposalPage from '../pages/proposal';
import ReviewWritePage from '@/features/review/ReviewWritePage';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/client-proposal', element: <ClientProposalPage /> },
  { path: '/freelancer-proposal', element: <FreelancerProposalPage /> },
  { path: '/proposal', element: <ProposalPage /> },
  { path: '/review/write', element: <ReviewWritePage /> },
];