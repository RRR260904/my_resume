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
              className="card overflow-hidden group"
            >
              {/* Badge image — full width banner on top */}
              {cert.badge_image ? (
                <div className="w-full h-36 sm:h-40 overflow-hidden relative" style={{ backgroundColor: 'var(--bg-muted)' }}>
                  <img
                    src={cert.badge_image}
                    alt={cert.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
              ) : (
                /* No image — icon placeholder */
                <div className="w-full h-24 sm:h-28 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--accent-light)' }}>
                  <Award className="w-12 h-12" style={{ color: 'var(--accent)', opacity: 0.5 }} />
                </div>
              )}

              {/* Card content */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm sm:text-base font-bold group-hover:text-blue-500 transition-colors leading-tight" style={{ color: 'var(--text)' }}>
                    {cert.title}
                  </h3>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                      className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0 transition-all hover:bg-[var(--accent-light)]"
                      style={{ color: 'var(--text-muted)' }} title="Verify">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>{cert.issuer}</p>

                {cert.credential_id && (
                  <span className="chip text-[10px] mb-2 inline-block">ID: {cert.credential_id}</span>
                )}

                <div className="flex items-center gap-1.5 text-[11px] font-mono mb-3" style={{ color: 'var(--text-muted)' }}>
                  <Calendar className="w-3 h-3" />
                  <span>{cert.issue_date || 'N/A'}{cert.expiry_date ? ` • Exp: ${cert.expiry_date}` : ''}</span>
                </div>

                {cert.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    {cert.skills.map((s, si) => <span key={si} className="chip text-[10px]">{s}</span>)}
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
