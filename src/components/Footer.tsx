import { ArrowUp, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiteSettings, Profile } from '../types';

interface FooterProps {
  siteSettings: SiteSettings | null;
  profile: Profile | null;
}

export function Footer({ siteSettings, profile }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const brandName = profile?.name || 'Portfolio';
  const year = new Date().getFullYear();
  const footerText = siteSettings?.footer_text || `Built with passion and modern technologies.`;

  return (
    <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{brandName.charAt(0)}</span>
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight">
              {brandName}
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            {footerText}
          </p>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            © {year} {brandName}. Made with <Heart className="w-3 h-3 text-rose-400 inline" /> All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-50 border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Admin Portal</span>
          </Link>

          <button
            type="button"
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all cursor-pointer"
            title="Back to Top"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
