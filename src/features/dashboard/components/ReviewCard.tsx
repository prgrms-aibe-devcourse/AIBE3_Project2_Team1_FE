import { useNavigate } from 'react-router-dom';

interface ReviewCardProps {
  image: string;
  title: string;
  buttonLabel?: string;
}

const ReviewCard = ({ image, title, buttonLabel = '리뷰 쓰기' }: ReviewCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/review?title=${encodeURIComponent(title)}&image=${encodeURIComponent(image)}`);
  };

  return (
    <div className="w-[200px] flex flex-col items-center text-center">
      <div className="w-[160px] h-[120px] bg-gray-200 rounded-md mb-2 flex items-center justify-center overflow-hidden">
        <img src={image} alt={title} className="object-cover w-full h-full rounded-md" />
      </div>
      <p className="mb-2 text-sm">{title}</p>
      <button
        onClick={handleClick}
        className="px-3 py-1 text-white bg-teal-500 rounded-md text-sm hover:bg-teal-600 transition"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default ReviewCard;
