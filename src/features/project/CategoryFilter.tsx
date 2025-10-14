import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import { categoryGroups } from './constants/categories';

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

  useEffect(() => {
    if (groupId) setSelectedGroup(groupId);
    setSelectedCategory(categoryId || 'ALL');
  }, [groupId, categoryId]);

  const cards = [
    {
      project_id: 1,
      title: '영상 촬영 프로젝트',
      rating: 4.6,
      reviews: 1222,
      budget: 140000,
      author: '스튜디오 포토칩',
      groupId: 'client',
      categoryId: 'VIDEO',
    },
    {
      project_id: 2,
      title: '웹 개발 프리랜서',
      rating: 4.8,
      reviews: 540,
      budget: 300000,
      author: '개발자 김철수',
      groupId: 'freelancer',
      categoryId: 'IT',
    },
    {
      project_id: 3,
      title: '문서 작성 의뢰',
      rating: 4.5,
      reviews: 320,
      budget: 50000,
      author: '글쓰기 스튜디오',
      groupId: 'client',
      categoryId: 'WRITE',
    },
  ];

  const handleGroupClick = (group: string) => {
    setSelectedGroup(group);
    setSelectedCategory('ALL');
    navigate(`/projects/${group}`);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    navigate(`/projects/${selectedGroup}/${category}`);
  };

  const filteredCards = cards
    .filter(
      (card) =>
        card.groupId === selectedGroup &&
        (selectedCategory === 'ALL' || card.categoryId === selectedCategory)
    )
    .sort((a, b) => {
      if (sortOption === 'latest') return b.project_id - a.project_id;
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

      {/* 카드 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCards.length ? (
          filteredCards.map((card) => <ProjectCard key={card.project_id} {...card} />)
        ) : (
          <p className="text-gray-500 text-center col-span-full py-10">
            선택한 카테고리에 해당하는 카드가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
