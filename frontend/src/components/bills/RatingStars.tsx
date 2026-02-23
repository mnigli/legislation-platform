import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

interface Props {
  billId: string;
  averageRating?: number;
  ratingCount?: number;
  userRating?: number | null;
  onRate?: (billId: string, value: number) => void;
  compact?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingStars({
  billId,
  averageRating = 0,
  ratingCount = 0,
  userRating = null,
  onRate,
  compact = false,
  size = 'md',
}: Props) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [hoverValue, setHoverValue] = useState(0);
  const [localRating, setLocalRating] = useState(userRating);
  const [localCount, setLocalCount] = useState(ratingCount);
  const [localAvg, setLocalAvg] = useState(averageRating);

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 24 : 18;

  const handleClick = (value: number) => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Optimistic update
    if (localRating === null) {
      // New rating
      const newCount = localCount + 1;
      const newSum = localAvg * localCount + value;
      setLocalAvg(newSum / newCount);
      setLocalCount(newCount);
    } else {
      // Update existing
      const newSum = localAvg * localCount - localRating + value;
      setLocalAvg(newSum / localCount);
    }
    setLocalRating(value);

    if (onRate) {
      onRate(billId, value);
    }
  };

  const displayValue = hoverValue || localRating || 0;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <FiStar
          size={iconSize}
          className={localAvg > 0 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
        />
        <span className="text-sm font-bold text-gray-700">
          {localAvg > 0 ? localAvg.toFixed(1) : '—'}
        </span>
        <span className="text-xs text-gray-400">({localCount})</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex gap-0.5"
        dir="ltr"
        onMouseLeave={() => setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHoverValue(star)}
            className="transition-transform hover:scale-110 focus:outline-none"
            title={`${star} כוכבים`}
          >
            <FiStar
              size={iconSize}
              className={`transition-colors ${
                star <= displayValue
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        {localAvg > 0 && (
          <span className="font-bold text-yellow-600">{localAvg.toFixed(1)}</span>
        )}
        <span>({localCount} דירוגים)</span>
      </div>
    </div>
  );
}
