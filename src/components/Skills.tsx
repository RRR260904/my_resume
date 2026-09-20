import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code, FileCode, Palette, Sparkles, Box, Server, Cpu, Zap, Network, Layers,
  Database, HardDrive, Cloud, Container, GitBranch, Settings, Activity,
  Terminal, BookOpen, DollarSign, FileSpreadsheet, BarChart3, Globe,
  Share2, MessageSquare, CheckCircle2, FolderCheck, Table,
} from 'lucide-react';
import { Skill } from '../types';

const ICON_MAP: Record<string, any> = {
  Code, FileCode, Palette, Sparkles, Box, Server, Cpu, Zap, Network, Layers,
  Database, HardDrive, Cloud, Container, GitBranch, Settings, Activity,
  Terminal, BookOpen, DollarSign, FileSpreadsheet, BarChart3, Globe,
  Share2, MessageSquare, CheckCircle2, FolderCheck, Table,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Frontend:    { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  Backend:     { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  Database:    { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
  DevOps:      { bg: '#fdf4ff', text: '#9333ea', border: '#e9d5ff' },
  Cloud:       { bg: '#e0f2fe', text: '#0284c7', border: '#bae6fd' },
  Mobile:      { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
  Tools:       { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
  Languages:   { bg: '#fdf2f8', text: '#be185d', border: '#fbcfe8' },
  Accounting:  { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
  Analytics:   { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  default:     { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
};

function getCategoryColors(category: string) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
}

/* Count-up animation hook */
function useCountUp(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);
  return count;
}

function SkillCard({ skill }: { skill: Skill }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const Icon = (skill.icon && ICON_MAP[skill.icon]) || Terminal;
  const colors = getCategoryColors(skill.category || '');
  const count = useCountUp(skill.proficiency || 0, inView);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (cardRef.current) obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={cardRef} className="card-glow p-4 group cursor-default">
      {/* Gradient accent top bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[var(--radius)] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'var(--grad-brand)' }} />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>
              {skill.name}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: colors.text }}>
              {skill.category}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-black font-mono" style={{ color: 'var(--accent)' }}>{count}%</span>
          {skill.featured && (
            <div className="text-[9px] font-bold text-center px-1.5 py-0.5 rounded-full mt-0.5"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}>
              ★ Top
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-muted)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.proficiency}%` } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="h-full rounded-full relative"
          style={{ background: 'var(--grad-brand)' }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute inset-y-0 w-1/3 bg-white/30 skew-x-12"
              style={{ animation: 'shimmer 2s ease-in-out infinite 1.3s' }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function Skills({ skills }: { skills: Skill[] }) {
  if (!skills?.length) return null;

  const categories = useMemo(() => {
    const s = new Set<string>();
    skills.forEach((sk) => { if (sk.category?.trim()) s.add(sk.category.trim()); });
    return ['All', ...Array.from(s)];
  }, [skills]);

  const [active, setActive] = useState('All');
  const filtered = useMemo(
    () => (active === 'All' ? skills : skills.filter((s) => s.category === active)),
    [skills, active]
  );

  return (
    <section id="skills" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-5"
        style={{ background: 'var(--grad-brand)', filter: 'blur(80px)' }} />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-10 sm:mb-14">
          <div className="section-pill mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Tech Stack</span>
          </div>
          <h2 className="section-heading">Skills & Technologies</h2>
          <p className="section-sub">Full-stack toolkit spanning modern frontend, backend, and cloud.</p>
        </div>

        {/* Filter pills — horizontal scroll on mobile */}
        {categories.length > 2 && (
          <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
            {categories.map((cat) => {
              const isActive = active === cat;
              const colors = getCategoryColors(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 border"
                  style={isActive
                    ? { background: 'var(--grad-brand)', color: '#fff', border: '1px solid transparent', boxShadow: '0 4px 15px rgba(59,130,246,0.35)' }
                    : { background: 'var(--bg-card)', color: 'var(--text-muted)', borderColor: 'var(--border)' }
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Skills grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence>
            {filtered.map((skill, i) => (
              <motion.div
                layout
                key={skill.id || skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <SkillCard skill={skill} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
