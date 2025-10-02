interface RequestCardProps {
  title: string;
  onClick?: () => void;
}

const RequestCard = ({ title, onClick }: RequestCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full h-[98px] flex-shrink-0 border rounded-lg flex items-center justify-between px-4 bg-gray-200"
    >
      <p className="font-pretendard text-[32px] font-semibold text-color-3">{title}</p>
      <span className="text-gray-400 text-xs">자세히 보기 →</span>
    </button>
  );
};

export default RequestCard;
