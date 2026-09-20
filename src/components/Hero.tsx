import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import { ArrowDown, Download, Mail, MapPin, Briefcase, Sparkles } from 'lucide-react';
import { Profile, SocialLink } from '../types';

interface HeroProps {
  profile: Profile | null;
  socialLinks?: SocialLink[];
}

/* ── Floating particle ── */
function Particle({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: 'var(--accent)',
        opacity: 0.15,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ── Typewriter hook ── */
function useTypewriter(words: string[], speed = 80) {
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing');

  useEffect(() => {
    const word = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (text.length < word.length) {
        timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), speed);
      } else {
        timeout = setTimeout(() => setPhase('pause'), 1600);
      }
    } else if (phase === 'pause') {
      timeout = setTimeout(() => setPhase('deleting'), 400);
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), speed / 2);
      } else {
        setWordIdx((i) => (i + 1) % words.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, wordIdx, words, speed]);

  return { text, showCursor: phase !== 'pause' };
}

/* ── Stat Card ── */
function StatCard({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass px-4 py-3 text-center min-w-[80px]"
    >
      <div className="text-xl sm:text-2xl font-black gradient-text">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
    </motion.div>
  );
}

export function Hero({ profile, socialLinks }: HeroProps) {
  if (!profile || !profile.is_active) return null;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const containerRef = useRef<HTMLElement>(null);

  const roles = profile.role
    ? profile.role.split('&').map((r) => r.trim()).filter(Boolean)
    : ['Developer'];

  const { text: typedRole, showCursor } = useTypewriter(roles, 75);

  const particles = Array.from({ length: 18 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 3 + Math.random() * 5,
    delay: i * 0.3,
  }));

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 20);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 20);
  };

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const hasStats = profile.years_of_experience || profile.location;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: 'var(--grad-hero)' }}
    >
      {/* ── Mesh dot pattern ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)',
          backgroundSize: '28px 28px',
          opacity: 0.6,
        }}
      />

      {/* ── Floating glow orbs ── */}
      <div className="absolute top-1/4 left-[10%] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', animation: 'float-orb 10s ease-in-out infinite' }} />
      <div className="absolute bottom-1/4 right-[10%] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', animation: 'float-orb 12s ease-in-out infinite 3s' }} />
      <div className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)', animation: 'float-orb 9s ease-in-out infinite 1.5s' }} />

      {/* ── Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">

        {/* Available badge */}
        {profile.available_for_work && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.25)',
              color: '#10b981',
            }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold tracking-wide">Open to opportunities</span>
          </motion.div>
        )}

        {/* Profile Avatar */}
        {profile.profile_image ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 120 }}
            className="relative mb-8 sm:mb-10 group"
            style={{ x: springX, y: springY } as any}
          >
            {/* Outer spinning gradient ring */}
            <div className="absolute -inset-3 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'conic-gradient(from 0deg, #3b82f6, #6366f1, #8b5cf6, #ec4899, #3b82f6)',
                animation: 'spin-slow 6s linear infinite',
                filter: 'blur(2px)',
              }} />
            {/* Inner ring */}
            <div className="absolute -inset-1.5 rounded-full"
              style={{
                background: 'conic-gradient(from 180deg, #3b82f6, #8b5cf6, #3b82f6)',
                animation: 'spin-slow-reverse 4s linear infinite',
                opacity: 0.5,
              }} />
            {/* Photo */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 z-10"
              style={{ borderColor: 'var(--bg-surface)' }}>
              <img
                src={profile.profile_image}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            {/* Glow behind photo */}
            <div className="absolute inset-0 rounded-full -z-10"
              style={{ boxShadow: 'var(--shadow-glow)', animation: 'pulse-glow 3s ease-in-out infinite' }} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full mb-8 flex items-center justify-center text-4xl font-black text-white"
            style={{ background: 'var(--grad-brand)' }}
          >
            {profile.name.charAt(0)}
          </motion.div>
        )}

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-3 mb-4"
        >
          <motion.h1
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.0]"
            style={{ color: 'var(--text)' }}
          >
            Hi, I'm{' '}
            <span
              className="gradient-text"
              style={{
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 4s ease infinite',
              }}
            >
              {profile.name}
            </span>
          </motion.h1>

          {/* Typewriter role */}
          {roles.length > 0 && (
            <div className="flex items-center justify-center gap-2 text-base sm:text-xl font-semibold min-h-[2rem]"
              style={{ color: 'var(--text-sub)' }}>
              <Briefcase className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
              <span>{typedRole}</span>
              <span
                className="inline-block w-0.5 h-5 rounded-full"
                style={{
                  backgroundColor: 'var(--accent)',
                  opacity: showCursor ? 1 : 0,
                  transition: 'opacity 0.1s',
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Tagline */}
        {profile.tagline && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-base sm:text-lg max-w-2xl leading-relaxed mb-3"
            style={{ color: 'var(--text-sub)' }}
          >
            {profile.tagline}
          </motion.p>
        )}

        {profile.bio && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-sm sm:text-base max-w-xl leading-relaxed mb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            {profile.bio}
          </motion.p>
        )}

        {/* Stat pills */}
        {hasStats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            {profile.location && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)', color: 'var(--text-sub)' }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                {profile.location}
              </div>
            )}
            {typeof profile.years_of_experience === 'number' && profile.years_of_experience > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)', color: 'var(--text-sub)' }}>
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-2)' }} />
                {profile.years_of_experience}+ Years Experience
              </div>
            )}
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-12 sm:mb-16"
        >
          <button type="button" onClick={() => scrollTo('#projects')} className="btn-accent flex-1 sm:flex-none text-sm sm:text-base">
            🚀 Explore Projects
          </button>
          {profile.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 sm:flex-none">
              <Download className="w-4 h-4" />
              <span>Resume</span>
            </a>
          )}
          <button type="button" onClick={() => scrollTo('#contact')} className="btn-ghost flex-1 sm:flex-none">
            <Mail className="w-4 h-4" />
            <span>Say Hello</span>
          </button>
        </motion.div>

        {/* Scroll cue */}
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => scrollTo('#about')}
          className="flex flex-col items-center gap-2 cursor-pointer group"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase group-hover:text-[var(--accent)] transition-colors">
            Scroll to explore
          </span>
          <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-1.5 group-hover:border-[var(--accent)] transition-colors"
            style={{ borderColor: 'var(--border)' }}>
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--accent)' }}
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.button>
      </div>
    </section>
  );
}
