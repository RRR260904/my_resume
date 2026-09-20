import { motion } from 'motion/react';
import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-react';
import { Education as EducationType } from '../types';

export function Education({ education }: { education: EducationType[] }) {
  if (!education?.length) return null;

  return (
    <section id="education" className="py-16 sm:py-24 px-4 sm:px-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="pill mb-3"><GraduationCap className="w-3.5 h-3.5" /> Academic</div>
          <h2 className="heading">Education</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {education.map((edu, i) => (
            <motion.div
              key={edu.id || `${edu.institution}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card p-5 sm:p-6 flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{edu.period || `${edu.start_year || ''} – ${edu.end_year || ''}`}</span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>{edu.degree}</h3>
              {edu.field_of_study && (
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--accent)' }}>{edu.field_of_study}</p>
              )}
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-sub)' }}>{edu.institution}</p>

              {edu.grade && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono w-fit mb-3"
                  style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text-sub)' }}>
                  <Award className="w-3.5 h-3.5 text-emerald-500" /> {edu.grade}
                </div>
              )}

              {edu.description && (
                <p className="text-xs sm:text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>{edu.description}</p>
              )}

              {edu.activities?.length > 0 && (
                <div className="pt-3 border-t mt-auto" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Activities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.activities.map((a, ai) => <span key={ai} className="chip">{a}</span>)}
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
