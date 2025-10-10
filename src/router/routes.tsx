import AdminLoginPage from '@/features/admin/pages/AdminLoginPage';
import LoginPage from '@/features/auth/LoginPage';
import OAuthCallback from '@/features/auth/OAuthCallback';
import SignUpPage from '@/features/user/SignUpPage';

import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage';
import ProfilePage from '@/features/profile';
import ReviewWritePage from '@/features/review/ReviewWritePage';
import ClientProposalPage from '@/pages/ClientProposal';
import FreelancerProposalPage from '@/pages/FreelancerProposal';
import Home from '@/pages/Home';
import OverviewPage from '@/pages/OverviewPage';
import ProjectList from '@/pages/ProjectList';

import ChatRoomListPage from '@/features/message/ChatRoomListPage';
import ChatRoomRoute from './ChatRoomRoute';

// 레이아웃 없는 페이지 (로그인/회원가입 관련)
export const noLayoutRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
  { path: '/oauth/callback', element: <OAuthCallback /> },
];

// 메인 레이아웃이 적용되는 페이지
export const mainRoutes = [
  { path: '/', element: <Home /> },
  { path: '/client-proposal', element: <ClientProposalPage /> },
  { path: '/freelancer-proposal', element: <FreelancerProposalPage /> },
  { path: '/review/write', element: <ReviewWritePage /> },
  { path: '/projects/:groupId', element: <ProjectList /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/overview', element: <OverviewPage /> },
  { path: '/chat', element: <ChatRoomListPage /> },
  { path: '/chat/:roomId', element: <ChatRoomRoute /> },
  { path: '/admin/dashboard', element: <AdminDashboardPage /> },
];
