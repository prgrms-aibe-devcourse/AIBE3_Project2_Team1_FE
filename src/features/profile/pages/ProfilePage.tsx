import DashboardPage from '@/features/dashboard/pages';
import ProfileCard from '@/features/profile/components/ProfileCard';
import type { ProfileResponseDto, UserResponseDto } from '@/features/profile/profile';
import { getMyProfile, getMyUser } from '@/features/profile/profile';
import type { Mode } from '@/features/profile/types';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [mode, setMode] = useState<Mode>('client');
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [profile, setProfile] = useState<ProfileResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res: UserResponseDto = await getMyUser();
        setUser(res);
      } catch (err) {
        console.error('유저 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const fetchProfile = async () => {
      try {
        const res: ProfileResponseDto = await getMyProfile();
        setProfile(res);
      } catch (err) {
        console.error('프로필 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (!user)
    return <div className="p-8 text-center text-red-500">프로필을 불러올 수 없습니다.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 프로필 카드 */}
      <ProfileCard
        mode={mode}
        setMode={setMode}
        name={user.data.name}
        email={user.data.email}
        description={profile?.data.description ?? '설명이 없습니다.'}
        completedCount={0}
        inProgressCount={0}
        skills={profile?.data.skills ?? '보유 기술을 작성해주세요.'}
      />

      {/* 대시보드 */}
      <DashboardPage />
    </div>
  );
}
