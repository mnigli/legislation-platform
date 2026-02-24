import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiUsers, FiStar, FiArrowLeft } from 'react-icons/fi';
import { api } from '../services/api';
import WhatIsHukit from '../components/home/WhatIsHukit';
import ExplainerVideo from '../components/home/ExplainerVideo';
import DemographicQuestionnaire from '../components/questionnaire/DemographicQuestionnaire';

export default function HomePage() {
  const { data: statsRes, isError: statsError } = useQuery({
    queryKey: ['bills', 'stats'],
    queryFn: () => api.getBillStats(),
  });

  const stats = statsRes?.data;
  const totalBills = stats?.totalBills || 0;
  const totalStars = stats?.totalStars || 0;
  const totalComments = stats?.totalComments || 0;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-bl from-knesset-blue to-blue-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-6xl font-extrabold mb-4 md:mb-6">
            <span className="text-knesset-gold">חוקית</span> — גיטהב של החקיקה
          </h1>
          <p className="text-lg md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            הצעות חוק בשפה שכולם מבינים. דרגו, הציעו שיפורים והשפיעו על החקיקה שמעצבת את חייכם.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/bills" className="w-full sm:w-auto bg-knesset-gold text-knesset-blue px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
              📋 הצעות חוק
              <FiArrowLeft size={18} />
            </Link>
            <Link to="/arena" className="w-full sm:w-auto border-2 border-knesset-gold/60 text-knesset-gold px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-knesset-gold/10 transition-colors flex items-center justify-center gap-2">
              ✒️ קֶסֶת
              <FiArrowLeft size={18} />
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
              <p className="text-2xl font-bold">{statsError ? '—' : (totalBills || '...')}</p>
              <p className="text-gray-500 text-sm">הצעות חוק במערכת</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FiStar className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{statsError ? '—' : (totalStars || '...')}</p>
              <p className="text-gray-500 text-sm">דירוגים ניתנו</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FiUsers className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{statsError ? '—' : (totalComments || '...')}</p>
              <p className="text-gray-500 text-sm">תגובות והצעות</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is Hukit - Explainer Video */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3">
            🎬 מה זה <span className="text-knesset-blue">חוקית</span>?
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            פלטפורמה שהופכת את החקיקה הישראלית לנגישה, שקופה ומשתפת
          </p>
        </div>
        <WhatIsHukit />
      </section>

      {/* Legislation Simulator */}
      <section className="max-w-7xl mx-auto px-4 pb-12 md:pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3">
            ⚡ סימולטור: מסע הצעת חוק בכנסת
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            178 ימים, 8 שלבים, הצבעה אחת — צפו בתהליך החקיקה המלא
          </p>
        </div>
        <ExplainerVideo />
      </section>

      {/* Demographic Questionnaire */}
      <DemographicQuestionnaire />
    </div>
  );
}
