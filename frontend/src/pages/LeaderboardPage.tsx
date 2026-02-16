import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiAward, FiStar, FiMessageSquare, FiEdit3 } from 'react-icons/fi';
import { api } from '../services/api';

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => api.getLeaderboard(),
  });

  const users = data?.data || [];

  const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">לוח מובילים</h1>
      <p className="text-gray-500 mb-8">האזרחים הפעילים ביותר בפלטפורמה. מדרגים מובילים מוזמנים לישיבות בוועדות הכנסת!</p>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user: any, index: number) => (
            <Link
              key={user.id}
              to={`/profile/${user.id}`}
              className="card flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              {/* Rank */}
              <div className="w-10 text-center">
                {index < 3 ? (
                  <FiAward className={`mx-auto ${medalColors[index]}`} size={28} />
                ) : (
                  <span className="text-lg font-bold text-gray-400">{index + 1}</span>
                )}
              </div>

              {/* Avatar */}
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-lg font-bold">
                  {user.name[0]}
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{user.name}</span>
                  {user.role === 'MK' && (
                    <span className="text-xs bg-knesset-gold/20 text-knesset-blue px-2 py-0.5 rounded-full">ח"כ</span>
                  )}
                  {index < 3 && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">מדרג מוביל</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-0.5">
                  <span className="flex items-center gap-1"><FiStar size={12} /> {user._count.stars}</span>
                  <span className="flex items-center gap-1"><FiMessageSquare size={12} /> {user._count.comments}</span>
                  <span className="flex items-center gap-1"><FiEdit3 size={12} /> {user._count.suggestions}</span>
                </div>
              </div>

              {/* Points */}
              <div className="text-left">
                <span className="text-2xl font-bold text-primary-600">{user.points}</span>
                <p className="text-xs text-gray-400">נקודות</p>
              </div>

              {/* Badges */}
              {user.userBadges?.length > 0 && (
                <div className="hidden md:flex items-center gap-1">
                  {user.userBadges.slice(0, 3).map((ub: any) => (
                    <span
                      key={ub.badge.id}
                      title={ub.badge.nameHe}
                      className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-xs"
                    >
                      🏅
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="card mt-8 bg-gradient-to-bl from-purple-50 to-blue-50 border-purple-200">
        <h3 className="font-bold text-lg mb-2">איך צוברים נקודות?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FiStar className="text-yellow-500" /> <span>סימון בכוכב = 1 נקודה</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMessageSquare className="text-blue-500" /> <span>תגובה = 2 נקודות</span>
          </div>
          <div className="flex items-center gap-2">
            <FiEdit3 className="text-green-500" /> <span>הצעת שיפור = 5 נקודות</span>
          </div>
        </div>
      </div>
    </div>
  );
}
