import { useState } from 'react';
import TabDashboard from './components/TabDashboard';
import TabContentDashboard from '@/features/dashboard/components/TabContent';
import type { DashboardTabKey, DashboardTabData } from './types';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTabKey>('in-progress');

  const tabData: Record<DashboardTabKey, DashboardTabData> = {
    'in-progress': {
      tab: 'in-progress',
      projects: [],
    },
    request: {
      tab: 'request',
      requests: [
        { id: 1, title: '런칭 프로젝트 요청' },
        { id: 2, title: '브랜딩 요청' },
      ],
    },
    completed: {
      tab: 'completed',
      projects: [{ id: 3, image: '/sample3.jpg', title: '완료된 프로젝트' }],
    },
    freelancer: {
      tab: 'freelancer',
      freelancers: [{ id: 1, image: '/user1.jpg', name: '홍길동', info: '웹 개발자' }],
    },
    review: {
      tab: 'review',
      reviews: [{ id: 4, image: '/sample4.jpg', title: '리뷰 제목' }],
    },
  };

  const currentData = tabData[activeTab];

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto py-10">
      <TabDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabContentDashboard tabData={currentData} loading={false} error={null} />
    </div>
  );
}
