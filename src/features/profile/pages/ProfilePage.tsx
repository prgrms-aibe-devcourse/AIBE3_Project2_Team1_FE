import DashboardPage from '@/features/dashboard/pages';
import ProfileCard from '@/features/profile/components/ProfileCard';
import type { ProfileResponseDto, UserResponseDto } from '@/features/profile/profile';
import { getMyProfile, getMyUser } from '@/features/profile/profile';
import { useEffect, useState } from 'react';
import type { Role } from '../types';
import { axiosInstance } from '@/services/axios';

export default function ProfilePage() {
  const [role, setRole] = useState<Role>('client');
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [profile, setProfile] = useState<ProfileResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // ✅ 유저 정보
        const userRes: UserResponseDto = await getMyUser();
        setUser(userRes);

        // ✅ 프로필 정보
        const profileRes: ProfileResponseDto = await getMyProfile();
        setProfile(profileRes);

        // ✅ 프로젝트 리스트 (내가 관련된 프로젝트만)
        const projectRes = await axiosInstance.get('/projects/me');
        const projects = projectRes.data?.data ?? projectRes.data ?? [];

        // ✅ 상태별 개수 계산
        const completed = projects.filter(
          (p: { status: string }) => p.status?.toUpperCase() === 'COMPLETED'
        ).length;

        const inProgress = projects.filter(
          (p: { status: string }) => p.status?.toUpperCase() === 'IN_PROGRESS'
        ).length;

        setCompletedCount(completed);
        setInProgressCount(inProgress);
      } catch (err) {
        console.error('데이터 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (!user)
    return <div className="p-8 text-center text-red-500">프로필을 불러올 수 없습니다.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ProfileCard
        role={role}
        setRole={setRole}
        name={user.data.name}
        email={user.data.email}
        title={profile?.data.title ?? '제목이 없습니다.'}
        completedCount={completedCount}
        inProgressCount={inProgressCount}
        skills={profile?.data.skills ?? '보유 기술을 작성해주세요.'}
        profileImgUrl={user.data.ProfileImgUrl}
      />
      <DashboardPage />
    </div>
  );
}
