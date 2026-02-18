import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiSearch, FiBell, FiMenu, FiX, FiLogOut, FiUser, FiStar, FiDownload, FiBarChart2, FiBriefcase, FiRadio, FiAward } from 'react-icons/fi';
import { useAuthStore } from '../../stores/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header className="bg-knesset-blue text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-knesset-gold text-2xl">⚖️</span>
            <span>חוקית</span>
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חיפוש הצעות חוק..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-knesset-gold focus:bg-white/20"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            </div>
          </form>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/bills" className="hover:text-knesset-gold transition-colors">
              הצעות חוק
            </Link>
            <Link to="/dashboard" className="hover:text-knesset-gold transition-colors flex items-center gap-1">
              <FiBarChart2 size={14} />
              דשבורד
            </Link>
            <Link to="/leaderboard" className="hover:text-knesset-gold transition-colors">
              לוח מובילים
            </Link>
            <Link to="/admin/import" className="hover:text-knesset-gold transition-colors flex items-center gap-1">
              <FiDownload size={14} />
              ייבוא
            </Link>
            <span className="text-white/30">|</span>
            <Link to="/orgs" className="hover:text-knesset-gold transition-colors flex items-center gap-1">
              <FiBriefcase size={14} />
              עמותות
            </Link>
            <Link to="/media" className="hover:text-knesset-gold transition-colors flex items-center gap-1">
              <FiRadio size={14} />
              תקשורת
            </Link>
            <Link to="/mk" className="hover:text-knesset-gold transition-colors flex items-center gap-1">
              <FiAward size={14} />
              חכ"ים
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/notifications" className="relative hover:text-knesset-gold">
                  <FiBell size={20} />
                </Link>
                <Link to={`/profile/${user.id}`} className="flex items-center gap-2 hover:text-knesset-gold">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <FiUser size={20} />
                  )}
                  <span className="text-sm">{user.name}</span>
                </Link>
                <button onClick={logout} className="hover:text-red-300 transition-colors">
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-knesset-gold text-knesset-blue px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors">
                כניסה
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-white/20 mt-2 pt-4">
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חיפוש הצעות חוק..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none"
              />
            </form>
            <div className="flex flex-col gap-3">
              <Link to="/bills" onClick={() => setMenuOpen(false)} className="hover:text-knesset-gold">הצעות חוק</Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-knesset-gold flex items-center gap-1"><FiBarChart2 size={14} /> דשבורד</Link>
              <Link to="/leaderboard" onClick={() => setMenuOpen(false)} className="hover:text-knesset-gold">לוח מובילים</Link>
              <Link to="/admin/import" onClick={() => setMenuOpen(false)} className="hover:text-knesset-gold flex items-center gap-1"><FiDownload size={14} /> ייבוא מהכנסת</Link>
              <div className="border-t border-white/20 my-2" />
              <Link to="/orgs" onClick={() => setMenuOpen(false)} className="hover:text-knesset-gold flex items-center gap-1"><FiBriefcase size={14} /> עמותות וארגונים</Link>
              <Link to="/media" onClick={() => setMenuOpen(false)} className="hover:text-knesset-gold flex items-center gap-1"><FiRadio size={14} /> תקשורת</Link>
              <Link to="/mk" onClick={() => setMenuOpen(false)} className="hover:text-knesset-gold flex items-center gap-1"><FiAward size={14} /> חברי כנסת</Link>
              {user ? (
                <>
                  <Link to={`/profile/${user.id}`} onClick={() => setMenuOpen(false)} className="hover:text-knesset-gold">הפרופיל שלי</Link>
                  <Link to={`/profile/${user.id}/stars`} onClick={() => setMenuOpen(false)} className="hover:text-knesset-gold flex items-center gap-1"><FiStar /> הכוכבים שלי</Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="text-right hover:text-red-300">יציאה</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="bg-knesset-gold text-knesset-blue px-4 py-2 rounded-lg font-medium text-center">כניסה</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
