import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiUsers, FiStar, FiArrowLeft, FiClock, FiPlay } from 'react-icons/fi';
import { api } from '../services/api';
import BillCard from '../components/bills/BillCard';
import type { Bill } from '../types';

const EXPLAINER_VIDEO_URL = 'https://ai.invideo.io/ai-mcp-video?video=-github--cwdvfl';

export default function HomePage() {
  // Use the existing /bills endpoint with newest sort - works on deployed backend
  const { data: latestRes, isLoading } = useQuery({
    queryKey: ['bills', 'homepage-latest'],
    queryFn: () => api.getBills({ sort: 'newest', limit: '6' }),
  });

  // Also get total count from pagination meta
  const latestBills: Bill[] = latestRes?.data || [];
  const totalBills = latestRes?.meta?.pagination?.total || 0;

  // Calculate stats from displayed bills + total
  const totalStars = latestBills.reduce((sum: number, b: Bill) => sum + b.starCount, 0);
  const totalComments = latestBills.reduce((sum: number, b: Bill) => sum + b.commentCount, 0);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-bl from-knesset-blue to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            <span className="text-knesset-gold">חוקית</span> - גיטהב של החקיקה
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
            הצעות חוק בשפה שכולם מבינים. דרגו, הציעו שיפורים והשפיעו על החקיקה שמעצבת את חייכם.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/bills" className="bg-knesset-gold text-knesset-blue px-8 py-3 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors">
              צפו בהצעות חוק
            </Link>
            <Link to="/about" className="border-2 border-white/30 px-8 py-3 rounded-xl font-medium text-lg hover:bg-white/10 transition-colors">
              איך זה עובד?
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="text-primary-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalBills || '...'}</p>
              <p className="text-gray-500 text-sm">הצעות חוק במערכת</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FiStar className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalStars || '...'}</p>
              <p className="text-gray-500 text-sm">דירוגים ניתנו</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FiUsers className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalComments || '...'}</p>
              <p className="text-gray-500 text-sm">תגובות והצעות</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Visual Explainer */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            איך <span className="text-knesset-blue">חוקית</span> עובדת?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            בדיוק כמו שגיטהב שינה את עולם התוכנה — חוקית משנה את הדרך שבה אזרחים מתחברים לחקיקה
          </p>
        </div>

        {/* 3-step process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="relative text-center group">
            <div className="w-20 h-20 bg-gradient-to-bl from-blue-500 to-knesset-blue rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <span className="text-3xl">📜</span>
            </div>
            <div className="absolute top-10 right-0 hidden md:block w-full h-0.5 bg-gradient-to-l from-transparent via-blue-200 to-transparent -z-10" />
            <span className="inline-block bg-knesset-blue text-white text-xs font-bold px-3 py-1 rounded-full mb-3">שלב 1</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">הצעות חוק אמיתיות</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              כל הצעות החוק מהכנסת מיובאות אוטומטית מה-API הרשמי ומתורגמות לשפה פשוטה באמצעות בינה מלאכותית
            </p>
          </div>

          <div className="relative text-center group">
            <div className="w-20 h-20 bg-gradient-to-bl from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform">
              <span className="text-3xl">⭐</span>
            </div>
            <span className="inline-block bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">שלב 2</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">דרגו והגיבו</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              תנו כוכבים להצעות שחשובות לכם, כתבו תגובות והציעו שיפורים — בדיוק כמו Pull Request בגיטהב
            </p>
          </div>

          <div className="relative text-center group">
            <div className="w-20 h-20 bg-gradient-to-bl from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
              <span className="text-3xl">📊</span>
            </div>
            <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">שלב 3</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">עקבו אחרי הנתונים</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              דשבורדים מתקדמים מציגים בזמן אמת: שיאני חקיקה, זמני אישור, והשוואה בינלאומית
            </p>
          </div>
        </div>

        {/* Video CTA banner */}
        <div className="bg-gradient-to-l from-knesset-blue via-blue-800 to-indigo-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <FiPlay className="text-knesset-gold" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">רוצים לראות את זה בפעולה?</h3>
              <p className="text-blue-200 text-sm">צפו בסרטון ההסבר הקצר שלנו — דקה וחצי שישנו את הדרך שבה אתם חושבים על חקיקה</p>
            </div>
          </div>
          <a
            href={EXPLAINER_VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-knesset-gold text-knesset-blue px-8 py-3 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <FiPlay size={18} />
            צפו בסרטון
          </a>
        </div>
      </section>

      {/* Latest Bills */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiClock className="text-primary-500" /> הצעות חוק אחרונות מהכנסת
          </h2>
          <Link to="/bills" className="text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium">
            כל ההצעות <FiArrowLeft size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {latestBills.map((bill: Bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-6">חקיקה לפי נושא</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['חינוך', 'בריאות', 'כלכלה', 'סביבה', 'דיור', 'ביטחון', 'צרכנות', 'טכנולוגיה'].map((cat) => (
            <Link
              key={cat}
              to={`/bills?category=${encodeURIComponent(cat)}`}
              className="card text-center hover:shadow-md hover:border-primary-200 transition-all group"
            >
              <span className="text-lg font-bold text-gray-700 group-hover:text-primary-600">{cat}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
