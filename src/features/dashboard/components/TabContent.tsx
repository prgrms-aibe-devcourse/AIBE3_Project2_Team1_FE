import { useNavigate } from 'react-router-dom';
import RequestCard from './RequestCard';
import ProjectCard from './ProjectCard';
import ReviewCard from './ReviewCard';
import BookmarkCard from './BookmarkCard';
import EmptyState from './EmptyState';
import ProposalCard from './ProposalCard';
import type { DashboardTabData } from '../types';

interface TabContentDashboardProps {
  tabData: DashboardTabData;
  loading: boolean;
  error: string | null;
}

export default function TabContentDashboard({ tabData, loading, error }: TabContentDashboardProps) {
  const navigate = useNavigate();

  if (loading) return <EmptyState message="불러오는 중..." />;
  if (error) return <EmptyState message={error} />;

  const handleProjectClick = (id: number) => {
    navigate(`/project/${id}`);
  };

  const handleReviewWriteClick = (projectId: number) => {
    navigate(`/review/write/${projectId}`);
  };

  switch (tabData.tab) {
    case 'request':
      if (tabData.requests.length === 0) {
        return <EmptyState message="매칭 요청이 없습니다" buttonLabel="견적 요청하기" />;
      }
      return (
        <div className="flex flex-col gap-4">
          {tabData.requests.map((item) => (
            <RequestCard key={item.id} id={item.id} title={item.title} />
          ))}
        </div>
      );

    case 'in-progress':
    case 'completed':
      if (tabData.projects.length === 0) {
        return <EmptyState message="프로젝트가 없습니다" buttonLabel="프로젝트 찾기" />;
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tabData.projects.map((item) => (
            <ProjectCard
              key={item.projectId}
              image={item.imageUrls?.[0] ?? ''} // 없으면 빈 문자열
              title={item.title}
              onClick={() => handleProjectClick(item.projectId)}
            />
          ))}
        </div>
      );

    case 'review':
      if (tabData.reviews.length === 0) {
        return <EmptyState message="리뷰가 없습니다" />;
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tabData.reviews.map((item) => (
            <ReviewCard
              key={item.reviewId}
              image={item.imageUrls?.[0] ?? null} // 이미지 없으면 null
              title={item.projectTitle}
              comment={item.comment}
              rating={item.rating}
              onWriteClick={() => handleReviewWriteClick(item.projectId)}
            />
          ))}
        </div>
      );

    case 'bookmark':
      if (tabData.bookmarks.length === 0) {
        return <EmptyState message="북마크가 없습니다" />;
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tabData.bookmarks.map((item) => (
            <BookmarkCard key={item.id} image={item.image} title={item.title} />
          ))}
        </div>
      );

    case 'proposal':
      if (tabData.proposals.length === 0) {
        return <EmptyState message="제안서가 없습니다" buttonLabel="제안서 작성하기" />;
      }
      return (
        <div className="flex flex-col gap-4">
          {tabData.proposals.map((item) => (
            <ProposalCard key={item.id} id={item.id} title={item.title} />
          ))}
        </div>
      );

    default:
      return null;
  }
}
