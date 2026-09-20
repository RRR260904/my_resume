import { useState, useEffect, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { PortfolioData } from '../types';

interface NavbarProps {
  data: PortfolioData;
}

export function Navbar({ data }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute dynamic nav links strictly based on existing data
  const navItems: { label: string; href: string }[] = [];

  if (data.about) navItems.push({ label: 'About', href: '#about' });
  if (data.skills && data.skills.length > 0) navItems.push({ label: 'Skills', href: '#skills' });
  if (data.experiences && data.experiences.length > 0) navItems.push({ label: 'Experience', href: '#experience' });
  if (data.projects && data.projects.length > 0) navItems.push({ label: 'Projects', href: '#projects' });
  if (data.education && data.education.length > 0) navItems.push({ label: 'Education', href: '#education' });
  if (data.certifications && data.certifications.length > 0) navItems.push({ label: 'Certifications', href: '#certifications' });
  if (data.achievements && data.achievements.length > 0) navItems.push({ label: 'Achievements', href: '#achievements' });
  if (data.contact_info) navItems.push({ label: 'Contact', href: '#contact' });

  const brandName = data.profile?.name || 'Portfolio';
  const roleTitle = data.profile?.role;

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') {
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
            <span className="text-sm font-bold text-white">
              {brandName.charAt(0)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors">
              {brandName}
            </span>
            {roleTitle && (
              <span className="text-xs text-slate-500 tracking-wide hidden sm:inline-block line-clamp-1">
                {roleTitle.split('&')[0].trim()}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200 backdrop-blur-md">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {data.profile?.resume_url && (
            <a
              href={data.profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
            >
              <span>Resume</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}

          <Link
            to="/admin/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg hover:border-blue-300 transition-all duration-200"
            title="Admin Management Dashboard"
          >
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-slate-200 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2"
          >
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              ))}
              {data.profile?.resume_url && (
                <a
                  href={data.profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <span>Download Resume</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
