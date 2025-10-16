import { useNavigate } from 'react-router-dom';

interface ProposalCardProps {
  id: number;
  title: string;
  status: string;
}

const ProposalCard = ({ id, title, status }: ProposalCardProps) => {
  const navigate = useNavigate();

  // 상태 구분
  const isDraft = status === 'DRAFT';
  const isSubmitted = status === 'SUBMITTED';
  const isRejected = status === 'REJECTED';

  const handleClick = () => {
    if (isDraft) {
      navigate(`/proposal/${id}/draft`);
    } else {
      navigate(`/proposal/${id}`);
    }
  };

  // 상태별 스타일 및 제목 prefix
  let bgColor = 'bg-gray-200 hover:bg-gray-300';
  let prefix = '';

  if (isDraft) {
    bgColor = 'bg-green-200 hover:bg-green-300';
    prefix = '임시 - ';
  } else if (isSubmitted) {
    bgColor = 'bg-purple-200 hover:bg-purple-300';
    prefix = '수락됨 - ';
  } else if (isRejected) {
    bgColor = 'bg-red-200 hover:bg-red-300';
    prefix = '거절됨 - ';
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full h-[98px] flex-shrink-0 border rounded-lg flex items-center justify-between px-4 transition-colors ${bgColor}`}
    >
      <p className="font-pretendard text-[32px] font-semibold text-color-3">
        {prefix}
        {title}
      </p>
      <span className="text-gray-500 text-sm font-medium">자세히 보기 →</span>
    </button>
  );
};

export default ProposalCard;
