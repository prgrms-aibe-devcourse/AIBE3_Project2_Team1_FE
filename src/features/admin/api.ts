import adminAxios from '@/services/adminAxios';
import { setAdminAuthHeader, clearAdminAuthHeader } from '@/services/user';

// 관리자 로그인
export const adminLogin = async (username: string, password: string) => {
  const basicAuth = setAdminAuthHeader(username, password);
  const res = await adminAxios.post(
    '/admin/login',
    { username, password },
    {
      headers: { Authorization: basicAuth },
    }
  );
  return res.data;
};

// 관리자 로그아웃
export const adminLogout = () => {
  clearAdminAuthHeader();
};

// 관리자 대시보드 통계
export const getAdminDashboard = async () => {
  const res = await adminAxios.get('/admin/dashboard');
  return res.data;
};
