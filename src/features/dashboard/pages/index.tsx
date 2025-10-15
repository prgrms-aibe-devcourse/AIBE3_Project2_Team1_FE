import { useState } from 'react';
import TabDashboard from '@/features/dashboard/components/TabDashboard';
import TabContentDashboard from '@/features/dashboard/components/TabContent';
import type { DashboardTabKey, DashboardTabData } from '../types';
import useReceivedProposals from '../hooks/useReceivedProposals';
import useBookmarks from '../hooks/useBookmarks';
import useSentProposals from '../hooks/useSentProposals';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTabKey>('in-progress');

  const { requests, loading: proposalsLoading, error: proposalsError } = useReceivedProposals();
  const { bookmarks, loading: bookmarksLoading, error: bookmarksError } = useBookmarks();
  const { proposals, loading: proposalsLoading2, error: proposalsError2 } = useSentProposals();

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
    review: {
      tab: 'review',
      reviews: [{ id: 4, image: '/sample4.jpg', title: '리뷰 제목' }],
    },
    bookmark: { tab: 'bookmark', bookmarks },
    proposal: {
      tab: 'proposal',
      proposals,
    },
  };

  const currentData = tabData[activeTab];

  const showLoading =
    activeTab === 'request'
      ? proposalsLoading
      : activeTab === 'bookmark'
        ? bookmarksLoading
        : activeTab === 'proposal'
          ? proposalsLoading2
          : false;
  const showError =
    activeTab === 'request'
      ? proposalsError
      : activeTab === 'bookmark'
        ? bookmarksError
        : activeTab === 'proposal'
          ? proposalsError2
          : null;

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto py-10">
      <TabDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabContentDashboard tabData={currentData} loading={showLoading} error={showError} />
    </div>
  );
}
