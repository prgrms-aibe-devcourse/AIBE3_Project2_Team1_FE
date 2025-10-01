import type { FC, MouseEvent } from 'react';
import { useId } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (newValue: number) => void;
  max?: number;
  size?: number;
}

const StarRating: FC<StarRatingProps> = ({ value, onChange, max = 5, size = 28 }) => {
  const gradientId = useId();

  const handleClick = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    const newValue = isHalf ? index - 0.5 : index;
    onChange(newValue);
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        const isFull = value >= index;
        const isHalf = value >= index - 0.5 && value < index;

        return (
          <button
            key={index}
            type="button"
            aria-label={`${index}점 선택`}
            onClick={(e) => handleClick(e, index)}
            className="p-0.5"
            style={{ width: size, height: size }}
          >
            <svg
              viewBox="0 0 24 24"
              width={size}
              height={size}
              fill={isFull ? '#facc15' : isHalf ? `url(#${gradientId})` : '#e5e7eb'}
            >
              {isHalf && (
                <defs>
                  <linearGradient id={gradientId}>
                    <stop offset="50%" stopColor="#facc15" />
                    <stop offset="50%" stopColor="#e5e7eb" />
                  </linearGradient>
                </defs>
              )}
              <path d="M12 17.27L18.18 21L16.545 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.455 13.97L5.82 21L12 17.27Z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
