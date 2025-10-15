import { useNavigate } from 'react-router-dom';

interface ProposalCardProps {
  id: number;
  title: string;
  status: string;
}

const ProposalCard = ({ id, title, status }: ProposalCardProps) => {
  const navigate = useNavigate();
  const isDraft = status === 'DRAFT';

  const handleClick = () => {
    // ✅ 상태가 DRAFT면 draft 페이지로 이동
    if (isDraft) {
      navigate(`/proposal/${id}/draft`);
    } else {
      navigate(`/proposal/${id}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full h-[98px] flex-shrink-0 border rounded-lg flex items-center justify-between px-4 transition-colors ${
        isDraft
          ? 'bg-green-200 hover:bg-green-300' // ✅ 임시 저장 제안서: 녹색
          : 'bg-gray-200 hover:bg-gray-300' // 기본 제안서: 회색
      }`}
    >
      <p className="font-pretendard text-[32px] font-semibold text-color-3">
        {isDraft ? '임시 - ' : ''}
        {title}
      </p>
      <span className="text-gray-500 text-sm font-medium">자세히 보기 →</span>
    </button>
  );
};

export default ProposalCard;
