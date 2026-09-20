import { motion } from 'motion/react';
import { CheckCircle2, Quote, Sparkles, Heart } from 'lucide-react';
import { About as AboutType } from '../types';

export function About({ about }: { about: AboutType | null }) {
  if (!about || !about.is_active) return null;

  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="pill mb-3"><Sparkles className="w-3.5 h-3.5" /> Background</div>
          <h2 className="heading">About Me</h2>
        </div>

        <div className={`grid gap-8 lg:gap-12 ${about.avatar_secondary ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {about.title && (
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>{about.title}</h3>
            )}
            {about.description && (
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-sub)' }}>{about.description}</p>
            )}

            {about.quote && (
              <div className="relative p-4 sm:p-5 rounded-2xl overflow-hidden"
                style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--border-accent)' }}>
                <Quote className="absolute -bottom-1 -right-1 w-12 h-12 opacity-15" style={{ color: 'var(--accent)' }} />
                <p className="italic text-sm leading-relaxed relative z-10" style={{ color: 'var(--text-sub)' }}>
                  "{about.quote}"
                </p>
              </div>
            )}

            {about.highlights?.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Core Strengths</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {about.highlights!.map((h, i) => (
                    <div key={i} className="card flex items-start gap-2.5 p-3 text-sm" style={{ color: 'var(--text-sub)' }}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {about.hobbies?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  <Heart className="w-3.5 h-3.5 text-rose-400" /> Interests
                </div>
                <div className="flex flex-wrap gap-2">
                  {about.hobbies!.map((h, i) => <span key={i} className="chip">{h}</span>)}
                </div>
              </div>
            )}
          </motion.div>

          {about.avatar_secondary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="relative rounded-2xl overflow-hidden group border" style={{ borderColor: 'var(--border)' }}>
                <img
                  src={about.avatar_secondary}
                  alt="About"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 sm:h-72 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl text-xs font-mono"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                  # Continuous Learning
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
