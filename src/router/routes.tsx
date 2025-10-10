import LoginPage from '@/features/auth/LoginPage';
import SignUpPage from '@/features/user/SignUpPage';
import AdminLoginPage from '@/features/admin/pages/AdminLoginPage';

import Home from '@/pages/Home';
import ClientProposalPage from '@/pages/ClientProposal';
import FreelancerProposalPage from '@/pages/FreelancerProposal';
import ReviewWritePage from '@/features/review/ReviewWritePage';
import ProjectList from '@/pages/ProjectList';
import ProfilePage from '@/features/profile';
import OverviewPage from '@/pages/OverviewPage';
import FreelancerNotifications from '@/features/message/FreelancerNotificationsPage';
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage';

export const noLayoutRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
];

export const mainRoutes = [
  { path: '/', element: <Home /> },
  { path: '/client-proposal', element: <ClientProposalPage /> },
  { path: '/freelancer-proposal', element: <FreelancerProposalPage /> },
  { path: '/review/write', element: <ReviewWritePage /> },
  { path: '/projects/:groupId', element: <ProjectList /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/overview', element: <OverviewPage /> },
  { path: '/messages/notifications', element: <FreelancerNotifications /> },
  { path: '/admin/dashboard', element: <AdminDashboardPage /> },
];
