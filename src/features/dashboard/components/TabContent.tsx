import RequestCard from './RequestCard';
import ProjectCard from './ProjectCard';
import FreelancerCard from './FreelancerCard';
import ReviewCard from './ReviewCard';
import EmptyState from './EmptyState';
import type { DashboardTabData } from '../types';

interface TabContentDashboardProps {
  tabData: DashboardTabData;
  loading: boolean;
  error: string | null;
}

export default function TabContentDashboard({ tabData, loading, error }: TabContentDashboardProps) {
  if (loading) return <EmptyState message="불러오는 중..." />;
  if (error) return <EmptyState message={error} />;

  switch (tabData.tab) {
    case 'request':
      if (tabData.requests.length === 0) {
        return <EmptyState message="매칭 요청이 없습니다" buttonLabel="견적 요청하기" />;
      }
      return (
        <div className="flex flex-col gap-4">
          {tabData.requests.map((item) => (
            <RequestCard key={item.id} title={item.title} />
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
            <ProjectCard key={item.id} image={item.image} title={item.title} />
          ))}
        </div>
      );

    case 'freelancer':
      if (tabData.freelancers.length === 0) {
        return <EmptyState message="프리랜서가 없습니다" buttonLabel="프리랜서 찾기" />;
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tabData.freelancers.map((item) => (
            <FreelancerCard key={item.id} image={item.image} name={item.name} info={item.info} />
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
            <ReviewCard key={item.id} image={item.image} title={item.title} />
          ))}
        </div>
      );

    default:
      return null;
  }
}
