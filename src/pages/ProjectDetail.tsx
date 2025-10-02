import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ProjectInfo from '../features/project/ProjectInfo';
import ServiceInfo from '../features/project/ServiceInfo';
import ProjectReview from '../features/project/ProjectReview';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const category = searchParams.get('category');
  const [activeTab, setActiveTab] = useState<'service' | 'review'>('service');

  const navigate = useNavigate();

  const categoryNames: { [key: string]: string } = {
    all: '전체',
    video: '영상/사진/음향',
    write: '문서/글쓰기',
    it: 'IT/프로그래밍',
    marketing: '마케팅',
    hobby: '취미 레슨',
    tax: '세무/법무/노무',
    startup: '창업/사업',
    translate: '번역/통역',
  };

  const handleCategoryClick = () => {
    const groupId = type === 'freelancer' ? 'freelancer' : 'client';
    const categoryId = category || 'all';
    navigate(`/projects/${groupId}?category=${categoryId}`);
  };

  const handleGroupClick = () => {
    const groupId = type === 'freelancer' ? 'freelancer' : 'client';
    navigate(`/projects/${groupId}`);
  };

  const project = {
    project_id: Number(projectId) || 0,
    title: '프로젝트 제목',
    budget: 100000,
    author: '작성자',
    rating: 4.5,
    reviews: 123,
    groupId: type === 'freelancer' ? 'freelancer' : 'client',
    categoryId: category || 'all',
  };

  const profile = {
    profile_id: 1,
    user_id: 1,
    title: type === 'freelancer' ? '프리랜서 프로필' : '클라이언트 프로필',
    description: '',
    skills: ['JavaScript', 'React'],
    hourly_rate: 50000,
  };

  const favorite = { favorite: 12 };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 카테고리 영역 */}
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleGroupClick}
              className="px-2 font-semibold text-[24px] text-[#666666] hover:underline hover:decoration-[#666666]"
            >
              {type === 'freelancer' ? '프리랜서' : '클라이언트'}
            </button>
            <span className="mx-1 text-[28px] text-[#666666]">›</span>
            <button
              onClick={handleCategoryClick}
              className="px-2 font-semibold text-[24px] text-[#666666] hover:underline hover:decoration-[#666666]"
            >
              {categoryNames[category || 'all']}
            </button>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <ProjectInfo project={project} profile={profile} favorite={favorite} />

      {/* 탭 버튼 */}
      <div className="flex gap-4 p-4 max-w-6xl mx-auto font-medium text-[20px]">
        <button
          className={` py-2 rounded ${activeTab === 'service' ? 'text-[#2c2c2c]' : 'text-[#666666]'}`}
          onClick={() => setActiveTab('service')}
        >
          서비스 설명
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'review' ? 'text-[#2c2c2c]' : 'text-[#666666]'}`}
          onClick={() => setActiveTab('review')}
        >
          리뷰
        </button>
      </div>

      <hr className="border-t border-gray-300  max-w-6xl mx-auto" />

      {/* 하단 내용 */}
      <div className="max-w-6xl mx-auto p-4">
        {activeTab === 'service' && <ServiceInfo />}
        {activeTab === 'review' && <ProjectReview />}
      </div>
    </div>
  );
}
