import LoginPage from '@/features/auth/LoginPage';
import SignUpPage from '@/features/user/SignUpPage';
import AdminLoginPage from '@/features/admin/pages/AdminLoginPage';

import Home from '@/pages/Home';
import ClientProposalPage from '@/pages/ClientProposal';
import FreelancerProposalPage from '@/pages/FreelancerProposal';
import ReviewWritePage from '@/features/review/ReviewWritePage';
import ProjectList from '@/pages/ProjectList';
import ProjectDetail from '../pages/ProjectDetail';
import ProjectWrite from '../pages/ProjectWrite';
import ProfilePage from '@/features/profile/pages';
import OverviewPage from '@/pages/OverviewPage';
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage';

import ChatRoomListPage from '@/features/message/ChatRoomListPage';
import ChatRoomRoute from './ChatRoomRoute';

// 레이아웃 없는 페이지 (로그인/회원가입 관련)
export const noLayoutRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
];

export const routes = [
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
  { path: '/projects/:groupId/:categoryId', element: <ProjectList /> },
  { path: '/project/:projectId', element: <ProjectDetail /> },
  { path: '/project/write', element: <ProjectWrite /> },
];
