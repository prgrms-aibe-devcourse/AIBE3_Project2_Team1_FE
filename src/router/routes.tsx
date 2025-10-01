import Home from '../pages/Home';
import ProposalPage from '../pages/proposal';
import ReviewWritePage from '@/features/review/ReviewWritePage';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/proposal', element: <ProposalPage /> },
  { path: '/review/write', element: <ReviewWritePage /> },
];
