import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code, FileCode, Palette, Sparkles, Box, Server, Cpu, Zap, Network, Layers,
  Database, HardDrive, Cloud, CloudRain, Container, GitBranch, Settings,
  Activity, Terminal, BookOpen, DollarSign, FileSpreadsheet, CheckCircle2,
  FolderCheck, Table, BarChart3, Globe, Share2, MessageSquare,
} from 'lucide-react';
import { Skill } from '../types';

const ICON_MAP: Record<string, any> = {
  Code, FileCode, Palette, Sparkles, Box, Server, Cpu, Zap, Network, Layers,
  Database, HardDrive, Cloud, CloudRain, Container, GitBranch, Settings,
  Activity, BookOpen, DollarSign, FileSpreadsheet, CheckCircle2, FolderCheck,
  Table, BarChart3, Globe, Share2, MessageSquare,
};

export function Skills({ skills }: { skills: Skill[] }) {
  if (!skills?.length) return null;

  const categories = useMemo(() => {
    const s = new Set<string>();
    skills.forEach(sk => { if (sk.category?.trim()) s.add(sk.category.trim()); });
    return ['All', ...Array.from(s)];
  }, [skills]);

  const [active, setActive] = useState('All');
  const filtered = useMemo(() =>
    active === 'All' ? skills : skills.filter(s => s.category === active),
    [skills, active]
  );

  return (
    <section id="skills" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="section-pill mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Tech Stack</span>
          </div>
          <h2 className="section-heading">Skills & Technologies</h2>
          <p className="section-sub">Full-stack toolkit spanning modern frontend, backend, and cloud.</p>
        </div>

        {/* Filter Pills — scrollable on mobile */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2 mx-auto flex-nowrap px-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                    active === cat
                      ? 'bg-[var(--accent)] text-white shadow-lg shadow-blue-500/25'
                      : 'bg-theme-card border border-theme text-theme-muted hover:border-[var(--accent)] hover:text-[var(--accent)]'
                  }`}
                  style={active !== cat ? { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-muted)' } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Skills Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence>
            {filtered.map(skill => {
              const Icon = (skill.icon && ICON_MAP[skill.icon]) || Terminal;
              return (
                <motion.div
                  layout
                  key={skill.id || skill.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="card-theme p-4 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[var(--accent-light)]"
                        style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--accent)' }}>
                        <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>{skill.name}</p>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{skill.category}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold font-mono" style={{ color: 'var(--accent)' }}>{skill.proficiency}%</span>
                      {skill.featured && (
                        <div className="text-[9px] font-semibold px-1.5 py-0.5 rounded mt-0.5" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}>
                          Featured
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
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
