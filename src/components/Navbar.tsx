import { useState, useEffect, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { PortfolioData } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps { data: PortfolioData; }

export function Navbar({ data }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Intersection observer for active section
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const navItems: { label: string; href: string }[] = [];
  if (data.about) navItems.push({ label: 'About', href: '#about' });
  if (data.skills?.length) navItems.push({ label: 'Skills', href: '#skills' });
  if (data.experiences?.length) navItems.push({ label: 'Experience', href: '#experience' });
  if (data.projects?.length) navItems.push({ label: 'Projects', href: '#projects' });
  if (data.education?.length) navItems.push({ label: 'Education', href: '#education' });
  if (data.certifications?.length) navItems.push({ label: 'Certs', href: '#certifications' });
  if (data.achievements?.length) navItems.push({ label: 'Awards', href: '#achievements' });
  if (data.contact_info) navItems.push({ label: 'Contact', href: '#contact' });

  const brandName = data.profile?.name || 'Portfolio';

  const scrollTo = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') return;
    e.preventDefault();
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      >
        <div
          className={`w-full max-w-5xl flex items-center justify-between gap-3 px-3 sm:px-4 rounded-2xl transition-all duration-500 ${
            scrolled ? 'py-2.5' : 'py-3'
          }`}
          style={scrolled ? {
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          } : {
            background: 'transparent',
          }}
        >
          {/* Brand */}
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg text-white font-black text-sm flex-shrink-0"
              style={{ background: 'var(--grad-brand)', boxShadow: 'var(--shadow-glow-sm)' }}>
              {brandName.charAt(0)}
            </div>
            <span className="text-sm font-bold hidden sm:block group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>
              {brandName}
            </span>
          </Link>

          {/* Desktop Nav Pills */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full"
            style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollTo(e, item.href)}
                  className="relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200"
                  style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'var(--accent-light)', border: '1px solid var(--border-accent)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {data.profile?.resume_url && (
              <a href={data.profile.resume_url} target="_blank" rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all hover:text-[var(--accent)]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-sub)' }}>
                <span>Resume</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}

            <Link to="/admin/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all"
              style={{ color: 'var(--accent)', background: 'var(--accent-light)', border: '1px solid var(--border-accent)' }}>
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            {/* Theme Toggle */}
            <button type="button" onClick={toggleTheme} aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:text-[var(--accent)]"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }} transition={{ duration: 0.25 }}>
                    <Sun className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }} transition={{ duration: 0.25 }}>
                    <Moon className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Hamburger */}
            <button type="button" onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-sub)' }}
              aria-label="Menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Full-screen Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-0 z-40 flex flex-col lg:hidden"
            style={{ background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-lg"
                  style={{ background: 'var(--grad-brand)', boxShadow: 'var(--shadow-glow-sm)' }}>
                  {brandName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{brandName}</p>
                  {data.profile?.role && (
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{data.profile.role.split('&')[0].trim()}</p>
                  )}
                </div>
              </div>
              <button type="button" onClick={() => setMobileOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{ background: 'var(--bg-muted)', color: 'var(--text-sub)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollTo(e, item.href)}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    color: activeSection === item.href.slice(1) ? 'var(--accent)' : 'var(--text-sub)',
                    background: activeSection === item.href.slice(1) ? 'var(--accent-light)' : 'transparent',
                    border: activeSection === item.href.slice(1) ? '1px solid var(--border-accent)' : '1px solid transparent',
                  }}
                >
                  <span>{item.label}</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{item.href}</span>
                </motion.a>
              ))}
            </div>

            {/* Footer actions */}
            <div className="px-4 py-5 border-t space-y-3" style={{ borderColor: 'var(--border)' }}>
              {data.profile?.resume_url && (
                <a href={data.profile.resume_url} target="_blank" rel="noopener noreferrer"
                  className="btn-ghost w-full" onClick={() => setMobileOpen(false)}>
                  <ArrowUpRight className="w-4 h-4" /><span>Download Resume</span>
                </a>
              )}
              <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ color: 'var(--accent)', background: 'var(--accent-light)', border: '1px solid var(--border-accent)' }}>
                <Shield className="w-4 h-4" /><span>Admin Portal</span>
              </Link>
              <button type="button" onClick={toggleTheme}
                className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text-sub)' }}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
