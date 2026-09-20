import { motion } from 'motion/react';
import { Award, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { Certification } from '../types';

export function Certifications({ certifications }: { certifications: Certification[] }) {
  if (!certifications?.length) return null;

  return (
    <section id="certifications" className="py-16 sm:py-24 px-4 sm:px-6" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="pill mb-3"><ShieldCheck className="w-3.5 h-3.5" /> Credentials</div>
          <h2 className="heading">Certifications</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.id || `${cert.title}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="card p-5 flex flex-col group"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                {cert.badge_image ? (
                  <img src={cert.badge_image} alt={cert.title} referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border" style={{ borderColor: 'var(--border)' }} />
                ) : (
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                    <Award className="w-6 h-6" />
                  </div>
                )}
                {cert.credential_url && (
                  <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-all shrink-0 hover:bg-[var(--accent-light)] hover:text-blue-500"
                    style={{ color: 'var(--text-muted)' }}>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold mb-1 group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text)' }}>
                {cert.title}
              </h3>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>{cert.issuer}</p>

              {cert.credential_id && (
                <span className="chip text-[10px] mb-2 w-fit">ID: {cert.credential_id}</span>
              )}

              <div className="flex items-center gap-1.5 text-[11px] font-mono mb-3" style={{ color: 'var(--text-muted)' }}>
                <Calendar className="w-3 h-3" />
                <span>{cert.issue_date || 'N/A'}{cert.expiry_date ? ` • ${cert.expiry_date}` : ''}</span>
              </div>

              {cert.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  {cert.skills.map((s, si) => <span key={si} className="chip text-[10px]">{s}</span>)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
