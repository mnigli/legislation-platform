import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiMinus, FiX, FiLock, FiAlertCircle, FiCheckCircle, FiHelpCircle } from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';
import { ARENA_BILL } from '../data/arenaDemo';
import SponsoredContent from '../components/arena/SponsoredContent';
import KesetExplainer from '../components/arena/KesetExplainer';
import PolisEmbed from '../components/arena/PolisEmbed';

export default function ArenaPage() {
  const { user } = useAuthStore();
  const bill = ARENA_BILL;

  // Check if user can vote (must be logged in + have rated at least 1 bill)
  // For demo: if logged in, we'll assume they rated
  const hasRatedBill = !!user; // In production: check via API
  const canVote = !!user && hasRatedBill;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-bl from-knesset-blue to-blue-900 text-white py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full mb-4 inline-block">
            ✒️ קֶסֶת
          </span>
          <h1 className="text-xl md:text-3xl font-extrabold leading-snug mb-4">
            {bill.citizenTitle}
          </h1>
          <p className="text-blue-200 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            {bill.officialName}
          </p>
        </div>
      </div>

      {/* Keset Explainer Video */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-3xl font-black text-gray-900 mb-2">
            ✒️ מה זה <span className="text-knesset-blue">קֶסֶת</span>?
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            המודל הדמוקרטי שמאפשר לציבור להשפיע על חקיקה
          </p>
        </div>
        <KesetExplainer />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">

        {/* Section: Short Summary */}
        <section className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6">
          <h2 className="font-bold text-blue-900 mb-2 text-sm md:text-base">תקציר קצר</h2>
          <p className="text-gray-800 text-sm md:text-base leading-relaxed">
            {bill.shortSummary}
          </p>
        </section>

        {/* Section: The Problem */}
        <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="font-extrabold text-gray-900 mb-4 text-base md:text-lg flex items-center gap-2">
            <FiAlertCircle className="text-red-500" size={20} />
            הבעיה בקצרה
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 text-sm mb-2">המצב כיום:</h3>
              <ul className="space-y-2">
                {bill.problemDescription.currentSituation.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="text-red-400 mt-1 shrink-0">&#x25cf;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 text-sm mb-2">מה החוק המוצע מנסה לפתור:</h3>
              <ul className="space-y-2">
                {bill.problemDescription.whatBillSolves.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="text-green-500 mt-1 shrink-0">&#x25cf;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section: Controversy Points */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6">
          <h2 className="font-extrabold text-gray-900 mb-4 text-base md:text-lg flex items-center gap-2">
            <FiHelpCircle className="text-amber-600" size={20} />
            על מה מתווכחים כאן?
          </h2>
          <div className="space-y-4">
            {bill.controversyPoints.map((point, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-7 h-7 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{point.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Pol.is Public Discussion (vTaiwan) */}
        <section>
          <h2 className="font-extrabold text-gray-900 mb-1 text-base md:text-lg flex items-center gap-2">
            🗳️ דיון ציבורי — הצביעו והשפיעו
          </h2>
          <p className="text-gray-500 text-sm mb-5">קראו הצהרות, הצביעו עליהן, ונסחו הצהרות חדשות. המערכת ממפה את הקונצנזוס הציבורי בזמן אמת.</p>

          <PolisEmbed
            pageId="keset-oct7-investigation"
            topic="ועדת חקירה ממלכתית לאירועי 7 באוקטובר — מה דעתכם?"
            userId={user?.id}
          />
        </section>

        {/* Section: Our Community Statements (demo — kept for context) */}
        <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="font-extrabold text-gray-900 mb-1 text-base md:text-lg flex items-center gap-2">
            📊 שאלות מנחות
          </h2>
          <p className="text-gray-500 text-sm mb-5">שאלות מפתח שעלו בדיון הציבורי</p>

          <div className="space-y-4">
            {bill.statements.map((stmt) => (
              <ArenaStatementCard
                key={stmt.id}
                statement={stmt}
                canVote={canVote}
              />
            ))}
          </div>
        </section>

        {/* Section: Stakeholders */}
        <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="font-extrabold text-gray-900 mb-4 text-base md:text-lg">
            👥 בעלי עניין מרכזיים
          </h2>
          <div className="space-y-3">
            {bill.stakeholders.map((s, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{s.name}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Decided vs Open */}
        <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="font-extrabold text-gray-900 mb-4 text-base md:text-lg">
            📋 מה כבר נקבע / מה עדיין פתוח
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-800 text-sm mb-3 flex items-center gap-1.5">
                <FiCheckCircle size={14} />
                נקבע בהצעה
              </h3>
              <ul className="space-y-2">
                {bill.decidedVsOpen.decided.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="text-green-500 mt-0.5 shrink-0">&#x2713;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-bold text-amber-800 text-sm mb-3 flex items-center gap-1.5">
                <FiHelpCircle size={14} />
                עדיין פתוח לדיון
              </h3>
              <ul className="space-y-2">
                {bill.decidedVsOpen.open.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="text-amber-500 mt-0.5 shrink-0">?</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section: Process Status */}
        <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="font-extrabold text-gray-900 mb-4 text-base md:text-lg">
            📍 סטטוס התהליך
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="text-lg">🏛️</span>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">סטטוס בכנסת</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{bill.processStatus.knessetStatus}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-lg">✒️</span>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">סטטוס בפלטפורמה</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{bill.processStatus.platformStatus}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-lg">📅</span>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">דדליין לשלב הנוכחי</h4>
                <p className="text-primary-600 text-sm font-bold">{bill.processStatus.deadline}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Sponsored Content */}
        <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="font-extrabold text-gray-900 mb-4 text-base md:text-lg">
            📢 עמדות בעלי עניין
          </h2>
          <SponsoredContent items={bill.sponsoredContent} />
        </section>

        {/* Back to bills */}
        <div className="text-center py-6">
          <Link to="/bills" className="text-primary-600 font-medium hover:underline text-sm">
            ← חזרה לכל הצעות החוק
          </Link>
        </div>

      </div>
    </div>
  );
}

// ---- Inline arena statement card with local vote state ----

interface StatementProps {
  statement: {
    id: string;
    content: string;
    agreeCount: number;
    neutralCount: number;
    disagreeCount: number;
  };
  canVote: boolean;
}

function ArenaStatementCard({ statement, canVote }: StatementProps) {
  const [userVote, setUserVote] = useState<number | null>(null);
  const [counts, setCounts] = useState({
    agree: statement.agreeCount,
    neutral: statement.neutralCount,
    disagree: statement.disagreeCount,
  });

  const total = counts.agree + counts.neutral + counts.disagree;
  const showResults = userVote !== null || total > 0;

  const handleVote = (value: number) => {
    if (!canVote) return;

    if (userVote !== null) {
      // Undo previous vote
      setCounts(prev => ({
        agree: prev.agree - (userVote === 1 ? 1 : 0),
        neutral: prev.neutral - (userVote === 0 ? 1 : 0),
        disagree: prev.disagree - (userVote === -1 ? 1 : 0),
      }));
    }

    if (userVote === value) {
      // Toggle off
      setUserVote(null);
      return;
    }

    // Add new vote
    setUserVote(value);
    setCounts(prev => ({
      agree: prev.agree + (value === 1 ? 1 : 0) - (userVote === 1 ? 1 : 0),
      neutral: prev.neutral + (value === 0 ? 1 : 0) - (userVote === 0 ? 1 : 0),
      disagree: prev.disagree + (value === -1 ? 1 : 0) - (userVote === -1 ? 1 : 0),
    }));
  };

  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <p className="font-semibold text-gray-900 text-sm md:text-base mb-3 leading-relaxed text-center">
        {statement.content}
      </p>

      {/* Vote buttons */}
      <div className="flex justify-center gap-2 mb-3">
        <button
          onClick={() => handleVote(1)}
          disabled={!canVote}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${userVote === 1
              ? 'bg-green-600 text-white shadow-sm'
              : canVote
                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          <FiCheck size={14} /> מסכים
        </button>
        <button
          onClick={() => handleVote(0)}
          disabled={!canVote}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${userVote === 0
              ? 'bg-gray-600 text-white shadow-sm'
              : canVote
                ? 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          <FiMinus size={14} /> ניטרלי
        </button>
        <button
          onClick={() => handleVote(-1)}
          disabled={!canVote}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${userVote === -1
              ? 'bg-red-600 text-white shadow-sm'
              : canVote
                ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          <FiX size={14} /> לא מסכים
        </button>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-1.5 mt-3">
          <ResultBar label="מסכים" count={counts.agree} pct={pct(counts.agree)} color="bg-green-500" />
          <ResultBar label="ניטרלי" count={counts.neutral} pct={pct(counts.neutral)} color="bg-gray-400" />
          <ResultBar label="לא מסכים" count={counts.disagree} pct={pct(counts.disagree)} color="bg-red-500" />
          <p className="text-xs text-gray-400 text-center mt-1">{total} מצביעים</p>
        </div>
      )}
    </div>
  );
}

function ResultBar({ label, count, pct, color }: { label: string; count: number; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 text-gray-600 text-left shrink-0">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-12 text-gray-500 text-left shrink-0">{pct}% ({count})</span>
    </div>
  );
}
