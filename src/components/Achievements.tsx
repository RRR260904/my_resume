import { motion } from 'motion/react';
import { Trophy, Star, Award, Zap, ExternalLink, Calendar } from 'lucide-react';
import { Achievement } from '../types';

const ICON_MAP: Record<string, any> = { Trophy, Star, Award, Zap };

export function Achievements({ achievements }: { achievements: Achievement[] }) {
  if (!achievements?.length) return null;

  return (
    <section id="achievements" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <div className="section-pill mb-3" style={{ backgroundColor: '#fef3c7', borderColor: '#fde68a', color: '#d97706' }}>
            <Trophy className="w-3.5 h-3.5" />
            <span>Recognition</span>
          </div>
          <h2 className="section-heading">Achievements</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {achievements.map((item, i) => {
            const Icon = (item.icon && ICON_MAP[item.icon]) || Trophy;
            return (
              <motion.div
                key={item.id || `${item.title}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card-theme p-5 flex flex-col group"
                style={{ '--hover-border': '#fde68a' } as any}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {item.metric && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', color: '#d97706' }}>
                      {item.metric}
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-bold mb-2 group-hover:text-amber-500 transition-colors" style={{ color: 'var(--text)' }}>
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-muted)' }}>
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-xs font-mono mt-auto pt-3 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    )}
                    {item.organization && <span>• {item.organization}</span>}
                  </div>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="p-1 transition-colors hover:text-amber-500"
                      style={{ color: 'var(--text-muted)' }}>
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
