interface ProjectImage {
  id: number;
  fileUrl: string;
}

interface Project {
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  client?: string;
  freelancer?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  imageUrls?: ProjectImage[];
}

interface ServiceInfoProps {
  project: Project | null;
}

export default function ServiceInfo({ project }: ServiceInfoProps) {
  if (!project) {
    return <div className="text-center text-gray-500 py-10">프로젝트 정보를 불러오는 중...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-50">
      <div className="w-[1000px] bg-white rounded-[20px] shadow-md p-8">
        {/* 제목 */}
        <h1 className="text-2xl font-bold mb-6">{project.title}</h1>

        {/* 기본 정보 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-gray-500 text-sm mb-1">카테고리</p>
            <p className="text-lg font-semibold">{project.category}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">예산</p>
            <p className="text-lg font-semibold">{project.budget?.toLocaleString()} 원</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">마감일</p>
            <p className="text-lg font-semibold">{project.deadline}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">상태</p>
            <p
              className={`text-lg font-semibold ${
                project.status === 'OPEN'
                  ? 'text-emerald-500'
                  : project.status === 'IN_PROGRESS'
                    ? 'text-yellow-500'
                    : 'text-gray-400'
              }`}
            >
              {project.status}
            </p>
          </div>
        </div>

        {/* 참여자 정보 */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h2 className="font-semibold text-lg">참여자 정보</h2>
          <div className="flex justify-start gap-6 mt-2">
            <div>
              <p className="text-gray-500 text-sm">클라이언트</p>
              <p className="font-semibold">{project.client || '미정'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">프리랜서</p>
              <p className="font-semibold">{project.freelancer || '미정'}</p>
            </div>
          </div>
        </div>

        {/* 원본 S3 이미지 표시 섹션 */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">프로젝트 이미지</h2>
          {project.imageUrls && project.imageUrls.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {project.imageUrls.map((img) => (
                <img
                  key={img.id}
                  src={img.fileUrl}
                  alt={`project-${img.id}`}
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    console.error('이미지 로드 실패:', img.fileUrl);
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">등록된 이미지가 없습니다.</p>
          )}
        </div>

        {/* 설명 */}
        <div>
          <h2 className="font-semibold text-lg mb-2">프로젝트 설명</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{project.description}</p>
        </div>
      </div>
    </div>
  );
}
