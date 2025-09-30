import starImg from '../../assets/images/fluent-color_star-16.png';

interface ProjectCardProps {
  title: string;
  rating: number;
  reviews: number;
  price: string;
  author: string;
}

export default function ProjectCard({ title, rating, reviews, price, author }: ProjectCardProps) {
  return (
    <div className="h-[340px] w-[320px] rounded hover:bg-[#f2f2f2] hover:rounded-[20px] flex flex-col justify-center items-center p-2">
      <div>
        <div className="bg-gray-200 h-[190px] w-[280px] mb-2 rounded-[20px]"></div>
        <h3 className="font-pretendard font-semibold text-[24px]">{title}</h3>
        <div className="flex items-center gap-1">
          <img src={starImg} alt="star" className="w-4 h-4" />
          <div className="text-sm text-[#666666]">
            {rating.toFixed(1)} ({reviews.toLocaleString()})
          </div>
        </div>
        <div>{price}</div>
        <div className="text-[#666666]">| {author}</div>
      </div>
    </div>
  );
}
