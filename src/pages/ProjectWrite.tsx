import React, { useState } from 'react';
import axios from 'axios';

const commonCategories = [
  { id: 'VIDEO', name: '영상/사진/음향' },
  { id: 'WRITE', name: '문서/글쓰기' },
  { id: 'IT', name: 'IT/프로그래밍' },
  { id: 'MARKETING', name: '마케팅' },
  { id: 'HOBBY', name: '취미 레슨' },
  { id: 'TAX', name: '세무/법무/노무' },
  { id: 'STARTUP', name: '창업/사업' },
  { id: 'TRANSLATE', name: '번역/통역' },
];

const categoryGroups = [
  { groupId: 'client', groupName: '클라이언트', categories: commonCategories },
  { groupId: 'freelancer', groupName: '프리랜서', categories: commonCategories },
];

export default function WritePage() {
  const [role, setRole] = useState('freelancer');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');

  const currentGroup = categoryGroups.find((g) => g.groupId === role);
  const categories = currentGroup ? currentGroup.categories : [];

  const handleSubmit = async () => {
    if (!title || !content || !category) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const projectData = {
      title,
      description: content,
      budget: Number(budget) || 0,
      deadline: deadline || null,
      category, // ENUM 문자열 (예: "VIDEO", "WRITE")
    };

    try {
      const response = await axios.post('http://localhost:8080/api/v1/projects', projectData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      alert('프로젝트가 등록되었습니다!');
      console.log('등록 성공:', response.data);
    } catch (error) {
      console.error('등록 실패:', error);
      alert('프로젝트 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <div className="w-[1000px] bg-white rounded-[20px] shadow-md p-8">
        {/* 역할 선택 */}
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

          {/* 제목 */}
          <input
            type="text"
            placeholder="프로젝트 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-[12px] px-3 py-2 mb-3"
          />

          {/* 예산 */}
          <input
            type="number"
            placeholder="예산"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full border border-gray-300 rounded-[12px] px-3 py-2 mb-3"
          />

          {/* 마감일 */}
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full border border-gray-300 rounded-[12px] px-3 py-2 mb-3"
          />

          {/* 카테고리 선택 */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-[150px] h-[40px] px-4 border border-gray-300 rounded-[13px] text-[15px] font-medium text-gray-700 bg-white appearance-none"
          >
            <option value="">카테고리 선택</option>
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
          <button
            onClick={handleSubmit}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-[15px] font-semibold text-[18px]"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
