import { motion } from 'motion/react';
import { CheckCircle2, Quote, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { About as AboutType } from '../types';

export function About({ about }: { about: AboutType | null }) {
  if (!about || !about.is_active) return null;

  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Decorative */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none opacity-5"
        style={{ background: 'var(--grad-brand)', filter: 'blur(60px)' }} />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-10 sm:mb-16">
          <div className="section-pill mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Background</span>
          </div>
          <h2 className="section-heading">About Me</h2>
        </div>

        <div className={`grid grid-cols-1 ${about.avatar_secondary ? 'lg:grid-cols-2' : ''} gap-8 lg:gap-14 items-center`}>
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {about.title && (
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>
                {about.title}
              </h3>
            )}

            {about.description && (
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                {about.description}
              </p>
            )}

            {about.quote && (
              <div className="relative p-5 sm:p-6 rounded-2xl overflow-hidden"
                style={{ background: 'var(--accent-light)', border: '1px solid var(--border-accent)' }}>
                <div className="absolute -bottom-3 -right-3 opacity-10">
                  <Quote className="w-20 h-20" style={{ color: 'var(--accent)' }} />
                </div>
                {/* Shimmer bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                  style={{ background: 'var(--grad-brand)' }} />
                <p className="italic text-sm sm:text-base leading-relaxed relative z-10 font-medium" style={{ color: 'var(--text-sub)' }}>
                  "{about.quote}"
                </p>
              </div>
            )}

            {about.highlights?.length > 0 && (
              <div>
                <p className="section-pill mb-4 w-fit">
                  <ArrowRight className="w-3 h-3" />
                  Core Principles
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {about.highlights!.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      className="card-glass flex items-start gap-2.5 p-3.5 text-xs sm:text-sm"
                      style={{ color: 'var(--text-sub)' }}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {about.hobbies?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  <Heart className="w-3.5 h-3.5 text-rose-400" fill="currentColor" />
                  Interests
                </div>
                <div className="flex flex-wrap gap-2">
                  {about.hobbies!.map((h, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="tag cursor-default"
                    >
                      {h}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Secondary image */}
          {about.avatar_secondary && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Glow behind image */}
              <div className="absolute inset-4 rounded-2xl blur-2xl opacity-30 -z-10"
                style={{ background: 'var(--grad-brand)' }} />

              <div className="relative rounded-2xl overflow-hidden border group"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-muted)' }}>
                <img
                  src={about.avatar_secondary}
                  alt="Workspace"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Caption bar */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl backdrop-blur-xl border text-xs font-mono"
                  style={{ background: 'var(--bg-glass)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                  # Continuous Learning &amp; Deep Work 🚀
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
