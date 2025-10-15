import { useState } from 'react';
import TabDashboard from '@/features/dashboard/components/TabDashboard';
import TabContentDashboard from '@/features/dashboard/components/TabContent';
import type { DashboardTabKey, DashboardTabData } from '../types';
import useReceivedProposals from '../hooks/useReceivedProposals';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTabKey>('in-progress');

  const { requests, loading: proposalsLoading, error: proposalsError } = useReceivedProposals();

  const tabData: Record<DashboardTabKey, DashboardTabData> = {
    'in-progress': {
      tab: 'in-progress',
      projects: [],
    },
    request: {
      tab: 'request',
      requests,
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

  const showLoading = activeTab === 'request' ? proposalsLoading : false;
  const showError = activeTab === 'request' ? proposalsError : null;

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto py-10">
      <TabDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabContentDashboard tabData={currentData} loading={showLoading} error={showError} />
    </div>
  );
}
