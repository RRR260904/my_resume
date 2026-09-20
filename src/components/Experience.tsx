import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { Experience as ExperienceType } from '../types';

export function Experience({ experiences }: { experiences: ExperienceType[] }) {
  if (!experiences?.length) return null;

  return (
    <section id="experience" className="py-16 sm:py-24 px-4 sm:px-6" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <div className="pill mb-3"><Briefcase className="w-3.5 h-3.5" /> Career</div>
          <h2 className="heading">Work Experience</h2>
        </div>

        <div className="relative space-y-6 sm:space-y-8 pl-6 sm:pl-10">
          {/* Vertical line */}
          <div className="absolute left-[9px] sm:left-[17px] top-2 bottom-2 w-0.5 rounded-full" style={{ backgroundColor: 'var(--border)' }} />

          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id || `${exp.company}-${i}`}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="relative group"
            >
              {/* Dot */}
              <div
                className="absolute -left-[23px] sm:-left-[31px] top-4 w-4 h-4 rounded-full border-2 transition-transform duration-300 group-hover:scale-125"
                style={
                  exp.is_current
                    ? { borderColor: 'var(--accent)', backgroundColor: 'var(--accent)', boxShadow: '0 0 0 4px var(--accent-light)' }
                    : { borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }
                }
              />

              <div className="card p-4 sm:p-6 group-hover:border-[var(--border-accent)]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text)' }}>
                      {exp.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-sub)' }}>{exp.company}</span>
                      {exp.company_url && (
                        <a href={exp.company_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs flex items-center gap-0.5 transition-colors hover:text-blue-500"
                          style={{ color: 'var(--text-muted)' }}>
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {exp.is_current && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs font-mono space-y-1 shrink-0" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.period || `${exp.start_date} – ${exp.end_date}`}</span>
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
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {exp.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    {exp.technologies.map((t, ti) => <span key={ti} className="chip">{t}</span>)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
