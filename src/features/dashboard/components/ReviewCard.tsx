interface ReviewCardProps {
  image?: string | null;
  title: string;
  comment: string;
  rating: number;
  onWriteClick?: () => void; // 여기에 추가
}

const ReviewCard = ({ image, title, comment, rating, onWriteClick }: ReviewCardProps) => {
  return (
    <div className="w-[200px] flex flex-col items-start border rounded-md p-3">
      <div className="w-full h-[120px] bg-gray-200 rounded-md mb-2 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="object-cover w-full h-full rounded-md" />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{comment}</p>
      <p className="text-yellow-400 font-bold mt-1">{rating} ★</p>
      {onWriteClick && (
        <button
          onClick={onWriteClick}
          className="mt-2 px-3 py-1 text-white bg-teal-500 rounded-md text-xs hover:bg-teal-600"
        >
          리뷰 쓰기
        </button>
      )}
    </div>
  );
};

export default ReviewCard;
