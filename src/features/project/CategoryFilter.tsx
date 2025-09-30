import { useState } from 'react';
import ProjectCard from './ProjectCard';

interface Card {
  id: number;
  title: string;
  rating: number;
  reviews: number;
  price: string;
  author: string;
  groupId: string;
  categoryId: string;
}

const cards: Card[] = [
  {
    id: 1,
    title: '영상 촬영 프로젝트',
    rating: 4.6,
    reviews: 1222,
    price: '140,000원~',
    author: '스튜디오 포토칩',
    groupId: 'client',
    categoryId: 'video',
  },
  {
    id: 2,
    title: '웹 개발 프리랜서',
    rating: 4.8,
    reviews: 540,
    price: '300,000원~',
    author: '개발자 김철수',
    groupId: 'freelancer',
    categoryId: 'it',
  },
  {
    id: 3,
    title: '문서 작성 의뢰',
    rating: 4.5,
    reviews: 320,
    price: '50,000원~',
    author: '글쓰기 스튜디오',
    groupId: 'client',
    categoryId: 'write',
  },
  {
    id: 4,
    title: '마케팅 컨설팅',
    rating: 4.7,
    reviews: 210,
    price: '200,000원~',
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

const categoryGroups: CategoryGroup[] = [
  {
    groupId: 'client',
    groupName: '클라이언트',
    categories: [
      { id: 'all', name: '전체' },
      { id: 'video', name: '영상/사진/음향' },
      { id: 'write', name: '문서/글쓰기' },
      { id: 'it', name: 'IT/프로그래밍' },
      { id: 'marketing', name: '마케팅' },
      { id: 'hobby', name: '취미 레슨' },
      { id: 'tax', name: '세무/법무/노무' },
      { id: 'startup', name: '창업/사업' },
      { id: 'translate', name: '번역/통역' },
    ],
  },
  {
    groupId: 'freelancer',
    groupName: '프리랜서',
    categories: [
      { id: 'all', name: '전체' },
      { id: 'video', name: '영상/사진/음향' },
      { id: 'write', name: '문서/글쓰기' },
      { id: 'it', name: 'IT/프로그래밍' },
      { id: 'marketing', name: '마케팅' },
      { id: 'hobby', name: '취미 레슨' },
      { id: 'tax', name: '세무/법무/노무' },
      { id: 'startup', name: '창업/사업' },
      { id: 'translate', name: '번역/통역' },
    ],
  },
];

export default function CategoryFilter() {
  const [selectedGroup, setSelectedGroup] = useState<string>('project');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCards = cards.filter(
    (card) =>
      card.groupId === selectedGroup &&
      (selectedCategory === 'all' || card.categoryId === selectedCategory)
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* 그룹 버튼 */}
      <div className="flex gap-4 mb-4">
        {categoryGroups.map((group) => (
          <button
            key={group.groupId}
            onClick={() => {
              setSelectedGroup(group.groupId);
              setSelectedCategory('all'); // 그룹 변경 시 카테고리 초기화
            }}
            className={`px-4 py-2 rounded-full font-medium ${
              selectedGroup === group.groupId
                ? 'bg-[#1ABC9C] text-[#F2F2F2]'
                : 'bg-gray-100 text-[#2C2C2C] hover:bg-gray-200'
            }`}
          >
            {group.groupName}
          </button>
        ))}
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
                  ? 'bg-[#FF6B6B] text-[#F2F2F2]'
                  : 'bg-gray-100 text-[#2C2C2C] hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
      </div>

      {/* 카드 영역 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {filteredCards.map((card) => (
          <ProjectCard
            key={card.id}
            title={card.title}
            rating={card.rating}
            reviews={card.reviews}
            price={card.price}
            author={card.author}
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
