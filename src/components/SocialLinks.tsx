import { motion } from 'motion/react';
import { Github, Linkedin, Twitter, Youtube, Globe, Share2, ExternalLink, MessageSquare } from 'lucide-react';
import { SocialLink } from '../types';

function getIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes('github')) return Github;
  if (p.includes('linkedin')) return Linkedin;
  if (p.includes('twitter') || p.includes(' x')) return Twitter;
  if (p.includes('youtube')) return Youtube;
  if (p.includes('discord')) return MessageSquare;
  return Globe;
}

export function SocialLinks({ socialLinks }: { socialLinks: SocialLink[] }) {
  if (!socialLinks?.length) return null;

  return (
    <section id="social-links" className="py-12 sm:py-16 px-4 sm:px-6" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto text-center">
        <div className="pill mb-4 mx-auto w-fit"><Share2 className="w-3.5 h-3.5" /> Connect</div>
        <h2 className="heading mb-8">Find Me Online</h2>

        {/* 2 columns on mobile, flex-wrap on desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3">
          {socialLinks.map((item, i) => {
            const Icon = getIcon(item.platform);
            return (
              <motion.a
                key={item.id || `${item.platform}-${i}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="card flex items-center gap-3 px-4 py-3 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors group-hover:text-blue-500"
                  style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-semibold flex items-center gap-1 group-hover:text-blue-500 transition-colors truncate" style={{ color: 'var(--text)' }}>
                    {item.platform}
                    <ExternalLink className="w-3 h-3 shrink-0" style={{ color: 'var(--text-muted)' }} />
                  </p>
                  {item.username && (
                    <p className="text-[11px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>{item.username}</p>
                  )}
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
