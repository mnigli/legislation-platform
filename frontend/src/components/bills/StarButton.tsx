import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

interface Props {
  billId: string;
  starCount: number;
  isStarred: boolean;
  onToggle?: (starred: boolean) => void;
}

export default function StarButton({ billId, starCount, isStarred, onToggle }: Props) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [starred, setStarred] = useState(isStarred);
  const [count, setCount] = useState(starCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (loading) return;

    setLoading(true);
    const newStarred = !starred;
    setStarred(newStarred);
    setCount((c) => c + (newStarred ? 1 : -1));

    try {
      if (newStarred) {
        await api.starBill(billId);
      } else {
        await api.unstarBill(billId);
      }
      onToggle?.(newStarred);
    } catch {
      setStarred(!newStarred);
      setCount((c) => c + (newStarred ? -1 : 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all
        ${starred
          ? 'bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100'
          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}
    >
      <FiStar className={starred ? 'fill-yellow-400 text-yellow-400' : ''} size={18} />
      <span className="font-medium">{count}</span>
    </button>
  );
}
