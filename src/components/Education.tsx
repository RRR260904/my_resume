import { motion } from 'motion/react';
import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-react';
import { Education as EducationType } from '../types';

interface EducationProps {
  education: EducationType[];
}

export function Education({ education }: EducationProps) {
  if (!education || education.length === 0) {
    return null;
  }

  return (
    <section id="education" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-mono uppercase tracking-widest mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Education
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id || `${edu.institution}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{edu.period || `${edu.start_year || ''} - ${edu.end_year || ''}`}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {edu.degree}
                </h3>
                {edu.field_of_study && (
                  <p className="text-sm font-medium text-blue-600 mb-2">
                    {edu.field_of_study}
                  </p>
                )}
                <p className="text-sm font-semibold text-slate-600 mb-3">
                  {edu.institution}
                </p>

                {edu.grade && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono mb-3">
                    <Award className="w-3.5 h-3.5" />
                    <span>{edu.grade}</span>
                  </div>
                )}

                {edu.description && (
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
                    {edu.description}
                  </p>
                )}
              </div>

              {edu.activities && edu.activities.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    Activities & Honors
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.activities.map((act, aIdx) => (
                      <span
                        key={aIdx}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
