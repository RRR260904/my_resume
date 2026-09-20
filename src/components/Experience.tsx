import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, ExternalLink, ArrowRight, Zap } from 'lucide-react';
import { Experience as ExperienceType } from '../types';

export function Experience({ experiences }: { experiences: ExperienceType[] }) {
  if (!experiences?.length) return null;

  return (
    <section id="experience" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 pointer-events-none"
        style={{ background: 'var(--grad-brand)', opacity: 0.15, filter: 'blur(40px)' }} />

      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-10 sm:mb-16">
          <div className="section-pill mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career</span>
          </div>
          <h2 className="section-heading">Work Experience</h2>
          <p className="section-sub">Building impactful products and delivering results.</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Gradient vertical line */}
          <div className="absolute left-5 sm:left-7 top-0 bottom-0 w-0.5 rounded-full pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, var(--accent), var(--accent-2), transparent)' }} />

          <div className="space-y-6 sm:space-y-8 pl-14 sm:pl-20">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id || `${exp.company}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative group"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[37px] sm:-left-[49px] top-5 z-10">
                  {exp.is_current ? (
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-500 shadow-lg"
                        style={{ boxShadow: '0 0 0 4px rgba(59,130,246,0.2), var(--shadow-glow-sm)' }} />
                      <div className="absolute inset-0 w-4 h-4 rounded-full bg-blue-400 animate-ping opacity-40" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 transition-all duration-300 group-hover:border-blue-400 group-hover:scale-125"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }} />
                  )}
                </div>

                {/* Card */}
                <div
                  className="rounded-2xl p-5 sm:p-6 border transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = 'var(--border-accent)';
                    el.style.boxShadow = 'var(--shadow-glow)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = 'var(--border)';
                    el.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {/* Top accent line (animated in) */}
                  <div className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full rounded-t-[var(--radius)] transition-all duration-500"
                    style={{ background: 'var(--grad-brand)' }} />

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {exp.is_current && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
                            <Zap className="w-2.5 h-2.5" />
                            Current
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-xl font-extrabold group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm font-bold" style={{ color: 'var(--text-sub)' }}>{exp.company}</span>
                        {exp.company_url && (
                          <a href={exp.company_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs flex items-center gap-0.5 transition-colors hover:text-[var(--accent)]"
                            style={{ color: 'var(--text-muted)' }}>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="text-xs font-mono space-y-1 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                        <span>{exp.period || `${exp.start_date} - ${exp.end_date}`}</span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-sub)' }}>{exp.description}</p>
                  )}

                  {exp.responsibilities?.length > 0 && (
                    <ul className="space-y-1.5 mb-3">
                      {exp.responsibilities.map((r, ri) => (
                        <li key={ri} className="flex items-start gap-2 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                          <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                      {exp.technologies.map((t, ti) => <span key={ti} className="tag">{t}</span>)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
