import { Link } from 'react-router-dom';
import { FiSearch, FiStar, FiMessageSquare, FiTrendingUp, FiCheckCircle, FiUsers } from 'react-icons/fi';

export default function AboutPage() {
  const steps = [
    {
      icon: <FiSearch size={32} />,
      title: 'גלו הצעות חוק',
      description: 'חפשו וסננו הצעות חוק לפי נושא, שלב בחקיקה, או פופולריות. כל הצעת חוק מוצגת עם תקציר ברור בשפה פשוטה.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <FiStar size={32} />,
      title: 'דרגו בכוכבים',
      description: 'מצאתם הצעת חוק שחשובה לכם? סמנו אותה בכוכב כדי לעקוב אחריה ולהראות שהציבור מתעניין.',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: <FiMessageSquare size={32} />,
      title: 'הציעו שיפורים',
      description: 'כתבו הצעות שיפור להצעות חוק, הגיבו ודונו עם אזרחים אחרים. הקולות שלכם נשמעים.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: 'עקבו אחרי ההתקדמות',
      description: 'ראו בזמן אמת באיזה שלב נמצאת כל הצעת חוק - מהגשה ועד הצבעה סופית בכנסת.',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const stages = [
    { name: 'הגשה', description: 'חבר כנסת מגיש את הצעת החוק' },
    { name: 'הנחה על שולחן הכנסת', description: 'ההצעה מונחת לעיון חברי הכנסת' },
    { name: 'דיון בוועדה', description: 'ועדה מתאימה דנה בהצעה ומעבדת אותה' },
    { name: 'קריאה ראשונה', description: 'הצבעה ראשונה במליאת הכנסת' },
    { name: 'קריאה שנייה ושלישית', description: 'הצבעות סופיות - אם עוברת, הופכת לחוק' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-bl from-knesset-blue to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            איך <span className="text-knesset-gold">חוקית</span> עובדת?
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            הפלטפורמה שהופכת את החקיקה בישראל לנגישה, שקופה ומשתפת
          </p>
        </div>
      </section>

      {/* How it works - Steps */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">ארבעה צעדים פשוטים</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="card flex gap-4 items-start hover:shadow-lg transition-shadow">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${step.color}`}>
                {step.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-500 text-sm font-bold px-2 py-0.5 rounded-full">{index + 1}</span>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Legislation Process */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">מסע הצעת חוק בכנסת</h2>
          <p className="text-center text-gray-500 mb-12">כל הצעת חוק עוברת שלבים מוגדרים עד שהיא הופכת לחוק מחייב</p>
          <div className="space-y-0">
            {stages.map((stage, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-knesset-blue text-white flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  {index < stages.length - 1 && (
                    <div className="w-0.5 h-12 bg-blue-200" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-bold text-gray-800">{stage.name}</h3>
                  <p className="text-gray-500">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Hukit */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">למה חוקית?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">שקיפות</h3>
            <p className="text-gray-600">כל הצעת חוק מוצגת בשפה ברורה עם תקציר AI, כך שכולם יכולים להבין את המשמעות.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiUsers className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">השתתפות</h3>
            <p className="text-gray-600">לדרג, להגיב ולהציע שיפורים - כי דמוקרטיה היא לא רק הצבעה אחת ל-4 שנים.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiTrendingUp className="text-yellow-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">מעקב</h3>
            <p className="text-gray-600">עקבו אחרי הצעות חוק שחשובות לכם וקבלו עדכונים כשהן מתקדמות בתהליך החקיקה.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-bl from-knesset-blue to-blue-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">מוכנים להשפיע?</h2>
          <p className="text-xl text-blue-200 mb-8">
            הצטרפו לאלפי אזרחים שכבר משתמשים בחוקית כדי לעקוב אחרי החקיקה ולהשמיע את קולם.
          </p>
          <Link
            to="/bills"
            className="bg-knesset-gold text-knesset-blue px-8 py-3 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors inline-block"
          >
            צפו בהצעות חוק
          </Link>
        </div>
      </section>
    </div>
  );
}
