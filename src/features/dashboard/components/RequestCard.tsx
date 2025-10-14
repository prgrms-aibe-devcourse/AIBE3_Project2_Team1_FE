import { useNavigate } from 'react-router-dom';

interface RequestCardProps {
  id: number;
  title: string;
}

const RequestCard = ({ id, title }: RequestCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/proposal/${id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full h-[98px] flex-shrink-0 border rounded-lg flex items-center justify-between px-4 bg-gray-200 hover:bg-gray-300 transition-colors"
    >
      <p className="font-pretendard text-[32px] font-semibold text-color-3">{title}</p>
      <span className="text-gray-500 text-sm font-medium">자세히 보기 →</span>
    </button>
  );
};

export default RequestCard;
