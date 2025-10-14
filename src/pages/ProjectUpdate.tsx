import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../features/project/api';
import { categoryGroups } from '../features/project/constants/categories';
import type { CategoryId } from '../features/project/constants/categories';
import axios from 'axios';

export default function ProjectUpdate() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const role: 'client' | 'freelancer' = 'freelancer';
  const [category, setCategory] = useState<CategoryId | ''>('');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');

  const currentGroup = categoryGroups.find((g) => g.groupId === role);
  const categories = currentGroup ? currentGroup.categories : [];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${projectId}`);
        const data = res.data?.data ?? res.data;
        setTitle(data.title || '');
        setContent(data.description || '');
        setBudget(data.budget?.toString() || '');
        setDeadline(data.deadline || '');
        setCategory(data.category || '');
      } catch (err) {
        console.error('프로젝트 불러오기 실패:', err);
        alert('프로젝트 정보를 불러오지 못했습니다.');
        navigate(-1);
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  // ✅ 수정 제출
  const handleUpdate = async () => {
    if (!title || !content || !category) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const res = await api.put(`/projects/${projectId}`, {
        title,
        description: content,
        budget: Number(budget),
        deadline: deadline || null,
        category,
      });

      console.log('수정 완료:', res.data);
      alert('프로젝트가 수정되었습니다!');
      navigate(`/project/${projectId}`);
    } catch (err: unknown) {
      console.error('수정 실패:', err);
      if (axios.isAxiosError(err)) {
        alert(`수정 실패: ${err.response?.data?.message || '서버 오류'}`);
      } else {
        alert('서버 연결 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <div className="w-[1000px] bg-white rounded-[20px] shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">프로젝트 수정</h2>

        <input
          type="text"
          placeholder="프로젝트 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-[12px] px-3 py-2 mb-3"
        />

        <input
          type="number"
          placeholder="예산"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full border border-gray-300 rounded-[12px] px-3 py-2 mb-3"
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full border border-gray-300 rounded-[12px] px-3 py-2 mb-3"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryId)}
          className="w-[150px] h-[40px] px-4 border border-gray-300 rounded-[13px] text-[15px] font-medium text-gray-700 bg-white appearance-none mb-4"
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

        <textarea
          placeholder="내용을 입력하세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-48 border border-gray-200 rounded-xl bg-gray-100 p-4 text-sm mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-[12px] font-medium bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            취소
          </button>
          <button
            onClick={handleUpdate}
            className="px-6 py-2 rounded-[12px] font-semibold bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
}
