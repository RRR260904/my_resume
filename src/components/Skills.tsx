import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code, FileCode, Palette, Sparkles, Box, Server, Cpu, Zap, Network, Layers,
  Database, HardDrive, Cloud, Container, GitBranch, Settings, Activity, Terminal,
  Globe, BarChart3,
} from 'lucide-react';
import { Skill } from '../types';

const ICONS: Record<string, any> = {
  Code, FileCode, Palette, Sparkles, Box, Server, Cpu, Zap, Network, Layers,
  Database, HardDrive, Cloud, Container, GitBranch, Settings, Activity, Terminal,
  Globe, BarChart3,
};

export function Skills({ skills }: { skills: Skill[] }) {
  if (!skills?.length) return null;

  const categories = useMemo(() => {
    const s = new Set<string>();
    skills.forEach(sk => { if (sk.category?.trim()) s.add(sk.category.trim()); });
    return ['All', ...Array.from(s)];
  }, [skills]);

  const [active, setActive] = useState('All');
  const filtered = useMemo(
    () => active === 'All' ? skills : skills.filter(s => s.category === active),
    [skills, active]
  );

  return (
    <section id="skills" className="py-16 sm:py-24 px-4 sm:px-6" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="pill mb-3"><Terminal className="w-3.5 h-3.5" /> Stack</div>
          <h2 className="heading">Skills & Technologies</h2>
          <p className="subtext">My full-stack toolkit for modern applications.</p>
        </div>

        {/* Filter pills — horizontally scrollable on mobile */}
        {categories.length > 2 && (
          <div className="flex gap-2 mb-8 sm:mb-10 overflow-x-auto no-scrollbar pb-1">
            <div className="flex gap-2 mx-auto flex-nowrap px-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                  style={
                    active === cat
                      ? { backgroundColor: 'var(--accent)', color: '#fff', boxShadow: '0 4px 14px rgba(59,130,246,0.35)' }
                      : { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence>
            {filtered.map(skill => {
              const Icon = (skill.icon && ICONS[skill.icon]) || Terminal;
              return (
                <motion.div
                  layout
                  key={skill.id || skill.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="card p-4 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                        style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--accent)' }}
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{skill.name}</p>
                        <p className="text-[10px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>{skill.category}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono shrink-0" style={{ color: 'var(--accent)' }}>
                      {skill.proficiency}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
