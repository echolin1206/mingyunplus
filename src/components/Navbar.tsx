import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, LogOut, User } from 'lucide-react';
import { getCurrentUser, logout } from '../pages/Login';

const navItems = [
  { label: '每日星象', href: '/zodiac' },
  { label: '紫微命盘', href: '/destiny' },
  { label: '今日宜忌', href: '/daily' },
  { label: '塔罗占卜', href: '/tarot' },
  { label: '流年运势', href: '/yearly' },
  { label: '会员中心', href: '/premium' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setCurrentUser(getCurrentUser());
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome ? 'liquid-glass' : 'bg-transparent'
      }`}
      style={{ borderRadius: 0 }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 interactive">
          <Sparkles className="w-5 h-5 text-[#efb6ff]" />
          <span className="text-lg font-bold tracking-tight text-[#f6f9ff]">命运加法</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm tracking-wide transition-colors duration-300 interactive ${
                location.pathname === item.href ? 'text-[#efb6ff]' : 'text-[rgba(246,249,255,0.7)] hover:text-[#f6f9ff]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[rgba(239,182,255,0.15)] flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-[#efb6ff]" />
                </div>
                <span className="text-sm text-[rgba(246,249,255,0.8)]">{currentUser.username}</span>
              </div>
              <button
                onClick={logout}
                className="interactive p-1.5 rounded-full hover:bg-[rgba(246,249,255,0.05)] transition-colors"
                title="退出登录"
              >
                <LogOut className="w-4 h-4 text-[rgba(246,249,255,0.4)] hover:text-[rgba(246,249,255,0.7)]" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="liquid-glass px-5 py-2 rounded-full text-sm text-[#f6f9ff] interactive hover:text-[#efb6ff] transition-colors"
            >
              登录
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden interactive" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden liquid-glass-strong mx-4 mb-4 rounded-2xl p-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`block text-base py-2 interactive ${location.pathname === item.href ? 'text-[#efb6ff]' : 'text-[rgba(246,249,255,0.8)]'}`}
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-[rgba(246,249,255,0.08)] pt-4">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[rgba(239,182,255,0.15)] flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-[#efb6ff]" />
                  </div>
                  <span className="text-sm text-[rgba(246,249,255,0.8)]">{currentUser.username}</span>
                </div>
                <button onClick={logout} className="text-sm text-[rgba(246,249,255,0.5)] interactive">退出</button>
              </div>
            ) : (
              <Link to="/login" className="block text-center liquid-glass px-5 py-3 rounded-full text-sm text-[#f6f9ff] interactive">登录</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
