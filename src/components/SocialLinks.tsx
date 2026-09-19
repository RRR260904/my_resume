import { motion } from 'motion/react';
import {
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Share2,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { SocialLink } from '../types';

interface SocialLinksProps {
  socialLinks: SocialLink[];
}

function getSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes('github')) return Github;
  if (p.includes('linkedin')) return Linkedin;
  if (p.includes('twitter') || p.includes('x')) return Twitter;
  if (p.includes('youtube')) return Youtube;
  if (p.includes('discord')) return MessageSquare;
  return Globe;
}

export function SocialLinks({ socialLinks }: SocialLinksProps) {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <section id="social-links" className="py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800/40 text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">
          <Share2 className="w-3.5 h-3.5" />
          <span>Connect</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-8">
          Find Me Online
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {socialLinks.map((item, index) => {
            const IconComp = getSocialIcon(item.platform);
            return (
              <motion.a
                key={item.id || `${item.platform}-${index}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-blue-500/50 backdrop-blur-md transition-all group shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 group-hover:bg-blue-950/60 flex items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors">
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1">
                    <span>{item.platform}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
                  </div>
                  {item.username && (
                    <div className="text-[11px] font-mono text-slate-400">
                      {item.username}
                    </div>
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
