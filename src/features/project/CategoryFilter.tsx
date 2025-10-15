import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import { categoryGroups } from './constants/categories';
import { AxiosError } from 'axios';
import api from './api';

interface Project {
  projectId: number;
  title: string;
  budget: number;
  initiatorNickname: string;
  participantNickname?: string;
  category: string;
  status: string;
  rating?: number;
  reviews?: number;
  groupType: string;
  imageUrls?: { id: number; fileUrl: string }[];
}

export default function CategoryFilter({
  initialGroup = 'client',
  initialCategory = 'ALL',
}: {
  initialGroup?: string;
  initialCategory?: string;
}) {
  const navigate = useNavigate();
  const { groupId, categoryId } = useParams<{ groupId?: string; categoryId?: string }>();

  const [selectedGroup, setSelectedGroup] = useState(groupId || initialGroup);
  const [selectedCategory, setSelectedCategory] = useState(categoryId || initialCategory);
  const [sortOption, setSortOption] = useState('latest');

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ URL 파라미터 변경 시 상태 반영
  useEffect(() => {
    if (groupId) setSelectedGroup(groupId);
    setSelectedCategory(categoryId || 'ALL');
  }, [groupId, categoryId]);

  // ✅ 서버에서 프로젝트 전체 조회
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/projects');
        const data = res.data.data || res.data;
        setProjects(data);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.error('프로젝트 목록 불러오기 실패:', err.response?.data || err.message);
          setError(err.response?.data?.message || '프로젝트 목록을 불러오지 못했습니다.');
        } else {
          console.error('예상치 못한 에러:', err);
          setError('알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleGroupClick = (group: string) => {
    setSelectedGroup(group);
    setSelectedCategory('ALL');
    navigate(`/projects/${group}`);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    navigate(`/projects/${selectedGroup}/${category}`);
  };

  // ✅ groupType, category 기반 필터링
  const filteredProjects = projects
    .filter((project) => {
      const matchesGroup =
        selectedGroup === 'client'
          ? project.groupType === 'CLIENT'
          : project.groupType === 'FREELANCER';
      const matchesCategory =
        selectedCategory === 'ALL' ||
        project.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesGroup && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === 'latest') return b.projectId - a.projectId;
      if (sortOption === 'highBudget') return b.budget - a.budget;
      if (sortOption === 'lowBudget') return a.budget - b.budget;
      return 0;
    });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* 그룹 버튼 */}
      <div className="flex gap-2 mb-4">
        {categoryGroups.map((group) => (
          <button
            key={group.groupId}
            onClick={() => handleGroupClick(group.groupId)}
            className={`px-4 py-2 rounded-full ${
              selectedGroup === group.groupId
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {group.groupName}
          </button>
        ))}
      </div>

      {/* 카테고리 버튼 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categoryGroups
          .find((g) => g.groupId === selectedGroup)
          ?.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === cat.id ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
      </div>

      {/* 정렬 */}
      <div className="flex justify-end mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded-[14px] px-3 py-2"
        >
          <option value="latest">최신순</option>
          <option value="highBudget">높은 금액순</option>
          <option value="lowBudget">낮은 금액순</option>
        </select>
      </div>

      {/* 로딩 / 에러 / 목록 */}
      {loading ? (
        <p className="text-gray-500 text-center py-10">로딩 중...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-10">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProjects.length ? (
            filteredProjects.map((p) => (
              <ProjectCard
                key={p.projectId}
                projectId={p.projectId}
                title={p.title}
                budget={p.budget}
                initiatorNickname={p.initiatorNickname}
                category={p.category}
                groupType={p.groupType}
                imageUrls={p.imageUrls}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full py-10">
              선택한 카테고리에 해당하는 프로젝트가 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
