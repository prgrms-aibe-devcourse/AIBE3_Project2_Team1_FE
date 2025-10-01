import Home from '../pages/Home';
import ClientProposalPage from '../pages/ClientProposal';
import FreelancerProposalPage from '../pages/FreelancerProposal';
import ReviewWritePage from '@/features/review/ReviewWritePage';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/client-proposal', element: <ClientProposalPage /> }, //클라이언트에게 보내는 제안서 페이지
  { path: '/freelancer-proposal', element: <FreelancerProposalPage /> }, //프리랜서에게 보내는 제안서 페이지
  { path: '/review/write', element: <ReviewWritePage /> },
];
