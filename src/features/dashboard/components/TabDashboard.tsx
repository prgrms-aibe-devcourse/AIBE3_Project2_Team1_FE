import type { DashboardTabKey } from '../types';

import Done from '@/assets/Done.png';
import Favorite from '@/assets/Favorite.png';
import Historical from '@/assets/Historical.png';
import Star from '@/assets/Star Half Empty.png';
import View from '@/assets/View.png';

interface TabDashboardProps {
  activeTab: DashboardTabKey;
  setActiveTab: (tab: DashboardTabKey) => void;
}

export default function TabDashboard({ activeTab, setActiveTab }: TabDashboardProps) {
  const tabs: { key: DashboardTabKey; label: string; icon: string }[] = [
    { key: 'in-progress', label: '진행 중인 프로젝트', icon: Historical },
    { key: 'request', label: '매칭 요청', icon: View },
    { key: 'completed', label: '완료된 프로젝트', icon: Done },
    { key: 'freelancer', label: '관심 프리랜서', icon: Favorite },
    { key: 'review', label: '내가 쓴 리뷰', icon: Star },
  ];

  return (
    <nav className="max-w-4xl w-full mx-auto mt-6 flex justify-between border-b">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm ${
            activeTab === tab.key
              ? 'text-teal-500 border-b-2 border-teal-500 font-medium'
              : 'text-gray-500'
          }`}
        >
          <img src={tab.icon} alt={tab.label} className="w-5 h-5" />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
