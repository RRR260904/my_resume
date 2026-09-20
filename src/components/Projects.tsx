import { useState, useMemo, useRef, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FolderGit2, ExternalLink, Github, ArrowRight, Star, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const r = cardRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top - r.height / 2) / r.height) * -8,
      y: ((e.clientX - r.left - r.width / 2) / r.width) * 8,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="relative rounded-2xl overflow-hidden flex flex-col h-full group"
      style2={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: hovered ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        borderColor: hovered ? 'var(--border-accent)' : 'var(--border)',
      }}
    >
      {/* Thumbnail — full bleed */}
      {project.thumbnail ? (
        <div className="relative w-full aspect-video overflow-hidden" style={{ background: 'var(--bg-muted)' }}>
          <img
            src={project.thumbnail}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Badges on image */}
          {project.featured && (
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md"
              style={{ background: 'rgba(59,130,246,0.9)', color: '#fff' }}>
              <Star className="w-3 h-3 fill-white" />
              Featured
            </div>
          )}
          {project.status && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium backdrop-blur-md"
              style={{ background: 'rgba(0,0,0,0.5)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' }}>
              {project.status}
            </div>
          )}

          {/* Hover: action buttons revealed */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white backdrop-blur-md"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.live_demo_url && (
              <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white backdrop-blur-md"
                style={{ background: 'rgba(59,130,246,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      ) : (
        /* No image — gradient placeholder */
        <div className="relative w-full aspect-video flex items-center justify-center" style={{ background: 'var(--grad-brand)', opacity: 0.8 }}>
          <Layers className="w-12 h-12 text-white/40" />
        </div>
      )}

      {/* Card body */}
      <div
        className="p-5 flex flex-col flex-1"
        style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}
      >
        {project.category && (
          <span className="text-[11px] font-bold font-mono uppercase tracking-wider mb-1.5" style={{ color: 'var(--accent)' }}>
            {project.category}
          </span>
        )}

        <h3 className="text-base sm:text-lg font-extrabold mb-2 leading-tight group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>
          {project.title}
        </h3>

        <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4 flex-1" style={{ color: 'var(--text-muted)' }}>
          {project.short_description}
        </p>

        {/* Tech tags */}
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((t, i) => <span key={i} className="tag text-[10px]">{t}</span>)}
            {project.technologies.length > 4 && (
              <span className="tag text-[10px]">+{project.technologies.length - 4}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <Link to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold transition-all hover:gap-2"
            style={{ color: 'var(--accent)' }}>
            <span>View Case Study</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          {!project.thumbnail && (
            <div className="flex items-center gap-1">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg transition-all hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
                  style={{ color: 'var(--text-muted)' }}>
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.live_demo_url && (
                <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg transition-all hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-muted)' }}>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  if (!projects?.length) return null;

  const categories = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => { if (p.category?.trim()) s.add(p.category.trim()); });
    return ['All', ...Array.from(s)];
  }, [projects]);

  const [active, setActive] = useState('All');
  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [projects, active]
  );

  return (
    <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Decorative blobs */}
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none opacity-5"
        style={{ background: 'var(--grad-brand)', filter: 'blur(80px)' }} />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-10 sm:mb-14">
          <div className="section-pill mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Portfolio</span>
          </div>
          <h2 className="section-heading">Projects & Work</h2>
          <p className="section-sub">Real-world applications and solutions I've engineered.</p>
        </div>

        {categories.length > 2 && (
          <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 border"
                style={active === cat
                  ? { background: 'var(--grad-brand)', color: '#fff', borderColor: 'transparent', boxShadow: '0 4px 15px rgba(59,130,246,0.35)' }
                  : { background: 'var(--bg-card)', color: 'var(--text-muted)', borderColor: 'var(--border)' }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence>
            {filtered.map((project, i) => (
              <motion.div
                layout
                key={project.id || project.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex"
              >
                <div
                  className="w-full rounded-2xl overflow-hidden flex flex-col border transition-all duration-300 group"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-accent)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-glow)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  <ProjectCard project={project} index={i} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
