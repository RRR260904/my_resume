import { motion } from 'motion/react';
import { Award, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { Certification } from '../types';

interface CertificationsProps {
  certifications: Certification[];
}

export function Certifications({ certifications }: CertificationsProps) {
  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <section id="certifications" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800/40 text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Certifications & Licenses
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id || `${cert.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-blue-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  {cert.badge_image ? (
                    <img
                      src={cert.badge_image}
                      alt={cert.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700/60"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-center text-blue-400">
                      <Award className="w-6 h-6" />
                    </div>
                  )}

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Verify Credential"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors mb-1">
                  {cert.title}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mb-3">
                  {cert.issuer}
                </p>

                {cert.credential_id && (
                  <div className="inline-block px-2.5 py-1 rounded bg-slate-800/60 text-[11px] font-mono text-slate-400 mb-3">
                    ID: {cert.credential_id}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Issued: {cert.issue_date || 'N/A'}
                    {cert.expiry_date ? ` • Exp: ${cert.expiry_date}` : ''}
                  </span>
                </div>
              </div>

              {cert.skills && cert.skills.length > 0 && (
                <div className="pt-3 border-t border-slate-800/60 flex flex-wrap gap-1">
                  {cert.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/40 text-slate-400 border border-slate-700/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
