import { useNavigate } from 'react-router-dom';
import type { DashboardTabData } from '../types';
import BookmarkCard from './BookmarkCard';
import EmptyState from './EmptyState';
import ProjectCard from './ProjectCard';
import RequestCard from './RequestCard';
import ReviewCard from './ReviewCard';

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
              image={item.imageUrls?.[0] ?? ''} // 없으면 빈 문자열
              title={item.projectTitle}
              comment={item.comment}
              rating={item.rating}
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

    default:
      return null;
  }
}
