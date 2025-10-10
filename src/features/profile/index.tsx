import { useState } from 'react';
import ProfileCard from './components/ProfileCard';
import DashboardPage from '../dashboard';
import type { Mode } from './types';

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
      {/* 헤더 */}
      <header className="flex items-center justify-between px-8 py-4 shadow-sm bg-white relative">
        <div className="w-20" />
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="text-rose-500 font-bold text-4xl">Pickple</div>
        </div>
        <div className="flex gap-2 text-gray-600 text-sm">
          <button className="hover:text-gray-800">로그인</button>
          <span>|</span>
          <button className="hover:text-gray-800">회원가입</button>
        </div>
      </header>

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
