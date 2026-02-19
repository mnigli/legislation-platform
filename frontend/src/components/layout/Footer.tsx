import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">⚖️ חוקית</h3>
            <p className="text-sm">
              פלטפורמה להנגשת החקיקה הישראלית לציבור.
              כל אזרח יכול להשפיע על החוקים שמעצבים את חייו.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">קישורים</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/bills" className="hover:text-white transition-colors">הצעות חוק</Link></li>
              <li><Link to="/leaderboard" className="hover:text-white transition-colors">לוח מובילים</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">אודות</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">צרו קשר</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">אודות הפלטפורמה</Link></li>
              <li><a href="mailto:contact@hukit.co.il" className="hover:text-white transition-colors">contact@hukit.co.il</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>חוקית - גיטהב של החקיקה בישראל © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
