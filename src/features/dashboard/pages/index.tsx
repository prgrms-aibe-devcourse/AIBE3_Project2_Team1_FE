import TabContentDashboard from '@/features/dashboard/components/TabContent';
import { useState } from 'react';
import useBookmarks from '../hooks/useBookmarks';
import useInProgressProjects from '../hooks/useInProgressProjects';
import useMyReviews from '../hooks/useMyReviews';
import useCompletedProjects from '../hooks/userCompletedProjects';
import useReceivedProposals from '../hooks/useReceivedProposals';
import type { DashboardTabData, DashboardTabKey } from '../types';
import TabDashboard from '@/features/dashboard/components/TabDashboard';
import useSentProposals from '../hooks/useSentProposals';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTabKey>('in-progress');

  const { requests, loading: proposalsLoading, error: proposalsError } = useReceivedProposals();
  const { proposals, loading: proposalsLoading2, error: proposalsError2 } = useSentProposals();
  const { bookmarks, loading: bookmarksLoading, error: bookmarksError } = useBookmarks();
  const {
    projects: inProgressProjects,
    loading: inProgressLoading,
    error: inProgressError,
  } = useInProgressProjects();
  const {
    projects: completedProjects,
    loading: completedLoading,
    error: completedError,
  } = useCompletedProjects();
  const { reviews, loading: reviewsLoading, error: reviewsError } = useMyReviews();

  const tabData: Record<DashboardTabKey, DashboardTabData> = {
    'in-progress': {
      tab: 'in-progress',
      projects: inProgressProjects,
    },
    request: {
      tab: 'request',
      requests,
    },
    completed: {
      tab: 'completed',
      projects: completedProjects,
    },
    review: {
      tab: 'review',
      reviews,
    },
    proposal: {
      tab: 'proposal',
      proposals,
    },
    bookmark: {
      tab: 'bookmark',
      bookmarks,
    },
  };

  const currentData = tabData[activeTab];

  const showLoading =
    activeTab === 'request'
      ? proposalsLoading
      : activeTab === 'bookmark'
        ? bookmarksLoading
        : activeTab === 'in-progress'
          ? inProgressLoading
          : activeTab === 'completed'
            ? completedLoading
            : activeTab === 'review'
              ? reviewsLoading
              : activeTab === 'proposal'
                ? proposalsLoading2
                : false;

  const showError =
    activeTab === 'request'
      ? proposalsError
      : activeTab === 'bookmark'
        ? bookmarksError
        : activeTab === 'in-progress'
          ? inProgressError
          : activeTab === 'completed'
            ? completedError
            : activeTab === 'review'
              ? reviewsError
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
