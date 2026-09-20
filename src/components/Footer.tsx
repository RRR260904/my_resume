import { ArrowUp, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiteSettings, Profile } from '../types';

export function Footer({ siteSettings, profile }: { siteSettings: SiteSettings | null; profile: Profile | null }) {
  const brand = profile?.name || 'Portfolio';
  const year = new Date().getFullYear();
  const text = siteSettings?.footer_text || 'Built with passion and modern technologies.';

  return (
    <footer className="border-t py-8 sm:py-10 px-4 sm:px-6" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
        {/* Brand */}
        <div className="flex flex-col items-center sm:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm font-black">{brand.charAt(0)}</span>
            </div>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{brand}</span>
          </div>
          <p className="text-xs max-w-xs" style={{ color: 'var(--text-muted)' }}>{text}</p>
          <p className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            © {year} {brand} • Made with <Heart className="w-3 h-3 text-rose-400" fill="currentColor" />
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to="/admin/login"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            <Shield className="w-3.5 h-3.5" /> Admin
          </Link>
          <button type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-9 h-9 flex items-center justify-center rounded-xl border transition-all"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
