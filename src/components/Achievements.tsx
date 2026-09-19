import { motion } from 'motion/react';
import { Trophy, Star, Award, Zap, ExternalLink, Calendar } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsProps {
  achievements: Achievement[];
}

const ICON_MAP: Record<string, any> = {
  Trophy,
  Star,
  Award,
  Zap,
};

export function Achievements({ achievements }: AchievementsProps) {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <section id="achievements" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800/40 text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Key Achievements & Recognition
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item, index) => {
            const IconComp = (item.icon && ICON_MAP[item.icon]) || Trophy;
            return (
              <motion.div
                key={item.id || `${item.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-amber-500/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400">
                      <IconComp className="w-5 h-5" />
                    </div>

                    {item.metric && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-800/50">
                        {item.metric}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    {item.date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{item.date}</span>
                      </div>
                    )}
                    {item.organization && (
                      <span>• {item.organization}</span>
                    )}
                  </div>

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-amber-400 p-1 transition-colors"
                      title="Learn More"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
