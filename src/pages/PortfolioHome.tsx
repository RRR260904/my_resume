import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Database, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchPortfolioSummary } from '../services/api';
import { PortfolioData } from '../types';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Experience } from '../components/Experience';
import { Education } from '../components/Education';
import { Projects } from '../components/Projects';
import { Certifications } from '../components/Certifications';
import { Achievements } from '../components/Achievements';
import { SocialLinks } from '../components/SocialLinks';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export function PortfolioHome() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await fetchPortfolioSummary();
      setData(summary);
      if (summary.site_settings?.site_title) {
        document.title = summary.site_settings.site_title;
      } else if (summary.profile?.name) {
        document.title = `${summary.profile.name} | ${summary.profile.role || 'Portfolio'}`;
      }
    } catch (err: any) {
      console.error('Failed to fetch portfolio data:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPortfolio(); }, []);

  /* ── Loading: blank screen, no animation ── */
  if (loading) {
    return <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }} />;
  }

  /* ── Error Screen ── */
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="card p-8 max-w-sm w-full space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Connection Failed</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{error || 'Unknown error'}</p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <button onClick={loadPortfolio} className="btn-primary text-xs px-4 py-2">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <Link to="/admin/login" className="btn-outline text-xs px-4 py-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty DB State ── */
  const isCompletelyEmpty =
    !data.profile && !data.about &&
    data.skills.length === 0 && data.experiences.length === 0 &&
    data.education.length === 0 && data.projects.length === 0 &&
    data.certifications.length === 0 && data.achievements.length === 0 &&
    data.social_links.length === 0 && !data.contact_info;

  if (isCompletelyEmpty) {
    return (
      <div className="min-h-screen flex flex-col justify-between" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        <header className="p-5 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-sm font-bold font-mono" style={{ color: 'var(--text-muted)' }}>[PORTFOLIO_EMPTY]</span>
          <Link to="/admin/login" className="btn-accent text-xs px-4 py-2">
            <Shield className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>
        </header>

        <main className="max-w-lg mx-auto px-6 py-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Database className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--text)' }}>Database is Empty</h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            No data found. Log into Admin Dashboard to add your profile, projects, and skills.
          </p>
          <div className="card-theme p-4 text-xs text-left font-mono space-y-2" style={{ color: 'var(--text-sub)' }}>
            <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--accent)' }}>
              <Sparkles className="w-4 h-4" />
              <span>Next Steps:</span>
            </div>
            <p>1. Open Admin Dashboard</p>
            <p>2. Click <strong>"Seed Demo Data"</strong> or add your profile manually</p>
          </div>
          <Link to="/admin/login" className="btn-primary mx-auto">
            <Shield className="w-4 h-4" />
            <span>Go to Admin Dashboard</span>
          </Link>
        </main>

        <footer className="p-5 text-center text-xs border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          Dynamic Portfolio • MongoDB Powered
        </footer>
      </div>
    );
  }

  /* ── Main Portfolio ── */
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar data={data} />

      <main>
        {data.profile && <Hero profile={data.profile} socialLinks={data.social_links} />}
        {data.about && <About about={data.about} />}
        {data.skills?.length > 0 && <Skills skills={data.skills} />}
        {data.experiences?.length > 0 && <Experience experiences={data.experiences} />}
        {data.projects?.length > 0 && <Projects projects={data.projects} />}
        {data.education?.length > 0 && <Education education={data.education} />}
        {data.certifications?.length > 0 && <Certifications certifications={data.certifications} />}
        {data.achievements?.length > 0 && <Achievements achievements={data.achievements} />}
        {data.social_links?.length > 0 && <SocialLinks socialLinks={data.social_links} />}
        {data.contact_info && <Contact contactInfo={data.contact_info} />}
      </main>

      <Footer siteSettings={data.site_settings} profile={data.profile} />
    </div>
  );
}
