import { useNavigate } from 'react-router-dom';
import starImg from '../../assets/images/fluent-color_star-16.png';

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

  const handleClick = () => {
    navigate(`/project/${project_id}?type=${groupId}&category=${categoryId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="h-[340px] w-[320px] rounded hover:bg-[#f2f2f2] hover:rounded-[20px] flex flex-col justify-center items-center p-2"
    >
      <div>
        <div
          className="bg-gray-200 h-[190px] w-[280px] mb-2 rounded-[20px] flex items-center justify-center"
          role="img"
          aria-label="프로젝트 이미지 로딩 중"
        >
          <span className="text-gray-400 text-sm">이미지 없음</span>
        </div>
        <h3 className="font-pretendard font-semibold text-[24px]">{title}</h3>
        <div className="flex items-center gap-1">
          <img src={starImg} alt="star" className="w-4 h-4" />
          <div className="text-sm text-[#666666]">
            {rating.toFixed(1)} ({reviews.toLocaleString()})
          </div>
        </div>
        <div>{budget}원~</div>
        <div className="text-[#666666]">| {author}</div>
      </div>
    </div>
  );
}
