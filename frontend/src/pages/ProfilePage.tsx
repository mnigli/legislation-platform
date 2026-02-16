import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiStar, FiMessageSquare, FiEdit3, FiCalendar } from 'react-icons/fi';
import { api } from '../services/api';
import BillCard from '../components/bills/BillCard';
import type { Bill } from '../types';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => api.getUser(id!),
    enabled: !!id,
  });

  const { data: starsData } = useQuery({
    queryKey: ['user-stars', id],
    queryFn: () => api.getUserStars(id!),
    enabled: !!id,
  });

  const user = userData?.data;
  const starredBills: Bill[] = starsData?.data || [];

  if (userLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full" />
            <div>
              <div className="h-6 bg-gray-200 rounded w-40 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <div className="card">
          <p className="text-xl text-gray-500">משתמש לא נמצא</p>
        </div>
      </div>
    );
  }

  const roleLabel = user.role === 'MK' ? 'חבר/ת כנסת' : user.role === 'ADMIN' ? 'מנהל/ת' : 'אזרח/ית';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-center gap-6">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-20 h-20 rounded-full" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-3xl font-bold">
              {user.name[0]}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <span className="text-sm bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{roleLabel}</span>
            </div>
            {user.partyName && <p className="text-gray-500">{user.partyName}</p>}
            <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
              <FiCalendar size={12} /> הצטרף ב-{new Date(user.createdAt).toLocaleDateString('he-IL')}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-primary-600">{user.points}</p>
            <p className="text-xs text-gray-500">נקודות</p>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold flex items-center justify-center gap-1"><FiStar className="text-yellow-500" size={18} /> {user._count?.stars || 0}</p>
            <p className="text-xs text-gray-500">כוכבים</p>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold flex items-center justify-center gap-1"><FiMessageSquare className="text-blue-500" size={18} /> {user._count?.comments || 0}</p>
            <p className="text-xs text-gray-500">תגובות</p>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold flex items-center justify-center gap-1"><FiEdit3 className="text-green-500" size={18} /> {user._count?.suggestions || 0}</p>
            <p className="text-xs text-gray-500">הצעות</p>
          </div>
        </div>

        {/* Badges */}
        {user.userBadges?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium text-sm text-gray-500 mb-3">תגים</h3>
            <div className="flex flex-wrap gap-2">
              {user.userBadges.map((ub: any) => (
                <div key={ub.badge.id} className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm">
                  <span>🏅</span>
                  <span>{ub.badge.nameHe}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Starred Bills */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FiStar className="text-yellow-500" /> הצעות חוק מסומנות ({starredBills.length})
        </h2>
        {starredBills.length === 0 ? (
          <div className="card text-center py-8 text-gray-400">
            עדיין לא סומנו הצעות חוק בכוכב
          </div>
        ) : (
          <div className="space-y-4">
            {starredBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
