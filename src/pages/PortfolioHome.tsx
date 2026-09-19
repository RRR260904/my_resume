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

      // Dynamically set page title and meta description if site_settings exists
      if (summary.site_settings?.site_title) {
        document.title = summary.site_settings.site_title;
      } else if (summary.profile?.name) {
        document.title = `${summary.profile.name} | ${summary.profile.role || 'Developer Portfolio'}`;
      }
    } catch (err: any) {
      console.error('Failed to fetch portfolio data:', err);
      setError('Unable to connect to MongoDB server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-4">
        <div className="relative w-12 h-12">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-slate-400">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span>Loading MongoDB Portfolio Stream...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 max-w-md rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Connection Interrupted</h2>
          <p className="text-sm text-slate-400">{error || 'Unknown error'}</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={loadPortfolio}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <Link
              to="/admin/login"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if MongoDB is completely empty
  const isCompletelyEmpty =
    !data.profile &&
    !data.about &&
    data.skills.length === 0 &&
    data.experiences.length === 0 &&
    data.education.length === 0 &&
    data.projects.length === 0 &&
    data.certifications.length === 0 &&
    data.achievements.length === 0 &&
    data.social_links.length === 0 &&
    !data.contact_info;

  if (isCompletelyEmpty) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
        <header className="p-6 flex items-center justify-between border-b border-slate-900">
          <span className="text-sm font-bold font-mono tracking-wider text-slate-400">
            [MONGODB_PORTFOLIO_EMPTY]
          </span>
          <Link
            to="/admin/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span>Open Admin Dashboard</span>
          </Link>
        </header>

        <main className="max-w-xl mx-auto px-6 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-blue-400 shadow-xl">
            <Database className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            MongoDB Database Is Empty
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Strict dynamic rendering is enforced: since no records exist in the database, all sections, navigation links, and cards are omitted.
          </p>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2 text-left font-mono">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Next Steps:</span>
            </div>
            <p>1. Log into the Admin Dashboard using default credentials.</p>
            <p>2. Click <strong>"Seed Demo Data"</strong> to populate realistic portfolio data instantly, or manually create your profile, projects, and skills.</p>
          </div>
          <div>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all"
            >
              <Shield className="w-4 h-4" />
              <span>Log In as Admin & Populate Data</span>
            </Link>
          </div>
        </main>

        <footer className="p-6 text-center text-xs text-slate-600 font-mono border-t border-slate-900">
          MongoDB Single Source of Truth • Dynamic Rendering Protocol
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 selection:bg-blue-600 selection:text-white relative">
      {/* Top Navbar: dynamically filters menu items based on existing data */}
      <Navbar data={data} />

      <main>
        {/* Hero Section */}
        {data.profile && <Hero profile={data.profile} socialLinks={data.social_links} />}

        {/* About Section */}
        {data.about && <About about={data.about} />}

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && <Skills skills={data.skills} />}

        {/* Experience Section */}
        {data.experiences && data.experiences.length > 0 && (
          <Experience experiences={data.experiences} />
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && <Projects projects={data.projects} />}

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <Education education={data.education} />
        )}

        {/* Certifications Section */}
        {data.certifications && data.certifications.length > 0 && (
          <Certifications certifications={data.certifications} />
        )}

        {/* Achievements Section */}
        {data.achievements && data.achievements.length > 0 && (
          <Achievements achievements={data.achievements} />
        )}

        {/* Social Links Section */}
        {data.social_links && data.social_links.length > 0 && (
          <SocialLinks socialLinks={data.social_links} />
        )}

        {/* Contact Section */}
        {data.contact_info && <Contact contactInfo={data.contact_info} />}
      </main>

      {/* Footer */}
      <Footer siteSettings={data.site_settings} profile={data.profile} />
    </div>
  );
}
