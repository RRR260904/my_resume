import { motion } from 'motion/react';
import { CheckCircle2, Quote, Sparkles, Heart } from 'lucide-react';
import { About as AboutType } from '../types';

interface AboutProps { about: AboutType | null; }

export function About({ about }: AboutProps) {
  if (!about || !about.is_active) return null;

  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <div className="section-pill mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Background</span>
          </div>
          <h2 className="section-heading">About Me</h2>
        </div>

        <div className={`grid grid-cols-1 ${about.avatar_secondary ? 'lg:grid-cols-12' : ''} gap-8 lg:gap-12`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`space-y-6 ${about.avatar_secondary ? 'lg:col-span-7' : ''}`}
          >
            {about.title && (
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>{about.title}</h3>
            )}
            {about.description && (
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-sub)' }}>{about.description}</p>
            )}

            {about.quote && (
              <div className="relative p-5 rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--border-accent)' }}>
                <Quote className="absolute -bottom-2 -right-2 w-14 h-14 opacity-20" style={{ color: 'var(--accent)' }} />
                <p className="italic text-sm sm:text-base leading-relaxed relative z-10" style={{ color: 'var(--text-sub)' }}>"{about.quote}"</p>
              </div>
            )}

            {about.highlights?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Core Principles</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {about.highlights!.map((item, i) => (
                    <div key={i} className="card-theme flex items-start gap-2.5 p-3 text-xs sm:text-sm" style={{ color: 'var(--text-sub)' }}>
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {about.hobbies?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Interests</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {about.hobbies!.map((h, i) => (
                    <span key={i} className="tag hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-default">{h}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {about.avatar_secondary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-2xl overflow-hidden border group" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-muted)' }}>
                <img
                  src={about.avatar_secondary}
                  alt="Workspace"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl backdrop-blur-md border text-xs font-mono" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                  # Continuous Learning & Deep Work
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
