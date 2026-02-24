import { Link } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle, FiHelpCircle } from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';
import { ARENA_BILL } from '../data/arenaDemo';
import SponsoredContent from '../components/arena/SponsoredContent';
import KesetExplainer from '../components/arena/KesetExplainer';
import PolisStyleVoting from '../components/arena/PolisStyleVoting';

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

        {/* Section: vTaiwan-style Public Voting */}
        <section>
          <h2 className="font-extrabold text-gray-900 mb-1 text-base md:text-lg flex items-center gap-2">
            🗳️ דיון ציבורי — הצביעו והשפיעו
          </h2>
          <p className="text-gray-500 text-sm mb-5">קראו כל הצהרה, הצביעו עליה, ושימו לב איך הקונצנזוס מתגבש בזמן אמת.</p>

          <PolisStyleVoting
            statements={bill.statements}
            canVote={canVote}
          />
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

