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

import ChatRoomListPage from '@/features/message/ChatRoomListPage';
import ChatRoomRoute from './ChatRoomRoute';

// 레이아웃 없는 페이지 (로그인/회원가입 관련)
export const noLayoutRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
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
  { path: '/messages/notifications', element: <FreelancerNotifications /> },
  { path: '/chat', element: <ChatRoomListPage /> },
  { path: '/chat/:roomId', element: <ChatRoomRoute /> },
  { path: '/admin/dashboard', element: <AdminDashboardPage /> },
];
