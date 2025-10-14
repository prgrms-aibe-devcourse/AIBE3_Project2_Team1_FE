// routes.tsx

import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage';
import AdminLoginPage from '@/features/admin/pages/AdminLoginPage';

import LoginPage from '@/features/auth/LoginPage';
import SignUpPage from '@/features/user/SignUpPage';

import PasswordChangePage from '@/features/profile/pages/PasswordChangePage';
import ProfileEditPage from '@/features/profile/pages/ProfileEditPage';
import ProfilePage from '@/features/profile/pages/ProfilePage';
import UserEditPage from '@/features/profile/pages/UserEditPage';

import ReviewWritePage from '@/features/review/ReviewWritePage';

import ClientProposalPage from '@/pages/ClientProposal';
import FreelancerProposalPage from '@/pages/FreelancerProposal';
import Home from '@/pages/Home';
import OverviewPage from '@/pages/OverviewPage';
import ProjectDetail from '@/pages/ProjectDetail';
import ProjectList from '@/pages/ProjectList';
import ProjectWrite from '@/pages/ProjectWrite';
import ProjectUpdate from '@/pages/ProjectUpdate';

import ChatRoomListPage from '@/features/message/ChatRoomListPage';
import ChatRoomRoute from './ChatRoomRoute';

// 레이아웃 없는 페이지 (로그인/회원가입 관련)
export const noLayoutRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
];

// 메인 레이아웃 적용되는 페이지
export const mainRoutes = [
  { path: '/', element: <Home /> },
  { path: '/project/:projectId/client-proposal', element: <ClientProposalPage /> },
  { path: '/project/:projectId/freelancer-proposal', element: <FreelancerProposalPage /> },
  { path: '/review/write', element: <ReviewWritePage /> },
  { path: '/projects/:groupId', element: <ProjectList /> },
  { path: '/projects/:groupId/:categoryId', element: <ProjectList /> },
  { path: '/project/:projectId', element: <ProjectDetail /> },
  { path: '/project/write', element: <ProjectWrite /> },
  { path: '/project/:projectId/update', element: <ProjectUpdate /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/user/edit', element: <UserEditPage /> },
  { path: '/profile/edit', element: <ProfileEditPage /> },
  { path: '/profile/password-change', element: <PasswordChangePage /> },
  { path: '/overview', element: <OverviewPage /> },
  { path: '/chat', element: <ChatRoomListPage /> },
  { path: '/chat/:roomId', element: <ChatRoomRoute /> },
  { path: '/admin/dashboard', element: <AdminDashboardPage /> },
];
