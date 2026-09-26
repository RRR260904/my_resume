import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code,
  FileCode,
  Palette,
  Sparkles,
  Box,
  Server,
  Cpu,
  Zap,
  Network,
  Layers,
  Database,
  HardDrive,
  Cloud,
  CloudRain,
  Container,
  GitBranch,
  Settings,
  Activity,
  Terminal,
  BookOpen,
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  FolderCheck,
  Table,
  BarChart3,
  Globe,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
}

const ICON_MAP: Record<string, any> = {
  Code,
  FileCode,
  Palette,
  Sparkles,
  Box,
  Server,
  Cpu,
  Zap,
  Network,
  Layers,
  Database,
  HardDrive,
  Cloud,
  CloudRain,
  Container,
  GitBranch,
  Settings,
  Activity,
  BookOpen,
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  FolderCheck,
  Table,
  BarChart3,
  Globe,
  Share2,
  MessageSquare,
};

export function Skills({ skills }: SkillsProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  // Extract unique categories from actual database items
  const categories = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => {
      if (s.category && s.category.trim()) {
        set.add(s.category.trim());
      }
    });
    return ['All', ...Array.from(set)];
  }, [skills]);

  const [activeCategory, setActiveCategory] = useState('All');

  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All') return skills;
    return skills.filter((s) => s.category === activeCategory);
  }, [skills, activeCategory]);

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800/40 text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills & Technologies
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Production-tested stack spanning distributed backends, modern frontend architectures, and cloud infrastructure.
          </p>
        </div>

        {/* Category Filter Pills */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Skills Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <AnimatePresence>
            {filteredSkills.map((skill) => {
              const IconComponent = (skill.icon && ICON_MAP[skill.icon]) || Terminal;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  key={skill.id || skill.name}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-950/40 transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {skill.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {skill.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-mono font-bold text-blue-400">
                        {skill.proficiency}%
                      </span>
                      {skill.featured && (
                        <span className="text-[10px] font-semibold text-purple-400 bg-purple-950/40 border border-purple-800/40 px-1.5 py-0.5 rounded mt-0.5">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Proficiency Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
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
