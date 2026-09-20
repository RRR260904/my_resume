import { motion } from 'motion/react';
import { ArrowDown, Download, Mail, MapPin, Briefcase } from 'lucide-react';
import { Profile, SocialLink } from '../types';

interface HeroProps {
  profile: Profile | null;
  socialLinks?: SocialLink[];
}

export function Hero({ profile, socialLinks }: HeroProps) {
  if (!profile || !profile.is_active) {
    return null;
  }

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Light background blobs */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-200/60 via-indigo-100/40 to-purple-200/60 blur-[100px] rounded-full pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-2/3 right-10 w-[300px] h-[300px] bg-blue-100/60 blur-[80px] rounded-full pointer-events-none"
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Availability Badge */}
        {profile.available_for_work && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium mb-8 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for new opportunities & consulting
          </motion.div>
        )}

        {/* Profile Avatar */}
        {profile.profile_image && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative mb-8 group"
          >
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-50 blur-md group-hover:opacity-80 transition duration-500" />
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white bg-slate-100 shadow-2xl shadow-blue-100">
              <img
                src={profile.profile_image}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>
        )}

        {/* Name & Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-3 max-w-4xl"
        >
          {profile.role && (
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-blue-600 font-semibold px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{profile.role}</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              {profile.name}
            </span>
          </h1>

          {profile.tagline && (
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto pt-2">
              {profile.tagline}
            </p>
          )}

          {profile.bio && (
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed pt-1">
              {profile.bio}
            </p>
          )}
        </motion.div>

        {/* Location & Experience meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs text-slate-500 font-mono"
        >
          {profile.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{profile.location}</span>
            </div>
          )}
          {typeof profile.years_of_experience === 'number' && profile.years_of_experience > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>{profile.years_of_experience} {profile.years_of_experience === 1 ? 'Year' : 'Years'} Experience</span>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3.5 mt-8"
        >
          <button
            type="button"
            onClick={() => scrollToSection('#projects')}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all duration-200 cursor-pointer"
          >
            Explore Projects
          </button>

          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm"
            >
              <Download className="w-4 h-4 text-blue-500" />
              <span>Download Resume</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => scrollToSection('#contact')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all duration-200 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-slate-400" />
            <span>Get in Touch</span>
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex flex-col items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          onClick={() => scrollToSection('#about')}
        >
          <span className="text-[11px] font-mono tracking-widest uppercase mb-1">Scroll to explore</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-blue-400" />
        </motion.div>
      </div>
    </section>
  );
}
