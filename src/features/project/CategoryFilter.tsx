import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import arrowImg from '../../assets/images/Expand Arrow.png';

interface Card {
  project_id: number;
  title: string;
  budget: number;
  author: string;
  rating: number;
  reviews: number;
  groupId: string;
  categoryId: string;
}

const cards: Card[] = [
  {
    project_id: 1,
    title: '영상 촬영 프로젝트',
    rating: 4.6,
    reviews: 1222,
    budget: 140000,
    author: '스튜디오 포토칩',
    groupId: 'client',
    categoryId: 'video',
  },
  {
    project_id: 2,
    title: '웹 개발 프리랜서',
    rating: 4.8,
    reviews: 540,
    budget: 300000,
    author: '개발자 김철수',
    groupId: 'freelancer',
    categoryId: 'it',
  },
  {
    project_id: 3,
    title: '문서 작성 의뢰',
    rating: 4.5,
    reviews: 320,
    budget: 50000,
    author: '글쓰기 스튜디오',
    groupId: 'client',
    categoryId: 'write',
  },
  {
    project_id: 4,
    title: '마케팅 컨설팅',
    rating: 4.7,
    reviews: 210,
    budget: 200000,
    author: '마케팅 전문가',
    groupId: 'freelancer',
    categoryId: 'marketing',
  },
];

interface Category {
  id: string;
  name: string;
}

interface CategoryGroup {
  groupId: string;
  groupName: string;
  categories: Category[];
}

const commonCategories: Category[] = [
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

const categoryGroups: CategoryGroup[] = [
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

export default function CategoryFilter({
  initialGroup = 'client',
  initialCategory = 'all',
}: {
  initialGroup?: string;
  initialCategory?: string;
}) {
  const [selectedGroup, setSelectedGroup] = useState<string>(initialGroup);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortOption, setSortOption] = useState<string>('latest');

  // initialGroup/initialCategory가 변경될 때 상태 업데이트
  useEffect(() => {
    setSelectedGroup(initialGroup);
    setSelectedCategory(initialCategory);
  }, [initialGroup, initialCategory]);

  const filteredCards = cards
    .filter(
      (card) =>
        card.groupId === selectedGroup &&
        (selectedCategory === 'all' || card.categoryId === selectedCategory)
    )
    .sort((a, b) => {
      if (sortOption === 'latest') return b.project_id - a.project_id; // 최신순
      if (sortOption === 'highBudget') return b.budget - a.budget; // 높은 금액순
      if (sortOption === 'lowBudget') return a.budget - b.budget; // 낮은 금액순
      return 0;
    });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* 그룹 버튼 */}
        <div className="flex gap-2 flex-wrap">
          {categoryGroups.map((group) => (
            <button
              key={group.groupId}
              onClick={() => {
                setSelectedGroup(group.groupId);
                setSelectedCategory('all'); // 그룹 변경 시 카테고리 초기화
              }}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedGroup === group.groupId
                  ? 'bg-[#1ABC9C] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {group.groupName}
            </button>
          ))}
        </div>
      </div>

      {/* 카테고리 버튼 */}
      <div className="flex flex-wrap gap-2">
        {categoryGroups
          .find((group) => group.groupId === selectedGroup)
          ?.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[#FF6B6B] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
      </div>

      {/* 정렬 드롭다운 */}
      <div className="flex justify-end mt-4">
        <div className="relative inline-block text-left">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-[14px] bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] cursor-pointer"
          >
            <option value="latest">최신순</option>
            <option value="highBudget">높은 금액순</option>
            <option value="lowBudget">낮은 금액순</option>
          </select>
          {/* 화살표 아이콘 */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
            <img src={arrowImg} alt="arrow" className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 카드 영역 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {filteredCards.map((card) => (
          <ProjectCard
            key={card.project_id}
            project_id={card.project_id}
            title={card.title}
            rating={card.rating}
            reviews={card.reviews}
            budget={card.budget}
            author={card.author}
            groupId={card.groupId}
            categoryId={card.categoryId}
          />
        ))}
        {filteredCards.length === 0 && (
          <div className="col-span-full flex justify-center items-center h-40">
            <p className="text-gray-500 text-[20px] font-light">
              선택한 카테고리에 해당하는 카드가 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
