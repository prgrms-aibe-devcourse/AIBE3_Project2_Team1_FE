import { useState } from 'react';
import ProfileCard from './components/ProfileCard';
import TabContent from './components/TabContent';

import Done from '../../assets/done.png';
import Favorite from '../../assets/favorite.png';
import Historical from '../../assets/Historical.png';
import Star from '../../assets/Star Half Empty.png';
import View from '../../assets/View.png';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('in-progress');
  const [mode, setMode] = useState<'client' | 'freelancer'>('client');

  const tabs = [
    { key: 'in-progress', label: '진행 중인 프로젝트', icon: Historical },
    { key: 'request', label: '매칭 요청', icon: View },
    { key: 'completed', label: '완료된 프로젝트', icon: Done },
    { key: 'freelancer', label: '관심 프리랜서', icon: Favorite },
    { key: 'review', label: '내가 쓴 리뷰', icon: Star },
  ];

  const mockData = {
    request: [],
    'in-progress': [
      { id: 1, image: '/sample1.jpg', title: '앱 개발 프로젝트' },
      { id: 2, image: Done, title: '웹사이트 제작' },
      { id: 3, image: Done, title: '웹사이트 제작' },
      { id: 4, image: Done, title: '웹사이트 제작' },
    ],
    completed: [],
    freelancer: [{ id: 1, image: '/freelancer1.jpg', name: '홍길동', info: '웹 개발자' }],
    review: [
      { id: 1, image: '/sample2.jpg', title: '웹사이트 제작' },
      { id: 2, image: '/sample2.jpg', title: '웹사이트 제작' },
    ],
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

      {/* 프로필 */}
      <ProfileCard mode={mode} setMode={setMode} />

      {/* 탭 */}
      <nav className="max-w-4xl w-full mx-auto mt-6 flex justify-between border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-sm flex items-center justify-center gap-2 ${
              activeTab === tab.key
                ? 'text-teal-500 border-b-2 border-teal-500 font-medium'
                : 'text-gray-500'
            }`}
          >
            <img src={tab.icon} alt={tab.label} className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </nav>
      {/* 탭 컨텐츠 */}
      <main className="flex-1 max-w-4xl w-full mx-auto py-10">
        <TabContent tab={activeTab} data={mockData[activeTab]} />
      </main>
    </div>
  );
}
