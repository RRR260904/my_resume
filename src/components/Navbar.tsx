import { useState, useEffect, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { PortfolioData } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps { data: PortfolioData; }

export function Navbar({ data }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const navLinks = [
    data.about && { label: 'About', href: '#about' },
    data.skills?.length && { label: 'Skills', href: '#skills' },
    data.experiences?.length && { label: 'Experience', href: '#experience' },
    data.projects?.length && { label: 'Projects', href: '#projects' },
    data.education?.length && { label: 'Education', href: '#education' },
    data.certifications?.length && { label: 'Certs', href: '#certifications' },
    data.achievements?.length && { label: 'Achievements', href: '#achievements' },
    data.contact_info && { label: 'Contact', href: '#contact' },
  ].filter(Boolean) as { label: string; href: string }[];

  const brand = data.profile?.name || 'Portfolio';
  const role = data.profile?.role?.split('&')[0].trim() || '';

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') return;
    e.preventDefault();
    setOpen(false);
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 10);
  };

  const navBg = scrolled
    ? isDark
      ? 'rgba(8,13,26,0.92)'
      : 'rgba(255,255,255,0.92)'
    : 'transparent';

  return (
    <>
      {/* ── Top bar ── */}
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          backgroundColor: navBg,
          backdropFilter: scrolled ? 'blur(20px)' : undefined,
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : undefined,
          borderBottom: scrolled ? `1px solid var(--border)` : 'none',
          boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.06)' : 'none',
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Brand */}
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-sm font-black text-white">{brand.charAt(0)}</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate transition-colors group-hover:text-blue-500" style={{ color: 'var(--text)' }}>{brand}</span>
              {role && <span className="text-[10px] hidden sm:block truncate" style={{ color: 'var(--text-muted)' }}>{role}</span>}
            </div>
          </Link>

          {/* Desktop nav pills */}
          <nav className="hidden lg:flex items-center gap-0.5 p-1.5 rounded-full border" style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)' }}>
            {navLinks.map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={e => go(e, item.href)}
                className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 hover:text-blue-500"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {data.profile?.resume_url && (
              <a href={data.profile.resume_url} target="_blank" rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all"
                style={{ color: 'var(--text-sub)', backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-sub)'; }}
              >
                Resume <ArrowUpRight className="w-3 h-3" />
              </a>
            )}

            <Link to="/admin/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all"
              style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-light)', borderColor: 'var(--border-accent)' }}
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </Link>

            {/* Theme toggle */}
            <button type="button" onClick={toggleTheme} aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center rounded-xl border transition-all"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Sun className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Moon className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Hamburger */}
            <button type="button" onClick={() => setOpen(!open)} aria-label="Menu"
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border transition-all"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: open ? 'var(--accent)' : 'var(--border)', color: 'var(--text-sub)' }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              onClick={() => setOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[min(320px,85vw)] flex flex-col lg:hidden shadow-2xl"
              style={{ backgroundColor: 'var(--bg-surface)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="font-black text-white">{brand.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{brand}</p>
                    {role && <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{role}</p>}
                  </div>
                </div>
                <button type="button" onClick={() => setOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl"
                  style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
                {navLinks.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={e => go(e, item.href)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all"
                    style={{ color: 'var(--text-sub)' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--accent-light)'; e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-sub)'; }}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs font-mono opacity-50">{item.href}</span>
                  </motion.a>
                ))}
              </div>

              {/* Bottom actions */}
              <div className="px-4 pb-8 pt-4 border-t space-y-2.5" style={{ borderColor: 'var(--border)' }}>
                {data.profile?.resume_url && (
                  <a href={data.profile.resume_url} target="_blank" rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="btn-outline w-full">
                    <ArrowUpRight className="w-4 h-4" /> Resume
                  </a>
                )}
                <Link to="/admin/dashboard" onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold border transition-all"
                  style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-light)', borderColor: 'var(--border-accent)' }}>
                  <Shield className="w-4 h-4" /> Admin Portal
                </Link>
                <button type="button" onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium border transition-all"
                  style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text-sub)' }}>
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
