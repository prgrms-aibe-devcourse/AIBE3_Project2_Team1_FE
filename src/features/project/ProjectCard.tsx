import { useNavigate } from 'react-router-dom';
import starImg from '../../assets/images/fluent-color_star-16.png';

interface ProjectCardProps {
  projectId: number;
  title: string;
  budget: number;
  initiatorNickname: string;
  category: string;
  groupType: string;
  imageUrls?: { id: number; fileUrl: string }[];
}

export default function ProjectCard({
  projectId,
  title,
  budget,
  initiatorNickname,
  category,
  imageUrls,
}: ProjectCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${projectId}`);
  };

  const thumbnail = imageUrls?.[0]?.fileUrl;

  return (
    <div
      onClick={handleClick}
      className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer bg-white"
    >
      {/* 썸네일 */}
      {thumbnail ? (
        <img src={thumbnail} alt={title} className="w-full h-36 object-cover rounded-md mb-3" />
      ) : (
        <div className="w-full h-36 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
          <span className="text-gray-400 text-sm">이미지 없음</span>
        </div>
      )}

      {/* 카테고리 */}
      <p className="text-xs text-gray-400 font-semibold mb-1">{category || '기타'}</p>

      {/* 제목 */}
      <p className="text-sm font-semibold mb-1 truncate">{title || '프로젝트 제목'}</p>

      {/* 평점 + 리뷰 (임시 하드코딩) */}
      <div className="flex items-center text-xs text-gray-500 mb-1 gap-1">
        <img src={starImg} alt="star" className="w-4 h-4" />
        <span>4.8</span>
        <span>(85)</span>
      </div>

      {/* 예산 */}
      <p className="text-sm font-semibold text-[#1ABC9C] mb-1">
        {budget ? `${budget.toLocaleString()}원~` : '150,000원~'}
      </p>

      {/* 작성자 */}
      <p className="text-xs text-gray-400">{initiatorNickname || '홍길동'}</p>
    </div>
  );
}
