import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ProjectInfo from '../features/project/ProjectInfo';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type'); // freelancer / client
  const category = searchParams.get('category'); // 카테고리

  const navigate = useNavigate();

  // 카테고리 이름 매핑
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

  // 카테고리 버튼 클릭 → 카테고리 목록으로 이동
  const handleCategoryClick = () => {
    const groupId = type === 'freelancer' ? 'freelancer' : 'client';
    const categoryId = category || 'all';
    navigate(`/projects/${groupId}?category=${categoryId}`);
  };

  // 그룹 버튼 클릭 → 그룹별 목록으로 이동
  const handleGroupClick = () => {
    const groupId = type === 'freelancer' ? 'freelancer' : 'client';
    navigate(`/projects/${groupId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 카테고리 필터 영역 */}
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {/* 그룹 버튼 */}
            <button
              onClick={handleGroupClick}
              className="px-2 font-semibold text-[24px] transition text-[#666666] hover:underline hover:decoration-[#666666]"
            >
              {type === 'freelancer' ? '프리랜서' : '클라이언트'}
            </button>

            {/* 구분자 */}
            <span className="mx-1 text-[28px] text-[#666666]">›</span>

            {/* 카테고리 버튼 */}
            <button
              onClick={handleCategoryClick}
              className="px-2 font-semibold text-[24px] transition text-[#666666] hover:underline hover:decoration-[#666666]"
            >
              {categoryNames[category || 'all']}
            </button>
          </div>
        </div>
      </div>

      {/* 상세 정보 영역 */}
      {(() => {
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

        return <ProjectInfo project={project} profile={profile} favorite={favorite} />;
      })()}
    </div>
  );
}
