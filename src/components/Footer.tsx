import { ArrowUp, Terminal, Shield } from 'lucide-react';
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

  const brandName = profile?.name || 'Developer Portfolio';
  const year = new Date().getFullYear();
  const footerText = siteSettings?.footer_text || 'Dynamic Developer Portfolio backed by MongoDB & Django REST architecture.';

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-white tracking-tight">
              {brandName}
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            {footerText}
          </p>
          <span className="text-[11px] font-mono text-slate-500">
            © {year} {brandName}. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Admin Portal</span>
          </Link>

          <button
            type="button"
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
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
