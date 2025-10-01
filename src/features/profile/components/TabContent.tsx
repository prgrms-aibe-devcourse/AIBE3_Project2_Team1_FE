import RequestCard from './RequestCard';
import ProjectCard from './ProjectCard';
import FreelancerCard from './FreelancerCard';
import ReviewCard from './ReviewCard';
import EmptyState from './EmptyState';
import type { TabKey, RequestItem, ProjectItem, FreelancerItem, ReviewItem } from '../types';

interface TabContentProps {
  tab: TabKey;
  data: (RequestItem | ProjectItem | FreelancerItem | ReviewItem)[];
  loading: boolean;
  error: string | null;
}

const TabContent = ({ tab, data, loading, error }: TabContentProps) => {
  if (loading) {
    return <EmptyState message="불러오는 중..." />;
  }
  if (error) {
    return <EmptyState message={error} />;
  }
  if (!data || data.length === 0) {
    switch (tab) {
      case 'request':
        return <EmptyState message="매칭 요청이 없습니다" buttonLabel="견적 요청하기" />;
      case 'in-progress':
        return (
          <EmptyState
            message="프로젝트가 없습니다"
            buttonLabel="프로젝트 찾기"
            onClick={() => {}}
          />
        );
      case 'completed':
        return <EmptyState message="완료된 프로젝트가 없습니다" buttonLabel="프로젝트 찾기" />;
      case 'freelancer':
        return (
          <EmptyState
            message="프리랜서가 없습니다"
            buttonLabel="프리랜서 찾기"
            onClick={() => {}}
          />
        );
      case 'review':
        return <EmptyState message="리뷰가 없습니다" />;
      default:
        return null;
    }
  }

  switch (tab) {
    case 'request':
      return (
        <div className="flex flex-col gap-4">
          {(data as RequestItem[]).map((item) => (
            <RequestCard
              key={item.id}
              title={item.title}
              onClick={() => {
                // 페이지 이동 예시 (React Router 사용 시)
                // navigate(`/profile/request/${item.id}`)
                console.log(`요청 ${item.title} 상세`);
              }}
            />
          ))}
        </div>
      );
    case 'in-progress':
    case 'completed':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(data as ProjectItem[]).map((item) => (
            <ProjectCard
              key={item.id}
              image={item.image}
              title={item.title}
              onClick={() => {
                // navigate(`/project/${item.id}`)
                console.log(`${item.title} 프로젝트로 이동`);
              }}
            />
          ))}
        </div>
      );
    case 'freelancer':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(data as FreelancerItem[]).map((item) => (
            <FreelancerCard
              key={item.id}
              image={item.image}
              name={item.name}
              info={item.info}
              onClick={() => {
                // navigate(`/freelancer/${item.id}`)
                console.log(`${item.name} 프리랜서 선택`);
              }}
            />
          ))}
        </div>
      );
    case 'review':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(data as ReviewItem[]).map((item) => (
            <ReviewCard key={item.id} image={item.image} title={item.title} />
          ))}
        </div>
      );
    default:
      return null;
  }
};

export default TabContent;
