import React from 'react';

export default function ServiceInfo({ project }) {
  // project prop 예시:
  // {
  //   title: "로고 디자인 의뢰",
  //   description: "스타트업 로고를 만들어 주세요!",
  //   category: "DESIGN",
  //   budget: 300000,
  //   deadline: "2025-10-20",
  //   client: "이해민",
  //   freelancer: "김수민",
  //   status: "OPEN"
  // }

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

        {/* 설명 */}
        <div>
          <h2 className="font-semibold text-lg mb-2">프로젝트 설명</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{project.description}</p>
        </div>
      </div>
    </div>
  );
}
