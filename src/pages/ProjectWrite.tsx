import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../features/project/api';
import { categoryGroups } from '../features/project/constants/categories';
import type { CategoryId } from '../features/project/constants/categories';
import axios from 'axios';

export default function WritePage() {
  const navigate = useNavigate();
  const role: 'client' | 'freelancer' = 'freelancer';
  const [category, setCategory] = useState<CategoryId | ''>('');
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

    const parsedBudget = Number(budget);
    if (!Number.isFinite(parsedBudget) || parsedBudget < 0) {
      alert('예산은 0 이상의 숫자여야 합니다.');
      return;
    }

    const projectData = {
      title,
      description: content,
      budget: parsedBudget,
      deadline: deadline || null,
      category,
      role,
    };

    console.log('보내는 데이터:', JSON.stringify(projectData, null, 2));

    try {
      const res = await api.post('/projects', projectData);
      console.log('서버 응답:', res.data);

      const createdProjectId = res.data?.data?.projectId || res.data?.id || res.data?.projectId;

      if (createdProjectId) {
        alert('프로젝트 등록 완료!');
        navigate(`/project/${createdProjectId}`);
      } else {
        alert('등록은 성공했지만 프로젝트 ID를 찾을 수 없습니다.');
      }
    } catch (err: unknown) {
      console.error('등록 실패:', err);
      if (axios.isAxiosError(err)) {
        console.error('서버 응답 상태:', err.response?.status);
        console.error('서버 응답 내용:', err.response?.data);
        alert(`등록 실패: ${err.response?.data?.message || '서버 오류'}`);
      } else {
        // axios 에러가 아니면
        alert('서버 연결 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <div className="w-[1000px] bg-white rounded-[20px] shadow-md p-8">
        {/* 역할 선택 */}
        <div className="flex flex-col items-start mb-4">
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
            onChange={(e) => setCategory(e.target.value as CategoryId)}
            className="w-[150px] h-[40px] px-4 border border-gray-300 rounded-[13px] text-[15px] font-medium text-gray-700 bg-white appearance-none"
          >
            <option value="">카테고리 선택</option>
            {categories
              .filter((c) => c.id !== 'ALL')
              .map((c) => (
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
