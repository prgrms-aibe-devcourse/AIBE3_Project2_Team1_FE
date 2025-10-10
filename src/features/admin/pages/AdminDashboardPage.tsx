import { useEffect, useState } from 'react';
import { getAdminDashboard, adminLogout } from '../api';
import { useNavigate } from 'react-router-dom';

interface AdminRecentProjectDto {
  projectId: number;
  projectName: string;
  clientName: string;
  createdAt: string;
}

interface AdminDashboardResponseDto {
  totalUserCount: number;
  todayUserCount: number;
  todayFreelancerSignups: number;
  todayClientSignups: number;
  todayProjectCount: number;
  todayReviewCount: number;
  recentProjects: AdminRecentProjectDto[];
}

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardResponseDto | null>(null);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error(err);
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  if (!data) return <p className="text-center mt-10">로딩 중...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow flex justify-between items-center px-6 h-16">
        <h1 className="text-lg font-bold">픽플 관리자 대시보드</h1>
        <button onClick={handleLogout} className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded">
          로그아웃
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">오늘 통계</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StatCard title="전체 사용자" value={`${data.totalUserCount}명`} color="bg-green-500" />
          <StatCard title="오늘 가입자" value={`${data.todayUserCount}명`} color="bg-blue-500" />
          <StatCard
            title="오늘 프리랜서 가입"
            value={`${data.todayFreelancerSignups}명`}
            color="bg-purple-500"
          />
          <StatCard
            title="오늘 클라이언트 가입"
            value={`${data.todayClientSignups}명`}
            color="bg-orange-500"
          />
          <StatCard
            title="오늘 생성된 프로젝트"
            value={`${data.todayProjectCount}개`}
            color="bg-teal-500"
          />
          <StatCard
            title="오늘 작성된 리뷰"
            value={`${data.todayReviewCount}개`}
            color="bg-pink-500"
          />
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">최근 등록된 프로젝트</h2>
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  프로젝트명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  클라이언트
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  생성일
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.recentProjects.map((p) => (
                <tr key={p.projectId}>
                  <td className="px-6 py-4 whitespace-nowrap">{p.projectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }: { title: string; value: string; color: string }) => (
  <div className="bg-white rounded shadow p-5 flex items-center space-x-4">
    <div
      className={`h-10 w-10 ${color} rounded flex items-center justify-center text-white font-bold`}
    >
      📊
    </div>
    <div>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  </div>
);

export default AdminDashboardPage;
