import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { Experience as ExperienceType } from '../types';

interface ExperienceProps {
  experiences: ExperienceType[];
}

export function Experience({ experiences }: ExperienceProps) {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800/40 text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career Path</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Work Experience
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Track record of engineering robust software, leading migrations, and delivering business-critical features.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l border-slate-800/80 ml-4 sm:ml-8 space-y-12">
          {experiences.map((exp, index) => {
            const isFirst = index === 0;
            return (
              <motion.div
                key={exp.id || `${exp.company}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-6 sm:pl-10 group"
              >
                {/* Timeline node */}
                <div
                  className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
                    exp.is_current
                      ? 'border-blue-500 bg-blue-600 shadow-md shadow-blue-500/50'
                      : 'border-slate-700 bg-slate-900 group-hover:border-blue-400'
                  }`}
                />

                <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md group-hover:border-slate-700/80 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-slate-300">
                          {exp.company}
                        </span>
                        {exp.company_url && (
                          <a
                            href={exp.company_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-blue-400 inline-flex items-center gap-0.5 text-xs transition-colors"
                          >
                            <span>Visit</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {exp.is_current && (
                          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                            Current Role
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end text-xs text-slate-400 font-mono space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{exp.period || `${exp.start_date} - ${exp.end_date}`}</span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {exp.description}
                    </p>
                  )}

                  {/* Bullet Responsibilities */}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {exp.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-400">
                          <ArrowRight className="w-3.5 h-3.5 text-blue-400 mt-1 shrink-0" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech stack */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                      {exp.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium text-slate-400 bg-slate-800/60 border border-slate-700/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
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
