import { Star } from 'lucide-react';

interface ReviewCardProps {
  image?: string | null;
  title: string;
  comment: string;
  rating: number;
}

const ReviewCard = ({ image, title, comment, rating }: ReviewCardProps) => {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));

  return (
    <div className="w-full max-w-[420px] flex items-start gap-4 p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
      {/* 이미지 영역 */}
      <div className="w-[100px] h-[80px] bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="object-cover w-full h-full rounded-md" />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col text-left flex-1">
        <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>

        {/* 별점 */}
        <div className="flex items-center mb-1">
          {stars.map((filled, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>

        {/* 리뷰 내용 */}
        <p className="text-sm text-gray-600 line-clamp-3">{comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
