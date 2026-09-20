import { useState, useEffect, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { PortfolioData } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  data: PortfolioData;
}

export function Navbar({ data }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navItems: { label: string; href: string }[] = [];
  if (data.about) navItems.push({ label: 'About', href: '#about' });
  if (data.skills?.length) navItems.push({ label: 'Skills', href: '#skills' });
  if (data.experiences?.length) navItems.push({ label: 'Experience', href: '#experience' });
  if (data.projects?.length) navItems.push({ label: 'Projects', href: '#projects' });
  if (data.education?.length) navItems.push({ label: 'Education', href: '#education' });
  if (data.certifications?.length) navItems.push({ label: 'Certifications', href: '#certifications' });
  if (data.achievements?.length) navItems.push({ label: 'Achievements', href: '#achievements' });
  if (data.contact_info) navItems.push({ label: 'Contact', href: '#contact' });

  const brandName = data.profile?.name || 'Portfolio';
  const roleTitle = data.profile?.role?.split('&')[0].trim() || '';

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') return;
    e.preventDefault();
    setMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ─── Main Navbar ─── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-theme-surface/90 backdrop-blur-xl border-b border-theme shadow-sm py-3'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group flex-shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200 dark:shadow-blue-900/40 flex-shrink-0">
              <span className="text-sm font-black text-white">{brandName.charAt(0)}</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold tracking-tight text-theme group-hover:text-[var(--accent)] transition-colors truncate">
                {brandName}
              </span>
              {roleTitle && (
                <span className="text-[10px] text-theme-muted hidden sm:block truncate">{roleTitle}</span>
              )}
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-theme-muted/60 p-1.5 rounded-full border border-theme backdrop-blur-md">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="px-3.5 py-1.5 text-xs font-medium text-theme-muted hover:text-[var(--accent)] hover:bg-theme-surface rounded-full transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Resume link — desktop only */}
            {data.profile?.resume_url && (
              <a
                href={data.profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-theme-sub bg-theme-card border border-theme hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                <span>Resume</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}

            {/* Admin */}
            <Link
              to="/admin/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-[var(--accent)] bg-[var(--accent-light)] border border-[var(--border-accent)] hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-theme-card border border-theme hover:border-[var(--accent)] hover:text-[var(--accent)] text-theme-muted transition-all duration-200"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-theme-card border border-theme text-theme-sub hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ─── Mobile Full-Screen Menu ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 bg-theme-surface flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-theme">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
                  <span className="text-base font-black text-white">{brandName.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-theme">{brandName}</p>
                  {roleTitle && <p className="text-[11px] text-theme-muted">{roleTitle}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-theme-muted text-theme-sub"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-1">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium text-theme-sub hover:text-[var(--accent)] hover:bg-[var(--accent-light)] transition-all"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-theme-muted font-mono">{item.href}</span>
                </motion.a>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-6 border-t border-theme space-y-3">
              {data.profile?.resume_url && (
                <a
                  href={data.profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Download Resume</span>
                </a>
              )}
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-[var(--accent)] bg-[var(--accent-light)] border border-[var(--border-accent)]"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Portal</span>
              </Link>

              {/* Theme toggle in mobile menu */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-theme-sub bg-theme-muted border border-theme"
              >
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
