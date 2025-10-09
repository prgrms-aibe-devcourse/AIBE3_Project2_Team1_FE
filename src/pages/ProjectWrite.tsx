import React, { useState } from 'react';

// 카테고리 데이터
const commonCategories = [
  { id: 'all', name: '전체' },
  { id: 'video', name: '영상/사진/음향' },
  { id: 'write', name: '문서/글쓰기' },
  { id: 'it', name: 'IT/프로그래밍' },
  { id: 'marketing', name: '마케팅' },
  { id: 'hobby', name: '취미 레슨' },
  { id: 'tax', name: '세무/법무/노무' },
  { id: 'startup', name: '창업/사업' },
  { id: 'translate', name: '번역/통역' },
];

const categoryGroups = [
  {
    groupId: 'client',
    groupName: '클라이언트',
    categories: commonCategories,
  },
  {
    groupId: 'freelancer',
    groupName: '프리랜서',
    categories: commonCategories,
  },
];

export default function WritePage() {
  const [role, setRole] = useState('freelancer'); // 'client' or 'freelancer'
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

  // 현재 역할에 따른 카테고리 목록 가져오기
  const currentGroup = categoryGroups.find((g) => g.groupId === role);
  const categories = currentGroup ? currentGroup.categories : [];

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <div className="w-[1000px] h-[500px] bg-white rounded-[20px] shadow-md p-8">
        {/* 역할 선택 + 카테고리 왼쪽 정렬 */}
        <div className="flex flex-col items-start mb-4">
          <div className="flex gap-2 mb-3">
            <button
              className={`px-3 py-1 rounded-full text-[18px] border-[2px] ${
                role === 'client' ? 'border-red-400 text-red-500' : 'border-gray-300 text-gray-500'
              }`}
              onClick={() => setRole('client')}
            >
              클라이언트
            </button>
            <button
              className={`px-3 py-1 rounded-full text-[18px] border-[2px] ${
                role === 'freelancer'
                  ? 'border-red-400 text-red-500'
                  : 'border-gray-300 text-gray-500'
              }`}
              onClick={() => setRole('freelancer')}
            >
              프리랜서
            </button>
          </div>

          {/* 카테고리 선택 */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-48 px-3 py-[20px] border border-gray-300 rounded-md bg-gray-100 text-sm"
          >
            <option value="">카테고리</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* 내용 입력 */}
        <textarea
          placeholder="내용을 입력하세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-48 border border-gray-200 rounded-xl bg-gray-100 p-4 text-sm mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
        />

        {/* 등록 버튼 */}
        <div className="flex justify-end">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-[15px] font-semibold text-[18px]">
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
