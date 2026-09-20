import { motion } from 'motion/react';
import { ArrowDown, Download, Mail, MapPin, Briefcase, Github, Linkedin, Globe } from 'lucide-react';
import { Profile, SocialLink } from '../types';

interface HeroProps {
  profile: Profile | null;
  socialLinks?: SocialLink[];
}

function getSocialHref(link: SocialLink) {
  return link.url;
}
function getSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes('github')) return Github;
  if (p.includes('linkedin')) return Linkedin;
  return Globe;
}

export function Hero({ profile, socialLinks }: HeroProps) {
  if (!profile || !profile.is_active) return null;

  const go = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  const topSocials = (socialLinks || []).slice(0, 3);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden px-4 pt-20 pb-10">

      {/* ── Gradient blobs (mobile-sized) ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[280px] sm:w-[500px] h-[280px] sm:h-[400px] rounded-full blur-[80px] sm:blur-[120px] opacity-30 bg-blue-400 dark:bg-blue-600" style={{ animation: 'glow-pulse 4s ease-in-out infinite' }} />
        <div className="absolute bottom-[15%] right-[-10%] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full blur-[60px] sm:blur-[100px] opacity-20 bg-indigo-400 dark:bg-indigo-600" style={{ animation: 'glow-pulse 5s ease-in-out infinite 1.5s' }} />
        <div className="absolute top-[10%] left-[-5%] w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] rounded-full blur-[50px] opacity-15 bg-purple-400 dark:bg-purple-600" style={{ animation: 'glow-pulse 6s ease-in-out infinite 0.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">

        {/* Available badge */}
        {profile.available_for_work && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 sm:mb-6"
            style={{ backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#10b981' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Available for work
          </motion.div>
        )}

        {/* Avatar */}
        {profile.profile_image && (
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative mb-5 sm:mb-7 group"
            style={{ animation: 'floatY 4s ease-in-out infinite' }}
          >
            {/* Ring glow */}
            <div className="absolute -inset-1 rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-500 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <div
              className="relative rounded-full overflow-hidden border-4"
              style={{
                width: 'clamp(96px, 22vw, 140px)',
                height: 'clamp(96px, 22vw, 140px)',
                borderColor: 'var(--bg-surface)',
              }}
            >
              <img
                src={profile.profile_image}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>
        )}

        {/* Role pill */}
        {profile.role && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="pill mb-4"
          >
            <Briefcase className="w-3 h-3" />
            <span>{profile.role}</span>
          </motion.div>
        )}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-black tracking-tight leading-[1.05] mb-3"
          style={{
            fontSize: 'clamp(2rem, 8vw, 4rem)',
            color: 'var(--text)',
          }}
        >
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            {profile.name}
          </span>
        </motion.h1>

        {/* Tagline */}
        {profile.tagline && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="leading-relaxed mb-2 px-2"
            style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)', color: 'var(--text-sub)', maxWidth: '56ch' }}
          >
            {profile.tagline}
          </motion.p>
        )}

        {/* Bio — hidden on very small screens */}
        {profile.bio && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="hidden sm:block text-sm leading-relaxed mb-4 px-4"
            style={{ color: 'var(--text-muted)', maxWidth: '52ch' }}
          >
            {profile.bio}
          </motion.p>
        )}

        {/* Meta chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-7 sm:mb-9 text-xs font-mono"
          style={{ color: 'var(--text-muted)' }}
        >
          {profile.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              {profile.location}
            </span>
          )}
          {typeof profile.years_of_experience === 'number' && profile.years_of_experience > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              {profile.years_of_experience}y Experience
            </span>
          )}
        </motion.div>

        {/* CTA Buttons — stacked on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-xs sm:max-w-none sm:w-auto"
        >
          <button type="button" onClick={() => go('#projects')} className="btn-primary">
            View Projects
          </button>
          {profile.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <Download className="w-4 h-4" /> Resume
            </a>
          )}
          <button type="button" onClick={() => go('#contact')} className="btn-outline">
            <Mail className="w-4 h-4" /> Contact
          </button>
        </motion.div>

        {/* Social links — small icons row */}
        {topSocials.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 mt-6"
          >
            {topSocials.map((sl, i) => {
              const Icon = getSocialIcon(sl.platform);
              return (
                <a
                  key={i}
                  href={getSocialHref(sl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-xl border transition-all hover:scale-110"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </motion.div>
        )}

        {/* Scroll hint */}
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => go('#about')}
          className="mt-12 sm:mt-16 flex flex-col items-center gap-1 cursor-pointer"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-bounce" style={{ color: 'var(--accent)' }} />
        </motion.button>
      </div>
    </section>
  );
}
