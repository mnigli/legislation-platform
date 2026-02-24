import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuthStore } from '../../stores/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-knesset-blue text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-knesset-gold text-2xl">⚖️</span>
            <span>חוקית</span>
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/bills"
              className={`transition-colors font-medium ${isActive('/bills') ? 'text-knesset-gold' : 'hover:text-knesset-gold'}`}
            >
              הצעות חוק
            </Link>
            <Link
              to="/arena"
              className={`transition-colors font-medium flex items-center gap-1.5 ${isActive('/arena') ? 'text-knesset-gold' : 'hover:text-knesset-gold'}`}
            >
              <span>✒️</span>
              קֶסֶת
            </Link>

            {user ? (
              <div className="flex items-center gap-3 mr-4">
                <Link to={`/profile/${user.id}`} className="flex items-center gap-2 hover:text-knesset-gold">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <FiUser size={18} />
                  )}
                  <span className="text-sm">{user.name}</span>
                </Link>
                <button onClick={logout} className="hover:text-red-300 transition-colors" title="יציאה">
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-knesset-gold text-knesset-blue px-5 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors mr-2">
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
            <div className="flex flex-col gap-4">
              <Link
                to="/bills"
                onClick={() => setMenuOpen(false)}
                className={`text-lg font-medium ${isActive('/bills') ? 'text-knesset-gold' : 'hover:text-knesset-gold'}`}
              >
                📋 הצעות חוק
              </Link>
              <Link
                to="/arena"
                onClick={() => setMenuOpen(false)}
                className={`text-lg font-medium ${isActive('/arena') ? 'text-knesset-gold' : 'hover:text-knesset-gold'}`}
              >
                ✒️ קֶסֶת
              </Link>
              <div className="border-t border-white/20 my-1" />
              {user ? (
                <>
                  <Link to={`/profile/${user.id}`} onClick={() => setMenuOpen(false)} className="hover:text-knesset-gold flex items-center gap-2">
                    <FiUser size={16} /> {user.name}
                  </Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="text-right hover:text-red-300 flex items-center gap-2">
                    <FiLogOut size={16} /> יציאה
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="bg-knesset-gold text-knesset-blue px-4 py-2.5 rounded-lg font-bold text-center text-lg">
                  כניסה
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
