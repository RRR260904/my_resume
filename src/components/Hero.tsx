import { motion } from 'motion/react';
import { ArrowDown, Download, Mail, MapPin, Briefcase } from 'lucide-react';
import { Profile, SocialLink } from '../types';

interface HeroProps {
  profile: Profile | null;
  socialLinks?: SocialLink[];
}

export function Hero({ profile, socialLinks }: HeroProps) {
  if (!profile || !profile.is_active) return null;

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background blobs */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] rounded-full bg-indigo-400/10 dark:bg-indigo-500/8 blur-[100px]" style={{ animation: 'pulse-glow 4s ease-in-out infinite 1.5s' }} />
        <div className="absolute top-1/4 left-0 w-[250px] h-[250px] rounded-full bg-purple-400/8 dark:bg-purple-500/8 blur-[80px]" style={{ animation: 'pulse-glow 5s ease-in-out infinite 0.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">

        {/* Available badge */}
        {profile.available_for_work && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-6 sm:mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Available for opportunities
          </motion.div>
        )}

        {/* Profile Avatar */}
        {profile.profile_image && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative mb-6 sm:mb-8 group"
          >
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-60 blur-sm group-hover:opacity-90 transition duration-500" />
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-theme-surface bg-theme-muted shadow-2xl">
              <img
                src={profile.profile_image}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>
        )}

        {/* Role badge */}
        {profile.role && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-pill mb-4"
          >
            <Briefcase className="w-3 h-3" />
            <span>{profile.role}</span>
          </motion.div>
        )}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-4"
          style={{ color: 'var(--text)' }}
        >
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            {profile.name}
          </span>
        </motion.h1>

        {/* Tagline */}
        {profile.tagline && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-3"
            style={{ color: 'var(--text-sub)' }}
          >
            {profile.tagline}
          </motion.p>
        )}

        {/* Bio */}
        {profile.bio && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-sm sm:text-base max-w-xl leading-relaxed mb-6 sm:mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            {profile.bio}
          </motion.p>
        )}

        {/* Meta info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-8 sm:mb-10 text-xs font-mono"
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

        {/* CTAs — full width on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto"
        >
          <button
            type="button"
            onClick={() => scrollToSection('#projects')}
            className="btn-accent flex-1 sm:flex-none"
          >
            Explore Projects
          </button>

          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost flex-1 sm:flex-none"
            >
              <Download className="w-4 h-4" />
              <span>Resume</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => scrollToSection('#contact')}
            className="btn-ghost flex-1 sm:flex-none"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => scrollToSection('#about')}
          className="mt-14 sm:mt-20 flex flex-col items-center gap-1 cursor-pointer transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-bounce" style={{ color: 'var(--accent)' }} />
        </motion.button>
      </div>
    </section>
  );
}
