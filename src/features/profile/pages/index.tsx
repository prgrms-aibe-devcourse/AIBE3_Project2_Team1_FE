import { useState } from 'react';
import ProfileCard from '@/features/profile/components/ProfileCard';
import DashboardPage from '@/features/dashboard/pages';
import type { Mode } from '@/features/profile/types';

export default function ProfilePage() {
  const [mode, setMode] = useState<Mode>('client');

  // 시험 데이터 (mock)
  const Profile = {
    name: '홍길동',
    email: 'hong@example.com',
    bio: '열심히 일하는 프리랜서입니다.',
    completedCount: 10,
    inProgressCount: 23,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 프로필 카드 */}
      <ProfileCard
        mode={mode}
        setMode={setMode}
        name={Profile.name}
        email={Profile.email}
        bio={Profile.bio}
        completedCount={Profile.completedCount}
        inProgressCount={Profile.inProgressCount}
      />

      {/* 탭 / 대시보드 부분 */}
      <DashboardPage />
    </div>
  );
}
