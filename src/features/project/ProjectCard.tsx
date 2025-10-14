import { useNavigate } from 'react-router-dom';
import starImg from '../../assets/images/fluent-color_star-16.png';
import { categoryGroups } from './constants/categories';

interface ProjectCardProps {
  project_id: number;
  title: string;
  budget: number;
  author: string;
  rating: number;
  reviews: number;
  groupId: string;
  categoryId: string;
}

export default function ProjectCard({
  project_id,
  title,
  rating,
  reviews,
  budget,
  author,
  groupId,
  categoryId,
}: ProjectCardProps) {
  const navigate = useNavigate();

  const categoryName =
    categoryGroups.find((g) => g.groupId === groupId)?.categories.find((c) => c.id === categoryId)
      ?.name || '기타';

  const handleClick = () => {
    navigate(`/project/${project_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer bg-white"
    >
      {/* 썸네일 */}
      <div className="w-full h-36 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
        <span className="text-gray-400 text-sm">이미지 없음</span>
      </div>

      {/* 카테고리 */}
      <p className="text-xs text-gray-400 font-semibold mb-1">{categoryName}</p>

      {/* 제목 */}
      <p className="text-sm font-semibold mb-1 truncate">{title || '프로젝트 제목'}</p>

      {/* 평점 + 리뷰 */}
      <div className="flex items-center text-xs text-gray-500 mb-1 gap-1">
        <img src={starImg} alt="star" className="w-4 h-4" />
        <span>{rating ? rating.toFixed(1) : '4.6'}</span>
        <span>({reviews?.toLocaleString() || 100})</span>
      </div>

      {/* 예산 */}
      <p className="text-sm font-semibold text-[#1ABC9C] mb-1">
        {budget ? `${budget.toLocaleString()}원~` : '150,000원~'}
      </p>

      {/* 작성자 */}
      <p className="text-xs text-gray-400">{author || '홍길동'}</p>
    </div>
  );
}
