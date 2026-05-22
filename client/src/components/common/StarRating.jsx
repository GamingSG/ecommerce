// src/components/common/StarRating.jsx
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, maxStars = 5, size = 'sm', showCount = false, count = 0 }) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              className={`${sizes[size]} ${
                filled ? 'text-amber-400 fill-amber-400'
                : half ? 'text-amber-400 fill-amber-200'
                : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          {rating.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
